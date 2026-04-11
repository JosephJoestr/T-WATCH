import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import { useTransformerHistory } from '../context/TransformerHistoryContext';
import { buildHtmlReport, buildReportRows } from '../services/reportService';

export const ReportsScreen: React.FC = () => {
  const { history } = useTransformerHistory();

  const onGenerate = async (period: 'daily' | 'weekly' | 'monthly') => {
    const rows = buildReportRows(history);
    const html = buildHtmlReport(period, rows);
    await Print.printAsync({ html });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Generate Report</Text>
        <Text style={styles.cardSubtitle}>
          Export transformer data as a printable PDF report.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => onGenerate('daily')}>
          <Text style={styles.buttonText}>Daily Report</Text>
          <Text style={styles.buttonSub}>Last 24 hours of data</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.button} onPress={() => onGenerate('weekly')}>
          <Text style={styles.buttonText}>Weekly Report</Text>
          <Text style={styles.buttonSub}>Last 7 days of data</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.button} onPress={() => onGenerate('monthly')}>
          <Text style={styles.buttonText}>Monthly Report</Text>
          <Text style={styles.buttonSub}>Last 30 days of data</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Report Metrics</Text>
        <Text style={styles.infoText}>• Efficiency (? %)</Text>
        <Text style={styles.infoText}>• Copper Loss (I²R watts)</Text>
        <Text style={styles.infoText}>• Voltage Regulation (%)</Text>
        <Text style={styles.infoText}>• Temperature (°C)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#5c5c5c',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  buttonSub: {
    fontSize: 12,
    color: '#5c5c5c',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#5c5c5c',
    marginBottom: 4,
  },
});
