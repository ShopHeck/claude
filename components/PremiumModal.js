import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { THEME } from '../constants/colors';

const FEATURES = [
  '💾  Save unlimited preset lists',
  '🎓  Teacher Mode — class picker',
  '🔄  Restore purchases across devices',
  '❤️  Supports the developer',
];

export default function PremiumModal({ visible, onClose, onPurchase, onRestore, loading }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Unlock Premium</Text>
          <Text style={styles.subtitle}>One-time purchase · No subscription</Text>

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <Text key={f} style={styles.feature}>{f}</Text>
            ))}
          </View>

          <Pressable
            style={[styles.buyBtn, loading && styles.buyBtnDisabled]}
            onPress={onPurchase}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={THEME.white} />
            ) : (
              <Text style={styles.buyText}>Unlock for $0.99</Text>
            )}
          </Pressable>

          <Pressable onPress={onRestore} disabled={loading} style={styles.restoreBtn}>
            <Text style={styles.restoreText}>Restore Purchase</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Maybe Later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: THEME.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  features: {
    marginBottom: 28,
    gap: 12,
  },
  feature: {
    fontSize: 16,
    color: THEME.text,
  },
  buyBtn: {
    backgroundColor: THEME.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buyBtnDisabled: {
    opacity: 0.6,
  },
  buyText: {
    color: THEME.white,
    fontSize: 17,
    fontWeight: '700',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  restoreText: {
    color: THEME.accent,
    fontSize: 14,
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeText: {
    color: '#999',
    fontSize: 14,
  },
});
