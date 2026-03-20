import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GAME_THEME } from '../constants/colors';
import { ACHIEVEMENTS } from '../constants/achievements';
import { useGameState } from '../store/useGameState';

export default function AchievementsScreen() {
  const navigation = useNavigation();
  const { state } = useGameState();

  const unlockedCount = Object.keys(state.achievements).length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ACHIEVEMENTS</Text>
        <Text style={styles.count}>{unlockedCount}/{ACHIEVEMENTS.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = !!state.achievements[ach.id];
          return (
            <View
              key={ach.id}
              style={[styles.card, !isUnlocked && styles.cardLocked]}
            >
              <Text style={[styles.icon, !isUnlocked && styles.iconLocked]}>
                {isUnlocked ? ach.icon : '🔒'}
              </Text>
              <View style={styles.info}>
                <Text style={[styles.achTitle, !isUnlocked && styles.achTitleLocked]}>
                  {ach.title}
                </Text>
                <Text style={styles.achDesc}>{ach.desc}</Text>
                {isUnlocked && (
                  <Text style={styles.unlockedText}>
                    ✅ Unlocked {new Date(state.achievements[ach.id].unlockedAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
              <View style={[styles.rewardBadge, isUnlocked && styles.rewardBadgeUnlocked]}>
                <Text style={styles.rewardText}>+{ach.reward}</Text>
                <Text style={styles.rewardCoin}>🪙</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAME_THEME.gameBg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 24, color: '#FFFFFF' },
  title: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: 3 },
  count: { fontSize: 15, fontWeight: '800', color: GAME_THEME.coinGold },
  scroll: { padding: 20, paddingBottom: 40, gap: 10 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: GAME_THEME.cardBg, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
  },
  cardLocked: { opacity: 0.5 },
  icon: { fontSize: 32 },
  iconLocked: { opacity: 0.4 },
  info: { flex: 1, gap: 3 },
  achTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  achTitleLocked: { color: GAME_THEME.textSecondary },
  achDesc: { fontSize: 12, color: GAME_THEME.textSecondary },
  unlockedText: { fontSize: 11, color: GAME_THEME.success, marginTop: 2 },
  rewardBadge: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2D3548', borderRadius: 10,
    paddingVertical: 6, paddingHorizontal: 10, gap: 2,
  },
  rewardBadgeUnlocked: { backgroundColor: 'rgba(255,193,7,0.15)', borderWidth: 1, borderColor: 'rgba(255,193,7,0.3)' },
  rewardText: { fontSize: 13, fontWeight: '800', color: GAME_THEME.coinGold },
  rewardCoin: { fontSize: 14 },
});
