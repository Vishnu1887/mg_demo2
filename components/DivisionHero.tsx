import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  GraduationCap, 
  Briefcase 
} from "lucide-react";
import { DivisionMeta } from "@/lib/db/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

interface DivisionHeroProps {
  division: DivisionMeta;
  ctaText?: string;
  ctaLink?: string;
}

export function DivisionHero({ division, ctaText = "Explore Offerings", ctaLink = "#offerings" }: DivisionHeroProps) {
  const icons = {
    orgintech: Cpu,
    edtech: GraduationCap,
    bbs: Briefcase,
  };

  const Icon = icons[division.id] || Cpu;

  const bgAccents = {
    orgintech: "from-indigo-950/80 via-slate-900 to-slate-950 border-indigo-500/20 shadow-indigo-900/10",
    edtech: "from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/20 shadow-emerald-900/10",
    bbs: "from-amber-950/70 via-slate-900 to-slate-950 border-amber-500/20 shadow-amber-900/10",
  };

  const glowColors = {
    orgintech: "bg-indigo-500/10",
    edtech: "bg-emerald-500/10",
    bbs: "bg-amber-500/10",
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${bgAccents[division.id]} p-8 sm:p-12 mb-12 shadow-2xl`}>
      {/* Decorative Blur Orbs */}
      <div className={`absolute -top-24 -right-24 h-96 w-96 rounded-full blur-3xl pointer-events-none ${glowColors[division.id]}`} />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full blur-3xl pointer-events-none bg-blue-500/5" />

      <div className="relative z-10 max-w-4xl">
        {/* Top Division Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="division" division={division.id} className="text-xs px-3 py-1 font-semibold">
            <Icon className="h-3.5 w-3.5 mr-1" />
            {division.badge}
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Division Hub</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          {division.name}
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl font-medium text-slate-300 mb-4">
          {division.tagline}
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed mb-8">
          {division.description}
        </p>

        {/* Division Capabilities Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
          {division.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <a href={ctaLink}>
            <Button size="lg" variant="division" division={division.id} className="gap-2 text-sm font-semibold">
              <span>{ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="#events">
            <Button size="lg" variant="outline" className="gap-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>Upcoming Division Events</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Division KPI Stats Grid */}
      <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
        {division.stats.map((stat, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
