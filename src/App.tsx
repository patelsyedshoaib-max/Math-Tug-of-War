import React, { useState, useEffect, useRef } from 'react';
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
import { Play, RotateCcw, Trophy, Sparkles } from 'lucide-react';

export default function App() {
  // Game Setup State
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [gameMode, setGameMode] = useState<GameMode>('TWO_PLAYER');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('EASY');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('MEDIUM');
  const [winningThreshold, setWinningThreshold] = useState<number>(100);

  const [p1Avatar, setP1Avatar] = useState<ToyAvatar>(TOY_AVATARS[0]); // Teddy Bear
  const [p2Avatar, setP2Avatar] = useState<ToyAvatar>(TOY_AVATARS[1]); // Cyber Robot

  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isCodeOpen, setIsCodeOpen] = useState<boolean>(false);

  // Live Match State
  const [ropePosition, setRopePosition] = useState<number>(0); // -100 to +100
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

  // Handle Countdown before game starts
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

      // Calculate Pull Force
      let pullForce = 12;
      const isFast = timeMs < 2500;
      if (isFast) pullForce += 10; // Speed Bonus

      const newStreak = p1Stats.streak + 1;
      if (newStreak >= 3) {
        pullForce += 6; // Streak Bonus
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

      // Check P1 Victory
      if (newPos <= -winningThreshold) {
        triggerVictory('P1');
        return;
      }

      // Next Question
      setP1Question(generateMathQuestion(difficulty));
    } else {
      soundEngine.playErrorSound();
      // Penalty shift towards opponent (+4)
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

      // Calculate Pull Force
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

      // Check P2 Victory
      if (newPos >= winningThreshold) {
        triggerVictory('P2');
        return;
      }

      // Next Question
      setP2Question(generateMathQuestion(difficulty));
    } else {
      soundEngine.playErrorSound();
      // Penalty shift towards opponent (-4)
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenCode={() => setIsCodeOpen(true)}
        onResetGame={() => setPhase('MENU')}
        inGame={phase === 'PLAYING' || phase === 'COUNTDOWN'}
        scoreP1={p1Stats.score}
        scoreP2={p2Stats.score}
      />

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* Source Code File Explorer Modal */}
      <CodeViewerModal isOpen={isCodeOpen} onClose={() => setIsCodeOpen(false)} />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-center">
        {/* PHASE 1: MENU / CHARACTER SELECT */}
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

        {/* PHASE 2: COUNTDOWN */}
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

        {/* PHASE 3: ACTIVE PLAYING ARENA */}
        {(phase === 'PLAYING' || phase === 'VICTORY') && (
          <div className="space-y-6">
            {/* TUG-OF-WAR ARENA ROPE FIELD */}
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

            {/* SPLIT MATH PROBLEM CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player 1 Card (Left) */}
              <PlayerCard
                playerId="P1"
                playerName="Player 1"
                avatar={p1Avatar}
                question={p1Question}
                stats={p1Stats}
                onAnswerSubmit={handleP1Answer}
                disabled={phase !== 'PLAYING' || !!winner}
              />

              {/* Player 2 / AI Card (Right) */}
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

      {/* VICTORY CELEBRATION MODAL */}
      {phase === 'VICTORY' && (
        <VictoryModal
          summary={matchSummary}
          onRematch={startMatch}
          onHome={() => setPhase('MENU')}
        />
      )}

      {/* Quiet Clean Footer */}
      <footer className="w-full py-3 border-t border-slate-900 text-center text-xs text-slate-600">
        Math Tug-of-War Game · Head-to-Head Speed Math Challenge
      </footer>
    </div>
  );
}
