/**
 * AQUA CART - HERO SECTION INTERACTIONS
 * Handles animations, parallax, ripple effects, and dynamic features
 */

// =================================
// UTILITY FUNCTIONS
// =================================

/**
 * Debounce function to limit the rate of function execution
 */
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =================================
// NAVBAR SCROLL EFFECT
// =================================

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', debounce(handleNavbarScroll, 10));

// =================================
// MOBILE MENU TOGGLE
// =================================

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navCta = document.querySelector('.nav-cta');
    const body = document.body;
    
    if (!toggle) return;
    
    // Create overlay
    let overlay = document.querySelector('.mobile-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        body.appendChild(overlay);
    }
    
    function toggleMenu() {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        toggle.setAttribute('aria-expanded', !isExpanded);
        toggle.classList.toggle('active');
        
        // Toggle mobile menu visibility
        if (navMenu) {
            navMenu.classList.toggle('mobile-active');
            
            // Move Shop button to bottom of menu when active
            if (!isExpanded && navCta) {
                navMenu.appendChild(navCta);
            }
        }
        
        if (navCta) {
            navCta.classList.toggle('mobile-active');
        }
        
        // Toggle overlay
        overlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (!isExpanded) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
    
    // Toggle on button click
    toggle.addEventListener('click', toggleMenu);
    
    // Close menu when overlay is clicked
    overlay.addEventListener('click', toggleMenu);
    
    // Close menu when nav link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('mobile-active')) {
                toggleMenu();
            }
        });
    });
    
    // Also close when Shop button is clicked
    if (navCta) {
        const shopBtn = navCta.querySelector('a');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                if (navMenu.classList.contains('mobile-active')) {
                    toggleMenu();
                }
            });
        }
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('mobile-active')) {
            toggleMenu();
        }
    });
}

// =================================
// RIPPLE EFFECT ON CTA BUTTONS
// =================================

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = button.querySelector('.ripple');
    
    if (!ripple) return;
    
    // Remove existing animation
    ripple.style.animation = 'none';
    
    // Get button dimensions
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    // Set ripple position and size
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Trigger animation
    setTimeout(() => {
        ripple.style.animation = 'ripple-animation 0.6s ease-out';
    }, 10);
}

function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// =================================
// PARALLAX SCROLL EFFECT
// =================================

function handleParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax="true"]');
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(element => {
        const speed = 0.5; // Parallax speed factor
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// Only enable parallax on devices with no motion preference
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', debounce(handleParallax, 5));
}

// =================================
// COUNTER ANIMATION
// =================================

function animateCounter() {
    const counter = document.querySelector('.counter-number');
    if (!counter) return;
    
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const countUp = () => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(target * easeOutQuad(progress));
        
        counter.textContent = currentCount.toLocaleString();
        
        if (frame < totalFrames) {
            requestAnimationFrame(countUp);
        } else {
            counter.textContent = target.toLocaleString();
        }
    };
    
    // Easing function for smooth animation
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    // Start counter when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
}

// =================================
// LAZY LOADING IMAGES
// =================================

function initLazyLoading() {
    const images = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Create a new image to preload
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = img.src;
                    img.classList.add('loaded');
                };
                tempImg.src = img.src;
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Add CSS for loaded images
const style = document.createElement('style');
style.textContent = `
    img.lazy {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
    img.lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// =================================
// LOTTIE ANIMATION INTEGRATION
// =================================

/**
 * Initialize Lottie droplet animation
 * Requires: Lottie library (https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js)
 */
function initLottieAnimation() {
    const container = document.getElementById('droplet-lottie');
    if (!container) return;
    
    // Check if Lottie library is loaded
    if (typeof lottie !== 'undefined') {
        const animation = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'animations/droplet.json' // Path to your Lottie JSON file
        });
        
        // Optional: Control animation speed
        animation.setSpeed(0.8);
    } else {
        console.warn('Lottie library not loaded. Add script tag: <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>');
    }
}

// =================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for #shop or other non-section links
            if (href === '#' || href.length <= 1) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for navbar height
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =================================
// PRODUCT IMAGE HOVER EFFECT
// =================================

function initProductImageEffect() {
    const productImage = document.querySelector('.product-image');
    if (!productImage) return;
    
    const heroProduct = document.querySelector('.hero-product');
    
    heroProduct.addEventListener('mousemove', (e) => {
        const rect = heroProduct.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        productImage.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.05)
        `;
    });
    
    heroProduct.addEventListener('mouseleave', () => {
        productImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

// =================================
// TRUST STRIP CAROUSEL (MOBILE)
// =================================

function initTrustStripCarousel() {
    const trustStrip = document.querySelector('.trust-strip');
    if (!trustStrip) return;
    
    // Only enable on mobile
    if (window.innerWidth <= 767) {
        let isScrolling = false;
        let startX;
        let scrollLeft;
        
        trustStrip.addEventListener('mousedown', (e) => {
            isScrolling = true;
            startX = e.pageX - trustStrip.offsetLeft;
            scrollLeft = trustStrip.scrollLeft;
        });
        
        trustStrip.addEventListener('mouseleave', () => {
            isScrolling = false;
        });
        
        trustStrip.addEventListener('mouseup', () => {
            isScrolling = false;
        });
        
        trustStrip.addEventListener('mousemove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.pageX - trustStrip.offsetLeft;
            const walk = (x - startX) * 2;
            trustStrip.scrollLeft = scrollLeft - walk;
        });
    }
}

// =================================
// SCROLL REVEAL ANIMATIONS
// =================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.trust-item, .thumbnail');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });
}

// =================================
// PERFORMANCE MONITORING
// =================================

function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page Load Time: ${pageLoadTime}ms`);
            }, 0);
        });
    }
}

// =================================
// ACCESSIBILITY ENHANCEMENTS
// =================================

function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #00838F;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Announce dynamic content changes
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(announcer);
}

// =================================
// INITIALIZE ALL FEATURES
// =================================

function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    // Initialize all features
    initMobileMenu();
    initRippleEffect();
    initLazyLoading();
    animateCounter();
    initSmoothScroll();
    initProductImageEffect();
    initTrustStripCarousel();
    initScrollReveal();
    initAccessibility();
    
    // Initialize Lottie animation if library is loaded
    if (typeof lottie !== 'undefined') {
        initLottieAnimation();
    }
    
    // Performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformance();
    }
    
    console.log('Aqua Cart Hero Section initialized successfully! 💧');
}

// Start initialization
init();

// =================================
// RESIZE HANDLER
// =================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reinitialize features that depend on viewport size
        initTrustStripCarousel();
    }, 250);
});

// =================================
// EXPORT FOR MODULE USAGE (OPTIONAL)
// =================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        createRipple,
        animateCounter,
        initLottieAnimation
    };
}
