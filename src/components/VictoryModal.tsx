import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MatchSummary } from '../types/game';
import { Trophy, Zap, Target, Flame, RotateCcw, Home, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  summary: MatchSummary | null;
  onRematch: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ summary, onRematch, onHome }) => {
  useEffect(() => {
    if (summary) {
      // Trigger canvas-confetti burst
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [summary]);

  if (!summary) return null;

  const { winner, winningAvatar, p1Stats, p2Stats, durationSeconds } = summary;
  const isP1Winner = winner === 'P1';

  const calcAccuracy = (stats: typeof p1Stats) => {
    if (stats.totalAttempts === 0) return 100;
    return Math.round((stats.score / stats.totalAttempts) * 100);
  };

  const calcAvgSpeed = (stats: typeof p1Stats) => {
    if (stats.score === 0) return '0.0';
    return (stats.totalResponseTimeMs / stats.score / 1000).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-xl w-full p-6 md:p-8 text-slate-100 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Glowing Champion Banner Background */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent pointer-events-none" />

        {/* Winner Title */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 font-black text-xs uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4" /> TUG-OF-WAR CHAMPION!
          </div>

          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-6xl shadow-2xl my-2 animate-bounce">
            {winningAvatar.emoji}
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            {isP1Winner ? p1Stats.name : p2Stats.name} Wins!
          </h2>
          <p className="text-sm text-amber-300 font-semibold">{winningAvatar.motto}</p>
        </div>

        {/* Match Overview Stats */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left">
          {/* Player 1 Stats */}
          <div className={`p-3 rounded-xl border ${isP1Winner ? 'bg-blue-950/40 border-blue-500/60' : 'bg-slate-900/60 border-slate-800'}`}>
            <h4 className="font-extrabold text-xs text-blue-400 uppercase tracking-wider mb-2">
              {p1Stats.name} {isP1Winner && '🏆'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex justify-between">
                <span className="text-slate-400">Correct:</span>
                <strong className="text-white">{p1Stats.score}</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Accuracy:</span>
                <strong className="text-emerald-400">{calcAccuracy(p1Stats)}%</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Avg Speed:</span>
                <strong className="text-amber-300">{calcAvgSpeed(p1Stats)}s</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Max Streak:</span>
                <strong className="text-purple-400">{p1Stats.highestStreak}🔥</strong>
              </li>
            </ul>
          </div>

          {/* Player 2 Stats */}
          <div className={`p-3 rounded-xl border ${!isP1Winner ? 'bg-red-950/40 border-red-500/60' : 'bg-slate-900/60 border-slate-800'}`}>
            <h4 className="font-extrabold text-xs text-red-400 uppercase tracking-wider mb-2">
              {p2Stats.name} {!isP1Winner && '🏆'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex justify-between">
                <span className="text-slate-400">Correct:</span>
                <strong className="text-white">{p2Stats.score}</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Accuracy:</span>
                <strong className="text-emerald-400">{calcAccuracy(p2Stats)}%</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Avg Speed:</span>
                <strong className="text-amber-300">{calcAvgSpeed(p2Stats)}s</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Max Streak:</span>
                <strong className="text-purple-400">{p2Stats.highestStreak}🔥</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRematch}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Rematch Match
          </button>

          <button
            onClick={onHome}
            className="w-full sm:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-extrabold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
