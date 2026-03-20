import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { GAME_THEME } from '../../constants/colors';

const HOLD_DURATION = 2500;

export default function AchievementToast({ achievement, onDone }) {
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 14, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 200 });

    const timer = setTimeout(() => {
      translateY.value = withTiming(-120, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
      setTimeout(onDone, 320);
    }, HOLD_DURATION);

    return () => clearTimeout(timer);
  }, [achievement]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!achievement) return null;

  return (
    <Animated.View style={[styles.container, style]} pointerEvents="none">
      <Text style={styles.icon}>{achievement.icon}</Text>
      <View style={styles.textArea}>
        <Text style={styles.headline}>Achievement Unlocked!</Text>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.desc}>{achievement.desc}</Text>
      </View>
      <View style={styles.reward}>
        <Text style={styles.rewardText}>+{achievement.reward} 🪙</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: GAME_THEME.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GAME_THEME.coinGold,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    zIndex: 1000,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  icon: { fontSize: 30 },
  textArea: { flex: 1 },
  headline: { fontSize: 10, fontWeight: '700', color: GAME_THEME.coinGold, letterSpacing: 1 },
  title: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  desc: { fontSize: 12, color: GAME_THEME.textSecondary },
  reward: {
    backgroundColor: 'rgba(255,193,7,0.15)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  rewardText: { fontSize: 14, fontWeight: '800', color: GAME_THEME.coinGold },
});
