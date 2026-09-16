/**
 * main.js — Entry point. Orchestrates all init functions.
 * Handles preloader, Lenis smooth scroll, and global setup.
 *
 * Module type: ES module (loaded with type="module" in HTML)
 */

import { initCursor }          from './cursor.js';
import { initNavigation }      from './navigation.js';
import { initGSAPAnimations }  from './animations.js';
import { initSliders }         from './slider.js';
import { initBarba }           from './transitions.js';

// ── Preloader ────────────────────────────────────────────────
function initPreloader() {
    const preloader   = document.getElementById('preloader');
    const preloaderBar= document.querySelector('.preloader__bar');
    const preloaderNum= document.querySelector('.preloader__num');

    if (!preloader) return Promise.resolve();

    // Skip preloader on reloads/subsequent page visits in the same session
    if (sessionStorage.getItem('portfolio_preloader_seen')) {
        preloader.style.display = 'none';
        return Promise.resolve();
    }
    sessionStorage.setItem('portfolio_preloader_seen', 'true');

    return new Promise(resolve => {
        let progress  = 0;
        const duration= 400; // ms
        const start   = performance.now();
        let finished  = false;

        const finishPreloader = () => {
            if (finished) return;
            finished = true;
            if (typeof gsap !== 'undefined') {
                gsap.to(preloader, {
                    opacity: 0,
                    y: '-6%',
                    duration: 0.35,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        resolve();
                    }
                });
            } else {
                preloader.style.display = 'none';
                resolve();
            }
        };

        // Guaranteed safety timeout so preloader NEVER blocks page
        setTimeout(finishPreloader, 750);

        function update(now) {
            if (finished) return;
            const elapsed = now - start;
            progress = Math.min((elapsed / duration) * 100, 100);

            if (preloaderBar) preloaderBar.style.width = progress + '%';
            if (preloaderNum) preloaderNum.textContent = Math.floor(progress);

            if (progress < 100) {
                requestAnimationFrame(update);
            } else {
                setTimeout(finishPreloader, 50);
            }
        }

        requestAnimationFrame(update);
    });
}

// ── Lenis smooth scroll ──────────────────────────────────────
let lenis; // global ref for Barba scroll reset

function initLenis() {
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis not loaded — using native scroll.');
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
    });

    // Integrate Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        // Use standard GSAP lag smoothing (500ms threshold, 33ms target) for smooth frame recovery
        gsap.ticker.lagSmoothing(500, 33);
    } else {
        // Standalone RAF loop
        function rafLoop(time) {
            lenis.raf(time);
            requestAnimationFrame(rafLoop);
        }
        requestAnimationFrame(rafLoop);
    }

    // Expose globally for Barba transitions to reset scroll position
    window.lenis = lenis;
}

// ── Work page filter ─────────────────────────────────────────
export function initWorkFilter() {
    const filterBtns = document.querySelectorAll('.work-filter__btn');
    const workItems  = document.querySelectorAll('.work-item');

    if (!filterBtns.length || !workItems.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            // Filter items
            workItems.forEach(item => {
                const categories = item.dataset.categories || '';
                const show = filter === 'all' || categories.includes(filter);

                if (typeof gsap !== 'undefined') {
                    gsap.to(item, {
                        opacity: show ? 1 : 0,
                        scale: show ? 1 : 0.97,
                        duration: 0.35,
                        ease: 'power2.out',
                        pointerEvents: show ? 'auto' : 'none',
                    });
                } else {
                    item.style.opacity = show ? '1' : '0';
                    item.style.pointerEvents = show ? 'auto' : 'none';
                }
            });
        });
    });
}

// ── Lazy image loading ───────────────────────────────────────
function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported — browser handles it
        return;
    }

    // IntersectionObserver fallback
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        lazyImages.forEach(img => observer.observe(img));
    }
}

