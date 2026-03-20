import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WORLD_THEMES, LEVELS_PER_WORLD } from '../../constants/gameConfig';

export default function LevelBadge({ level, size = 48, style }) {
  const worldIndex = Math.floor((level - 1) / LEVELS_PER_WORLD) % WORLD_THEMES.length;
  const theme = WORLD_THEMES[worldIndex];

  return (
    <LinearGradient
      colors={theme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.badge, { width: size, height: size, borderRadius: size / 4 }, style]}
    >
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>{level}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
