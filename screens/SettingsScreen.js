import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GAME_THEME } from '../constants/colors';
import { useGameState } from '../store/useGameState';
import { resetState } from '../store/persistence';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameState();

  const toggleHaptics = (val) => {
    dispatch({ type: 'SET_HAPTICS', payload: { enabled: val } });
  };

  const handleReset = () => {
    Alert.alert(
      '⚠️ Reset All Data',
      'This will delete all your progress, coins, and achievements. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetState();
            dispatch({ type: 'RESET_ALL' });
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SETTINGS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gameplay</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>📳</Text>
              <View>
                <Text style={styles.rowLabel}>Haptic Feedback</Text>
                <Text style={styles.rowSub}>Vibration on taps and events</Text>
              </View>
            </View>
            <Switch
              value={state.player.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#2D3548', true: GAME_THEME.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>🏆</Text>
              <View>
                <Text style={styles.rowLabel}>Highest Level</Text>
              </View>
            </View>
            <Text style={styles.rowValue}>{state.player.highestLevel}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>⭐</Text>
              <View>
                <Text style={styles.rowLabel}>Total Score</Text>
              </View>
            </View>
            <Text style={styles.rowValue}>{state.player.totalScore.toLocaleString()}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowIcon}>🪙</Text>
              <View>
                <Text style={styles.rowLabel}>Coins Balance</Text>
              </View>
            </View>
            <Text style={[styles.rowValue, { color: GAME_THEME.coinGold }]}>
              {state.player.coinsBalance.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleReset}>
            <Text style={styles.dangerText}>⚠️ Reset All Progress</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Tile Blast v1.0.0</Text>
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
  scroll: { padding: 20, paddingBottom: 40, gap: 20 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: GAME_THEME.textSecondary, letterSpacing: 1.5, marginBottom: 4 },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: GAME_THEME.cardBg, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { fontSize: 22 },
  rowLabel: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  rowSub: { fontSize: 12, color: GAME_THEME.textSecondary, marginTop: 2 },
  rowValue: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  dangerBtn: {
    backgroundColor: 'rgba(255,77,109,0.12)', borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,77,109,0.3)',
  },
  dangerText: { fontSize: 15, fontWeight: '800', color: GAME_THEME.danger },
  version: { textAlign: 'center', fontSize: 12, color: GAME_THEME.textSecondary },
});
