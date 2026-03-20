import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Rect } from 'react-native-svg';

const { width: SW, height: SH } = Dimensions.get('window');
const PIECE_COUNT = 35;
const COLORS = ['#FF4D6D', '#4361EE', '#06D6A0', '#FFD60A', '#9B5DE5', '#FB5607', '#FFFFFF'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function ConfettiPiece({ piece }) {
  const translateY = useSharedValue(-30);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const duration = randomBetween(1200, 2200);
    translateY.value = withTiming(SH + 40, { duration, easing: Easing.linear });
    opacity.value = withTiming(0, { duration: duration * 0.8 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ position: 'absolute', left: piece.x, top: piece.y }, style]}>
      <Svg width={piece.size} height={piece.size}>
        {piece.shape === 'circle' ? (
          <Circle cx={piece.size / 2} cy={piece.size / 2} r={piece.size / 2} fill={piece.color} />
        ) : (
          <Rect
            x={0}
            y={0}
            width={piece.size}
            height={piece.size * 0.6}
            fill={piece.color}
            transform={`rotate(${piece.rotation}, ${piece.size / 2}, ${piece.size * 0.3})`}
          />
        )}
      </Svg>
    </Animated.View>
  );
}

export default function ConfettiOverlay({ active }) {
  const pieces = useRef(
    Array.from({ length: PIECE_COUNT }, () => ({
      x: randomBetween(0, SW),
      y: randomBetween(-20, 0),
      size: randomBetween(8, 16),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
      rotation: randomBetween(0, 360),
    }))
  ).current;

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} piece={p} />
      ))}
    </View>
  );
}
