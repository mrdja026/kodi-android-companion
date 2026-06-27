import { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/use-theme';
import { searchMovies, searchTVShows, searchTVShowFiles, listFilesDirectory, playerPlayFile, ApiError, type MovieItem, type TVShowItem, type FileItem } from '@/services/api';
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
  const [moviesCollapsed, setMoviesCollapsed] = useState(true);
  const [tvShowsCollapsed, setTvShowsCollapsed] = useState(true);
  const [mode, setMode] = useState<'library' | 'files'>('library');
  const [fileResults, setFileResults] = useState<FileItem[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [directoryHistory, setDirectoryHistory] = useState<string[]>([]);
  const [filesCollapsed, setFilesCollapsed] = useState(true);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) {
      if (mode === 'library') {
        setMovies([]);
        setTvShows([]);
        setError(null);
      } else {
        if (currentPath === null) {
          setFileResults([]);
          setFileError(null);
        }
      }
      return;
    }

    if (mode === 'library') {
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
    } else if (currentPath === null) {
      setFileLoading(true);
      setFileError(null);
      searchTVShowFiles(proxyUrl, q.trim())
        .then((res) => {
          setFileResults(res.files ?? []);
        })
        .catch((e) => {
          setFileError(e instanceof ApiError ? e.detail : 'Search failed');
        })
        .finally(() => {
          setFileLoading(false);
        });
    }
  }, [proxyUrl, mode, currentPath]);

  const onChangeText = useCallback((text: string) => {
    setQuery(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => doSearch(text), 300);
  }, [doSearch]);

  useFocusEffect(
    useCallback(() => {
      setMoviesCollapsed(true);
      setTvShowsCollapsed(true);
      setFilesCollapsed(true);
      setCurrentPath(null);
      setDirectoryHistory([]);
      return () => {
        if (timer.current) clearTimeout(timer.current);
      };
    }, []),
  );

  const browseDirectory = useCallback(async (path: string) => {
    setFileLoading(true);
    setFileError(null);
    try {
      const res = await listFilesDirectory(proxyUrl, path);
      setDirectoryHistory((prev) => (currentPath ? [...prev, currentPath] : []));
      setCurrentPath(path);
      setFileResults(res.files ?? []);
    } catch (e) {
      setFileError(e instanceof ApiError ? e.detail : 'Failed to load directory');
    } finally {
      setFileLoading(false);
    }
  }, [proxyUrl, currentPath]);

  const goBack = useCallback(async () => {
    const prev = [...directoryHistory];
    const parent = prev.pop();
    setDirectoryHistory(prev);
    if (parent) {
      setFileLoading(true);
      setFileError(null);
      try {
        const res = await listFilesDirectory(proxyUrl, parent);
        setCurrentPath(parent);
        setFileResults(res.files ?? []);
      } catch (e) {
        setFileError(e instanceof ApiError ? e.detail : 'Failed to load directory');
      } finally {
        setFileLoading(false);
      }
    } else {
      setCurrentPath(null);
      setFileResults([]);
      setQuery('');
    }
  }, [proxyUrl, directoryHistory]);

  const handlePlayFile = useCallback(async (filePath: string) => {
    try {
      await playerPlayFile(proxyUrl, filePath);
      router.replace('/playback');
    } catch (e) {
      setFileError(e instanceof ApiError ? e.detail : 'Play failed');
    }
  }, [proxyUrl, router]);

  const navigateToMovie = useCallback((item: MovieItem) => {
    router.push({ pathname: '/movie/[id]', params: { id: String(item.movieid), title: item.title, year: String(item.year), genre: item.genre?.join(',') ?? '', thumbnail: item.thumbnail ?? '' } });
  }, [router]);

  const navigateToTVShow = useCallback((item: TVShowItem) => {
    router.push({ pathname: '/tvshow/[id]', params: { id: String(item.tvshowid), title: item.title, year: String(item.year), genre: item.genre?.join(',') ?? '', thumbnail: item.thumbnail ?? '' } });
  }, [router]);

  const renderFileItem = useCallback(({ item }: { item: FileItem }) => (
    <Pressable
      onPress={() => item.filetype === 'directory' ? browseDirectory(item.file) : handlePlayFile(item.file)}
      style={({ pressed }) => [styles.resultItem, { backgroundColor: theme.surfaceMuted }, pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.thumbnail, { backgroundColor: theme.border }]}>
        <ThemedText style={styles.thumbPlaceholder}>{item.filetype === 'directory' ? '📁' : '📄'}</ThemedText>
      </View>
      <View style={styles.resultInfo}>
        <ThemedText style={styles.resultTitle} numberOfLines={1}>{item.label}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.resultSub} numberOfLines={1}>{item.file}</ThemedText>
      </View>
    </Pressable>
  ), [theme, browseDirectory, handlePlayFile]);

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
  const fileHasResults = fileResults.length > 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border },
          ]}
          value={query}
          onChangeText={onChangeText}
          placeholder={mode === 'library' ? "Search movies & TV shows…" : "Search files on Kodi…"}
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        <View style={styles.segmentedRow}>
          <Pressable
            onPress={() => setMode('library')}
            style={({ pressed }) => [
              styles.segment,
              { backgroundColor: mode === 'library' ? theme.accent : theme.surfaceMuted },
              pressed && { opacity: 0.7 },
            ]}
          >
            <ThemedText style={[styles.segmentText, { color: mode === 'library' ? theme.accentOn : theme.textSecondary }]}>
              Library
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => setMode('files')}
            style={({ pressed }) => [
              styles.segment,
              { backgroundColor: mode === 'files' ? theme.accent : theme.surfaceMuted },
              pressed && { opacity: 0.7 },
            ]}
          >
            <ThemedText style={[styles.segmentText, { color: mode === 'files' ? theme.accentOn : theme.textSecondary }]}>
              Files
            </ThemedText>
          </Pressable>
        </View>

        {mode === 'library' && (
          <>
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

            {!loading && tvShows.length > 0 && (
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
          </>
        )}

        {mode === 'files' && (
          <>
            {currentPath && (
              <Pressable
                onPress={goBack}
                style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
              >
                <ThemedText style={styles.backText}>← Back</ThemedText>
              </Pressable>
            )}

            {currentPath && (
              <ThemedText themeColor="textSecondary" style={styles.breadcrumb} numberOfLines={1}>
                {currentPath}
              </ThemedText>
            )}

            {fileLoading && (
              <ActivityIndicator size="large" color={theme.accent} style={styles.loader} />
            )}

            {fileError && !fileLoading && (
              <View style={[styles.errorBanner, { backgroundColor: theme.danger }]}>
                <ThemedText style={[styles.errorText, { color: theme.dangerOn }]}>{fileError}</ThemedText>
              </View>
            )}

            {!fileLoading && !fileHasResults && query.trim() && !fileError && !currentPath && (
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                No files found for "{query}"
              </ThemedText>
            )}

            {!fileLoading && !fileHasResults && !fileError && currentPath && (
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                This directory is empty.
              </ThemedText>
            )}

            {!fileLoading && fileHasResults && (
              <View style={styles.section}>
                <Pressable
                  onPress={() => setFilesCollapsed((c) => !c)}
                  style={styles.sectionHeader}
                >
                  <ThemedText style={styles.sectionTitle}>Files</ThemedText>
                  <ThemedText style={styles.chevron}>{filesCollapsed ? '▶' : '▼'}</ThemedText>
                </Pressable>
                {!filesCollapsed && (
                  <FlatList
                    data={fileResults}
                    keyExtractor={(item) => item.file}
                    renderItem={renderFileItem}
                    scrollEnabled={false}
                  />
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
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
  segmentedRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  segment: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    marginTop: Spacing.two,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  breadcrumb: {
    fontSize: 11,
    marginTop: Spacing.half,
  },
});
