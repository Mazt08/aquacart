// ===================================
// AquaCart - Shopping Cart JavaScript
// Interactive cart functionality
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Check auth first
    fetch('/check_auth.php')
        .then(r => r.json())
        .then(data => {
            if (!data.isLoggedIn) {
                window.location.href = data.redirectUrl;
                return;
            }
            
            // Initialize cart if logged in
            initCart();
            initQuantityControls(); 
            initRemoveButtons();
            initClearCart();
            initPromoCode();
            initCheckout();
            updateCartTotals();
        })
        .catch(err => {
            console.error('Auth check failed:', err);
            // Show error message
            showNotification('Failed to verify login status', 'error');
        });
});

// ===================================
// Initialize Cart
// ===================================
function initCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const emptyCart = document.getElementById('emptyCart');
    const cartItemsContainer = document.querySelector('.cart-items');
    
    // Check if cart is empty
    if (cartItems.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
    }
    
    // Update cart count in navbar
    updateCartCount();
}

// ===================================
// Quantity Controls
// ===================================
function initQuantityControls() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    cartItems.forEach(item => {
        const decreaseBtn = item.querySelector('.qty-decrease');
        const increaseBtn = item.querySelector('.qty-increase');
        const qtyInput = item.querySelector('.qty-input');
        
        // Decrease quantity
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', function() {
                let currentValue = parseInt(qtyInput.value);
                if (currentValue > 1) {
                    qtyInput.value = currentValue - 1;
                    updateItemTotal(item);
                    updateCartTotals();
                    // trigger change to sync with server
                    qtyInput.dispatchEvent(new Event('change'));
                    animateButton(this);
                }
            });
        }
        
        // Increase quantity
        if (increaseBtn) {
            increaseBtn.addEventListener('click', function() {
                let currentValue = parseInt(qtyInput.value);
                let maxValue = parseInt(qtyInput.max) || 99;
                if (currentValue < maxValue) {
                    qtyInput.value = currentValue + 1;
                    updateItemTotal(item);
                    updateCartTotals();
                    // trigger change to sync with server
                    qtyInput.dispatchEvent(new Event('change'));
                    animateButton(this);
                }
            });
        }
        
        // Direct input change
        if (qtyInput) {
            qtyInput.addEventListener('change', function() {
                let value = parseInt(this.value);
                let min = parseInt(this.min) || 1;
                let max = parseInt(this.max) || 99;
                
                if (isNaN(value) || value < min) {
                    this.value = min;
                } else if (value > max) {
                    this.value = max;
                }
                
                updateItemTotal(item);
                updateCartTotals();

                // Send quantity update to server (AJAX). Cart.php endpoint handles this.
                const cartId = parseInt(this.getAttribute('data-cart-id')) || null;
                if (cartId) {
                    fetch('Cart.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'update_quantity', cart_id: cartId, quantity: parseInt(this.value) })
                    }).then(r => r.json()).then(j => {
                        if (j && j.subtotal !== undefined) {
                            const subtotalElement = document.getElementById('subtotal');
                            const taxElement = document.getElementById('tax');
                            const totalElement = document.getElementById('total');
                            if (subtotalElement) subtotalElement.textContent = '$' + parseFloat(j.subtotal).toFixed(2);
                            if (taxElement) taxElement.textContent = '$' + parseFloat(j.tax).toFixed(2);
                            if (totalElement) totalElement.textContent = '$' + parseFloat(j.total + ((j.subtotal < 500) ? 10 : 0)).toFixed(2);
                        }
                        refreshGlobalCartCount();
                    }).catch(e => console.error('Cart update error', e));
                }
            });
            
            // Prevent invalid input
            qtyInput.addEventListener('keypress', function(e) {
                if (e.key === '-' || e.key === '+' || e.key === 'e') {
                    e.preventDefault();
                }
            });
        }
    });
}

// ===================================
// Update Item Total
// ===================================
function updateItemTotal(item) {
    const qtyInput = item.querySelector('.qty-input');
    const price = parseFloat(item.getAttribute('data-price'));
    const quantity = parseInt(qtyInput.value);
    const totalElement = item.querySelector('.total-value');
    
    if (totalElement) {
        const total = (price * quantity).toFixed(2);
        totalElement.textContent = '$' + total;
        
        // Animate total update
        totalElement.style.transform = 'scale(1.2)';
        totalElement.style.color = 'var(--primary-aqua)';
        setTimeout(() => {
            totalElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// ===================================
// Update Cart Totals
// ===================================
function updateCartTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.getAttribute('data-price'));
        const quantity = parseInt(item.querySelector('.qty-input').value);
        subtotal += price * quantity;
    });
    
    // Calculate tax and total
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    // Update display
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
        subtotalElement.textContent = '$' + subtotal.toFixed(2);
    }
    
    if (taxElement) {
        taxElement.textContent = '$' + tax.toFixed(2);
    }
    
    if (totalElement) {
        totalElement.textContent = '$' + total.toFixed(2);
        
        // Animate total
        totalElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Update shipping
    const shippingElement = document.getElementById('shipping');
    if (shippingElement) {
        if (subtotal >= 500) {
            shippingElement.textContent = 'FREE';
            shippingElement.style.color = '#27AE60';
        } else {
            const shippingCost = 10;
            shippingElement.textContent = '$' + shippingCost.toFixed(2);
            shippingElement.style.color = 'var(--text-dark)';
            
            // Add shipping to total
            if (totalElement) {
                totalElement.textContent = '$' + (total + shippingCost).toFixed(2);
            }
        }
    }
    
    updateCartCount();
}

