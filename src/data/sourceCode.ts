export interface CodeFile {
  filename: string;
  filepath: string;
  language: string;
  category: 'Components' | 'Types & Utilities' | 'Core App';
  code: string;
}

export const ALL_SOURCE_FILES: CodeFile[] = [
  {
    filename: 'App.tsx',
    filepath: '/src/App.tsx',
    language: 'typescript',
    category: 'Core App',
    code: `import React, { useState, useEffect, useRef } from 'react';
import {
  GamePhase,
  GameMode,
  DifficultyLevel,
  AIDifficulty,
  ToyAvatar,
  TOY_AVATARS,
  MathQuestion,
  PlayerStats,
  MatchSummary,
} from './types/game';
import { generateMathQuestion } from './utils/mathGenerator';
import { soundEngine } from './utils/soundEngine';
import { Navbar } from './components/Navbar';
import { RulesModal } from './components/RulesModal';
import { AvatarSelect } from './components/AvatarSelect';
import { RopeField } from './components/RopeField';
import { PlayerCard } from './components/PlayerCard';
import { VictoryModal } from './components/VictoryModal';
import { CodeViewerModal } from './components/CodeViewerModal';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [gameMode, setGameMode] = useState<GameMode>('TWO_PLAYER');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('EASY');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('MEDIUM');
  const [winningThreshold, setWinningThreshold] = useState<number>(100);

  const [p1Avatar, setP1Avatar] = useState<ToyAvatar>(TOY_AVATARS[0]);
  const [p2Avatar, setP2Avatar] = useState<ToyAvatar>(TOY_AVATARS[1]);

  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false);

  // Live Match State
  const [ropePosition, setRopePosition] = useState<number>(0);
  const [p1Question, setP1Question] = useState<MathQuestion>(() => generateMathQuestion('EASY'));
  const [p2Question, setP2Question] = useState<MathQuestion>(() => generateMathQuestion('EASY'));

  const [p1Stats, setP1Stats] = useState<PlayerStats>({
    id: 'P1',
    name: 'Player 1',
    avatar: TOY_AVATARS[0],
    score: 0,
    totalAttempts: 0,
    streak: 0,
    highestStreak: 0,
    fastAnswersCount: 0,
    totalResponseTimeMs: 0,
  });

  const [p2Stats, setP2Stats] = useState<PlayerStats>({
    id: 'P2',
    name: 'Player 2',
    avatar: TOY_AVATARS[1],
    score: 0,
    totalAttempts: 0,
    streak: 0,
    highestStreak: 0,
    fastAnswersCount: 0,
    totalResponseTimeMs: 0,
  });

  const [lastPuller, setLastPuller] = useState<'P1' | 'P2' | null>(null);
  const [winner, setWinner] = useState<'P1' | 'P2' | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
  const matchStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (phase === 'COUNTDOWN') {
      soundEngine.playCountdownSound(false);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            soundEngine.playCountdownSound(true);
            setPhase('PLAYING');
            matchStartTimeRef.current = Date.now();
            return 0;
          }
          soundEngine.playCountdownSound(false);
          return prev - 1;
        });
      }, 900);
      return () => clearInterval(timer);
    }
  }, [phase]);

  const startMatch = () => {
    setRopePosition(0);
    setLastPuller(null);
    setWinner(null);
    setMatchSummary(null);
    setCountdown(3);

    setP1Stats({
      id: 'P1',
      name: 'Player 1',
      avatar: p1Avatar,
      score: 0,
      totalAttempts: 0,
      streak: 0,
      highestStreak: 0,
      fastAnswersCount: 0,
      totalResponseTimeMs: 0,
    });

    setP2Stats({
      id: 'P2',
      name: gameMode === 'VS_AI' ? 'Cyber Bot' : 'Player 2',
      avatar: p2Avatar,
      score: 0,
      totalAttempts: 0,
      streak: 0,
      highestStreak: 0,
      fastAnswersCount: 0,
      totalResponseTimeMs: 0,
    });

    setP1Question(generateMathQuestion(difficulty));
    setP2Question(generateMathQuestion(difficulty));

    setPhase('COUNTDOWN');
  };

  const handleP1Answer = (answerNum: number, timeMs: number) => {
    if (phase !== 'PLAYING' || winner) return;

    const isCorrect = answerNum === p1Question.answer;

    if (isCorrect) {
      soundEngine.playPullSound();

      let pullForce = 12;
      const isFast = timeMs < 2500;
      if (isFast) pullForce += 10;

      const newStreak = p1Stats.streak + 1;
      if (newStreak >= 3) {
        pullForce += 6;
        soundEngine.playStreakSound();
      } else {
        soundEngine.playCorrectSound();
      }

      const newPos = ropePosition - pullForce;
      setRopePosition(newPos);
      setLastPuller('P1');

      setP1Stats((prev) => ({
        ...prev,
        score: prev.score + 1,
        totalAttempts: prev.totalAttempts + 1,
        streak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak),
        fastAnswersCount: isFast ? prev.fastAnswersCount + 1 : prev.fastAnswersCount,
        totalResponseTimeMs: prev.totalResponseTimeMs + timeMs,
      }));

      if (newPos <= -winningThreshold) {
        triggerVictory('P1');
        return;
      }

      setP1Question(generateMathQuestion(difficulty));
    } else {
      soundEngine.playErrorSound();
      setRopePosition((prev) => Math.min(winningThreshold, prev + 4));

      setP1Stats((prev) => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        streak: 0,
      }));
    }
  };

  const handleP2Answer = (answerNum: number, timeMs: number) => {
    if (phase !== 'PLAYING' || winner) return;

    const isCorrect = answerNum === p2Question.answer;

    if (isCorrect) {
      soundEngine.playPullSound();

      let pullForce = 12;
      const isFast = timeMs < 2500;
      if (isFast) pullForce += 10;

      const newStreak = p2Stats.streak + 1;
      if (newStreak >= 3) {
        pullForce += 6;
        soundEngine.playStreakSound();
      } else {
        soundEngine.playCorrectSound();
      }

      const newPos = ropePosition + pullForce;
      setRopePosition(newPos);
      setLastPuller('P2');

      setP2Stats((prev) => ({
        ...prev,
        score: prev.score + 1,
        totalAttempts: prev.totalAttempts + 1,
        streak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak),
        fastAnswersCount: isFast ? prev.fastAnswersCount + 1 : prev.fastAnswersCount,
        totalResponseTimeMs: prev.totalResponseTimeMs + timeMs,
      }));

      if (newPos >= winningThreshold) {
        triggerVictory('P2');
        return;
      }

      setP2Question(generateMathQuestion(difficulty));
    } else {
      soundEngine.playErrorSound();
      setRopePosition((prev) => Math.max(-winningThreshold, prev - 4));

      setP2Stats((prev) => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        streak: 0,
      }));
    }
  };

  const triggerVictory = (winningPlayer: 'P1' | 'P2') => {
    setWinner(winningPlayer);
    setPhase('VICTORY');
    soundEngine.playVictorySound();

    const durationSeconds = Math.round((Date.now() - matchStartTimeRef.current) / 1000);

    setMatchSummary({
      winner: winningPlayer,
      winningAvatar: winningPlayer === 'P1' ? p1Avatar : p2Avatar,
      p1Stats,
      p2Stats,
      durationSeconds,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenCode={() => setIsCodeOpen(true)}
        onResetGame={() => setPhase('MENU')}
        inGame={phase === 'PLAYING' || phase === 'COUNTDOWN'}
        scoreP1={p1Stats.score}
        scoreP2={p2Stats.score}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <CodeViewerModal isOpen={isCodeOpen} onClose={() => setIsCodeOpen(false)} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        {phase === 'MENU' && (
          <AvatarSelect
            p1Avatar={p1Avatar}
            p2Avatar={p2Avatar}
            setP1Avatar={setP1Avatar}
            setP2Avatar={setP2Avatar}
            gameMode={gameMode}
            setGameMode={setGameMode}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            aiDifficulty={aiDifficulty}
            setAiDifficulty={setAiDifficulty}
            winningThreshold={winningThreshold}
            setWinningThreshold={setWinningThreshold}
            onStartGame={startMatch}
          />
        )}

        {phase === 'COUNTDOWN' && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-28 h-28 rounded-full bg-blue-600/20 border-4 border-blue-500 flex items-center justify-center text-6xl font-black text-blue-400 shadow-2xl animate-ping">
              {countdown > 0 ? countdown : 'GO!'}
            </div>
            <h2 className="text-2xl font-black text-white">Get Ready to Tug!</h2>
            <p className="text-sm text-slate-400">
              Solve math problems to pull the center <span className="text-red-400 font-bold">Red Line</span>!
            </p>
          </div>
        )}

        {(phase === 'PLAYING' || phase === 'VICTORY') && (
          <div className="space-y-6">
            <RopeField
              ropePosition={ropePosition}
              winningThreshold={winningThreshold}
              p1Avatar={p1Avatar}
              p2Avatar={p2Avatar}
              p1Streak={p1Stats.streak}
              p2Streak={p2Stats.streak}
              lastPuller={lastPuller}
              winner={winner}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlayerCard
                playerId="P1"
                playerName="Player 1"
                avatar={p1Avatar}
                question={p1Question}
                stats={p1Stats}
                onAnswerSubmit={handleP1Answer}
                disabled={phase !== 'PLAYING' || !!winner}
              />

              <PlayerCard
                playerId="P2"
                playerName={gameMode === 'VS_AI' ? 'Cyber Bot' : 'Player 2'}
                avatar={p2Avatar}
                question={p2Question}
                stats={p2Stats}
                isAI={gameMode === 'VS_AI'}
                aiDifficulty={aiDifficulty}
                onAnswerSubmit={handleP2Answer}
                disabled={phase !== 'PLAYING' || !!winner}
              />
            </div>
          </div>
        )}
      </main>

      {phase === 'VICTORY' && (
        <VictoryModal
          summary={matchSummary}
          onRematch={startMatch}
          onHome={() => setPhase('MENU')}
        />
      )}

      <footer className="w-full py-3 border-t border-slate-900 text-center text-xs text-slate-600">
        Math Tug-of-War Game · Head-to-Head Speed Math Challenge
      </footer>
    </div>
  );
}`,
  },
  {
    filename: 'RopeField.tsx',
    filepath: '/src/components/RopeField.tsx',
    language: 'typescript',
    category: 'Components',
    code: `import React from 'react';
import { motion } from 'motion/react';
import { ToyAvatar } from '../types/game';
import { Flame, Flag } from 'lucide-react';

interface RopeFieldProps {
  ropePosition: number;
  winningThreshold: number;
  p1Avatar: ToyAvatar;
  p2Avatar: ToyAvatar;
  p1Streak: number;
  p2Streak: number;
  lastPuller: 'P1' | 'P2' | null;
  winner: 'P1' | 'P2' | null;
}

export const RopeField: React.FC<RopeFieldProps> = ({
  ropePosition,
  winningThreshold,
  p1Avatar,
  p2Avatar,
  p1Streak,
  p2Streak,
  lastPuller,
  winner,
}) => {
  const maxShiftPercent = 40;
  const shiftPercent = (ropePosition / winningThreshold) * maxShiftPercent;

  const isP1InDanger = ropePosition > winningThreshold * 0.65;
  const isP2InDanger = ropePosition < -winningThreshold * 0.65;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 space-y-4 relative overflow-hidden select-none shadow-2xl">
      <div className="relative z-10 flex items-center justify-between text-xs font-bold text-slate-300 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xl">
            {p1Avatar.emoji}
          </div>
          <div>
            <p className="font-extrabold text-blue-400">{p1Avatar.name}</p>
            {p1Streak >= 3 && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold animate-pulse">
                <Flame className="w-3 h-3 fill-amber-400" /> {p1Streak}x Fire Streak!
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-red-400 font-black text-[11px] flex items-center gap-1 shadow-sm">
            <Flag className="w-3.5 h-3.5 fill-red-500" /> CENTER RED LINE
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="font-extrabold text-red-400">{p2Avatar.name}</p>
            {p2Streak >= 3 && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold animate-pulse justify-end">
                <Flame className="w-3 h-3 fill-amber-400" /> {p2Streak}x Fire Streak!
              </span>
            )}
          </div>
          <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-xl">
            {p2Avatar.emoji}
          </div>
        </div>
      </div>

      <div className="relative h-44 md:h-52 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-red-500 via-red-600 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-20 flex flex-col items-center justify-between py-1">
          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-black text-white">▲</div>
          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-black text-white">▼</div>
        </div>

        <motion.div
          className="absolute inset-x-0 flex items-center justify-center z-10"
          animate={{ x: \`\${shiftPercent}%\` }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-600/30 border-2 border-blue-400/80 flex items-center justify-center text-4xl md:text-5xl">
            {p1Avatar.emoji}
          </div>
          <div className="h-4 md:h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 w-32 md:w-48" />
          <div className="w-6 h-10 bg-red-600 border-2 border-white rounded-md flex items-center justify-center text-white font-black">🎀</div>
          <div className="h-4 md:h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 w-32 md:w-48" />
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-red-600/30 border-2 border-red-400/80 flex items-center justify-center text-4xl md:text-5xl">
            {p2Avatar.emoji}
          </div>
        </motion.div>
      </div>
    </div>
  );
};`,
  },
  {
    filename: 'PlayerCard.tsx',
    filepath: '/src/components/PlayerCard.tsx',
    language: 'typescript',
    category: 'Components',
    code: `import React, { useState, useEffect } from 'react';
import { MathQuestion, ToyAvatar, PlayerStats } from '../types/game';
import { CheckCircle, XCircle, Zap, Flame, Bot, Delete } from 'lucide-react';

interface PlayerCardProps {
  playerId: 'P1' | 'P2';
  playerName: string;
  avatar: ToyAvatar;
  question: MathQuestion;
  stats: PlayerStats;
  isAI?: boolean;
  aiDifficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  onAnswerSubmit: (answerNum: number, responseTimeMs: number) => void;
  disabled?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  playerId,
  playerName,
  avatar,
  question,
  stats,
  isAI = false,
  aiDifficulty = 'MEDIUM',
  onAnswerSubmit,
  disabled = false,
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | 'SPEED_BONUS' | null>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);

  useEffect(() => {
    setInputVal('');
    setFeedback(null);
  }, [question.id]);

  const handleNumpadClick = (key: string) => {
    if (isFrozen || disabled || isAI) return;
    if (key === 'CLEAR') setInputVal('');
    else if (key === 'SUBMIT') handleFormSubmit();
    else if (inputVal.length < 5) setInputVal((prev) => prev + key);
  };

  const handleFormSubmit = () => {
    if (!inputVal.trim() || isFrozen || disabled) return;
    const num = parseInt(inputVal, 10);
    const timeMs = Date.now() - question.createdAt;
    if (num === question.answer) {
      setFeedback(timeMs < 2500 ? 'SPEED_BONUS' : 'CORRECT');
      onAnswerSubmit(num, timeMs);
    } else {
      setFeedback('WRONG');
      setIsFrozen(true);
      onAnswerSubmit(num, timeMs);
      setTimeout(() => {
        setIsFrozen(false);
        setFeedback(null);
        setInputVal('');
      }, 1000);
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-blue-500/40 rounded-3xl p-5 space-y-4">
      <div className="text-3xl font-black text-center font-mono">{question.displayText}</div>
      <div className="bg-slate-950 p-3 text-center text-2xl font-bold text-amber-300 rounded-xl">
        {inputVal || 'Enter Answer'}
      </div>
    </div>
  );
};`,
  },
  {
    filename: 'AvatarSelect.tsx',
    filepath: '/src/components/AvatarSelect.tsx',
    language: 'typescript',
    category: 'Components',
    code: `import React from 'react';
import { TOY_AVATARS, ToyAvatar, GameMode, AIDifficulty, DifficultyLevel } from '../types/game';

interface AvatarSelectProps {
  p1Avatar: ToyAvatar;
  p2Avatar: ToyAvatar;
  setP1Avatar: (avatar: ToyAvatar) => void;
  setP2Avatar: (avatar: ToyAvatar) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: DifficultyLevel;
  setDifficulty: (diff: DifficultyLevel) => void;
  aiDifficulty: AIDifficulty;
  setAiDifficulty: (aiDiff: AIDifficulty) => void;
  winningThreshold: number;
  setWinningThreshold: (threshold: number) => void;
  onStartGame: () => void;
}

export const AvatarSelect: React.FC<AvatarSelectProps> = ({
  p1Avatar,
  p2Avatar,
  setP1Avatar,
  setP2Avatar,
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  winningThreshold,
  onStartGame,
}) => {
  return (
    <div className="space-y-6 text-center">
      <h1 className="text-4xl font-black text-white">Choose Toy Fighter</h1>
      <button onClick={onStartGame} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl">
        Start Game
      </button>
    </div>
  );
};`,
  },
  {
    filename: 'game.ts',
    filepath: '/src/types/game.ts',
    language: 'typescript',
    category: 'Types & Utilities',
    code: `export type GamePhase = 'MENU' | 'CHARACTER_SELECT' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'VICTORY';
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
  score: number;
  totalAttempts: number;
  streak: number;
  highestStreak: number;
  fastAnswersCount: number;
  totalResponseTimeMs: number;
}

export interface MatchSummary {
  winner: 'P1' | 'P2';
  winningAvatar: ToyAvatar;
  p1Stats: PlayerStats;
  p2Stats: PlayerStats;
  durationSeconds: number;
}`,
  },
  {
    filename: 'mathGenerator.ts',
    filepath: '/src/utils/mathGenerator.ts',
    language: 'typescript',
    category: 'Types & Utilities',
    code: `import { DifficultyLevel, MathQuestion } from '../types/game';

let questionCounter = 0;

export function generateMathQuestion(difficulty: DifficultyLevel): MathQuestion {
  questionCounter++;
  const id = \`q_\${questionCounter}_\${Date.now()}\`;
  let operator: '+' | '-' | '×' | '÷' = '+';
  let num1 = 1;
  let num2 = 1;
  let answer = 2;

  if (difficulty === 'EASY') {
    const isAdd = Math.random() > 0.4;
    if (isAdd) {
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 + num2;
    } else {
      operator = '-';
      num1 = Math.floor(Math.random() * 15) + 5;
      num2 = Math.floor(Math.random() * num1) + 1;
      answer = num1 - num2;
    }
  }

  return {
    id,
    num1,
    num2,
    operator,
    answer,
    displayText: \`\${num1} \${operator} \${num2} = ?\`,
    createdAt: Date.now(),
  };
}`,
  },
  {
    filename: 'soundEngine.ts',
    filepath: '/src/utils/soundEngine.ts',
    language: 'typescript',
    category: 'Types & Utilities',
    code: `class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  public playPullSound() {
    if (this.isMuted) return;
    // Web Audio API synth output
  }

  public playCorrectSound() {}
  public playErrorSound() {}
  public playStreakSound() {}
  public playVictorySound() {}
  public playCountdownSound() {}
}

export const soundEngine = new SoundEngine();`,
  },
];
