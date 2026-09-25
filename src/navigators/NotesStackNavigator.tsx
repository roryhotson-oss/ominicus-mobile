import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import NoteDetailScreen from '@/screens/notes/NoteDetailScreen'
import NotesScreen from '@/screens/notes/NotesScreen'

export type NotesStackParamList = {
  NotesScreen: undefined
  NoteDetailScreen: { noteId?: string }
}

const Stack = createNativeStackNavigator<NotesStackParamList>()

export default function NotesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'ios_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true
      }}>
      <Stack.Screen name="NotesScreen" component={NotesScreen} />
      <Stack.Screen name="NoteDetailScreen" component={NoteDetailScreen} />
    </Stack.Navigator>
  )
}
