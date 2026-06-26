import { useState, useCallback, useRef } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { getVolume, setVolume, volumeUp, volumeDown } from '@/services/api';
import { ApiError } from '@/services/api';

const STEP = 5;
const DEBOUNCE_MS = 200;

export function useVolume() {
  const { proxyUrl } = useSettings();
  const [volume, setVolumeState] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const v = await getVolume(proxyUrl);
      setVolumeState(v);
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
    } finally {
      setLoading(false);
    }
  }, [proxyUrl]);

  const set = useCallback(
    async (level: number) => {
      setVolumeState(level);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        setError(null);
        try {
          const v = await setVolume(proxyUrl, level);
          setVolumeState(v);
        } catch (e) {
          setError(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
        }
      }, DEBOUNCE_MS);
    },
    [proxyUrl],
  );

  const stepUp = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const v = await volumeUp(proxyUrl, STEP);
      setVolumeState(v);
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
    } finally {
      setLoading(false);
    }
  }, [proxyUrl]);

  const stepDown = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const v = await volumeDown(proxyUrl, STEP);
      setVolumeState(v);
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
    } finally {
      setLoading(false);
    }
  }, [proxyUrl]);

  return { volume, loading, error, refresh, set, stepUp, stepDown };
}
