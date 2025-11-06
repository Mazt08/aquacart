/* ========================================
   PRODUCTS MANAGEMENT - JAVASCRIPT
   Interactive Features & Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
});

function initProductsPage() {
    initSearch();
    initAddProduct();
    initEditProducts();
    initDeleteProducts();
    initImageUpload();
    initClearOutOfStock();
    initModals();
}

// === Search Functionality ===
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterProducts(searchTerm);
        });
    }
}

function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        const productDesc = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// === Add Product ===
function initAddProduct() {
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const productForm = document.getElementById('productForm');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            modalTitle.textContent = 'Add New Product';
            productForm.reset();
            clearImagePreview();
            productModal.classList.add('active');
        });
    }
    
    // Form submission
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }
}

function saveProduct() {
    const formData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        stock: document.getElementById('productStock').value,
        image: document.getElementById('productImage').files[0]
    };
    
    console.log('Saving product:', formData);
    
    // Create new product card
    createProductCard(formData);
    
    // Close modal
    closeModal(document.getElementById('productModal'));
    
    // Show success notification
    showNotification('Product added successfully!', 'success');
}

function createProductCard(data) {
    const productsGrid = document.querySelector('.products-grid');
    const newProductId = Date.now();
    
    // Determine stock badge
    let stockBadge = '';
    if (data.stock > 50) {
        stockBadge = '<div class="stock-badge in-stock"><i class="fas fa-check"></i> In Stock</div>';
    } else if (data.stock > 0) {
        stockBadge = '<div class="stock-badge low-stock"><i class="fas fa-exclamation-triangle"></i> Low Stock</div>';
    } else {
        stockBadge = '<div class="stock-badge out-of-stock"><i class="fas fa-times"></i> Out of Stock</div>';
    }
    
    const productCard = `
        <div class="product-card glass-card" data-product-id="${newProductId}">
            <div class="product-image">
                <img src="https://via.placeholder.com/300x400/00A9D6/ffffff?text=${encodeURIComponent(data.name)}" alt="${data.name}">
                ${stockBadge}
            </div>
            <div class="product-info">
                <h3 class="product-name">${data.name}</h3>
                <p class="product-description">${data.description || 'No description available'}</p>
                <div class="product-details">
                    <div class="product-price">₱${parseFloat(data.price).toFixed(2)}</div>
                    <div class="product-stock ${data.stock < 20 ? 'warning' : ''}">
                        <i class="fas fa-box"></i>
                        <span>${data.stock} units</span>
                    </div>
                </div>
                <div class="product-category">
                    <span class="category-badge">${data.category}</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="action-icon edit-product" title="Edit Product">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-icon delete-product" title="Delete Product">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    productsGrid.insertAdjacentHTML('afterbegin', productCard);
    
    // Reinitialize event listeners for new card
    const newCard = productsGrid.querySelector(`[data-product-id="${newProductId}"]`);
    initCardActions(newCard);
    
    // Update stats
    updateInventoryStats();
}

// === Edit Products ===
function initEditProducts() {
    const editBtns = document.querySelectorAll('.edit-product');
    editBtns.forEach(btn => initEditButton(btn));
}

function initEditButton(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.product-card');
        const productId = card.getAttribute('data-product-id');
        editProduct(card);
    });
}

function editProduct(card) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Edit Product';
    
    // Populate form with existing data
    const name = card.querySelector('.product-name').textContent;
    const description = card.querySelector('.product-description').textContent;
    const price = card.querySelector('.product-price').textContent.replace('₱', '');
    const stock = card.querySelector('.product-stock span').textContent.replace(' units', '');
    const category = card.querySelector('.category-badge').textContent;
    
    document.getElementById('productName').value = name;
    document.getElementById('productDescription').value = description;
    document.getElementById('productPrice').value = price;
    document.getElementById('productStock').value = stock;
    document.getElementById('productCategory').value = category.toLowerCase();
    
    // Store product ID for update
    modal.setAttribute('data-edit-id', card.getAttribute('data-product-id'));
    
    modal.classList.add('active');
}

// === Delete Products ===
function initDeleteProducts() {
    const deleteBtns = document.querySelectorAll('.delete-product');
    deleteBtns.forEach(btn => initDeleteButton(btn));
}

function initDeleteButton(btn) {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.product-card');
        const productId = card.getAttribute('data-product-id');
        showDeleteModal(productId);
    });
}

function showDeleteModal(productId) {
    const modal = document.getElementById('deleteProductModal');
    modal.setAttribute('data-product-id', productId);
    modal.classList.add('active');
}

function deleteProduct(productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    
    if (card) {
        card.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            card.remove();
            updateInventoryStats();
            showNotification('Product deleted successfully!', 'success');
        }, 300);
    }
}

// === Image Upload ===
function initImageUpload() {
    const uploadArea = document.querySelector('.image-upload-area');
    const fileInput = document.getElementById('productImage');
    const removeBtn = document.getElementById('removeImage');
    
    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File selected
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--color-aqua)';
            uploadArea.style.background = 'rgba(77, 208, 225, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                fileInput.files = e.dataTransfer.files;
                handleImageUpload(file);
            }
        });
        
        // Remove image
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearImagePreview();
            });
        }
    }
}

function handleImageUpload(file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }
    
    // Read and display image
    const reader = new FileReader();
    reader.onload = function(e) {
        const placeholder = document.getElementById('uploadPlaceholder');
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImage');
        
        previewImg.src = e.target.result;
        placeholder.style.display = 'none';
        preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function clearImagePreview() {
    const fileInput = document.getElementById('productImage');
    const placeholder = document.getElementById('uploadPlaceholder');
    const preview = document.getElementById('imagePreview');
    
    fileInput.value = '';
    placeholder.style.display = '';
    preview.style.display = 'none';
}

// === Clear Out of Stock ===
function initClearOutOfStock() {
    const clearBtn = document.getElementById('clearOutOfStockBtn');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const outOfStockCards = document.querySelectorAll('.stock-badge.out-of-stock');
            
            if (outOfStockCards.length === 0) {
                showNotification('No out-of-stock products found', 'info');
                return;
            }
            
            if (confirm(`Remove ${outOfStockCards.length} out-of-stock product(s)?`)) {
                outOfStockCards.forEach(badge => {
                    const card = badge.closest('.product-card');
                    card.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => card.remove(), 300);
                });
                
                setTimeout(() => {
                    updateInventoryStats();
                    showNotification('Out-of-stock products removed!', 'success');
                }, 350);
            }
        });
    }
}

// === Modal Management ===
function initModals() {
    // Product Modal
    const productModal = document.getElementById('productModal');
    const productCloses = productModal.querySelectorAll('.modal-close, #cancelProductBtn');
    
    productCloses.forEach(btn => {
        btn.addEventListener('click', () => closeModal(productModal));
    });
    
    // Delete Modal
    const deleteModal = document.getElementById('deleteProductModal');
    const deleteCloses = deleteModal.querySelectorAll('.modal-close, .btn-secondary');
    const confirmDeleteBtn = document.getElementById('confirmDeleteProduct');
    
    deleteCloses.forEach(btn => {
        btn.addEventListener('click', () => closeModal(deleteModal));
    });
    
    confirmDeleteBtn.addEventListener('click', () => {
        const productId = deleteModal.getAttribute('data-product-id');
        deleteProduct(productId);
        closeModal(deleteModal);
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// === Initialize Card Actions ===
function initCardActions(card) {
    const editBtn = card.querySelector('.edit-product');
    const deleteBtn = card.querySelector('.delete-product');
    
    if (editBtn) initEditButton(editBtn);
    if (deleteBtn) initDeleteButton(deleteBtn);
}

// === Update Inventory Stats ===
function updateInventoryStats() {
    const allProducts = document.querySelectorAll('.product-card');
    const inStock = document.querySelectorAll('.stock-badge.in-stock').length;
    const lowStock = document.querySelectorAll('.stock-badge.low-stock').length;
    const outOfStock = document.querySelectorAll('.stock-badge.out-of-stock').length;
    
    // Update stat cards
    const statCards = document.querySelectorAll('.inventory-stats .stat-card');
    statCards[0].querySelector('.stat-value').textContent = allProducts.length;
    statCards[1].querySelector('.stat-value').textContent = inStock;
    statCards[2].querySelector('.stat-value').textContent = lowStock;
    statCards[3].querySelector('.stat-value').textContent = outOfStock;
}

// === Utility Functions ===
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create toast notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    let bgColor = 'linear-gradient(135deg, var(--color-aqua), var(--color-light-aqua))';
    if (type === 'error') {
        bgColor = 'linear-gradient(135deg, #E74C3C, #C0392B)';
    } else if (type === 'success') {
        bgColor = 'linear-gradient(135deg, #27AE60, #229954)';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${bgColor};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to { opacity: 0; transform: scale(0.95); }
    }
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('✅ Products Management initialized successfully');
