"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Briefcase, 
  Cpu, 
  GraduationCap, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  // Listen to portal route changes triggered by in-page 3D tab transitions
  useEffect(() => {
    const handleRouteChange = (e: any) => {
      if (e.detail?.path) {
        setCurrentPath(e.detail.path);
      }
    };
    window.addEventListener("portal-route-changed", handleRouteChange);
    return () => window.removeEventListener("portal-route-changed", handleRouteChange);
  }, []);

  // Three primary division tabs (Cover Showcase)
  const navLinks = [
    { 
      label: "OrginTech", 
      href: "/orgintech", 
      icon: Cpu, 
      accentGlow: "hover:text-cyan-300 hover:shadow-cyan-500/10",
      activeBg: "active-tab-glow-cyan text-cyan-200 shadow-cyan-500/20 shadow-md",
      indicatorColor: "bg-cyan-400",
      tag: "Cloud & AI"
    },
    { 
      label: "MGSolutions EdTech", 
      href: "/edtech", 
      icon: GraduationCap, 
      accentGlow: "hover:text-emerald-300 hover:shadow-emerald-500/10",
      activeBg: "active-tab-glow-emerald text-emerald-200 shadow-emerald-500/20 shadow-md",
      indicatorColor: "bg-emerald-400",
      tag: "STEM Academy"
    },
    { 
      label: "BBS (Business Services)", 
      href: "/bbs", 
      icon: Briefcase, 
      accentGlow: "hover:text-purple-300 hover:shadow-purple-500/10",
      activeBg: "active-tab-glow-violet text-purple-200 shadow-purple-500/20 shadow-md",
      indicatorColor: "bg-purple-400",
      tag: "Telephony & Promos"
    },
  ];

  const handleTabClick = (e: React.MouseEvent, href: string) => {
    setCurrentPath(href);
    window.dispatchEvent(new CustomEvent("switch-portal-tab", { detail: { tab: href } }));
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mobileMenuOpen) setMobileMenuOpen(false);
    const target = document.getElementById("headquarters") || document.querySelector("footer");
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#060912]/92 backdrop-blur-2xl shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Official 3D Metallic MG Logo & Brand */}
          <div className="flex items-center gap-3">
            <a
              href="/orgintech"
              onClick={(e) => handleTabClick(e, "/orgintech")}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 p-1.5 border border-slate-700/80 shadow-lg shadow-cyan-950/50 group-hover:border-cyan-500/60 transition-all duration-300">
                <img
                  src="/logo.png"
                  alt="MGSolutions Emblem"
                  className="h-full w-auto object-contain drop-shadow-[0_4px_12px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    MGSolutions
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Cover
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider">
                  GLOBAL ENTERPRISE CONGLOMERATE
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Division Tabs (OrginTech | EdTech | BBS) */}
          <nav className="hidden lg:flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner">
            {navLinks.map((tab) => {
              const isActive = currentPath.startsWith(tab.href);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={(e) => handleTabClick(e, tab.href)}
                  className={cn(
                    "relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 focus:outline-none cursor-pointer",
                    isActive
                      ? tab.activeBg
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "opacity-100" : "opacity-70")} />
                  <span className="font-mono">{tab.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Cover Website Action & Hologram Status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[11px] text-cyan-300 tracking-wider">HOLO-SYSTEM ONLINE</span>
            </div>

            <a
              href="#headquarters"
              onClick={scrollToContact}
              className="relative group px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-cyan-200 border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 hover:from-cyan-900/80 hover:to-blue-900/80 transition-all shadow-lg shadow-cyan-950/50 flex items-center gap-2 overflow-hidden"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Contact Enterprise</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#060912]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((tab) => {
              const isActive = currentPath.startsWith(tab.href);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={(e) => handleTabClick(e, tab.href)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-3 text-sm font-semibold rounded-xl transition-colors text-left cursor-pointer",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 opacity-80" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.tag && (
                    <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                      {tab.tag}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <a
              href="#headquarters"
              onClick={scrollToContact}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>Contact Enterprise</span>
            </a>
            <p className="text-[10px] text-center text-slate-500 pt-1">
              Official MGSolutions Cover Website • Holographic Hub
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
