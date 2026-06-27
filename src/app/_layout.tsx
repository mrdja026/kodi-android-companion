import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider, useThemeMode } from '@/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { AppHeader } from '@/components/app-header';
import AppTabs from '@/components/app-tabs';
import { useTheme } from '@/hooks/use-theme';
import { View } from 'react-native';

function Shell() {
  const { effective } = useThemeMode();
  const theme = useTheme();
  return (
    <NavThemeProvider value={effective === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <AppHeader />
        <View style={{ flex: 1 }}>
          <AppTabs />
        </View>
      </View>
      <StatusBar style={effective === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SettingsProvider>
          <Shell />
        </SettingsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
