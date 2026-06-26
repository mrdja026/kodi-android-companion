import { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSettings } from '@/context/SettingsContext';
import { testConnection } from '@/services/api';
import { ApiError } from '@/services/api';
import { Spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { proxyIp, proxyPort, setProxyIp, setProxyPort } = useSettings();

  const [ipDraft, setIpDraft] = useState(proxyIp);
  const [portDraft, setPortDraft] = useState(proxyPort);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const host = ipDraft || '192.168.0.234';
  const port = portDraft || '5149';
  const previewUrl = `http://${host}:${port}`;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await testConnection(previewUrl);
      setTestResult({ ok: true, msg: 'Connection successful!' });
    } catch (e) {
      const msg = e instanceof ApiError ? e.detail : 'Cannot reach proxy';
      setTestResult({ ok: false, msg });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    setProxyIp(ipDraft);
    setProxyPort(portDraft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.four, paddingBottom: insets.bottom + Spacing.four },
      ]}
    >
      <ThemedText type="subtitle" style={styles.title}>
        Proxy Settings
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.hint}>
        Enter the IP address of the PC running the proxy. Device and PC must be on the same WiFi network.
      </ThemedText>

      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText style={styles.label}>Proxy IP Address</ThemedText>
        <TextInput
          style={styles.input}
          value={ipDraft}
          onChangeText={setIpDraft}
          placeholder="192.168.0.100"
          placeholderTextColor="#666"
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ThemedText style={styles.label}>Proxy Port</ThemedText>
        <TextInput
          style={styles.input}
          value={portDraft}
          onChangeText={setPortDraft}
          placeholder="5149"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ThemedText themeColor="textSecondary" style={styles.preview}>
          URL: {previewUrl}
        </ThemedText>
      </ThemedView>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleTest}
        disabled={testing}
      >
        <ThemedText style={styles.buttonText}>
          {testing ? 'Testing...' : 'Test Connection'}
        </ThemedText>
      </Pressable>

      {testResult && (
        <ThemedView
          type="backgroundElement"
          style={[styles.resultBanner, testResult.ok ? styles.resultSuccess : styles.resultError]}
        >
          <ThemedText>{testResult.msg}</ThemedText>
        </ThemedView>
      )}

      <Pressable
        style={({ pressed }) => [styles.button, styles.saveButton, pressed && styles.buttonPressed]}
        onPress={handleSave}
      >
        <ThemedText style={styles.buttonText}>
          {saved ? 'Saved!' : 'Save & Connect'}
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: Spacing.one,
  },
  input: {
    backgroundColor: Platform.OS === 'android' ? '#1a1a1a' : '#1a1a1a',
    color: '#ffffff',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  preview: {
    fontSize: 12,
    marginTop: Spacing.one,
  },
  button: {
    backgroundColor: '#2a2a2a',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1a6b3c',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultBanner: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    alignItems: 'center',
  },
  resultSuccess: {
    backgroundColor: '#1a6b3c',
  },
  resultError: {
    backgroundColor: '#6b1a1a',
  },
});
