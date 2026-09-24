import { extractUrlFromMessage } from '../WebsiteReaderService'

describe('extractUrlFromMessage', () => {
  it('extracts URL and prompt from #https:// message', () => {
    const result = extractUrlFromMessage('#https://example.com/article what is this about?')
    expect(result).toEqual({
      url: 'https://example.com/article',
      prompt: 'what is this about?'
    })
  })

  it('extracts URL without prompt', () => {
    const result = extractUrlFromMessage('#https://example.com')
    expect(result).toEqual({ url: 'https://example.com', prompt: '' })
  })

  it('returns null for plain text', () => {
    expect(extractUrlFromMessage('hello world')).toBeNull()
  })

  it('returns null for URL without # prefix', () => {
    expect(extractUrlFromMessage('https://example.com')).toBeNull()
  })

  it('returns null for # followed by non-URL', () => {
    expect(extractUrlFromMessage('#just a hashtag')).toBeNull()
  })

  it('handles leading whitespace', () => {
    const result = extractUrlFromMessage('   #https://example.com/page summarize')
    expect(result).toEqual({ url: 'https://example.com/page', prompt: 'summarize' })
  })

  it('only matches http and https schemes', () => {
    expect(extractUrlFromMessage('#ftp://example.com/file')).toBeNull()
  })
})
