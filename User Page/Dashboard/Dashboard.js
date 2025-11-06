// ===================================
// AquaCart Dashboard - Interactive JS
// Modern glassmorphic interface logic
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initMobileMenu();
    initLogoutModal();
    initChangePasswordModal();
    initAnimations();
    initOrderFilters();
    initFavoritesPage();
    initProfilePage();
    initSettingsPage();
    initBackButton();
});

// ===================================
// Navigation System
// ===================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item:not(.logout-btn)');
    const pages = document.querySelectorAll('.page');
    const viewAllLinks = document.querySelectorAll('.view-all-link');
    const editProfileLinks = document.querySelectorAll('.edit-profile-link');
    
    // Nav item clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add immediate visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            switchPage(this.getAttribute('data-page'));
        });
        
        // Hover effect
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // View all links
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            switchPage(targetPage);
        });
    });
    
    // Edit profile links
    editProfileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage('profile');
        });
    });
}

function switchPage(pageName) {
    const navItems = document.querySelectorAll('.nav-item:not(.logout-btn)');
    const pages = document.querySelectorAll('.page');
    
    // Smooth transition: Remove active class from all nav items
    navItems.forEach(nav => {
        nav.classList.remove('active');
        nav.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    // Add active class to target nav item with slight delay for smooth transition
    setTimeout(() => {
        const targetNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
        if (targetNav) {
            targetNav.classList.add('active');
        }
    }, 50);
    
    // Hide all pages
    pages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Close mobile menu if open
    if (window.innerWidth <= 968) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        sidebar.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===================================
// Mobile Menu Toggle
// ===================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 968) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

// ===================================
// Logout Modal System
// ===================================
function initLogoutModal() {
    const logoutBtn = document.getElementById('logoutBtn');
    const modal = document.getElementById('logoutModal');
    const modalClose = document.getElementById('modalClose');
    const cancelBtn = document.getElementById('cancelLogout');
    const confirmBtn = document.getElementById('confirmLogout');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            window.location.href = '../html/index.html';
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
            this.disabled = true;
            
            setTimeout(() => {
                window.location.href = '../../LogIn/LogIn.php';
            }, 1500);
        });
    }
}

// ===================================
// Change Password Modal
// ===================================
function initChangePasswordModal() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const modal = document.getElementById('changePasswordModal');
    const modalClose = document.getElementById('passwordModalClose');
    const cancelBtn = document.getElementById('cancelPasswordChange');
    const confirmBtn = document.getElementById('confirmPasswordChange');
    const form = document.getElementById('changePasswordForm');
    
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closePasswordModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (form) form.reset();
    }
    
    if (modalClose) modalClose.addEventListener('click', closePasswordModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closePasswordModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closePasswordModal();
    });
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }
            
            if (newPassword.length < 8) {
                showNotification('Password must be at least 8 characters', 'error');
                return;
            }
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification('Password updated successfully! 💧', 'success');
                closePasswordModal();
                this.innerHTML = '<i class="fas fa-save"></i> Update Password';
                this.disabled = false;
            }, 1500);
        });
    }
}

// ===================================
// Back Button Navigation
// ===================================
function initBackButton() {
    const backBtn = document.getElementById('backToUserHome');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '../html/index.html';
        });
    }
}

// ===================================
// Order Filters
// ===================================
function initOrderFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const orderCards = document.querySelectorAll('.order-card');
    const emptyState = document.querySelector('.empty-state');
    const ordersContainer = document.querySelector('.orders-container');
    
    if (!filterTabs.length) return;
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter orders
            let visibleCount = 0;
            orderCards.forEach(card => {
                const status = card.getAttribute('data-status');
                if (filter === 'all' || status === filter) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show/hide empty state
            if (visibleCount === 0) {
                if (ordersContainer) ordersContainer.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
            } else {
                if (ordersContainer) ordersContainer.style.display = 'flex';
                if (emptyState) emptyState.style.display = 'none';
            }
        });
    });
}

