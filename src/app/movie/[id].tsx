import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/card';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/use-theme';
import { playMovie, ApiError } from '@/services/api';
import { Spacing } from '@/constants/theme';

export default function MovieDetailScreen() {
  const { id, title, year, genre, thumbnail } = useLocalSearchParams<{
    id: string;
    title: string;
    year: string;
    genre: string;
    thumbnail: string;
  }>();
  const theme = useTheme();
  const { proxyUrl } = useSettings();
  const router = useRouter();

  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async () => {
    setPlaying(true);
    setError(null);
    try {
      await playMovie(proxyUrl, Number(id));
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Play failed');
    } finally {
      setPlaying(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={[styles.thumb, { backgroundColor: theme.surfaceMuted }]}>
            <ThemedText style={styles.thumbIcon}>🎬</ThemedText>
          </View>

          <ThemedText style={styles.title}>{title}</ThemedText>

          <View style={styles.metaRow}>
            <ThemedText themeColor="textSecondary" style={styles.meta}>{year}</ThemedText>
            {genre ? (
              <ThemedText themeColor="textSecondary" style={styles.meta}>{genre}</ThemedText>
            ) : null}
          </View>

          <Pressable
            onPress={handlePlay}
            disabled={playing}
            accessibilityRole="button"
            accessibilityLabel="Play"
            style={({ pressed }) => [
              styles.playButton,
              { backgroundColor: theme.accent },
              pressed && { opacity: 0.7 },
              playing && { opacity: 0.6 },
            ]}
          >
            {playing ? (
              <ActivityIndicator size="small" color={theme.accentOn} />
            ) : (
              <ThemedText style={[styles.playText, { color: theme.accentOn }]}>Play</ThemedText>
            )}
          </Pressable>

          {error && (
            <View style={[styles.errorBanner, { backgroundColor: theme.danger }]}>
              <ThemedText style={[styles.errorText, { color: theme.dangerOn }]}>{error}</ThemedText>
            </View>
          )}
        </Card>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    gap: Spacing.three,
    alignItems: 'center',
  },
  thumb: {
    width: 120,
    height: 160,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  meta: {
    fontSize: 14,
  },
  playButton: {
    borderRadius: 10,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    minWidth: 140,
  },
  playText: {
    fontSize: 16,
    fontWeight: '700',
  },
  errorBanner: {
    borderRadius: 10,
    padding: Spacing.three,
    alignSelf: 'center',
    maxWidth: 360,
    width: '100%',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
});
