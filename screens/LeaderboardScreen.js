import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GAME_THEME } from '../constants/colors';
import { insertPlayerInLeaderboard } from '../utils/rankCalc';
import { useGameState } from '../store/useGameState';
import RankBadge from '../components/ui/RankBadge';

function RankMedal({ rank }) {
  if (rank === 1) return <Text style={styles.medal}>🥇</Text>;
  if (rank === 2) return <Text style={styles.medal}>🥈</Text>;
  if (rank === 3) return <Text style={styles.medal}>🥉</Text>;
  return <Text style={styles.rankNum}>#{rank}</Text>;
}

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const { state } = useGameState();
  const [tab, setTab] = useState('global'); // global | personal

  const globalList = insertPlayerInLeaderboard(state.player.name, state.player.totalScore);
  const personalBests = [...state.leaderboard.personalBests]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>LEADERBOARD</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['global', 'personal'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'global' ? '🌍 Global' : '👤 Personal Bests'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'global' ? (
          globalList.map(entry => (
            <View
              key={`${entry.rank}-${entry.name}`}
              style={[styles.row, entry.isPlayer && styles.rowPlayer]}
            >
              <RankMedal rank={entry.rank} />
              <Text style={[styles.name, entry.isPlayer && styles.namePlayer]} numberOfLines={1}>
                {entry.name}{entry.isPlayer ? ' (You)' : ''}
              </Text>
              <Text style={[styles.score, entry.isPlayer && styles.scorePlayer]}>
                {entry.score.toLocaleString()}
              </Text>
              {entry.isPlayer && (
                <RankBadge totalScore={entry.score} style={{ marginLeft: 4 }} />
              )}
            </View>
          ))
        ) : (
          personalBests.length === 0 ? (
            <Text style={styles.emptyText}>Complete levels to see your personal bests!</Text>
          ) : (
            personalBests.map((pb, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.rankNum}>#{i + 1}</Text>
                <Text style={styles.name}>Level {pb.levelIndex}</Text>
                <Text style={styles.score}>{pb.score.toLocaleString()}</Text>
              </View>
            ))
          )
        )}
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
  tabs: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 8,
    backgroundColor: GAME_THEME.cardBg, borderRadius: 14,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
    padding: 4, gap: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: GAME_THEME.accent },
  tabText: { fontSize: 13, fontWeight: '700', color: GAME_THEME.textSecondary },
  tabTextActive: { color: '#FFFFFF' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 8 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: GAME_THEME.cardBg, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
  },
  rowPlayer: { borderColor: GAME_THEME.accent, backgroundColor: 'rgba(108,99,255,0.1)' },
  medal: { fontSize: 22, width: 30, textAlign: 'center' },
  rankNum: { fontSize: 14, fontWeight: '800', color: GAME_THEME.textSecondary, width: 30 },
  name: { flex: 1, fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  namePlayer: { color: GAME_THEME.accent },
  score: { fontSize: 15, fontWeight: '800', color: GAME_THEME.textSecondary },
  scorePlayer: { color: GAME_THEME.coinGold },
  emptyText: { color: GAME_THEME.textSecondary, textAlign: 'center', marginTop: 40, fontSize: 15 },
});
