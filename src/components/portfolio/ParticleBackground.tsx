"use client";
// src/components/portfolio/ParticleBackground.tsx
import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#22d3ee", "#0891b2", "#fbbf24", "#06b6d4", "#a78bfa"];
    const pts = Array.from({ length: 75 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 0.5, a: Math.random() * 0.5 + 0.15,
      col: colors[Math.floor(Math.random() * colors.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + Math.floor(p.a * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      pts.forEach((p1, i) => pts.slice(i + 1).forEach((p2) => {
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (d < 115) {
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(34,211,238,${0.13 * (1 - d / 115)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }));
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}
