/* ========================================
   SETTINGS PAGE - JAVASCRIPT
   Interactive Features & Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSettingsPage();
});

function initSettingsPage() {
    initThemeToggle();
    initNotificationSwitches();
    initMaintenanceActions();
    initLogoutModal();
    initSaveSettings();
    initResetSettings();
    initRefreshLogs();
    initChangePassword();
}

// === Theme Toggle ===
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        applyTheme('dark');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const theme = this.checked ? 'dark' : 'light';
            applyTheme(theme);
            localStorage.setItem('theme', theme);
            showNotification(`Theme changed to ${theme} mode`, 'success');
        });
    }
}

function applyTheme(theme) {
    // This is a placeholder - you would implement actual theme switching
    console.log(`Theme switched to: ${theme}`);
    
    if (theme === 'dark') {
        document.body.style.filter = 'invert(0.9) hue-rotate(180deg)';
        document.body.style.transition = 'filter 0.3s ease';
    } else {
        document.body.style.filter = 'none';
    }
}

// === Notification Switches ===
function initNotificationSwitches() {
    const switches = {
        newOrders: document.getElementById('newOrdersSwitch'),
        lowStock: document.getElementById('lowStockSwitch'),
        deliveryUpdates: document.getElementById('deliveryUpdatesSwitch'),
        newUser: document.getElementById('newUserSwitch')
    };
    
    // Load saved preferences
    Object.keys(switches).forEach(key => {
        const saved = localStorage.getItem(`notify_${key}`);
        if (saved !== null) {
            switches[key].checked = saved === 'true';
        }
    });
    
    // Add event listeners
    Object.keys(switches).forEach(key => {
        switches[key].addEventListener('change', function() {
            localStorage.setItem(`notify_${key}`, this.checked);
            const status = this.checked ? 'enabled' : 'disabled';
            const label = this.parentElement.previousElementSibling.querySelector('.label-title').textContent;
            showNotification(`${label} ${status}`, 'info');
        });
    });
}

// === Maintenance Actions ===
function initMaintenanceActions() {
    const clearCacheBtn = document.getElementById('clearCacheBtn');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    const backupBtn = document.getElementById('backupBtn');
    
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear the cache? This action cannot be undone.')) {
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';
                
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-trash-alt"></i> Clear Cache';
                    
                    // Update cache size display
                    const cacheInfo = this.parentElement.querySelector('.info-value');
                    cacheInfo.textContent = '0 MB';
                    
                    showNotification('Cache cleared successfully!', 'success');
                }, 2000);
            }
        });
    }
    
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Clearing...';
                
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-trash-alt"></i> Clear Logs';
                    
                    // Update logs display
                    const logsInfo = this.parentElement.querySelector('.info-value');
                    logsInfo.textContent = '0 entries';
                    
                    // Clear logs container
                    const logsContainer = document.querySelector('.logs-container');
                    logsContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-light); padding: 20px;">No logs available</p>';
                    
                    showNotification('Logs cleared successfully!', 'success');
                }, 2000);
            }
        });
    }
    
    if (backupBtn) {
        backupBtn.addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Backing up...';
            
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-save"></i> Backup Now';
                
                // Update backup date
                const backupInfo = this.parentElement.querySelector('.info-value');
                const now = new Date();
                backupInfo.textContent = `Last: ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                
                showNotification('Database backup completed!', 'success');
            }, 3000);
        });
    }
}

// === Logout Modal ===
function initLogoutModal() {
    const logoutBtn = document.getElementById('logoutBtn');
    const modal = document.getElementById('logoutModal');
    const cancelBtn = document.getElementById('cancelLogoutBtn');
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            performLogout();
        });
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}

function performLogout() {
    const modal = document.getElementById('logoutModal');
    
    // Add logout animation class
    modal.classList.add('logging-out');
    
    // Simulate logout process
    setTimeout(() => {
        showNotification('Logging out...', 'info');
        
        // Clear any stored data
        // localStorage.clear(); // Uncomment in production
        
        setTimeout(() => {
            // Redirect to login page
            window.location.href = '../../LogIn/LogIn.html';
        }, 1000);
    }, 400);
}

// === Save Settings ===
function initSaveSettings() {
    const saveBtn = document.getElementById('saveSettingsBtn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-save"></i> Save Changes';
                showNotification('Settings saved successfully!', 'success');
            }, 1500);
        });
    }
}

// === Reset Settings ===
function initResetSettings() {
    const resetBtn = document.getElementById('resetSettingsBtn');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
                // Reset theme
                const themeToggle = document.getElementById('themeToggle');
                themeToggle.checked = false;
                applyTheme('light');
                localStorage.setItem('theme', 'light');
                
                // Reset notification switches
                document.querySelectorAll('.switch input').forEach(input => {
                    input.checked = true;
                    localStorage.setItem(`notify_${input.id.replace('Switch', '')}`, 'true');
                });
                
                showNotification('Settings reset to default!', 'success');
            }
        });
    }
}

// === Refresh Logs ===
function initRefreshLogs() {
    const refreshBtn = document.getElementById('refreshLogsBtn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 0.6s linear';
            
            setTimeout(() => {
                icon.style.animation = '';
                showNotification('Logs refreshed!', 'success');
            }, 600);
        });
    }
}

// === Change Password ===
function initChangePassword() {
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            showNotification('Change Password feature coming soon!', 'info');
        });
    }
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
        z-index: 4000;
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

console.log('✅ Settings Page initialized successfully');
