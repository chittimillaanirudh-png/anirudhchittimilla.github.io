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

// Live Time Component Logic
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
        hours = hours ? hours : 12; // the hour '0' should be '12'
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

    // Reverse on load (no double issue)
    setTimeout(() => {
        transition.classList.remove("active");
    }, 100);

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

// ─── ADVANCED CURSOR ────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

    // Detect if device supports touch — skip cursor entirely on touch devices
    const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;

    if (!isTouchDevice) {
        // Only create cursor elements on non-touch (desktop) devices
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

// ─── SCROLL & HOVER ANIMATIONS ───────────────────────────────────────────────
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

    // Interactive Hover Lift & Smooth Zoom
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
                    // Restore default hover transition after reveal completes
                    setTimeout(() => {
                        entry.target.style.transition = 'box-shadow 0.4s ease-out';
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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 120;

    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            // ⭐ SMALL STAR SIZE
            this.size = Math.random() * 1.5 + 0.5;
            this.baseSize = this.size;

            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;

            // 🎨 RANDOM BETWEEN YOUR TWO COLORS
            this.color = Math.random() > 0.5 ? "#ff8e7f" : "#c0ee91";

            this.opacity = Math.random() * 0.4 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // distance from cursor
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

        draw() {
            ctx.beginPath();

            // ⭐ glowing star effect
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

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const count = 140;

    let mouse = {
        x: null,
        y: null,
        radius: 120
    };

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

            // wrap
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // distance from text center
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

    // 🧹 REMOVE after loading ends
    const loading = document.getElementById("loading-screen");
    setTimeout(() => {
        if (canvas) canvas.style.opacity = "0";
    }, 3000);

});

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("mobile-menu");
    const backdrop = document.getElementById("menu-backdrop");
    const page = document.getElementById("page-content");
    if (!btn || !menu || !backdrop) return;

    let isOpen = false;

    btn.addEventListener("click", () => {
        if (!isOpen) {
            // OPEN
            menu.classList.remove("translate-x-full");
            menu.classList.add("translate-x-0");
            backdrop.classList.remove("pointer-events-none");
            backdrop.classList.add("opacity-100");
            page.classList.add("page-blur");
            document.body.style.overflow = "hidden"; // ✅ lock body scroll
            isOpen = true;
        } else {
            // CLOSE
            menu.classList.add("translate-x-full");
            menu.classList.remove("translate-x-0");
            backdrop.classList.add("pointer-events-none");
            backdrop.classList.remove("opacity-100");
            page.classList.remove("page-blur");
            document.body.style.overflow = ""; // ✅ restore scroll
            isOpen = false;
        }
    });

    // Click outside to close
    backdrop.addEventListener("click", () => {
        menu.classList.add("translate-x-full");
        menu.classList.remove("translate-x-0");
        backdrop.classList.add("pointer-events-none");
        backdrop.classList.remove("opacity-100");
        page.classList.remove("page-blur");
        document.body.style.overflow = ""; // ✅ restore scroll
        isOpen = false;
    });

    // Click link → close menu + allow transition
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.add("translate-x-full");
            menu.classList.remove("translate-x-0");
            backdrop.classList.add("pointer-events-none");
            backdrop.classList.remove("opacity-100");
            page.classList.remove("page-blur");
            document.body.style.overflow = ""; // ✅ restore scroll
            isOpen = false;
        });
    });
});
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