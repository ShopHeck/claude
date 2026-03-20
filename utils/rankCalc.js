/**
 * Returns rank label and color key based on total score.
 */
export function getRank(totalScore) {
  if (totalScore >= 100000) return { label: 'Diamond', colorKey: 'rankDiamond' };
  if (totalScore >= 30000)  return { label: 'Gold',    colorKey: 'rankGold' };
  if (totalScore >= 8000)   return { label: 'Silver',  colorKey: 'rankSilver' };
  return                           { label: 'Bronze',  colorKey: 'rankBronze' };
}

/**
 * Mock global leaderboard data (seeded fake players).
 * The real player is inserted at the correct position when displayed.
 */
export const MOCK_LEADERBOARD = [
  { name: 'BlazeMaster',  score: 142500 },
  { name: 'NeonStrike',   score: 128300 },
  { name: 'TileKing99',   score: 115600 },
  { name: 'PixelFury',    score: 98200  },
  { name: 'SwiftTapper',  score: 87400  },
  { name: 'CosmicRush',   score: 74800  },
  { name: 'GridGenius',   score: 63100  },
  { name: 'StarBlaster',  score: 52700  },
  { name: 'TapQueen',     score: 44500  },
  { name: 'ColorCrusher', score: 37200  },
  { name: 'ArcadeAce',    score: 29800  },
  { name: 'TileTitan',    score: 23400  },
  { name: 'RushHour101',  score: 17600  },
  { name: 'QuickFingers', score: 12300  },
  { name: 'NovaTap',      score: 8900   },
  { name: 'LightSpeed',   score: 5600   },
  { name: 'GridRunner',   score: 3200   },
  { name: 'TileFan23',    score: 1800   },
  { name: 'Newbie1',      score: 900    },
  { name: 'Newbie2',      score: 400    },
];

export function insertPlayerInLeaderboard(playerName, playerScore) {
  const list = [...MOCK_LEADERBOARD, { name: playerName, score: playerScore, isPlayer: true }];
  list.sort((a, b) => b.score - a.score);
  return list.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
}
