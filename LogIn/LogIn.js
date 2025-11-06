// ===== No hardcoded credentials - using backend authentication =====

// ===== DOM Elements =====
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.querySelector('.toggle-password');
const btnSignIn = document.querySelector('.btn-signin');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');

// ===== Form Validation =====
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password.length >= 6;
};

const showError = (inputElement, message) => {
    const formGroup = inputElement.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
};

const clearError = (inputElement) => {
    const formGroup = inputElement.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
};

// ===== Real-time Validation =====
emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim() === '') {
        clearError(emailInput);
    } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
    } else {
        clearError(emailInput);
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.closest('.form-group').classList.contains('error')) {
        if (validateEmail(emailInput.value)) {
            clearError(emailInput);
        }
    }
});

passwordInput.addEventListener('blur', () => {
    if (passwordInput.value.trim() === '') {
        clearError(passwordInput);
    } else if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, 'Password must be at least 6 characters');
    } else {
        clearError(passwordInput);
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.closest('.form-group').classList.contains('error')) {
        if (validatePassword(passwordInput.value)) {
            clearError(passwordInput);
        }
    }
});

// ===== Toggle Password Visibility =====
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update icon
        const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
        if (type === 'text') {
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            `;
            togglePasswordBtn.setAttribute('aria-label', 'Hide password');
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
            togglePasswordBtn.setAttribute('aria-label', 'Show password');
        }
    });
}

// ===== Water Ripple Effect on Sign In Button =====
const createRipple = (event) => {
    const button = event.currentTarget;
    const rippleContainer = button.querySelector('.ripple-container');
    
    // Remove existing ripples
    rippleContainer.innerHTML = '';
    
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation
    const style = document.createElement('style');
    if (!document.querySelector('#ripple-animation')) {
        style.id = 'ripple-animation';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    rippleContainer.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
};

btnSignIn.addEventListener('click', createRipple);

// ===== Form Submission =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError(emailInput);
    clearError(passwordInput);
    
    let isValid = true;
    
    // Validate email
    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (passwordInput.value.trim() === '') {
        showError(passwordInput, 'Password is required');
        isValid = false;
    } else if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Show loading state
    const btnText = btnSignIn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    btnText.innerHTML = `
        <svg style="animation: spin 1s linear infinite; display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Signing In...
    `;
    btnSignIn.disabled = true;
    
    // Add spin animation
    const spinStyle = document.createElement('style');
    if (!document.querySelector('#spin-animation')) {
        spinStyle.id = 'spin-animation';
        spinStyle.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinStyle);
    }
    
    try {
        // Submit the form to PHP backend
        const formData = new FormData(loginForm);
        const response = await fetch(loginForm.action, {
            method: 'POST',
            body: formData
        });

        if (response.redirected) {
            // Success - follow the redirect from PHP
            window.location.href = response.url;
        } else {
            const text = await response.text();
            if (text.includes('error')) {
                // Failed login
                btnText.textContent = '✗ Invalid Credentials';
                btnSignIn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
                
                // Show error messages
                showError(emailInput, 'Invalid email or password');
                showError(passwordInput, 'Invalid email or password');
                
                setTimeout(() => {
                    btnText.textContent = originalText;
                    btnSignIn.style.background = '';
                    btnSignIn.disabled = false;
                }, 2000);
            } else {
                // Success but no redirect
                btnText.textContent = '✓ Success!';
                btnSignIn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                
                if (document.getElementById('remember').checked) {
                    localStorage.setItem('userEmail', emailInput.value);
                }
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        btnText.textContent = originalText;
        btnSignIn.disabled = false;
        alert('An error occurred while signing in. Please try again.');
    }
});

// ===== Google Sign In =====
const btnGoogle = document.querySelector('.btn-google');
if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
        console.log('Google Sign In clicked');
        // Implement Google OAuth here
        alert('Google Sign In - Integration coming soon!');
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#signup' && href !== '#forgot-password' && href !== '#terms' && href !== '#privacy') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Forgot Password Handler =====
const forgotLink = document.querySelector('.forgot-link');
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show modal or redirect to forgot password page
        const email = emailInput.value.trim();
        
        if (email && validateEmail(email)) {
            alert(`Password reset link will be sent to: ${email}`);
            // Implement actual password reset logic
        } else {
            alert('Please enter your email address first');
            emailInput.focus();
        }
    });
}

// ===== Sign Up Link Handler =====
const signupLink = document.querySelector('.signup-link a');
if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        // Allow default navigation to SignUp.html
        console.log('Navigating to Sign Up page');
    });
}

// ===== Input Focus Animation =====
const inputs = document.querySelectorAll('.input-wrapper input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.closest('.input-wrapper').style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', () => {
        input.closest('.input-wrapper').style.transform = 'scale(1)';
    });
});

// ===== Auto-focus on Email Field =====
window.addEventListener('load', () => {
    emailInput.focus();
});

// ===== Handle Enter Key on Inputs =====
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// ===== Accessibility: Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Escape key to clear focus
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
});

// ===== Loading Animation for Page =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Console Welcome Message =====
console.log('%c🌊 Aqua Cart Login Page', 'color: #4DD0E1; font-size: 20px; font-weight: bold;');
console.log('%cWelcome! Stay hydrated 💧', 'color: #00ACC1; font-size: 14px;');
