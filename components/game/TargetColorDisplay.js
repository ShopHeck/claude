import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { TILE_COLORS, TILE_COLOR_NAMES, GAME_THEME } from '../../constants/colors';

export default function TargetColorDisplay({ targetColor, phase }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });
  }, [targetColor]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const color = TILE_COLORS[targetColor] || '#888';
  const name = TILE_COLOR_NAMES[targetColor] || targetColor;

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Text style={styles.label}>TAP ALL</Text>
      <View style={[styles.colorSwatch, { backgroundColor: color }]} />
      <Text style={[styles.colorName, { color }]}>{name}</Text>
      <Text style={styles.label}>TILES</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: GAME_THEME.cardBg,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: GAME_THEME.cardBorder,
  },
  label: {
    color: GAME_THEME.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  colorSwatch: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },
  colorName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