// ===================================
// Update Cart Count Badge
// ===================================
function updateCartCount() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartCountElement = document.querySelector('.cart-count');
    
    let totalItems = 0;
    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelector('.qty-input').value);
        totalItems += quantity;
    });
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        
        // Animate count
        cartCountElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 300);
    }
}

// ===================================
// Remove Item Buttons
// ===================================
function initRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            const cartId = this.getAttribute('data-cart-id') || item.getAttribute('data-cart-id');
            // Confirmation
            if (confirm('Remove this item from your cart?')) {
                // Send remove request to server
                if (cartId) {
                    fetch('Cart.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'remove_item', cart_id: parseInt(cartId) })
                    }).then(r => r.json()).then(j => {
                        if (j && j.success) {
                            // Animate removal
                            item.style.animation = 'fadeOutScale 0.4s ease-out';
                            setTimeout(() => {
                                item.remove();
                                updateCartTotals();
                                checkEmptyCart();
                                showNotification('Item removed from cart', 'info');
                                refreshGlobalCartCount();
                            }, 400);
                        } else {
                            showNotification('Failed to remove item', 'error');
                        }
                    }).catch(e => {
                        console.error(e);
                        showNotification('Failed to remove item', 'error');
                    });
                } else {
                    // fallback: remove from DOM
                    item.style.animation = 'fadeOutScale 0.4s ease-out';
                    setTimeout(() => {
                        item.remove();
                        updateCartTotals();
                        checkEmptyCart();
                        showNotification('Item removed from cart', 'info');
                    }, 400);
                }
            }
        });
    });
}

// ===================================
// Clear Cart
// ===================================
function initClearCart() {
    const clearCartBtn = document.getElementById('clearCartBtn');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            const cartItems = document.querySelectorAll('.cart-item');
            
            if (cartItems.length === 0) {
                showNotification('Cart is already empty', 'info');
                return;
            }
            
            if (confirm('Are you sure you want to clear your entire cart?')) {
                // Send clear request to server
                fetch('Cart.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'clear_cart' })
                }).then(r => r.json()).then(j => {
                    if (j && j.success) {
                        cartItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.style.animation = 'fadeOutScale 0.4s ease-out';
                                setTimeout(() => {
                                    item.remove();
                                    if (index === cartItems.length - 1) {
                                        checkEmptyCart();
                                        updateCartTotals();
                                        showNotification('Cart cleared', 'info');
                                        refreshGlobalCartCount();
                                    }
                                }, 400);
                            }, index * 100);
                        });
                    } else {
                        showNotification('Failed to clear cart', 'error');
                    }
                }).catch(e => {
                    console.error(e);
                    showNotification('Failed to clear cart', 'error');
                });
            }
        });
    }
}

// ===================================
// Check if Cart is Empty
// ===================================
function checkEmptyCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const emptyCart = document.getElementById('emptyCart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartItemsSection = document.querySelector('.cart-items-section');
    
    if (cartItems.length === 0) {
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        
        // Hide the entire items section header
        const cartItemsHeader = document.querySelector('.cart-items-header');
        if (cartItemsHeader) cartItemsHeader.style.display = 'none';
    }
}

// ===================================
// Promo Code
// ===================================

// Refresh the cart-count elements across the site by calling the shared endpoint
function refreshGlobalCartCount() {
    // absolute path to the guest page endpoint; adjust if you move file
    fetch('/Guest%20Page/php/get_cart_count.php').then(r => r.json()).then(j => {
        if (j && typeof j.count !== 'undefined') {
            document.querySelectorAll('.cart-count').forEach(el => el.textContent = j.count);
        }
    }).catch(e => {
        // ignore
    });
}

