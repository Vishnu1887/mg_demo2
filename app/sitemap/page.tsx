import React from "react";
import Link from "next/link";
import { 
  Cpu, 
  GraduationCap, 
  Briefcase, 
  Network, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  FileCode2,
  ExternalLink,
  ArrowLeft
} from "lucide-react";

export const metadata = {
  title: "Site Map & Ecosystem Directory | MGSolutions",
  description: "Complete architectural directory and public route tree of the MGSolutions Conglomerate.",
};

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/orgintech"
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to MGSolutions Portal</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>FULL SITE MAP INDEX</span>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
            <Network className="h-4 w-4" />
            <span>MGSolutions • Architectural Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Complete Ecosystem Site Map
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Direct index of all corporate divisions, cybernetic 3D infrastructure blueprints, virtual classrooms, and corporate support desks.
          </p>
        </div>

        {/* 3 Core Divisions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 01 // OrginTech */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/30 space-y-4 shadow-xl shadow-cyan-950/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                <span>01 // OrginTech</span>
              </span>
              <Link
                href="/orgintech"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
              >
                <span>Launch</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cybernetic cloud infrastructure, sovereign AI pipelines, and distributed server mesh.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="text-cyan-500">├──</span>
                <Link href="/orgintech">Root: /orgintech</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="text-cyan-500">├──</span>
                <Link href="/orgintech#orgin-quantum">3D Server Grid & Microkernel Mesh</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="text-cyan-500">├──</span>
                <Link href="/orgintech#orgin-quantum">0.2ms Edge Latency Architecture</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="text-cyan-500">├──</span>
                <Link href="/orgintech#orgin-quantum">High-Availability 99.999% SLA</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="text-cyan-500">├──</span>
                <Link href="/orgintech#orgin-quantum">256-Bit Post-Quantum Cryptography</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                <span className="text-cyan-500">└──</span>
                <Link href="/orgintech#services">Enterprise Blueprints & Hackathons</Link>
              </li>
            </ul>
          </div>

          {/* 02 // MGSolutions EdTech */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-500/30 space-y-4 shadow-xl shadow-emerald-950/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                <span>02 // EdTech Academy</span>
              </span>
              <Link
                href="/edtech"
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold"
              >
                <span>Launch</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Virtual STEM lecture halls, interactive code labs, and accredited degrees.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                <span className="text-emerald-500">├──</span>
                <Link href="/edtech">Root: /edtech</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                <span className="text-emerald-500">├──</span>
                <Link href="/edtech#edutech-catalog">Virtual STEM Classroom & Blackboard</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                <span className="text-emerald-500">├──</span>
                <Link href="/edtech#edutech-catalog">Orbiting Atomic Physics Simulation</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                <span className="text-emerald-500">├──</span>
                <Link href="/edtech#edutech-catalog">1,420+ Interactive Cloud Sandboxes</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                <span className="text-emerald-500">├──</span>
                <Link href="/edtech#courses">Full-Stack AI & Engineering Bootcamps</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                <span className="text-emerald-500">└──</span>
                <Link href="/edtech#resources">Accredited Engineering Credentials</Link>
              </li>
            </ul>
          </div>

          {/* 03 // BBS */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-purple-500/30 space-y-4 shadow-xl shadow-purple-950/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sm font-mono font-bold uppercase text-purple-400 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                <span>03 // BBS Services</span>
              </span>
              <Link
                href="/bbs"
                className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 font-bold"
              >
                <span>Launch</span>
                <span>→</span>
              </Link>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              24/7 client telephony, multi-channel promotions, and strategic enterprise advisory.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                <span className="text-purple-500">├──</span>
                <Link href="/bbs">Root: /bbs</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                <span className="text-purple-500">├──</span>
                <Link href="/bbs#bbs-promos">24/7 Client Telephony & Voice Desk</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                <span className="text-purple-500">├──</span>
                <Link href="/bbs#bbs-promos">VOIP Radar & Dynamic Frequency Equalizer</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                <span className="text-purple-500">├──</span>
                <Link href="/bbs#bbs-promos">Cylindrical Promotional Campaigns</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                <span className="text-purple-500">├──</span>
                <Link href="/bbs#services">Cross-Border M&A & Tech Due Diligence</Link>
              </li>
              <li className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                <span className="text-purple-500">└──</span>
                <Link href="/bbs#services">Operational Restructuring & Roundtables</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Corporate Headquarters & Machine Feeds */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-mono font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-400" />
              <span>Headquarters & Feeds</span>
            </span>
            <span className="text-xs font-mono text-cyan-400">
              MG SOLUTIONS CONGLOMERATE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-white font-bold block">Innovation Tower</span>
              <p className="text-slate-400">Innovation Way, CA 94105</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-white font-bold block">Direct Telephony</span>
              <p className="text-slate-400">+1 (800) 555-MG-SOL</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-white font-bold block">Compliance</span>
              <p className="text-slate-400">ISO 27001 & SOC2 Type II</p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 space-y-1 block transition-colors"
            >
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="h-4 w-4 text-cyan-400" />
                  <span>XML Sitemap Feed</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
              <p className="text-slate-400 font-mono">/sitemap.xml</p>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

