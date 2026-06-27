import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/card';
import { useVolume } from '@/hooks/use-volume';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

function TouchSlider({ value, onValueChange }: { value: number; onValueChange: (v: number) => void }) {
  const trackWidth = useRef(0);
  const theme = useTheme();

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
      style={[styles.sliderTrack, { backgroundColor: theme.surfaceMuted }]}
      onLayout={onLayout}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={resolve}
      onResponderMove={resolve}
    >
      <View style={[styles.sliderFill, { width: `${pct}%` as unknown as number, backgroundColor: theme.accent }]} />
      <View style={[styles.sliderThumb, { left: `${pct}%` as unknown as number, backgroundColor: theme.text }]} />
    </View>
  );
}

export default function VolumeScreen() {
  const theme = useTheme();
  const { volume, loading, error, refresh, set, stepUp, stepDown } = useVolume();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Volume Control</ThemedText>

        <Card style={styles.card}>
          <TouchSlider value={volume} onValueChange={set} />

          <ThemedText style={[styles.volumeNumber, { color: theme.accent }]}>{'' + volume}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.caption}>
            Volume Level
          </ThemedText>

          <View style={styles.stepRow}>
            <Pressable
              style={({ pressed }) => [
                styles.stepButton,
                { backgroundColor: theme.surfaceMuted },
                pressed && { opacity: 0.6 },
                (loading || volume <= 0) && { opacity: 0.4 },
              ]}
              onPress={stepDown}
              disabled={loading || volume <= 0}
              accessibilityRole="button"
              accessibilityLabel="Decrease volume"
            >
              <ThemedText style={[styles.stepIcon, { color: theme.text }]}>−</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.stepButton,
                { backgroundColor: theme.accent },
                pressed && { opacity: 0.7 },
                (loading || volume >= 100) && { opacity: 0.4 },
              ]}
              onPress={stepUp}
              disabled={loading || volume >= 100}
              accessibilityRole="button"
              accessibilityLabel="Increase volume"
            >
              <ThemedText style={[styles.stepIcon, { color: theme.accentOn }]}>+</ThemedText>
            </Pressable>
          </View>
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
    alignItems: 'stretch',
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    justifyContent: 'center',
    overflow: 'visible',
    position: 'relative',
    marginVertical: Spacing.two,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: -9,
    top: -5,
  },
  volumeNumber: {
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 70,
    textAlign: 'center',
  },
  caption: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: -Spacing.two,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  stepButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    fontSize: 24,
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
