import { useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/card';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/use-theme';
import { getSeasons, ApiError, type SeasonItem } from '@/services/api';
import { Spacing } from '@/constants/theme';

export default function TVShowDetailScreen() {
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

  const [seasons, setSeasons] = useState<SeasonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getSeasons(proxyUrl, Number(id))
      .then((res) => {
        setSeasons(res.seasons ?? []);
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.detail : 'Failed to load seasons');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [proxyUrl, id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const navigateToSeason = useCallback((season: number) => {
    router.push({ pathname: '/tvshow/[id]/season/[num]', params: { id: id, num: String(season), tvshowTitle: title ?? '' } });
  }, [router, id, title]);

  const renderSeason = useCallback(({ item }: { item: SeasonItem }) => (
    <Pressable
      onPress={() => navigateToSeason(item.season)}
      style={({ pressed }) => [styles.seasonItem, { backgroundColor: theme.surfaceMuted }, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.thumb, { backgroundColor: theme.border }]}>
        <ThemedText style={styles.thumbText}>S{item.season}</ThemedText>
      </View>
      <ThemedText style={styles.seasonLabel}>Season {item.season}</ThemedText>
    </Pressable>
  ), [theme, navigateToSeason]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={[styles.mainThumb, { backgroundColor: theme.surfaceMuted }]}>
            <ThemedText style={styles.mainThumbIcon}>📺</ThemedText>
          </View>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <View style={styles.metaRow}>
            <ThemedText themeColor="textSecondary" style={styles.meta}>{year}</ThemedText>
            {genre ? (
              <ThemedText themeColor="textSecondary" style={styles.meta}>{genre}</ThemedText>
            ) : null}
          </View>
        </Card>

        {loading && (
          <ActivityIndicator size="large" color={theme.accent} style={styles.loader} />
        )}

        {error && (
          <View style={[styles.errorBanner, { backgroundColor: theme.danger }]}>
            <ThemedText style={[styles.errorText, { color: theme.dangerOn }]}>{error}</ThemedText>
          </View>
        )}

        {!loading && seasons.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Seasons</ThemedText>
            <FlatList
              data={seasons}
              keyExtractor={(item) => `s-${item.season}`}
              renderItem={renderSeason}
              scrollEnabled={false}
            />
          </View>
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
  card: {
    gap: Spacing.two,
    alignItems: 'center',
  },
  mainThumb: {
    width: 120,
    height: 160,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainThumbIcon: {
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
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  seasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: {
    fontSize: 14,
    fontWeight: '700',
  },
  seasonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
