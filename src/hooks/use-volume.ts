import { useState, useCallback } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { getVolume, setVolume, volumeUp, volumeDown, ApiError } from '@/services/api';

const STEP = 10;

export function useVolume() {
  const { proxyUrl } = useSettings();
  const [volume, setVolumeState] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const set = useCallback(async (level: number) => {
    setVolumeState(level);
    try {
      await setVolume(proxyUrl, level);
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
    }
  }, [proxyUrl]);

  const stepUp = useCallback(async () => {
    setError(null);
    setLoading(true);
    setVolumeState(prev => Math.min(100, prev + STEP));
    try {
      await volumeUp(proxyUrl, STEP);
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
    } finally {
      setLoading(false);
    }
  }, [proxyUrl]);

  const stepDown = useCallback(async () => {
    setError(null);
    setLoading(true);
    setVolumeState(prev => Math.max(0, prev - STEP));
    try {
      await volumeDown(proxyUrl, STEP);
    } catch (e) {
      setError(e instanceof ApiError ? e.detail : 'Cannot reach proxy');
    } finally {
      setLoading(false);
    }
  }, [proxyUrl]);

  return { volume, loading, error, refresh, set, stepUp, stepDown };
}