// ===================================
// Favorites Page Interactions
// ===================================
function initFavoritesPage() {
    const removeFavBtns = document.querySelectorAll('.remove-favorite-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const addToCartMinis = document.querySelectorAll('.add-to-cart-mini');
    
    removeFavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            card.style.animation = 'fadeOut 0.4s ease-out';
            setTimeout(() => {
                card.remove();
                showNotification('Removed from favorites', 'info');
                
                // Check if any favorites left
                const remainingCards = document.querySelectorAll('.product-card');
                if (remainingCards.length === 0) {
                    document.querySelector('.favorites-products-grid').style.display = 'none';
                    document.querySelector('.favorites-empty-state').style.display = 'block';
                }
            }, 400);
        });
    });
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = 'linear-gradient(135deg, #27AE60, #2ECC71)';
            showNotification('Added to cart! 🛒', 'success');
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                this.style.background = '';
            }, 2000);
        });
    });
    
    addToCartMinis.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(1.2) rotate(360deg)';
            showNotification('Added to cart! 🛒', 'success');
            setTimeout(() => {
                this.style.transform = '';
            }, 500);
        });
    });
}

// ===================================
// Profile Page Interactions
// ===================================
function initProfilePage() {
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const form = document.getElementById('profileForm');
    const formInputs = form.querySelectorAll('input, textarea');
    const formActions = document.querySelector('.form-actions');
    
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            formInputs.forEach(input => {
                input.disabled = false;
                input.style.background = 'rgba(255, 255, 255, 0.8)';
            });
            this.style.display = 'none';
            formActions.style.display = 'flex';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            formInputs.forEach(input => {
                input.disabled = true;
                input.style.background = '';
            });
            editBtn.style.display = 'inline-flex';
            formActions.style.display = 'none';
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                formInputs.forEach(input => {
                    input.disabled = true;
                    input.style.background = '';
                });
                editBtn.style.display = 'inline-flex';
                formActions.style.display = 'none';
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
                submitBtn.disabled = false;
                
                showNotification('Profile updated successfully! 💧', 'success');
            }, 1500);
        });
    }
}

// ===================================
// Settings Page Interactions
// ===================================
function initSettingsPage() {
    // Theme selector
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            const theme = this.getAttribute('data-theme');
            showNotification(`Theme switched to ${theme} mode`, 'info');
        });
    });
    
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.closest('.setting-item').querySelector('h4').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            showNotification(`${setting} ${status}`, 'info');
        });
    });
    
    // Setting action buttons
    const settingActionBtns = document.querySelectorAll('.setting-action-btn');
    settingActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('h4').textContent;
            
            if (action.includes('Delete Account')) {
                showNotification('Account deletion requires contacting support', 'warning');
            } else if (action.includes('Change Password')) {
                document.getElementById('changePasswordBtn').click();
            } else {
                showNotification(`${action} feature coming soon!`, 'info');
            }
        });
    });
}

// ===================================
// Ripple Effect Animation
// ===================================
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 169, 214, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ===================================
// Page Load Animations
// ===================================
function initAnimations() {
    // Animate dashboard cards
    const dashboardCards = document.querySelectorAll('.dashboard-grid .glass-card');
    dashboardCards.forEach((card, index) => {
        card.style.animation = `fadeInScale 0.6s ease-out ${index * 0.1}s both`;
    });
    
    // Animate order items
    const orderItems = document.querySelectorAll('.mini-order-item');
    orderItems.forEach((item, index) => {
        item.style.animation = `fadeIn 0.5s ease-out ${0.3 + index * 0.1}s both`;
    });
    
    // Track order button animation
    const trackBtn = document.querySelector('.track-order-btn');
    if (trackBtn) {
        trackBtn.addEventListener('click', function() {
            showNotification('Opening tracking details...', 'info');
        });
    }
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
    }, 3000);
}

// Add notification animations
const notifAnimStyle = document.createElement('style');
notifAnimStyle.textContent = `
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
document.head.appendChild(notifAnimStyle);

// ===================================
// Responsive Adjustments
// ===================================
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 968) {
        sidebar.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// ===================================
// Smooth Scroll Behavior
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🌊 AquaCart Dashboard', 'color: #00A9D6; font-size: 24px; font-weight: bold;');
console.log('%cModern Glassmorphic Design', 'color: #00737F; font-size: 14px;');
console.log('%cDeveloped with ❤️ and 💧', 'color: #12343B; font-size: 12px;');