import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MoonIcon, SunIcon } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { useThemeMode } from '@/context/ThemeContext';
import { Spacing } from '@/constants/theme';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { effective, toggle } = useThemeMode();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + Spacing.two,
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
      ]}
    >
      <ThemedText style={styles.title}>Kodi Companion</ThemedText>
      <Pressable
        onPress={toggle}
        hitSlop={12}
        style={({ pressed }) => [styles.toggle, pressed && { opacity: 0.6 }]}
        accessibilityRole="button"
        accessibilityLabel={effective === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {effective === 'dark' ? (
          <MoonIcon size={22} color={theme.accent} cutoutColor={theme.surface} />
        ) : (
          <SunIcon size={22} color={theme.accent} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  toggle: {
    padding: Spacing.one,
  },
});
