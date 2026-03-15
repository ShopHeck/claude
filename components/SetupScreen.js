import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { THEME } from '../constants/colors';
import PresetsModal from './PresetsModal';
import PremiumModal from './PremiumModal';

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 10;

export default function SetupScreen({ onReady, isPremium, presets, onSavePreset, onIAPPurchase, onIAPRestore, iapLoading }) {
  const [count, setCount] = useState(4);
  const [inputs, setInputs] = useState(Array(4).fill(''));
  const [errors, setErrors] = useState([]);
  const [showPresets, setShowPresets] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const shakeAnims = useRef([]);

  function ensureAnims(n) {
    while (shakeAnims.current.length < n) {
      shakeAnims.current.push(new Animated.Value(0));
    }
  }
  ensureAnims(count);

  function changeCount(delta) {
    const next = Math.min(MAX_OPTIONS, Math.max(MIN_OPTIONS, count + delta));
    setCount(next);
    setErrors([]);
    setInputs(prev => {
      const copy = [...prev];
      while (copy.length < next) copy.push('');
      return copy.slice(0, next);
    });
    ensureAnims(next);
  }

  function updateInput(i, val) {
    setInputs(prev => {
      const copy = [...prev];
      copy[i] = val;
      return copy;
    });
    if (errors.includes(i)) {
      setErrors(prev => prev.filter(e => e !== i));
    }
  }

  function shake(index) {
    const anim = shakeAnims.current[index];
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function handleGo() {
    const emptyIndices = inputs
      .slice(0, count)
      .map((v, i) => (v.trim() === '' ? i : null))
      .filter(i => i !== null);

    if (emptyIndices.length > 0) {
      setErrors(emptyIndices);
      emptyIndices.forEach(i => shake(i));
      return;
    }

    onReady(inputs.slice(0, count).map(v => v.trim()), false);
  }

  function handlePresetsPress() {
    if (isPremium) {
      setShowPresets(true);
    } else {
      setShowPremium(true);
    }
  }

  function handleLoadPreset(options, isClass) {
    const clamped = options.slice(0, MAX_OPTIONS);
    setCount(clamped.length);
    setInputs(clamped);
    setErrors([]);
    ensureAnims(clamped.length);
    setShowPresets(false);
    // If it's a class list, go directly to wheel
    if (isClass) {
      onReady(clamped, true);
    }
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Decision Maker</Text>
            <Text style={styles.subtitle}>Can't decide? Let the wheel choose.</Text>
          </View>
          <TouchableOpacity style={styles.presetsBtn} onPress={handlePresetsPress}>
            <Text style={styles.presetsBtnText}>★ Presets</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={[styles.stepBtn, count <= MIN_OPTIONS && styles.stepBtnDisabled]}
            onPress={() => changeCount(-1)}
            disabled={count <= MIN_OPTIONS}
          >
            <Text style={styles.stepBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepCount}>{count}</Text>
          <TouchableOpacity
            style={[styles.stepBtn, count >= MAX_OPTIONS && styles.stepBtnDisabled]}
            onPress={() => changeCount(1)}
            disabled={count >= MAX_OPTIONS}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.optionsLabel}>options</Text>

        <View style={styles.inputList}>
          {Array.from({ length: count }).map((_, i) => {
            const hasError = errors.includes(i);
            return (
              <Animated.View
                key={i}
                style={{ transform: [{ translateX: shakeAnims.current[i] }] }}
              >
                <TextInput
                  style={[styles.input, hasError && styles.inputError]}
                  placeholder={`Option ${i + 1}`}
                  placeholderTextColor={THEME.placeholder}
                  value={inputs[i]}
                  onChangeText={v => updateInput(i, v)}
                  returnKeyType={i < count - 1 ? 'next' : 'done'}
                  onSubmitEditing={i === count - 1 ? handleGo : undefined}
                />
              </Animated.View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.goBtn} onPress={handleGo} activeOpacity={0.85}>
          <Text style={styles.goBtnText}>Let's Spin!</Text>
        </TouchableOpacity>
      </ScrollView>

      <PresetsModal
        visible={showPresets}
        onClose={() => setShowPresets(false)}
        presets={presets}
        currentOptions={inputs.slice(0, count).map(v => v || `Option ${inputs.indexOf(v) + 1}`)}
        onLoad={handleLoadPreset}
        onSave={onSavePreset}
        onDelete={(id) => {/* handled by parent via hook */}}
      />

      <PremiumModal
        visible={showPremium}
        onClose={() => setShowPremium(false)}
        onPurchase={onIAPPurchase}
        onRestore={onIAPRestore}
        loading={iapLoading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: THEME.bg,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: THEME.placeholder,
    marginTop: 6,
  },
  presetsBtn: {
    backgroundColor: THEME.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  presetsBtnText: {
    color: THEME.white,
    fontWeight: '600',
    fontSize: 13,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: THEME.inputBorder,
  },
  stepBtnText: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.white,
    lineHeight: Platform.OS === 'ios' ? 26 : 28,
  },
  stepCount: {
    fontSize: 36,
    fontWeight: '800',
    color: THEME.text,
    minWidth: 40,
    textAlign: 'center',
  },
  optionsLabel: {
    fontSize: 14,
    color: THEME.placeholder,
    marginTop: 4,
    marginBottom: 28,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputList: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: THEME.inputBorder,
    backgroundColor: THEME.white,
    paddingHorizontal: 16,
    fontSize: 16,
    color: THEME.text,
  },
  inputError: {
    borderColor: THEME.error,
  },
  goBtn: {
    width: '100%',
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
  goBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.white,
    letterSpacing: 0.3,
  },
});
