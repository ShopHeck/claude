import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  interpolateColor,
} from 'react-native-reanimated';
import { GAME_THEME } from '../../constants/colors';

export default function TimerBar({ timeLeft, timeLimit }) {
  const fraction = timeLimit > 0 ? Math.max(0, timeLeft / timeLimit) : 0;
  const width = useSharedValue(fraction);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    width.value = withTiming(fraction, { duration: 100 });

    if (fraction < 0.2) {
      // Urgent pulse
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 200 }),
          withTiming(1, { duration: 200 })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(pulseOpacity);
      pulseOpacity.value = withTiming(1, { duration: 100 });
    }
  }, [fraction]);

  const barStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      width.value,
      [0, 0.3, 0.5, 1],
      [GAME_THEME.timerRed, GAME_THEME.timerYellow, GAME_THEME.timerYellow, GAME_THEME.timerGreen]
    );
    return {
      width: `${width.value * 100}%`,
      backgroundColor: color,
      opacity: pulseOpacity.value,
    };
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, barStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: '#2D3548',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
