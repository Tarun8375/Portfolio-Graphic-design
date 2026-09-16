# Tarun Verma — Premium Awwwards-Style Creative Portfolio

> **DESIGN × DIGITAL × DEVELOPMENT**

A high-end, editorial, highly interactive, fully responsive personal portfolio website built for **Tarun Verma**, positioned as a **Graphic Designer + Web Developer**.

Designed with an award-winning dark aesthetic (`#0D0D0D` theme, lime `#C8FF00` accent, Clash Display + Inter typography, high-contrast layouts, smooth animations, dynamic custom magnetic cursor, and seamless Barba.js page transitions).

---

## 🚀 Key Features

* **Editorial Dark Aesthetic**: Custom dark theme with grain background texture, sharp grid lines, and high-impact typography.
* **Preloader**: Dynamic brand intro sequence (`TARUN VERMA — 01/100`) with smooth page reveal.
* **Custom Magnetic Cursor**: Interactive lag cursor with context-aware states (`VIEW PROJECT`, `DRAG`, `HOVER`) that automatically disables on touch devices.
* **Lenis Smooth Scroll**: Fluid inertia scrolling integrated with GSAP `ScrollTrigger`.
* **GSAP + SplitType Animations**: Split word reveal headers, scroll-triggered section reveals, image parallax, stats counter animation, magnetic action buttons.
* **Barba.js Page Transitions**: Cinematic full-screen curtain transition between pages with auto Lenis scroll reset and animation re-initialization.
* **Swiper.js Galleries**: Drag-to-swipe horizontal project galleries with momentum free-mode scrolling.
* **Responsive Architecture**: Fully responsive across mobile (320px+), tablet, laptop, and ultra-wide displays (4K).
* **SEO & Accessibility**: Semantic HTML5 tags (`<main>`, `<header>`, `<article>`, `<footer>`), aria attributes, focus styles, keyboard navigation support, and reduced-motion fallback.

---

## 📁 Directory Structure

```
Portfolio Website/
├── index.html                  # Home Page (Hero, Intro, Selected Work, Stats, Contact CTA)
├── work.html                   # Work Archive Page (Filterable category grid)
├── about.html                  # About Page (Editorial intro, Capabilities, Timeline, Skills)
├── contact.html                # Contact Page (Dramatic layout, Action links, Form)
├── work/
│   ├── kora-apparel.html       # Case Study: Kora Apparel Identity
│   ├── apparel-graphics.html   # Case Study: Apparel Graphic Series
│   ├── brand-identity.html     # Case Study: Modern Brand Identity Systems
│   ├── digital-campaign.html   # Case Study: High-Impact Digital Campaigns
│   └── web-development.html    # Case Study: E-Commerce & Custom Web Apps
├── css/
│   ├── style.css               # Core CSS custom properties, resets, typography, sections
│   ├── responsive.css          # Breakpoints (320px, 768px, 1024px, 1440px)
│   └── animations.css          # Keyframes, hover reveals, transitions
├── js/
│   ├── main.js                 # Entry module (orchestrates preloader, smooth scroll, scripts)
│   ├── cursor.js               # Magnetic custom cursor implementation
│   ├── animations.js           # GSAP timelines, ScrollTrigger, SplitType, stats counters
│   ├── transitions.js          # Barba.js transition engine with curtain overlay
│   ├── slider.js               # Swiper slider initialization & destruction
│   └── navigation.js           # Navigation bar blur, link tracking, mobile drawer
├── assets/
│   └── images/                 # Project images and graphics (placeholders included)
└── README.md                   # Project documentation
```

---

## ⚡ How to Run Locally

### Note on Page Transitions (Barba.js)
Barba.js uses JavaScript `fetch()` under the hood to perform seamless AJAX page transitions without full page reloads. For security reasons, browsers block fetch requests on `file://` URLs.

To test page transitions and full interactive features locally:

1. **Option 1: VS Code Live Server**
   - Open this folder in VS Code.
   - Right-click `index.html` and choose **"Open with Live Server"**.

2. **Option 2: Node.js `npx serve`**
   - Open terminal in the project directory.
   - Run:
     ```bash
     npx serve .
     ```
   - Open `http://localhost:3000` in your browser.

3. **Option 3: Python Built-in Server**
   - Run:
     ```bash
     python -m http.server 8000
     ```
   - Open `http://localhost:8000` in your browser.

*(If opened directly via `file://`, the site will automatically fall back to standard HTML page navigation gracefully without breaking).*

---

## 🖼️ How to Replace Placeholder Images

All image tags in the HTML files contain clean `src` attributes and explanatory HTML comments indicating where to drop real project imagery:

```html
<!-- REPLACE WITH REAL PROJECT HERO IMAGE: 1920x1080px -->
<img src="assets/images/kora-hero.jpg" alt="Kora Apparel Project Banner" loading="lazy">
```

### Image Specifications Checklist:
- **Hero / Project Banners**: `1920 × 1080 px` (Aspect Ratio 16:9 or 21:9, JPG / WebP)
- **Gallery Showcase Images**: `1400 × 900 px` (Aspect Ratio 16:10, JPG / WebP / PNG)
- **Apparel Artwork Mockups**: `1200 × 1200 px` or `1200 × 1500 px` (Aspect Ratio 1:1 or 4:5, PNG with transparency or dark background)
- **About Portrait**: `800 × 1000 px` (Aspect Ratio 4:5, High-contrast portrait)

*Note: The built-in JavaScript engine includes automatic image fallback handlers. If an image file is missing, a dark styled editorial placeholder with grid accents will render automatically.*

---

## 🎨 Customizing Design & Content

### 1. Accent Color
To change the accent color across the entire site (currently chartreuse/acid lime `#C8FF00`), update `--color-accent` in [css/style.css](file:///c:/Users/Tarun/Desktop/Portfolio%20Website/css/style.css):

```css
:root {
    --color-accent: #C8FF00; /* Try #00FF88 (Electric Mint), #FF3366 (Neon Red), or #00E5FF (Cyan) */
}
```

### 2. Social Links & Contact Info
Update email and social links in:
- `index.html` (Footer & Contact CTA)
- `contact.html` (Action cards & form recipient)
- Search for `REPLACE WITH` comments across HTML files.

### 3. Adding New Projects
To add a 6th project:
1. Duplicate one of the case study files in `/work/` (e.g., `kora-apparel.html`).
2. Update `data-barba-namespace="project-detail"`, hero title, tags, description, and gallery slides.
3. Add a project card entry in `index.html` and `work.html`.

---

## 🛠️ Built With

- **HTML5 & CSS3** (Vanilla, CSS Custom Properties, CSS Grid & Flexbox)
- **Vanilla JavaScript (ES Modules)**
- **[GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)** (Hero timelines, parallax, reveals)
- **[ScrollTrigger](https://greensock.com/scrolltrigger/)** (Scroll-driven animation triggers)
- **[SplitType](https://github.com/luke-peavey/SplitType)** (Text line/word splitting)
- **[Lenis](https://lenis.darkroom.engineering/)** (Smooth momentum scroll)
- **[Barba.js](https://barba.js.org/)** (Seamless page transitions)
- **[Swiper.js](https://swiperjs.com/)** (Touch-enabled slider gallery)

---

## 📄 License

© Tarun Verma. All rights reserved. Designed & Created for Tarun Verma.
