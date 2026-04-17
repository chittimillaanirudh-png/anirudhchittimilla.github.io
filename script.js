// ─── NAVIGATION TYPE DETECTION ──────────────────────────────
// Detects: first visit, reload, or internal navigation
//
// Show LOADING when:
//   (a) First-ever visit (wasVisited = false), OR
//   (b) Page reload (isReload = true)
//
// Show BLINK when:
//   Internal navigation (wasVisited = true AND NOT a reload)

(function () {
    var navEntries = performance.getEntriesByType("navigation");
    var navType = navEntries.length > 0 ? navEntries[0].type : null;

    if (!navType) {
        if (typeof performance !== "undefined" && performance.navigation) {
            navType = performance.navigation.type === 1 ? "reload" : "navigate";
        } else {
            navType = "navigate";
        }
    }

    var isReload = navType === "reload";
    var wasVisited = sessionStorage.getItem("ac_visited") === "true";
    sessionStorage.setItem("ac_visited", "true");

    var showLoading = (!wasVisited) || isReload;
    var showBlink = wasVisited && !isReload;

    window.__AC_SHOW_LOADING = showLoading;
    window.__AC_SHOW_BLINK = showBlink;
})();

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary-dim": "#ee7d6e",
                "outline-variant": "#484848",
                "on-secondary-container": "#b1de83",
                "surface-container-lowest": "#000000",
                "inverse-on-surface": "#555555",
                "secondary-fixed": "#c0ee91",
                "surface-tint": "#ff8e7f",
                "on-error-container": "#ffb2b9",
                "tertiary-fixed-dim": "#e49a71",
                "surface-container-highest": "#262626",
                "on-surface-variant": "#acabaa",
                "error-container": "#a70138",
                "on-secondary-fixed-variant": "#3e6418",
                "surface": "#0e0e0e",
                "secondary": "#c0ee91",
                "primary-fixed": "#ff8a7a",
                "secondary-dim": "#b2df85",
                "background": "#0e0e0e",
                "on-tertiary-fixed-variant": "#653211",
                "surface-container-high": "#1f2020",
                "surface-container-low": "#131313",
                "secondary-container": "#2c5003",
                "on-tertiary-container": "#5a2909",
                "surface-variant": "#262626",
                "inverse-primary": "#9f4135",
                "on-primary-container": "#4d0402",
                "primary-container": "#f28070",
                "inverse-surface": "#fcf9f8",
                "primary": "#ff8e7f",
                "primary-fixed-dim": "#ee7d6e",
                "on-secondary": "#35590e",
                "on-surface": "#ffffff",
                "error": "#ff6e84",
                "error-dim": "#d73357",
                "on-primary-fixed-variant": "#671710",
                "tertiary-dim": "#e49a71",
                "surface-bright": "#2c2c2c",
                "on-tertiary": "#653212",
                "on-primary-fixed": "#2c0000",
                "on-primary": "#5e100a",
                "on-secondary-fixed": "#254600",
                "surface-dim": "#0e0e0e",
                "on-tertiary-fixed": "#3b1500",
                "surface-container": "#191a1a",
                "tertiary-fixed": "#f3a77d",
                "on-error": "#490013",
                "tertiary": "#ffb68e",
                "on-background": "#ffffff",
                "outline": "#767575",
                "secondary-fixed-dim": "#b2df85",
                "tertiary-container": "#f3a77d"
            },
            fontFamily: {
                "headline": ["Plus Jakarta Sans"],
                "body": ["Manrope"],
                "label": ["Manrope"]
            },
            borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
        },
    },
};

// ─── LIVE TIME COMPONENT ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    function updateTime() {
        const timeEl = document.getElementById("live-time");
        const dateEl = document.getElementById("live-date");
        if (!timeEl || !dateEl) return;

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeEl.textContent = `${hours}:${minutes} ${ampm}`;
        dateEl.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    }
    updateTime();
    setInterval(updateTime, 1000);
});

