import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAME_THEME } from '../../constants/colors';

const POWER_UP_DEFS = [
  { key: 'timeFreeze',  icon: '⏸️',  label: 'Freeze' },
  { key: 'colorReveal', icon: '👁️',  label: 'Reveal' },
  { key: 'bomb',        icon: '💣',  label: 'Bomb' },
];

export default function PowerUpBar({ inventory, onUse, activePhase }) {
  const disabled = activePhase !== 'playing';

  return (
    <View style={styles.row}>
      {POWER_UP_DEFS.map(def => {
        const count = inventory[def.key] || 0;
        return (
          <TouchableOpacity
            key={def.key}
            style={[styles.btn, (count === 0 || disabled) && styles.btnDisabled]}
            onPress={() => count > 0 && !disabled && onUse(def.key)}
            activeOpacity={0.75}
            disabled={count === 0 || disabled}
          >
            <Text style={styles.icon}>{def.icon}</Text>
            <Text style={styles.count}>x{count}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 8,
  },
  btn: {
    backgroundColor: GAME_THEME.cardBg,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    minWidth: 60,
    borderWidth: 1,
    borderColor: GAME_THEME.cardBorder,
  },
  btnDisabled: { opacity: 0.4 },
  icon: { fontSize: 22 },
  count: { fontSize: 12, fontWeight: '700', color: GAME_THEME.textSecondary, marginTop: 2 },
});
