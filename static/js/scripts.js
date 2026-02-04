// Use a robust function to handle loader removal
const hideLoader = () => {
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        // Add a minimum display time for smooth UX (500ms)
        setTimeout(() => {
            pageLoader.classList.add('hidden');
            // Restore body scrolling
            document.body.style.overflow = '';
            // Remove from DOM after transition completes
            setTimeout(() => {
                pageLoader.remove();
            }, 500);
        }, 500);
    }
};

// Check if page is already loaded, otherwise wait for event
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', hideLoader);
    window.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    // DOM is already ready, run immediately
    hideLoader();
    initScrollAnimations();
}

// Scroll Animations Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

function initSlider(sliderId, tooltipId, formatFn) {
    const slider = document.getElementById(sliderId);
    const tooltip = document.getElementById(tooltipId);
    if (!slider || !tooltip) return;
    const update = () => {
        const val = Number(slider.value);
        const min = Number(slider.min);
        const max = Number(slider.max);
        const percent = (val - min) / (max - min) * 100;
        // Adjust position with offset correction for thumb width (32px)
        tooltip.style.left = `calc(${percent}% + (${16 - percent * 0.32}px))`;
        tooltip.innerHTML = formatFn(val) + '<div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary"></div>';

        // Trigger calculation if slider is part of calculator
        if (sliderId === 'bill-slider' || sliderId === 'area-slider') {
            calculateSolar();
        }
    };
    slider.addEventListener('input', update);
    update(); // Init state
}

function calculateSolar() {
    const bill = Number(document.getElementById('bill-slider').value);
    const area = Number(document.getElementById('area-slider').value);

    // Constants
    const TARIFF = 7.5;
    const GEN_PER_KW = 135;
    const AREA_PER_KW = 100;
    const COST_PER_KW = 65000;

    // Step 1: Monthly Units
    const monthlyUnits = bill / TARIFF;

    // Step 2: Capacity by consumption
    const requiredKw = Math.round(monthlyUnits / GEN_PER_KW);

    // Step 3: Max capacity by roof area
    const maxKwByRoof = Math.floor(area / AREA_PER_KW);

    // Step 4: Final Recommended Capacity
    let recommendedKw = Math.min(requiredKw, maxKwByRoof);
    if (recommendedKw < 1) recommendedKw = 1;

    // Step 5: Subsidy (MNRE Rules)
    let subsidy = 0;
    if (recommendedKw === 1) subsidy = 30000;
    else if (recommendedKw === 2) subsidy = 60000;
    else if (recommendedKw >= 3) subsidy = 78000;

    // Step 6: Total Cost
    const totalCost = recommendedKw * COST_PER_KW;

    // Step 7: User Investment
    const investment = totalCost - subsidy;

    // Step 8: Monthly/Yearly Savings
    const monthlyGen = recommendedKw * GEN_PER_KW;
    const monthlySavings = monthlyGen * TARIFF;
    const yearlySavings = monthlySavings * 12;

    // Step 9: Recovery Time
    const recovery = (investment / yearlySavings).toFixed(1);

    // Update UI
    document.getElementById('output-capacity').textContent = `${recommendedKw} kW`;
    document.getElementById('output-subsidy').textContent = `₹${subsidy.toLocaleString()}`;
    document.getElementById('output-investment').textContent = `₹${investment.toLocaleString()}`;
    document.getElementById('output-recovery').textContent = recovery;
}