// ── Image error fallback ─────────────────────────────────────
function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (this.dataset.triedFallback) return;
            this.dataset.triedFallback = 'true';

            // Prefix depending on folder level
            const isSubfolder = window.location.pathname.includes('/work/') || document.querySelector('base');
            const prefix = isSubfolder ? '../' : '';

            if (this.classList.contains('hero__image')) {
                this.src = `${prefix}assets/tarun.png`;
            } else if (this.closest('[data-project="kora-apparel"]') || this.alt.includes('Kora')) {
                this.src = `${prefix}assets/Ref/Creatives/fashion-admission-open.png`;
            } else if (this.closest('[data-project="apparel-graphics"]') || this.alt.includes('Apparel')) {
                this.src = `${prefix}assets/Ref/Creatives/17Vibes-Poster.png`;
            } else if (this.closest('[data-project="brand-identity"]') || this.alt.includes('Brand') || this.alt.includes('Oud')) {
                this.src = `${prefix}assets/Ref/Creatives/perfume%20brand.png`;
            } else if (this.closest('[data-project="digital-campaign"]') || this.alt.includes('Digital')) {
                this.src = `${prefix}assets/Ref/Creatives/post-1.png`;
            } else if (this.closest('[data-project="web-development"]') || this.alt.includes('Web')) {
                this.src = `${prefix}assets/web01.png`;
            }
        });
    });
}

// ── Copy email button ─────────────────────────────────────────
function initCopyEmail() {
    const copyBtn = document.getElementById('copyEmailBtn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const email = 'tarunverma8860@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            const span = copyBtn.querySelector('span') || copyBtn;
            const original = span.textContent;
            span.textContent = 'Copied!';
            setTimeout(() => { span.textContent = original; }, 2000);
        }).catch(() => {
            // Fallback — open mail client
            window.location.href = `mailto:${email}`;
        });
    });
}

// ── Live Timezone Clock ──────────────────────────────────────
function initLiveTime() {
    const el = document.getElementById('liveTime');
    if (!el) return;
    function update() {
        const now = new Date();
        const istOptions = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        try {
            const timeStr = now.toLocaleTimeString('en-GB', istOptions);
            el.textContent = `NOIDA, IN · ${timeStr} IST`;
        } catch (e) {
            const hours = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            el.textContent = `NOIDA, IN · ${hours}:${mins}:${secs} IST`;
        }
    }
    update();
    setInterval(update, 1000);
}

// ── Minimal Web Audio UI Synthesizer ─────────────────────────
let audioCtx = null;
let soundEnabled = false;

function playClickSound(freq = 600, duration = 0.04) {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + duration);
        gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

function initAudioFx() {
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundBtn.classList.toggle('is-active', soundEnabled);
            soundBtn.innerHTML = soundEnabled 
                ? '<span class="sound-icon">🔊</span> Sound: ON' 
                : '<span class="sound-icon">🔈</span> Sound';
            if (soundEnabled) playClickSound(880, 0.08);
        });
    }

    document.querySelectorAll('a, button, .project-card, .work-item').forEach(el => {
        el.addEventListener('mouseenter', () => playClickSound(480, 0.02));
        el.addEventListener('click', () => playClickSound(720, 0.04));
    });
}

// ── Showreel Video Modal ─────────────────────────────────────
function initShowreelModal() {
    const openBtn = document.getElementById('openReelBtn');
    const modal = document.getElementById('showreelModal');
    const closeBtn = document.getElementById('closeReelBtn');
    const video = document.getElementById('showreelVideo');

    if (!modal) return;

    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => {});
        }
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (video) {
            video.pause();
        }
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

// ── 3D Card Tilt & Video Performance Optimizer ───────────────
function initProjectInteractions() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const wrap = card.querySelector('.project-card__image-wrap');
        if (!wrap) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            wrap.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            wrap.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
        });
    });

    // Auto pause/play videos when out of view for 60fps performance
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const vid = entry.target;
                if (entry.isIntersecting) {
                    vid.play().catch(() => {});
                } else {
                    vid.pause();
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('video[autoplay]').forEach(v => videoObserver.observe(v));
    }
}

// ── Main boot sequence ───────────────────────────────────────
async function boot() {
    // 1. Preloader (await completion before revealing page)
    await initPreloader();

    // 2. Core setup
    initLenis();
    initCursor();
    initNavigation();
    initLazyImages();
    initImageFallbacks();
    initCopyEmail();
    initWorkFilter();
    initLiveTime();
    initAudioFx();
    initShowreelModal();
    initProjectInteractions();

    // 3. Animations (after preloader to avoid conflicts)
    initGSAPAnimations();

    // 4. Page-specific sliders
    initSliders();

    // 5. Barba page transitions (last — wraps everything)
    initBarba();
}

// Boot on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

