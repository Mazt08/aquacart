// ================================================
// MISSION PAGE JAVASCRIPT - AQUA CART
// Animated stat counters and interactions
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Mission page initialized - Aqua Cart');
    
    // ==========================================
    // ANIMATED STAT COUNTERS
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'k';
        }
        return num.toString();
    }
    
    // Trigger stat counters when stats section comes into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                statNumbers.forEach((stat, index) => {
                    setTimeout(() => {
                        animateCounter(stat);
                    }, index * 150); // Stagger animation
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                revealObserver.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, observerOptions);
    
    // Observe value cards
    document.querySelectorAll('.value-card').forEach(card => {
        revealObserver.observe(card);
    });
    
    // Observe commitment cards
    document.querySelectorAll('.commitment-card').forEach(card => {
        revealObserver.observe(card);
    });
    
    // Observe stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        revealObserver.observe(card);
    });
    
    // ==========================================
    // VALUE CARDS INTERACTION
    // ==========================================
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        const value = card.dataset.value;
        
        card.addEventListener('mouseenter', function() {
            console.log(`Value highlighted: ${value}`);
        });
        
        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // ==========================================
    // COMMITMENT CARDS EXPANSION
    // ==========================================
    const commitmentCards = document.querySelectorAll('.commitment-card');
    
    commitmentCards.forEach(card => {
        card.addEventListener('click', function() {
            // Future: Could expand to show more details
            console.log('Commitment card clicked:', this.querySelector('h3').textContent);
        });
    });
    
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
                
                history.pushState(null, null, href);
            }
        });
    });
    
    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, 10));
    
    // ==========================================
    // BUTTON RIPPLE EFFECT
    // ==========================================
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download');
    
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
    // DOWNLOAD BUTTON TRACKING
    // ==========================================
    const downloadButton = document.querySelector('.btn-download');
    if (downloadButton) {
        downloadButton.addEventListener('click', function(e) {
            console.log('Sustainability report download initiated');
            
            // Show notification (optional)
            showNotification('Preparing your download...', 'info');
            
            // Future: Analytics tracking
            // trackEvent('download', 'sustainability_report', '2024');
        });
    }
    
    // ==========================================
    // NOTIFICATION SYSTEM
    // ==========================================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: ${type === 'success' ? '#10B981' : '#4DD0E1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInUp 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add notification animations
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @keyframes slideOutDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // ==========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ==========================================
    
    // Skip to main content link
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
    
    // Add main content ID
    const valuesSection = document.querySelector('.values-section');
    if (valuesSection && !valuesSection.id) {
        valuesSection.id = 'main-content';
    }
    
    // ==========================================
    // PERFORMANCE MONITORING
    // ==========================================
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime.toFixed(2) + 'ms');
                }
            }
        });
        
        try {
            perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('Performance observer not supported');
        }
    }
    
    // ==========================================
    // CONSOLE LOG
    // ==========================================
    console.log('✓ Stat counters initialized');
    console.log('✓ Scroll animations enabled');
    console.log('✓ Interactive cards active');
    console.log('✓ Accessibility features enabled');
    console.log('Mission page fully loaded - Aqua Cart');
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
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