function filterFaq(category, btn) {
    // Handle Button States
    const buttons = document.querySelectorAll('#faq-tabs button');
    buttons.forEach(b => {
        b.classList.remove('bg-[#6DBE45]', 'text-white', 'shadow-lg', 'shadow-green-200/50');
        b.classList.add('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200', 'dark:bg-slate-800', 'dark:text-gray-400', 'dark:hover:bg-slate-700');
    });
    btn.classList.remove('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200', 'dark:bg-slate-800', 'dark:text-gray-400', 'dark:hover:bg-slate-700');
    btn.classList.add('bg-[#6DBE45]', 'text-white', 'shadow-lg', 'shadow-green-200/50');
    // Handle FAQ Item Visibility
    const items = document.querySelectorAll('#faq-grid > div');
    items.forEach(item => {
        if (item.dataset.category === category) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function toggleFaq(button) {
    const faqItem = button.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon .material-icons-outlined');
    const allFaqs = document.querySelectorAll('.faq-item');
    const leftBorder = faqItem.querySelector('.absolute.left-0');

    // Close all other FAQs
    allFaqs.forEach(faq => {
        if (faq !== faqItem) {
            const otherAnswer = faq.querySelector('.faq-answer');
            const otherIcon = faq.querySelector('.faq-icon .material-icons-outlined');
            const otherBorder = faq.querySelector('.absolute.left-0');

            if (otherAnswer) {
                otherAnswer.classList.remove('open');
                otherAnswer.style.paddingBottom = '0';
            }
            if (otherIcon) otherIcon.textContent = 'add';

            // Remove expanded styling
            faq.classList.remove('border-brand-green', 'shadow-[0_20px_50px_rgb(0,0,0,0.1)]', 'active');
            faq.classList.add('border-transparent', 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
            if (otherBorder) otherBorder.classList.add('hidden');
        }
    });

    // Toggle current FAQ
    const isOpen = answer.classList.contains('open');
    if (isOpen) {
        // Close current
        answer.classList.remove('open');
        answer.style.paddingBottom = '0';
        icon.textContent = 'add';
        faqItem.classList.remove('border-brand-green', 'shadow-[0_20px_50px_rgb(0,0,0,0.1)]', 'active');
        faqItem.classList.add('border-transparent');
        if (leftBorder) leftBorder.classList.add('hidden');
    } else {
        // Open current
        answer.classList.add('open');
        answer.style.paddingBottom = '2rem';
        icon.textContent = 'remove';
        faqItem.classList.add('border-brand-green', 'shadow-[0_20px_50px_rgb(0,0,0,0.1)]', 'active');
        faqItem.classList.remove('border-transparent', 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
        if (leftBorder) leftBorder.classList.remove('hidden');
    }
}

function showAllFaqs() {
    const items = document.querySelectorAll('#faq-grid > div');
    items.forEach(item => {
        item.classList.remove('hidden');
    });
    // Reset tabs to inactive style
    const buttons = document.querySelectorAll('#faq-tabs button');
    buttons.forEach(b => {
        b.classList.remove('bg-[#6DBE45]', 'text-white', 'shadow-lg', 'shadow-green-200/50');
        b.classList.add('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200', 'dark:bg-slate-800', 'dark:text-gray-400', 'dark:hover:bg-slate-700');
    });
}

// Smooth scroll with offset
function smoothScrollTo(targetId, event) {
    if (event) event.preventDefault();
    const target = document.querySelector(targetId);
    if (!target) return;
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLinks = document.querySelectorAll(`.nav-link[href="#${id}"], .mobile-nav-link[href="#${id}"]`);
                activeLinks.forEach(link => link.classList.add('active'));
            }
        });
    }, {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0
    });
    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });
}

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;

    let current = 0;
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 5000);
}

