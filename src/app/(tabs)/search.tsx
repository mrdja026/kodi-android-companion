import { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/use-theme';
import { searchMovies, searchTVShows, ApiError, type MovieItem, type TVShowItem } from '@/services/api';
import { Spacing } from '@/constants/theme';

export default function SearchScreen() {
  const theme = useTheme();
  const { proxyUrl } = useSettings();
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [tvShows, setTvShows] = useState<TVShowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setMovies([]);
      setTvShows([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      searchMovies(proxyUrl, q.trim()),
      searchTVShows(proxyUrl, q.trim()),
    ])
      .then(([movieRes, tvRes]) => {
        setMovies(movieRes.movies ?? []);
        setTvShows(tvRes.tvshows ?? []);
      })
      .catch((e) => {
        setError(e instanceof ApiError ? e.detail : 'Search failed');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [proxyUrl]);

  const onChangeText = useCallback((text: string) => {
    setQuery(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => doSearch(text), 300);
  }, [doSearch]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }, []),
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
      style={({ pressed }) => [styles.resultItem, { backgroundColor: theme.surfaceMuted }, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.thumbnail, { backgroundColor: theme.border }]}>
        <ThemedText style={styles.thumbPlaceholder}>🎬</ThemedText>
      </View>
      <View style={styles.resultInfo}>
        <ThemedText style={styles.resultTitle} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.resultSub}>{item.year}</ThemedText>
      </View>
    </Pressable>
  ), [theme, navigateToMovie]);

  const renderTVShow = useCallback(({ item }: { item: TVShowItem }) => (
    <Pressable
      onPress={() => navigateToTVShow(item)}
      style={({ pressed }) => [styles.resultItem, { backgroundColor: theme.surfaceMuted }, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.thumbnail, { backgroundColor: theme.border }]}>
        <ThemedText style={styles.thumbPlaceholder}>📺</ThemedText>
      </View>
      <View style={styles.resultInfo}>
        <ThemedText style={styles.resultTitle} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.resultSub}>{item.year}</ThemedText>
      </View>
    </Pressable>
  ), [theme, navigateToTVShow]);

  const hasResults = movies.length > 0 || tvShows.length > 0;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
          ]}
          value={query}
          onChangeText={onChangeText}
          placeholder="Search movies & TV shows…"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {loading && (
          <ActivityIndicator size="large" color={theme.accent} style={styles.loader} />
        )}

        {error && !loading && (
          <View style={[styles.errorBanner, { backgroundColor: theme.danger }]}>
            <ThemedText style={[styles.errorText, { color: theme.dangerOn }]}>{error}</ThemedText>
          </View>
        )}

        {!loading && !hasResults && query.trim() && !error && (
          <ThemedText themeColor="textSecondary" style={styles.emptyText}>
            No movies or TV shows found for "{query}"
          </ThemedText>
        )}

        {!loading && movies.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Movies</ThemedText>
            <FlatList
              data={movies}
              keyExtractor={(item) => `m-${item.movieid}`}
              renderItem={renderMovie}
              scrollEnabled={false}
            />
          </View>
        )}

        {!loading && tvShows.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>TV Shows</ThemedText>
            <FlatList
              data={tvShows}
              keyExtractor={(item) => `t-${item.tvshowid}`}
              renderItem={renderTVShow}
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
    gap: Spacing.two,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
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
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.four,
    fontSize: 14,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholder: {
    fontSize: 20,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  resultSub: {
    fontSize: 13,
    marginTop: 2,
  },
});
