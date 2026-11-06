import React, { useState, useEffect } from 'react';
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
  const [aiThinking, setAiThinking] = useState<boolean>(false);

  // Clear input when question changes
  useEffect(() => {
    setInputVal('');
    setFeedback(null);
  }, [question.id]);

  // AI Bot Auto-Solve Logic
  useEffect(() => {
    if (!isAI || disabled || isFrozen) return;

    setAiThinking(true);

    // AI reaction time based on difficulty
    let delayMs = 2200; // Easy
    let errorRate = 0.25; // 25% mistakes

    if (aiDifficulty === 'MEDIUM') {
      delayMs = 1700;
      errorRate = 0.12;
    } else if (aiDifficulty === 'HARD') {
      delayMs = 1100;
      errorRate = 0.04;
    }

    // Add random noise to delay
    const totalDelay = delayMs + Math.random() * 400;

    const timer = setTimeout(() => {
      setAiThinking(false);
      const isCorrect = Math.random() > errorRate;
      const submittedAnswer = isCorrect ? question.answer : question.answer + (Math.random() > 0.5 ? 2 : -2);
      
      const responseTime = Date.now() - question.createdAt;
      checkAndSubmit(submittedAnswer, responseTime);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [question.id, isAI, disabled, isFrozen, aiDifficulty]);

  // Physical Keyboard listener for Player 1
  useEffect(() => {
    if (playerId !== 'P1' || isAI || disabled || isFrozen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setInputVal((prev) => (prev.length < 5 ? prev + e.key : prev));
      } else if (e.key === 'Backspace') {
        setInputVal((prev) => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        handleFormSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputVal, disabled, isFrozen, question, playerId, isAI]);

  const checkAndSubmit = (valNum: number, timeMs: number) => {
    if (isNaN(valNum)) return;

    if (valNum === question.answer) {
      if (timeMs < 2500) {
        setFeedback('SPEED_BONUS');
      } else {
        setFeedback('CORRECT');
      }
      onAnswerSubmit(valNum, timeMs);
    } else {
      setFeedback('WRONG');
      setIsFrozen(true);
      onAnswerSubmit(valNum, timeMs);

      // 1 second penalty freeze on wrong answer
      setTimeout(() => {
        setIsFrozen(false);
        setFeedback(null);
        setInputVal('');
      }, 1000);
    }
  };

  const handleFormSubmit = () => {
    if (!inputVal.trim() || isFrozen || disabled) return;
    const num = parseInt(inputVal, 10);
    const timeMs = Date.now() - question.createdAt;
    checkAndSubmit(num, timeMs);
  };

  const handleNumpadClick = (key: string) => {
    if (isFrozen || disabled || isAI) return;

    if (key === 'CLEAR') {
      setInputVal('');
    } else if (key === 'SUBMIT') {
      handleFormSubmit();
    } else {
      if (inputVal.length < 5) {
        setInputVal((prev) => prev + key);
      }
    }
  };

  const isP1 = playerId === 'P1';

  return (
    <div
      className={`w-full rounded-3xl p-5 border-2 transition-all select-none relative overflow-hidden shadow-xl ${
        isP1
          ? 'bg-gradient-to-b from-slate-900 via-blue-950/40 to-slate-900 border-blue-500/40'
          : 'bg-gradient-to-b from-slate-900 via-red-950/40 to-slate-900 border-red-500/40'
      } ${feedback === 'CORRECT' ? 'ring-4 ring-emerald-500/50' : ''} ${
        feedback === 'SPEED_BONUS' ? 'ring-4 ring-amber-500/60' : ''
      } ${feedback === 'WRONG' ? 'ring-4 ring-red-500/60 animate-shake' : ''}`}
    >
      {/* Player Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl border ${
              isP1 ? 'bg-blue-500/20 border-blue-400/40' : 'bg-red-500/20 border-red-400/40'
            }`}
          >
            {avatar.emoji}
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              {playerName} {isAI && <Bot className="w-3.5 h-3.5 text-purple-400" />}
            </h3>
            <p className="text-[11px] text-slate-400">
              Score: <strong className="text-white">{stats.score}</strong> · Streak:{' '}
              <strong className="text-amber-400">{stats.streak}</strong>
            </p>
          </div>
        </div>

        {/* Speed Streak Badge */}
        {stats.streak >= 3 && (
          <div className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-300 text-xs font-black flex items-center gap-1 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-amber-400" /> FIRE STREAK
          </div>
        )}
      </div>

      {/* MATH QUESTION DISPLAY */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-2 relative mb-4">
        {/* Status Feedback Overlay */}
        {feedback === 'CORRECT' && (
          <div className="absolute inset-0 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl flex items-center justify-center gap-2 text-emerald-300 font-extrabold text-sm z-20">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> Correct! +Rope Pull!
          </div>
        )}
        {feedback === 'SPEED_BONUS' && (
          <div className="absolute inset-0 bg-amber-950/90 border-2 border-amber-500 rounded-2xl flex items-center justify-center gap-2 text-amber-300 font-black text-sm z-20">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> 2X SPEED BONUS PULL!
          </div>
        )}
        {feedback === 'WRONG' && (
          <div className="absolute inset-0 bg-red-950/90 border-2 border-red-500 rounded-2xl flex items-center justify-center gap-2 text-red-300 font-extrabold text-xs z-20">
            <XCircle className="w-5 h-5 text-red-400" /> Wrong Answer! 1s Penalty Stall
          </div>
        )}

        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solve & Pull</p>
        <div className="text-3xl md:text-4xl font-black text-white tracking-wider font-mono tabular-nums">
          {question.displayText}
        </div>

        {/* Input Value Box */}
        <div className="pt-1">
          <div className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl py-2 px-3 text-center text-2xl font-black text-amber-300 min-h-[48px] flex items-center justify-center font-mono">
            {isAI ? (
              aiThinking ? (
                <span className="text-xs text-purple-400 flex items-center gap-1 font-sans animate-pulse">
                  <Bot className="w-4 h-4" /> AI Thinking...
                </span>
              ) : (
                '...'
              )
            ) : (
              inputVal || <span className="text-slate-600 text-lg">Type answer</span>
            )}
          </div>
        </div>
      </div>

      {/* TOUCH NUMPAD CONTROLS */}
      {!isAI && (
        <div className="space-y-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleNumpadClick(digit)}
                disabled={isFrozen || disabled}
                className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-white font-black text-lg md:text-xl transition-all disabled:opacity-50"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={() => handleNumpadClick('CLEAR')}
              disabled={isFrozen || disabled}
              className="py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 text-red-300 font-bold text-xs flex items-center justify-center gap-1 transition-all disabled:opacity-50"
            >
              <Delete className="w-4 h-4" /> Clear
            </button>
            <button
              onClick={() => handleNumpadClick('0')}
              disabled={isFrozen || disabled}
              className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-white font-black text-lg md:text-xl transition-all disabled:opacity-50"
            >
              0
            </button>
            <button
              onClick={() => handleNumpadClick('SUBMIT')}
              disabled={isFrozen || disabled || !inputVal}
              className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 border border-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-600/30 disabled:opacity-40"
            >
              Submit ↵
            </button>
          </div>
          {isP1 && (
            <p className="text-[10px] text-slate-400 text-center">
              💡 Tip: P1 can also use laptop keyboard numbers &amp; Enter key!
            </p>
          )}
        </div>
      )}

      {/* AI Bot Active Card Placeholder */}
      {isAI && (
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-center space-y-2">
          <p className="text-xs text-slate-400">
            🤖 AI Bot is competing automatically on difficulty:{' '}
            <strong className="text-purple-300">{aiDifficulty}</strong>
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-500 h-full animate-pulse w-full" />
          </div>
        </div>
      )}
    </div>
  );
};
