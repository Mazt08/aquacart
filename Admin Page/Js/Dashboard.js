/* ========================================
   AQUACART ADMIN DASHBOARD - JAVASCRIPT
   Interactive Features & Chart Initialization
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSidebar();
    initCounters();
    initCharts();
    initMobileMenu();
    initNavRipple();
    initLogout();
});

// === Sidebar Toggle ===
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// === Animated Counter ===
function initCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const prefix = stat.getAttribute('data-prefix') || '';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = prefix + Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = prefix + target.toLocaleString();
            }
        };
        
        // Intersection Observer for animation trigger
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}

// === Charts Initialization ===
function initCharts() {
    initOrdersChart();
    initSalesChart();
    initDeliveryChart();
}

// Orders Trend Chart
function initOrdersChart() {
    const ctx = document.getElementById('ordersChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Orders',
                data: [120, 190, 150, 220, 180, 250, 210],
                borderColor: '#00A9D6',
                backgroundColor: 'rgba(0, 169, 214, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#00A9D6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#12343B',
                    bodyColor: '#12343B',
                    borderColor: '#4DD0E1',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Orders: ' + context.parsed.y;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(77, 208, 225, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#456268',
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#456268',
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
    
    // Chart period buttons
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Sales Breakdown Chart
function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bottles', 'Jugs'],
            datasets: [{
                data: [68, 32],
                backgroundColor: [
                    '#00A9D6',
                    '#00737F'
                ],
                borderColor: '#fff',
                borderWidth: 4,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#12343B',
                    bodyColor: '#12343B',
                    borderColor: '#4DD0E1',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Delivery Performance Chart
function initDeliveryChart() {
    const ctx = document.getElementById('deliveryChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Completed',
                    data: [320, 410, 380, 450, 420, 490, 510, 530, 500, 560, 580, 600],
                    backgroundColor: '#00A9D6',
                    borderRadius: 8,
                    borderSkipped: false
                },
                {
                    label: 'Pending',
                    data: [45, 55, 40, 60, 50, 45, 55, 50, 48, 52, 45, 50],
                    backgroundColor: '#4DD0E1',
                    borderRadius: 8,
                    borderSkipped: false
                },
                {
                    label: 'Failed',
                    data: [12, 15, 10, 18, 14, 12, 16, 14, 13, 15, 12, 14],
                    backgroundColor: '#E74C3C',
                    borderRadius: 8,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#12343B',
                        font: {
                            family: 'Inter',
                            size: 12,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#12343B',
                    bodyColor: '#12343B',
                    borderColor: '#4DD0E1',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' deliveries';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: false,
                    grid: {
                        color: 'rgba(77, 208, 225, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#456268',
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#456268',
                        font: {
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
}

// === Mobile Menu Toggle ===
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-active');
            this.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

// === Navigation Ripple Effect ===
function initNavRipple() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Create ripple effect
            const ripple = this.querySelector('.ripple');
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0';
            ripple.style.height = '0';
            
            // Trigger animation
            setTimeout(() => {
                ripple.style.width = '200px';
                ripple.style.height = '200px';
            }, 10);
        });
    });
}

// === Search Functionality ===
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        // Add search functionality here
    });
}

// === Notification Button ===
const notificationBtn = document.getElementById('notificationBtn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
        console.log('Notifications clicked');
        // Add notification panel logic here
    });
}

// === Messages Button ===
const messagesBtn = document.getElementById('messagesBtn');
if (messagesBtn) {
    messagesBtn.addEventListener('click', function() {
        console.log('Messages clicked');
        // Add messages panel logic here
    });
}

// === Settings Button ===
const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) {
    settingsBtn.addEventListener('click', function() {
        console.log('Settings clicked');
        // Add settings panel logic here
    });
}

// === Logout Functionality ===
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                console.log('Logging out...');
                // Add logout logic here
                // window.location.href = 'login.html';
            }
        });
    }
}

// === Stat Card Hover Effects ===
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// === Quick Action Cards ===
const actionCards = document.querySelectorAll('.action-card');
actionCards.forEach(card => {
    card.addEventListener('click', function() {
        const action = this.querySelector('span').textContent;
        console.log('Action clicked:', action);
        // Add action logic here
    });
});

// === Activity Item Click ===
const activityItems = document.querySelectorAll('.activity-item');
activityItems.forEach(item => {
    item.addEventListener('click', function() {
        console.log('Activity clicked');
        // Add activity detail view logic here
    });
});

// === Utility Functions ===

// Format currency
function formatCurrency(amount) {
    return '₱' + amount.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show notification
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Add custom notification UI here
}

// === Real-time Updates Simulation ===
setInterval(() => {
    // Simulate real-time data updates
    const randomUpdate = Math.floor(Math.random() * 10);
    if (randomUpdate < 2) {
        console.log('Real-time update received');
        // Update dashboard data here
    }
}, 30000); // Check every 30 seconds

console.log('✅ AquaCart Admin Dashboard initialized successfully');
