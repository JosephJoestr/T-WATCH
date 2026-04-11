import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TempUnit = 'C' | 'F';

export interface HiveMqConfig {
  brokerUrl: string;
  port: number;
  token: string;
}

export interface SettingsState {
  hiveMq: HiveMqConfig;
  unit: TempUnit;
  intervalSeconds: number;
}

const defaultState: SettingsState = {
  hiveMq: { brokerUrl: '', port: 8883, token: '' },
  unit: 'C',
  intervalSeconds: 5,
};

interface SettingsContextValue {
  settings: SettingsState;
  setHiveMq: (cfg: HiveMqConfig) => Promise<void>;
  setUnit: (unit: TempUnit) => Promise<void>;
  setIntervalSeconds: (sec: number) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
const STORAGE_KEY = 'transformer_watch_settings';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultState);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        try { setSettings(JSON.parse(raw)); } catch {}
      }
    })();
  }, []);

  const persist = async (next: SettingsState) => {
    setSettings(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const setHiveMq = async (cfg: HiveMqConfig) => persist({ ...settings, hiveMq: cfg });
  const setUnit = async (unit: TempUnit) => persist({ ...settings, unit });
  const setIntervalSeconds = async (sec: number) => persist({ ...settings, intervalSeconds: sec });

  return (
    <SettingsContext.Provider value={{ settings, setHiveMq, setUnit, setIntervalSeconds }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
