import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { GAME_THEME } from '../constants/colors';
import { useGameState } from '../store/useGameState';

export default function SplashScreen() {
  const navigation = useNavigation();
  const { state } = useGameState();

  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 400 });
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const tagStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  return (
    <LinearGradient colors={['#0D1117', '#1A1F2E', '#0D1117']} style={styles.root}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <LinearGradient
          colors={['#FF4D6D', '#9B5DE5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoBox}
        >
          <Text style={styles.logoText}>TB</Text>
        </LinearGradient>
        <Text style={styles.title}>TILE BLAST</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, tagStyle]}>
        Tap Fast. Blast Harder.
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center', gap: 16 },
  logoBox: {
    width: 100, height: 100, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF4D6D', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 12,
  },
  logoText: { fontSize: 44, fontWeight: '900', color: '#FFF' },
  title: {
    fontSize: 34, fontWeight: '900', color: '#FFFFFF',
    letterSpacing: 6,
  },
  tagline: {
    marginTop: 20, fontSize: 16, color: GAME_THEME.textSecondary, letterSpacing: 2,
  },
});
