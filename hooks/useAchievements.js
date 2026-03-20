import { useCallback } from 'react';
import { useGameState } from '../store/useGameState';

export function useAchievements() {
  const { state, dispatch } = useGameState();

  const unlock = useCallback((achievementId) => {
    if (state.achievements[achievementId]) return; // already unlocked
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { achievementId } });
    dispatch({ type: 'QUEUE_ACHIEVEMENT_TOAST', payload: { achievementId } });
  }, [state.achievements, dispatch]);

  /**
   * Called after a level is completed.
   */
  const checkLevelAchievements = useCallback(({ levelIndex, livesLost, maxCombo, roundTimeMs }) => {
    // First win
    if (levelIndex >= 1) unlock('first_win');

    // Combo milestones
    if (maxCombo >= 5) unlock('combo_5');
    if (maxCombo >= 10) unlock('combo_10');

    // Level milestones
    if (levelIndex >= 10) unlock('level_10');
    if (levelIndex >= 25) unlock('level_25');
    if (levelIndex >= 50) unlock('level_50');

    // Perfectionist: no misses the whole level
    if (livesLost === 0) unlock('no_miss');

    // Speed Demon: clear a full round in under 2 seconds
    if (roundTimeMs && roundTimeMs < 2000) unlock('speed_demon');

    // Star collector: 3 stars on 5 levels
    const threeStarLevels = Object.values(state.levels).filter(l => l.stars === 3).length;
    if (threeStarLevels >= 5) unlock('all_stars_5');
  }, [state.levels, unlock]);

  /**
   * Called when coins balance changes.
   */
  const checkCoinAchievements = useCallback((balance) => {
    if (balance >= 500) unlock('coins_500');
  }, [unlock]);

  /**
   * Called when login streak updates.
   */
  const checkStreakAchievements = useCallback((streak) => {
    if (streak >= 3) unlock('streak_3');
    if (streak >= 7) unlock('streak_7');
  }, [unlock]);

  const dismissToast = useCallback(() => {
    dispatch({ type: 'DISMISS_ACHIEVEMENT_TOAST' });
  }, [dispatch]);

  return {
    checkLevelAchievements,
    checkCoinAchievements,
    checkStreakAchievements,
    dismissToast,
    toastQueue: state.achievementToastQueue,
  };
}
