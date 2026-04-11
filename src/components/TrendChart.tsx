import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ParsedTransformerData } from '../types/TransformerData';

const screenWidth = Dimensions.get('window').width;

interface Props {
  data: ParsedTransformerData[];
}

export const TrendChart: React.FC<Props> = ({ data }) => {
  if (!data.length) return null;

  const labels = data.map((d) => d.timestamp.getHours().toString());
  const temps = data.map((d) => d.temp);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Temperature Trend</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: temps }],
        }}
        width={screenWidth - 64}
        height={180}
        withDots={false}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => gba(46, 50, 56, ),
          labelColor: () => '#787d82',
          fillShadowGradient: '#2e3238',
          fillShadowGradientOpacity: 0.35,
          fillShadowGradientToOpacity: 0.02,
          propsForBackgroundLines: {
            stroke: '#e8e8e8',
            strokeWidth: 1,
          },
          propsForLabels: {
            fontSize: 11,
          },
        }}
        bezier
        style={{ borderRadius: 6 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#d4d4d4',
  },
  title: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
});
