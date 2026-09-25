import { noteDatabase } from '@database'

import { deriveNoteTitle, NoteService, noteService } from '../NoteService'

jest.mock('@database', () => ({
  noteDatabase: {
    upsertNote: jest.fn().mockResolvedValue(undefined),
    deleteNoteById: jest.fn().mockResolvedValue(undefined),
    getNoteById: jest.fn().mockResolvedValue(null),
    getAllNotes: jest.fn().mockResolvedValue([])
  }
}))

jest.mock('@/utils', () => ({
  uuid: jest.fn(() => 'test-uuid')
}))

jest.mock('@/services/LoggerService', () => ({
  loggerService: {
    withContext: jest.fn().mockReturnValue({ debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() })
  }
}))

describe('deriveNoteTitle', () => {
  it('uses the first non-empty line as the title', () => {
    expect(deriveNoteTitle('First line\nSecond line')).toBe('First line')
  })

  it('skips leading blank lines', () => {
    expect(deriveNoteTitle('\n\n  \nActual start\nmore')).toBe('Actual start')
  })

  it('truncates long titles with an ellipsis', () => {
    const title = deriveNoteTitle('x'.repeat(50))
    expect(title.length).toBeLessThanOrEqual(41)
    expect(title.endsWith('…')).toBe(true)
  })

  it('keeps short titles untouched', () => {
    expect(deriveNoteTitle('short note')).toBe('short note')
  })

  it('returns empty string for empty content', () => {
    expect(deriveNoteTitle('')).toBe('')
    expect(deriveNoteTitle('\n \n')).toBe('')
  })
})

describe('NoteService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('is a singleton export', () => {
    expect(noteService).toBeInstanceOf(NoteService)
  })

  it('createNote persists a new note with derived title', async () => {
    const id = await noteService.createNote('My first line\nbody')
    expect(id).toBe('test-uuid')
    expect(noteDatabase.upsertNote).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-uuid',
        title: 'My first line',
        content: 'My first line\nbody',
        isPinned: false
      })
    )
  })

  it('createNote returns null when the database fails', async () => {
    ;(noteDatabase.upsertNote as jest.Mock).mockRejectedValueOnce(new Error('db down'))
    const id = await noteService.createNote('content')
    expect(id).toBeNull()
  })

  it('updateNote merges content and refreshes the title', async () => {
    const now = Date.now()
    ;(noteDatabase.getNoteById as jest.Mock).mockResolvedValueOnce({
      id: 'n1',
      title: 'Old title',
      content: 'old content',
      isPinned: false,
      createdAt: now,
      updatedAt: now
    })
    await noteService.updateNote('n1', 'New first line\nnew body')
    expect(noteDatabase.upsertNote).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'n1',
        title: 'New first line',
        content: 'New first line\nnew body',
        isPinned: false
      })
    )
  })

  it('updateNote throws when the note does not exist', async () => {
    ;(noteDatabase.getNoteById as jest.Mock).mockResolvedValueOnce(null)
    await expect(noteService.updateNote('missing', 'content')).rejects.toThrow('not found')
  })

  it('togglePin flips the pinned flag', async () => {
    const now = Date.now()
    ;(noteDatabase.getNoteById as jest.Mock).mockResolvedValueOnce({
      id: 'n1',
      title: 'Title',
      content: 'content',
      isPinned: false,
      createdAt: now,
      updatedAt: now
    })
    await noteService.togglePin('n1', true)
    expect(noteDatabase.upsertNote).toHaveBeenCalledWith(expect.objectContaining({ id: 'n1', isPinned: true }))
  })

  it('deleteNote delegates to the database', async () => {
    await noteService.deleteNote('n1')
    expect(noteDatabase.deleteNoteById).toHaveBeenCalledWith('n1')
  })
})
