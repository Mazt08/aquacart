/* ========================================
   USERS MANAGEMENT - JAVASCRIPT
   Interactive Features & Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initUsersPage();
});

function initUsersPage() {
    initSearch();
    initFilters();
    initTableActions();
    initModals();
    initPagination();
    initSelectAll();
}

// === Search Functionality ===
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterUsers(searchTerm);
        });
    }
}

function filterUsers(searchTerm) {
    const rows = document.querySelectorAll('#usersTableBody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const name = row.querySelector('.user-name')?.textContent.toLowerCase() || '';
        const email = row.querySelector('.user-email')?.textContent.toLowerCase() || '';
        const phone = row.querySelector('.user-phone')?.textContent.toLowerCase() || '';
        const userId = row.querySelector('.user-id')?.textContent.toLowerCase() || '';
        
        const matches = name.includes(searchTerm) || 
                       email.includes(searchTerm) || 
                       phone.includes(searchTerm) ||
                       userId.includes(searchTerm);
        
        if (matches) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    console.log(`Search: "${searchTerm}" - ${visibleCount} users found`);
}

// === Filter Functionality ===
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Status Filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const status = this.getAttribute('data-status');
            filterByStatus(status);
        });
    });
    
    // Sort Select
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortUsers(this.value);
        });
    }
    
    // Refresh Button
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.querySelector('i').style.animation = 'spin 0.5s linear';
            setTimeout(() => {
                this.querySelector('i').style.animation = '';
                showNotification('Users list refreshed!', 'success');
            }, 500);
        });
    }
}

function filterByStatus(status) {
    const rows = document.querySelectorAll('#usersTableBody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        
        if (status === 'all' || rowStatus === status) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    console.log(`Filter: ${status} - ${visibleCount} users visible`);
}

function sortUsers(sortBy) {
    const tbody = document.getElementById('usersTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        switch(sortBy) {
            case 'newest':
                return parseInt(b.getAttribute('data-user-id')) - parseInt(a.getAttribute('data-user-id'));
            case 'oldest':
                return parseInt(a.getAttribute('data-user-id')) - parseInt(b.getAttribute('data-user-id'));
            case 'name':
                const nameA = a.querySelector('.user-name').textContent;
                const nameB = b.querySelector('.user-name').textContent;
                return nameA.localeCompare(nameB);
            case 'orders':
                const ordersA = parseInt(a.querySelector('.orders-badge').textContent);
                const ordersB = parseInt(b.querySelector('.orders-badge').textContent);
                return ordersB - ordersA;
            default:
                return 0;
        }
    });
    
    rows.forEach(row => tbody.appendChild(row));
    showNotification(`Sorted by: ${sortBy}`, 'info');
}

// === Table Actions ===
function initTableActions() {
    const viewButtons = document.querySelectorAll('.view-user');
    const suspendButtons = document.querySelectorAll('.suspend-user');
    const activateButtons = document.querySelectorAll('.activate-user');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            viewUserProfile(row);
        });
    });
    
    suspendButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            showSuspendModal(row);
        });
    });
    
    activateButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            showActivateModal(row);
        });
    });
}

let currentUserRow = null;

function viewUserProfile(row) {
    currentUserRow = row;
    const modal = document.getElementById('userProfileModal');
    
    // Get user data
    const userId = row.querySelector('.user-id').textContent;
    const name = row.querySelector('.user-name').textContent;
    const email = row.querySelector('.user-email').textContent;
    const phone = row.querySelector('.user-phone').textContent;
    const orders = row.querySelector('.orders-badge').textContent;
    const status = row.getAttribute('data-status');
    const joined = row.querySelector('.user-joined').textContent;
    const initials = row.querySelector('.user-avatar').textContent;
    
    // Populate modal
    modal.querySelector('.profile-avatar').textContent = initials;
    modal.querySelector('.profile-name').textContent = name;
    modal.querySelector('.profile-email').textContent = email;
    
    const statusBadge = modal.querySelector('.status-badge');
    statusBadge.className = `status-badge ${status}`;
    statusBadge.innerHTML = status === 'active' 
        ? '<i class="fas fa-check-circle"></i> Active'
        : '<i class="fas fa-ban"></i> Suspended';
    
    // Update details
    const details = modal.querySelectorAll('.detail-value');
    details[0].textContent = userId;
    details[1].textContent = phone;
    details[2].textContent = joined.replace('Joined ', '');
    details[3].textContent = orders;
    
    modal.classList.add('active');
}

function showSuspendModal(row) {
    currentUserRow = row;
    const modal = document.getElementById('suspendUserModal');
    modal.classList.add('active');
}

function showActivateModal(row) {
    currentUserRow = row;
    const modal = document.getElementById('activateUserModal');
    modal.classList.add('active');
}

// === Modal Management ===
function initModals() {
    // Profile Modal
    const profileModal = document.getElementById('userProfileModal');
    const profileCloses = profileModal.querySelectorAll('.modal-close');
    
    profileCloses.forEach(btn => {
        btn.addEventListener('click', () => closeModal(profileModal));
    });
    
    // View Orders Button
    const viewOrdersBtn = document.getElementById('viewOrdersBtn');
    if (viewOrdersBtn) {
        viewOrdersBtn.addEventListener('click', () => {
            closeModal(profileModal);
            showNotification('Redirecting to user orders...', 'info');
            setTimeout(() => {
                window.location.href = 'Orders.html';
            }, 1000);
        });
    }
    
    // Suspend Modal
    const suspendModal = document.getElementById('suspendUserModal');
    const suspendCloses = suspendModal.querySelectorAll('.modal-close');
    const confirmSuspend = document.getElementById('confirmSuspend');
    
    suspendCloses.forEach(btn => {
        btn.addEventListener('click', () => closeModal(suspendModal));
    });
    
    confirmSuspend.addEventListener('click', () => {
        suspendUser();
        closeModal(suspendModal);
    });
    
    // Activate Modal
    const activateModal = document.getElementById('activateUserModal');
    const activateCloses = activateModal.querySelectorAll('.modal-close');
    const confirmActivate = document.getElementById('confirmActivate');
    
    activateCloses.forEach(btn => {
        btn.addEventListener('click', () => closeModal(activateModal));
    });
    
    confirmActivate.addEventListener('click', () => {
        activateUser();
        closeModal(activateModal);
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
    currentUserRow = null;
}

function suspendUser() {
    if (!currentUserRow) return;
    
    const name = currentUserRow.querySelector('.user-name').textContent;
    const reason = document.getElementById('suspendReason').value;
    
    // Update row status
    currentUserRow.setAttribute('data-status', 'suspended');
    
    // Update avatar
    const avatar = currentUserRow.querySelector('.user-avatar');
    avatar.classList.add('suspended');
    
    // Update status badge
    const statusBadge = currentUserRow.querySelector('.status-badge');
    statusBadge.className = 'status-badge suspended';
    statusBadge.innerHTML = '<i class="fas fa-ban"></i> Suspended';
    
    // Change action button
    const actionBtn = currentUserRow.querySelector('.suspend-user');
    actionBtn.className = 'action-icon activate-user';
    actionBtn.title = 'Activate User';
    actionBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
    
    // Reinitialize button
    actionBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const row = this.closest('tr');
        showActivateModal(row);
    });
    
    // Update stats
    updateUserStats();
    
    showNotification(`${name} has been suspended`, 'success');
    console.log('Suspend reason:', reason);
}

function activateUser() {
    if (!currentUserRow) return;
    
    const name = currentUserRow.querySelector('.user-name').textContent;
    
    // Update row status
    currentUserRow.setAttribute('data-status', 'active');
    
    // Update avatar
    const avatar = currentUserRow.querySelector('.user-avatar');
    avatar.classList.remove('suspended');
    
    // Update status badge
    const statusBadge = currentUserRow.querySelector('.status-badge');
    statusBadge.className = 'status-badge active';
    statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Active';
    
    // Change action button
    const actionBtn = currentUserRow.querySelector('.activate-user');
    actionBtn.className = 'action-icon suspend-user';
    actionBtn.title = 'Suspend User';
    actionBtn.innerHTML = '<i class="fas fa-ban"></i>';
    
    // Reinitialize button
    actionBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const row = this.closest('tr');
        showSuspendModal(row);
    });
    
    // Update stats
    updateUserStats();
    
    showNotification(`${name} has been activated`, 'success');
}

// === Update Stats ===
function updateUserStats() {
    const allRows = document.querySelectorAll('#usersTableBody tr');
    const activeRows = document.querySelectorAll('#usersTableBody tr[data-status="active"]');
    const suspendedRows = document.querySelectorAll('#usersTableBody tr[data-status="suspended"]');
    
    const statCards = document.querySelectorAll('.user-stats .stat-value');
    statCards[1].textContent = activeRows.length;
    statCards[2].textContent = suspendedRows.length;
    
    // Update filter counts
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons[1].querySelector('.count').textContent = activeRows.length;
    filterButtons[2].querySelector('.count').textContent = suspendedRows.length;
}

// === Pagination ===
function initPagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            showNotification('Loading next page...', 'info');
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            showNotification('Loading previous page...', 'info');
        });
    }
    
    pageNumbers.forEach(btn => {
        btn.addEventListener('click', function() {
            pageNumbers.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showNotification(`Loading page ${this.textContent}...`, 'info');
        });
    });
}

// === Select All ===
function initSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            
            if (isChecked) {
                showNotification(`${rowCheckboxes.length} users selected`, 'info');
            }
        });
    }
    
    // Update select all state when individual checkboxes change
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
        });
    });
}

// === Export Users ===
const exportBtn = document.getElementById('exportUsersBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', function() {
        exportUsers();
    });
}

function exportUsers() {
    const rows = document.querySelectorAll('#usersTableBody tr');
    let csvContent = 'User ID,Name,Email,Phone,Orders,Status\n';
    
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const userId = row.querySelector('.user-id').textContent;
            const name = row.querySelector('.user-name').textContent;
            const email = row.querySelector('.user-email').textContent;
            const phone = row.querySelector('.user-phone').textContent;
            const orders = row.querySelector('.orders-badge').textContent;
            const status = row.getAttribute('data-status');
            
            csvContent += `${userId},"${name}","${email}","${phone}","${orders}",${status}\n`;
        }
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquacart-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Users exported successfully!', 'success');
}

// === Add User (placeholder) ===
const addUserBtn = document.getElementById('addUserBtn');
if (addUserBtn) {
    addUserBtn.addEventListener('click', function() {
        showNotification('Add User feature coming soon!', 'info');
    });
}

// === Utility Functions ===
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
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
    @keyframes spin {
        from { transform: rotate(0deg); }
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

console.log('✅ Users Management initialized successfully');
