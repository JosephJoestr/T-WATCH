import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from './src/services/firebase';
import { SettingsProvider } from './src/context/SettingsContext';
import { TransformerHistoryProvider } from './src/context/TransformerHistoryContext';
import { BottomTabs } from './src/navigation/BottomTabs';
import { LoginScreen } from './src/screens/LoginScreen';
import { initOfflineDb } from './src/services/offlineStorage';

export default function App() {
  const [user, setUser] = useState<unknown>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged((u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    initOfflineDb();
  }, []);

  if (initializing) return null;

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <TransformerHistoryProvider>
          <StatusBar style="dark" backgroundColor="#f7f7f7" />
          <NavigationContainer>
            {user ? <BottomTabs /> : <LoginScreen />}
          </NavigationContainer>
        </TransformerHistoryProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
