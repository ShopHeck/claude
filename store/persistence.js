import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tileblast_state';

const DEFAULT_STATE = {
  player: {
    name: 'Player',
    totalScore: 0,
    highestLevel: 0,
    coinsBalance: 100, // start with 100 coins so new players can try a power-up
    lastLogin: null,
    loginStreak: 0,
    dailyRewardLastClaimed: null,
    hapticsEnabled: true,
  },
  levels: {},
  achievements: {},
  inventory: {
    timeFreeze: 0,
    colorReveal: 0,
    extraLife: 0,
    bomb: 0,
  },
  leaderboard: {
    personalBests: [],
  },
};

let _saveTimer = null;
let _cachedState = null;

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Deep merge with defaults so new keys get default values
      _cachedState = deepMerge(DEFAULT_STATE, parsed);
    } else {
      _cachedState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    return _cachedState;
  } catch (e) {
    console.warn('Failed to load state:', e);
    _cachedState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    return _cachedState;
  }
}

export function saveState(state) {
  _cachedState = state;
  if (_saveTimer) clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, 300);
}

export async function resetState() {
  if (_saveTimer) clearTimeout(_saveTimer);
  _cachedState = JSON.parse(JSON.stringify(DEFAULT_STATE));
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to reset state:', e);
  }
  return _cachedState;
}

function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
