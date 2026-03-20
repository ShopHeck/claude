import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GAME_THEME } from '../../constants/colors';

export default function ScoreDisplay({ score }) {
  const [displayScore, setDisplayScore] = useState(score);
  const prevRef = useRef(score);
  const animRef = useRef(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = score;
    const delta = end - start;
    if (delta <= 0) {
      setDisplayScore(end);
      prevRef.current = end;
      return;
    }
    const duration = 400;
    const startTime = Date.now();

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.floor(start + delta * eased));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        prevRef.current = end;
      }
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SCORE</Text>
      <Text style={styles.score}>{displayScore.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: GAME_THEME.textSecondary,
    letterSpacing: 1.5,
  },
  score: {
    fontSize: 22,
    fontWeight: '900',
    color: GAME_THEME.textPrimary,
    letterSpacing: 1,
  },
});
