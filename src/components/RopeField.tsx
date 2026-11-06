import React from 'react';
import { motion } from 'motion/react';
import { ToyAvatar } from '../types/game';
import { Flame, Flag, ShieldAlert } from 'lucide-react';

interface RopeFieldProps {
  ropePosition: number; // -100 (P1 Win) to +100 (P2 Win)
  winningThreshold: number; // e.g. 100
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
  // Convert position to percentage shift (-50% to +50%)
  const maxShiftPercent = 40; // Max visual percentage displacement on screen
  const shiftPercent = (ropePosition / winningThreshold) * maxShiftPercent;

  const isP1InDanger = ropePosition > winningThreshold * 0.65;
  const isP2InDanger = ropePosition < -winningThreshold * 0.65;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 space-y-4 relative overflow-hidden select-none shadow-2xl">
      {/* Grass/Stadium Backdrop Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-emerald-950/30 to-slate-950/80 pointer-events-none" />

      {/* Top Arena Banner & Danger Warnings */}
      <div className="relative z-10 flex items-center justify-between text-xs font-bold text-slate-300 px-2">
        {/* P1 Side Label */}
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

        {/* Center Field Status */}
        <div className="flex flex-col items-center">
          <div className="px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-red-400 font-black text-[11px] flex items-center gap-1 shadow-sm">
            <Flag className="w-3.5 h-3.5 fill-red-500" /> CENTER RED LINE
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Pull rope past threshold to win
          </p>
        </div>

        {/* P2 Side Label */}
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

      {/* Visual Rope Arena Track */}
      <div className="relative h-44 md:h-52 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Grass Texture & Grid Lines */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* LEFT DANGER ZONE (P1 Losing) */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[20%] border-r-2 border-dashed border-blue-500/30 transition-all ${
            isP2InDanger ? 'bg-red-500/20 animate-pulse' : 'bg-blue-500/5'
          }`}
        >
          <div className="absolute bottom-2 left-2 text-[10px] font-bold text-blue-400/60 uppercase">
            P1 Win Zone
          </div>
        </div>

        {/* RIGHT DANGER ZONE (P2 Losing) */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-[20%] border-l-2 border-dashed border-red-500/30 transition-all ${
            isP1InDanger ? 'bg-blue-500/20 animate-pulse' : 'bg-red-500/5'
          }`}
        >
          <div className="absolute bottom-2 right-2 text-[10px] font-bold text-red-400/60 uppercase">
            P2 Win Zone
          </div>
        </div>

        {/* THE CRITICAL CENTER RED MARKER LINE */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-red-500 via-red-600 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-20 flex flex-col items-center justify-between py-1">
          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-black text-white">
            ▲
          </div>
          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-black text-white">
            ▼
          </div>
        </div>

        {/* DYNAMIC ROPE & TOYS LAYER */}
        <motion.div
          className="absolute inset-x-0 flex items-center justify-center z-10"
          animate={{ x: `${shiftPercent}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        >
          {/* PLAYER 1 TOY (LEFT) */}
          <motion.div
            className="flex items-center gap-1 shrink-0 relative"
            animate={
              winner === 'P1'
                ? { y: [0, -15, 0], scale: [1, 1.15, 1] }
                : winner === 'P2'
                ? { rotate: 80, y: 20 }
                : lastPuller === 'P1'
                ? { x: [-10, 0], scale: [1.1, 1] }
                : {}
            }
            transition={{ duration: 0.35 }}
          >
            {/* P1 Fire Halo when streak active */}
            {p1Streak >= 3 && (
              <div className="absolute -inset-3 bg-amber-500/30 rounded-full blur-md animate-pulse" />
            )}

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-600/30 border-2 border-blue-400/80 flex items-center justify-center text-4xl md:text-5xl shadow-xl shadow-blue-500/20 backdrop-blur-sm relative z-10">
                {p1Avatar.emoji}
              </div>
              <span className="text-[11px] font-black text-blue-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-blue-500/40 mt-1 shadow-sm">
                {p1Avatar.name}
              </span>
            </div>
          </motion.div>

          {/* LEFT ROPE SEGMENT */}
          <div className="h-4 md:h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 border-y-2 border-amber-900 w-32 md:w-48 shadow-lg relative flex items-center justify-center">
            <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,#000_0,#000_4px,transparent_0,transparent_8px)]" />
          </div>

          {/* CENTER RED RIBBON MARKER ON ROPE */}
          <div className="relative z-30 shrink-0">
            <div className="w-6 h-10 md:w-8 md:h-12 bg-red-600 border-2 border-white rounded-md shadow-xl flex items-center justify-center text-white text-xs font-black animate-bounce">
              🎀
            </div>
          </div>

          {/* RIGHT ROPE SEGMENT */}
          <div className="h-4 md:h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 border-y-2 border-amber-900 w-32 md:w-48 shadow-lg relative flex items-center justify-center">
            <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(-45deg,#000_0,#000_4px,transparent_0,transparent_8px)]" />
          </div>

          {/* PLAYER 2 / AI TOY (RIGHT) */}
          <motion.div
            className="flex items-center gap-1 shrink-0 relative"
            animate={
              winner === 'P2'
                ? { y: [0, -15, 0], scale: [1, 1.15, 1] }
                : winner === 'P1'
                ? { rotate: -80, y: 20 }
                : lastPuller === 'P2'
                ? { x: [10, 0], scale: [1.1, 1] }
                : {}
            }
            transition={{ duration: 0.35 }}
          >
            {/* P2 Fire Halo when streak active */}
            {p2Streak >= 3 && (
              <div className="absolute -inset-3 bg-amber-500/30 rounded-full blur-md animate-pulse" />
            )}

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-red-600/30 border-2 border-red-400/80 flex items-center justify-center text-4xl md:text-5xl shadow-xl shadow-red-500/20 backdrop-blur-sm relative z-10">
                {p2Avatar.emoji}
              </div>
              <span className="text-[11px] font-black text-red-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-red-500/40 mt-1 shadow-sm">
                {p2Avatar.name}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ROPE DISTANCE GAUGE METER */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center justify-between text-[11px] font-extrabold">
          <span className="text-blue-400 flex items-center gap-1">
            ◀ P1 Advantage ({Math.max(0, Math.round(-ropePosition))})
          </span>
          <span className="text-red-500 font-black">
            CENTER RED LINE (0)
          </span>
          <span className="text-red-400 flex items-center gap-1">
            P2 Advantage ({Math.max(0, Math.round(ropePosition))}) ▶
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 p-0.5 relative overflow-hidden flex items-center">
          {/* Middle Red Line Marker */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-red-500 z-20 shadow-sm" />

          {/* Left P1 Fill */}
          {ropePosition < 0 && (
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ml-auto"
              style={{
                width: `${Math.min(50, (Math.abs(ropePosition) / winningThreshold) * 50)}%`,
                marginRight: '50%',
              }}
            />
          )}

          {/* Right P2 Fill */}
          {ropePosition > 0 && (
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(50, (ropePosition / winningThreshold) * 50)}%`,
                marginLeft: '50%',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
