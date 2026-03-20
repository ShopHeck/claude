import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GAME_THEME } from '../constants/colors';
import { COIN_PACKAGES, POWER_UP_COSTS } from '../constants/gameConfig';
import { useGameState } from '../store/useGameState';
import CoinDisplay from '../components/ui/CoinDisplay';

const POWER_UP_DEFS = [
  { key: 'timeFreeze',  icon: '⏸️',  name: 'Time Freeze',  desc: 'Pause timer for 3 seconds' },
  { key: 'colorReveal', icon: '👁️',  name: 'Color Reveal', desc: 'Re-flash target tiles' },
  { key: 'extraLife',   icon: '❤️',  name: 'Extra Life',   desc: '+1 life for the session' },
  { key: 'bomb',        icon: '💣',  name: 'Bomb',         desc: 'Clear 3 target tiles instantly' },
];

export default function ShopScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useGameState();

  const handleCoinPack = (pack) => {
    // TODO: Replace Alert with real expo-in-app-purchases integration for production
    Alert.alert(
      '🪙 Purchase Coins',
      `${pack.label}\n${pack.coins} coins for ${pack.price}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Buy ${pack.price}`,
          onPress: () => {
            dispatch({ type: 'ADD_COINS', payload: { delta: pack.coins } });
            Alert.alert('✅ Purchase Simulated', `+${pack.coins} coins added to your balance!`);
          },
        },
      ]
    );
  };

  const handleBuyPowerUp = (key) => {
    const cost = POWER_UP_COSTS[key];
    if (state.player.coinsBalance < cost) {
      Alert.alert('Not Enough Coins', 'Purchase a coin pack to get more coins!');
      return;
    }
    dispatch({ type: 'ADD_COINS', payload: { delta: -cost } });
    dispatch({ type: 'ADD_TO_INVENTORY', payload: { item: key, count: 1 } });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SHOP</Text>
        <CoinDisplay balance={state.player.coinsBalance} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Coin packages */}
        <Text style={styles.sectionTitle}>💰 Coin Packs</Text>
        <Text style={styles.iapNote}>*In-app purchases are simulated for this demo</Text>

        {COIN_PACKAGES.map(pack => (
          <TouchableOpacity key={pack.id} onPress={() => handleCoinPack(pack)} activeOpacity={0.85}>
            <LinearGradient
              colors={
                pack.id === 'mega' ? ['#FFD60A', '#FB5607'] :
                pack.id === 'value' ? ['#4361EE', '#9B5DE5'] :
                ['#2D3548', '#1A1F2E']
              }
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.coinCard}
            >
              <View style={styles.coinCardLeft}>
                <Text style={styles.coinPackIcon}>🪙</Text>
                <View>
                  <Text style={styles.coinPackName}>{pack.label}</Text>
                  <Text style={styles.coinPackCoins}>{pack.coins.toLocaleString()} coins</Text>
                  {pack.bonusPct && (
                    <Text style={styles.bonusBadge}>+{pack.bonusPct}% BONUS</Text>
                  )}
                </View>
              </View>
              <View style={styles.priceBtn}>
                <Text style={styles.priceText}>{pack.price}</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        {/* Power-ups */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>⚡ Power-Ups</Text>
        {POWER_UP_DEFS.map(def => {
          const cost = POWER_UP_COSTS[def.key];
          const count = state.inventory[def.key] || 0;
          const canAfford = state.player.coinsBalance >= cost;

          return (
            <View key={def.key} style={styles.powerUpRow}>
              <Text style={styles.puIcon}>{def.icon}</Text>
              <View style={styles.puInfo}>
                <Text style={styles.puName}>{def.name}</Text>
                <Text style={styles.puDesc}>{def.desc}</Text>
                <Text style={styles.puOwned}>Owned: {count}</Text>
              </View>
              <TouchableOpacity
                style={[styles.buyBtn, !canAfford && styles.buyBtnDisabled]}
                onPress={() => handleBuyPowerUp(def.key)}
                disabled={!canAfford}
              >
                <Text style={styles.buyBtnText}>{cost} 🪙</Text>
              </TouchableOpacity>
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
  scroll: { padding: 20, paddingBottom: 40, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  iapNote: { fontSize: 11, color: GAME_THEME.textSecondary, marginTop: -4 },
  coinCard: {
    borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  coinCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coinPackIcon: { fontSize: 32 },
  coinPackName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  coinPackCoins: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  bonusBadge: {
    fontSize: 10, fontWeight: '800', color: '#FFD60A',
    backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6, alignSelf: 'flex-start', marginTop: 2,
  },
  priceBtn: {
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12,
    paddingVertical: 8, paddingHorizontal: 14,
  },
  priceText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  powerUpRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: GAME_THEME.cardBg, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: GAME_THEME.cardBorder,
  },
  puIcon: { fontSize: 28 },
  puInfo: { flex: 1, gap: 2 },
  puName: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  puDesc: { fontSize: 12, color: GAME_THEME.textSecondary },
  puOwned: { fontSize: 11, color: GAME_THEME.accent, fontWeight: '600', marginTop: 2 },
  buyBtn: {
    backgroundColor: GAME_THEME.accent, borderRadius: 12,
    paddingVertical: 8, paddingHorizontal: 12,
  },
  buyBtnDisabled: { backgroundColor: '#2D3548', opacity: 0.5 },
  buyBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});
