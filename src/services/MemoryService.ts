import { messageDatabase } from '@database'
import { isEmpty, takeRight } from 'lodash'

import AiProviderNew from '@/aiCore/index_new'
import type { AiSdkMiddlewareConfig } from '@/aiCore/middleware/AiSdkMiddlewareBuilder'
import type { Assistant } from '@/types/assistant'
import { getMainTextContent } from '@/utils/messageUtils/find'

import { assistantService, getDefaultModel } from './AssistantService'
import { getAssistantProvider } from './ProviderService'
import type { StreamProcessorCallbacks } from './StreamProcessingService'
import { createStreamProcessor } from './StreamProcessingService'
import { topicService } from './TopicService'

const MEMORY_PROMPT_TEMPLATE = `You maintain a long-term memory note for an AI assistant. The note stores durable facts and preferences learned from past conversations that should be silently recalled in future chats.

Current memory note:
{MEMORY}

New conversation summary to merge:
{SUMMARY}

Merge the new information into the memory note. Keep it concise, factual, and written as bullet points. Drop stale or contradicted details, keep everything else, and return only the updated note.`

const SUMMARY_PROMPT = `Summarize the key facts, decisions, user preferences, and unresolved questions from the following conversation. Focus on information worth remembering for future chats with the same user. Return a concise bullet-point summary only.

Conversation:
{CONVERSATION}`

export const MEMORY_SYSTEM_PROMPT_TAG = 'ominicus-memory'

export function buildMemorySection(memory: string): string {
  return `[${MEMORY_SYSTEM_PROMPT_TAG}]\nLong-term memory recalled from previous conversations:\n${memory.trim()}\n[/${MEMORY_SYSTEM_PROMPT_TAG}]`
}

export function appendMemoryToPrompt(prompt: string, memory: string): string {
  if (!memory.trim()) {
    return prompt
  }
  const section = buildMemorySection(memory)
  return prompt ? `${prompt}\n\n${section}` : section
}

export function appendSummaryToMemory(memory: string, summary: string): string {
  const merged = [memory.trim(), summary.trim()].filter(Boolean).join('\n')
  return merged
}

class MemoryService {
  async getMemory(assistantId: string): Promise<string> {
    const assistant = await assistantService.getAssistant(assistantId)
    return assistant?.memory ?? ''
  }

  async updateMemory(assistantId: string, memory: string): Promise<void> {
    await assistantService.updateAssistant(assistantId, { memory })
  }

  async buildConversationSummary(topicId: string): Promise<string> {
    const topic = await topicService.getTopic(topicId)
    if (!topic) {
      throw new Error(`Topic with ID ${topicId} not found`)
    }

    const messages = await messageDatabase.getMessagesByTopicId(topicId)
    if (isEmpty(messages)) {
      return ''
    }

    const quickAssistant = await assistantService.getAssistant('quick')
    if (!quickAssistant) {
      throw new Error('Quick assistant not found')
    }

    const contextMessages = takeRight(messages, 20)
    const structuredMessages = await Promise.all(
      contextMessages.map(async message => {
        const mainText = await getMainTextContent(message)
        return `${message.role}: ${mainText}`
      })
    )
    const conversation = structuredMessages.join('\n\n')

    const summary = await this.runQuickPrompt(quickAssistant, SUMMARY_PROMPT.replace('{CONVERSATION}', conversation))

    return summary.trim()
  }

  async mergeSummaryIntoMemory(assistantId: string, summary: string): Promise<string> {
    const currentMemory = await this.getMemory(assistantId)
    if (!summary.trim()) {
      return currentMemory
    }

    const quickAssistant = await assistantService.getAssistant('quick')
    if (!quickAssistant) {
      return appendSummaryToMemory(currentMemory, summary)
    }

    let merged: string
    try {
      merged = await this.runQuickPrompt(
        quickAssistant,
        MEMORY_PROMPT_TEMPLATE.replace('{MEMORY}', currentMemory || '(empty)').replace('{SUMMARY}', summary)
      )
    } catch {
      return appendSummaryToMemory(currentMemory, summary)
    }

    if (!merged.trim()) {
      return appendSummaryToMemory(currentMemory, summary)
    }
    return merged.trim()
  }

  async rememberTopic(topicId: string): Promise<string> {
    const topic = await topicService.getTopic(topicId)
    if (!topic) {
      throw new Error(`Topic with ID ${topicId} not found`)
    }

    const summary = await this.buildConversationSummary(topicId)
    if (!summary) {
      return await this.getMemory(topic.assistantId)
    }

    const updatedMemory = await this.mergeSummaryIntoMemory(topic.assistantId, summary)
    await this.updateMemory(topic.assistantId, updatedMemory)
    return updatedMemory
  }

  private async runQuickPrompt(quickAssistant: Assistant, prompt: string): Promise<string> {
    const quickAssistantModel = quickAssistant.defaultModel || getDefaultModel()
    const assistantForProvider = quickAssistant.model
      ? quickAssistant
      : { ...quickAssistant, model: quickAssistantModel }
    const assistantForRequest = quickAssistant.defaultModel
      ? assistantForProvider
      : { ...assistantForProvider, defaultModel: quickAssistantModel }
    const provider = await getAssistantProvider(assistantForProvider)

    const AI = new AiProviderNew(quickAssistantModel, provider)

    const aiSdkParams = {
      system: quickAssistant.prompt,
      prompt
    }
    const modelId = quickAssistantModel.id

    const callbacks: StreamProcessorCallbacks = {}
    const streamProcessorCallbacks = createStreamProcessor(callbacks)

    const middlewareConfig: AiSdkMiddlewareConfig = {
      streamOutput: false,
      onChunk: streamProcessorCallbacks,
      model: quickAssistantModel,
      provider: provider,
      enableReasoning: false,
      isPromptToolUse: false,
      isSupportedToolUse: false,
      isImageGenerationEndpoint: false,
      enableWebSearch: false,
      enableGenerateImage: false,
      enableUrlContext: false,
      mcpTools: []
    }

    const result = await AI.completions(modelId, aiSdkParams, {
      ...middlewareConfig,
      assistant: assistantForRequest,
      topicId: '',
      callType: 'summary'
    })

    return result.getText()
  }
}

export const memoryService = new MemoryService()
