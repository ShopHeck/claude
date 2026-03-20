import { useState, useCallback } from 'react';
import { COMBO_BONUS_THRESHOLD } from '../constants/gameConfig';

export function useCombo() {
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);

  const increment = useCallback(() => {
    setCombo(prev => {
      const next = prev + 1;
      setMaxCombo(m => Math.max(m, next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCombo(1);
  }, []);

  const resetAll = useCallback(() => {
    setCombo(1);
    setMaxCombo(1);
  }, []);

  const isTimeBonusActive = combo >= COMBO_BONUS_THRESHOLD;

  return { combo, maxCombo, increment, reset, resetAll, isTimeBonusActive };
}
