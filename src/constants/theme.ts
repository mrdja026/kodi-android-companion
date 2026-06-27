import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0b1115',
    background: '#f5f7fa',
    backgroundElement: '#ffffff',
    backgroundSelected: '#e6ebf1',
    textSecondary: '#5a6675',
    accent: '#0891b2',
    accentOn: '#ffffff',
    accentMuted: '#a5e9f5',
    surface: '#ffffff',
    surfaceMuted: '#e6ebf1',
    border: '#d3dae3',
    danger: '#dc2626',
    dangerOn: '#ffffff',
  },
  dark: {
    text: '#ffffff',
    background: '#0b1115',
    backgroundElement: '#161c22',
    backgroundSelected: '#1f2731',
    textSecondary: '#8a94a4',
    accent: '#22d3ee',
    accentOn: '#0b1115',
    accentMuted: '#155e75',
    surface: '#161c22',
    surfaceMuted: '#1f2731',
    border: '#2a3340',
    danger: '#ef4444',
    dangerOn: '#ffffff',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
export const CardMaxWidth = 360;
