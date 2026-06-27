import { useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/use-theme';
import { getEpisodes, playEpisode, ApiError, type EpisodeItem } from '@/services/api';
import { Spacing } from '@/constants/theme';

export default function SeasonEpisodesScreen() {
  const { id, num, tvshowTitle } = useLocalSearchParams<{
    id: string;
    num: string;
    tvshowTitle: string;
  }>();
  const theme = useTheme();
  const { proxyUrl } = useSettings();
  const router = useRouter();

  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEpisodes(proxyUrl, Number(id), Number(num));
      setEpisodes(res.episodes ?? []);
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Failed to load episodes');
    } finally {
      setLoading(false);
    }
  }, [proxyUrl, id, num]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handlePlay = async (episodeId: number) => {
    setPlayingId(episodeId);
    setError(null);
    try {
      await playEpisode(proxyUrl, episodeId);
      router.replace('/playback');
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Play failed');
    } finally {
      setPlayingId(null);
    }
  };

  const renderEpisode = useCallback(({ item }: { item: EpisodeItem }) => (
    <View style={[styles.episodeItem, { backgroundColor: theme.surfaceMuted }]}>
      <View style={styles.episodeInfo}>
        <ThemedText style={styles.episodeNumber}>S{item.season}·E{item.episode}</ThemedText>
        <ThemedText style={styles.episodeTitle} numberOfLines={2}>{item.title}</ThemedText>
        {item.runtime ? (
          <ThemedText themeColor="textSecondary" style={styles.episodeRuntime}>
            {Math.floor(item.runtime / 60)}min
          </ThemedText>
        ) : null}
      </View>
      <Pressable
        onPress={() => handlePlay(item.episodeid)}
        disabled={playingId === item.episodeid}
        accessibilityRole="button"
        accessibilityLabel="Play episode"
        style={({ pressed }) => [
          styles.playButton,
          { backgroundColor: theme.accent },
          pressed && { opacity: 0.7 },
          playingId === item.episodeid && { opacity: 0.6 },
        ]}
      >
        {playingId === item.episodeid ? (
          <ActivityIndicator size="small" color={theme.accentOn} />
        ) : (
          <ThemedText style={[styles.playButtonText, { color: theme.accentOn }]}>Play</ThemedText>
        )}
      </Pressable>
    </View>
  ), [theme, proxyUrl, playingId]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.heading}>
          {tvshowTitle ?? `TV Show`} — Season {num}
        </ThemedText>

        {loading && (
          <ActivityIndicator size="large" color={theme.accent} style={styles.loader} />
        )}

        {error && (
          <View style={[styles.errorBanner, { backgroundColor: theme.danger }]}>
            <ThemedText style={[styles.errorText, { color: theme.dangerOn }]}>{error}</ThemedText>
          </View>
        )}

        {!loading && episodes.length === 0 && !error && (
          <ThemedText themeColor="textSecondary" style={styles.empty}>
            No episodes in this season.
          </ThemedText>
        )}

        {!loading && episodes.length > 0 && (
          <FlatList
            data={episodes}
            keyExtractor={(item) => `e-${item.episodeid}`}
            renderItem={renderEpisode}
            contentContainerStyle={styles.list}
          />
        )}
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
    padding: Spacing.four,
    gap: Spacing.three,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  loader: {
    marginTop: Spacing.four,
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
  empty: {
    textAlign: 'center',
    marginTop: Spacing.four,
  },
  list: {
    gap: Spacing.two,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  episodeInfo: {
    flex: 1,
    gap: 2,
  },
  episodeNumber: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.6,
  },
  episodeTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  episodeRuntime: {
    fontSize: 12,
    marginTop: 2,
  },
  playButton: {
    borderRadius: 8,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    minWidth: 60,
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
