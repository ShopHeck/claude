import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  cancelAnimation,
} from 'react-native-reanimated';
import { TILE_COLORS } from '../../constants/colors';

const TILE_MARGIN = 5;

export default function Tile({ tile, tileSize, onPress, phase }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const borderOpacity = useSharedValue(0);

  useEffect(() => {
    if (tile.isCleared) {
      // Pop animation
      scale.value = withSequence(
        withSpring(1.25, { damping: 6, stiffness: 200 }),
        withTiming(0, { duration: 200 })
      );
      opacity.value = withTiming(0, { duration: 250 });
    } else if (tile.isWrong) {
      // Error flash - handled by background color changing
      scale.value = withSequence(
        withTiming(0.9, { duration: 80 }),
        withTiming(1, { duration: 80 })
      );
    } else {
      scale.value = withSpring(1, { damping: 12 });
      opacity.value = withTiming(1, { duration: 150 });
    }
  }, [tile.isCleared, tile.isWrong]);

  // Preview phase: pulse glow border on target tiles
  useEffect(() => {
    if (phase === 'preview' && tile.isTarget) {
      borderOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0.3, { duration: 200 })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withSpring(1.08, { damping: 10 }),
          withSpring(1.0, { damping: 10 })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(borderOpacity);
      cancelAnimation(scale);
      borderOpacity.value = withTiming(0, { duration: 150 });
      if (!tile.isCleared && !tile.isWrong) {
        scale.value = withSpring(1, { damping: 12 });
      }
    }
  }, [phase]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: borderOpacity.value,
  }));

  const bgColor = tile.isWrong
    ? '#FF4D6D'
    : tile.isCleared
    ? 'transparent'
    : TILE_COLORS[tile.color] || '#888';

  const size = tileSize - TILE_MARGIN * 2;

  return (
    <TouchableOpacity
      onPress={() => onPress(tile)}
      activeOpacity={0.8}
      style={{ width: tileSize, height: tileSize, padding: TILE_MARGIN }}
      disabled={tile.isCleared || phase !== 'playing'}
    >
      <Animated.View style={[styles.tileInner, { width: size, height: size, backgroundColor: bgColor }, animatedStyle]}>
        {/* Glow border for preview */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.glow,
            { borderColor: TILE_COLORS[tile.color] || '#fff' },
            glowStyle,
          ]}
          pointerEvents="none"
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tileInner: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  glow: {
    borderRadius: 12,
    borderWidth: 3,
  },
});
