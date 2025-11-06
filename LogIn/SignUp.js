// ===== DOM Elements =====
const signupForm = document.getElementById('signupForm');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const togglePasswordBtn = document.querySelector('.toggle-password');
const btnSignUp = document.querySelector('.btn-signup');
const strengthBar = document.querySelector('.strength-fill');
const strengthText = document.querySelector('.strength-text');
const passwordStrengthContainer = document.querySelector('.password-strength');

// ===== Validation Functions =====
const validateFullName = (name) => {
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && /^[a-zA-Z\s]+$/.test(trimmedName);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password.length >= 8;
};

const checkPasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
};

const showError = (inputElement, message) => {
    const formGroup = inputElement.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    errorMessage.textContent = message;
};

const showSuccess = (inputElement) => {
    const formGroup = inputElement.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    errorMessage.textContent = '';
};

const clearValidation = (inputElement) => {
    const formGroup = inputElement.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error', 'success');
    errorMessage.textContent = '';
};

// ===== Real-time Validation =====

// Full Name Validation
fullnameInput.addEventListener('input', () => {
    const value = fullnameInput.value;
    
    if (value.length === 0) {
        clearValidation(fullnameInput);
    } else if (validateFullName(value)) {
        showSuccess(fullnameInput);
    } else if (value.length > 0) {
        showError(fullnameInput, 'Please enter a valid full name (letters only)');
    }
});

fullnameInput.addEventListener('blur', () => {
    if (fullnameInput.value.trim() === '') {
        clearValidation(fullnameInput);
    } else if (!validateFullName(fullnameInput.value)) {
        showError(fullnameInput, 'Please enter a valid full name (letters only)');
    }
});

// Email Validation
emailInput.addEventListener('input', () => {
    const value = emailInput.value;
    
    if (value.length === 0) {
        clearValidation(emailInput);
    } else if (validateEmail(value)) {
        showSuccess(emailInput);
    }
});

emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim() === '') {
        clearValidation(emailInput);
    } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
    } else {
        showSuccess(emailInput);
    }
});

// Password Validation with Strength Indicator
passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    
    if (value.length === 0) {
        clearValidation(passwordInput);
        passwordStrengthContainer.classList.remove('active');
        strengthBar.className = 'strength-fill';
        strengthText.textContent = '';
    } else {
        passwordStrengthContainer.classList.add('active');
        
        const strength = checkPasswordStrength(value);
        strengthBar.className = `strength-fill ${strength}`;
        strengthText.className = `strength-text ${strength}`;
        
        if (strength === 'weak') {
            strengthText.textContent = 'Weak';
        } else if (strength === 'medium') {
            strengthText.textContent = 'Medium';
        } else {
            strengthText.textContent = 'Strong';
            showSuccess(passwordInput);
        }
        
        if (value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters');
        } else if (strength === 'weak') {
            showError(passwordInput, 'Use uppercase, lowercase, numbers & symbols');
        } else {
            clearValidation(passwordInput);
            if (strength === 'strong') {
                showSuccess(passwordInput);
            }
        }
    }
    
    // Revalidate confirm password if it has a value
    if (confirmPasswordInput.value.length > 0) {
        validateConfirmPassword();
    }
});

passwordInput.addEventListener('blur', () => {
    if (passwordInput.value.trim() === '') {
        clearValidation(passwordInput);
        passwordStrengthContainer.classList.remove('active');
    }
});

// Confirm Password Validation
const validateConfirmPassword = () => {
    const value = confirmPasswordInput.value;
    
    if (value.length === 0) {
        clearValidation(confirmPasswordInput);
        return false;
    } else if (value !== passwordInput.value) {
        showError(confirmPasswordInput, 'Passwords do not match');
        return false;
    } else {
        showSuccess(confirmPasswordInput);
        return true;
    }
};

confirmPasswordInput.addEventListener('input', validateConfirmPassword);
confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

