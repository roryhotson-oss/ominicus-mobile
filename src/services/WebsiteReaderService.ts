import { loggerService } from '@/services/LoggerService'

const logger = loggerService.withContext('WebsiteReaderService')

const URL_PREFIX = '#'
const MAX_CONTENT_LENGTH = 100_000

export interface ExtractedUrl {
  url: string
  prompt: string
}

export function extractUrlFromMessage(text: string): ExtractedUrl | null {
  const trimmed = text.trim()
  if (!trimmed.startsWith(URL_PREFIX)) {
    return null
  }
  const match = trimmed.slice(1).match(/^(https?:\/\/\S+)\s*([\s\S]*)$/)
  if (!match) {
    return null
  }
  return { url: match[1], prompt: match[2].trim() }
}

function htmlToText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr|section|article)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function readWebsite(url: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15_000)
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; Ominicus/1.0)'
      }
    })
    clearTimeout(timeout)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const html = await response.text()
    const text = htmlToText(html)
    if (!text) {
      throw new Error('Empty content')
    }
    logger.info(`Read website ${url}: ${text.length} chars`)
    return text.slice(0, MAX_CONTENT_LENGTH)
  } catch (error) {
    logger.error(`Failed to read website ${url}:`, error as Error)
    throw error
  }
}
