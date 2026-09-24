import type { ModelMessage } from 'ai'
import { findLast, takeRight } from 'lodash'

import { convertMessagesToSdkMessages } from '@/aiCore/prepareParams'
import type { Assistant } from '@/types/assistant'
import type { Message } from '@/types/message'
import {
  filterAdjacentUserMessaegs,
  filterAfterContextClearMessages,
  filterEmptyMessages,
  filterErrorOnlyMessagesWithRelated,
  filterLastAssistantMessage,
  filterUsefulMessages,
  filterUserRoleStartMessages
} from '@/utils/messageUtils/filters'
import { getMainTextContent } from '@/utils/messageUtils/find'

import { getAssistantSettings, getDefaultModel } from './AssistantService'
import { loggerService } from './LoggerService'
import { preferenceService } from './PreferenceService'
import { estimateTextTokens } from './TokenService'

const logger = loggerService.withContext('ConversationService')

/**
 * Trims messages from the oldest side so the estimated prompt tokens stay
 * within the configured token budget. The last user message is always kept.
 */
export async function trimMessagesToTokenBudget(messages: Message[], tokenBudget: number): Promise<Message[]> {
  if (tokenBudget <= 0 || messages.length === 0) {
    return messages
  }

  const lastUserIndex = findLastIndex(messages, m => m.role === 'user')
  if (lastUserIndex === -1) {
    return messages
  }

  const tokenCache = new Map<string, number>()
  const messageTokens = async (message: Message): Promise<number> => {
    const cached = tokenCache.get(message.id)
    if (cached !== undefined) {
      return cached
    }
    const text = await getMainTextContent(message)
    const tokens = estimateTextTokens(text)
    tokenCache.set(message.id, tokens)
    return tokens
  }

  const lastUserMessage = messages[lastUserIndex]
  const lastUserTokens = await messageTokens(lastUserMessage)

  let keptTokens = lastUserTokens
  const kept: Message[] = [lastUserMessage]

  for (let i = messages.length - 1; i >= 0; i--) {
    if (i === lastUserIndex) {
      continue
    }
    const tokens = await messageTokens(messages[i])
    if (keptTokens + tokens > tokenBudget) {
      continue
    }
    keptTokens += tokens
    kept.unshift(messages[i])
  }

  return kept
}

function findLastIndex<T>(items: T[], predicate: (item: T) => boolean): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (predicate(items[i])) {
      return i
    }
  }
  return -1
}

export class ConversationService {
  /**
   * Applies the filtering pipeline that prepares UI messages for model consumption.
   * This keeps the logic testable and prevents future regressions when the pipeline changes.
   */
  static filterMessagesPipeline(messages: Message[], contextCount: number): Message[] {
    const messagesAfterContextClear = filterAfterContextClearMessages(messages)
    const usefulMessages = filterUsefulMessages(messagesAfterContextClear)
    // Run the error-only filter before trimming trailing assistant responses so the pair is removed together.
    const withoutErrorOnlyPairs = filterErrorOnlyMessagesWithRelated(usefulMessages)
    const withoutTrailingAssistant = filterLastAssistantMessage(withoutErrorOnlyPairs)
    const withoutAdjacentUsers = filterAdjacentUserMessaegs(withoutTrailingAssistant)
    const limitedByContext = takeRight(withoutAdjacentUsers, contextCount + 2)
    const contextClearFiltered = filterAfterContextClearMessages(limitedByContext)
    const nonEmptyMessages = filterEmptyMessages(contextClearFiltered)
    const userRoleStartMessages = filterUserRoleStartMessages(nonEmptyMessages)
    return userRoleStartMessages
  }

  static async prepareMessagesForModel(
    messages: Message[],
    assistant: Assistant
  ): Promise<{ modelMessages: ModelMessage[]; uiMessages: Message[] }> {
    const { contextCount } = getAssistantSettings(assistant)
    // This logic is extracted from the original ApiService.fetchChatCompletion
    // const contextMessages = filterContextMessages(messages)
    const lastUserMessage = findLast(messages, m => m.role === 'user')

    if (!lastUserMessage) {
      return {
        modelMessages: [],
        uiMessages: []
      }
    }

    const uiMessagesFromPipeline = ConversationService.filterMessagesPipeline(messages, contextCount)

    const tokenBudget = await preferenceService.get('chat.context_token_budget')
    const uiMessagesAfterBudget = await trimMessagesToTokenBudget(uiMessagesFromPipeline, tokenBudget)

    logger.debug('uiMessagesFromPipeline', uiMessagesAfterBudget)

    // Fallback: ensure at least the last user message is present to avoid empty payloads
    let uiMessages = uiMessagesAfterBudget
    if ((!uiMessages || uiMessages.length === 0) && lastUserMessage) {
      uiMessages = [lastUserMessage]
    }

    return {
      modelMessages: await convertMessagesToSdkMessages(uiMessages, assistant.model || getDefaultModel()),
      uiMessages
    }
  }

  static needsWebSearch(assistant: Assistant): boolean {
    return !!assistant.webSearchProviderId
  }

  static needsKnowledgeSearch(_assistant: Assistant): boolean {
    return false
    // return !isEmpty(assistant.knowledge_bases)
  }
}
