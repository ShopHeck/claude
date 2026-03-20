import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DAILY_STREAK_REWARDS } from '../../constants/gameConfig';
import { GAME_THEME } from '../../constants/colors';

export default function DailyRewardModal({ visible, onClaim, coinsToday, currentStreak }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🔥</Text>
          <Text style={styles.title}>Daily Reward!</Text>
          <Text style={styles.streak}>Day {currentStreak + 1} Streak</Text>

          <View style={styles.daysRow}>
            {DAILY_STREAK_REWARDS.map((coins, i) => (
              <View
                key={i}
                style={[
                  styles.dayBox,
                  i < currentStreak && styles.dayDone,
                  i === currentStreak && styles.dayToday,
                ]}
              >
                <Text style={styles.dayNum}>D{i + 1}</Text>
                <Text style={styles.dayCoins}>{coins}</Text>
                <Text style={styles.coinIcon}>🪙</Text>
              </View>
            ))}
          </View>

          <Text style={styles.coinReward}>+{coinsToday} COINS</Text>

          <TouchableOpacity onPress={onClaim} activeOpacity={0.85}>
            <LinearGradient
              colors={['#FFD60A', '#FB5607']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.claimBtn}
            >
              <Text style={styles.claimText}>CLAIM REWARD</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: GAME_THEME.cardBg,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GAME_THEME.cardBorder,
    width: '100%',
    maxWidth: 360,
  },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginBottom: 4 },
  streak: { fontSize: 14, color: GAME_THEME.textSecondary, marginBottom: 20 },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 20 },
  dayBox: {
    width: 40, height: 52, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2D3548', gap: 2,
  },
  dayDone: { backgroundColor: '#1a472a', borderColor: '#06D6A0', borderWidth: 1 },
  dayToday: { backgroundColor: '#4B44CC', borderColor: '#6C63FF', borderWidth: 2 },
  dayNum: { fontSize: 9, color: GAME_THEME.textSecondary, fontWeight: '700' },
  dayCoins: { fontSize: 12, color: '#FFFFFF', fontWeight: '800' },
  coinIcon: { fontSize: 10 },
  coinReward: { fontSize: 28, fontWeight: '900', color: GAME_THEME.coinGold, marginBottom: 20, letterSpacing: 2 },
  claimBtn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48 },
  claimText: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: 2 },
});
