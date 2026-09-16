/**
 * transitions.js — Seamless page transitions & form handling
 * Smooth curtain wipes on page navigation without breaking relative paths,
 * without CORS errors on file://, and without reload freezing.
 */

export function initBarba() {
    initPageTransitions();
    initContactForm();
}

export function initPageTransitions() {
    const curtain = document.querySelector('.page-transition');

    // Reveal page smoothly on initial load and browser back/forward
    function revealPage() {
        if (!curtain) return;
        if (typeof gsap !== 'undefined') {
            gsap.set(curtain, { scaleY: 1, transformOrigin: 'top' });
            gsap.to(curtain, {
                scaleY: 0,
                duration: 0.45,
                ease: 'power4.inOut',
                delay: 0.05,
                onComplete: () => {
                    curtain.style.pointerEvents = 'none';
                }
            });
        } else {
            curtain.style.transform = 'scaleY(0)';
            curtain.style.pointerEvents = 'none';
        }
    }

    window.addEventListener('pageshow', revealPage);
    revealPage();

    // Smooth exit transition on link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Skip anchors, mailto, tel, target blank, modifiers
        if (
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            link.target === '_blank' ||
            link.hasAttribute('download') ||
            e.ctrlKey || e.metaKey || e.shiftKey
        ) {
            return;
        }

        // Skip external links
        if (link.hostname && link.hostname !== window.location.hostname) {
            return;
        }

        e.preventDefault();

        if (curtain && typeof gsap !== 'undefined') {
            curtain.style.pointerEvents = 'all';
            gsap.set(curtain, { scaleY: 0, transformOrigin: 'bottom' });
            gsap.to(curtain, {
                scaleY: 1,
                duration: 0.35,
                ease: 'power3.inOut',
                onComplete: () => {
                    window.location.href = href;
                }
            });
            // Safety timeout
            setTimeout(() => {
                window.location.href = href;
            }, 450);
        } else {
            window.location.href = href;
        }
    });
}

function initWorkPage() {
    initWorkFilter();
}

function initAboutPage() {}

function initProjectPage() {
    initSliders();
}

function initContactPage() {
    initContactForm();
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('tarunverma8860@gmail.com').then(() => {
                const original = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = original; }, 2000);
            }).catch(() => {
                // Fallback: select text
            });
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Form submission logic goes here
        // Integrate with Formspree, EmailJS, or similar
        const submitBtn = form.querySelector('.form-submit');
        if (submitBtn) {
            submitBtn.textContent = 'Message Sent ✓';
            submitBtn.style.background = 'var(--color-accent)';
            setTimeout(() => {
                submitBtn.textContent = 'Send Message →';
                submitBtn.style.background = '';
                form.reset();
            }, 3000);
        }
    });
}
