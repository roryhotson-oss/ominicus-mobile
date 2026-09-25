import { noteDatabase } from '@database'

import { uuid } from '@/utils'

import { loggerService } from './LoggerService'

const logger = loggerService.withContext('NoteService')

export function deriveNoteTitle(content: string, maxLength = 40): string {
  const firstLine = (content || '').split('\n').find(line => line.trim().length > 0) || ''
  const title = firstLine.trim()
  if (title.length <= maxLength) {
    return title
  }
  return title.slice(0, maxLength).trimEnd() + '…'
}

export class NoteService {
  async createNote(content: string): Promise<string | null> {
    try {
      const id = this.generateNoteId()
      const now = Date.now()
      await noteDatabase.upsertNote({
        id,
        title: deriveNoteTitle(content),
        content,
        isPinned: false,
        createdAt: now,
        updatedAt: now
      })
      return id
    } catch (error) {
      logger.error('Failed to create note', error as Error)
      return null
    }
  }

  async updateNote(id: string, content: string): Promise<void> {
    try {
      const existing = await noteDatabase.getNoteById(id)
      if (!existing) {
        throw new Error(`Note with ID ${id} not found`)
      }
      await noteDatabase.upsertNote({
        ...existing,
        title: deriveNoteTitle(content),
        content,
        updatedAt: Date.now()
      })
    } catch (error) {
      logger.error('Failed to update note', error as Error)
      throw error
    }
  }

  async togglePin(id: string, isPinned: boolean): Promise<void> {
    try {
      const existing = await noteDatabase.getNoteById(id)
      if (!existing) {
        throw new Error(`Note with ID ${id} not found`)
      }
      await noteDatabase.upsertNote({
        ...existing,
        isPinned,
        updatedAt: Date.now()
      })
    } catch (error) {
      logger.error('Failed to pin note', error as Error)
      throw error
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      await noteDatabase.deleteNoteById(id)
    } catch (error) {
      logger.error('Failed to delete note', error as Error)
      throw error
    }
  }

  async getNote(id: string) {
    return noteDatabase.getNoteById(id)
  }

  async getAllNotes() {
    return noteDatabase.getAllNotes()
  }

  private generateNoteId(): string {
    return uuid()
  }
}

export const noteService = new NoteService()
