import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GAME_THEME } from '../../constants/colors';
import { getRank } from '../../utils/rankCalc';

export default function RankBadge({ totalScore, style }) {
  const { label, colorKey } = getRank(totalScore);
  const color = GAME_THEME[colorKey] || '#888';

  const emoji =
    label === 'Diamond' ? '💎' :
    label === 'Gold'    ? '🥇' :
    label === 'Silver'  ? '🥈' : '🥉';

  return (
    <View style={[styles.container, { borderColor: color }, style]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  emoji: { fontSize: 16 },
  label: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
});
