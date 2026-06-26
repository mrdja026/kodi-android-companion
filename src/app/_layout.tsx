import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';

import { SettingsProvider } from '@/context/SettingsContext';
import AppTabs from '@/components/app-tabs';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <SettingsProvider>
          <AppTabs />
        </SettingsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
