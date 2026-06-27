import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { SpeakerIcon, PlayIcon, SearchIcon, MovieIcon, GearIcon } from '@/components/icons';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

type TabKey = 'index' | 'playback' | 'search' | 'browse' | 'settings';

type TabRoute = { key: string; name: string };
type TabBarProps = {
  state: { index: number; routes: TabRoute[] };
  descriptors: Record<string, { options: { tabBarAccessibilityLabel?: string } }>;
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault?: boolean }) => { defaultPrevented?: boolean };
    navigate: (name: string) => void;
  };
};

const TAB_META: Record<TabKey, { label: string }> = {
  index: { label: 'Volume' },
  playback: { label: 'Playback' },
  search: { label: 'Search' },
  browse: { label: 'Browse' },
  settings: { label: 'Settings' },
};

function TabIcon({ name, color, focused }: { name: TabKey; color: string; focused: boolean }) {
  const size = focused ? 22 : 20;
  if (name === 'index') return <SpeakerIcon size={size} color={color} />;
  if (name === 'playback') return <PlayIcon size={size} color={color} />;
  if (name === 'search') return <SearchIcon size={size} color={color} />;
  if (name === 'browse') return <MovieIcon size={size} color={color} />;
  return <GearIcon size={size} color={color} />;
}

function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, Spacing.two),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name as TabKey] ?? { label: route.name };
        const color = focused ? theme.accent : theme.textSecondary;
        const { options } = descriptors[route.key];
        const accessibilityLabel = options.tabBarAccessibilityLabel ?? meta.label;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={accessibilityLabel}
            style={({ pressed }) => [
              styles.cell,
              focused && { backgroundColor: theme.surfaceMuted },
              pressed && { opacity: 0.7 },
            ]}
          >
            <TabIcon name={route.name as TabKey} color={color} focused={focused} />
            <ThemedText style={[styles.label, { color }]}>{meta.label}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...(props as unknown as TabBarProps)} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Volume' }} />
      <Tabs.Screen name="playback" options={{ title: 'Playback' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    marginHorizontal: Spacing.half,
    borderRadius: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
