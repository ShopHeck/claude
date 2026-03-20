export const ACHIEVEMENTS = [
  {
    id: 'first_win',
    title: 'First Win',
    desc: 'Complete your first level',
    reward: 25,
    icon: '🏆',
  },
  {
    id: 'combo_5',
    title: 'Combo Starter',
    desc: 'Reach a 5x combo',
    reward: 50,
    icon: '⚡',
  },
  {
    id: 'combo_10',
    title: 'Combo King',
    desc: 'Reach a 10x combo',
    reward: 150,
    icon: '👑',
  },
  {
    id: 'level_10',
    title: 'Getting Serious',
    desc: 'Reach level 10',
    reward: 100,
    icon: '🎯',
  },
  {
    id: 'level_25',
    title: 'Dedicated',
    desc: 'Reach level 25',
    reward: 250,
    icon: '💎',
  },
  {
    id: 'level_50',
    title: 'Legend',
    desc: 'Clear all 50 levels',
    reward: 500,
    icon: '🌟',
  },
  {
    id: 'no_miss',
    title: 'Perfectionist',
    desc: 'Clear a level without missing once',
    reward: 75,
    icon: '✨',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    desc: 'Clear a full round in under 2 seconds',
    reward: 100,
    icon: '🚀',
  },
  {
    id: 'streak_3',
    title: 'Habitual',
    desc: '3-day login streak',
    reward: 75,
    icon: '🔥',
  },
  {
    id: 'streak_7',
    title: 'Weekly Warrior',
    desc: '7-day login streak',
    reward: 200,
    icon: '💪',
  },
  {
    id: 'coins_500',
    title: 'Saver',
    desc: 'Accumulate 500 coins at once',
    reward: 50,
    icon: '💰',
  },
  {
    id: 'all_stars_5',
    title: 'Star Collector',
    desc: 'Earn 3 stars on 5 different levels',
    reward: 200,
    icon: '⭐',
  },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map(a => [a.id, a])
);
