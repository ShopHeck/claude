import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, Easing,
} from 'react-native-reanimated';
import { GAME_THEME } from '../constants/colors';
import { useGameState } from '../store/useGameState';
import { useDailyReward } from '../hooks/useDailyReward';
import { useAchievements } from '../hooks/useAchievements';
import CoinDisplay from '../components/ui/CoinDisplay';
import DailyRewardModal from '../components/ui/DailyRewardModal';
import GradientButton from '../components/ui/GradientButton';
import LevelBadge from '../components/ui/LevelBadge';
import RankBadge from '../components/ui/RankBadge';
import AchievementToast from '../components/ui/AchievementToast';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { state } = useGameState();
  const { canClaim, coinsToday, currentStreak, claimReward } = useDailyReward();
  const { toastQueue, dismissToast } = useAchievements();
  const [showDaily, setShowDaily] = useState(false);

  // Animated background drift
  const bgOffset = useSharedValue(0);
  useEffect(() => {
    bgOffset.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.linear }),
      -1,
      true
    );
    if (canClaim) {
      const t = setTimeout(() => setShowDaily(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const bgStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bgOffset.value * 20 - 10 }],
    opacity: 0.06,
  }));

  const handleClaim = () => {
    claimReward();
    setShowDaily(false);
  };

  const level = state.player.highestLevel + 1;

  return (
    <SafeAreaView style={styles.root}>
      {/* Animated background */}
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
        <LinearGradient colors={['#FF4D6D', '#9B5DE5', '#4361EE']} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <CoinDisplay balance={state.player.coinsBalance} />
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.gearBtn}>
          <Text style={styles.gearIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Player card */}
        <LinearGradient
          colors={['#1A1F2E', '#252B3D']}
          style={styles.playerCard}
        >
          <LevelBadge level={level} size={64} />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{state.player.name}</Text>
            <RankBadge totalScore={state.player.totalScore} />
            <Text style={styles.totalScore}>
              {state.player.totalScore.toLocaleString()} pts
            </Text>
          </View>
          {currentStreak > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {currentStreak}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Daily reward banner */}
        {canClaim ? (
          <TouchableOpacity onPress={() => setShowDaily(true)} activeOpacity={0.85}>
            <LinearGradient
              colors={['#FFD60A', '#FB5607']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dailyBanner}
            >
              <Text style={styles.dailyEmoji}>🎁</Text>
              <View>
                <Text style={styles.dailyTitle}>Daily Reward Available!</Text>
                <Text style={styles.dailySubtitle}>Tap to claim {coinsToday} coins</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.dailyBannerClaimed}>
            <Text style={styles.dailyClaimedText}>✅ Daily reward claimed • Come back tomorrow</Text>
          </View>
        )}

        {/* Main play button */}
        <GradientButton
          label="▶  PLAY"
          colors={['#FF4D6D', '#9B5DE5']}
          onPress={() => navigation.navigate('LevelSelect')}
          style={styles.playBtn}
          textStyle={{ fontSize: 24, letterSpacing: 4 }}
        />

        {/* Sub buttons */}
        <View style={styles.subRow}>
          <TouchableOpacity style={styles.subBtn} onPress={() => navigation.navigate('Leaderboard')}>
            <Text style={styles.subIcon}>🏆</Text>
            <Text style={styles.subLabel}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subBtn} onPress={() => navigation.navigate('Achievements')}>
            <Text style={styles.subIcon}>⭐</Text>
            <Text style={styles.subLabel}>Achievements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subBtn} onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.subIcon}>🛒</Text>
            <Text style={styles.subLabel}>Shop</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <DailyRewardModal
        visible={showDaily}
        onClaim={handleClaim}
        coinsToday={coinsToday}
        currentStreak={currentStreak}
      />

      {toastQueue.length > 0 && (
        <AchievementToast achievement={toastQueue[0]} onDone={dismissToast} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAME_THEME.gameBg },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4,
  },
  gearBtn: { padding: 8 },
  gearIcon: { fontSize: 24 },
  scroll: { padding: 20, paddingBottom: 40, gap: 16 },
  playerCard: {
    borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
  },
  playerInfo: { flex: 1, gap: 6 },
  playerName: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  totalScore: { fontSize: 13, color: GAME_THEME.textSecondary, fontWeight: '600' },
  streakBadge: {
    backgroundColor: 'rgba(255,165,0,0.15)', borderRadius: 12,
    paddingVertical: 6, paddingHorizontal: 10,
    borderWidth: 1, borderColor: 'rgba(255,165,0,0.3)',
  },
  streakText: { fontSize: 18, fontWeight: '800', color: '#FFA500' },
  dailyBanner: {
    borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  dailyEmoji: { fontSize: 32 },
  dailyTitle: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  dailySubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  dailyBannerClaimed: {
    borderRadius: 16, padding: 14,
    backgroundColor: GAME_THEME.cardBg,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
    alignItems: 'center',
  },
  dailyClaimedText: { fontSize: 13, color: GAME_THEME.textSecondary },
  playBtn: { marginVertical: 8 },
  subRow: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  subBtn: {
    flex: 1, backgroundColor: GAME_THEME.cardBg,
    borderRadius: 16, padding: 16, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
  },
  subIcon: { fontSize: 28 },
  subLabel: { fontSize: 12, fontWeight: '700', color: GAME_THEME.textSecondary },
});
