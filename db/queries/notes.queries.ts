import { desc, eq } from 'drizzle-orm'

import { loggerService } from '@/services/LoggerService'
import type { Note } from '@/types/note'

import { db } from '..'
import { transformDbToNote, transformNoteToDb } from '../mappers/notes.mapper'
import { notes } from '../schema/notes'

const logger = loggerService.withContext('DataBase Notes')

export async function upsertNote(note: Note): Promise<Note> {
  try {
    const dbRecord = transformNoteToDb(note)
    const results = await db
      .insert(notes)
      .values(dbRecord)
      .onConflictDoUpdate({
        target: notes.id,
        set: dbRecord
      })
      .returning()
    return transformDbToNote(results[0])
  } catch (error) {
    logger.error('Error upserting note:', error)
    throw error
  }
}

export async function deleteNoteById(noteId: string): Promise<void> {
  try {
    await db.delete(notes).where(eq(notes.id, noteId))
  } catch (error) {
    logger.error(`Error deleting note with ID ${noteId}:`, error)
    throw error
  }
}

export async function getNoteById(noteId: string): Promise<Note | null> {
  try {
    const results = await db.select().from(notes).where(eq(notes.id, noteId))
    if (results.length === 0) {
      return null
    }
    return transformDbToNote(results[0])
  } catch (error) {
    logger.error(`Error getting note with ID ${noteId}:`, error)
    throw error
  }
}

export async function getAllNotes(): Promise<Note[]> {
  try {
    const results = await db.select().from(notes).orderBy(desc(notes.isPinned), desc(notes.updated_at))
    return results.map(transformDbToNote)
  } catch (error) {
    logger.error('Error getting all notes:', error)
    throw error
  }
}
