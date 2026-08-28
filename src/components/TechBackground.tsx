import React, { useEffect, useRef } from 'react';

export const TechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isMobile = width < 768;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Optimized particle nodes based on screen size (reduced for mobile to save GPU & battery)
    const maxParticles = isMobile ? 18 : 50;
    const particleCount = Math.min(Math.floor((width * height) / (isMobile ? 28000 : 18000)), maxParticles);
    const maxConnectionDist = isMobile ? 85 : 130;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }> = [];

    const colors = ['#22D3EE', '#2DD4BF', '#38BDF8', '#0B4F7A'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.45),
        vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.45),
        radius: Math.random() * (isMobile ? 1.4 : 1.8) + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    let tick = 0;
    let isPageVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (!isPageVisible) return;

      tick++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Draw connections to nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            const lineAlpha = (1 - dist / maxConnectionDist) * (isMobile ? 0.12 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw node
        const dynamicAlpha = p1.alpha + Math.sin(tick * p1.pulseSpeed) * 0.15;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, dynamicAlpha));
        ctx.fill();

        // Glow only for desktop/larger nodes to minimize fill rate on low-end devices
        if (!isMobile && p1.radius > 2) {
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p1.color;
          ctx.globalAlpha = 0.06;
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden contain-strict">
      {/* Frosted Glass Ambient Luminous Spheres - optimized blur for mobile to save GPU */}
      <div className="absolute -top-[10%] -left-[10%] w-[65vw] sm:w-[55vw] h-[65vw] sm:h-[55vw] max-w-[800px] max-h-[800px] bg-[#0B4F7A] rounded-full blur-[60px] sm:blur-[140px] opacity-35 sm:opacity-40 pointer-events-none transform-gpu" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[70vw] sm:w-[60vw] h-[70vw] sm:h-[60vw] max-w-[850px] max-h-[850px] bg-[#22D3EE] rounded-full blur-[70px] sm:blur-[160px] opacity-15 sm:opacity-20 pointer-events-none transform-gpu" />
      <div className="absolute top-[25%] right-[5%] w-[45vw] sm:w-[35vw] h-[45vw] sm:h-[35vw] max-w-[500px] max-h-[500px] bg-[#2DD4BF] rounded-full blur-[50px] sm:blur-[120px] opacity-10 sm:opacity-15 pointer-events-none transform-gpu" />
      <div className="absolute bottom-[20%] left-[15%] w-[50vw] sm:w-[40vw] h-[50vw] sm:h-[40vw] max-w-[600px] max-h-[600px] bg-[#071B3A] rounded-full blur-[60px] sm:blur-[130px] opacity-30 sm:opacity-35 pointer-events-none transform-gpu" />
      
      {/* Subtle tech grid pattern */}
      <div className="absolute inset-0 bg-tech-grid opacity-40 sm:opacity-60" />

      {/* Dynamic interactive canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 sm:opacity-60" />
    </div>
  );
};
