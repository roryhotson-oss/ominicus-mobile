import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

import TextField from '@/componentsV2/base/TextField'
import { presentPromptDetailSheet } from '@/componentsV2/features/Sheet/PromptDetailSheet'
import YStack from '@/componentsV2/layout/YStack'
import type { Assistant } from '@/types/assistant'

interface MemoryTabContentProps {
  assistant: Assistant
  updateAssistant: (assistant: Assistant) => void
}

export function MemoryTabContent({ assistant, updateAssistant }: MemoryTabContentProps) {
  const { t } = useTranslation()
  const [memory, setMemory] = useState(assistant?.memory || '')

  useEffect(() => {
    setMemory(assistant?.memory || '')
  }, [assistant])

  return (
    <MotiView
      style={{ flex: 1 }}
      from={{ opacity: 0, translateY: 10 }}
      animate={{
        translateY: 0,
        opacity: 1
      }}
      exit={{ opacity: 1, translateY: -10 }}
      transition={{ type: 'timing' }}>
      <KeyboardAvoidingView className="h-full flex-1">
        <YStack className="flex-1 gap-4">
          <TextField className="flex-1 gap-2">
            <TextField.Label className="text-foreground-secondary text-sm font-medium">
              {t('assistants.memory.title')}
            </TextField.Label>
            <Pressable
              className="flex-1"
              onPress={() => {
                presentPromptDetailSheet(
                  memory,
                  updatedMemory => setMemory(updatedMemory),
                  t('assistants.memory.title'),
                  updatedMemory => {
                    if (updatedMemory !== (assistant.memory || '')) {
                      updateAssistant({ ...assistant, memory: updatedMemory })
                    }
                  }
                )
              }}>
              <TextField.Input
                editable={false}
                pointerEvents="none"
                className="flex-1 rounded-lg px-3 py-3 text-sm"
                placeholder={t('assistants.memory.placeholder')}
                multiline
                numberOfLines={20}
                textAlignVertical="top"
                value={memory}
              />
            </Pressable>
          </TextField>
        </YStack>
      </KeyboardAvoidingView>
    </MotiView>
  )
}