function initPromoCode() {
    const promoInput = document.getElementById('promoInput');
    const applyBtn = document.getElementById('applyPromoBtn');
    const promoMessage = document.getElementById('promoMessage');
    
    // Valid promo codes
    const promoCodes = {
        'AQUA10': { discount: 10, type: 'percentage', message: '10% discount applied!' },
        'SAVE20': { discount: 20, type: 'percentage', message: '20% discount applied!' },
        'WELCOME': { discount: 15, type: 'fixed', message: '$15 off applied!' },
        'FREESHIP': { discount: 0, type: 'shipping', message: 'Free shipping applied!' }
    };
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const code = promoInput.value.trim().toUpperCase();
            
            if (!code) {
                showPromoMessage('Please enter a promo code', 'error');
                return;
            }
            
            if (promoCodes[code]) {
                const promo = promoCodes[code];
                applyDiscount(promo);
                showPromoMessage(promo.message, 'success');
                promoInput.value = '';
                promoInput.disabled = true;
                applyBtn.disabled = true;
                applyBtn.textContent = 'Applied';
            } else {
                showPromoMessage('Invalid promo code', 'error');
                setTimeout(() => {
                    promoMessage.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    // Apply on Enter key
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyBtn.click();
            }
        });
    }
}

function applyDiscount(promo) {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const shippingElement = document.getElementById('shipping');
    
    const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
    let discount = 0;
    
    if (promo.type === 'percentage') {
        discount = subtotal * (promo.discount / 100);
    } else if (promo.type === 'fixed') {
        discount = promo.discount;
    } else if (promo.type === 'shipping') {
        shippingElement.textContent = 'FREE';
        shippingElement.style.color = '#27AE60';
    }
    
    if (discount > 0) {
        const newTotal = parseFloat(totalElement.textContent.replace('$', '')) - discount;
        totalElement.textContent = '$' + newTotal.toFixed(2);
        
        // Add discount row
        const summaryDetails = document.querySelector('.summary-details');
        const discountRow = document.createElement('div');
        discountRow.className = 'summary-row';
        discountRow.innerHTML = `
            <span style="color: #27AE60;">Discount:</span>
            <span style="color: #27AE60; font-weight: 600;">-$${discount.toFixed(2)}</span>
        `;
        summaryDetails.insertBefore(discountRow, document.querySelector('.summary-divider'));
    }
}

function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promoMessage');
    
    if (promoMessage) {
        promoMessage.textContent = message;
        promoMessage.className = 'promo-message ' + type;
        promoMessage.style.display = 'block';
    }
}

// ===================================
// Checkout
// ===================================
function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cartItems = document.querySelectorAll('.cart-item');
            
            if (cartItems.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            // Simulate checkout process
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification('Redirecting to checkout... 💧', 'success');
                
                setTimeout(() => {
                    // Redirect to checkout page (you can change this)
                    window.location.href = 'Checkout.php';
                }, 1500);
            }, 1500);
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

// ===================================
// Button Animation Helper
// ===================================
function animateButton(button) {
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
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
    
    @keyframes fadeOutScale {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Mobile Menu Toggle (if using nav-footer.css)
// ===================================
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

// ===================================
// Console Welcome Message
// ===================================
console.log('%c🛒 AquaCart Shopping Cart', 'color: #00A9D6; font-size: 24px; font-weight: bold;');
console.log('%cGlasmorphic Design', 'color: #00737F; font-size: 14px;');
console.log('%cDeveloped with ❤️ and 💧', 'color: #12343B; font-size: 12px;');

// Handle adding items to cart with authentication
async function addToCart(productId, quantity = 1) {
    try {
        // Use this page's add_to_cart endpoint
        const response = await fetch('add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });

        const data = await response.json();

        if (data.error === 'not_logged_in') {
            // User is not logged in
            if (confirm('Please log in to add items to your cart. Would you like to log in now?')) {
                // Save current product to localStorage for after login
                localStorage.setItem('pendingCartItem', JSON.stringify({ productId, quantity }));
                // Redirect to login
                window.location.href = '../../LogIn/LogIn.php';
            }
            return;
        }

        if (!response.ok || data.error) {
            throw new Error(data.message || 'Error adding item to cart');
        }

        // Update cart count in all places
        if (typeof data.count !== 'undefined') {
            updateCartCountElements(data.count);
        } else {
            // Fallback: fetch the count
            fetchCartCountAndUpdate();
        }

        // Show success message
        showNotification('Item added to cart successfully!');

    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to add item to cart', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update all elements that show cart count
function updateCartCountElements(count) {
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

async function fetchCartCountAndUpdate() {
    try {
        const res = await fetch('/Guest%20Page/php/get_cart_count.php');
        if (!res.ok) return;
        const j = await res.json();
        if (typeof j.count !== 'undefined') {
            updateCartCountElements(j.count);
        }
    } catch (e) {
        // ignore
    }
}

// Add notification styles
const notifStyleEl = document.createElement('style');
notifStyleEl.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification.success {
        background-color: #4CAF50;
        color: white;
    }
    
    .notification.error {
        background-color: #f44336;
        color: white;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notifStyleEl);

// Expose helper functions on window for inline handlers and older scripts
if (typeof window !== 'undefined') {
    // expose under a distinct name to avoid colliding with products.js global function
    window.cartAdd = addToCart;
    window.updateCartCountElements = updateCartCountElements;
    window.fetchCartCountAndUpdate = fetchCartCountAndUpdate;
}
