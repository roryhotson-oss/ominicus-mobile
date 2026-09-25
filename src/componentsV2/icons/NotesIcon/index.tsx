import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { useTheme } from '@/hooks/useTheme'

import type { IconProps } from '../types'

export function NotesIcon(props: IconProps) {
  const { isDark } = useTheme()
  const strokeColor = isDark ? '#f9f9f9ff' : '#202020ff'
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M8 3h8a2 2 0 0 1 2 2v7.5a2 2 0 0 1-.586 1.414l-4.5 4.5A2 2 0 0 1 11.5 19H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <Path d="M18 12.5h-4.5a2 2 0 0 0-2 2V19" stroke={strokeColor} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M9 7.5h6M9 11h4" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}
