import { TILE_COLOR_KEYS } from './colors';

export const GRID_SIZE = 4; // 4x4
export const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
export const MAX_LIVES = 3;
export const BASE_POINTS = 50;
export const COMBO_BONUS_THRESHOLD = 5; // combo >= 5 triggers time bonus
export const TIME_BONUS_MS = 1000;

export function getLevelConfig(levelIndex) {
  const l = levelIndex;
  return {
    gridSize: GRID_SIZE,
    // How many target tiles to find per round (min 3, grows slowly)
    targetTileCount: Math.min(8, 3 + Math.floor(l / 5)),
    // Time limit per round in ms (starts 12s, floor at 4s)
    timeLimit: Math.max(4000, 12000 - l * 200),
    // Preview glow duration in ms (starts 800ms, floor at 200ms)
    previewDuration: Math.max(200, 800 - l * 20),
    // Number of rounds to clear the level
    roundsPerLevel: Math.min(7, 3 + Math.floor(l / 10)),
    // Which colors appear on the board (more colors = harder)
    colorCount: Math.min(TILE_COLOR_KEYS.length, 3 + Math.floor(l / 8)),
    // Coin reward for completing the level
    coinReward: l * 10,
    // First-clear bonus (one-time)
    firstClearBonus: 50,
    // Star thresholds
    stars: {
      one:   1,        // completed level
      two:   1,        // with ≤ 1 life lost
      three: 1,        // all lives + combo ≥ 5
    },
  };
}

// Coin earning constants
export const COIN_REWARDS = {
  STAR_2_BONUS: 15,
  STAR_3_BONUS: 30,
  ACHIEVEMENT_MIN: 25,
};

// Daily reward streak (coins per consecutive day)
export const DAILY_STREAK_REWARDS = [10, 15, 25, 40, 60, 80, 150];

// Power-up costs in coins
export const POWER_UP_COSTS = {
  timeFreeze:  50,
  colorReveal: 75,
  extraLife:   100,
  bomb:        120,
};

// IAP mock coin packages
export const COIN_PACKAGES = [
  { id: 'starter', label: 'Starter Pack', coins: 250,  price: '$0.99',  badge: 'POPULAR',  bonusPct: null },
  { id: 'value',   label: 'Value Pack',   coins: 1000, price: '$2.99',  badge: '+33% BONUS', bonusPct: 33 },
  { id: 'mega',    label: 'Mega Pack',    coins: 5000, price: '$9.99',  badge: '+100% BONUS', bonusPct: 100 },
];

// Number of levels per "world" (for theming in LevelSelectScreen)
export const LEVELS_PER_WORLD = 10;
export const TOTAL_LEVELS = 50;

// World color themes
export const WORLD_THEMES = [
  { name: 'Ember',    gradient: ['#FF4D6D', '#FB5607'] },
  { name: 'Ocean',    gradient: ['#4361EE', '#06D6A0'] },
  { name: 'Solar',    gradient: ['#FFD60A', '#FB5607'] },
  { name: 'Cosmic',   gradient: ['#9B5DE5', '#4361EE'] },
  { name: 'Aurora',   gradient: ['#06D6A0', '#9B5DE5'] },
];
