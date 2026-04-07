// ─── NAVIGATION TYPE DETECTION ──────────────────────────────
// Detects: first visit, reload, or internal navigation
// Uses sessionStorage + performance.navigation (with fallback)

(function () {
    // Determine how the user arrived at this page
    // Use the Navigation Timing API for reliable reload detection
    var navEntries = performance.getEntriesByType("navigation");
    var navType = navEntries.length > 0 ? navEntries[0].type : null;

    // Fallback to legacy API if PerformanceNavigationTiming is unavailable
    if (!navType) {
        if (performance.navigation) {
            navType = performance.navigation.type === 1 ? "reload" : "navigate";
        } else {
            navType = "navigate";
        }
    }

    var isReload = navType === "reload";
    var wasVisited = sessionStorage.getItem("ac_visited");

    // Mark session as visited (persists across navigations, clears on tab close)
    if (!wasVisited) {
        sessionStorage.setItem("ac_visited", "true");
    }

    // showLoading: true ONLY on first visit OR on any page reload
    // showBlink:   true ONLY on internal navigation (not first load, not reload)
    window.__AC_SHOW_LOADING = !wasVisited || isReload;
    window.__AC_SHOW_BLINK = !!wasVisited && !isReload;
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
        hours = hours % 12;
        hours = hours ? hours : 12;
        const timeString = `${hours}:${minutes} ${ampm}`;

        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options).toUpperCase();

        timeEl.textContent = timeString;
        dateEl.textContent = dateString;
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
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);

    const transition = document.getElementById("torch-transition");

    // If we should show the blink animation (internal navigation arrival),
    // fire it briefly on load then remove
    if (window.__AC_SHOW_BLINK) {
        transition.classList.add("active");
        setTimeout(() => {
            transition.classList.remove("active");
        }, 400);
    }

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", e => {

            if (isTransitioning) return;

            if (link.hostname === window.location.hostname && !link.hash && link.target !== "_blank") {
                const special = link.href.startsWith("mailto:") || link.href.startsWith("tel:");

                if (!special) {
                    e.preventDefault();
                    isTransitioning = true;

                    transition.classList.add("active");

                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 1000);
                }
            }

        });
    });

});

// ─── LOADING SCREEN LOGIC ────────────────────────────────────
// showLoading is true on first visit OR reload → show loading animation
// showLoading is false on internal navigation → hide loading screen immediately
document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) return;

    if (!window.__AC_SHOW_LOADING) {
        // Internal navigation: hide loading screen instantly, no animation
        loadingScreen.style.display = "none";
    }
    // First visit or reload: CSS animations on #loading-screen handle everything naturally
});

// ─── ADVANCED CURSOR ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

    const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice) {
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
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;

            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';

            requestAnimationFrame(animateFollower);
        })();

        document.querySelectorAll('a, button, .social-link, .skill-card, .btn-primary, .btn-outline, input, textarea, .card, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        });
    }

});

// ─── SCROLL & HOVER ANIMATIONS ───────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Floating Elements
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

    // Intersection Observer for Slide-in Animations
    const animElements = document.querySelectorAll('[data-animation]');
    if (animElements.length > 0) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = entry.target.dataset.animation || 'slide-in-left 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animElements.forEach(el => observer.observe(el));
    }

    // Parallax
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(el => {
                const distance = window.pageYOffset;
                const yPos = distance * (parseFloat(el.dataset.parallax) || 0.5);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Interactive Hover Lift & Smooth Zoom — desktop only
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
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / -10;
                const rotateY = (centerX - x) / -10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease-out';
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });
    }

    // Intersection Observer for Smooth Viewport Zoom Reveal
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

// ─── BACKGROUND STAR PARTICLES ─────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("particle-bg");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let particles = [];
    const numParticles = window.innerWidth < 768 ? 40 : 120;

    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.size = Math.random() * 1.5 + 0.5;
            this.baseSize = this.size;

            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;

            this.color = Math.random() > 0.5 ? "#ff8e7f" : "#c0ee91";
            this.opacity = Math.random() * 0.4 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    this.size = this.baseSize + 1.5;
                    this.opacity = 0.9;
                } else {
                    this.size = this.baseSize;
                    this.opacity = 0.4;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
});

