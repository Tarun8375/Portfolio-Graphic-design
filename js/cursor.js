/**
 * cursor.js — Custom magnetic cursor (desktop only)
 * Detects touch devices and skips cursor init entirely.
 * Uses requestAnimationFrame for smooth lag follow.
 */

export function initCursor() {
    // Skip on touch devices
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.body.style.cursor = 'auto';
        return;
    }

    const cursor      = document.querySelector('.cursor');
    const cursorDot   = document.querySelector('.cursor__dot');
    const cursorCircle= document.querySelector('.cursor__circle');
    const cursorLabel = document.querySelector('.cursor__label');

    if (!cursor) return;

    let mouseX = -100, mouseY = -100;
    let dotX   = -100, dotY   = -100;
    let circleX= -100, circleY= -100;
    let hasMoved = false;
    let raf;

    cursor.style.opacity = '0';

    // Track mouse position with passive listener
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!hasMoved) {
            hasMoved = true;
            dotX = circleX = mouseX;
            dotY = circleY = mouseY;
            cursor.style.opacity = '1';
        }
    }, { passive: true });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        if (hasMoved) cursor.style.opacity = '1';
    });

    // RAF loop — dot follows instantly, circle follows smoothly and snappily
    function animateCursor() {
        if (hasMoved) {
            const dx = mouseX - dotX;
            const dy = mouseY - dotY;
            const cx = mouseX - circleX;
            const cy = mouseY - circleY;

            if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || Math.abs(cx) > 0.01 || Math.abs(cy) > 0.01) {
                dotX    += dx;
                dotY    += dy;
                circleX += cx * 0.28;
                circleY += cy * 0.28;

                cursor.style.transform    = `translate3d(${dotX}px, ${dotY}px, 0)`;
                cursorCircle.style.transform = `translate3d(${circleX - dotX}px, ${circleY - dotY}px, 0)`;
            }
        }

        raf = requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // ── Cursor state management ──────────────────────────────

    function setCursorState(state, label = '') {
        document.body.classList.remove('cursor--hover', 'cursor--project', 'cursor--drag');
        if (state) document.body.classList.add(`cursor--${state}`);
        if (cursorLabel) cursorLabel.textContent = label;
    }

    function addCursorListeners() {
        // Default hover (links, buttons)
        const hoverEls = document.querySelectorAll('a, button, [role="button"], .nav__link, .footer__top-btn, .work-filter__btn');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => setCursorState('hover'));
            el.addEventListener('mouseleave', () => setCursorState(null));
        });

        // Project hover — show "VIEW PROJECT →"
        const projectEls = document.querySelectorAll(
            '.project-card__image-wrap, .work-item, .project-card--full .project-card__image-wrap'
        );
        projectEls.forEach(el => {
            el.addEventListener('mouseenter', () => setCursorState('project', 'VIEW →'));
            el.addEventListener('mouseleave', () => setCursorState(null));
        });

        // Slider drag hint
        const sliderEls = document.querySelectorAll('.swiper-project, .swiper-work');
        sliderEls.forEach(el => {
            el.addEventListener('mouseenter', () => setCursorState('drag', 'DRAG'));
            el.addEventListener('mouseleave', () => setCursorState(null));
        });
    }

    addCursorListeners();

    // Re-run listener attachment after Barba page transitions
    window.addEventListener('cursor:reinit', addCursorListeners);

    // Cleanup on hot-reload / unmount (not strictly needed for static site)
    return function destroy() {
        cancelAnimationFrame(raf);
    };
}
