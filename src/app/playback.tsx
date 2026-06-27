import { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/card';
import { CircularButton } from '@/components/circular-button';
import { PlayIcon, PauseIcon, StopIcon } from '@/components/icons';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/hooks/use-theme';
import { playerPlay, playerPause, playerStop, ApiError } from '@/services/api';
import { Spacing } from '@/constants/theme';

type PlayerAction = 'PLAY' | 'PAUSE' | 'STOP';
type PlaybackStatus = 'Stopped' | 'Playing' | 'Paused';

const STATUS_FOR_ACTION: Record<PlayerAction, PlaybackStatus> = {
  PLAY: 'Playing',
  PAUSE: 'Paused',
  STOP: 'Stopped',
};

export default function PlaybackScreen() {
  const theme = useTheme();
  const { proxyUrl } = useSettings();
  const [activeAction, setActiveAction] = useState<PlayerAction | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>('Stopped');
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setError(null);
    }, []),
  );

  const handleAction = async (action: PlayerAction) => {
    setActiveAction(action);
    setError(null);
    try {
      if (action === 'PLAY') await playerPlay(proxyUrl);
      else if (action === 'PAUSE') await playerPause(proxyUrl);
      else await playerStop(proxyUrl);
      setStatus(STATUS_FOR_ACTION[action]);
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Playback Controls</ThemedText>

        <Card style={styles.card}>
          <View style={styles.buttonRow}>
            <CircularButton
              onPress={() => handleAction('PLAY')}
              loading={activeAction === 'PLAY'}
              accessibilityLabel="Play"
            >
              <PlayIcon size={24} color={theme.text} />
            </CircularButton>
            <CircularButton
              onPress={() => handleAction('PAUSE')}
              loading={activeAction === 'PAUSE'}
              accessibilityLabel="Pause"
            >
              <PauseIcon size={22} color={theme.text} />
            </CircularButton>
            <CircularButton
              onPress={() => handleAction('STOP')}
              loading={activeAction === 'STOP'}
              accessibilityLabel="Stop"
            >
              <StopIcon size={22} color={theme.text} />
            </CircularButton>
          </View>

          <ThemedText themeColor="textSecondary" style={styles.status}>
            {status}
          </ThemedText>
        </Card>

        {error && (
          <View style={[styles.errorBanner, { backgroundColor: theme.danger }]}>
            <ThemedText style={[styles.errorText, { color: theme.dangerOn }]}>{error}</ThemedText>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    gap: Spacing.three,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'center',
  },
  status: {
    fontSize: 14,
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
});
