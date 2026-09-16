/**
 * navigation.js — Nav scroll behavior, mobile menu, active links
 */

export function initNavigation() {
    const nav         = document.querySelector('.nav');
    const menuBtn     = document.querySelector('.nav__menu-btn');
    const mobileNav   = document.querySelector('.nav__mobile');
    const mobileLinks = document.querySelectorAll('.nav__mobile-link');
    const navLinks    = document.querySelectorAll('.nav__link');

    if (!nav) return;

    // ── Scroll behavior ──────────────────────────────────────
    let lastScroll = 0;

    function onScroll() {
        const scrollY = window.scrollY;

        // Add scrolled class for blur/bg effect
        if (scrollY > 60) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }

        // Hide nav on scroll down, show on scroll up (optional subtle effect)
        if (scrollY > lastScroll && scrollY > 200) {
            nav.style.transform = 'translateY(-120%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = scrollY;
    }

    // Throttle scroll listener
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                onScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Add transition to nav for smooth hide/show
    nav.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.4s ease, backdrop-filter 0.4s ease, padding 0.4s ease';

    // ── Mobile menu ──────────────────────────────────────────
    let menuOpen = false;

    function openMenu() {
        menuOpen = true;
        menuBtn.classList.add('is-open');
        mobileNav.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.setAttribute('aria-label', 'Close menu');
    }

    function closeMenu() {
        menuOpen = false;
        menuBtn.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
    }

    function toggleMenu() {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
        menuBtn.setAttribute('aria-controls', 'mobileNav');
    }

    // Close on mobile link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    // ── Active link detection ─────────────────────────────────
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Normalize paths for comparison
        const linkPath = href.replace(/^\.\//, '/').replace(/^\//, '');
        const pagePath = currentPath.split('/').pop() || 'index.html';

        if (
            pagePath === linkPath ||
            (pagePath === '' && linkPath === 'index.html') ||
            (currentPath.includes('/work/') && linkPath === 'work.html')
        ) {
            link.classList.add('is-active');
        }
    });

    // ── Smooth anchor scroll ──────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            closeMenu();

            if (window.lenis) {
                window.lenis.scrollTo(target);
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Back to top ───────────────────────────────────────────
    const topBtn = document.querySelector('.footer__top-btn');
    if (topBtn) {
        topBtn.addEventListener('click', () => {
            if (window.lenis) {
                window.lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}
