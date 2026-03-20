import { TILE_COLOR_KEYS } from '../constants/colors';
import { TOTAL_TILES, getLevelConfig } from '../constants/gameConfig';

/**
 * Generates a randomised 4×4 board for a given level and round.
 * Returns an array of 16 tile objects.
 */
export function generateBoard(levelIndex, targetColor) {
  const config = getLevelConfig(levelIndex);
  const { targetTileCount, colorCount } = config;

  // Pick which colors appear on the board for this level
  const availableColors = TILE_COLOR_KEYS.slice(0, colorCount);

  // Build 16 tiles: guarantee enough target tiles, fill rest randomly
  const tiles = [];

  // Add required target tiles
  for (let i = 0; i < targetTileCount; i++) {
    tiles.push({ color: targetColor, isTarget: true });
  }

  // Fill remaining slots with non-target (or any) colors
  const nonTargetColors = availableColors.filter(c => c !== targetColor);
  const fillColors = nonTargetColors.length > 0 ? nonTargetColors : availableColors;

  while (tiles.length < TOTAL_TILES) {
    const randomColor = fillColors[Math.floor(Math.random() * fillColors.length)];
    tiles.push({ color: randomColor, isTarget: false });
  }

  // Shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Assign stable IDs
  return tiles.map((t, idx) => ({
    id: idx,
    color: t.color,
    isTarget: t.isTarget,
    isCleared: false,
    isWrong: false,
  }));
}

/**
 * Picks a random target color for a round from the level's available colors.
 */
export function pickTargetColor(levelIndex) {
  const config = getLevelConfig(levelIndex);
  const availableColors = TILE_COLOR_KEYS.slice(0, config.colorCount);
  return availableColors[Math.floor(Math.random() * availableColors.length)];
}
