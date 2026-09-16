/**
 * animations.js — GSAP + ScrollTrigger + SplitType animations
 * Hero reveal, scroll-triggered reveals, parallax, magnetic buttons, counters
 */

let gsapCtx; // GSAP context for clean cleanup

export function initGSAPAnimations() {
    // Guard: GSAP must be loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded — animations skipped, revealing content.');
        revealFallback();
        return;
    }

    // Clean up previous GSAP context (important for Barba transitions)
    if (gsapCtx) {
        gsapCtx.revert();
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        revealFallback();
        return;
    }

    // Create scoped GSAP context
    gsapCtx = gsap.context(() => {

        // ── Register ScrollTrigger ─────────────────────────────
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // ── Hero reveal sequence ───────────────────────────────
        const heroTitle = document.querySelectorAll('.hero__title-inner');
        const heroLabel = document.querySelector('.hero__label');
        const heroSub   = document.querySelector('.hero__subtitle');
        const heroTag   = document.querySelector('.hero__tagline');
        const heroScroll= document.querySelector('.hero__scroll');
        const heroImg   = document.querySelector('.hero__image-wrapper');

        if (heroTitle.length) {
            const heroTl = gsap.timeline({ delay: 0.2 });

            heroTl.to(heroTitle, {
                y: '0%',
                duration: 1.1,
                ease: 'power4.out',
                stagger: 0.12,
            });

            const heroSecondary = [heroLabel, heroSub, heroTag, heroScroll].filter(Boolean);
            if (heroSecondary.length) {
                heroTl.to(heroSecondary, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.08,
                }, '-=0.6');
            }

            if (heroImg) {
                heroTl.to(heroImg, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 1.0,
                    ease: 'power3.out',
                }, '-=0.9');
            }
        }

        // ── SplitType text reveals ─────────────────────────────
        if (typeof SplitType !== 'undefined') {
            const splitTargets = document.querySelectorAll('.js-split-text');

            splitTargets.forEach(el => {
                // Split text into lines
                const split = new SplitType(el, { types: 'lines,words' });

                // Wrap each line in overflow:hidden container
                split.lines.forEach(line => {
                    const wrapper = document.createElement('div');
                    wrapper.style.overflow = 'hidden';
                    line.parentNode.insertBefore(wrapper, line);
                    wrapper.appendChild(line);
                });

                if (typeof ScrollTrigger !== 'undefined') {
                    gsap.from(split.words, {
                        y: '110%',
                        opacity: 0,
                        duration: 0.9,
                        stagger: 0.04,
                        ease: 'power4.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            once: true,
                        }
                    });
                }
            });
        }

        // ── Generic scroll reveals ─────────────────────────────
        if (typeof ScrollTrigger !== 'undefined') {

            // Fade-up
            gsap.utils.toArray('.js-reveal-up').forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true,
                    }
                });
            });

            // Fade
            gsap.utils.toArray('.js-reveal-fade').forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    duration: 1.0,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        once: true,
                    }
                });
            });

            // Scale
            gsap.utils.toArray('.js-reveal-scale').forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    scale: 1,
                    duration: 1.0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true,
                    }
                });
            });

            // ── Image parallax ─────────────────────────────────
            gsap.utils.toArray('.project-card__image').forEach(img => {
                gsap.to(img, {
                    yPercent: -8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.closest('.project-card'),
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5,
                    }
                });
            });

            // Hero image subtle parallax
            const heroImgEl = document.querySelector('.hero__image');
            if (heroImgEl) {
                gsap.to(heroImgEl, {
                    yPercent: -15,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1,
                    }
                });
            }

            // ── Stats counter ──────────────────────────────────
            const statsNums = document.querySelectorAll('.stats__num-val[data-count]');
            statsNums.forEach(el => {
                const target = parseInt(el.dataset.count, 10);
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                    onEnter: () => {
                        gsap.to({ val: 0 }, {
                            val: target,
                            duration: 1.5,
                            ease: 'power2.out',
                            onUpdate: function() {
                                el.textContent = Math.round(this.targets()[0].val);
                            }
                        });
                    }
                });
            });

            // ── Intro philosophy text outline hover ────────────
            const philosophyWords = document.querySelectorAll('.intro__philosophy-word');
            if (philosophyWords.length) {
                ScrollTrigger.create({
                    trigger: '.intro__philosophy',
                    start: 'top 70%',
                    once: true,
                    onEnter: () => {
                        gsap.to(philosophyWords, {
                            webkitTextStroke: '1px rgba(255,255,255,0.2)',
                            stagger: 0.15,
                            duration: 0.8,
                            ease: 'power3.out',
                        });
                    }
                });
            }

            // ── Stagger reveal for project cards ──────────────
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, i) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 40,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        once: true,
                    }
                });
            });

            // ── Work grid items ────────────────────────────────
            const workItems = document.querySelectorAll('.work-item');
            if (workItems.length) {
                gsap.from(workItems, {
                    opacity: 0,
                    y: 30,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.work-grid',
                        start: 'top 85%',
                        once: true,
                    }
                });
            }

            // ── Timeline items ────────────────────────────────
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach((item) => {
                gsap.from(item, {
                    opacity: 0,
                    x: -20,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 88%',
                        once: true,
                    }
                });
            });

            // ── Skills list stagger ───────────────────────────
            const skillItems = document.querySelectorAll('.skills-list__item');
            if (skillItems.length) {
                gsap.from(skillItems, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    stagger: 0.04,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.skills-list',
                        start: 'top 88%',
                        once: true,
                    }
                });
            }

            // ── CTA strip heading ─────────────────────────────
            const ctaHeading = document.querySelector('.cta-strip__heading');
            if (ctaHeading && typeof SplitType !== 'undefined') {
                const split = new SplitType(ctaHeading, { types: 'lines' });
                gsap.from(split.lines, {
                    opacity: 0,
                    y: '80%',
                    duration: 1.0,
                    stagger: 0.1,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: ctaHeading,
                        start: 'top 85%',
                        once: true,
                    }
                });
            }

        } // end ScrollTrigger block

        // ── Magnetic buttons ───────────────────────────────────
        initMagneticButtons();

    }); // end gsap.context
}

