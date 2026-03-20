import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  Alert, Dimensions, SafeAreaView, StyleSheet, Text, View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { generateBoard, pickTargetColor } from '../utils/levelGenerator';
import { calcTilePoints, calcStars } from '../utils/scoreCalc';
import { getLevelConfig, MAX_LIVES, POWER_UP_COSTS, TIME_BONUS_MS } from '../constants/gameConfig';
import { GAME_THEME, TILE_COLORS } from '../constants/colors';
import { useGameState } from '../store/useGameState';
import { useHaptics } from '../hooks/useHaptics';
import { useCombo } from '../hooks/useCombo';
import { useAchievements } from '../hooks/useAchievements';

import GameBoard from '../components/game/GameBoard';
import TimerBar from '../components/game/TimerBar';
import ComboDisplay from '../components/game/ComboDisplay';
import TargetColorDisplay from '../components/game/TargetColorDisplay';
import LivesDisplay from '../components/game/LivesDisplay';
import ScoreDisplay from '../components/game/ScoreDisplay';
import ScreenShake from '../components/effects/ScreenShake';
import ConfettiOverlay from '../components/effects/ConfettiOverlay';
import PowerUpBar from '../components/ui/PowerUpBar';
import CoinDisplay from '../components/ui/CoinDisplay';
import AchievementToast from '../components/ui/AchievementToast';

const TICK_MS = 100;

function initRound(levelIndex, prevTargetColor) {
  let targetColor = pickTargetColor(levelIndex);
  // Avoid repeating the same color twice
  if (targetColor === prevTargetColor) {
    const keys = Object.keys(TILE_COLORS);
    const others = keys.filter(k => k !== prevTargetColor);
    targetColor = others[Math.floor(Math.random() * others.length)];
  }
  return {
    tiles: generateBoard(levelIndex, targetColor),
    targetColor,
    timeLeft: getLevelConfig(levelIndex).timeLimit,
    roundStartTime: Date.now(),
  };
}

