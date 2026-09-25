import {
  deleteNoteById as _deleteNoteById,
  getAllNotes as _getAllNotes,
  getNoteById as _getNoteById,
  upsertNote as _upsertNote
} from '@db/queries/notes.queries'

import type { Note } from '@/types/note'

export async function upsertNote(note: Note) {
  return _upsertNote(note)
}

export async function deleteNoteById(noteId: string) {
  return _deleteNoteById(noteId)
}

export async function getNoteById(noteId: string) {
  return _getNoteById(noteId)
}

export async function getAllNotes() {
  return _getAllNotes()
}

export const noteDatabase = {
  upsertNote,
  deleteNoteById,
  getNoteById,
  getAllNotes
}