function toggleMobileMenu(isOpen) {
    const menu = document.getElementById('mobile-menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    if (isOpen) {
        menu.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100', 'pointer-events-auto');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSlider('bill-slider', 'bill-tooltip', (val) => '₹' + parseInt(val).toLocaleString());
    initSlider('area-slider', 'area-tooltip', (val) => val + ' sq ft');

    // Auto-bind all anchor links for smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                smoothScrollTo(href, null);
            }
        });
    });

    highlightActiveSection();
    initHeroCarousel();

    // Persistent Scroll Indicator Logic
    const scrollIndicator = document.getElementById('persistent-scroll-indicator');
    window.addEventListener('scroll', () => {
        if (!scrollIndicator) return;

        const scrollPosition = window.innerHeight + window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight;

        // Hide when reaching the footer (within 150px of bottom)
        if (scrollPosition > documentHeight - 150) {
            scrollIndicator.classList.add('opacity-0', 'pointer-events-none');
            scrollIndicator.classList.remove('opacity-60');
        } else {
            scrollIndicator.classList.remove('opacity-0', 'pointer-events-none');
            scrollIndicator.classList.add('opacity-60');
        }
    });

    // CSRF Token Utility for Django
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Form Submission Logic (Django-compatible)
    const consultationForm = document.getElementById('consultation-form');
    const successModal = document.getElementById('success-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');

    if (consultationForm) {
        consultationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(consultationForm);
            const csrftoken = getCookie('csrftoken');

            try {
                const response = await fetch('/submit-consultation/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': csrftoken,
                    }
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Show Success Modal
                    successModal.classList.remove('hidden');
                    modalBackdrop.classList.remove('hidden');
                    setTimeout(() => {
                        successModal.classList.remove('translate-y-10', 'opacity-0');
                        modalBackdrop.classList.remove('opacity-0');
                    }, 10);

                    // Reset Form
                    consultationForm.reset();
                } else {
                    // Handle validation errors
                    console.error('Form submission errors:', data.errors || 'Unknown error');
                    alert('There was an error submitting your request. Please check your information and try again.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error submitting your request. Please try again later.');
            }
        });
    }
});

// Advanced Animation Logic
document.addEventListener('DOMContentLoaded', () => {
    // Number Counter
    const counters = document.querySelectorAll('.count-up');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    });
    counters.forEach(c => counterObserver.observe(c));

    // Process Bar Scroll Sync
    const processSection = document.getElementById('process');
    const progressBarFill = document.getElementById('process-progress-fill');
    const syncCards = document.querySelectorAll('.sync-card');
    let maxPercentage = 0;

    if (processSection && progressBarFill) {
        // Pre-calculate card positions relative to section
        let cardPositions = [];
        const calculatePositions = () => {
            if (!processSection) return;
            // Get section top relative to document
            const sectionRect = processSection.getBoundingClientRect();
            const sectionTop = sectionRect.top + window.scrollY;
            const sectionHeight = processSection.offsetHeight;

            cardPositions = Array.from(syncCards).map(card => {
                const cardRect = card.getBoundingClientRect();
                const cardTop = cardRect.top + window.scrollY;
                // Calculate percentage at which the card starts relative to section
                // When relativeY / sectionHeight * 100 matches this, the center of screen is at card Top
                const relativeTop = cardTop - sectionTop;

                return {
                    element: card,
                    // Reveal when progress bar hits the top of the card
                    triggerPercent: (relativeTop / sectionHeight) * 100
                };
            });
        };

        // Input init
        calculatePositions();
        window.addEventListener('resize', calculatePositions);
        window.addEventListener('load', calculatePositions);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = processSection.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const sectionHeight = rect.height;

                    // Progress bar logic: Fills as center of screen scrolls through section
                    const startOffset = windowHeight / 2;
                    const relativeY = startOffset - rect.top;

                    let percentage = (relativeY / sectionHeight) * 100;
                    percentage = Math.max(0, Math.min(100, percentage));

                    if (percentage > maxPercentage) {
                        maxPercentage = percentage;
                        progressBarFill.style.height = `${maxPercentage}%`;
                    }

                    // Check for card reveals
                    // Use maxPercentage to ensure cards stay revealed even if user scrolls up slightly 
                    // (though maxPercentage is ratchet, so it works)
                    cardPositions.forEach(item => {
                        if (maxPercentage >= item.triggerPercent && !item.element.classList.contains('is-visible')) {
                            item.element.classList.add('is-visible');
                        }
                    });

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Hide Page Loader
    const loader = document.getElementById('page-loader');
    if (loader) {
        const hideLoader = () => {
            setTimeout(() => {
                loader.classList.add('opacity-0', 'pointer-events-none');
            }, 500);
        };

        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            window.addEventListener('load', hideLoader);
            setTimeout(hideLoader, 5000); // Fallback
        }
    }
});

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');

    successModal.classList.add('translate-y-10', 'opacity-0');
    modalBackdrop.classList.add('opacity-0');

    setTimeout(() => {
        successModal.classList.add('hidden');
        modalBackdrop.classList.add('hidden');
    }, 300);
}
