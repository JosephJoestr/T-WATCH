import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { ParsedTransformerData } from '../types/TransformerData';
import { TemperatureGauge } from '../components/TemperatureGauge';
import { TrendChart } from '../components/TrendChart';
import { useSettings } from '../context/SettingsContext';
import { useTransformerHistory } from '../context/TransformerHistoryContext';
import { createMqttService } from '../services/mqttService';
import { cacheReading } from '../services/offlineStorage';
import { saveReading } from '../services/firebase';

export const DashboardScreen: React.FC = () => {
  const { settings } = useSettings();
  const { appendReading, history } = useTransformerHistory();
  const [liveData, setLiveData] = useState<ParsedTransformerData | null>(null);
  const mqttRef = useRef<ReturnType<typeof createMqttService> | null>(null);

  useEffect(() => {
    const service = createMqttService({
      brokerUrl: settings.hiveMq.brokerUrl,
      username: settings.hiveMq.token,
      password: undefined,
    });
    mqttRef.current = service;
    service.connect();

    const unsub = service.onData(async (d) => {
      setLiveData(d);
      appendReading(d);
      await cacheReading(d);
      await saveReading(d);
    });

    return () => {
      unsub();
      service.disconnect();
      mqttRef.current = null;
    };
  }, [settings.hiveMq.brokerUrl, settings.hiveMq.token, appendReading]);

  const mqttConfigured = !!settings.hiveMq.brokerUrl;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {liveData ? (
        <>
          <TemperatureGauge data={liveData} unit={settings.unit} />
          <TrendChart data={history} />
          <View style={styles.row}>
            <View style={styles.card}>
              <Text style={styles.label}>Relay Status</Text>
              <View style={styles.statusRow}>
                <View style={[styles.dot, { backgroundColor: liveData.relay === 1 ? '#ef4444' : '#4ade80' }]} />
                <Text style={styles.value}>{liveData.relay === 1 ? 'TRIPPED' : 'NORMAL'}</Text>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Buzzer</Text>
              <Switch
                value={liveData.buzzer}
                onValueChange={() => {}}
                trackColor={{ false: '#e8e8e8', true: '#4ade80' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
          <TouchableOpacity
            disabled={!mqttConfigured}
            style={[styles.untripButton, { opacity: mqttConfigured ? 1 : 0.4 }]}
            onPress={() => mqttRef.current?.publishUntrip()}
          >
            <Text style={styles.untripText}>Manual Untrip</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.waitingCard}>
          <Text style={styles.waitingText}>Waiting for live data...</Text>
          <Text style={styles.waitingSubText}>Configure your HiveMQ broker in Settings</Text>
        </View>
      )}
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  label: {
    color: '#5c5c5c',
    fontSize: 12,
    marginBottom: 6,
  },
  value: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  untripButton: {
    backgroundColor: '#262626',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  untripText: {
    color: '#f7f7f7',
    fontWeight: '600',
    fontSize: 15,
  },
  waitingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  waitingText: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 16,
  },
  waitingSubText: {
    color: '#5c5c5c',
    fontSize: 13,
    marginTop: 6,
  },
});
