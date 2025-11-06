// Handle adding items to cart with authentication
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch('../php/add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });

        const data = await response.json();

        if (response.status === 401) {
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
        const res = await fetch('../php/get_cart_count.php');
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
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

// Expose helper functions on window for older scripts (e.g., products.js modal)
// This guarantees addToCart can be called as window.addToCart from inline onclick handlers
if (typeof window !== 'undefined') {
    window.addToCart = addToCart;
    window.updateCartCountElements = updateCartCountElements;
    window.fetchCartCountAndUpdate = fetchCartCountAndUpdate;
}