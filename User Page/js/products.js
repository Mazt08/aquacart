// State
let productsData = [];
let currentFilter = 'all';
let currentSort = 'name-asc';
let searchQuery = '';
let filteredProducts = [];

// Fetch Products from Database
async function fetchProducts() {
    showLoading();
    try {
        console.log('Fetching products...');
        const response = await fetch('../php/products.php?action=getProducts');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            if (data.error) throw new Error(data.message || 'Failed to fetch products');
            productsData = [];
        } else {
            productsData = data.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category?.toLowerCase() || '',
                description: item.description || '',
                price: item.price || 0,
                size: item.size || '',
                image: item.image || '',
                featured: item.featured || false,
                subcategory: item.subcategory || ''
            }));
        }
        
        filteredProducts = [...productsData];
        console.log('Products loaded:', productsData.length, 'items');
        updateProductCounts();
        filterProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        showError(`Failed to load products: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('quickViewModal');

// Mobile Menu
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

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

    mobileOverlay.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
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

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    fetchProducts();
    await updateCartCount();
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement && cartCountElement.textContent === '0' && typeof window.initialCartCount === 'number') {
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = window.initialCartCount;
        });
    }
});

// Update Product Counts
function updateProductCounts() {
    const counts = {
        all: productsData.length,
        alkaline: productsData.filter(p => p.category === 'alkaline').length,
        mineral: productsData.filter(p => p.category === 'mineral').length,
        purified: productsData.filter(p => p.category === 'purified').length,
        sparkling: productsData.filter(p => p.category === 'sparkling').length
    };

    Object.keys(counts).forEach(category => {
        const countElement = document.getElementById(`count-${category}`);
        if (countElement) {
            countElement.textContent = counts[category];
        }
    });
}

// Filter Products
function filterProducts() {
    filteredProducts = productsData.filter(product => {
        const matchesCategory = currentFilter === 'all' || product.category === currentFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    sortProducts();
    renderProducts();
}

// Sort Products
function sortProducts() {
    switch (currentSort) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
    }
}

// Render Products
function renderProducts() {
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        emptyState.style.display = 'flex';
        productsGrid.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    productsGrid.style.display = 'grid';

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);

    card.innerHTML = `
        ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='../../Assets/placeholder.png'">
        </div>
        <div class="product-info">
            <span class="product-category">${getCategoryName(product.category)}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
        </div>
        <div class="product-footer">
            <div class="product-price">
                ₱${product.price.toFixed(2)}
                <span class="product-price-unit">/${product.size}</span>
            </div>
            <button class="btn-add-cart" onclick="addToCart(${product.id})" aria-label="Add ${product.name} to cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
            </button>
        </div>
    `;

    return card;
}

// Get Category Display Name
function getCategoryName(category) {
    const names = {
        alkaline: 'Alkaline Water',
        mineral: 'Mineral Water',
        purified: 'Purified Water',
        sparkling: 'Sparkling Water'
    };
    return names[category] || category;
}

// Event Listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-category');
        filterProducts();
    });
});

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterProducts();
    });
}

if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortProducts();
        renderProducts();
    });
}

// Quick View Modal
function openQuickView(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalSubtitle').textContent = product.subcategory;
    document.getElementById('modalPrice').innerHTML = `<span class="price-amount">₱${product.price.toFixed(2)}</span><span class="price-unit">/ ${product.size}</span>`;
    document.getElementById('modalDescription').textContent = product.description;
    
    const badge = document.getElementById('modalBadge');
    if (product.featured) {
        badge.textContent = 'Featured';
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }

    const specs = document.getElementById('modalSpecs');
    specs.innerHTML = `
        <div class="spec-item">
            <span class="spec-label">Category:</span>
            <span class="spec-value">${getCategoryName(product.category)}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">Size:</span>
            <span class="spec-value">${product.size}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">Type:</span>
            <span class="spec-value">${product.subcategory}</span>
        </div>
    `;

    document.getElementById('quantityInput').value = 1;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    modal.dataset.productId = productId;
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

// Close modal when clicking overlay
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

// Quantity Controls
function changeQuantity(delta) {
    const input = document.getElementById('quantityInput');
    const currentValue = parseInt(input.value) || 1;
    const newValue = Math.max(1, Math.min(99, currentValue + delta));
    input.value = newValue;
}

// Helper function to update cart count
async function updateCartCount() {
    try {
        // Assuming a shared endpoint /Guest%20Page/php/get_cart_count.php exists or 
        // the endpoint is correct relative to the current products.php
        const response = await fetch('../php/get_cart_count.php');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        if (data.success) {
            const count = parseInt(data.count) || 0;
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = count;
            });
            window.initialCartCount = count;
        } else {
            throw new Error(data.error || 'Failed to update cart count');
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
        if (typeof window.initialCartCount === 'number') {
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = window.initialCartCount;
            });
        }
    }
}

// Add to Cart
async function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    try {
        const response = await fetch('../php/add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                productId: productId,
                quantity: 1 
            })
        });

        const data = await response.json();

        if (data.success) {
            // Update cart count using the count returned by the server
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = data.count;
            });
            showNotification('Item added to cart successfully');
        } else if (data.error === 'not_logged_in' || data.redirect) {
            // Handle unauthenticated user
            if (confirm('Please log in to add items to your cart. Would you like to log in now?')) {
                // Save current product to localStorage for after login
                localStorage.setItem('pendingCartItem', JSON.stringify({ productId, quantity: 1 }));
                window.location.href = data.redirect || '../../LogIn/LogIn.php';
            }
        } else {
            throw new Error(data.message || 'Failed to add item to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add item to cart');
    }
}

// Add to Cart from Modal
async function addToCartFromModal() {
    const productId = parseInt(modal.dataset.productId, 10);
    const quantity = parseInt(document.getElementById('quantityInput').value, 10) || 1;
    
    try {
        const response = await fetch('../php/add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                productId: productId,
                quantity: quantity 
            })
        });

        const data = await response.json();

        if (data.success) {
             // Update cart count using the count returned by the server
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = data.count;
            });
            showNotification('Item added to cart successfully');
            closeModal();
        } else if (data.error === 'not_logged_in' || data.redirect) {
             // Handle unauthenticated user
            if (confirm('Please log in to add items to your cart. Would you like to log in now?')) {
                // Save current product to localStorage for after login
                localStorage.setItem('pendingCartItem', JSON.stringify({ productId, quantity }));
                window.location.href = data.redirect || '../../LogIn/LogIn.php';
            }
        } else {
            throw new Error(data.message || 'Failed to add item to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add item to cart');
        closeModal();
    }
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Clear Filters
function clearAllFilters() {
    currentFilter = 'all';
    searchQuery = '';
    currentSort = 'name-asc';
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    filterButtons[0].classList.add('active');
    searchInput.value = '';
    sortSelect.value = 'name-asc';
    
    filterProducts();
}

// Helper Functions
function showLoading() {
    if (loadingState) {
        loadingState.style.display = 'flex';
        loadingState.setAttribute('aria-busy', 'true');
    }
}

function hideLoading() {
    if (loadingState) {
        loadingState.style.display = 'none';
        loadingState.setAttribute('aria-busy', 'false');
    }
}

function showError(message) {
    if (emptyState) {
        emptyState.style.display = 'flex';
        emptyState.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Error Loading Products</h3>
            <p>${message}</p>
            <button class="btn-primary" onclick="fetchProducts()">Try Again</button>
        `;
    }
}