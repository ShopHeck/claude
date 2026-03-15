import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SetupScreen from './components/SetupScreen';
import WheelScreen from './components/WheelScreen';
import { THEME } from './constants/colors';
import useIAP from './hooks/useIAP';
import usePresets from './hooks/usePresets';

export default function App() {
  const [phase, setPhase] = useState('setup');
  const [options, setOptions] = useState([]);
  const [isClass, setIsClass] = useState(false);

  const { isPremium, purchase, restore, loading: iapLoading } = useIAP();
  const { presets, savePreset, deletePreset } = usePresets();

  function handleReady(opts, classMode) {
    setOptions(opts);
    setIsClass(!!classMode);
    setPhase('wheel');
  }

  function handleBack() {
    setPhase('setup');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {phase === 'setup' ? (
        <SetupScreen
          onReady={handleReady}
          isPremium={isPremium}
          presets={presets}
          onSavePreset={savePreset}
          onDeletePreset={deletePreset}
          onIAPPurchase={purchase}
          onIAPRestore={restore}
          iapLoading={iapLoading}
        />
      ) : (
        <WheelScreen options={options} isClass={isClass} onBack={handleBack} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
});
