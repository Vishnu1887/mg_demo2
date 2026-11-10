"use client";

import React from "react";
import { Cpu, GraduationCap, Briefcase, Layers, Sparkles } from "lucide-react";
import { Division } from "@/lib/db/types";
import { cn } from "@/lib/utils";

export type ActiveTab = "all" | Division;

interface TabViewProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  counts?: {
    all?: number;
    orgintech?: number;
    edtech?: number;
    bbs?: number;
  };
  showAllOption?: boolean;
}

export function TabView({
  activeTab,
  onTabChange,
  counts,
  showAllOption = true,
}: TabViewProps) {
  const tabs = [
    ...(showAllOption
      ? [
          {
            id: "all" as ActiveTab,
            label: "All Divisions",
            subLabel: "Unified Conglomerate",
            icon: Layers,
            color: "text-blue-400",
            activeCard: "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 border-blue-400/50",
            borderHover: "hover:border-blue-500/40 hover:bg-blue-950/20",
            glowRing: "ring-2 ring-blue-500/30",
            accentDot: "bg-blue-300",
            badge: "All Offerings",
          },
        ]
      : []),
    {
      id: "orgintech" as ActiveTab,
      label: "OrginTech",
      subLabel: "Cloud & Autonomous AI",
      icon: Cpu,
      color: "text-indigo-400",
      activeCard: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 border-indigo-400/50",
      borderHover: "hover:border-indigo-500/40 hover:bg-indigo-950/20",
      glowRing: "ring-2 ring-indigo-500/30",
      accentDot: "bg-cyan-300",
      badge: "Tech Solutions",
    },
    {
      id: "edtech" as ActiveTab,
      label: "MGSolutions EdTech",
      subLabel: "Masterclasses & Bootcamps",
      icon: GraduationCap,
      color: "text-emerald-400",
      activeCard: "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30 border-emerald-400/50",
      borderHover: "hover:border-emerald-500/40 hover:bg-emerald-950/20",
      glowRing: "ring-2 ring-emerald-500/30",
      accentDot: "bg-emerald-300",
      badge: "Learning Hub",
    },
    {
      id: "bbs" as ActiveTab,
      label: "BBS (Business Services)",
      subLabel: "Advisory & M&A Due Diligence",
      icon: Briefcase,
      color: "text-amber-400",
      activeCard: "bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 border-amber-400/50",
      borderHover: "hover:border-amber-500/40 hover:bg-amber-950/20",
      glowRing: "ring-2 ring-amber-500/30",
      accentDot: "bg-amber-300",
      badge: "Corporate",
    },
  ];

  return (
    <div className="w-full relative">
      {/* Tab Switcher Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const count = counts ? counts[tab.id as keyof typeof counts] : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative group flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-300 border select-none overflow-hidden",
                isActive
                  ? cn(tab.activeCard, tab.glowRing, "scale-[1.02]")
                  : cn(
                      "bg-slate-950/60 border-slate-800/70 text-slate-400 hover:text-slate-200",
                      tab.borderHover
                    )
              )}
            >
              {/* Subtle Ambient Background Flare for Active Tab */}
              {isActive && (
                <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              )}

              {/* Top Row: Icon + Badge / Count */}
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    isActive
                      ? "bg-white/20 text-white shadow-inner"
                      : cn("bg-slate-900 border border-slate-800", tab.color, "group-hover:scale-110")
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  {typeof count === "number" && (
                    <span
                      className={cn(
                        "text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors",
                        isActive
                          ? "bg-black/20 text-white backdrop-blur-sm"
                          : "bg-slate-800/90 text-slate-300 border border-slate-700/60"
                      )}
                    >
                      {count} items
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Division Info */}
              <div className="space-y-0.5 z-10 w-full">
                <div className="flex items-center justify-between">
                  <span className={cn("text-base font-bold tracking-tight block", isActive ? "text-white" : "text-slate-200")}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className={cn("h-2 w-2 rounded-full animate-ping shrink-0", tab.accentDot)} />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium block truncate leading-tight",
                    isActive ? "text-white/85" : "text-slate-400 group-hover:text-slate-300"
                  )}
                >
                  {tab.subLabel}
                </span>
              </div>

              {/* Bottom Glowing Accent Line */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 transition-all duration-300",
                  isActive ? "bg-white/40" : "bg-transparent group-hover:bg-slate-700/30"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
