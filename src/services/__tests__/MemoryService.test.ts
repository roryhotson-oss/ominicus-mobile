import { appendMemoryToPrompt, appendSummaryToMemory, buildMemorySection } from '../MemoryService'

jest.mock('@database', () => ({
  messageDatabase: { getMessagesByTopicId: jest.fn().mockResolvedValue([]) }
}))

jest.mock('@/services/AssistantService', () => ({
  assistantService: { getAssistant: jest.fn().mockResolvedValue(null) },
  getDefaultModel: jest.fn().mockReturnValue({})
}))

jest.mock('@/services/TopicService', () => ({
  topicService: { getTopic: jest.fn().mockResolvedValue(null) }
}))

jest.mock('@/services/ProviderService', () => ({
  getAssistantProvider: jest.fn().mockResolvedValue({})
}))

jest.mock('@/services/StreamProcessingService', () => ({
  createStreamProcessor: jest.fn().mockReturnValue({})
}))

jest.mock('@/aiCore/index_new', () => jest.fn())

jest.mock('@/services/LoggerService', () => ({
  loggerService: {
    withContext: jest.fn().mockReturnValue({ debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() })
  }
}))

describe('buildMemorySection', () => {
  it('wraps memory content in tagged section', () => {
    const section = buildMemorySection('User prefers concise answers')
    expect(section).toContain('[ominicus-memory]')
    expect(section).toContain('[/ominicus-memory]')
    expect(section).toContain('User prefers concise answers')
  })

  it('trims surrounding whitespace from memory content', () => {
    const section = buildMemorySection('  spaced  ')
    expect(section).toContain('spaced')
    expect(section).not.toContain('  spaced  ')
  })
})

describe('appendMemoryToPrompt', () => {
  it('returns prompt unchanged when memory is empty', () => {
    expect(appendMemoryToPrompt('You are helpful', '')).toBe('You are helpful')
    expect(appendMemoryToPrompt('You are helpful', '   ')).toBe('You are helpful')
  })

  it('returns memory section alone when prompt is empty', () => {
    const result = appendMemoryToPrompt('', 'User likes tea')
    expect(result).toContain('[ominicus-memory]')
    expect(result).toContain('User likes tea')
  })

  it('combines prompt and memory with separation', () => {
    const result = appendMemoryToPrompt('You are helpful', 'User likes tea')
    expect(result).toBe('You are helpful\n\n' + buildMemorySection('User likes tea'))
  })
})

describe('appendSummaryToMemory', () => {
  it('appends summary below existing memory', () => {
    expect(appendSummaryToMemory('Fact A', 'Fact B')).toBe('Fact A\nFact B')
  })

  it('returns summary alone when memory is empty', () => {
    expect(appendSummaryToMemory('', 'Fact B')).toBe('Fact B')
  })

  it('returns memory alone when summary is empty', () => {
    expect(appendSummaryToMemory('Fact A', '')).toBe('Fact A')
  })
})
