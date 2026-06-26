import { useState, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSettings } from '@/context/SettingsContext';
import { playerPlay, playerPause, playerStop, ApiError } from '@/services/api';
import { Spacing } from '@/constants/theme';

type PlayerAction = 'PLAY' | 'PAUSE' | 'STOP';

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const { proxyUrl } = useSettings();
  const [activeAction, setActiveAction] = useState<PlayerAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useFocusEffect(
    useCallback(() => {
      clearError();
    }, [clearError]),
  );

  const handleAction = async (action: PlayerAction) => {
    setActiveAction(action);
    setError(null);
    try {
      switch (action) {
        case 'PLAY':
          await playerPlay(proxyUrl);
          break;
        case 'PAUSE':
          await playerPause(proxyUrl);
          break;
        case 'STOP':
          await playerStop(proxyUrl);
          break;
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.detail);
      } else {
        setError('Cannot reach proxy');
      }
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <ThemedText type="subtitle" style={styles.title}>
          Player Control
        </ThemedText>

        <View style={styles.buttonRow}>
          <ActionButton
            label="Play"
            action="PLAY"
            loading={activeAction === 'PLAY'}
            onPress={handleAction}
          />
          <ActionButton
            label="Pause"
            action="PAUSE"
            loading={activeAction === 'PAUSE'}
            onPress={handleAction}
          />
          <ActionButton
            label="Stop"
            action="STOP"
            loading={activeAction === 'STOP'}
            onPress={handleAction}
          />
        </View>

        {error && (
          <ThemedView type="backgroundElement" style={styles.errorBanner}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}
      </View>
    </ThemedView>
  );
}

function ActionButton({
  label,
  action,
  loading,
  onPress,
}: {
  label: string;
  action: PlayerAction;
  loading: boolean;
  onPress: (action: PlayerAction) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        pressed && styles.buttonPressed,
        loading && styles.buttonLoading,
      ]}
      onPress={() => onPress(action)}
      disabled={loading}
    >
      <ThemedText style={styles.actionButtonText}>
        {loading ? '...' : label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  title: {
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.five,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonLoading: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorBanner: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    alignSelf: 'stretch',
    backgroundColor: '#6b1a1a',
  },
  errorText: {
    textAlign: 'center',
  },
});
