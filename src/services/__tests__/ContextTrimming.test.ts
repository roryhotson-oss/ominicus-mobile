import type { Message } from '@/types/message'

import { trimMessagesToTokenBudget } from '../ConversationService'

jest.mock('@/services/PreferenceService', () => ({
  preferenceService: { get: jest.fn().mockResolvedValue(0) }
}))

jest.mock('@/aiCore/prepareParams', () => ({
  convertMessagesToSdkMessages: jest.fn().mockResolvedValue([])
}))

jest.mock('@/services/AssistantService', () => ({
  getAssistantSettings: jest.fn().mockReturnValue({ contextCount: -1 }),
  getDefaultModel: jest.fn().mockReturnValue({})
}))

jest.mock('@/services/TokenService', () => ({
  estimateTextTokens: jest.fn((text: string) => Math.ceil((text || '').length / 4))
}))

jest.mock('@/utils/messageUtils/find', () => ({
  getMainTextContent: jest.fn(async (message: any) => message.content ?? '')
}))

jest.mock('@/utils/messageUtils/filters', () => ({
  filterAfterContextClearMessages: jest.fn((msgs: Message[]) => msgs),
  filterUsefulMessages: jest.fn((msgs: Message[]) => msgs),
  filterErrorOnlyMessagesWithRelated: jest.fn((msgs: Message[]) => msgs),
  filterLastAssistantMessage: jest.fn((msgs: Message[]) => msgs),
  filterAdjacentUserMessaegs: jest.fn((msgs: Message[]) => msgs),
  filterEmptyMessages: jest.fn((msgs: Message[]) => msgs),
  filterUserRoleStartMessages: jest.fn((msgs: Message[]) => msgs)
}))

jest.mock('@/services/LoggerService', () => ({
  loggerService: {
    withContext: jest.fn().mockReturnValue({ debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() })
  }
}))

function makeMessage(id: string, role: 'user' | 'assistant', text: string): Message {
  return {
    id,
    role,
    content: text,
    assistantId: 'a1',
    topicId: 't1',
    createdAt: 1,
    updatedAt: 1,
    status: 'success',
    blocks: []
  } as unknown as Message
}

describe('trimMessagesToTokenBudget', () => {
  it('returns messages unchanged when budget is 0 (disabled)', async () => {
    const messages = [makeMessage('1', 'user', 'hello there friend'), makeMessage('2', 'assistant', 'hi')]
    const result = await trimMessagesToTokenBudget(messages, 0)
    expect(result).toBe(messages)
  })

  it('keeps the last user message even when it alone exceeds the budget', async () => {
    const messages = [
      makeMessage('1', 'user', 'a'.repeat(100)),
      makeMessage('2', 'user', 'b'.repeat(400))
    ]
    const result = await trimMessagesToTokenBudget(messages, 10)
    expect(result.map(m => m.id)).toEqual(['2'])
  })

  it('trims older messages that do not fit the budget', async () => {
    const messages = [
      makeMessage('1', 'user', 'a'.repeat(20)),
      makeMessage('2', 'assistant', 'b'.repeat(20)),
      makeMessage('3', 'user', 'c'.repeat(20))
    ]
    const result = await trimMessagesToTokenBudget(messages, 6)
    expect(result.map(m => m.id)).toEqual(['3'])
  })

  it('keeps messages that fit within the budget in original order', async () => {
    const messages = [
      makeMessage('1', 'user', 'aaaa'),
      makeMessage('2', 'assistant', 'bbbb'),
      makeMessage('3', 'user', 'cccc')
    ]
    const result = await trimMessagesToTokenBudget(messages, 3)
    expect(result.map(m => m.id)).toEqual(['1', '2', '3'])
  })

  it('greedily keeps newer messages first when budget is partial', async () => {
    const messages = [
      makeMessage('1', 'user', 'a'.repeat(16)),
      makeMessage('2', 'assistant', 'bbbb'),
      makeMessage('3', 'user', 'cccc')
    ]
    const result = await trimMessagesToTokenBudget(messages, 2)
    expect(result.map(m => m.id)).toEqual(['2', '3'])
  })
})
