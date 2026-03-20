import React, { createContext, useReducer, useEffect, useRef } from 'react';
import { loadState, saveState } from './persistence';
import { ACHIEVEMENT_MAP } from '../constants/achievements';

export const GameContext = createContext(null);

const initialState = {
  loaded: false,
  player: {
    name: 'Player',
    totalScore: 0,
    highestLevel: 0,
    coinsBalance: 100,
    lastLogin: null,
    loginStreak: 0,
    dailyRewardLastClaimed: null,
    hapticsEnabled: true,
  },
  levels: {},
  achievements: {},
  inventory: { timeFreeze: 0, colorReveal: 0, extraLife: 0, bomb: 0 },
  leaderboard: { personalBests: [] },
  // UI state (not persisted)
  achievementToastQueue: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...action.payload, loaded: true, achievementToastQueue: [] };

    case 'ADD_COINS': {
      const newBalance = Math.max(0, state.player.coinsBalance + action.payload.delta);
      return {
        ...state,
        player: { ...state.player, coinsBalance: newBalance },
      };
    }

    case 'SET_LEVEL_RESULT': {
      const { levelIndex, stars, score } = action.payload;
      const existing = state.levels[levelIndex] || { stars: 0, highScore: 0, firstClearBonus: false };
      const updatedLevel = {
        stars: Math.max(existing.stars, stars),
        highScore: Math.max(existing.highScore, score),
        firstClearBonus: existing.firstClearBonus || true,
      };
      const highestLevel = Math.max(state.player.highestLevel, levelIndex);
      const totalScore = state.player.totalScore + score;
      return {
        ...state,
        player: { ...state.player, highestLevel, totalScore },
        levels: { ...state.levels, [levelIndex]: updatedLevel },
      };
    }

    case 'UNLOCK_ACHIEVEMENT': {
      const { achievementId } = action.payload;
      if (state.achievements[achievementId]) return state; // already unlocked
      return {
        ...state,
        achievements: {
          ...state.achievements,
          [achievementId]: { unlockedAt: new Date().toISOString() },
        },
      };
    }

    case 'QUEUE_ACHIEVEMENT_TOAST': {
      const { achievementId } = action.payload;
      if (state.achievements[achievementId]) return state;
      const achievement = ACHIEVEMENT_MAP[achievementId];
      if (!achievement) return state;
      return {
        ...state,
        achievementToastQueue: [...state.achievementToastQueue, achievement],
      };
    }

    case 'DISMISS_ACHIEVEMENT_TOAST': {
      return {
        ...state,
        achievementToastQueue: state.achievementToastQueue.slice(1),
      };
    }

    case 'ADD_TO_INVENTORY': {
      const { item, count = 1 } = action.payload;
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [item]: (state.inventory[item] || 0) + count,
        },
      };
    }

    case 'USE_FROM_INVENTORY': {
      const { item } = action.payload;
      const current = state.inventory[item] || 0;
      if (current <= 0) return state;
      return {
        ...state,
        inventory: { ...state.inventory, [item]: current - 1 },
      };
    }

    case 'SET_LOGIN_STREAK': {
      return {
        ...state,
        player: {
          ...state.player,
          loginStreak: action.payload.streak,
          lastLogin: action.payload.lastLogin,
        },
      };
    }

    case 'CLAIM_DAILY_REWARD': {
      return {
        ...state,
        player: {
          ...state.player,
          dailyRewardLastClaimed: new Date().toISOString(),
          coinsBalance: state.player.coinsBalance + action.payload.coins,
        },
      };
    }

    case 'SET_HAPTICS': {
      return {
        ...state,
        player: { ...state.player, hapticsEnabled: action.payload.enabled },
      };
    }

    case 'ADD_PERSONAL_BEST': {
      const { levelIndex, score } = action.payload;
      const bests = state.leaderboard.personalBests.filter(b => b.levelIndex !== levelIndex);
      bests.push({ levelIndex, score, date: new Date().toISOString() });
      bests.sort((a, b) => b.score - a.score);
      return {
        ...state,
        leaderboard: { personalBests: bests.slice(0, 100) },
      };
    }

    case 'RESET_ALL':
      return { ...initialState, loaded: true, achievementToastQueue: [] };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);

  useEffect(() => {
    loadState().then(loaded => {
      dispatch({ type: 'LOAD_STATE', payload: loaded });
    });
  }, []);

  // Persist on every state change (except UI-only fields)
  useEffect(() => {
    if (!state.loaded) return;
    stateRef.current = state;
    const { loaded, achievementToastQueue, ...persistable } = state;
    saveState(persistable);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
