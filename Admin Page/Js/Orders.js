/* ========================================
   ORDERS MANAGEMENT - JAVASCRIPT
   Interactive Features & Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initOrdersPage();
});

function initOrdersPage() {
    initSearch();
    initFilters();
    initTableActions();
    initModals();
    initPagination();
    initSelectAll();
    initExportRefresh();
}

// === Search Functionality ===
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterOrders(searchTerm);
        });
    }
}

function filterOrders(searchTerm) {
    const rows = document.querySelectorAll('.orders-table tbody tr');
    
    rows.forEach(row => {
        const orderId = row.querySelector('.order-id').textContent.toLowerCase();
        const customerName = row.querySelector('.customer-name').textContent.toLowerCase();
        
        if (orderId.includes(searchTerm) || customerName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// === Filter Buttons ===
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const status = this.getAttribute('data-status');
            filterByStatus(status);
        });
    });
}

function filterByStatus(status) {
    const rows = document.querySelectorAll('.orders-table tbody tr');
    
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge && statusBadge.classList.contains(status)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// === Table Actions ===
function initTableActions() {
    // View Details
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.getAttribute('data-order-id');
            showOrderDetails(orderId);
        });
    });
    
    // Update Status
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                const row = this.closest('tr');
                const orderId = row.getAttribute('data-order-id');
                showUpdateStatusModal(orderId);
            }
        });
    });
    
    // Delete Order
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.getAttribute('data-order-id');
            showDeleteModal(orderId);
        });
    });
}

// === Modal Functions ===
function initModals() {
    // Order Details Modal
    const detailsModal = document.getElementById('orderDetailsModal');
    const detailsClose = detailsModal.querySelector('.modal-close');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const printBtn = document.getElementById('modalPrintBtn');
    
    detailsClose.addEventListener('click', () => closeModal(detailsModal));
    cancelBtn.addEventListener('click', () => closeModal(detailsModal));
    printBtn.addEventListener('click', () => printReceipt());
    
    // Update Status Modal
    const statusModal = document.getElementById('updateStatusModal');
    const statusCloses = statusModal.querySelectorAll('.modal-close, .btn-secondary');
    const updateBtn = statusModal.querySelector('.btn-primary');
    
    statusCloses.forEach(btn => {
        btn.addEventListener('click', () => closeModal(statusModal));
    });
    
    updateBtn.addEventListener('click', () => updateOrderStatus());
    
    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const deleteCloses = deleteModal.querySelectorAll('.modal-close, .btn-secondary');
    const confirmDeleteBtn = deleteModal.querySelector('.btn-danger');
    
    deleteCloses.forEach(btn => {
        btn.addEventListener('click', () => closeModal(deleteModal));
    });
    
    confirmDeleteBtn.addEventListener('click', () => deleteOrder());
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

function showOrderDetails(orderId) {
    const modal = document.getElementById('orderDetailsModal');
    modal.classList.add('active');
    console.log('Showing order details for:', orderId);
    // Populate modal with order data
}

function showUpdateStatusModal(orderId) {
    const modal = document.getElementById('updateStatusModal');
    modal.classList.add('active');
    modal.setAttribute('data-order-id', orderId);
    console.log('Update status for order:', orderId);
}

function showDeleteModal(orderId) {
    const modal = document.getElementById('deleteModal');
    modal.classList.add('active');
    modal.setAttribute('data-order-id', orderId);
    console.log('Delete order:', orderId);
}

function closeModal(modal) {
    modal.classList.remove('active');
}

function printReceipt() {
    console.log('Printing receipt...');
    window.print();
}

function updateOrderStatus() {
    const modal = document.getElementById('updateStatusModal');
    const orderId = modal.getAttribute('data-order-id');
    const newStatus = document.getElementById('statusSelect').value;
    
    console.log('Updating order', orderId, 'to status:', newStatus);
    
    // Update the status badge in the table
    const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
    if (row) {
        const statusBadge = row.querySelector('.status-badge');
        statusBadge.className = 'status-badge ' + newStatus;
        
        // Update icon and text based on status
        let icon = '';
        let text = '';
        
        switch(newStatus) {
            case 'processing':
                icon = '<i class="fas fa-spinner"></i>';
                text = 'Processing';
                break;
            case 'delivery':
                icon = '<i class="fas fa-truck"></i>';
                text = 'Out for Delivery';
                break;
            case 'delivered':
                icon = '<i class="fas fa-check-circle"></i>';
                text = 'Delivered';
                break;
            case 'cancelled':
                icon = '<i class="fas fa-times-circle"></i>';
                text = 'Cancelled';
                break;
        }
        
        statusBadge.innerHTML = icon + text;
    }
    
    // Show notification
    showNotification('Order status updated successfully!', 'success');
    
    closeModal(modal);
}

function deleteOrder() {
    const modal = document.getElementById('deleteModal');
    const orderId = modal.getAttribute('data-order-id');
    
    console.log('Deleting order:', orderId);
    
    // Remove row from table
    const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
    if (row) {
        row.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            row.remove();
            updateOrderCounts();
        }, 300);
    }
    
    showNotification('Order deleted successfully!', 'success');
    closeModal(modal);
}

// === Pagination ===
function initPagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNums = document.querySelectorAll('.page-num');
    
    prevBtn.addEventListener('click', () => {
        console.log('Previous page');
        // Implement pagination logic
    });
    
    nextBtn.addEventListener('click', () => {
        console.log('Next page');
        // Implement pagination logic
    });
    
    pageNums.forEach(btn => {
        btn.addEventListener('click', function() {
            pageNums.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const pageNum = this.textContent;
            console.log('Go to page:', pageNum);
            // Implement pagination logic
        });
    });
}

// === Select All Checkbox ===
function initSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            updateBulkActions();
        });
    }
    
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectAll();
            updateBulkActions();
        });
    });
}

function updateSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    
    selectAllCheckbox.checked = rowCheckboxes.length === checkedBoxes.length;
}

function updateBulkActions() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    console.log('Selected orders:', checkedBoxes.length);
    // Show/hide bulk action buttons
}

// === Export & Refresh ===
function initExportRefresh() {
    const exportBtn = document.getElementById('exportBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            console.log('Exporting orders...');
            exportOrders();
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.querySelector('i').style.animation = 'spin 1s linear';
            console.log('Refreshing orders...');
            setTimeout(() => {
                this.querySelector('i').style.animation = '';
                showNotification('Orders refreshed!', 'success');
            }, 1000);
        });
    }
}

function exportOrders() {
    // Get visible orders
    const visibleRows = Array.from(document.querySelectorAll('.orders-table tbody tr'))
        .filter(row => row.style.display !== 'none');
    
    console.log('Exporting', visibleRows.length, 'orders');
    
    // Create CSV data
    let csvContent = 'Order ID,Customer,Email,Total,Date,Status\n';
    
    visibleRows.forEach(row => {
        const orderId = row.querySelector('.order-id').textContent;
        const customerName = row.querySelector('.customer-name').textContent;
        const customerEmail = row.querySelector('.customer-email').textContent;
        const total = row.querySelector('.order-total').textContent;
        const date = row.querySelector('.order-date').textContent;
        const status = row.querySelector('.status-badge').textContent.trim();
        
        csvContent += `${orderId},"${customerName}","${customerEmail}",${total},${date},${status}\n`;
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Orders exported successfully!', 'success');
}

// === Update Order Counts ===
function updateOrderCounts() {
    const allCount = document.querySelectorAll('.orders-table tbody tr').length;
    const processingCount = document.querySelectorAll('.status-badge.processing').length;
    const deliveryCount = document.querySelectorAll('.status-badge.delivery').length;
    const deliveredCount = document.querySelectorAll('.status-badge.delivered').length;
    const cancelledCount = document.querySelectorAll('.status-badge.cancelled').length;
    
    // Update filter counts
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        const status = btn.getAttribute('data-status');
        const countSpan = btn.querySelector('.filter-count');
        
        switch(status) {
            case 'all':
                countSpan.textContent = allCount;
                break;
            case 'processing':
                countSpan.textContent = processingCount;
                break;
            case 'delivery':
                countSpan.textContent = deliveryCount;
                break;
            case 'delivered':
                countSpan.textContent = deliveredCount;
                break;
            case 'cancelled':
                countSpan.textContent = cancelledCount;
                break;
        }
    });
}

// === Utility Functions ===
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Create toast notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: linear-gradient(135deg, var(--color-aqua), var(--color-light-aqua));
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 169, 214, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
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
    @keyframes spin {
        to { transform: rotate(360deg); }
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

console.log('✅ Orders Management initialized successfully');
