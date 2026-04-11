import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ParsedTransformerData } from '../types/TransformerData';
import { TempUnit } from '../context/SettingsContext';

interface Props {
  data: ParsedTransformerData;
  unit: TempUnit;
}

export const TemperatureGauge: React.FC<Props> = ({ data, unit }) => {
  const displayTemp = unit === 'C' ? data.temp : (data.temp * 9) / 5 + 32;

  let statusColor = '#4ade80';
  if (data.status === 'CRITICAL') statusColor = '#ef4444';
  else if (data.status === 'WARNING') statusColor = '#facc15';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.gaugeCircle, { borderColor: statusColor }]}>
          <Text style={[styles.tempText, { color: statusColor }]}>
            {displayTemp.toFixed(1)}
          </Text>
          <Text style={styles.unitText}>°{unit}</Text>
        </View>
        <View style={styles.info}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{data.status}</Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Current</Text>
            <Text style={styles.metricValue}>{data.current.toFixed(2)} A</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Voltage</Text>
            <Text style={styles.metricValue}>{data.voltage.toFixed(1)} V</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Device</Text>
            <Text style={styles.metricValue}>{data.deviceId}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  gaugeCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  tempText: {
    fontSize: 26,
    fontWeight: '700',
  },
  unitText: {
    fontSize: 13,
    color: '#5c5c5c',
    marginTop: -4,
  },
  info: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  statusText: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metricLabel: {
    color: '#5c5c5c',
    fontSize: 13,
  },
  metricValue: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },
});
