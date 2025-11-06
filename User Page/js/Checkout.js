// ===================================
// AquaCart - Checkout Page JavaScript
// Handles form validation and order processing
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
    initPaymentMethodToggle();
    initCardFormatting();
    initPlaceOrder();
    initMobileMenu();
});

// ===================================
// Form Validation
// ===================================
function initFormValidation() {
    const shippingForm = document.getElementById('shippingForm');
    const inputs = shippingForm.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel') {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = '#E74C3C';
    
    let errorMsg = field.parentElement.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.style.cssText = 'color: #E74C3C; font-size: 12px; margin-top: 4px;';
        field.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// ===================================
// Payment Method Toggle
// ===================================
function initPaymentMethodToggle() {
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('cardForm');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'card') {
                cardForm.style.display = 'flex';
                cardForm.style.opacity = '0';
                setTimeout(() => {
                    cardForm.style.opacity = '1';
                }, 10);
            } else {
                cardForm.style.display = 'none';
            }
        });
    });
}

// ===================================
// Card Number Formatting
// ===================================
function initCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/gi, '');
        });
    }
}

// ===================================
// Place Order
// ===================================
function initPlaceOrder() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            if (validateCheckoutForm()) {
                processOrder();
            }
        });
    }
}

function validateCheckoutForm() {
    const shippingForm = document.getElementById('shippingForm');
    const requiredFields = shippingForm.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (selectedPayment && selectedPayment.value === 'card') {
        const cardFields = document.querySelectorAll('#cardForm input');
        cardFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
    }
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly', 'error');
        
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

function processOrder() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    // Show loading state
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        showNotification('Order placed successfully! Redirecting...', 'success');
        
        setTimeout(() => {
            // Redirect to success page or dashboard
            window.location.href = '../Dashboard/Dashboard.html';
        }, 2000);
    }, 2000);
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    let bgColor;
    switch(type) {
        case 'success':
            bgColor = 'rgba(46, 204, 113, 0.95)';
            break;
        case 'error':
            bgColor = 'rgba(231, 76, 60, 0.95)';
            break;
        case 'warning':
            bgColor = 'rgba(241, 196, 15, 0.95)';
            break;
        default:
            bgColor = 'rgba(0, 169, 214, 0.95)';
    }
    
    const notifStyle = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${bgColor};
        backdrop-filter: blur(20px);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 3000;
        animation: slideInUp 0.4s ease-out;
        max-width: 400px;
    `;
    
    notification.style.cssText = notifStyle;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// ===================================
// Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create mobile overlay if it doesn't exist
    let mobileOverlay = document.querySelector('.mobile-overlay');
    if (!mobileOverlay) {
        mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-overlay';
        document.body.appendChild(mobileOverlay);
    }
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Close menu
                this.classList.remove('active');
                navMenu.classList.remove('mobile-active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                // Open menu
                this.classList.add('active');
                navMenu.classList.add('mobile-active');
                mobileOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            this.setAttribute('aria-expanded', !isActive);
        });
        
        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('mobile-active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
        
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('mobile-active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ===================================
// Add CSS Animations Dynamically
// ===================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🛒 AquaCart Checkout', 'color: #00A9D6; font-size: 24px; font-weight: bold;');
console.log('%cSecure Payment Processing', 'color: #00737F; font-size: 14px;');
console.log('%cDeveloped with ❤️ and 💧', 'color: #12343B; font-size: 12px;');
