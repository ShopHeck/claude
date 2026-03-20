import React from 'react';
import {
  Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GAME_THEME } from '../constants/colors';
import { TOTAL_LEVELS, LEVELS_PER_WORLD, WORLD_THEMES } from '../constants/gameConfig';
import { useGameState } from '../store/useGameState';
import CoinDisplay from '../components/ui/CoinDisplay';

const { width: SW } = Dimensions.get('window');
const COLS = 5;
const TILE_SIZE = (SW - 40 - (COLS - 1) * 8) / COLS;
const FREE_LEVELS = 3; // first 3 always unlocked

function StarRow({ stars }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3].map(i => (
        <Text key={i} style={{ fontSize: 8, opacity: i <= stars ? 1 : 0.2 }}>⭐</Text>
      ))}
    </View>
  );
}

export default function LevelSelectScreen() {
  const navigation = useNavigation();
  const { state } = useGameState();

  const highestUnlocked = Math.max(FREE_LEVELS, state.player.highestLevel + 1);

  const handleSelect = (levelIndex) => {
    if (levelIndex > highestUnlocked) return;
    navigation.navigate('Game', { levelIndex });
  };

  // Group levels by world (10 per world)
  const worlds = [];
  for (let w = 0; w < Math.ceil(TOTAL_LEVELS / LEVELS_PER_WORLD); w++) {
    const theme = WORLD_THEMES[w % WORLD_THEMES.length];
    const levels = [];
    for (let i = 1; i <= LEVELS_PER_WORLD; i++) {
      const lvl = w * LEVELS_PER_WORLD + i;
      if (lvl <= TOTAL_LEVELS) levels.push(lvl);
    }
    worlds.push({ theme, levels });
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>LEVELS</Text>
        <CoinDisplay balance={state.player.coinsBalance} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {worlds.map((world, wi) => (
          <View key={wi} style={styles.worldSection}>
            <LinearGradient
              colors={world.theme.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.worldHeader}
            >
              <Text style={styles.worldName}>World {wi + 1}: {world.theme.name}</Text>
            </LinearGradient>

            <View style={styles.grid}>
              {world.levels.map(lvl => {
                const isUnlocked = lvl <= highestUnlocked;
                const levelData = state.levels[lvl] || { stars: 0 };

                return (
                  <TouchableOpacity
                    key={lvl}
                    onPress={() => handleSelect(lvl)}
                    disabled={!isUnlocked}
                    activeOpacity={0.8}
                    style={[styles.levelTile, !isUnlocked && styles.locked]}
                  >
                    {isUnlocked ? (
                      <LinearGradient
                        colors={world.theme.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.tileGrad}
                      >
                        <Text style={styles.levelNum}>{lvl}</Text>
                        <StarRow stars={levelData.stars} />
                      </LinearGradient>
                    ) : (
                      <View style={styles.tileGrad}>
                        <Text style={styles.lockIcon}>🔒</Text>
                        <Text style={styles.levelNumLocked}>{lvl}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GAME_THEME.gameBg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  backIcon: { fontSize: 24, color: '#FFFFFF' },
  title: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: 3 },
  scroll: { padding: 20, paddingBottom: 40, gap: 24 },
  worldSection: { gap: 12 },
  worldHeader: {
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16,
  },
  worldName: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  levelTile: {
    width: TILE_SIZE, height: TILE_SIZE + 10,
    borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  tileGrad: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2D3548', gap: 3,
  },
  locked: { opacity: 0.5 },
  levelNum: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  levelNumLocked: { fontSize: 12, fontWeight: '700', color: '#8892A4' },
  lockIcon: { fontSize: 14 },
});
