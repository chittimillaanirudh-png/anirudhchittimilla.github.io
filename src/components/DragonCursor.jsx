import React, { useEffect, useRef } from 'react';

// ─── TUNEABLE CONSTANTS ────────────────────────────────────────────────────
const DRAGON_W = 200;          // canvas-space dragon width
const DRAGON_H = 200;          // canvas-space dragon height
const SEGMENTS  = 22;          // IK spine nodes
const SEG_LEN   = 14;          // px between nodes (total ~308px tail)
const HEAD_STIFFNESS = 0.13;   // spring towards mouse
const HEAD_DAMPING   = 0.76;   // velocity retention
const TAIL_LERP  = 0.38;       // how fast tail catches up
const SLITHER_FREQ = 3.2;
const SLITHER_AMP  = 9;        // lateral snake wiggle
const IDLE_FLOAT_AMT = 6;      // px of idle vertical breathing
const IDLE_FLOAT_SPD = 0.9;
const IDLE_TAIL_AMP  = 14;
const IDLE_TAIL_SPD  = 0.55;
const WING_FLAP_AMT  = 0.08;   // radians of wing tilt
const WING_FLAP_SPD  = 4.5;
const TRAIL_COUNT = 8;
const TRAIL_DECAY  = 0.10;     // alpha per trail image

