// ===================================
// AQUA CART - DOWNLOAD PAGE JAVASCRIPT
// ===================================

// DOM Elements
let emailModal;
let emailForm;
let modalOverlay;
let modalCloseBtn;
let downloadPdfBtn;
let mobileMenuToggle;
let navMenu;
let carouselDots;
let screenSlides;
let currentSlide = 0;

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Download page initializing...');
    
    // Initialize DOM elements
    emailModal = document.getElementById('emailModal');
    emailForm = document.getElementById('emailForm');
    modalOverlay = document.querySelector('.modal-overlay');
    modalCloseBtn = document.querySelector('.modal-close');
    downloadPdfBtn = document.querySelector('.btn-download-pdf');
    mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    navMenu = document.querySelector('.nav-menu');
    carouselDots = document.querySelectorAll('.dot');
    screenSlides = document.querySelectorAll('.screen-slide');
    
    setupEventListeners();
    startCarousel();
    
    console.log('Download page initialized');
});

// ===================================
// EVENT LISTENERS
// ===================================
function setupEventListeners() {
    // Download PDF button
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', openEmailModal);
    }
    
    // Modal close events
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeEmailModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeEmailModal);
    }
    
    // Email form submission
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }
    
    // App store badges
    const appBadges = document.querySelectorAll('.app-badge');
    appBadges.forEach(badge => {
        badge.addEventListener('click', handleAppStoreClick);
    });
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Carousel dots
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && emailModal.classList.contains('active')) {
            closeEmailModal();
        }
    });
}

// ===================================
// EMAIL MODAL FUNCTIONS
// ===================================
function openEmailModal(e) {
    if (e) {
        e.preventDefault();
    }
    
    emailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on email input
    setTimeout(() => {
        const emailInput = document.getElementById('emailInput');
        if (emailInput) {
            emailInput.focus();
        }
    }, 100);
    
    console.log('Email modal opened');
}

function closeEmailModal() {
    emailModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    if (emailForm) {
        emailForm.reset();
    }
    
    console.log('Email modal closed');
}

function handleEmailSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate sending email and downloading
    console.log('Submitting email:', email);
    showNotification('Sending download link...', 'info');
    
    setTimeout(() => {
        // Trigger download
        initiateDownload();
        
        // Show success message
        showNotification('Download link sent! Check your email.', 'success');
        
        // Close modal
        setTimeout(() => {
            closeEmailModal();
        }, 1500);
    }, 1000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initiateDownload() {
    // Simulate PDF download
    console.log('Initiating PDF download...');
    
    // In a real application, this would trigger an actual file download
    // For demo purposes, we'll just log it
    showNotification('Product catalog downloaded!', 'success');
}

// ===================================
// APP STORE FUNCTIONS
// ===================================
function handleAppStoreClick(e) {
    e.preventDefault();
    
    const badge = e.currentTarget;
    const storeName = badge.getAttribute('aria-label');
    
    console.log('App store badge clicked:', storeName);
    
    // In a real application, this would redirect to the actual app store
    if (storeName.includes('App Store')) {
        showNotification('Opening App Store...', 'info');
        // window.open('https://apps.apple.com/your-app-link', '_blank');
    } else if (storeName.includes('Google Play')) {
        showNotification('Opening Google Play...', 'info');
        // window.open('https://play.google.com/store/apps/details?id=your.app.id', '_blank');
    }
}

// ===================================
// CAROUSEL FUNCTIONS
// ===================================
function startCarousel() {
    // Auto-advance carousel every 4 seconds
    setInterval(() => {
        nextSlide();
    }, 4000);
}

function goToSlide(index) {
    // Remove active class from all slides and dots
    screenSlides.forEach(slide => slide.classList.remove('active'));
    carouselDots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to target slide and dot
    screenSlides[index].classList.add('active');
    carouselDots[index].classList.add('active');
    
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % screenSlides.length;
    goToSlide(currentSlide);
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set colors based on type
    let bgColor, iconSvg;
    switch (type) {
        case 'success':
            bgColor = 'linear-gradient(135deg, #4DD0E1 0%, #00838F 100%)';
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            break;
        case 'error':
            bgColor = 'linear-gradient(135deg, #EF5350 0%, #C62828 100%)';
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            break;
        case 'info':
        default:
            bgColor = 'linear-gradient(135deg, #4DD0E1 0%, #00838F 100%)';
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
    `;
    
    notification.innerHTML = `${iconSvg}<span>${message}</span>`;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// MOBILE MENU TOGGLE
// ===================================
function toggleMobileMenu() {
    navMenu.classList.toggle('mobile-active');
    mobileMenuToggle.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', 
        mobileMenuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
    
    // Create/remove overlay
    let overlay = document.querySelector('.mobile-overlay');
    if (navMenu.classList.contains('mobile-active')) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-overlay active';
            overlay.addEventListener('click', toggleMobileMenu);
            document.body.appendChild(overlay);
        }
        document.body.style.overflow = 'hidden';
    } else {
        if (overlay) overlay.remove();
        document.body.style.overflow = '';
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Track scroll for analytics (optional)
let scrollTracked = {
    appSection: false,
    brochureSection: false,
    benefitsSection: false
};

window.addEventListener('scroll', () => {
    const sections = [
        { id: 'app-download', key: 'appSection' },
        { id: 'brochure-download', key: 'brochureSection' }
    ];
    
    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && !scrollTracked[section.key]) {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                console.log(`User scrolled to: ${section.id}`);
                scrollTracked[section.key] = true;
            }
        }
    });
});

console.log('Download page scripts loaded');
