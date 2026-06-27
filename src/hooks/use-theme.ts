import { Colors } from '@/constants/theme';
import { useThemeMode } from '@/context/ThemeContext';

export function useTheme() {
  const { effective } = useThemeMode();
  return Colors[effective];
}
