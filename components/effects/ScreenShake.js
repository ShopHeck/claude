import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const ScreenShake = forwardRef(function ScreenShake({ children, style }, ref) {
  const translateX = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    shake() {
      translateX.value = withSequence(
        withTiming(-12, { duration: 50 }),
        withTiming(12,  { duration: 50 }),
        withTiming(-8,  { duration: 50 }),
        withTiming(8,   { duration: 50 }),
        withTiming(-4,  { duration: 40 }),
        withTiming(0,   { duration: 40 }),
      );
    },
  }));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
});

export default ScreenShake;
