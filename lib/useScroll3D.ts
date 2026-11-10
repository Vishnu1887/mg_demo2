"use client";

import { useEffect } from "react";

export function useScroll3D(activeTab: string | number) {
  useEffect(() => {
    const updateScroll3D = () => {
      const cards = document.querySelectorAll<HTMLElement>(".scroll-3d-card");
      const vh = window.innerHeight;
      const vhCenter = vh / 2;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = (cardCenter - vhCenter) / (vh / 2);
        const factor = Math.max(-1.2, Math.min(1.2, dist));
        const fx = card.dataset.fx || "matrix-flip";

        // 1. Matrix Voxel Flip (X-axis tilt & depth shift)
        if (fx === "matrix-flip") {
          const rotX = (factor * 26).toFixed(2);
          const transZ = (Math.abs(factor) * -90).toFixed(1);
          const scale = (1 - Math.abs(factor) * 0.08).toFixed(3);
          const op = Math.max(0.35, 1 - Math.abs(factor) * 0.45).toFixed(2);
          card.style.transform = `perspective(1100px) rotateX(${rotX}deg) translateZ(${transZ}px) scale(${scale})`;
          card.style.opacity = op;
        }
        // 2. Origami Book-Fold (Y-axis page turn & fold)
        else if (fx === "origami-fold") {
          const rotY = (factor * -32).toFixed(2);
          const rotX = (factor * 10).toFixed(2);
          const transZ = (Math.abs(factor) * -110).toFixed(1);
          const scale = (1 - Math.abs(factor) * 0.09).toFixed(3);
          const op = Math.max(0.35, 1 - Math.abs(factor) * 0.45).toFixed(2);
          card.style.transform = `perspective(1100px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${transZ}px) scale(${scale})`;
          card.style.opacity = op;
        }
        // 3. Cylindrical Carousel (Curved lateral rotation)
        else if (fx === "cylinder-carousel") {
          const rotY = (factor * 34).toFixed(2);
          const transZ = (Math.abs(factor) * -100).toFixed(1);
          const scale = (1 - Math.abs(factor) * 0.08).toFixed(3);
          const op = Math.max(0.35, 1 - Math.abs(factor) * 0.45).toFixed(2);
          card.style.transform = `perspective(1100px) rotateY(${rotY}deg) translateZ(${transZ}px) scale(${scale})`;
          card.style.opacity = op;
        }
        // 4. Pedestal Float (Z-depth lift & vertical shift)
        else if (fx === "pedestal-float") {
          const transY = (factor * 45).toFixed(1);
          const rotX = (factor * 16).toFixed(2);
          const scale = (1 - Math.abs(factor) * 0.06).toFixed(3);
          const op = Math.max(0.4, 1 - Math.abs(factor) * 0.4).toFixed(2);
          card.style.transform = `perspective(1100px) translateY(${transY}px) rotateX(${rotX}deg) scale(${scale})`;
          card.style.opacity = op;
        }
      });
    };

    window.addEventListener("scroll", updateScroll3D, { passive: true });
    window.addEventListener("resize", updateScroll3D, { passive: true });

    const timeout = setTimeout(updateScroll3D, 120);

    return () => {
      window.removeEventListener("scroll", updateScroll3D);
      window.removeEventListener("resize", updateScroll3D);
      clearTimeout(timeout);
    };
  }, [activeTab]);
}
