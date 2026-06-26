import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import Storage from 'expo-sqlite/kv-store';

const DEFAULT_PORT = '5149';

interface SettingsContextValue {
  proxyIp: string;
  proxyPort: string;
  proxyUrl: string;
  setProxyIp: (ip: string) => void;
  setProxyPort: (port: string) => void;
  loaded: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [proxyIp, setProxyIpState] = useState('');
  const [proxyPort, setProxyPortState] = useState(DEFAULT_PORT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const ip = await Storage.getItem('proxyIp');
      const port = await Storage.getItem('proxyPort');
      if (ip) setProxyIpState(ip);
      if (port) setProxyPortState(port);
      setLoaded(true);
    }
    load();
  }, []);

  const setProxyIp = useCallback((ip: string) => {
    setProxyIpState(ip);
    Storage.setItem('proxyIp', ip);
  }, []);

  const setProxyPort = useCallback((port: string) => {
    setProxyPortState(port);
    Storage.setItem('proxyPort', port);
  }, []);

  const host = proxyIp || '192.168.0.234';
  const port = proxyPort || DEFAULT_PORT;
  const proxyUrl = `http://${host}:${port}`;

  return (
    <SettingsContext.Provider value={{ proxyIp, proxyPort, proxyUrl, setProxyIp, setProxyPort, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
