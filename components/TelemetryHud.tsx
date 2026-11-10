"use client";

import React from "react";

interface TelemetryHudProps {
  isVisible: boolean;
  dimensionName: string;
}

export function TelemetryHud({ isVisible, dimensionName }: TelemetryHudProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden flex items-center justify-center animate-in fade-in duration-150">
      
      {/* 1. Holographic Laser Scanning Grid Overlay */}
      <div className="holo-grid-overlay" />
      <div className="holo-scanner-line" />

      {/* 2. MG SOLUTIONS Central Holographic ARC Reactor HUD Display */}
      <div className="relative flex items-center justify-center w-[360px] h-[360px] sm:w-[480px] sm:h-[480px]">
        
        {/* Shockwave expanding ring */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/80 jarvis-arc-shockwave" />

        {/* Outer Rotating Degree Ticks Ring */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 w-full h-full jarvis-spin-cw text-cyan-400/70 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        >
          {/* Circular Track */}
          <circle cx="200" cy="200" r="185" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" />
          <circle cx="200" cy="200" r="172" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="16 12" />
          
          {/* Degree Ticks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <line
              key={i}
              x1="200"
              y1="16"
              x2="200"
              y2="30"
              stroke="currentColor"
              strokeWidth="2.5"
              transform={`rotate(${deg} 200 200)`}
            />
          ))}

          {/* Triangles Reticles */}
          <polygon points="200,6 208,22 192,22" fill="#22d3ee" />
          <polygon points="200,394 208,378 192,378" fill="#22d3ee" />
          <polygon points="6,200 22,208 22,192" fill="#22d3ee" />
          <polygon points="394,200 378,208 378,192" fill="#22d3ee" />
        </svg>

        {/* Middle Counter-Clockwise Segmented Arc Ring */}
        <svg
          viewBox="0 0 300 300"
          className="absolute inset-10 w-[80%] h-[80%] m-auto jarvis-spin-ccw text-blue-400/80 drop-shadow-[0_0_15px_rgba(59,130,246,0.9)]"
        >
          <circle cx="150" cy="150" r="128" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="60 40 100 30" />
          <circle cx="150" cy="150" r="112" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <path d="M 150 18 A 132 132 0 0 1 282 150" fill="none" stroke="#38bdf8" strokeWidth="4" />
          <path d="M 150 282 A 132 132 0 0 1 18 150" fill="none" stroke="#a855f7" strokeWidth="4" />
        </svg>

        {/* Inner Fast-Spinning Hex Matrix */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-20 w-[60%] h-[60%] m-auto jarvis-spin-cw-fast text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,1)]"
        >
          <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <polygon points="100,35 155,67 155,133 100,165 45,133 45,67" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="8 6" />
        </svg>

        {/* Central ARC Reactor Glowing Energy Core */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 rounded-full bg-slate-950/90 border-2 border-cyan-400 jarvis-core-pulse backdrop-blur-2xl text-center w-36 h-36 sm:w-44 sm:h-44 shadow-[0_0_50px_rgba(6,182,212,0.95)]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-cyan-300 flex items-center justify-center mb-1 text-cyan-300 animate-spin">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-black text-cyan-300 uppercase tracking-widest">
            MG SOLUTIONS
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono text-white font-bold leading-tight mt-0.5 truncate max-w-[120px]">
            {dimensionName}
          </span>
          <span className="text-[8px] font-mono text-emerald-400 font-semibold mt-1">
            LOCK // 100%
          </span>
        </div>

      </div>

      {/* 3. MG SOLUTIONS Audio Spectrum Equalizer Wings */}
      <div className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 flex items-center space-x-6">
        {/* Left Equalizer */}
        <div className="flex items-end space-x-1 h-8">
          {[24, 12, 32, 16, 28, 8, 20].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-cyan-400 rounded-full animate-pulse"
              style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Status Callout Banner */}
        <div className="px-5 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.6)] backdrop-blur-xl font-mono text-center">
          <div className="text-[11px] font-black text-cyan-300 tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>RECONFIGURING 3D SPATIAL MATRIX</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">
            DIMENSION: <strong className="text-white">{dimensionName}</strong> • QUANTUM SLA: 99.999%
          </div>
        </div>

        {/* Right Equalizer */}
        <div className="flex items-end space-x-1 h-8">
          {[20, 8, 28, 16, 32, 12, 24].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-cyan-400 rounded-full animate-pulse"
              style={{ height: `${h}px`, animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      </div>

      {/* 4. MG SOLUTIONS Corner Telemetry Flight Brackets */}
      <div className="absolute inset-4 sm:inset-8 flex flex-col justify-between pointer-events-none">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 font-mono text-[10px] text-cyan-300 bg-black/85 px-3 py-1.5 rounded-lg border border-cyan-500/50 backdrop-blur-md">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            <span>// MG SOLUTIONS • 3D HUD v5.2</span>
          </div>
          <div className="font-mono text-[10px] text-purple-300 bg-black/85 px-3 py-1.5 rounded-lg border border-purple-500/50 backdrop-blur-md">
            <span>ARC-CORE: ENGAGED • 16K HOLO</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="font-mono text-[10px] text-emerald-300 bg-black/85 px-3 py-1.5 rounded-lg border border-emerald-500/50 backdrop-blur-md">
            <span>NEURAL LINK: SYNCHRONIZED</span>
          </div>
          <div className="font-mono text-[10px] text-cyan-300 bg-black/85 px-3 py-1.5 rounded-lg border border-cyan-500/50 backdrop-blur-md">
            <span>TARGET: {dimensionName.toUpperCase()}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