// Magnetic button effect for .magnetic elements
function initMagneticButtons() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(el => {
        const inner = el.querySelector('.magnetic__inner');
        if (!inner) return;

        el.addEventListener('mousemove', (e) => {
            const rect   = el.getBoundingClientRect();
            const centerX= rect.left + rect.width / 2;
            const centerY= rect.top  + rect.height / 2;
            const distX  = e.clientX - centerX;
            const distY  = e.clientY - centerY;
            const strength = 0.35;

            gsap.to(el, {
                x: distX * strength,
                y: distY * strength,
                duration: 0.5,
                ease: 'power3.out',
            });

            gsap.to(inner, {
                x: distX * 0.12,
                y: distY * 0.12,
                duration: 0.5,
                ease: 'power3.out',
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to([el, inner], {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.6)',
            });
        });
    });
}

// Fallback: instantly reveal all animated elements (no GSAP)
function revealFallback() {
    const targets = document.querySelectorAll(
        '.js-reveal-up, .js-reveal-fade, .js-reveal-left, .js-reveal-right, .js-reveal-scale, .hero__label, .hero__subtitle, .hero__tagline, .hero__scroll, .hero__image-wrapper'
    );
    targets.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    document.querySelectorAll('.hero__title-inner').forEach(el => {
        el.style.transform = 'none';
    });
}

// Cleanup — called by Barba before page leave
export function destroyGSAPAnimations() {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(st => st.kill());
    }
    if (gsapCtx) {
        gsapCtx.revert();
        gsapCtx = null;
    }
}
