# Features & Animations Guide

This document encapsulates the interactive features, animations, and frontend logic applied to the Ayush Solar project.

## 🌟 Global Animations & Effects

The website uses a custom `IntersectionObserver` system to trigger animations when elements scroll into view.

*   **Logic**: `scripts.js` (Lines 28-47)
*   **CSS**: `styles.css` (Lines 205-306)

### Animation Classes
Applying these classes to any HTML element triggers the effect when it enters the viewport:
*   `.animate-on-scroll`: Base class required for all scroll animations.
*   `.fade-up`: Element moves up 30px and fades in.
*   `.fade-in`: Simple opacity transition.
*   `.slide-left` / `.slide-right`: Slides in from sides.
*   `.zoom-in`: Scales up from 95% to 100%.
*   `.blur-in`: Unblurs from 10px to 0px.
*   `.flip-up`: 3D rotation effect.
*   `.scale-up`: Scales from 0.8 to 1.0 with a bounce.
*   `.bounce-up`: Bounces up from the bottom.

### Staggered Delays
Used for grids (like benefits or documents) to animate items one by one:
*   `.stagger-1` (100ms delay)
*   `.stagger-2` (200ms delay)
*   ...up to `.stagger-5`.

---

## 🚀 Section-Specific Features

### 1. **Hero Section** (`_hero.html`)
*   **Feature**: Background Carousel.
    *   **Logic**: Rotates through `.hero-slide` images every 5 seconds (`initHeroCarousel`).
*   **Animation**:
    *   Slides scale slowly (`transition: transform 6s`) to create a "breathing" effect.
    *   Text elements use `.fade-up` and `.stagger` classes.

### 2. **Solar Calculator** (`_calculator.html`)
*   **Feature**: Real-time Cost & Subsidy Estimation.
    *   **Inputs**: Monthly Bill Slider & Roof Area Slider.
    *   **Logic**: `calculateSolar()` in `scripts.js`.
        *   Calculates `Recommended kW`, `Subsidy (₹)`, `Net Investment`, and `ROI Time`.
        *   Updates DOM elements in real-time as sliders move.
*   **UI**: Custom range sliders with orange thumbs (`input[type=range]` styling in CSS).

### 3. **Process Flow** (`_process.html`)
*   **Feature**: Scroll-Synchronized Progress Bar.
    *   **Logic**: `scripts.js` (Lines 398-468).
    *   **Behavior**:
        *   A vertical line fills green as you scroll down the section.
        *   When the "fill" reaches a card, the card reveals itself (`.is-visible`).
        *   Uses `requestAnimationFrame` for high-performance scroll tracking.

### 4. **Statistics** (`_stats.html`)
*   **Feature**: Number Counters (`.count-up`).
    *   **Logic**: `scripts.js` (Lines 371-397).
    *   **Behavior**: Numbers count up from 0 to their target value (e.g., 5000+) over 2 seconds when scrolled into view.

### 5. **FAQ Section** (`_faqs.html`)
*   **Feature**: Filtering & Accordion.
    *   **Logic**:
        *   `filterFaq(category)`: Shows/hides questions based on category (General, Subsidy, etc.).
        *   `toggleFaq(btn)`: Expands/collapses answers with a smooth height transition.
    *   **Animation**: The `+` icon rotates 180deg, and the answer container slides down.

### 6. **Forms** (`_contact.html`)
*   **Feature**: AJAX Submission.
    *   **Logic**: Intercepts form submit, sends JSON to Django view, prevents page reload.
    *   **UI**: Shows a Success Modal (`_modals.html`) upon successful submission.

### 7. **Navigation** (`_navbar.html`)
*   **Feature**: Active Link Highlighting.
    *   **Logic**: `highlightActiveSection()` observes which section is currently in view and adds `.active` class to the corresponding nav menu item.
*   **Mobile Menu**: Slide-in drawer effect triggered by the hamburger icon.

### 8. **Page Loader** (`_loader.html`)
*   **Feature**: Initial Load Screen.
    *   **Logic**: Blocks interaction until the window is fully loaded (`window.addEventListener('load')`), then fades out.
