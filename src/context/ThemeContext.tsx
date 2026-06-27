import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import Storage from 'expo-sqlite/kv-store';

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'themeMode';
const DEFAULT_MODE: ThemeMode = 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  effective: EffectiveTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  loaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const raw = await Storage.getItem(STORAGE_KEY);
      if (!cancelled) {
        if (raw === 'light' || raw === 'dark' || raw === 'system') {
          setModeState(raw);
        }
        setLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    Storage.setItem(STORAGE_KEY, next);
  }, []);

  const effective: EffectiveTheme = useMemo(() => {
    if (mode === 'system') return system === 'light' ? 'light' : 'dark';
    return mode;
  }, [mode, system]);

  const toggle = useCallback(() => {
    setMode(effective === 'dark' ? 'light' : 'dark');
  }, [effective, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, effective, setMode, toggle, loaded }),
    [mode, effective, setMode, toggle, loaded],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
}
