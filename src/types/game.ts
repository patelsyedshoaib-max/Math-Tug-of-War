export type GamePhase = 'MENU' | 'CHARACTER_SELECT' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'VICTORY';

export type GameMode = 'TWO_PLAYER' | 'VS_AI';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ToyAvatar {
  id: string;
  name: string;
  emoji: string;
  color: string;
  accentBg: string;
  motto: string;
}

export const TOY_AVATARS: ToyAvatar[] = [
  {
    id: 'bear',
    name: 'Teddy Bear',
    emoji: '🧸',
    color: '#3b82f6', // Blue
    accentBg: 'bg-blue-500',
    motto: 'Strong & Steady!',
  },
  {
    id: 'robot',
    name: 'Cyber Robot',
    emoji: '🤖',
    color: '#ef4444', // Red
    accentBg: 'bg-red-500',
    motto: 'Maximum Speed!',
  },
  {
    id: 'dino',
    name: 'Super Dino',
    emoji: '🦖',
    color: '#10b981', // Green
    accentBg: 'bg-emerald-500',
    motto: 'Mighty Tug Power!',
  },
  {
    id: 'unicorn',
    name: 'Magic Unicorn',
    emoji: '🦄',
    color: '#ec4899', // Pink
    accentBg: 'bg-pink-500',
    motto: 'Sparkle Math Power!',
  },
  {
    id: 'ninja',
    name: 'Shadow Ninja',
    emoji: '🥷',
    color: '#8b5cf6', // Purple
    accentBg: 'bg-purple-500',
    motto: 'Swift & Precise!',
  },
  {
    id: 'superhero',
    name: 'Hero Titan',
    emoji: '🦸',
    color: '#f59e0b', // Amber
    accentBg: 'bg-amber-500',
    motto: 'Unstoppable Force!',
  },
];

export interface MathQuestion {
  id: string;
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
  displayText: string;
  createdAt: number;
}

export interface PlayerStats {
  id: 'P1' | 'P2';
  name: string;
  avatar: ToyAvatar;
  score: number; // total correct
  totalAttempts: number;
  streak: number;
  highestStreak: number;
  fastAnswersCount: number; // under 3.0s
  totalResponseTimeMs: number;
}

export interface GameSettings {
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  aiDifficulty: AIDifficulty;
  winningThreshold: number; // e.g. 100 points shift
  enableSound: boolean;
  basePullForce: number; // default rope pull per answer (e.g. 12)
  speedBonusThresholdMs: number; // e.g. 2500ms
}

export interface MatchSummary {
  winner: 'P1' | 'P2';
  winningAvatar: ToyAvatar;
  p1Stats: PlayerStats;
  p2Stats: PlayerStats;
  durationSeconds: number;
}