// ─── LOADING SCREEN PARTICLES (TEXT REACTION) ─────────────────
document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("loading-particles");
    if (!canvas) return;

    // Only show loading particles on first visit or reload
    if (!window.__AC_SHOW_LOADING) {
        canvas.style.display = "none";
        return;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const count = 140;

    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.size = Math.random() * 1.5 + 0.5;
            this.baseSize = this.size;

            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;

            this.color = Math.random() > 0.5 ? "#ff8e7f" : "#c0ee91";
            this.opacity = Math.random() * 0.25 + 0.05;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    this.size = this.baseSize + 1;
                    this.opacity = 0.6;
                } else {
                    this.size = this.baseSize;
                    this.opacity = 0.15;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
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

    btn.addEventListener("click", () => {
        if (!isOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    backdrop.addEventListener("click", closeMenu);

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });
});

// ─── ACTIVE NAV LINK ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.remove("text-[#acabaa]");
            link.classList.add("text-[#ff8a7a]", "border-b", "border-[#ff8a7a]", "pb-1");
        }
    });
});

// ─── PROJECTS PAGE: MOBILE SCROLL FREEZE FIX ─────────────────
// The freeze is caused by:
// 1. animate-[pulse_8s_infinite] on large border elements creating
//    isolated compositing layers that block the scroll thread on mobile WebKit
// 2. The aspect-video image with scale transform inside overflow:hidden
//    triggering full-page repaints during scroll
// Fix: disable heavy animations and GPU-heavy properties on mobile, projects page only
document.addEventListener("DOMContentLoaded", () => {
    const isProjectsPage = window.location.pathname.includes("projects");
    if (!isProjectsPage) return;

    const isMobile =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768;

    if (!isMobile) return;

    // 1. Kill the pulsing animated border circles that cause compositing layer explosion
    //    These are the large rounded-full elements with animate-[pulse_*] classes
    document.querySelectorAll('[class*="animate-[pulse"]').forEach(el => {
        el.style.animation = 'none';
        el.style.willChange = 'auto';
        el.style.transform = 'none';
    });

    // Also target by Tailwind's arbitrary animate classes (they may be parsed differently)
    document.querySelectorAll('.animate-\\[pulse_8s_infinite\\], .animate-\\[pulse_12s_infinite\\]').forEach(el => {
        el.style.animation = 'none';
        el.style.willChange = 'auto';
    });

    // 2. Neutralize scale transform on the preview image inside aspect-video
    //    The `scale-110 group-hover:scale-100` combo forces a compositing layer
    //    that repaints on every scroll tick in mobile WebKit
    document.querySelectorAll('.aspect-video img').forEach(img => {
        img.style.transform = 'none';
        img.style.willChange = 'auto';
        img.style.transition = 'none';
    });

    // Also remove the group-hover scale from the parent wrapper
    document.querySelectorAll('.aspect-video').forEach(el => {
        el.style.overflow = 'hidden';
        // Remove any transform that was inherited
        el.style.transform = 'none';
        el.style.willChange = 'auto';
    });

    // 3. The placeholder section has `overflow-hidden` + absolutely positioned
    //    large orbital rings. These block touch-scroll hit testing on mobile.
    //    Change overflow to visible so touch events pass through correctly.
    document.querySelectorAll('section').forEach(section => {
        const hasOverflowHidden = section.classList.contains('overflow-hidden') ||
            window.getComputedStyle(section).overflow === 'hidden';
        if (hasOverflowHidden) {
            // Only change sections that don't need overflow-hidden for visual clipping
            // The placeholder section uses it to clip orbital rings — safe to change
            // because the rings are just decorative and pointer-events: none already
            section.style.overflow = 'visible';
        }
    });

    // 4. Flatten any remaining 3D transforms on project cards/containers
    //    that may have been set by the hover animation initializer
    document.querySelectorAll('.card, .project-item').forEach(el => {
        el.style.transform = 'none';
        el.style.willChange = 'auto';
        el.style.perspective = 'none';
    });
});
