import { Switch } from 'heroui-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

import { Container, Group, GroupTitle, HeaderBar, SafeAreaContainer, Text, XStack, YStack } from '@/componentsV2'
import TextField from '@/componentsV2/base/TextField'
import { LanguageDropdown } from '@/componentsV2/features/SettingsScreen/general/LanguageDropdown'
import { ThemeDropdown } from '@/componentsV2/features/SettingsScreen/general/ThemeDropdown'
import { usePreference } from '@/hooks/usePreference'

export default function GeneralSettingsScreen() {
  const { t } = useTranslation()
  const [developerMode, setDeveloperMode] = usePreference('app.developer_mode')
  const [autoScroll, setAutoScroll] = usePreference('chat.auto_scroll')
  const [contextTokenBudget, setContextTokenBudget] = usePreference('chat.context_token_budget')

  return (
    <SafeAreaContainer className="flex-1">
      <HeaderBar title={t('settings.general.title')} />
      <Container>
        <YStack className="flex-1 gap-6">
          {/* Display settings */}
          <YStack className="gap-2">
            <GroupTitle>{t('settings.general.display.title')}</GroupTitle>
            <Group>
              <XStack className="items-center justify-between p-4">
                <Text className="text-lg">{t('settings.general.theme.title')}</Text>
                <ThemeDropdown />
              </XStack>
            </Group>
          </YStack>

          {/* General settings */}
          <YStack className="gap-2">
            <GroupTitle>{t('settings.general.title')}</GroupTitle>
            <Group>
              <XStack className="items-center justify-between p-4">
                <Text className="text-lg">{t('settings.general.language.title')}</Text>
                <LanguageDropdown />
              </XStack>
            </Group>
          </YStack>

          {/* Chat settings */}
          <YStack className="gap-2">
            <GroupTitle>{t('settings.general.auto_scroll.title')}</GroupTitle>
            <Group>
              <XStack className="items-center justify-between p-4">
                <YStack className="flex-1 pr-4">
                  <Text className="text-lg">{t('settings.general.auto_scroll.title')}</Text>
                  <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('settings.general.auto_scroll.description')}
                  </Text>
                </YStack>
                <Switch isSelected={autoScroll} onSelectedChange={setAutoScroll} />
              </XStack>
            </Group>
          </YStack>

          {/* Context token budget */}
          <YStack className="gap-2">
            <GroupTitle>{t('settings.general.context_budget.title')}</GroupTitle>
            <Group>
              <XStack className="items-center justify-between p-4">
                <YStack className="flex-1 pr-4">
                  <Text className="text-lg">{t('settings.general.context_budget.title')}</Text>
                  <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('settings.general.context_budget.description')}
                  </Text>
                </YStack>
              </XStack>
              <KeyboardAvoidingView className="px-4 pb-4">
                <TextField className="gap-2">
                  <TextField.Label className="text-foreground-secondary text-sm font-medium">
                    {t('settings.general.context_budget.label')}
                  </TextField.Label>
                  <TextField.Input
                    className="h-12 rounded-lg px-3 py-0 text-sm"
                    keyboardType="number-pad"
                    value={String(contextTokenBudget)}
                    onChangeText={text => {
                      const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10)
                      setContextTokenBudget(Number.isNaN(parsed) ? 0 : parsed)
                    }}
                  />
                </TextField>
              </KeyboardAvoidingView>
            </Group>
          </YStack>
          {/* Developer settings */}
          <YStack className="gap-2">
            <GroupTitle>{t('settings.general.developer_mode.title')}</GroupTitle>
            <Group>
              <XStack className="items-center justify-between p-4">
                <Text className="text-lg">{t('settings.general.developer_mode.title')}</Text>
                <Switch isSelected={developerMode} onSelectedChange={setDeveloperMode} />
              </XStack>
            </Group>
          </YStack>
        </YStack>
      </Container>
    </SafeAreaContainer>
  )
}
