import React from 'react';
import { TOY_AVATARS, ToyAvatar, GameMode, AIDifficulty, DifficultyLevel } from '../types/game';
import { Bot, User, Shield, Zap, Sparkles, Check } from 'lucide-react';

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
  aiDifficulty,
  setAiDifficulty,
  winningThreshold,
  setWinningThreshold,
  onStartGame,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6 select-none">
      {/* Top Banner Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Math Tug-of-War Battle Arena
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Choose Your Toy Fighters
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Select game modes, math difficulties, and toy avatars before entering the rope pull arena.
        </p>
      </div>

      {/* Mode & Difficulty Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Game Mode */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" /> Game Mode
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setGameMode('TWO_PLAYER')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                gameMode === 'TWO_PLAYER'
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">👥</span>
                {gameMode === 'TWO_PLAYER' && <Check className="w-4 h-4 text-blue-400" />}
              </div>
              <div>
                <p className="font-bold text-sm">2 Player</p>
                <p className="text-[11px] opacity-80">Same Screen</p>
              </div>
            </button>

            <button
              onClick={() => setGameMode('VS_AI')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                gameMode === 'VS_AI'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">🤖</span>
                {gameMode === 'VS_AI' && <Check className="w-4 h-4 text-purple-400" />}
              </div>
              <div>
                <p className="font-bold text-sm">VS AI Bot</p>
                <p className="text-[11px] opacity-80">Single Player</p>
              </div>
            </button>
          </div>
        </div>

        {/* Math Difficulty */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Math Difficulty
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {(['EASY', 'MEDIUM', 'HARD', 'MIXED'] as DifficultyLevel[]).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  difficulty === diff
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {diff === 'EASY' && '➕ Easy (+ / -)'}
                {diff === 'MEDIUM' && '✖️ Medium (× / ÷)'}
                {diff === 'HARD' && '🔥 Hard (Advanced)'}
                {diff === 'MIXED' && '🎲 Mixed All'}
              </button>
            ))}
          </div>
        </div>

        {/* Match Settings (AI Level / Rope Length) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Arena Settings
          </h2>

          {gameMode === 'VS_AI' && (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Bot className="w-3.5 h-3.5 text-purple-400" /> AI Bot Difficulty:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['EASY', 'MEDIUM', 'HARD'] as AIDifficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setAiDifficulty(level)}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold ${
                      aiDifficulty === level
                        ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {level === 'EASY' && 'Slow'}
                    {level === 'MEDIUM' && 'Balanced'}
                    {level === 'HARD' && 'Pro Master'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">Rope Distance Match:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Quick (60)', val: 60 },
                { label: 'Standard (100)', val: 100 },
                { label: 'Marathon (150)', val: 150 },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setWinningThreshold(item.val)}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold ${
                    winningThreshold === item.val
                      ? 'bg-blue-600/30 border-blue-400 text-blue-200'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Character Selection Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player 1 Selection */}
        <div className="bg-slate-900/80 border-2 border-blue-500/40 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1 bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider rounded-bl-xl shadow-md">
            Player 1 (Left Side)
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-4xl shadow-inner">
              {p1Avatar.emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{p1Avatar.name}</h3>
              <p className="text-xs text-blue-400 font-medium">{p1Avatar.motto}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TOY_AVATARS.map((avatar) => {
              const isSelected = p1Avatar.id === avatar.id;
              const isP2Choice = p2Avatar.id === avatar.id;
              return (
                <button
                  key={`p1_${avatar.id}`}
                  onClick={() => setP1Avatar(avatar)}
                  className={`p-2.5 rounded-xl border text-center transition-all relative ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 text-white ring-2 ring-blue-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-3xl block mb-1">{avatar.emoji}</span>
                  <span className="text-[11px] font-bold block truncate">{avatar.name}</span>
                  {isP2Choice && (
                    <span className="absolute top-1 right-1 text-[9px] bg-red-500/80 text-white px-1 rounded font-bold">
                      P2
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Player 2 / AI Selection */}
        <div className="bg-slate-900/80 border-2 border-red-500/40 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider rounded-bl-xl shadow-md">
            {gameMode === 'VS_AI' ? 'AI Bot (Right Side)' : 'Player 2 (Right Side)'}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-4xl shadow-inner">
              {p2Avatar.emoji}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {p2Avatar.name} {gameMode === 'VS_AI' && '(Bot)'}
              </h3>
              <p className="text-xs text-red-400 font-medium">{p2Avatar.motto}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {TOY_AVATARS.map((avatar) => {
              const isSelected = p2Avatar.id === avatar.id;
              const isP1Choice = p1Avatar.id === avatar.id;
              return (
                <button
                  key={`p2_${avatar.id}`}
                  onClick={() => setP2Avatar(avatar)}
                  className={`p-2.5 rounded-xl border text-center transition-all relative ${
                    isSelected
                      ? 'bg-red-600/30 border-red-400 text-white ring-2 ring-red-500/50'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-3xl block mb-1">{avatar.emoji}</span>
                  <span className="text-[11px] font-bold block truncate">{avatar.name}</span>
                  {isP1Choice && (
                    <span className="absolute top-1 right-1 text-[9px] bg-blue-500/80 text-white px-1 rounded font-bold">
                      P1
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Start Game Action */}
      <div className="text-center pt-2">
        <button
          onClick={onStartGame}
          className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-600 hover:from-blue-500 hover:to-red-500 text-white font-black text-lg md:text-xl rounded-2xl shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mx-auto"
        >
          <span>🪢 START TUG-OF-WAR MATCH!</span>
        </button>
      </div>
    </div>
  );
};