// ─── DARK TORCH BLOB TRANSITION ─────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

    let isTransitioning = false;

    const html = `
    <div id="torch-transition">
        <div class="blob left"></div>
        <div class="blob right"></div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
    const transition = document.getElementById("torch-transition");

    // ── BLINK: Internal navigation arrival ──
    // The user explicitly requested to REMOVE the second blink on arrival so it only blinks ONCE when clicking the link, and immediately shows the target page after load.
    if (window.__AC_SHOW_BLINK) {
        // Do nothing on arrival to prevent the double animation.
    }

    // ── Outbound navigation click → blink transition ──
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", e => {
            if (isTransitioning) return;
            if (
                link.hostname === window.location.hostname &&
                !link.hash &&
                link.target !== "_blank" &&
                !link.href.startsWith("mailto:") &&
                !link.href.startsWith("tel:")
            ) {
                e.preventDefault();
                isTransitioning = true;
                transition.classList.add("active");
                // Slightly longer exit (1100 ms was 1000 ms) — smoother handoff
                setTimeout(() => {
                    window.location.href = link.href;
                }, 1100);
            }
        });
    });
});

// ─── LOADING SCREEN LOGIC ────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) return;

    if (!window.__AC_SHOW_LOADING) {
        // Internal navigation: hide instantly — no flicker
        loadingScreen.style.transition = "none";
        loadingScreen.style.opacity = "0";
        loadingScreen.style.visibility = "hidden";
        loadingScreen.style.display = "none";
    }
    // First visit / reload: CSS keyframes on #loading-screen handle fade-out naturally.
    // The CSS animation duration is extended in style.css for a smoother feel.
});

// ─── ADVANCED CURSOR ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) return;

    if (!document.querySelector('.cursor')) {
        const cursorEl = document.createElement('div');
        cursorEl.className = 'cursor';
        const followerEl = document.createElement('div');
        followerEl.className = 'cursor-follower';
        document.body.appendChild(cursorEl);
        document.body.appendChild(followerEl);
    }

    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    document.body.classList.add('custom-cursor-active');

    let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    (function animateFollower() {
        followerX += (mouseX - followerX) * 0.35;
        followerY += (mouseY - followerY) * 0.35;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    })();

    document.querySelectorAll('a, button, .social-link, .skill-card, .btn-primary, .btn-outline, input, textarea, .card, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => { 
            cursor.classList.add('hover'); 
            follower.classList.add('hover');
            window.__AC_CURSOR_HOVERING_ELEMENT = true;
        });
        el.addEventListener('mouseleave', () => { 
            cursor.classList.remove('hover'); 
            follower.classList.remove('hover');
            window.__AC_CURSOR_HOVERING_ELEMENT = false;
        });
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
});

// ─── SCROLL & HOVER ANIMATIONS ───────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Floating elements — mouse parallax
    const floatingElements = document.querySelectorAll('.float-element');
    if (floatingElements.length > 0) {
        document.addEventListener('mousemove', e => {
            const xPercent = (e.clientX / window.innerWidth) - 0.5;
            const yPercent = (e.clientY / window.innerHeight) - 0.5;
            floatingElements.forEach(el => {
                const depth = parseFloat(el.getAttribute('data-depth')) || 20;
                el.style.transform = `translate(${xPercent * depth}px, ${yPercent * depth}px)`;
            });
        });
    }

    // Intersection Observer — slide-in
    const animElements = document.querySelectorAll('[data-animation]');
    if (animElements.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = entry.target.dataset.animation || 'slide-in-left 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        animElements.forEach(el => observer.observe(el));
    }

    // Parallax scroll
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(el => {
                const yPos = window.pageYOffset * (parseFloat(el.dataset.parallax) || 0.5);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Hover tilt — desktop only
    const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice) {
        document.querySelectorAll('.card, .project-item, .skill-card').forEach(card => {
            card.style.willChange = 'transform, box-shadow';
            card.style.transition = 'box-shadow 0.4s ease-out';

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease-out, box-shadow 0.4s ease-out';
                card.style.boxShadow = '0 10px 30px rgba(255, 142, 127, 0.15), 0 0 15px rgba(255, 142, 127, 0.05)';
            });

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const rotateX = ((e.clientY - rect.top) - rect.height / 2) / -10;
                const rotateY = ((rect.width / 2) - (e.clientX - rect.left)) / -10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease-out';
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });
    }

    // Viewport zoom reveal
    const zoomElements = document.querySelectorAll('.card, .project-item, .skill-card');
    if (zoomElements.length > 0) {
        zoomElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'scale(0.95)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.willChange = 'opacity, transform';
        });

        const zoomObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                    setTimeout(() => {
                        entry.target.style.transition = 'box-shadow 0.4s ease-out';
                        entry.target.style.willChange = 'auto';
                    }, 600);
                    zoomObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        zoomElements.forEach(el => zoomObserver.observe(el));
    }
});

// ─── ADVANCED INTERACTIVE PARTICLE BACKGROUND ─────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particle-bg");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height, centerX, centerY;
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centerX = width / 2;
        centerY = height / 2;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let particles = [];
    const colors = ["#87b652", "#df6b5d"];
    let mouse = { x: null, y: null, active: false, radius: 250 }; // increased react radius
    let ripple = { active: false, x: 0, y: 0, radius: 0, maxRadius: 0, speed: 12 };

    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener("mouseleave", () => mouse.active = false);

    window.addEventListener("click", e => {
        ripple.x = e.clientX;
        ripple.y = e.clientY;
        ripple.radius = 0;
        ripple.maxRadius = Math.max(width, height) * 1.5;
        ripple.active = true;
    });

    class Particle {
        constructor(type) {
            this.type = type; // 0 = outer ring, 1 = inner ring, 2 = background
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            if (this.type === 0) {
                this.baseRadius = 250 + (Math.random() * 60 - 30);
                this.angle = Math.random() * Math.PI * 2;
                this.speed = (Math.random() * 0.002 + 0.003); 
                // Much smaller size, like dots
                this.baseSize = Math.random() * 0.8 + 0.4;
            } else if (this.type === 1) {
                this.baseRadius = 150 + (Math.random() * 40 - 20);
                this.angle = Math.random() * Math.PI * 2;
                this.speed = -(Math.random() * 0.0015 + 0.002);
                this.baseSize = Math.random() * 0.6 + 0.3;
            } else {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                // Faster random movement
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.baseSize = Math.random() * 0.8 + 0.3;
            }

            this.currentX = 0;
            this.currentY = 0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.glow = 0;
            // Always visibly colored, but flat/dim
            this.opacity = 0.6; 
        }

        update() {
            // Apply spring damping to offset
            this.offsetX += (0 - this.offsetX) * 0.1;
            this.offsetY += (0 - this.offsetY) * 0.1;
            
            // Base movement
            if (this.type === 0 || this.type === 1) {
                this.angle += this.speed;
                const scale = width < 768 ? 0.6 : 1;
                this.x = centerX + Math.cos(this.angle) * (this.baseRadius * scale);
                this.y = centerY + Math.sin(this.angle) * (this.baseRadius * scale);
            } else {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            this.currentX = this.x + this.offsetX;
            this.currentY = this.y + this.offsetY;

            let targetOpacity = 0.4; // Slightly dimmer base so the hover glow pops out way more
            let targetGlow = 0;

            // Hover Interaction
            if (mouse.active && mouse.x !== null && !window.__AC_CURSOR_HOVERING_ELEMENT) {
                const dx = this.currentX - mouse.x;
                const dy = this.currentY - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Increased repulsion speed and distance
                    this.offsetX += (dx / dist) * force * 15;
                    this.offsetY += (dy / dist) * force * 15;
                    targetOpacity = 1;
                    targetGlow = 20; // Concentrated, punchy neon glow that won't wash out
                }
            }

            // Ripple Interaction
            if (ripple.active) {
                const dx = this.currentX - ripple.x;
                const dy = this.currentY - ripple.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // If particle is near the expanding ripple rim
                const distanceToRim = Math.abs(dist - ripple.radius);
                if (distanceToRim < 30) {
                    const force = 1 - (distanceToRim / 30);
                    this.offsetX += (dx / dist) * force * 12;
                    this.offsetY += (dy / dist) * force * 12;
                    targetOpacity = 1;
                    targetGlow = 25;
                }
            }

            // Smoothly transition opacity and glow
            this.opacity += (targetOpacity - this.opacity) * 0.1;
            this.glow += (targetGlow - this.glow) * 0.1;
            
            // CRITICAL PERFORMANCE FIX: explicitly snap glow to 0. 
            // Avoids computing sub-pixel shadow blur for thousands of dots every frame.
            if (this.glow < 0.5) this.glow = 0;      
        }

        draw() {
            ctx.beginPath();
            
            // Only apply heavy shadow operations if the particle is actually glowing
            if (this.glow > 0) {
                ctx.shadowBlur = this.glow;
                ctx.shadowColor = this.color;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
            
            // Draw particle with constant physical size, purely increasing its intense visual color/glow
            ctx.arc(this.currentX, this.currentY, this.baseSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset for safety
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    }

    function init() {
        particles = [];
        const isMobile = window.innerWidth < 768;
        // High density count optimized up to a stable limit
        const countMultiplier = isMobile ? 0.35 : 1;
        
        for (let i = 0; i < Math.floor(650 * countMultiplier); i++) particles.push(new Particle(0));
        for (let i = 0; i < Math.floor(450 * countMultiplier); i++) particles.push(new Particle(1));
        for (let i = 0; i < Math.floor(1000 * countMultiplier); i++) particles.push(new Particle(2));
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (ripple.active) {
            ripple.radius += ripple.speed;
            if (ripple.radius > ripple.maxRadius) {
                ripple.active = false;
            }
        }

        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    
    init();
    animate();
});

// ─── LOADING SCREEN PARTICLES (TEXT REACTION) ─────────────────
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("loading-particles");
    if (!canvas) return;

    if (!window.__AC_SHOW_LOADING) {
        canvas.style.display = "none";
        return;
    }

    const ctx = canvas.getContext("2d");

    let width, height, centerX, centerY;
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        centerX = width / 2;
        centerY = height / 2;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let particles = [];
    const colors = ["#87b652", "#df6b5d"];
    let mouse = { x: null, y: null, active: false, radius: 250 };
    let ripple = { active: false, x: 0, y: 0, radius: 0, maxRadius: 0, speed: 12 };

    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener("mouseleave", () => mouse.active = false);

    window.addEventListener("click", e => {
        ripple.x = e.clientX;
        ripple.y = e.clientY;
        ripple.radius = 0;
        ripple.maxRadius = Math.max(width, height) * 1.5;
        ripple.active = true;
    });

    class Particle {
        constructor(type) {
            this.type = type;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            if (this.type === 0) {
                this.baseRadius = 250 + (Math.random() * 60 - 30);
                this.angle = Math.random() * Math.PI * 2;
                this.speed = (Math.random() * 0.002 + 0.003); 
                this.baseSize = Math.random() * 0.8 + 0.5; // Slightly larger bases to catch glow
            } else if (this.type === 1) {
                this.baseRadius = 150 + (Math.random() * 40 - 20);
                this.angle = Math.random() * Math.PI * 2;
                this.speed = -(Math.random() * 0.0015 + 0.002);
                this.baseSize = Math.random() * 0.6 + 0.4;
            } else {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.baseSize = Math.random() * 0.8 + 0.4;
            }

            this.currentX = 0;
            this.currentY = 0;
            this.offsetX = 0;
            this.offsetY = 0;
            this.glow = 0;
            this.opacity = 0.6; 
        }

        update() {
            this.offsetX += (0 - this.offsetX) * 0.1;
            this.offsetY += (0 - this.offsetY) * 0.1;
            
            if (this.type === 0 || this.type === 1) {
                this.angle += this.speed;
                const scale = width < 768 ? 0.6 : 1;
                this.x = centerX + Math.cos(this.angle) * (this.baseRadius * scale);
                this.y = centerY + Math.sin(this.angle) * (this.baseRadius * scale);
            } else {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            this.currentX = this.x + this.offsetX;
            this.currentY = this.y + this.offsetY;

            let targetOpacity = 0.4; // Slightly dimmer base so the hover glow pops out way more
            let targetGlow = 0;

            if (mouse.active && mouse.x !== null && !window.__AC_CURSOR_HOVERING_ELEMENT) {
                const dx = this.currentX - mouse.x;
                const dy = this.currentY - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.offsetX += (dx / dist) * force * 15;
                    this.offsetY += (dy / dist) * force * 15;
                    targetOpacity = 1;
                    targetGlow = 20; // Concentrated, punchy neon glow that won't wash out
                }
            }

            if (ripple.active) {
                const dx = this.currentX - ripple.x;
                const dy = this.currentY - ripple.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                const distanceToRim = Math.abs(dist - ripple.radius);
                if (distanceToRim < 30) {
                    const force = 1 - (distanceToRim / 30);
                    this.offsetX += (dx / dist) * force * 12;
                    this.offsetY += (dy / dist) * force * 12;
                    targetOpacity = 1;
                    targetGlow = 20;
                }
            }

            this.opacity += (targetOpacity - this.opacity) * 0.1;
            this.glow += (targetGlow - this.glow) * 0.1;
            
            // CRITICAL PERFORMANCE FIX: explicitly snap glow to 0. 
            if (this.glow < 0.5) this.glow = 0;      
        }

        draw() {
            ctx.beginPath();
            
            // Only apply heavy shadow operations if the particle is actually glowing
            if (this.glow > 0) {
                ctx.shadowBlur = this.glow;
                ctx.shadowColor = this.color;
            } else {
                ctx.shadowBlur = 0;
            }
            
            ctx.fillStyle = this.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
            
            // Draw particle with constant physical size, using intense glow for the visual pop
            ctx.arc(this.currentX, this.currentY, this.baseSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset for safety
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    }

    function init() {
        particles = [];
        const isMobile = window.innerWidth < 768;
        const countMultiplier = isMobile ? 0.3 : 1;
        
        for (let i = 0; i < Math.floor(350 * countMultiplier); i++) particles.push(new Particle(0));
        for (let i = 0; i < Math.floor(200 * countMultiplier); i++) particles.push(new Particle(1));
        for (let i = 0; i < Math.floor(700 * countMultiplier); i++) particles.push(new Particle(2));
    }

    let animId;
    function animate() {
        ctx.clearRect(0, 0, width, height);

        if (ripple.active) {
            ripple.radius += ripple.speed;
            if (ripple.radius > ripple.maxRadius) {
                ripple.active = false;
            }
        }

        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animate);
    }
    
    init();
    animate();

    // PERFORMANCE FIX: stop the animation after the loading screen completes
    // The loading screen CSS animation duration is 4s fading + 1.2s delay etc.
    setTimeout(() => {
        cancelAnimationFrame(animId);
        particles = []; // free memory
        ctx.clearRect(0, 0, width, height);
    }, 5500); 
});

// ─── MOBILE MENU ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("mobile-menu");
    const backdrop = document.getElementById("menu-backdrop");
    if (!btn || !menu || !backdrop) return;

    let isOpen = false;

    function openMenu() {
        menu.classList.remove("translate-x-full");
        menu.classList.add("translate-x-0");
        backdrop.classList.remove("pointer-events-none");
        backdrop.classList.add("opacity-100");
        isOpen = true;
    }
    function closeMenu() {
        menu.classList.add("translate-x-full");
        menu.classList.remove("translate-x-0");
        backdrop.classList.add("pointer-events-none");
        backdrop.classList.remove("opacity-100");
        document.body.style.overflow = "";
        isOpen = false;
    }

    btn.addEventListener("click", () => isOpen ? closeMenu() : openMenu());
    backdrop.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
});

// ─── ACTIVE NAV LINK ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop();
    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.remove("text-[#acabaa]");
            link.classList.add("text-[#ff8a7a]", "border-b", "border-[#ff8a7a]", "pb-1");
        }
    });
});

// ─── PROJECTS PAGE: MOBILE SCROLL FREEZE FIX ─────────────────
document.addEventListener("DOMContentLoaded", () => {
    const isProjectsPage =
        window.location.pathname.includes("projects") ||
        window.location.href.includes("projects.html");

    if (!isProjectsPage) return;

    const isMobile =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768;

    if (!isMobile) return;

    document.querySelectorAll("*").forEach(el => {
        const style = window.getComputedStyle(el);
        const animName = style.animationName || "";
        if (animName && animName !== "none" && animName.toLowerCase().includes("pulse")) {
            el.style.animation = "none";
            el.style.willChange = "auto";
            el.style.transform = "none";
        }
    });

    [
        '.animate-\\[pulse_8s_infinite\\]',
        '.animate-\\[pulse_12s_infinite\\]',
        '.animate-pulse'
    ].forEach(selector => {
        try {
            document.querySelectorAll(selector).forEach(el => {
                el.style.animation = "none";
                el.style.willChange = "auto";
                el.style.transform = "none";
            });
        } catch (_) { }
    });

    document.querySelectorAll(".aspect-video img").forEach(img => {
        img.style.transform = "none";
        img.style.willChange = "auto";
        img.style.transition = "opacity 0.7s ease, filter 0.7s ease";
    });

    document.querySelectorAll(".aspect-video").forEach(el => {
        el.style.transform = "none";
        el.style.willChange = "auto";
        el.style.isolation = "auto";
    });

    document.querySelectorAll("section").forEach(section => {
        const cs = window.getComputedStyle(section);
        if (cs.overflow === "hidden" || cs.overflowY === "hidden") {
            section.style.overflow = "visible";
            section.style.overflowX = "visible";
        }
    });

    document.querySelectorAll(".card, .project-item").forEach(el => {
        el.style.transform = "none";
        el.style.willChange = "auto";
        el.style.perspective = "none";
        el.style.backfaceVisibility = "visible";
    });

    const projectsMain = document.querySelector("main");
    if (projectsMain) {
        projectsMain.querySelectorAll("*").forEach(el => {
            if (window.getComputedStyle(el).willChange !== "auto") {
                el.style.willChange = "auto";
            }
        });
        projectsMain.style.overflow = "visible";
    }

    const fixedExempt = new Set([
        document.querySelector("nav"),
        document.getElementById("mobile-menu"),
        document.getElementById("menu-backdrop"),
        document.querySelector(".fixed.top-28")
    ]);

    document.querySelectorAll('[class*="backdrop-blur"]').forEach(el => {
        if (!fixedExempt.has(el)) {
            el.style.webkitBackdropFilter = "none";
            el.style.backdropFilter = "none";
        }
    });

    document.body.style.webkitOverflowScrolling = "touch";
    document.documentElement.style.webkitOverflowScrolling = "touch";
});
