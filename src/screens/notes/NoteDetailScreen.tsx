import type { RouteProp } from '@react-navigation/native'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

import { HeaderBar, SafeAreaContainer, Text } from '@/componentsV2'
import TextField from '@/componentsV2/base/TextField'
import YStack from '@/componentsV2/layout/YStack'
import { useToast } from '@/hooks/useToast'
import { noteService } from '@/services/NoteService'

type NoteDetailScreenRouteProp = RouteProp<{ NoteDetailScreen: { noteId?: string } }, 'NoteDetailScreen'>

export default function NoteDetailScreen() {
  const { t } = useTranslation()
  const route = useRoute<NoteDetailScreenRouteProp>()
  const navigation = useNavigation<any>()
  const toast = useToast()
  const noteId = route.params?.noteId

  const [content, setContent] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const isDirtyRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    const loadNote = async () => {
      if (!noteId) {
        setIsLoaded(true)
        return
      }
      try {
        const note = await noteService.getNote(noteId)
        if (!cancelled && note) {
          setContent(note.content)
        }
      } catch {
        toast.show(t('common.error_occurred'))
      } finally {
        if (!cancelled) {
          setIsLoaded(true)
        }
      }
    }
    loadNote()
    return () => {
      cancelled = true
    }
  }, [noteId, t, toast])

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async () => {
      if (!isDirtyRef.current || !content.trim()) {
        return
      }
      try {
        if (noteId) {
          await noteService.updateNote(noteId, content)
        } else {
          await noteService.createNote(content)
        }
      } catch {
        toast.show(t('common.error_occurred'))
      }
    })
    return unsubscribe
  }, [navigation, noteId, content, t, toast])

  const handleChangeText = (text: string) => {
    isDirtyRef.current = true
    setContent(text)
  }

  return (
    <SafeAreaContainer className="flex-1">
      <HeaderBar title={noteId ? t('notes.edit_title') : t('notes.new_title')} showBackButton />
      <KeyboardAvoidingView className="flex-1">
        <YStack className="flex-1 gap-2 px-4 pb-4">
          {!isLoaded ? (
            <Text className="text-foreground-secondary text-sm">{t('common.loading')}</Text>
          ) : (
            <TextField className="flex-1 gap-2">
              <TextField.Input
                className="flex-1 rounded-lg px-3 py-3 text-sm"
                placeholder={t('notes.content_placeholder')}
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={handleChangeText}
                autoFocus={!noteId}
              />
            </TextField>
          )}
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  )
}
