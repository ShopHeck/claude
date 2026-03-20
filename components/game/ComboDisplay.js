import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { GAME_THEME } from '../../constants/colors';

export default function ComboDisplay({ combo }) {
  const scale = useSharedValue(1);
  const colorAnim = useSharedValue(0);

  useEffect(() => {
    if (combo > 1) {
      scale.value = withSequence(
        withSpring(1.5, { damping: 5, stiffness: 300 }),
        withSpring(1.0, { damping: 8 })
      );
    }
    colorAnim.value = withTiming(Math.min(combo / 10, 1), { duration: 200 });
  }, [combo]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(colorAnim.value, [0, 0.5, 1], ['#FFFFFF', '#FFD700', '#FF4D6D']),
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Animated.Text style={[styles.text, textStyle]}>
        x{combo}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
