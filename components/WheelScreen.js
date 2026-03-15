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

export default function WheelScreen({ options, isClass, onBack }) {
  const wheelRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [available, setAvailable] = useState([...options]);
  const winnerOpacity = useRef(new Animated.Value(0)).current;

  const allPicked = isClass && available.length === 0;

  function handleSpin() {
    if (spinning || allPicked) return;
    setSpinning(true);
    setWinner(null);
    winnerOpacity.setValue(0);

    wheelRef.current?.spin(winnerName => {
      setWinner(winnerName);
      setSpinning(false);
      if (isClass) {
        setAvailable(prev => prev.filter(s => s !== winnerName));
      }
      Animated.timing(winnerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }

  function handleReset() {
    wheelRef.current?.reset();
    setAvailable([...options]);
    setWinner(null);
    winnerOpacity.setValue(0);
  }

  function handleBack() {
    wheelRef.current?.reset();
    setWinner(null);
    winnerOpacity.setValue(0);
    onBack();
  }

  const wheelOptions = isClass ? available : options;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Decision Maker</Text>

      {isClass && (
        <View style={styles.classBar}>
          <Text style={styles.classBarText}>
            🎓 {available.length} of {options.length} remaining
          </Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.wheelWrapper}>
        <View style={styles.pointer} />
        {allPicked ? (
          <View style={styles.allPickedBox}>
            <Text style={styles.allPickedText}>🎉 All students picked!</Text>
            <Text style={styles.allPickedSub}>Tap Reset to start over.</Text>
          </View>
        ) : (
          <SpinningWheel ref={wheelRef} options={wheelOptions} />
        )}
      </View>

      {!allPicked && (
        <TouchableOpacity
          style={[styles.spinBtn, spinning && styles.spinBtnDisabled]}
          onPress={handleSpin}
          activeOpacity={0.85}
          disabled={spinning}
        >
          <Text style={styles.spinBtnText}>{spinning ? 'Spinning…' : 'Spin!'}</Text>
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.winnerBox, { opacity: winnerOpacity }]}>
        {winner && (
          <>
            <Text style={styles.winnerLabel}>{isClass ? 'Called on' : 'The wheel chose'}</Text>
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
    marginBottom: 16,
  },
  classBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 28,
    marginBottom: 12,
  },
  classBarText: {
    fontSize: 14,
    color: THEME.text,
    fontWeight: '500',
  },
  resetBtn: {
    backgroundColor: THEME.inputBorder,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text,
  },
  wheelWrapper: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 4,
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
  allPickedBox: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 150,
    borderWidth: 2,
    borderColor: THEME.inputBorder,
    borderStyle: 'dashed',
  },
  allPickedText: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.text,
    textAlign: 'center',
  },
  allPickedSub: {
    fontSize: 14,
    color: THEME.placeholder,
    marginTop: 8,
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
