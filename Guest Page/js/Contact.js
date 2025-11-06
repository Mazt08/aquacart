// Contact Page JavaScript

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Create mobile overlay
let mobileOverlay = document.querySelector('.mobile-overlay');
if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);
}

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('mobile-active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('mobile-active') ? 'hidden' : '';
    });

    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close mobile menu when clicking nav links
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('mobile-active')) {
            navMenu.classList.remove('mobile-active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });
});

// Contact Form Elements
const contactForm = document.getElementById('contactForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const subject = document.getElementById('subject');
const message = document.getElementById('message');
const successMessage = document.getElementById('successMessage');
const formWrapper = document.querySelector('.form-wrapper');

// Character counter for message
if (message) {
    const charCount = document.querySelector('.char-count');
    const maxChars = 1000;

    message.addEventListener('input', () => {
        const currentLength = message.value.length;
        charCount.textContent = `${currentLength} / ${maxChars}`;

        if (currentLength > maxChars) {
            message.value = message.value.substring(0, maxChars);
            charCount.textContent = `${maxChars} / ${maxChars}`;
        }

        if (currentLength > maxChars * 0.9) {
            charCount.style.color = '#ff4757';
        } else {
            charCount.style.color = '#999';
        }
    });
}

// Validation Functions
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    return nameRegex.test(name.trim());
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function validatePhone(phone) {
    if (!phone || phone.trim() === '') return true; // Phone is optional
    const phoneRegex = /^[\d\s+()-]{10,20}$/;
    return phoneRegex.test(phone.trim());
}

function validateSubject(subject) {
    return subject && subject !== '';
}

function validateMessage(message) {
    return message.trim().length >= 10 && message.trim().length <= 1000;
}

// Show Error
function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    input.classList.add('error');
    input.classList.remove('success');
    
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }
}

// Show Success
function showSuccess(input) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    input.classList.add('success');
    input.classList.remove('error');
    
    if (errorMessage) {
        errorMessage.classList.remove('show');
    }
}

// Clear Error
function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    input.classList.remove('error', 'success');
    
    if (errorMessage) {
        errorMessage.classList.remove('show');
    }
}

// Real-time Validation
if (firstName) {
    firstName.addEventListener('blur', () => {
        if (!firstName.value.trim()) {
            showError(firstName, 'First name is required');
        } else if (!validateName(firstName.value)) {
            showError(firstName, 'Please enter a valid first name');
        } else {
            showSuccess(firstName);
        }
    });

    firstName.addEventListener('input', () => {
        if (firstName.classList.contains('error')) {
            if (validateName(firstName.value)) {
                showSuccess(firstName);
            }
        }
    });
}

if (lastName) {
    lastName.addEventListener('blur', () => {
        if (!lastName.value.trim()) {
            showError(lastName, 'Last name is required');
        } else if (!validateName(lastName.value)) {
            showError(lastName, 'Please enter a valid last name');
        } else {
            showSuccess(lastName);
        }
    });

    lastName.addEventListener('input', () => {
        if (lastName.classList.contains('error')) {
            if (validateName(lastName.value)) {
                showSuccess(lastName);
            }
        }
    });
}

if (email) {
    email.addEventListener('blur', () => {
        if (!email.value.trim()) {
            showError(email, 'Email address is required');
        } else if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
        } else {
            showSuccess(email);
        }
    });

    email.addEventListener('input', () => {
        if (email.classList.contains('error')) {
            if (validateEmail(email.value)) {
                showSuccess(email);
            }
        }
    });
}

if (phone) {
    phone.addEventListener('blur', () => {
        if (phone.value.trim() && !validatePhone(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
        } else if (phone.value.trim()) {
            showSuccess(phone);
        } else {
            clearError(phone);
        }
    });

    phone.addEventListener('input', () => {
        if (phone.classList.contains('error')) {
            if (validatePhone(phone.value)) {
                showSuccess(phone);
            }
        }
    });
}

if (subject) {
    subject.addEventListener('change', () => {
        if (!validateSubject(subject.value)) {
            showError(subject, 'Please select a subject');
        } else {
            showSuccess(subject);
        }
    });
}

if (message) {
    message.addEventListener('blur', () => {
        if (!message.value.trim()) {
            showError(message, 'Message is required');
        } else if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters');
        } else if (message.value.trim().length > 1000) {
            showError(message, 'Message must not exceed 1000 characters');
        } else {
            showSuccess(message);
        }
    });

    message.addEventListener('input', () => {
        if (message.classList.contains('error')) {
            if (validateMessage(message.value)) {
                showSuccess(message);
            }
        }
    });
}

// Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate First Name
        if (!firstName.value.trim()) {
            showError(firstName, 'First name is required');
            isValid = false;
        } else if (!validateName(firstName.value)) {
            showError(firstName, 'Please enter a valid first name');
            isValid = false;
        } else {
            showSuccess(firstName);
        }

        // Validate Last Name
        if (!lastName.value.trim()) {
            showError(lastName, 'Last name is required');
            isValid = false;
        } else if (!validateName(lastName.value)) {
            showError(lastName, 'Please enter a valid last name');
            isValid = false;
        } else {
            showSuccess(lastName);
        }

        // Validate Email
        if (!email.value.trim()) {
            showError(email, 'Email address is required');
            isValid = false;
        } else if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(email);
        }

        // Validate Phone (optional)
        if (phone.value.trim() && !validatePhone(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        } else if (phone.value.trim()) {
            showSuccess(phone);
        }

        // Validate Subject
        if (!validateSubject(subject.value)) {
            showError(subject, 'Please select a subject');
            isValid = false;
        } else {
            showSuccess(subject);
        }

        // Validate Message
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        } else if (!validateMessage(message.value)) {
            showError(message, 'Message must be between 10 and 1000 characters');
            isValid = false;
        } else {
            showSuccess(message);
        }

        // If form is valid, submit
        if (isValid) {
            submitForm();
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
}

// Submit Form
function submitForm() {
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalText = submitButton.innerHTML;

    // Show loading state
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<span class="btn-text">Sending</span>';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitButton.classList.remove('loading');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // Show success message
        showSuccessMessage();

        // Reset form
        contactForm.reset();
        clearAllErrors();

        // Reset character count
        const charCount = document.querySelector('.char-count');
        if (charCount) {
            charCount.textContent = '0 / 1000';
            charCount.style.color = '#999';
        }
    }, 2000);
}

// Show Success Message
function showSuccessMessage() {
    successMessage.classList.add('show');
    formWrapper.style.opacity = '0.3';
    formWrapper.style.pointerEvents = 'none';
}

// Close Success Message
function closeSuccessMessage() {
    successMessage.classList.remove('show');
    formWrapper.style.opacity = '1';
    formWrapper.style.pointerEvents = 'auto';
}

// Clear All Errors
function clearAllErrors() {
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        clearError(input);
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#privacy' && href !== '#terms') {
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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = '#fff';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animations
const animateElements = document.querySelectorAll('.info-card, .faq-item');
animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Console log for debugging
console.log('Contact page loaded successfully');
