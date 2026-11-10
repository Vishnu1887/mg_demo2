"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Cpu, GraduationCap, Briefcase, Sparkles, CheckCircle2 } from "lucide-react";
import { useScroll3D } from "@/lib/useScroll3D";
import { TelemetryHud } from "@/components/TelemetryHud";
import { EventCard } from "@/components/EventCard";
import { ContentCard } from "@/components/ContentCard";
import { dataStore } from "@/lib/db/store";
import { ContentItem, Event as EventModel } from "@/lib/db/types";

interface DivisionPortalContainerProps {
  initialTab?: 0 | 1 | 2;
}

export function DivisionPortalContainer({ initialTab = 0 }: DivisionPortalContainerProps) {
  const [activeTab, setActiveTab] = useState<number>(initialTab);
  const [prevTab, setPrevTab] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [lastTransition, setLastTransition] = useState<string>("init");

  // Data lists
  const [events, setEvents] = useState<EventModel[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  // 3D continuous scroll physics engine
  useScroll3D(activeTab);

  const loadData = () => {
    setEvents(dataStore.getEvents());
    setContentItems(dataStore.getContentItems());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage-update", loadData);
    return () => window.removeEventListener("storage-update", loadData);
  }, []);

  const getPortalName = (idx: number) => {
    if (idx === 0) return "ORGIN TECH";
    if (idx === 1) return "MGSOLUTIONS EDUTECH";
    return "BBS CALL & PROMOS";
  };

  const [transitionDir, setTransitionDir] = useState<"next" | "prev">("next");

  const getPortalSlug = (idx: number) => {
    if (idx === 0) return "/orgintech";
    if (idx === 1) return "/edtech";
    return "/bbs";
  };

  const playJarvisAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // 1. Digital JARVIS HUD target lock chirp
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.12);
      osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.28);
      gain1.gain.setValueAtTime(0.04, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.3);

      // 2. ARC Reactor capacitor power surge hum
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(140, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.35);
      osc2.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.65);
      gain2.gain.setValueAtTime(0.05, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.7);
    } catch {}
  };

  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const goToTab = (tabIndex: number) => {
    if (activeTab === tabIndex) return;

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    // Determine direction for 3D spatial slide change across all tabs
    const dir = (activeTab === 2 && tabIndex === 0) 
      ? "next" 
      : (activeTab === 0 && tabIndex === 2) 
      ? "prev" 
      : tabIndex > activeTab 
      ? "next" 
      : "prev";

    setTransitionDir(dir);
    playJarvisAudio();
    setPrevTab(activeTab);
    setActiveTab(tabIndex);
    setIsTransitioning(true);

    // Update browser URL without reloading
    const newSlug = getPortalSlug(tabIndex);
    if (typeof window !== "undefined") {
      if (window.location.pathname !== newSlug) {
        window.history.pushState(null, "", newSlug);
      }
      window.dispatchEvent(new CustomEvent("portal-route-changed", { detail: { path: newSlug } }));
      window.dispatchEvent(new CustomEvent("quantum-warp-engage", { detail: { tab: tabIndex } }));
    }

    // Scroll smoothly to top of stage
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Transition completes cleanly after 600ms
    transitionTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setPrevTab(null);
    }, 600);
  };

  // Keep a stable ref to goToTab so event listeners never get stale
  const goToTabRef = useRef(goToTab);
  goToTabRef.current = goToTab;

  // Sync with initialTab prop when route navigates
  useEffect(() => {
    if (typeof initialTab === "number" && activeTab !== initialTab) {
      goToTabRef.current(initialTab);
    }
  }, [initialTab]);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p.includes("edtech")) goToTabRef.current(1);
      else if (p.includes("bbs")) goToTabRef.current(2);
      else goToTabRef.current(0);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Listen to Navbar tab click events
  useEffect(() => {
    const handleSwitchEvent = (e: any) => {
      const targetSlug = e.detail?.tab;
      if (targetSlug === "/orgintech" || targetSlug === "orgintech") {
        goToTabRef.current(0);
      } else if (targetSlug === "/edtech" || targetSlug === "edtech") {
        goToTabRef.current(1);
      } else if (targetSlug === "/bbs" || targetSlug === "bbs") {
        goToTabRef.current(2);
      }
    };

    window.addEventListener("switch-portal-tab", handleSwitchEvent);
    return () => window.removeEventListener("switch-portal-tab", handleSwitchEvent);
  }, []);

  const getTabContainerClass = (tabIndex: number) => {
    if (activeTab === tabIndex) {
      if (isTransitioning) {
        return transitionDir === "next"
          ? "portal-pane jarvis-3d-enter-next holo-chromatic-shimmer"
          : "portal-pane jarvis-3d-enter-prev holo-chromatic-shimmer";
      }
      return "portal-pane state-center";
    }

    if (prevTab === tabIndex && isTransitioning) {
      return transitionDir === "next"
        ? "portal-pane jarvis-3d-exit-next"
        : "portal-pane jarvis-3d-exit-prev";
    }

    return "deck-hidden";
  };

  const orginContent = contentItems.filter((c) => c.divisionId === "orgintech");
  const edtechContent = contentItems.filter((c) => c.divisionId === "edtech");
  const bbsContent = contentItems.filter((c) => c.divisionId === "bbs");

  const orginEvents = events.filter((e) => e.divisionId === "orgintech");
  const edtechEvents = events.filter((e) => e.divisionId === "edtech");
  const bbsEvents = events.filter((e) => e.divisionId === "bbs");

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden">
      {/* Dynamic Atmospheric Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[170px] opacity-25 transition-all duration-1000 ${
            activeTab === 0
              ? "bg-cyan-500"
              : activeTab === 1
              ? "bg-emerald-500"
              : "bg-purple-600"
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full blur-[180px] opacity-20 transition-all duration-1000 ${
            activeTab === 0
              ? "bg-blue-600"
              : activeTab === 1
              ? "bg-amber-500"
              : "bg-pink-600"
          }`}
        />
      </div>


      {/* AI Quantum Portal Telemetry HUD (Pops up during 3D Warp) */}
      <TelemetryHud
        isVisible={isTransitioning}
        dimensionName={getPortalName(activeTab)}
      />

      {/* Division Switcher Bar */}
      <div className="sticky top-20 z-40 max-w-7xl mx-auto px-4 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl glass-hud border border-slate-800/90 shadow-2xl backdrop-blur-2xl">
          {/* Division Selector Tabs */}
          <nav className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto p-1">
            {/* Tab 0: Orgin Tech */}
            <button
              onClick={() => goToTab(0)}
              className={`relative px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 0
                  ? "active-tab-glow-cyan text-cyan-200"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  activeTab === 0 ? "bg-cyan-400 animate-ping" : "bg-slate-600"
                }`}
              />
              <span className="font-mono">Orgin Tech</span>
            </button>

            {/* Tab 1: MGSolutions EdTech */}
            <button
              onClick={() => goToTab(1)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 1
                  ? "active-tab-glow-emerald text-emerald-200"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span className="text-sm">🎓</span>
              <span className="font-mono">MGSolutions EdTech</span>
            </button>

            {/* Tab 2: BBS (Business Support / Telephony & Promos) */}
            <button
              onClick={() => goToTab(2)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 shrink-0 cursor-pointer ${
                activeTab === 2
                  ? "active-tab-glow-violet text-purple-200"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <span className="text-sm">🎧</span>
              <span className="font-mono">BBS Call & Promos</span>
            </button>
          </nav>

          {/* Quick Division Status - Visible on both Mobile & Desktop */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-slate-400 pr-1 sm:pr-2">
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="text-white font-bold truncate max-w-[120px] sm:max-w-none">{getPortalName(activeTab)}</span>
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-cyan-900/40 shrink-0">
              ⚡ MG SOLUTIONS 3D
            </span>
          </div>
        </div>
      </div>

      {/* Main 3D Viewport Stage */}
      <div className="relative z-20 min-h-screen viewport-3d pb-24">
        <div className="stage-3d">

          {/* ========================================================================= */}
          {/* TAB 0: ORGIN TECH (CYBERNETIC 3D SERVER GRID & SCROLL FX)                 */}
          {/* ========================================================================= */}
          <div className={getTabContainerClass(0)}>
            {/* Holographic Laser Scanline Sweep on Tab Entrance */}
            {isTransitioning && activeTab === 0 && <div className="holo-scanner-line" />}

            {/* Hero Banner: 3D Server Grid with Isometric Robotic Arms */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-16">
              <div className="rounded-3xl glass-hud border border-cyan-400/40 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3.5 py-1 text-xs font-mono font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center space-x-2 w-max">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>MGSolutions • Orgin Tech Grid</span>
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                      Cybernetic 3D Infrastructure &{" "}
                      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                        Server Mesh
                      </span>
                    </h1>
                    <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-xl">
                      High-performance microkernel deployment with active holographic telemetry, distributed edge caching, and automated quantum-resistant packet validation.
                    </p>
                    <div className="pt-3 flex flex-wrap gap-4">
                      <a
                        href="#orgin-quantum"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 transition transform hover:-translate-y-0.5"
                      >
                        Explore 3D Scroll Architecture ↓
                      </a>
                      <button className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-mono text-xs">
                        506 streams/s • 98.4% Health
                      </button>
                    </div>
                  </div>

                  {/* 3D Holographic Server Isometric Model with Robotic Arms */}
                  <div className="lg:col-span-5 flex items-center justify-center relative min-h-[260px]">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 240">
                      <path d="M 40 190 L 110 150 L 190 150 L 260 190" stroke="#06b6d4" strokeWidth="2" className="neon-track" fill="none" />
                      <path d="M 20 150 L 90 150 L 140 100 L 230 100" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
                      <circle cx="110" cy="150" r="4" fill="#06b6d4" />
                      <circle cx="190" cy="150" r="4" fill="#06b6d4" />
                    </svg>

                    <div className="relative w-32 h-48 bg-gradient-to-b from-slate-900 via-slate-950 to-cyan-950/90 border-2 border-cyan-400/80 rounded-2xl shadow-2xl shadow-cyan-500/50 flex flex-col justify-between p-3 z-10 animate-float-3d">
                      <div className="space-y-2">
                        <div className="h-5 bg-slate-800/90 rounded border border-cyan-500/40 flex items-center justify-between px-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          <span className="text-[9px] font-mono text-cyan-300">CORE-A1</span>
                        </div>
                        <div className="h-5 bg-slate-800/90 rounded border border-cyan-500/40 flex items-center justify-between px-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <span className="text-[9px] font-mono text-cyan-300">98.4%</span>
                        </div>
                        <div className="h-5 bg-slate-800/90 rounded border border-cyan-500/40 flex items-center justify-between px-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[9px] font-mono text-cyan-300">506/s</span>
                        </div>
                      </div>
                      <div className="h-2 rounded bg-cyan-400 blur-[2px] opacity-90" />
                    </div>

                    <div className="absolute left-6 bottom-8 w-20 h-28 pointer-events-none">
                      <svg viewBox="0 0 70 100" className="w-full h-full text-cyan-400" fill="none" stroke="currentColor">
                        <path d="M 10 90 L 25 60 L 45 45 L 60 50" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="25" cy="60" r="5" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                        <circle cx="45" cy="45" r="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                        <path d="M 58 45 L 68 45 M 58 55 L 68 55" strokeWidth="2.5" />
                      </svg>
                    </div>
                    <div className="absolute right-6 bottom-10 w-20 h-28 pointer-events-none">
                      <svg viewBox="0 0 70 100" className="w-full h-full text-blue-400" fill="none" stroke="currentColor">
                        <path d="M 60 90 L 45 60 L 25 45 L 10 50" strokeWidth="4" strokeLinecap="round" />
                        <circle cx="45" cy="60" r="5" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="25" cy="45" r="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                        <path d="M 12 45 L 2 45 M 12 55 L 2 55" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3D SCROLL FX: Matrix Voxel Flip */}
            <section id="orgin-quantum" className="max-w-7xl mx-auto px-4 lg:px-8 py-14 scroll-3d-wrapper">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <span className="px-3 py-1 text-xs font-mono font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  ⚡ 3D SCROLL ANIMATION: MATRIX VOXEL FLIP
                </span>
                <h2 className="text-3xl lg:text-5xl font-black text-white">Quantum Pipeline & Edge Mesh</h2>
                <p className="text-xs text-slate-400">Cards tilt and flip on the 3D X-axis continuously as you scroll past.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="scroll-3d-card p-8 rounded-3xl glass-hud border border-cyan-500/30" data-fx="matrix-flip">
                  <div className="text-cyan-400 font-mono text-4xl font-black mb-3">0.2ms</div>
                  <h3 className="font-extrabold text-xl text-white mb-2">Sub-Millisecond Edge</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Real-time edge proxy nodes with automated failover and zero packet loss validation.</p>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: "96%" }} />
                  </div>
                </div>

                <div className="scroll-3d-card p-8 rounded-3xl glass-hud border border-blue-500/30" data-fx="matrix-flip">
                  <div className="text-blue-400 font-mono text-4xl font-black mb-3">99.999%</div>
                  <h3 className="font-extrabold text-xl text-white mb-2">High Availability SLA</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Multi-region active-active database replication and auto-scaling pods.</p>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: "99.9%" }} />
                  </div>
                </div>

                <div className="scroll-3d-card p-8 rounded-3xl glass-hud border border-teal-500/30" data-fx="matrix-flip">
                  <div className="text-teal-400 font-mono text-4xl font-black mb-3">256-Bit</div>
                  <h3 className="font-extrabold text-xl text-white mb-2">Post-Quantum Cryptography</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Lattice-based encryption protecting corporate clusters and client pipelines.</p>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </section>

            {/* Real OrginTech Production Offerings & Events */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">OrginTech Production Services & Blueprints</h3>
                    <p className="text-xs text-slate-400">Enterprise architectures deployed across Tier-1 institutions.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orginContent.map((item) => (
                    <ContentCard key={item.id} item={item} showDivisionBadge={false} />
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">Upcoming OrginTech Hackathons & Webinars</h3>
                    <p className="text-xs text-slate-400">RSVP for upcoming AI agent build sprints and security deep-dives.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orginEvents.map((event) => (
                    <EventCard key={event.id} event={event} onRegisteredChange={loadData} showDivisionBadge={false} />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: MGSOLUTIONS EDTECH (VIRTUAL ACADEMY & 3D CYBER CONVERGENCE)       */}
          {/* ========================================================================= */}
          <div className={getTabContainerClass(1)}>
            {/* Holographic Laser Scanline Sweep on Tab Entrance */}
            {isTransitioning && activeTab === 1 && (
              <div
                className="holo-scanner-line"
                style={{
                  background: "linear-gradient(90deg, transparent, #34d399, #10b981, #f59e0b, transparent)",
                  boxShadow: "0 0 20px #10b981",
                }}
              />
            )}

            {/* Hero Banner: Smart Blackboard with Orbiting 3D Atom & Live Spectrum */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-16">
              <div className="rounded-3xl chalkboard-bg border-2 border-emerald-400/50 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3.5 py-1 text-xs font-mono font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-2 w-max">
                      <span>🎓</span>
                      <span>MGSolutions • Edutech Academy</span>
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                      Next-Gen Virtual Academy &{" "}
                      <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                        STEM Classroom
                      </span>
                    </h1>
                    <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-xl">
                      Immersive smart blackboard lecture halls, orbiting atomic science simulations, adaptive real-time calculus quizzes, and verified international degree credentials.
                    </p>
                    <div className="pt-3 flex flex-wrap gap-4">
                      <a
                        href="#edutech-catalog"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-slate-950 font-black shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5"
                      >
                        Explore 3D Origami Curriculum ↓
                      </a>
                      <button className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 font-mono text-xs">
                        1,420+ Labs • 42 Live Rooms
                      </button>
                    </div>
                  </div>

                  {/* Smart Blackboard with Orbiting Atom */}
                  <div className="lg:col-span-5 flex items-center justify-center relative min-h-[260px]">
                    <div className="relative w-full max-w-[340px] h-60 rounded-2xl bg-black/60 border-2 border-emerald-500/40 p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
                      <div className="absolute inset-0 pointer-events-none font-mono text-[11px] text-emerald-400/40 p-3 select-none leading-relaxed">
                        <div className="flex justify-between">
                          <span>E = mc²</span>
                          <span className="text-amber-400/40">a² + b² = c²</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <span className="text-teal-300/40">∫ e^x dx</span>
                          <span>∇ × B = μ₀J</span>
                        </div>
                      </div>

                      {/* 3D Orbiting Atom */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 shadow-[0_0_15px_rgba(245,158,11,0.9)] flex items-center justify-center text-[8px] font-bold text-slate-950">
                            ⚛
                          </div>
                          <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/60 animate-orbit-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399] absolute top-0 left-1/2 -translate-x-1/2" />
                          </div>
                          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/60 animate-orbit-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fbbf24] absolute bottom-0 left-1/2 -translate-x-1/2" />
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between bg-slate-900/90 rounded-xl px-3 py-1.5 border border-emerald-500/30">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold">PROF. ADAMS: LIVE</span>
                        <div className="flex items-end space-x-1 h-5">
                          <div className="w-1 bg-emerald-400 rounded-full eq-bar-1" />
                          <div className="w-1 bg-teal-400 rounded-full eq-bar-2" />
                          <div className="w-1 bg-amber-400 rounded-full eq-bar-3" />
                          <div className="w-1 bg-emerald-400 rounded-full eq-bar-4" />
                          <div className="w-1 bg-teal-400 rounded-full eq-bar-5" />
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-emerald-900/40">
                        <div className="flex items-center space-x-2 animate-float-3d">
                          <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-400/60 p-1 flex items-center justify-center">
                            🎓
                          </div>
                          <span className="text-xs font-bold text-white">Master Certification</span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">MIT Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3D SCROLL FX: Origami Book-Fold */}
            <section id="edutech-catalog" className="max-w-7xl mx-auto px-4 lg:px-8 py-14 scroll-3d-wrapper">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <span className="px-3 py-1 text-xs font-mono font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ⚡ 3D SCROLL ANIMATION: ORIGAMI BOOK-FOLD
                </span>
                <h2 className="text-3xl lg:text-5xl font-black text-white">Interactive STEM Course Curriculum</h2>
                <p className="text-xs text-slate-400">Cards fold and rotate on the 3D Y-axis like open book pages as you scroll.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="scroll-3d-card p-8 rounded-3xl chalkboard-bg border-2 border-emerald-500/40 shadow-2xl" data-fx="origami-fold">
                  <span className="text-4xl mb-3 block">🧠</span>
                  <h3 className="font-extrabold text-xl text-white mb-2">Deep Learning & AI Architectures</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Neural transformers, autonomous agent design, and reinforcement model tuning.</p>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "88%" }} />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">88% Average Mastery</span>
                </div>

                <div className="scroll-3d-card p-8 rounded-3xl chalkboard-bg border-2 border-amber-500/40 shadow-2xl" data-fx="origami-fold">
                  <span className="text-4xl mb-3 block">🔬</span>
                  <h3 className="font-extrabold text-xl text-white mb-2">Quantum Computing & Cryptography</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Qubit entanglement, quantum algorithms, and post-quantum security proofs.</p>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: "74%" }} />
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">74% Average Mastery</span>
                </div>

                <div className="scroll-3d-card p-8 rounded-3xl chalkboard-bg border-2 border-teal-500/40 shadow-2xl" data-fx="origami-fold">
                  <span className="text-4xl mb-3 block">⚡</span>
                  <h3 className="font-extrabold text-xl text-white mb-2">Applied Calculus & Robotics</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Multi-variable kinematics, sensor fusion, and spatial robotic control loops.</p>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: "95%" }} />
                  </div>
                  <span className="text-[10px] font-mono text-teal-300 font-bold">95% Average Mastery</span>
                </div>
              </div>
            </section>

            {/* Real EdTech Courses & Live Events */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">Featured Programs & Learning Modules</h3>
                    <p className="text-xs text-slate-400">Enroll directly in vetted engineering bootcamps and certification tracks.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {edtechContent.map((item) => (
                    <ContentCard key={item.id} item={item} showDivisionBadge={false} />
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">Upcoming Bootcamps & Interactive Webinars</h3>
                    <p className="text-xs text-slate-400">Limited-seat cohorts with active staff engineer mentorship.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {edtechEvents.map((event) => (
                    <EventCard key={event.id} event={event} onRegisteredChange={loadData} showDivisionBadge={false} />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* ========================================================================= */}
          {/* TAB 2: BBS (CLIENT TELEPHONY, PROMOTIONS & 3D CYLINDER CAROUSEL)          */}
          {/* ========================================================================= */}
          <div className={getTabContainerClass(2)}>
            {/* Holographic Laser Scanline Sweep on Tab Entrance */}
            {isTransitioning && activeTab === 2 && (
              <div
                className="holo-scanner-line"
                style={{
                  background: "linear-gradient(90deg, transparent, #c084fc, #ec4899, #f43f5e, transparent)",
                  boxShadow: "0 0 20px #c084fc",
                }}
              />
            )}

            {/* Hero Banner: Telephony Headset & VOIP Spectrum Console */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-16">
              <div className="rounded-3xl telephony-bg border-2 border-purple-400/50 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3.5 py-1 text-xs font-mono font-bold uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center space-x-2 w-max">
                      <span>🎧</span>
                      <span>MGSolutions • BBS Business Support</span>
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                      Client Telephony &{" "}
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                        Brand Promotions Hub
                      </span>
                    </h1>
                    <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-xl">
                      High-conversion tele-sales outreach, 24/7 client voice support, automated multi-channel promotional campaigns (SMS, WhatsApp, Direct Call), and VIP client account routing.
                    </p>
                    <div className="pt-3 flex flex-wrap gap-4">
                      <a
                        href="#bbs-promos"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-pink-500 text-white font-black shadow-lg shadow-purple-500/30 transition transform hover:-translate-y-0.5"
                      >
                        Explore 3D Cylindrical Campaigns ↓
                      </a>
                      <button className="px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-mono text-xs">
                        14,820 Calls Handled • 4.98/5 CSAT
                      </button>
                    </div>
                  </div>

                  {/* Right: Holographic Headset & Radar Broadcast */}
                  <div className="lg:col-span-5 flex items-center justify-center relative min-h-[260px]">
                    <div className="relative w-full max-w-[340px] h-60 rounded-2xl bg-black/60 border-2 border-purple-500/40 p-4 shadow-2xl flex flex-col justify-between overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-20 h-20 rounded-full border-2 border-purple-400/40 animate-radar-wave" />
                        <div className="w-36 h-36 rounded-full border-2 border-pink-400/30 animate-radar-wave" style={{ animationDelay: "-0.8s" }} />
                      </div>

                      <div className="relative z-10 flex items-center justify-between bg-purple-950/80 rounded-xl px-3 py-1.5 border border-purple-500/40">
                        <span className="text-[10px] font-mono text-purple-200 font-bold">📢 PROMO: #BBS-SCALE50</span>
                        <span className="px-2 py-0.5 rounded bg-pink-500 text-slate-950 font-black text-[9px]">40% OFF</span>
                      </div>

                      <div className="relative z-10 flex items-center justify-around my-1">
                        <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.7)] flex items-center justify-center text-3xl animate-float-3d">
                          🎧
                        </div>
                        <div className="space-y-1 bg-slate-950/80 p-2.5 rounded-xl border border-purple-500/30">
                          <div className="text-[9px] font-mono text-purple-300 font-bold flex justify-between">
                            <span>VOIP SPECTRUM</span>
                            <span className="text-emerald-400">LIVE</span>
                          </div>
                          <div className="flex items-end space-x-1 h-6">
                            <div className="w-1.5 bg-purple-400 rounded-full eq-bar-1" />
                            <div className="w-1.5 bg-pink-400 rounded-full eq-bar-2" />
                            <div className="w-1.5 bg-cyan-400 rounded-full eq-bar-3" />
                            <div className="w-1.5 bg-purple-400 rounded-full eq-bar-4" />
                            <div className="w-1.5 bg-pink-400 rounded-full eq-bar-5" />
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-purple-900/40 text-[10px] font-mono">
                        <span className="text-amber-300 font-bold">⭐⭐⭐⭐⭐ 4.98</span>
                        <span className="text-purple-300">Conversion: <strong className="text-pink-400">24.8% CTR</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3D SCROLL FX: Cylindrical Carousel */}
            <section id="bbs-promos" className="max-w-7xl mx-auto px-4 lg:px-8 py-14 scroll-3d-wrapper">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <span className="px-3 py-1 text-xs font-mono font-bold uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  ⚡ 3D SCROLL ANIMATION: CYLINDRICAL CAROUSEL
                </span>
                <h2 className="text-3xl lg:text-5xl font-black text-white">Omnichannel Promotions & Brand Outreach</h2>
                <p className="text-xs text-slate-400">Rotates dynamically on a 3D cylindrical curve as you scroll into the campaign cards.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="scroll-3d-card p-8 rounded-3xl telephony-bg border-2 border-purple-500/40 shadow-2xl" data-fx="cylinder-carousel">
                  <span className="text-4xl mb-3 block">🚀</span>
                  <h3 className="font-extrabold text-xl text-white mb-2">VIP Tele-Marketing Outbound</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Predictive dialer connecting high-intent enterprise leads to senior specialists in seconds.</p>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                    99.4% FCR Resolution
                  </span>
                </div>

                <div className="scroll-3d-card p-8 rounded-3xl telephony-bg border-2 border-pink-500/40 shadow-2xl" data-fx="cylinder-carousel">
                  <span className="text-4xl mb-3 block">📢</span>
                  <h3 className="font-extrabold text-xl text-white mb-2">Omnichannel SMS & WhatsApp Blast</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Personalized promotional coupon delivery reaching 500k+ enterprise clients with high conversion.</p>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold">
                    24.8% CTR Win Rate
                  </span>
                </div>

                <div className="scroll-3d-card p-8 rounded-3xl telephony-bg border-2 border-amber-500/40 shadow-2xl" data-fx="cylinder-carousel">
                  <span className="text-4xl mb-3 block">⭐</span>
                  <h3 className="font-extrabold text-xl text-white mb-2">24/7 Client Helpdesk Escalation</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">Zero-wait time customer support backed by real-time AI sentiment analysis and auto-routing.</p>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    4.98/5.0 CSAT Score
                  </span>
                </div>
              </div>
            </section>

            {/* Real BBS Advisory Services & Executive Events */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">BBS Corporate Advisory Services</h3>
                    <p className="text-xs text-slate-400">Strategic turnaround, restructuring, and M&A integration consulting.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bbsContent.map((item) => (
                    <ContentCard key={item.id} item={item} showDivisionBadge={false} />
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white">Executive Business Summits & Seminars</h3>
                    <p className="text-xs text-slate-400">Chaired by industry veterans, corporate board directors, and turnaround leads.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bbsEvents.map((event) => (
                    <EventCard key={event.id} event={event} onRegisteredChange={loadData} showDivisionBadge={false} />
                  ))}
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
