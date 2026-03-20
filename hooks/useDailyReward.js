import { useCallback } from 'react';
import { DAILY_STREAK_REWARDS } from '../constants/gameConfig';
import { useGameState } from '../store/useGameState';

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isYesterday(date, today) {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return isSameDay(date, yesterday);
}

export function useDailyReward() {
  const { state, dispatch } = useGameState();
  const { dailyRewardLastClaimed, loginStreak } = state.player;

  const today = new Date();
  const lastClaimed = dailyRewardLastClaimed ? new Date(dailyRewardLastClaimed) : null;

  const canClaim = !lastClaimed || !isSameDay(lastClaimed, today);

  // If last claim was > 1 day ago, streak resets to 0 before claiming
  const streakBroken = lastClaimed && !isYesterday(lastClaimed, today) && !isSameDay(lastClaimed, today);
  const currentStreak = streakBroken ? 0 : loginStreak;
  const nextStreak = currentStreak + 1;
  const rewardIndex = Math.min(nextStreak - 1, DAILY_STREAK_REWARDS.length - 1);
  const coinsToday = DAILY_STREAK_REWARDS[rewardIndex];

  const claimReward = useCallback(() => {
    if (!canClaim) return 0;
    dispatch({ type: 'SET_LOGIN_STREAK', payload: { streak: nextStreak, lastLogin: today.toISOString() } });
    dispatch({ type: 'CLAIM_DAILY_REWARD', payload: { coins: coinsToday } });
    return coinsToday;
  }, [canClaim, nextStreak, coinsToday, dispatch]);

  return { canClaim, coinsToday, currentStreak, nextStreak, claimReward };
}
