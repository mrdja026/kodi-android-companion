import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/card';
import { useSettings } from '@/context/SettingsContext';
import { testConnection, ApiError } from '@/services/api';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

type ConnectionStatus = 'Not Connected' | 'Testing…' | 'Connected';

export default function SettingsScreen() {
  const theme = useTheme();
  const { proxyIp, proxyPort, setProxyIp, setProxyPort } = useSettings();

  const [ipDraft, setIpDraft] = useState(proxyIp);
  const [portDraft, setPortDraft] = useState(proxyPort);
  const [status, setStatus] = useState<ConnectionStatus>('Not Connected');
  const [detail, setDetail] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const host = ipDraft || '192.168.0.234';
  const port = portDraft || '5149';
  const previewUrl = `http://${host}:${port}`;

  const handleConnect = async () => {
    setStatus('Testing…');
    setDetail(null);
    try {
      await testConnection(previewUrl);
      setStatus('Connected');
    } catch (e) {
      setStatus('Not Connected');
      setDetail(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
    }
  };

  const handleSave = () => {
    setProxyIp(ipDraft);
    setProxyPort(portDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pillBg =
    status === 'Connected'
      ? theme.accent
      : status === 'Testing…'
        ? theme.surfaceMuted
        : detail
          ? theme.danger
          : theme.surfaceMuted;
  const pillFg = status === 'Connected' ? theme.accentOn : detail ? theme.dangerOn : theme.textSecondary;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText style={styles.title}>Proxy Settings</ThemedText>

      <Card style={styles.card}>
        <ThemedText style={styles.label}>Proxy Host</ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
          ]}
          value={ipDraft}
          onChangeText={setIpDraft}
          placeholder="192.168.0.100"
          placeholderTextColor={theme.textSecondary}
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ThemedText style={styles.label}>Port</ThemedText>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
          ]}
          value={portDraft}
          onChangeText={setPortDraft}
          placeholder="5149"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          onPress={handleConnect}
          disabled={status === 'Testing…'}
          accessibilityRole="button"
          accessibilityLabel="Connect"
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: theme.accent },
            pressed && { opacity: 0.7 },
            status === 'Testing…' && { opacity: 0.6 },
          ]}
        >
          <ThemedText style={[styles.primaryButtonText, { color: theme.accentOn }]}>Connect</ThemedText>
        </Pressable>

        <View style={[styles.statusPill, { backgroundColor: pillBg }]}>
          <ThemedText style={[styles.statusText, { color: pillFg }]}>{status}</ThemedText>
        </View>
        {detail && status === 'Not Connected' && (
          <ThemedText themeColor="textSecondary" style={styles.detail}>
            {detail}
          </ThemedText>
        )}

        <Pressable
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save and continue"
          style={({ pressed }) => [
            styles.secondaryButton,
            { backgroundColor: theme.surfaceMuted },
            pressed && { opacity: 0.7 },
          ]}
        >
          <ThemedText style={[styles.secondaryButtonText, { color: theme.text }]}>
            {saved ? 'Saved' : 'Save & Continue'}
          </ThemedText>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.one,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  primaryButton: {
    borderRadius: 10,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusPill: {
    alignSelf: 'stretch',
    borderRadius: 8,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detail: {
    textAlign: 'center',
    fontSize: 12,
  },
  secondaryButton: {
    borderRadius: 10,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
