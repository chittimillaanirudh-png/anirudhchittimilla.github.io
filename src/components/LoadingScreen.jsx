import React, { useEffect, useState, useRef } from 'react';

// ─── Constants ─────────────────────────────────────────────────────────────
const SEGMENTS = 20;
const SEG_LEN  = 18;
const DRAGON_W = 260;
const DRAGON_H = 260;

const LoadingScreen = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut]         = useState(false);
  const canvasRef = useRef(null);

  // ── Decide whether to show ─────────────────────────────────────────────
  useEffect(() => {
    const entries  = performance.getEntriesByType('navigation');
    const navType  = entries.length > 0 ? entries[0].type
      : performance.navigation?.type === 1 ? 'reload' : 'navigate';

    const isReload  = navType === 'reload';
    const wasVisited = sessionStorage.getItem('ac_visited') === 'true';
    sessionStorage.setItem('ac_visited', 'true');

    const shouldShow = !wasVisited || isReload;
    window.__AC_SHOW_LOADING = shouldShow;
    window.__AC_SHOW_BLINK   = wasVisited && !isReload;
    setShowLoading(shouldShow);
  }, []);

  // ── Canvas animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (!showLoading || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Load exact image
    const img = new Image();
    img.src   = '/assets/amphiptere.png';
    let imgLoaded = false;
    img.onload = () => { imgLoaded = true; };

    // IK Spine
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const spine = Array.from({ length: SEGMENTS }, () => ({ x: cx, y: cy }));

    // Head follows a cinematic path target
    let headX = cx, headY = cy;
    let velX = 0, velY = 0;

    // ── Cinematic phase timeline ──────────────────────────────────────
    // Phase 0 (0‒2 s):  dive-in from Z+ (large scale → normal)
    // Phase 1 (2‒7 s):  true 3D elliptical orbit around text (behind text layer)
    // Phase 2 (7‒9 s):  ease out, settle to background centre
    // Phase 3 (9+ s):   idle breathing

    let elapsed = 0;
    let lastTS  = null;

    const getPathTarget = (t) => {
      const W = canvas.width;
      const H = canvas.height;

      if (t < 2.0) {
        // Entry: sweeping curve into scene
        const p = t / 2.0;
        const ease = 1 - Math.pow(1 - p, 3);
        return {
          x: cx + Math.sin(ease * Math.PI) * W * 0.25,
          y: H * 0.1 + ease * (H * 0.35),
          scale: 1.8 - ease * 0.8,  // zoom in (depth illusion)
          alpha: ease,
        };
      }

      if (t < 7.0) {
        // Orbit: parametric 3D ellipse
        const p    = (t - 2.0) / 5.0;        // 0→1 over 5s
        const ang  = p * Math.PI * 2.5;      // 1.25 full loops
        const rx   = W * 0.36;
        const ry   = H * 0.18;
        const x    = cx + Math.sin(ang) * rx;
        const y    = cy + Math.cos(ang * 1.3) * ry - H * 0.05;

        // Depth simulaton: front vs back
        const depth = (Math.cos(ang) + 1) / 2;   // 0=far, 1=near
        const scale  = 0.65 + depth * 0.45;       // 0.65–1.1

        return { x, y, scale, alpha: 1 };
      }

      if (t < 9.0) {
        // Settle
        const p    = (t - 7.0) / 2.0;
        const ease = 1 - Math.pow(1 - p, 3);
        return {
          x: cx + (1 - ease) * Math.sin(t) * W * 0.1,
          y: cy - H * 0.12 * ease,
          scale: 0.8 + (1 - ease) * 0.2,
          alpha: 1,
        };
      }

      // Idle breathing
      return {
        x: cx + Math.sin(t * 0.4) * 12,
        y: cy - canvas.height * 0.12 + Math.cos(t * 0.6) * 8,
        scale: 0.82 + Math.sin(t * 1.1) * 0.015,
        alpha: 1,
      };
    };

    let animId;

    const render = (ts) => {
      animId = requestAnimationFrame(render);

      if (lastTS === null) lastTS = ts;
      const dt = Math.min((ts - lastTS) / 1000, 0.1);
      lastTS   = ts;
      elapsed += dt;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!imgLoaded) return;

      const { x: tx, y: ty, scale: tScale = 1, alpha: tAlpha = 1 } = getPathTarget(elapsed);

      // Spring head toward path target
      const fx = (tx - headX) * 0.09;
      const fy = (ty - headY) * 0.09;
      velX = (velX + fx) * 0.8;
      velY = (velY + fy) * 0.8;
      headX += velX;
      headY += velY;

      const speed = Math.sqrt(velX * velX + velY * velY);

      // IK update
      spine[0].x = headX;
      spine[0].y = headY;
      for (let i = 1; i < SEGMENTS; i++) {
        const prev  = spine[i - 1];
        const cur   = spine[i];
        const prog  = i / SEGMENTS;
        const dx    = cur.x - prev.x;
        const dy    = cur.y - prev.y;
        const dist  = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx    = dx / dist;
        const ny    = dy / dist;
        const tx2   = prev.x + nx * SEG_LEN;
        const ty2   = prev.y + ny * SEG_LEN;
        const moveAmp = Math.min(speed * 0.9, 18) * prog;
        const slither = Math.sin(elapsed * 3.5 - i * 0.4) * moveAmp;
        const perpX = -ny;
        const perpY =  nx;
        const lag = 0.42 * (1 - prog * 0.5);
        cur.x += (tx2 + perpX * slither - cur.x) * lag;
        cur.y += (ty2 + perpY * slither - cur.y) * lag;
      }

      // ── Draw dragon (behind text via z-index in CSS, but in front of bg) ──
      const headDirX = headX - spine[1].x;
      const headDirY = headY - spine[1].y;
      const ang = Math.atan2(headDirY, headDirX) - Math.PI / 2;

      const wingFlap = Math.sin(elapsed * 4.5) * 0.07 * Math.min(1, speed * 0.1 + 0.3);
      const breathScale = tScale * (1 + Math.sin(elapsed * 1.1) * 0.012);

      // Velocity-based tilt
      const tiltX = velX * 0.002;
      const tiltY = velY * 0.003;

      ctx.save();
      ctx.globalAlpha = tAlpha;
      ctx.translate(headX, headY);
      ctx.rotate(ang);

      // Perspective matrix
      const a = (1 + tiltX) * breathScale;
      const b = tiltY * 0.25;
      const c = -tiltY * 0.08;
      const d = (1 - Math.abs(tiltX) * 0.2) * breathScale;
      ctx.transform(a, b, c, d, 0, 0);
      ctx.transform(1, 0, Math.sin(wingFlap) * 0.06, 1, 0, 0);

      // Depth of field glow at far phase
      const depthBlur = elapsed > 2 && elapsed < 7
        ? Math.max(0, (1 - ((Math.cos((elapsed - 2) / 5 * Math.PI * 2.5) + 1) / 2)) * 2.5)
        : 0;
      if (depthBlur > 0.3) {
        ctx.filter = `blur(${depthBlur.toFixed(1)}px) brightness(1.05)`;
      }

      // Use 'screen' blend to strip pure black pixels from the background
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(img,
        -DRAGON_W / 2,
        -DRAGON_H * 0.1,
        DRAGON_W, DRAGON_H
      );
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;

      ctx.restore();
    };

    requestAnimationFrame(render);

    // Dismiss after 5.5s
    const dismissTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setShowLoading(false), 900);
    }, 5500);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(dismissTimer);
      window.removeEventListener('resize', resize);
    };
  }, [showLoading]);

  // ─────────────────────────────────────────────────────────────────────────
  if (!showLoading) return null;

  return (
    <div
      id="loading-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0e0e0e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.9s ease',
        opacity: fadeOut ? 0 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Dragon canvas — behind text (z-index 5) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />

      {/* Text — in front of dragon (z-index 10) */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', gap: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2
          className="hidden md:block text-3xl font-headline font-light tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] uppercase"
          id="typing-name"
        />
        <div className="flex md:hidden flex-col items-center gap-1" id="typing-name-mobile">
          <span className="text-3xl font-headline font-light tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] uppercase" id="mobile-line1" />
          <span className="text-2xl font-headline font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#ff8a7a] to-[#c0ee91] uppercase" id="mobile-line2" />
        </div>
        <p className="text-sm md:text-xl font-headline tracking-[0.3em] text-on-surface-variant uppercase">
          Explore My Portfolio
        </p>
        {/* Loading progress bar */}
        <div style={{
          width: '12rem',
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '1px',
          overflow: 'hidden',
          marginTop: '1rem',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #c0ee91, #ff8e7f)',
            animation: 'loading-bar 5.5s cubic-bezier(0.4,0,0.2,1) forwards',
          }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
