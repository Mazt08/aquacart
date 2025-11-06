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
        const response = await fetch('../php/Products.php?action=getProducts');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Debug response
        console.log('API Response:', data);
        
        if (data.error) {
            throw new Error(data.message || 'Failed to fetch products');
        }
        
        // Transform the data to match the expected structure
        productsData = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category?.toLowerCase() || '', // Database category field
            description: item.description || '',
            price: item.price || 0,
            size: item.size || '',
            image: item.image || '',
            featured: item.featured || false,
            subcategory: item.subcategory || ''
        }));
        
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

// Create mobile overlay if doesn't exist
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

// Close mobile menu when clicking nav links
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
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
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

// Add to Cart
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Guest restriction
    showLoginPrompt();
}

function addToCartFromModal() {
    // Guest restriction
    showLoginPrompt();
    closeModal();
}

// Show Login Prompt for Guests
function showLoginPrompt() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification login-prompt';
    notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        <span>Please log in to add items to cart</span>
        <a href="../../LogIn/LogIn.php" class="login-link">Log In</a>
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
    }, 4000);
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

// Footer filter links
function filterByCategory(category) {
    currentFilter = category;
    filterButtons.forEach(btn => btn.classList.remove('active'));
    const targetButton = document.querySelector(`[data-category="${category}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    filterProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

console.log('Products page loaded:', productsData.length, 'products');
