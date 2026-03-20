import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withDelay, withSpring, withTiming,
} from 'react-native-reanimated';
import { GAME_THEME } from '../constants/colors';
import { TOTAL_LEVELS } from '../constants/gameConfig';
import ConfettiOverlay from '../components/effects/ConfettiOverlay';
import GradientButton from '../components/ui/GradientButton';
import CoinDisplay from '../components/ui/CoinDisplay';
import { useGameState } from '../store/useGameState';

function Star({ filled, delay }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 5, stiffness: 200 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.star, { opacity: filled ? 1 : 0.2 }, style]}>
      ⭐
    </Animated.Text>
  );
}

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { state } = useGameState();
  const { levelIndex, score, stars, coinsEarned, maxCombo } = route.params;

  const scoreScale = useSharedValue(0.5);
  const scoreOpacity = useSharedValue(0);

  useEffect(() => {
    scoreScale.value = withDelay(300, withSpring(1, { damping: 8 }));
    scoreOpacity.value = withDelay(300, withTiming(1, { duration: 300 }));
  }, []);

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
    opacity: scoreOpacity.value,
  }));

  const hasNext = levelIndex < TOTAL_LEVELS;

  return (
    <SafeAreaView style={styles.root}>
      <ConfettiOverlay active={stars >= 2} />

      <LinearGradient colors={['#0D1117', '#1A1F2E']} style={styles.card}>
        <Text style={styles.heading}>
          {stars === 3 ? '🎉 PERFECT!' : stars === 2 ? '✨ GREAT!' : '✅ LEVEL CLEAR!'}
        </Text>
        <Text style={styles.levelLabel}>Level {levelIndex}</Text>

        {/* Stars */}
        <View style={styles.starsRow}>
          {[1, 2, 3].map(i => (
            <Star key={i} filled={i <= stars} delay={i * 250} />
          ))}
        </View>

        {/* Score */}
        <Animated.View style={scoreStyle}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>x{maxCombo}</Text>
            <Text style={styles.statLabel}>Best Combo</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: GAME_THEME.coinGold }]}>+{coinsEarned}</Text>
            <Text style={styles.statLabel}>Coins Earned</Text>
          </View>
        </View>

        <CoinDisplay balance={state.player.coinsBalance} style={{ alignSelf: 'center', marginVertical: 8 }} />

        {/* Action buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.secondaryBtnText}>🏠 Home</Text>
          </TouchableOpacity>

          {hasNext && (
            <GradientButton
              label="NEXT →"
              colors={['#FF4D6D', '#9B5DE5']}
              onPress={() => navigation.replace('Game', { levelIndex: levelIndex + 1 })}
              style={{ flex: 1 }}
            />
          )}

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.replace('Game', { levelIndex })}
          >
            <Text style={styles.secondaryBtnText}>🔄 Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAME_THEME.gameBg, justifyContent: 'center' },
  card: {
    margin: 20, borderRadius: 28, padding: 32, alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
  },
  heading: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },
  levelLabel: { fontSize: 14, color: GAME_THEME.textSecondary, fontWeight: '600', letterSpacing: 2 },
  starsRow: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 40 },
  scoreLabel: { fontSize: 12, color: GAME_THEME.textSecondary, letterSpacing: 2, textAlign: 'center' },
  scoreValue: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  statsRow: { flexDirection: 'row', gap: 24 },
  stat: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: GAME_THEME.textSecondary, fontWeight: '600', letterSpacing: 1 },
  btnRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 8 },
  secondaryBtn: {
    flex: 1, backgroundColor: GAME_THEME.cardBg, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
