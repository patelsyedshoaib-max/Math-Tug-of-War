import React, { useState } from 'react';
import { Volume2, VolumeX, HelpCircle, Trophy, RotateCcw, Code } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface NavbarProps {
  onOpenRules: () => void;
  onOpenCode: () => void;
  onResetGame: () => void;
  inGame: boolean;
  scoreP1?: number;
  scoreP2?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRules,
  onOpenCode,
  onResetGame,
  inGame,
  scoreP1 = 0,
  scoreP2 = 0,
}) => {
  const [isMuted, setIsMuted] = useState(() => soundEngine.getIsMuted());

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between gap-4 select-none z-30">
      {/* Zone 1: Single-line Brand Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-red-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
          🪢
        </div>
        <div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onResetGame();
            }}
            className="text-lg md:text-xl font-black tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
          >
            Math Tug-of-War
          </a>
          <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
            Rope Pull Math Puzzle Game
          </p>
        </div>
      </div>

      {/* Zone 2: Mid Links / Live In-Game Scoreboard */}
      <div className="flex items-center gap-6 shrink-0">
        {inGame ? (
          <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700/80 rounded-full px-4 py-1 text-xs md:text-sm font-semibold text-slate-200 shadow-inner">
            <span className="text-blue-400">P1: {scoreP1}</span>
            <span className="text-slate-500">|</span>
            <span className="text-red-500 font-bold">VS</span>
            <span className="text-slate-500">|</span>
            <span className="text-red-400">P2: {scoreP2}</span>
          </div>
        ) : (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={onOpenRules}
              className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>How To Play</span>
            </button>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400 whitespace-nowrap shrink-0">
              ⚡ Speed Streak Multipliers
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400 whitespace-nowrap shrink-0">
              🔴 Center Red Line Threshold
            </span>
          </nav>
        )}
      </div>

      {/* Zone 3: Primary Action & Sound Toggle */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={onOpenCode}
          className="p-2 text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/60 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
          title="Source Code Files Explorer"
        >
          <Code className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">Code Files</span>
        </button>

        <button
          onClick={onOpenRules}
          className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Game Rules"
        >
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">Rules</span>
        </button>

        <button
          onClick={handleToggleSound}
          className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
            isMuted
              ? 'bg-red-950/40 border-red-800/60 text-red-300 hover:bg-red-900/50'
              : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
        </button>

        {inGame && (
          <button
            onClick={onResetGame}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </header>
  );
};