export default function GameScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const levelIndex = route.params?.levelIndex ?? 1;
  const config = getLevelConfig(levelIndex);

  const { state, dispatch } = useGameState();
  const haptics = useHaptics();
  const { combo, maxCombo, increment: incCombo, reset: resetCombo, resetAll: resetAllCombo } = useCombo();
  const { checkLevelAchievements, toastQueue, dismissToast } = useAchievements();

  const shakeRef = useRef(null);
  const tickRef = useRef(null);

  const [phase, setPhase] = useState('preview'); // preview | playing | clearing | levelComplete | gameOver
  const [tiles, setTiles] = useState(() => {
    const tc = pickTargetColor(levelIndex);
    return generateBoard(levelIndex, tc);
  });
  const [targetColor, setTargetColor] = useState(() => tiles.find(t => t.isTarget)?.color || 'RED');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [livesLost, setLivesLost] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [roundIndex, setRoundIndex] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [frozen, setFrozen] = useState(false);
  const frozenRef = useRef(false);

  // --- Timer ---
  useEffect(() => {
    if (phase !== 'playing') return;
    tickRef.current = setInterval(() => {
      if (frozenRef.current) return;
      setTimeLeft(prev => {
        if (prev <= TICK_MS) {
          handleTimeout();
          return 0;
        }
        return prev - TICK_MS;
      });
    }, TICK_MS);
    return () => clearInterval(tickRef.current);
  }, [phase, roundIndex]);

  // --- Preview phase auto-advance ---
  useEffect(() => {
    if (phase !== 'preview') return;
    const timer = setTimeout(() => setPhase('playing'), config.previewDuration);
    return () => clearTimeout(timer);
  }, [phase, roundIndex]);

  // --- Tile tap ---
  const handleTileTap = useCallback((tile, spawnEffects) => {
    if (phase !== 'playing') return;
    if (tile.isCleared || tile.isWrong) return;

    if (tile.color !== targetColor) {
      // Wrong tap
      haptics.error();
      shakeRef.current?.shake();
      setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, isWrong: true } : t));
      setTimeout(() => setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, isWrong: false } : t)), 400);
      resetCombo();
      setLives(prev => {
        const next = prev - 1;
        setLivesLost(l => l + 1);
        if (next <= 0) {
          clearInterval(tickRef.current);
          setPhase('gameOver');
        }
        return next;
      });
    } else {
      // Correct tap
      haptics.success();
      incCombo();
      const pts = calcTilePoints(combo);
      setScore(prev => prev + pts);
      setCoinsEarned(prev => prev + Math.ceil(pts / 50));
      setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, isCleared: true } : t));

      spawnEffects?.({ x: 0, y: 0 }, pts, tile.color);

      // Check if all target tiles cleared
      setTiles(prev => {
        const remaining = prev.filter(t => t.isTarget && !t.isCleared && t.id !== tile.id);
        if (remaining.length === 0) {
          clearInterval(tickRef.current);
          const roundTime = Date.now() - roundStartTime;
          advanceRound(roundTime);
        }
        return prev;
      });

      // Combo time bonus
      if (combo >= 4) {
        setTimeLeft(prev => Math.min(config.timeLimit, prev + TIME_BONUS_MS));
      }
    }
  }, [phase, targetColor, combo]);

  function handleTimeout() {
    clearInterval(tickRef.current);
    haptics.error();
    shakeRef.current?.shake();
    setLives(prev => {
      const next = prev - 1;
      setLivesLost(l => l + 1);
      resetCombo();
      if (next <= 0) {
        setPhase('gameOver');
      } else {
        // Reset round
        setTimeout(() => startNewRound(targetColor), 600);
      }
      return next;
    });
  }

  function advanceRound(roundTime) {
    const nextRound = roundIndex + 1;
    if (nextRound >= config.roundsPerLevel) {
      // Level complete!
      completeLevel(roundTime);
    } else {
      setRoundIndex(nextRound);
      setTimeout(() => startNewRound(targetColor, true), 500);
    }
  }

  function startNewRound(prevColor, newTarget = false) {
    const newTarget2 = pickTargetColor(levelIndex);
    const safeTarget = newTarget && newTarget2 === prevColor
      ? Object.keys(TILE_COLORS).find(k => k !== prevColor) || newTarget2
      : newTarget2;
    const finalTarget = newTarget ? safeTarget : prevColor;
    const newTiles = generateBoard(levelIndex, finalTarget);
    setTiles(newTiles);
    setTargetColor(finalTarget);
    setTimeLeft(config.timeLimit);
    setRoundStartTime(Date.now());
    setPhase('preview');
  }

  function completeLevel(roundTime) {
    haptics.levelComplete();
    setShowConfetti(true);
    setPhase('levelComplete');

    const stars = calcStars(livesLost, maxCombo);
    const baseCoins = config.coinReward;
    const hasFirstClear = !state.levels[levelIndex]?.firstClearBonus;
    const firstClearBonus = hasFirstClear ? config.firstClearBonus : 0;
    const totalCoins = baseCoins + coinsEarned + firstClearBonus;

    dispatch({ type: 'SET_LEVEL_RESULT', payload: { levelIndex, stars, score } });
    dispatch({ type: 'ADD_COINS', payload: { delta: totalCoins } });
    dispatch({ type: 'ADD_PERSONAL_BEST', payload: { levelIndex, score } });

    checkLevelAchievements({ levelIndex, livesLost, maxCombo, roundTimeMs: roundTime });

    setTimeout(() => {
      navigation.replace('Result', {
        levelIndex,
        score,
        stars,
        coinsEarned: totalCoins,
        maxCombo,
      });
    }, 2200);
  }

  // --- Game Over ---
  useEffect(() => {
    if (phase !== 'gameOver') return;
    haptics.error();
    const timer = setTimeout(() => {
      Alert.alert(
        '💀 Game Over',
        `Score: ${score.toLocaleString()}`,
        [
          { text: 'Retry', onPress: () => navigation.replace('Game', { levelIndex }) },
          { text: 'Home', onPress: () => navigation.navigate('Home') },
        ]
      );
    }, 600);
    return () => clearTimeout(timer);
  }, [phase]);

  // --- Power-ups ---
  const handlePowerUp = (key) => {
    const inv = state.inventory;
    if (!inv[key] || inv[key] <= 0) return;
    dispatch({ type: 'USE_FROM_INVENTORY', payload: { item: key } });

    if (key === 'timeFreeze') {
      frozenRef.current = true;
      setFrozen(true);
      setTimeout(() => { frozenRef.current = false; setFrozen(false); }, 3000);
    } else if (key === 'colorReveal') {
      setPhase('preview');
      setTimeout(() => setPhase('playing'), 1200);
    } else if (key === 'bomb') {
      // Clear 3 random target tiles
      setTiles(prev => {
        const targets = prev.filter(t => t.isTarget && !t.isCleared);
        const toBlast = targets.slice(0, 3);
        const ids = new Set(toBlast.map(t => t.id));
        const updated = prev.map(t => ids.has(t.id) ? { ...t, isCleared: true } : t);
        const remaining = updated.filter(t => t.isTarget && !t.isCleared);
        if (remaining.length === 0) {
          clearInterval(tickRef.current);
          setTimeout(() => advanceRound(0), 400);
        }
        return updated;
      });
    }
  };

  const targetCount = tiles.filter(t => t.isTarget && !t.isCleared).length;
  const totalTargets = tiles.filter(t => t.isTarget).length;
  const roundProgress = totalTargets > 0 ? 1 - targetCount / totalTargets : 0;

  return (
    <SafeAreaView style={styles.root}>
      <ScreenShake ref={shakeRef} style={{ flex: 1 }}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <CoinDisplay balance={state.player.coinsBalance} />
          <ScoreDisplay score={score} />
          <LivesDisplay lives={lives} />
        </View>

        {/* Timer bar */}
        <TimerBar timeLeft={timeLeft} timeLimit={config.timeLimit} />

        {/* Round indicator */}
        <View style={styles.roundRow}>
          <Text style={styles.roundText}>
            Round {roundIndex + 1}/{config.roundsPerLevel}
          </Text>
          {frozen && <Text style={styles.frozenText}>⏸ FROZEN</Text>}
          <ComboDisplay combo={combo} />
        </View>

        {/* Target indicator */}
        <TargetColorDisplay targetColor={targetColor} phase={phase} />

        {/* Board */}
        <View style={styles.boardWrapper}>
          <GameBoard
            tiles={tiles}
            onTileTap={handleTileTap}
            phase={phase}
          />
        </View>

        {/* Power-ups */}
        <PowerUpBar
          inventory={state.inventory}
          onUse={handlePowerUp}
          activePhase={phase}
        />

        {/* Level / round progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Level {levelIndex}</Text>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
          </View>
          <Text style={styles.progressLabel}>
            {targetCount} left
          </Text>
        </View>
      </ScreenShake>

      {/* Overlays */}
      <ConfettiOverlay active={showConfetti} />

      {toastQueue.length > 0 && (
        <AchievementToast achievement={toastQueue[0]} onDone={dismissToast} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GAME_THEME.gameBg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  roundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  roundText: {
    color: GAME_THEME.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  frozenText: {
    color: '#00B4D8',
    fontSize: 13,
    fontWeight: '800',
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  progressLabel: {
    color: GAME_THEME.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
