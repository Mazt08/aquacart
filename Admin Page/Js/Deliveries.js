/* ========================================
   DELIVERIES MANAGEMENT - JAVASCRIPT
   Interactive Features & Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initDeliveriesPage();
});

function initDeliveriesPage() {
    initSearch();
    initFilters();
    initCardActions();
    initModal();
    initRefresh();
}

// === Search Functionality ===
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterDeliveries(searchTerm);
        });
    }
}

function filterDeliveries(searchTerm) {
    const cards = document.querySelectorAll('.delivery-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const deliveryId = card.getAttribute('data-delivery-id')?.toLowerCase() || '';
        const driverName = card.querySelector('.driver-name')?.textContent.toLowerCase() || '';
        const location = card.querySelector('.detail-row:nth-child(2) span')?.textContent.toLowerCase() || '';
        
        const matches = deliveryId.includes(searchTerm) || 
                       driverName.includes(searchTerm) || 
                       location.includes(searchTerm);
        
        if (matches) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`Search: "${searchTerm}" - ${visibleCount} deliveries found`);
}

// === Filter Functionality ===
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const zoneSelect = document.getElementById('zoneSelect');
    
    // Status Filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const status = this.getAttribute('data-status');
            filterByStatus(status);
        });
    });
    
    // Zone Filter
    if (zoneSelect) {
        zoneSelect.addEventListener('change', function() {
            const zone = this.value;
            filterByZone(zone);
        });
    }
}

function filterByStatus(status) {
    const cards = document.querySelectorAll('.delivery-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        
        if (status === 'all' || cardStatus === status) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`Filter: ${status} - ${visibleCount} deliveries visible`);
}

function filterByZone(zone) {
    if (zone === 'all') {
        document.querySelectorAll('.delivery-card').forEach(card => {
            card.style.display = '';
        });
        showNotification('Showing all zones', 'info');
        return;
    }
    
    showNotification(`Filtered by zone: ${zone}`, 'info');
}

// === Card Actions ===
function initCardActions() {
    // Track Buttons
    const trackButtons = document.querySelectorAll('.track-btn:not(.disabled)');
    trackButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.delivery-card');
            const deliveryId = card.getAttribute('data-delivery-id');
            trackDelivery(deliveryId);
        });
    });
    
    // Contact Buttons
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.delivery-card');
            const driverName = card.querySelector('.driver-name').textContent;
            contactDriver(driverName);
        });
    });
    
    // Details Buttons
    const detailsButtons = document.querySelectorAll('.details-btn');
    detailsButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.delivery-card');
            showDeliveryDetails(card);
        });
    });
    
    // Assign Buttons
    const assignButtons = document.querySelectorAll('.assign-btn');
    assignButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.delivery-card');
            assignDriver(card);
        });
    });
}

function trackDelivery(deliveryId) {
    showNotification(`Tracking ${deliveryId} on map...`, 'info');
    console.log('Track delivery:', deliveryId);
}

function contactDriver(driverName) {
    showNotification(`Calling ${driverName}...`, 'info');
    console.log('Contact driver:', driverName);
}

function assignDriver(card) {
    const deliveryId = card.getAttribute('data-delivery-id');
    
    // Simulate driver assignment
    const drivers = ['Carlos Mendoza', 'Maria Santos', 'Roberto Cruz', 'Anna Reyes'];
    const vehicles = ['ABC-1234', 'XYZ-5678', 'DEF-9012', 'GHI-3456'];
    const randomIndex = Math.floor(Math.random() * drivers.length);
    
    const driverName = drivers[randomIndex];
    const vehicleNo = vehicles[randomIndex];
    
    // Update card
    card.setAttribute('data-status', 'on-route');
    
    // Update avatar
    const avatar = card.querySelector('.driver-avatar');
    avatar.classList.remove('unassigned');
    
    // Update driver info
    card.querySelector('.driver-name').textContent = driverName;
    card.querySelector('.vehicle-no').innerHTML = `<i class="fas fa-car"></i> ${vehicleNo}`;
    
    // Update status badge
    const statusBadge = card.querySelector('.status-badge');
    statusBadge.className = 'status-badge on-route';
    statusBadge.innerHTML = '<i class="fas fa-truck"></i> On Route';
    
    // Update time info
    const timeRow = card.querySelector('.detail-row.time');
    timeRow.innerHTML = '<i class="fas fa-clock"></i><span>ETA: 30 mins</span>';
    
    // Update progress
    const progressFill = card.querySelector('.progress-fill');
    progressFill.style.width = '10%';
    
    // Update footer buttons
    const footer = card.querySelector('.card-footer');
    footer.innerHTML = `
        <button class="card-btn track-btn">
            <i class="fas fa-map-marker-alt"></i>
            Track
        </button>
        <button class="card-btn contact-btn">
            <i class="fas fa-phone"></i>
            Contact
        </button>
        <button class="card-btn details-btn">
            <i class="fas fa-info-circle"></i>
            Details
        </button>
    `;
    
    // Reinitialize buttons
    initCardActions();
    
    // Update stats
    updateDeliveryStats();
    
    showNotification(`${driverName} assigned to ${deliveryId}`, 'success');
    
    // Animate progress over time
    animateProgress(progressFill);
}

function animateProgress(progressFill) {
    let currentWidth = parseInt(progressFill.style.width) || 10;
    const interval = setInterval(() => {
        if (currentWidth < 100) {
            currentWidth += 5;
            progressFill.style.width = currentWidth + '%';
        } else {
            clearInterval(interval);
        }
    }, 3000);
}

// === Modal Management ===
function initModal() {
    const modal = document.getElementById('deliveryDetailsModal');
    const closeButtons = modal.querySelectorAll('.modal-close');
    const trackOnMapBtn = document.getElementById('trackOnMapBtn');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => closeModal(modal));
    });
    
    if (trackOnMapBtn) {
        trackOnMapBtn.addEventListener('click', () => {
            closeModal(modal);
            showNotification('Opening map view...', 'info');
        });
    }
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(this);
        }
    });
}

function showDeliveryDetails(card) {
    const modal = document.getElementById('deliveryDetailsModal');
    
    // Get card data
    const deliveryId = card.getAttribute('data-delivery-id');
    const driverName = card.querySelector('.driver-name').textContent;
    const vehicleNo = card.querySelector('.vehicle-no').textContent.replace(/\s+/g, ' ').trim();
    const status = card.getAttribute('data-status');
    
    // Populate modal
    document.getElementById('modalDeliveryId').textContent = deliveryId;
    document.getElementById('modalDriverName').textContent = driverName;
    document.getElementById('modalVehicle').textContent = vehicleNo.replace('', '').trim();
    
    // Update status badge
    const modalStatus = document.getElementById('modalStatus');
    modalStatus.className = `status-badge ${status}`;
    
    if (status === 'on-route') {
        modalStatus.innerHTML = '<i class="fas fa-truck"></i> On Route';
    } else if (status === 'completed') {
        modalStatus.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
    } else {
        modalStatus.innerHTML = '<i class="fas fa-clock"></i> Pending';
    }
    
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// === Update Stats ===
function updateDeliveryStats() {
    const allCards = document.querySelectorAll('.delivery-card');
    const onRouteCards = document.querySelectorAll('.delivery-card[data-status="on-route"]');
    const completedCards = document.querySelectorAll('.delivery-card[data-status="completed"]');
    const pendingCards = document.querySelectorAll('.delivery-card[data-status="pending"]');
    
    const statCards = document.querySelectorAll('.delivery-stats .stat-value');
    statCards[0].textContent = onRouteCards.length;
    statCards[1].textContent = completedCards.length;
    statCards[2].textContent = pendingCards.length;
    
    // Update filter counts
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons[0].querySelector('.count').textContent = allCards.length;
    filterButtons[1].querySelector('.count').textContent = onRouteCards.length;
    filterButtons[2].querySelector('.count').textContent = completedCards.length;
    filterButtons[3].querySelector('.count').textContent = pendingCards.length;
}

// === Refresh ===
function initRefresh() {
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 0.6s linear';
            
            setTimeout(() => {
                icon.style.animation = '';
                showNotification('Deliveries refreshed!', 'success');
                updateDeliveryStats();
            }, 600);
        });
    }
}

// === Schedule Delivery (Placeholder) ===
const scheduleBtn = document.getElementById('scheduleDeliveryBtn');
if (scheduleBtn) {
    scheduleBtn.addEventListener('click', function() {
        showNotification('Schedule Delivery feature coming soon!', 'info');
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

// === Real-time Updates Simulation ===
function simulateRealTimeUpdates() {
    setInterval(() => {
        const onRouteCards = document.querySelectorAll('.delivery-card[data-status="on-route"]');
        
        onRouteCards.forEach(card => {
            const progressFill = card.querySelector('.progress-fill');
            let currentWidth = parseInt(progressFill.style.width) || 0;
            
            if (currentWidth < 100) {
                currentWidth += Math.floor(Math.random() * 5) + 1;
                if (currentWidth > 100) currentWidth = 100;
                progressFill.style.width = currentWidth + '%';
                
                // Update ETA
                const timeRow = card.querySelector('.detail-row.time span');
                if (timeRow && currentWidth < 100) {
                    const remainingMins = Math.ceil((100 - currentWidth) * 0.5);
                    timeRow.textContent = `ETA: ${remainingMins} mins`;
                }
                
                // Mark as completed if progress reaches 100%
                if (currentWidth === 100) {
                    markAsCompleted(card);
                }
            }
        });
    }, 5000); // Update every 5 seconds
}

function markAsCompleted(card) {
    card.setAttribute('data-status', 'completed');
    
    // Update status badge
    const statusBadge = card.querySelector('.status-badge');
    statusBadge.className = 'status-badge completed';
    statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
    
    // Update time info
    const timeRow = card.querySelector('.detail-row.time');
    timeRow.innerHTML = '<i class="fas fa-check"></i><span>Delivered just now</span>';
    
    // Update progress
    const progressFill = card.querySelector('.progress-fill');
    progressFill.classList.add('complete');
    
    // Disable track button
    const trackBtn = card.querySelector('.track-btn');
    if (trackBtn) {
        trackBtn.classList.add('disabled');
    }
    
    // Update stats
    updateDeliveryStats();
    
    showNotification(`Delivery ${card.getAttribute('data-delivery-id')} completed!`, 'success');
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

// Start real-time updates simulation
simulateRealTimeUpdates();

console.log('✅ Deliveries Management initialized successfully');
