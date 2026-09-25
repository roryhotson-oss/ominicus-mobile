import type { Note } from '@/types/note'

export function transformDbToNote(dbRecord: any): Note {
  return {
    id: dbRecord.id,
    title: dbRecord.title ?? '',
    content: dbRecord.content ?? '',
    isPinned: !!dbRecord.isPinned,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at
  }
}

export function transformNoteToDb(note: Note): any {
  return {
    id: note.id,
    title: note.title ?? '',
    content: note.content ?? '',
    isPinned: note.isPinned ? 1 : 0,
    created_at: note.createdAt,
    updated_at: note.updatedAt
  }
}
