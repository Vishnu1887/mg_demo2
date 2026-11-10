import React from "react";
import Link from "next/link";
import { 
  Cpu, 
  GraduationCap, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Globe2, 
  Terminal,
  Network
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      
      {/* Division Quick Switcher Band */}
      <div className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-sm font-semibold text-slate-200">
                MGSolutions Core Operating Divisions:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <Link
                href="/orgintech"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-950/60 transition-all text-xs font-semibold text-indigo-300 shadow-sm shadow-indigo-950/50"
              >
                <Cpu className="h-4 w-4 text-indigo-400" />
                <span>OrginTech (Cloud & AI)</span>
              </Link>
              <Link
                href="/edtech"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/60 transition-all text-xs font-semibold text-emerald-300 shadow-sm shadow-emerald-950/50"
              >
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                <span>MGSolutions EdTech</span>
              </Link>
              <Link
                href="/bbs"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/60 transition-all text-xs font-semibold text-amber-300 shadow-sm shadow-amber-950/50"
              >
                <Briefcase className="h-4 w-4 text-amber-400" />
                <span>BBS (Business Services)</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info with 3D Metallic MG Emblem */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="MGSolutions Logo"
                  className="h-10 w-auto object-contain drop-shadow-[0_2px_8px_rgba(59,130,246,0.35)]"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">MGSolutions</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              An integrated conglomerate driving enterprise engineering at <strong>OrginTech</strong>, empowering future leaders through <strong>MGSolutions EdTech</strong>, and architecting corporate excellence at <strong>BBS</strong>.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-blue-400" /> Global Operations
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-400" /> ISO 27001 Certified
              </span>
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-indigo-400" /> SOC2 Type II
              </span>
            </div>
          </div>

          {/* Division Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase">Divisions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/orgintech" className="hover:text-indigo-400 transition-colors">
                  OrginTech Solutions
                </Link>
              </li>
              <li>
                <Link href="/edtech" className="hover:text-emerald-400 transition-colors">
                  MGSolutions EdTech
                </Link>
              </li>
              <li>
                <Link href="/bbs" className="hover:text-amber-400 transition-colors">
                  BBS Business Services
                </Link>
              </li>
              <li>
                <a href="#offerings" className="hover:text-cyan-300 transition-colors">
                  Corporate Architecture & Research
                </a>
              </li>
              <li>
                <a href="#headquarters" className="hover:text-purple-300 transition-colors">
                  Executive Briefings & Summits
                </a>
              </li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div className="space-y-3" id="offerings">
            <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase">Offerings</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/orgintech#services" className="hover:text-white transition-colors">
                  Enterprise Cloud Services
                </Link>
              </li>
              <li>
                <Link href="/edtech#courses" className="hover:text-white transition-colors">
                  Bootcamps & Cohorts
                </Link>
              </li>
              <li>
                <Link href="/bbs#services" className="hover:text-white transition-colors">
                  M&A Advisory & Restructuring
                </Link>
              </li>
              <li>
                <Link href="/#events" className="hover:text-white transition-colors">
                  Global Hackathons & Summits
                </Link>
              </li>
              <li>
                <Link href="/edtech#resources" className="hover:text-white transition-colors">
                  Technical System Design Cheatsheet
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Headquarters */}
          <div className="space-y-3" id="headquarters">
            <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase">Headquarters</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>MGSolutions Tower, Innovation Way, Tech Corridor, CA 94105</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <span>+1 (800) 555-MG-SOL</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span>contact@mgsolutions.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DIRECT ON-PAGE SITE MAP DIRECTORY (VISIBLE INLINE)       */}
      {/* ========================================================= */}
      <section id="sitemap" className="border-t border-slate-800/80 bg-[#060912]/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Network className="h-4 w-4" />
                <span>MG SOLUTIONS • ECOSYSTEM SITE MAP</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                Full Architectural Directory & Route Tree
              </h3>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 text-[10px] font-bold">
                PUBLIC REPOSITORY TREE
              </span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 text-slate-400 flex items-center gap-1 text-xs"
              >
                <span>/sitemap.xml</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 01 // OrginTech */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span>01 // OrginTech</span>
                </span>
                <Link
                  href="/orgintech"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Portal</span>
                  <span>→</span>
                </Link>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                  <span className="text-cyan-500">├──</span>
                  <Link href="/orgintech#orgin-quantum">3D Server Grid & Microkernel Mesh</Link>
                </li>
                <li className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
                  <span className="text-cyan-500">├──</span>
                  <Link href="/orgintech#orgin-quantum">Quantum Pipeline (0.2ms Edge Latency)</Link>
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
                  <Link href="/orgintech#services">Enterprise Blueprints & Security Labs</Link>
                </li>
              </ul>
            </div>

            {/* 02 // EdTech Academy */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>02 // MGSolutions EdTech</span>
                </span>
                <Link
                  href="/edtech"
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>Academy</span>
                  <span>→</span>
                </Link>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                  <span className="text-emerald-500">├──</span>
                  <Link href="/edtech#edutech-catalog">Virtual STEM Classroom & Chalkboard</Link>
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

            {/* 03 // BBS Business Support */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-purple-400 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>03 // BBS Business Support</span>
                </span>
                <Link
                  href="/bbs"
                  className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>Services</span>
                  <span>→</span>
                </Link>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-mono">
                <li className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                  <span className="text-purple-500">├──</span>
                  <Link href="/bbs#bbs-promos">24/7 Client Telephony & Voice Desk</Link>
                </li>
                <li className="flex items-center gap-2 hover:text-purple-300 transition-colors">
                  <span className="text-purple-500">├──</span>
                  <Link href="/bbs#bbs-promos">VOIP Radar & Dynamic Frequency Bars</Link>
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
        </div>
      </section>

      {/* Bottom copyright & legal */}
      <div className="border-t border-slate-800 bg-slate-950 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MGSolutions Global Conglomerate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#compliance" className="hover:text-slate-300 transition-colors">Security Compliance</a>
            <a href="#sitemap" className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono">
              Site Map ↑
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
