// ================================================
// ABOUT PAGE JAVASCRIPT - AQUA CART
// Enhanced interactions and animations
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('About page initialized - Aqua Cart');
    
    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
    
    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // ==========================================
    // TIMELINE KEYBOARD NAVIGATION
    // ==========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
            let targetIndex = index;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = (index + 1) % timelineItems.length;
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = (index - 1 + timelineItems.length) % timelineItems.length;
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    targetIndex = 0;
                    break;
                    
                case 'End':
                    e.preventDefault();
                    targetIndex = timelineItems.length - 1;
                    break;
                    
                default:
                    return;
            }
            
            timelineItems[targetIndex].focus();
        });
        
        // Add accessible label
        const year = item.dataset.year;
        const title = item.querySelector('h4')?.textContent;
        if (year && title) {
            item.setAttribute('aria-label', `${year}: ${title}`);
        }
    });
    
    // ==========================================
    // INTERSECTION OBSERVER - SCROLL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-animate');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe story cards
    document.querySelectorAll('.story-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe timeline items
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // Observe sustainability cards
    document.querySelectorAll('.sustainability-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe founder section
    const founderCard = document.querySelector('.founder-card');
    if (founderCard) {
        observer.observe(founderCard);
    }
    
    // ==========================================
    // STATS COUNTER ANIMATION
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    
    const animateStats = () => {
        if (statsAnimated) return;
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            // Skip if not a pure number
            if (!/^\d+k?\+?$/.test(text.replace(/,/g, ''))) return;
            
            const target = parseInt(text.replace(/[k+,]/g, ''));
            const suffix = text.includes('k') ? 'k' : '';
            const plus = text.includes('+') ? '+' : '';
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            const stepTime = duration / 50;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix + plus;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
        
        statsAnimated = true;
    };
    
    // Trigger stats animation when hero is in view
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.3 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
    
    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (mobileMenuToggle && navMenu) {
        // Create overlay if it doesn't exist
        let overlay = document.querySelector('.mobile-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            body.appendChild(overlay);
        }
        
        function toggleMenu() {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('mobile-active');
            overlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            body.style.overflow = isExpanded ? '' : 'hidden';
        }
        
        // Toggle on button click
        mobileMenuToggle.addEventListener('click', toggleMenu);
        
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
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('mobile-active')) {
                toggleMenu();
            }
        });
    }
    
    // ==========================================
    // SCROLL INDICATOR
    // ==========================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const storySection = document.querySelector('.story-section');
            if (storySection) {
                storySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // ==========================================
    // BUTTON RIPPLE EFFECT
    // ==========================================
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ==========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==========================================
    
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -100px;
        left: 10px;
        background: var(--color-deep-teal);
        color: white;
        padding: 0.75rem 1.5rem;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '10px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-100px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not present
    const storySection = document.querySelector('.story-section');
    if (storySection && !storySection.id) {
        storySection.id = 'main-content';
    }
    
    // ==========================================
    // PERFORMANCE MONITORING
    // ==========================================
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
            }
        });
        
        perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
    
    // ==========================================
    // CONSOLE LOG
    // ==========================================
    console.log('✓ Navbar scroll effect enabled');
    console.log('✓ Timeline items:', timelineItems.length);
    console.log('✓ Scroll animations initialized');
    console.log('✓ Keyboard navigation enabled');
    console.log('✓ Accessibility features active');
    console.log('About page fully loaded - Aqua Cart');
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
