/**
 * slider.js — Swiper.js instances for galleries and work grids
 * Initializes after DOM is ready; safe to call multiple times (destroy first).
 */

let swiperInstances = [];

export function initSliders() {
    // Destroy any existing instances cleanly
    swiperInstances.forEach(sw => {
        try { sw.destroy(true, true); } catch(e) {}
    });
    swiperInstances = [];

    // Guard: Swiper must be loaded
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper.js not loaded — sliders skipped.');
        return;
    }

    // ── Project gallery slider ─────────────────────────────────
    const galleryEl = document.querySelector('.swiper-project');
    if (galleryEl) {
        const gallerySwiper = new Swiper('.swiper-project', {
            slidesPerView: 'auto',
            spaceBetween: 12,
            grabCursor: true,
            keyboard: { enabled: true },
            freeMode: {
                enabled: true,
                momentum: true,
                momentumRatio: 0.8,
            },
            a11y: {
                enabled: true,
                prevSlideMessage: 'Previous image',
                nextSlideMessage: 'Next image',
            },
            breakpoints: {
                768: {
                    spaceBetween: 20,
                },
                1024: {
                    spaceBetween: 24,
                }
            }
        });
        swiperInstances.push(gallerySwiper);
    }

    // ── Work archive grid — horizontal scroll on mobile ────────
    const workSwiperEl = document.querySelector('.swiper-work-mobile');
    if (workSwiperEl && window.innerWidth < 768) {
        const workSwiper = new Swiper('.swiper-work-mobile', {
            slidesPerView: 1.15,
            spaceBetween: 12,
            grabCursor: true,
            touchRatio: 1.5,
            a11y: { enabled: true },
        });
        swiperInstances.push(workSwiper);
    }
}

// Export for re-use from transitions.js
export { swiperInstances };
