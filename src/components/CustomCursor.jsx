import React, { useEffect, useRef } from 'react';

// ── Brand colors ─────────────────────────────────────────────────────────────
const COLOR_PRIMARY   = '#87b652'; // green
const COLOR_SECONDARY = '#e67365'; // coral/red

// ── Particle settings ─────────────────────────────────────────────────────────
const MAX_PARTICLES = 120;
const PARTICLE_LIFE  = 55;   // frames
const SPAWN_RATE     = 3;    // spawn every N frames

const CustomCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    // Hide system cursor
    const style = document.createElement('style');
    style.id = 'cc-hide-cursor';
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // Size canvas
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── State ─────────────────────────────────────────────────────────────────
    let mouseX = -100, mouseY = -100;
    let dotX   = -100, dotY   = -100;   // smooth-follow for outer ring
    let isHovering = false;
    let frame = 0;

    // Particle pool
    const particles = [];

    // ── Mouse events ──────────────────────────────────────────────────────────
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const el = document.elementFromPoint(mouseX, mouseY);
      isHovering = !!el?.closest(
        'a, button, input, textarea, [role="button"], .btn, .nav-link, .social-link, .skill-card, .card, .btn-primary, .btn-outline'
      );
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', () => { mouseX = -200; mouseY = -200; });

    // ── Particle factory ──────────────────────────────────────────────────────
    const spawnParticle = () => {
      if (particles.length >= MAX_PARTICLES) return;
      // Alternate between brand colors
      const color = Math.random() > 0.5 ? COLOR_PRIMARY : COLOR_SECONDARY;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.4 + 0.4;
      particles.push({
        x: mouseX,
        y: mouseY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,  // slight upward drift
        life: PARTICLE_LIFE,
        maxLife: PARTICLE_LIFE,
        size: Math.random() * 3.5 + 1.2,
        color,
      });
    };

    // ── Main render loop ──────────────────────────────────────────────────────
    let animId;

    const render = () => {
      animId = requestAnimationFrame(render);
      frame++;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth-follow for outer ring
      dotX += (mouseX - dotX) * 0.13;
      dotY += (mouseY - dotY) * 0.13;

      // Spawn particles when on screen
      if (mouseX > 0 && frame % SPAWN_RATE === 0) {
        spawnParticle();
      }

      // ── Draw particles ──────────────────────────────────────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.04;          // subtle gravity
        p.vx *= 0.97;          // drag
        p.life--;

        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const progress = p.life / p.maxLife;      // 1 → 0
        const alpha    = progress * 0.75;
        const radius   = p.size * (0.3 + progress * 0.7);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = p.color;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Draw outer ring (slow follower) ────────────────────────────────
      const ringColor  = isHovering ? COLOR_SECONDARY : COLOR_PRIMARY;
      const ringRadius = isHovering ? 20 : 16;

      ctx.save();
      ctx.beginPath();
      ctx.arc(dotX, dotY, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth   = 1.5;
      ctx.globalAlpha = 0.55;
      ctx.shadowBlur  = 12;
      ctx.shadowColor = ringColor;
      ctx.stroke();
      ctx.restore();

      // ── Draw inner dot (locked exactly to mouse) ───────────────────────
      const dotColor  = isHovering ? COLOR_PRIMARY : COLOR_SECONDARY;
      const dotRadius = isHovering ? 5 : 3.5;

      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle   = dotColor;
      ctx.globalAlpha = 0.95;
      ctx.shadowBlur  = 14;
      ctx.shadowColor = dotColor;
      ctx.fill();
      ctx.restore();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      const st = document.getElementById('cc-hide-cursor');
      if (st) st.remove();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="custom-cursor-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        pointerEvents: 'none',
      }}
    />
  );
};

export default CustomCursor;
