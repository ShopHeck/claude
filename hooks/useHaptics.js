import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useGameState } from '../store/useGameState';

export function useHaptics() {
  const { state } = useGameState();
  const enabled = state.player?.hapticsEnabled !== false;

  const success = useCallback(() => {
    if (!enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [enabled]);

  const error = useCallback(() => {
    if (!enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, [enabled]);

  const heavy = useCallback(() => {
    if (!enabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [enabled]);

  const selection = useCallback(() => {
    if (!enabled) return;
    Haptics.selectionAsync();
  }, [enabled]);

  const levelComplete = useCallback(() => {
    if (!enabled) return;
    // Double tap for celebration
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 200);
  }, [enabled]);

  return { success, error, heavy, selection, levelComplete };
}
