import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import SpinningWheel from './SpinningWheel';
import { THEME } from '../constants/colors';

export default function WheelScreen({ options, onBack }) {
  const wheelRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const winnerOpacity = useRef(new Animated.Value(0)).current;

  function handleSpin() {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);
    winnerOpacity.setValue(0);

    wheelRef.current?.spin(winnerName => {
      setWinner(winnerName);
      setSpinning(false);
      Animated.timing(winnerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleBack() {
    wheelRef.current?.reset();
    setWinner(null);
    winnerOpacity.setValue(0);
    onBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Decision Maker</Text>

      <View style={styles.wheelWrapper}>
        <View style={styles.pointer} />
        <SpinningWheel ref={wheelRef} options={options} />
      </View>

      <TouchableOpacity
        style={[styles.spinBtn, spinning && styles.spinBtnDisabled]}
        onPress={handleSpin}
        activeOpacity={0.85}
        disabled={spinning}
      >
        <Text style={styles.spinBtnText}>{spinning ? 'Spinning…' : 'Spin!'}</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.winnerBox, { opacity: winnerOpacity }]}>
        {winner && (
          <>
            <Text style={styles.winnerLabel}>The wheel chose</Text>
            <Text style={styles.winnerName}>{winner}</Text>
          </>
        )}
      </Animated.View>

      <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
        <Text style={styles.backBtnText}>← Change Options</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: THEME.bg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.text,
    letterSpacing: -0.5,
    marginBottom: 28,
  },
  wheelWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: THEME.accent,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  spinBtn: {
    marginTop: 28,
    width: 200,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  spinBtnDisabled: {
    backgroundColor: THEME.inputBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  spinBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.white,
    letterSpacing: 0.3,
  },
  winnerBox: {
    marginTop: 24,
    alignItems: 'center',
    minHeight: 64,
  },
  winnerLabel: {
    fontSize: 14,
    color: THEME.placeholder,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.accent,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  backBtn: {
    marginTop: 'auto',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backBtnText: {
    fontSize: 15,
    color: THEME.placeholder,
    fontWeight: '500',
  },
});
