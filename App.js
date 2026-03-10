import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SetupScreen from './components/SetupScreen';
import WheelScreen from './components/WheelScreen';
import { THEME } from './constants/colors';

export default function App() {
  const [phase, setPhase] = useState('setup');
  const [options, setOptions] = useState([]);

  function handleReady(opts) {
    setOptions(opts);
    setPhase('wheel');
  }

  function handleBack() {
    setPhase('setup');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      {phase === 'setup' ? (
        <SetupScreen onReady={handleReady} />
      ) : (
        <WheelScreen options={options} onBack={handleBack} />
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
