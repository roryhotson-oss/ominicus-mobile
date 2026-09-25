import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { createUpdateTimestamps } from './columnHelpers'

export const notes = sqliteTable(
  'notes',
  {
    id: text('id').notNull().unique().primaryKey(),
    title: text('title').notNull().default(''),
    content: text('content').notNull().default(''),
    isPinned: integer('isPinned', { mode: 'boolean' }),
    ...createUpdateTimestamps
  },
  table => [
    index('idx_notes_updated_at').on(table.updated_at),
    index('idx_notes_is_pinned_updated_at').on(table.isPinned, table.updated_at)
  ]
)
