import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { GAME_THEME } from '../../constants/colors';

export default function CoinDisplay({ balance, style }) {
  const [displayed, setDisplayed] = useState(balance);
  const scale = useSharedValue(1);
  const prevRef = useRef(balance);

  useEffect(() => {
    const delta = balance - prevRef.current;
    if (delta > 0) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 5 }),
        withSpring(1.0, { damping: 8 })
      );
    }
    prevRef.current = balance;
    setDisplayed(balance);
  }, [balance]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animStyle, style]}>
      <Text style={styles.coin}>🪙</Text>
      <Text style={styles.text}>{displayed.toLocaleString()}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,193,7,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.3)',
  },
  coin: { fontSize: 16 },
  text: {
    fontSize: 16,
    fontWeight: '800',
    color: GAME_THEME.coinGold,
  },
});
