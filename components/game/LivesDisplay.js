import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MAX_LIVES } from '../../constants/gameConfig';

export default function LivesDisplay({ lives }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: MAX_LIVES }).map((_, i) => (
        <Text key={i} style={[styles.heart, i < lives ? styles.active : styles.inactive]}>
          ❤️
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heart: {
    fontSize: 20,
  },
  active: {
    opacity: 1,
  },
  inactive: {
    opacity: 0.2,
    // grayscale-ish via low opacity
  },
});