// Terms Checkbox Validation
termsCheckbox.addEventListener('change', () => {
    if (termsCheckbox.checked) {
        clearValidation(termsCheckbox);
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

// ===== Water Ripple Effect on Button =====
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

btnSignUp.addEventListener('click', createRipple);

// ===== Form Submission =====
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate Full Name
    if (fullnameInput.value.trim() === '') {
        showError(fullnameInput, 'Full name is required');
        isValid = false;
    } else if (!validateFullName(fullnameInput.value)) {
        showError(fullnameInput, 'Please enter a valid full name (letters only)');
        isValid = false;
    } else {
        showSuccess(fullnameInput);
    }
    
    // Validate Email
    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess(emailInput);
    }
    
    // Validate Password
    if (passwordInput.value.trim() === '') {
        showError(passwordInput, 'Password is required');
        isValid = false;
    } else if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, 'Password must be at least 8 characters');
        isValid = false;
    }
    
    // Validate Confirm Password
    if (confirmPasswordInput.value.trim() === '') {
        showError(confirmPasswordInput, 'Please confirm your password');
        isValid = false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, 'Passwords do not match');
        isValid = false;
    } else {
        showSuccess(confirmPasswordInput);
    }
    
    // Validate Terms Checkbox
    if (!termsCheckbox.checked) {
        showError(termsCheckbox, 'You must agree to the terms and privacy policy');
        isValid = false;
    } else {
        clearValidation(termsCheckbox);
    }
    
    if (!isValid) {
        // Focus on first error
        const firstError = signupForm.querySelector('.form-group.error input, .form-group.error input[type="checkbox"]');
        if (firstError) {
            firstError.focus();
        }
        return;
    }
    
    // Show loading state
    const btnText = btnSignUp.querySelector('.btn-text');
    const originalText = btnText.textContent;
    btnText.innerHTML = `
        <svg style="animation: spin 1s linear infinite; display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Creating Account...
    `;
    btnSignUp.disabled = true;

    try {
        // Submit the form to PHP
        const formData = new FormData(signupForm);
        const response = await fetch(signupForm.action, {
            method: 'POST',
            body: formData
        });

        if (response.redirected) {
            // If PHP redirects us, follow the redirect
            window.location.href = response.url;
        } else {
            const text = await response.text();
            if (text.includes('error')) {
                // If there's an error message in the response
                btnText.textContent = originalText;
                btnSignUp.disabled = false;
                // Show error from PHP if any
                const errorMatch = text.match(/<div class="error-alert">(.*?)<\/div>/);
                if (errorMatch) {
                    alert(errorMatch[1].replace(/❌\s*/, ''));
                }
            } else {
                // Success
                btnText.textContent = '✓ Account Created!';
                btnSignUp.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                setTimeout(() => {
                    window.location.href = 'LogIn.php';
                }, 1500);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        btnText.textContent = originalText;
        btnSignUp.disabled = false;
        alert('An error occurred while creating your account. Please try again.');
    }
});

const clearAllValidations = () => {
    [fullnameInput, emailInput, passwordInput, confirmPasswordInput, termsCheckbox].forEach(input => {
        clearValidation(input);
    });
    passwordStrengthContainer.classList.remove('active');
    strengthBar.className = 'strength-fill';
    strengthText.textContent = '';
};

// ===== Google Sign Up =====
const btnGoogle = document.querySelector('.btn-google');
btnGoogle.addEventListener('click', () => {
    console.log('Google Sign Up clicked');
    // Implement Google OAuth here
    alert('Google Sign Up - Integration coming soon!');
});

// ===== Input Focus Animations =====
const inputs = document.querySelectorAll('.input-wrapper input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.closest('.input-wrapper').style.transition = 'transform 0.2s ease';
    });
});

// ===== Auto-focus on Full Name Field =====
window.addEventListener('load', () => {
    fullnameInput.focus();
});

// ===== Handle Enter Key on Inputs =====
const formInputs = [fullnameInput, emailInput, passwordInput, confirmPasswordInput];
formInputs.forEach((input, index) => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index < formInputs.length - 1) {
                formInputs[index + 1].focus();
            } else {
                termsCheckbox.focus();
            }
        }
    });
});

termsCheckbox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        signupForm.dispatchEvent(new Event('submit'));
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

// ===== Smooth Link Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#terms' && href !== '#privacy') {
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

// ===== Page Transition Animation (Login to Sign Up) =====
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('from') === 'login') {
    document.querySelector('.signup-wrapper').style.animation = 'slideInFromRight 0.5s ease-out';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFromRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== Real-time Email Availability Check (Optional) =====
let emailCheckTimeout;
emailInput.addEventListener('input', () => {
    clearTimeout(emailCheckTimeout);
    
    if (validateEmail(emailInput.value)) {
        emailCheckTimeout = setTimeout(() => {
            // Simulate checking if email exists (replace with actual API call)
            console.log('Checking email availability:', emailInput.value);
            // If email exists, show error:
            // showError(emailInput, 'This email is already registered');
        }, 800);
    }
});

// ===== Console Welcome Message =====
console.log('%c🌊 Aqua Cart Sign Up Page', 'color: #4DD0E1; font-size: 20px; font-weight: bold;');
console.log('%cJoin us for clean hydration! 💦', 'color: #00ACC1; font-size: 14px;');
