import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, View } from 'react-native'

import {
  Container,
  DrawerGestureWrapper,
  HeaderBar,
  presentDialog,
  SafeAreaContainer,
  SearchInput,
  Text
} from '@/componentsV2'
import { Menu, Pin, PinOff, Plus, Trash2 } from '@/componentsV2/icons/LucideIcon'
import XStack from '@/componentsV2/layout/XStack'
import YStack from '@/componentsV2/layout/YStack'
import { useSearch } from '@/hooks/useSearch'
import { useToast } from '@/hooks/useToast'
import { noteService } from '@/services/NoteService'
import type { Note } from '@/types/note'

export default function NotesScreen() {
  const { t } = useTranslation()
  const navigation = useNavigation<any>()
  const toast = useToast()
  const [notes, setNotes] = useState<Note[]>([])

  const refreshNotes = useCallback(async () => {
    try {
      const allNotes = await noteService.getAllNotes()
      setNotes(allNotes)
    } catch {
      toast.show(t('common.error_occurred'))
    }
  }, [t, toast])

  useEffect(() => {
    refreshNotes()
    const unsubscribe = navigation.addListener('focus', refreshNotes)
    return unsubscribe
  }, [refreshNotes, navigation])

  const {
    searchText,
    setSearchText,
    filteredItems: filteredNotes
  } = useSearch(
    notes,
    useCallback((note: Note) => [note.title, note.content], [])
  )

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  const handleCreateNote = () => {
    navigation.navigate('NoteDetailScreen', { noteId: undefined })
  }

  const handleOpenNote = (note: Note) => {
    navigation.navigate('NoteDetailScreen', { noteId: note.id })
  }

  const handleTogglePin = async (note: Note) => {
    try {
      await noteService.togglePin(note.id, !note.isPinned)
      await refreshNotes()
    } catch {
      toast.show(t('common.error_occurred'))
    }
  }

  const handleDeleteNote = (note: Note) => {
    presentDialog('warning', {
      title: t('notes.delete.title'),
      content: t('notes.delete.description', { title: note.title || t('notes.untitled') }),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      showCancel: true,
      onConfirm: async () => {
        try {
          await noteService.deleteNote(note.id)
          await refreshNotes()
        } catch {
          toast.show(t('common.error_occurred'))
        }
      }
    })
  }

  const renderNoteItem = ({ item }: { item: Note }) => (
    <Pressable
      className="mb-2.5 rounded-2xl bg-neutral-100 px-4 py-3.5 active:opacity-80 dark:bg-neutral-800"
      onPress={() => handleOpenNote(item)}>
      <YStack className="gap-1">
        <XStack className="items-center justify-between gap-2">
          <Text className="flex-1 text-base font-bold" numberOfLines={1} ellipsizeMode="tail">
            {item.title || t('notes.untitled')}
          </Text>
          {item.isPinned && <Pin size={14} className="text-foreground-secondary shrink-0" />}
        </XStack>
        <Text className="text-foreground-secondary text-sm" numberOfLines={2} ellipsizeMode="tail">
          {item.content}
        </Text>
        <XStack className="mt-1 items-center justify-between">
          <Text className="text-foreground-secondary text-xs">{new Date(item.updatedAt).toLocaleString()}</Text>
          <XStack className="gap-4">
            <Pressable hitSlop={8} onPress={() => handleTogglePin(item)}>
              {item.isPinned ? (
                <PinOff size={18} className="text-foreground-secondary" />
              ) : (
                <Pin size={18} className="text-foreground-secondary" />
              )}
            </Pressable>
            <Pressable hitSlop={8} onPress={() => handleDeleteNote(item)}>
              <Trash2 size={18} className="text-red-500" />
            </Pressable>
          </XStack>
        </XStack>
      </YStack>
    </Pressable>
  )

  return (
    <SafeAreaContainer className="pb-0">
      <DrawerGestureWrapper>
        <View collapsable={false} className="flex-1">
          <HeaderBar
            title={t('notes.title')}
            leftButton={{
              icon: <Menu size={24} />,
              onPress: handleMenuPress
            }}
            rightButtons={[
              {
                icon: <Plus size={24} />,
                onPress: handleCreateNote
              }
            ]}
          />
          <Container className="gap-2.5 py-0">
            <SearchInput placeholder={t('notes.search_placeholder')} value={searchText} onChangeText={setSearchText} />
            <FlatList
              data={filteredNotes}
              keyExtractor={item => item.id}
              renderItem={renderNoteItem}
              ListEmptyComponent={
                <YStack className="mt-16 items-center gap-2">
                  <Text className="text-foreground-secondary text-sm">{t('notes.empty')}</Text>
                </YStack>
              }
              showsVerticalScrollIndicator={false}
            />
          </Container>
        </View>
      </DrawerGestureWrapper>
    </SafeAreaContainer>
  )
}