// ─── COMPONENT ────────────────────────────────────────────────────────────
const DragonCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Hide system cursor
    document.body.style.cursor = 'none';
    const styleTag = document.createElement('style');
    styleTag.id = 'dragon-cursor-style';
    styleTag.textContent = `* { cursor: none !important; }`;
    document.head.appendChild(styleTag);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas to full viewport
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Load dragon image ──────────────────────────────────────────────────
    const img = new Image();
    img.src = '/assets/amphiptere.png';
    let imgLoaded = false;
    img.onload  = () => { imgLoaded = true; };
    img.onerror = () => { console.error('[DragonCursor] Failed to load /assets/amphiptere.png'); };

    // ── State ──────────────────────────────────────────────────────────────
    // IK spine: each node = { x, y }
    const spine = Array.from({ length: SEGMENTS }, () => ({
      x: -300, y: window.innerHeight / 2
    }));

    // Physics target (head)
    let headX = -300, headY = window.innerHeight / 2;
    let velX = 0, velY = 0;

    // Mouse state
    let mouseX = -300, mouseY = window.innerHeight / 2;
    let prevMouseX = mouseX, prevMouseY = mouseY;
    let speedFactor = 0; // 0→1, smoothed velocity magnitude
    let isMoving = false;
    let movingTimer = null;

    // Click state
    let clickPulse = 0; // 1 → 0 decay

    // Hover state  
    let hoverTarget = null;
    let hoverFactor = 0; // 0→1

    // Idle drift
    let idleTime = 0;

    // Trail buffer: last N positions of the head
    const trail = [];

    // Dark mode
    const isDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Particle pool
    const particles = [];
    const spawnParticle = (x, y) => {
      if (Math.random() > 0.45) return;
      const color = Math.random() > 0.5 ? '#87b652' : '#e67365';
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 1,
        life: 1.0,
        size: Math.random() * 3 + 1.5,
        color,
      });
    };

    // ── Event handlers ─────────────────────────────────────────────────────
    const onMouseMove = (e) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Determine speed (0-1 capped)
      const dx = mouseX - prevMouseX;
      const dy = mouseY - prevMouseY;
      const rawSpeed = Math.sqrt(dx * dx + dy * dy);
      speedFactor = Math.min(1.0, speedFactor * 0.85 + rawSpeed * 0.02);

      isMoving = rawSpeed > 0.5;
      clearTimeout(movingTimer);
      movingTimer = setTimeout(() => { isMoving = false; }, 120);

      // Spawn trail particles when moving fast
      if (speedFactor > 0.4) {
        spawnParticle(spine[SEGMENTS - 1].x, spine[SEGMENTS - 1].y);
      }

      // Magnetic hover: find nearest interactive element
      const el = document.elementFromPoint(mouseX, mouseY);
      const interactive = el?.closest('a, button, input, textarea, [role="button"], .btn, .nav-link');
      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        hoverTarget = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      } else {
        hoverTarget = null;
      }
    };

    const onMouseDown = () => { clickPulse = 1.0; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);

    // ── RENDER LOOP ────────────────────────────────────────────────────────
    let animId;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016; // ~60fps tick
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!imgLoaded) return;

      // ── 1. Physics – head spring ──────────────────────────────────────
      idleTime += 0.016;

      // Magnetic pull toward interactive element when hovering
      let targetX = mouseX;
      let targetY = mouseY;
      if (hoverTarget) {
        hoverFactor = Math.min(1, hoverFactor + 0.05);
        const pull = 0.18 * hoverFactor;
        targetX = mouseX + (hoverTarget.x - mouseX) * pull;
        targetY = mouseY + (hoverTarget.y - mouseY) * pull;
      } else {
        hoverFactor = Math.max(0, hoverFactor - 0.05);
      }

      // Idle float when not moving
      const idleOffsetY = !isMoving
        ? Math.sin(idleTime * IDLE_FLOAT_SPD) * IDLE_FLOAT_AMT * (1 - speedFactor)
        : 0;

      const fx = (targetX - headX) * HEAD_STIFFNESS;
      const fy = (targetY - headY) * HEAD_STIFFNESS;
      velX = (velX + fx) * HEAD_DAMPING;
      velY = (velY + fy) * HEAD_DAMPING;
      headX += velX;
      headY += velY + idleOffsetY * 0.1;

      // Decay click
      clickPulse *= 0.88;

      // ── 2. IK Spine update ────────────────────────────────────────────
      spine[0].x = headX;
      spine[0].y = headY;

      for (let i = 1; i < SEGMENTS; i++) {
        const prev = spine[i - 1];
        const cur  = spine[i];
        const progress = i / SEGMENTS;

        // Direction from cur toward prev
        const dx   = cur.x - prev.x;
        const dy   = cur.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx   = dx / dist;
        const ny   = dy / dist;

        // Constrain to segment length
        const tx = prev.x + nx * SEG_LEN;
        const ty = prev.y + ny * SEG_LEN;

        // Sinusoidal slather offset (orthogonal to direction)
        const moveAmp = speedFactor * SLITHER_AMP * (1 - progress * 0.3);
        const idleTailAmp = !isMoving
          ? Math.sin(idleTime * IDLE_TAIL_SPD + i * 0.4) * IDLE_TAIL_AMP * progress
          : 0;
        const slitherPhase = t * SLITHER_FREQ - i * 0.35;
        const slitherOffset = Math.sin(slitherPhase) * moveAmp + idleTailAmp;

        // Perpendicular to direction
        const perpX = -ny;
        const perpY = nx;

        // Lerp into position with natural delay
        const lag = TAIL_LERP * (1 - progress * 0.55); // tail lags more
        cur.x += (tx + perpX * slitherOffset - cur.x) * lag;
        cur.y += (ty + perpY * slitherOffset - cur.y) * lag;
      }

      // ── 3. Trail effect ────────────────────────────────────────────────
      trail.unshift({ x: headX, y: headY, alpha: speedFactor });
      if (trail.length > TRAIL_COUNT) trail.length = TRAIL_COUNT;

      // Draw trail images (ghost copies behind dragon)
      for (let i = trail.length - 1; i >= 1; i--) {
        const tr  = trail[i];
        const alpha = (TRAIL_COUNT - i) / TRAIL_COUNT * tr.alpha * TRAIL_DECAY;
        if (alpha < 0.005) continue;

        // Direction from this trail to previous
        const ntr = trail[i - 1];
        const dxT = ntr.x - tr.x;
        const dyT = ntr.y - tr.y;
        const ang = Math.atan2(dyT, dxT) - Math.PI / 2;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(tr.x, tr.y);
        ctx.rotate(ang);
        ctx.scale(0.55, 0.55);
        // Colour-tinted with brand glow
        ctx.filter = isDark()
          ? 'brightness(0.8) saturate(1.2)'
          : 'brightness(1.1) saturate(1.1)';
        ctx.drawImage(img, -DRAGON_W / 2, -DRAGON_H / 2, DRAGON_W, DRAGON_H);
        ctx.restore();
      }

      // ── 4. Particles ─────────────────────────────────────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = p.life * 0.75;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── 5. Draw Dragon ────────────────────────────────────────────────
      // Compute head direction from spine
      const headDirX = headX - spine[1].x;
      const headDirY = headY - spine[1].y;
      let headAngle  = Math.atan2(headDirY, headDirX) - Math.PI / 2;

      // 3D tilt based on velocity → fake yaw/roll depth illusion
      const velMag   = Math.sqrt(velX * velX + velY * velY);
      const tiltX    = velX * 0.003 * Math.min(1, speedFactor * 2); // scaleX skew
      const tiltY    = velY * 0.004 * Math.min(1, speedFactor * 2);
      const depthScale = 1.0 + speedFactor * 0.08; // grows slightly when moving fast

      // Click head-dip
      const clickDip = clickPulse * 0.12;

      // Wing flap based on speed
      const wingFlap = Math.sin(t * WING_FLAP_SPD) * WING_FLAP_AMT * (0.5 + speedFactor * 0.8);

      // Overall scale modulation (subtle depth breathing)
      const breathScale = 1.0 + Math.sin(idleTime * 1.1) * 0.012;

      // Brightness adjustment for theme
      const themeBrightness = isDark() ? '1.0' : '1.06';

      ctx.save();
      ctx.translate(headX, headY);
      ctx.rotate(headAngle + clickDip);

      // Perspective distortion matrix 3D
      const m = new DOMMatrix();
      m.a = (1 + tiltX) * depthScale * breathScale;
      m.b = tiltY * 0.3;
      m.c = -tiltY * 0.1;
      m.d = (1 - Math.abs(tiltX) * 0.3) * depthScale * breathScale;
      ctx.transform(m.a, m.b, m.c, m.d, 0, 0);

      // Wing flap as skew
      ctx.transform(1, 0, Math.sin(wingFlap) * 0.05, 1, 0, 0);

      ctx.filter = `brightness(${themeBrightness})`;
      ctx.globalAlpha = 1.0;

      // Offset so the dragon head/mouth is at the cursor hotspot
      const offsetX = -(DRAGON_W / 2);
      const offsetY = -(DRAGON_H * 0.10); // head ~10% from top of image

      // Use 'screen' composite to strip the pure-black background pixels
      // Screen makes black (0,0,0) invisible while preserving colored pixels
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(img, offsetX, offsetY, DRAGON_W, DRAGON_H);

      // Reset composite
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;

      if (hoverFactor > 0.05) {
        ctx.globalAlpha = hoverFactor * 0.3;
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#87b652';
        ctx.strokeStyle = '#87b65244';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, DRAGON_W * 0.3, DRAGON_W * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.body.style.cursor = '';
      const st = document.getElementById('dragon-cursor-style');
      if (st) st.remove();
    };
  }, []);

  return (
    <>
      {/* Overlay canvas — full viewport, above everything, no pointer events */}
      <canvas
        ref={canvasRef}
        id="dragon-canvas-cursor"
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
    </>
  );
};

export default DragonCursor;
