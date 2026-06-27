import { useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/use-theme';
import { listMovies, listTVShows, ApiError, type MovieItem, type TVShowItem } from '@/services/api';
import { Spacing } from '@/constants/theme';

export default function BrowseScreen() {
  const theme = useTheme();
  const { proxyUrl } = useSettings();
  const router = useRouter();

  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [tvShows, setTvShows] = useState<TVShowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moviesCollapsed, setMoviesCollapsed] = useState(true);
  const [tvShowsCollapsed, setTvShowsCollapsed] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      listMovies(proxyUrl),
      listTVShows(proxyUrl),
    ])
      .then(([movieRes, tvRes]) => {
        setMovies(movieRes.movies ?? []);
        setTvShows(tvRes.tvshows ?? []);
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.detail : 'Failed to load library');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [proxyUrl]);

  useFocusEffect(
    useCallback(() => {
      setMoviesCollapsed(true);
      setTvShowsCollapsed(true);
      load();
    }, [load]),
  );

  const navigateToMovie = useCallback((item: MovieItem) => {
    router.push({ pathname: '/movie/[id]', params: { id: String(item.movieid), title: item.title, year: String(item.year), genre: item.genre?.join(',') ?? '', thumbnail: item.thumbnail ?? '' } });
  }, [router]);

  const navigateToTVShow = useCallback((item: TVShowItem) => {
    router.push({ pathname: '/tvshow/[id]', params: { id: String(item.tvshowid), title: item.title, year: String(item.year), genre: item.genre?.join(',') ?? '', thumbnail: item.thumbnail ?? '' } });
  }, [router]);

  const renderMovie = useCallback(({ item }: { item: MovieItem }) => (
    <Pressable
      onPress={() => navigateToMovie(item)}
      style={({ pressed }) => [styles.item, { backgroundColor: theme.surfaceMuted }, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.thumb, { backgroundColor: theme.border }]}>
        <ThemedText style={styles.thumbIcon}>🎬</ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText style={styles.title} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.sub}>{item.year}</ThemedText>
      </View>
    </Pressable>
  ), [theme, navigateToMovie]);

  const renderTVShow = useCallback(({ item }: { item: TVShowItem }) => (
    <Pressable
      onPress={() => navigateToTVShow(item)}
      style={({ pressed }) => [styles.item, { backgroundColor: theme.surfaceMuted }, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.thumb, { backgroundColor: theme.border }]}>
        <ThemedText style={styles.thumbIcon}>📺</ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText style={styles.title} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.sub}>{item.year}</ThemedText>
      </View>
    </Pressable>
  ), [theme, navigateToTVShow]);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={theme.accent} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={styles.heading}>Library</ThemedText>

        {error && (
          <View style={[styles.errorBanner, { backgroundColor: theme.danger }]}>
            <ThemedText style={[styles.errorText, { color: theme.dangerOn }]}>{error}</ThemedText>
          </View>
        )}

        {movies.length > 0 && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setMoviesCollapsed((c) => !c)}
              style={styles.sectionHeader}
            >
              <ThemedText style={styles.sectionTitle}>Movies</ThemedText>
              <ThemedText style={styles.chevron}>{moviesCollapsed ? '▶' : '▼'}</ThemedText>
            </Pressable>
            {!moviesCollapsed && (
              <FlatList
                data={movies}
                keyExtractor={(item) => `m-${item.movieid}`}
                renderItem={renderMovie}
                scrollEnabled={false}
              />
            )}
          </View>
        )}

        {tvShows.length > 0 && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setTvShowsCollapsed((c) => !c)}
              style={styles.sectionHeader}
            >
              <ThemedText style={styles.sectionTitle}>TV Shows</ThemedText>
              <ThemedText style={styles.chevron}>{tvShowsCollapsed ? '▶' : '▼'}</ThemedText>
            </Pressable>
            {!tvShowsCollapsed && (
              <FlatList
                data={tvShows}
                keyExtractor={(item) => `t-${item.tvshowid}`}
                renderItem={renderTVShow}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  chevron: {
    fontSize: 12,
  },
  item: {
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
  thumbIcon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  sub: {
    fontSize: 13,
    marginTop: 2,
  },
});
