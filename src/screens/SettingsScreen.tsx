import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { signOut } from '../services/firebase';
import { useSettings } from '../context/SettingsContext';

export const SettingsScreen: React.FC = () => {
  const { settings, setHiveMq, setUnit, setIntervalSeconds } = useSettings();
  const [brokerUrl, setBrokerUrl] = useState(settings.hiveMq.brokerUrl);
  const [port, setPort] = useState(String(settings.hiveMq.port));
  const [token, setToken] = useState(settings.hiveMq.token);

  const onSaveHiveMq = async () => {
    await setHiveMq({
      brokerUrl: brokerUrl.trim(),
      port: Number(port) || 8883,
      token: token.trim(),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>HiveMQ Broker</Text>
        <Text style={styles.label}>Broker URL</Text>
        <TextInput
          style={styles.input}
          placeholder="wss://your-broker.hivemq.cloud:8884/mqtt"
          placeholderTextColor="#a3a6a9"
          value={brokerUrl}
          onChangeText={setBrokerUrl}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Port</Text>
        <TextInput
          style={styles.input}
          placeholder="8883"
          placeholderTextColor="#a3a6a9"
          keyboardType="numeric"
          value={port}
          onChangeText={setPort}
        />
        <Text style={styles.label}>Token (Username)</Text>
        <TextInput
          style={styles.input}
          placeholder="your-hivemq-token"
          placeholderTextColor="#a3a6a9"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.saveButton} onPress={onSaveHiveMq}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Temperature Unit</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.chip, settings.unit === 'C' && styles.chipActive]}
            onPress={() => setUnit('C')}
          >
            <Text style={[styles.chipText, settings.unit === 'C' && styles.chipTextActive]}>°C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, settings.unit === 'F' && styles.chipActive]}
            onPress={() => setUnit('F')}
          >
            <Text style={[styles.chipText, settings.unit === 'F' && styles.chipTextActive]}>°F</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Data Interval</Text>
        <Text style={styles.intervalText}>{settings.intervalSeconds}s</Text>
        <View style={styles.chipRow}>
          {[5, 10, 30, 60].map((sec) => (
            <TouchableOpacity
              key={sec}
              style={[styles.chip, settings.intervalSeconds === sec && styles.chipActive]}
              onPress={() => setIntervalSeconds(sec)}
            >
              <Text style={[styles.chipText, settings.intervalSeconds === sec && styles.chipTextActive]}>
                {sec}s
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Field Note</Text>
        <Text style={styles.noteText}>
          ESP32 uses WiFiManager. At the transformer site, scan the QR code on the enclosure to connect to the correct WiFi network.
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#5c5c5c',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f0f0f0',
    color: '#1a1a1a',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#262626',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#f7f7f7',
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    backgroundColor: '#f0f0f0',
  },
  chipActive: {
    backgroundColor: '#262626',
    borderColor: '#262626',
  },
  chipText: {
    color: '#5c5c5c',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#f7f7f7',
  },
  intervalText: {
    fontSize: 13,
    color: '#5c5c5c',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 13,
    color: '#5c5c5c',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
