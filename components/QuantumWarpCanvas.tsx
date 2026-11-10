"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface QuantumWarpCanvasProps {
  isTransitioning?: boolean;
  activeTab?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
}

interface Star3D {
  x: number;
  y: number;
  z: number;
  color: string;
}

export function QuantumWarpCanvas({
  isTransitioning = false,
  activeTab: propActiveTab,
}: QuantumWarpCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathname = usePathname();

  // Determine active tab from prop or current pathname
  const currentTab =
    typeof propActiveTab === "number"
      ? propActiveTab
      : pathname === "/edtech"
      ? 1
      : pathname === "/bbs"
      ? 2
      : 0;

  // Local transition state to listen to global custom events
  const [transitioning, setTransitioning] = useState<boolean>(isTransitioning);

  useEffect(() => {
    setTransitioning(isTransitioning);
  }, [isTransitioning]);

  useEffect(() => {
    const handleSwitch = () => {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 900);
      return () => clearTimeout(timer);
    };

    window.addEventListener("switch-portal-tab", handleSwitch);
    window.addEventListener("quantum-warp-engage", handleSwitch);
    return () => {
      window.removeEventListener("switch-portal-tab", handleSwitch);
      window.removeEventListener("quantum-warp-engage", handleSwitch);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Mouse tracking for interactive constellation parallax
    const mouse = { x: -9999, y: -9999, isHovering: false };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovering = true;
    };

    const handlePointerLeave = () => {
      mouse.isHovering = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    // Color palettes per division
    const getColors = (tab: number) => {
      if (tab === 1) {
        // EdTech - Emerald, Teal, Mint, Cyber Gold
        return {
          nodes: ["#10b981", "#34d399", "#14b8a6", "#6ee7b7"],
          beam: "rgba(16, 185, 129, ",
          orbs: [
            { r: 16, g: 185, b: 129 },
            { r: 20, g: 184, b: 166 },
            { r: 52, g: 211, b: 153 },
          ],
          grid: "rgba(16, 185, 129, ",
        };
      } else if (tab === 2) {
        // BBS - Violet, Magenta, Neon Purple, Amber
        return {
          nodes: ["#a855f7", "#ec4899", "#8b5cf6", "#f43f5e"],
          beam: "rgba(168, 85, 247, ",
          orbs: [
            { r: 168, g: 85, b: 247 },
            { r: 236, g: 72, b: 153 },
            { r: 139, g: 92, b: 246 },
          ],
          grid: "rgba(168, 85, 247, ",
        };
      } else {
        // OrginTech - Cyan, Electric Blue, Sky, Cobalt
        return {
          nodes: ["#06b6d4", "#3b82f6", "#38bdf8", "#0ea5e9"],
          beam: "rgba(6, 182, 212, ",
          orbs: [
            { r: 6, g: 182, b: 212 },
            { r: 59, g: 130, b: 246 },
            { r: 14, g: 165, b: 233 },
          ],
          grid: "rgba(6, 182, 212, ",
        };
      }
    };

    let palette = getColors(currentTab);

    // 1. Constellation Network Nodes
    const particleCount = Math.min(130, Math.floor((w * h) / 10000) + 40);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1.2,
        color: palette.nodes[Math.floor(Math.random() * palette.nodes.length)],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // 2. 3D Stars for Quantum Warp Mode
    const starCount = 100;
    const stars: Star3D[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w,
        color: palette.nodes[Math.floor(Math.random() * palette.nodes.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      stars.forEach((s) => {
        if (s.z > w) s.z = Math.random() * w;
      });
    };

    window.addEventListener("resize", handleResize);

    let hexAngle = 0;
    let gridOffset = 0;
    let scanlineY = 0;
    let animId: number;

    const render = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      palette = getColors(currentTab);

      // =========================================================================
      // LAYER 1: LIVING BIOLUMINESCENT PLASMA ORBS (Breathing Ambient Nebulae)
      // =========================================================================
      const orb1X = cx + Math.sin(time * 0.0006) * (w * 0.28);
      const orb1Y = cy * 0.7 + Math.cos(time * 0.0008) * (h * 0.22);
      const rad1 = Math.max(160, Math.min(w * 0.45, 520) + Math.sin(time * 0.001) * 40);

      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, rad1);
      const o1 = palette.orbs[0];
      grad1.addColorStop(0, `rgba(${o1.r}, ${o1.g}, ${o1.b}, 0.22)`);
      grad1.addColorStop(0.5, `rgba(${o1.r}, ${o1.g}, ${o1.b}, 0.08)`);
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, w, h);

      const orb2X = cx + Math.cos(time * 0.0005) * (w * 0.32);
      const orb2Y = cy * 1.3 + Math.sin(time * 0.0007) * (h * 0.24);
      const rad2 = Math.max(180, Math.min(w * 0.5, 560) + Math.cos(time * 0.0012) * 50);

      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 10, orb2X, orb2Y, rad2);
      const o2 = palette.orbs[1];
      grad2.addColorStop(0, `rgba(${o2.r}, ${o2.g}, ${o2.b}, 0.18)`);
      grad2.addColorStop(0.55, `rgba(${o2.r}, ${o2.g}, ${o2.b}, 0.06)`);
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);

      // =========================================================================
      // LAYER 2: 3D CYBER HORIZON PERSPECTIVE GRID (Moving Tron Horizon Plane)
      // =========================================================================
      const horizonY = h * 0.62;
      gridOffset = (gridOffset + (transitioning ? 4.5 : 0.8)) % 38;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, horizonY - 10, w, h - horizonY + 10);
      ctx.clip();

      // Perspective Depth Horizon Lines
      for (let d = 0; d < 14; d++) {
        const rawY = horizonY + Math.pow(d / 13, 2.2) * (h - horizonY) + gridOffset * (d / 13);
        if (rawY <= h) {
          const depthAlpha = Math.min(0.24, ((rawY - horizonY) / (h - horizonY)) * 0.25);
          ctx.beginPath();
          ctx.moveTo(0, rawY);
          ctx.lineTo(w, rawY);
          ctx.strokeStyle = `${palette.grid}${depthAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Radiating Perspective Ground Lines
      const numRays = 18;
      for (let r = 0; r <= numRays; r++) {
        const rayBottomX = (r / numRays) * (w * 1.6) - w * 0.3;
        ctx.beginPath();
        ctx.moveTo(cx, horizonY);
        ctx.lineTo(rayBottomX, h);
        ctx.strokeStyle = `${palette.grid}0.12)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Horizon Glow Line
      const horizonGlow = ctx.createLinearGradient(0, horizonY, w, horizonY);
      horizonGlow.addColorStop(0, "rgba(0,0,0,0)");
      horizonGlow.addColorStop(0.5, `${palette.grid}0.4)`);
      horizonGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = horizonGlow;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.stroke();

      // =========================================================================
      // LAYER 3: CONSTELLATION DATA PARTICLES & NEURAL CONNECTION MESH
      // =========================================================================
      const connectionDist = Math.min(130, w * 0.16);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Normal Drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Interactive mouse deflection / attraction
        if (mouse.isHovering) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);
          if (distToMouse < 160 && distToMouse > 0) {
            // Gentle pull toward cursor
            p.x += (dx / distToMouse) * 0.8;
            p.y += (dy / distToMouse) * 0.8;

            // Connect glowing high-energy beam from cursor to particle
            const mouseAlpha = (1 - distToMouse / 160) * 0.75;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `${palette.beam}${mouseAlpha})`;
            ctx.lineWidth = 1.4;
            ctx.stroke();
          }
        }

        // Particle Glow Pulse
        const pulse = Math.sin(time * 0.003 + p.pulsePhase) * 0.4 + 0.8;
        const currentRadius = Math.max(0.6, p.radius * pulse);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for performance

        // Connect nearby nodes with neural lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.38;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${palette.beam}${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // =========================================================================
      // LAYER 4: 3D HYPER-WARP ACCELERATION (Active during Tab Transitions)
      // =========================================================================
      if (transitioning) {
        const warpSpeed = 34;

        stars.forEach((s) => {
          s.z -= warpSpeed;
          if (s.z <= 0 || s.z > w) {
            s.z = w;
            s.x = (Math.random() - 0.5) * w;
            s.y = (Math.random() - 0.5) * h;
          }

          const k = 260 / Math.max(1, s.z);
          const px = s.x * k + cx;
          const py = s.y * k + cy;

          if (Number.isFinite(px) && Number.isFinite(py) && px >= 0 && px <= w && py >= 0 && py <= h) {
            const prevK = 260 / Math.max(1, s.z + warpSpeed * 2.2);
            const prevPx = s.x * prevK + cx;
            const prevPy = s.y * prevK + cy;

            if (Number.isFinite(prevPx) && Number.isFinite(prevPy)) {
              ctx.beginPath();
              ctx.moveTo(prevPx, prevPy);
              ctx.lineTo(px, py);
              ctx.strokeStyle = s.color;
              ctx.lineWidth = Math.min(4, Math.max(1, (1 - s.z / w) * 4));
              ctx.stroke();
            }
          }
        });

        // Hexagonal Futuristic Targeting Rings
        hexAngle += 0.04;
        for (let r = 1; r <= 3; r++) {
          const radius = (time / 6 + r * 130) % 580;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(hexAngle * (r % 2 === 0 ? 1 : -1));
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (a * Math.PI) / 3;
            const hx = Math.cos(angle) * radius;
            const hy = Math.sin(angle) * radius;
            if (a === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `${palette.beam}${Math.max(0, 0.5 - radius / 580)})`;
          ctx.lineWidth = 2.2;
          ctx.stroke();
          ctx.restore();
        }

        // Fast Vertical Holographic Scanner Wave Sweep
        scanlineY = (scanlineY + 16) % (h + 80);
        const scanGrad = ctx.createLinearGradient(0, scanlineY - 40, 0, scanlineY);
        scanGrad.addColorStop(0, "rgba(6, 182, 212, 0)");
        scanGrad.addColorStop(0.8, "rgba(6, 182, 212, 0.18)");
        scanGrad.addColorStop(1, "rgba(34, 211, 238, 0.65)");
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanlineY - 40, w, 40);

        // Core Shockwave Ripple
        const shockRadius = (time / 4) % (Math.min(w, h) * 0.65);
        ctx.beginPath();
        ctx.arc(cx, cy, shockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${palette.beam}${Math.max(0, 0.6 - shockRadius / (w * 0.65))})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, [currentTab, transitioning]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
