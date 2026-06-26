import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useVolume } from '@/hooks/use-volume';
import { Spacing } from '@/constants/theme';

function TouchSlider({ value, onValueChange }: { value: number; onValueChange: (v: number) => void }) {
  const trackWidth = useRef(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  }, []);

  const resolve = useCallback(
    (e: GestureResponderEvent) => {
      if (trackWidth.current <= 0) return;
      const x = e.nativeEvent.locationX;
      const pct = Math.max(0, Math.min(100, Math.round((x / trackWidth.current) * 100)));
      onValueChange(pct);
    },
    [onValueChange],
  );

  const pct = Math.max(0, Math.min(100, value));

  return (
    <View
      style={styles.sliderTrack}
      onLayout={onLayout}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={resolve}
      onResponderMove={resolve}
    >
      <View style={[styles.sliderFill, { width: `${pct}%` as unknown as number }]} />
      <View style={[styles.sliderThumb, { left: `${pct}%` as unknown as number }]} />
    </View>
  );
}

export default function VolumeScreen() {
  const insets = useSafeAreaInsets();
  const { volume, loading, error, refresh, set, stepUp, stepDown } = useVolume();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <ThemedText style={styles.title}>VOLUME</ThemedText>

        <View style={styles.volumeDisplay}>
          <ThemedText style={styles.volumeNumber}>{'' + volume}</ThemedText>
        </View>

        <View style={styles.sliderContainer}>
          <TouchSlider value={volume} onValueChange={set} />
          <View style={styles.sliderLabels}>
            <ThemedText themeColor="textSecondary" style={styles.sliderLabel}>0</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.sliderLabel}>100</ThemedText>
          </View>
        </View>

        <View style={styles.stepRow}>
          <Pressable
            style={({ pressed }) => [styles.stepButton, pressed && styles.stepPressed]}
            onPress={stepDown}
            disabled={loading || volume <= 0}
          >
            <ThemedText style={styles.stepIcon}>-</ThemedText>
            <ThemedText style={styles.stepValue}>5</ThemedText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.stepButton, styles.stepButtonUp, pressed && styles.stepPressed]}
            onPress={stepUp}
            disabled={loading || volume >= 100}
          >
            <ThemedText style={styles.stepIcon}>+</ThemedText>
            <ThemedText style={styles.stepValue}>5</ThemedText>
          </Pressable>
        </View>

        {loading && (
          <ThemedText themeColor="textSecondary" style={styles.status}>
            Updating...
          </ThemedText>
        )}

        {error && (
          <ThemedView style={styles.errorBanner}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
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
    paddingHorizontal: Spacing.five,
    gap: Spacing.four,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 4,
    opacity: 0.4,
  },
  volumeDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeNumber: {
    fontSize: 96,
    fontWeight: '200',
    lineHeight: 110,
  },
  sliderContainer: {
    gap: Spacing.one,
    paddingHorizontal: 4,
  },
  sliderTrack: {
    height: 48,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    overflow: 'visible',
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#1a6b3c',
    borderRadius: 8,
  },
  sliderThumb: {
    position: 'absolute',
    width: 6,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginLeft: -3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sliderLabel: {
    fontSize: 12,
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.four,
    paddingTop: Spacing.two,
  },
  stepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    backgroundColor: '#2a2a2a',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    minWidth: 110,
    justifyContent: 'center',
  },
  stepButtonUp: {
    backgroundColor: '#1a6b3c',
  },
  stepPressed: {
    opacity: 0.6,
  },
  stepIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  stepValue: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  status: {
    textAlign: 'center',
    fontSize: 14,
  },
  errorBanner: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    backgroundColor: '#6b1a1a',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 14,
  },
});
