import { BASE_POINTS } from '../constants/gameConfig';

/**
 * Points awarded for a single correct tile tap.
 */
export function calcTilePoints(combo) {
  const multiplier = Math.max(1, combo);
  return BASE_POINTS * multiplier;
}

/**
 * Bonus coins for a level result (on top of base coin reward).
 */
export function calcStarBonus(stars) {
  if (stars === 3) return 30;
  if (stars === 2) return 15;
  return 0;
}

/**
 * Determine star rating for a completed level.
 * @param {number} livesLost   How many lives were lost during the level
 * @param {number} maxCombo    Highest combo reached during the level
 */
export function calcStars(livesLost, maxCombo) {
  if (livesLost === 0 && maxCombo >= 5) return 3;
  if (livesLost <= 1) return 2;
  return 1;
}
