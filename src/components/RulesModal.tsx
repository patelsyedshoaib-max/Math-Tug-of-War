import React from 'react';
import { X, Trophy, Zap, AlertTriangle, Key, Touchpad, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-2xl">
            🪢
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">How to Play Math Tug-of-War</h2>
            <p className="text-xs text-slate-400">Rules & Strategy Guide</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Objective
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              Solve math problems faster and more accurately than your opponent to pull the center 
              <strong className="text-red-400"> Red Line Marker</strong> into your team's victory threshold!
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Game Rules & Mechanics
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Correct Answer:</strong> Pulls the rope towards your side.</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Speed Bonus:</strong> Answering within 2.5 seconds yields 2x extra rope pull power!</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span><strong>Wrong Answer:</strong> Triggers a 1-second penalty freeze and slips the rope slightly to your opponent!</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Speed Streaks:</strong> 3 correct answers in a row triggers Fire Power Mode for boosted pulling force.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              Controls & Input
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <p className="font-semibold text-blue-400 flex items-center gap-1 mb-1">
                  <Touchpad className="w-3.5 h-3.5" /> Touch / On-Screen
                </p>
                <p className="text-[11px] text-slate-400">
                  Tap numeric keypads for P1 & P2 directly on tablet or phone screens.
                </p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <p className="font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                  <Key className="w-3.5 h-3.5" /> Keyboard Shortcuts
                </p>
                <p className="text-[11px] text-slate-400">
                  P1 uses keyboard numbers or screen numpad. P2 / AI uses screen numpad.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/30"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
