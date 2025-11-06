<?php
require_once __DIR__ . '/../../auth.php';
include '../../db_connect.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - AquaCart Admin</title>
    <meta name="description" content="Admin settings and preferences">
    <link rel="stylesheet" href="../Css/Dashboard.css">
    <link rel="stylesheet" href="../Css/Settings.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Animated Water Background -->
    <div class="water-bg">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
        <div class="droplet droplet1"></div>
        <div class="droplet droplet2"></div>
        <div class="droplet droplet3"></div>
    </div>

    <!-- Sidebar Navigation -->
    <aside class="sidebar glass-card">
        <div class="sidebar-header">
            <div class="logo">
                <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
                    <path d="M25 5 C25 5, 15 20, 15 30 C15 37, 19 43, 25 43 C31 43, 35 37, 35 30 C35 20, 25 5, 25 5 Z" 
                          fill="#4DD0E1" opacity="0.9"/>
                    <path d="M25 5 C25 5, 15 20, 15 30 C15 37, 19 43, 25 43 C31 43, 35 37, 35 30 C35 20, 25 5, 25 5 Z" 
                          fill="none" stroke="#00838F" stroke-width="2"/>
                    <ellipse cx="22" cy="25" rx="3" ry="5" fill="#FFFFFF" opacity="0.5"/>
                </svg>
                <div class="logo-text">
                    <span class="logo-aqua">Aqua</span><span class="logo-cart">Cart</span>
                    <span class="logo-admin">Admin</span>
                </div>
            </div>
            <button class="sidebar-toggle" id="sidebarToggle">
                <i class="fas fa-chevron-left"></i>
            </button>
        </div>

        <nav class="sidebar-nav">
            <a href="Dashboard.html" class="nav-item">
                <i class="fas fa-chart-line"></i>
                <span>Dashboard</span>
                <div class="ripple"></div>
            </a>
            <a href="Orders.html" class="nav-item">
                <i class="fas fa-shopping-cart"></i>
                <span>Orders</span>
                <div class="ripple"></div>
            </a>
            <a href="Products.html" class="nav-item">
                <i class="fas fa-droplet"></i>
                <span>Products</span>
                <div class="ripple"></div>
            </a>
            <a href="Users.html" class="nav-item">
                <i class="fas fa-users"></i>
                <span>Users</span>
                <div class="ripple"></div>
            </a>
            <a href="Deliveries.html" class="nav-item">
                <i class="fas fa-truck"></i>
                <span>Deliveries</span>
                <div class="ripple"></div>
            </a>
            <a href="Settings.html" class="nav-item active">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
                <div class="ripple"></div>
            </a>
        </nav>

        <div class="sidebar-footer">
            <div class="admin-profile glass-mini">
                <div class="admin-avatar">
                    <i class="fas fa-user-shield"></i>
                </div>
                <div class="admin-info">
                    <span class="admin-name">Admin User</span>
                    <span class="admin-role">Super Admin</span>
                </div>
            </div>
            <button class="logout-btn" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Top Bar -->
        <header class="topbar glass-card">
            <button class="mobile-menu-toggle" id="mobileMenuToggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <div class="search-bar glass-mini">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search settings..." id="searchInput">
            </div>

            <div class="topbar-actions">
                <button class="action-btn glass-mini" id="notificationBtn">
                    <i class="fas fa-bell"></i>
                    <span class="badge">5</span>
                </button>
                <button class="action-btn glass-mini" id="messagesBtn">
                    <i class="fas fa-envelope"></i>
                    <span class="badge">3</span>
                </button>
                <button class="action-btn glass-mini" id="settingsBtn">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        </header>

        <!-- Settings Section -->
        <section class="settings-section">
            <!-- Page Header -->
            <div class="page-header">
                <div class="header-left">
                    <h1 class="page-title">Settings ⚙️</h1>
                    <p class="page-subtitle">Manage admin preferences and system configuration</p>
                </div>
                <div class="header-actions">
                    <button class="btn-secondary" id="resetSettingsBtn">
                        <i class="fas fa-undo"></i>
                        <span>Reset to Default</span>
                    </button>
                    <button class="btn-primary" id="saveSettingsBtn">
                        <i class="fas fa-save"></i>
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            <!-- Settings Grid -->
            <div class="settings-grid">
                <!-- Appearance Settings -->
                <div class="settings-card glass-card">
                    <div class="card-header">
                        <div class="header-icon appearance">
                            <i class="fas fa-palette"></i>
                        </div>
                        <div class="header-text">
                            <h3>Appearance</h3>
                            <p>Customize the interface theme</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-moon"></i>
                                <div>
                                    <span class="label-title">Theme Mode</span>
                                    <span class="label-desc">Switch between light and dark mode</span>
                                </div>
                            </div>
                            <div class="toggle-switch">
                                <input type="checkbox" id="themeToggle" class="toggle-input">
                                <label for="themeToggle" class="toggle-label">
                                    <span class="toggle-slider"></span>
                                    <span class="toggle-text light">Light</span>
                                    <span class="toggle-text dark">Dark</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notification Settings -->
                <div class="settings-card glass-card">
                    <div class="card-header">
                        <div class="header-icon notifications">
                            <i class="fas fa-bell"></i>
                        </div>
                        <div class="header-text">
                            <h3>Notifications</h3>
                            <p>Manage alert preferences</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-shopping-cart"></i>
                                <div>
                                    <span class="label-title">New Orders</span>
                                    <span class="label-desc">Get notified when new orders arrive</span>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="newOrdersSwitch" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-box"></i>
                                <div>
                                    <span class="label-title">Low Stock Alerts</span>
                                    <span class="label-desc">Alert when products are running low</span>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="lowStockSwitch" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-truck"></i>
                                <div>
                                    <span class="label-title">Delivery Updates</span>
                                    <span class="label-desc">Notifications for delivery status changes</span>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="deliveryUpdatesSwitch" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">
                                <i class="fas fa-user-plus"></i>
                                <div>
                                    <span class="label-title">New User Registration</span>
                                    <span class="label-desc">Alert when new users sign up</span>
                                </div>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="newUserSwitch">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- System Logs -->
                <div class="settings-card glass-card full-width">
                    <div class="card-header">
                        <div class="header-icon logs">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="header-text">
                            <h3>System Logs</h3>
                            <p>Recent admin actions and system events</p>
                        </div>
                        <button class="btn-icon" id="refreshLogsBtn" title="Refresh Logs">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="logs-container">
                            <div class="log-item">
                                <div class="log-icon success">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="log-content">
                                    <span class="log-action">Order #2547 marked as completed</span>
                                    <span class="log-time">
                                        <i class="fas fa-clock"></i>
                                        2 minutes ago
                                    </span>
                                </div>
                            </div>
                            <div class="log-item">
                                <div class="log-icon info">
                                    <i class="fas fa-info-circle"></i>
                                </div>
                                <div class="log-content">
                                    <span class="log-action">New user registered: Juan Dela Cruz</span>
                                    <span class="log-time">
                                        <i class="fas fa-clock"></i>
                                        15 minutes ago
                                    </span>
                                </div>
                            </div>
                            <div class="log-item">
                                <div class="log-icon warning">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <div class="log-content">
                                    <span class="log-action">Low stock alert: Premium Alkaline Water (15 units left)</span>
                                    <span class="log-time">
                                        <i class="fas fa-clock"></i>
                                        1 hour ago
                                    </span>
                                </div>
                            </div>
                            <div class="log-item">
                                <div class="log-icon success">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="log-content">
                                    <span class="log-action">Product updated: Natural Spring Water</span>
                                    <span class="log-time">
                                        <i class="fas fa-clock"></i>
                                        2 hours ago
                                    </span>
                                </div>
                            </div>
                            <div class="log-item">
                                <div class="log-icon error">
                                    <i class="fas fa-times-circle"></i>
                                </div>
                                <div class="log-content">
                                    <span class="log-action">Failed login attempt detected</span>
                                    <span class="log-time">
                                        <i class="fas fa-clock"></i>
                                        3 hours ago
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- System Maintenance -->
                <div class="settings-card glass-card">
                    <div class="card-header">
                        <div class="header-icon maintenance">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="header-text">
                            <h3>System Maintenance</h3>
                            <p>Clean up and optimize system</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="maintenance-item">
                            <div class="maintenance-info">
                                <i class="fas fa-database"></i>
                                <div>
                                    <span class="info-title">Cache Size</span>
                                    <span class="info-value">245 MB</span>
                                </div>
                            </div>
                            <button class="btn-action" id="clearCacheBtn">
                                <i class="fas fa-trash-alt"></i>
                                Clear Cache
                            </button>
                        </div>
                        <div class="maintenance-item">
                            <div class="maintenance-info">
                                <i class="fas fa-file-alt"></i>
                                <div>
                                    <span class="info-title">Log Files</span>
                                    <span class="info-value">1,247 entries</span>
                                </div>
                            </div>
                            <button class="btn-action" id="clearLogsBtn">
                                <i class="fas fa-trash-alt"></i>
                                Clear Logs
                            </button>
                        </div>
                        <div class="maintenance-item">
                            <div class="maintenance-info">
                                <i class="fas fa-download"></i>
                                <div>
                                    <span class="info-title">Database Backup</span>
                                    <span class="info-value">Last: Oct 31, 2025</span>
                                </div>
                            </div>
                            <button class="btn-action" id="backupBtn">
                                <i class="fas fa-save"></i>
                                Backup Now
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Account Settings -->
                <div class="settings-card glass-card">
                    <div class="card-header">
                        <div class="header-icon account">
                            <i class="fas fa-user-cog"></i>
                        </div>
                        <div class="header-text">
                            <h3>Account Settings</h3>
                            <p>Manage admin account</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="account-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <span class="account-label">Email</span>
                                <span class="account-value">admin@aquacart.com</span>
                            </div>
                        </div>
                        <div class="account-item">
                            <i class="fas fa-shield-alt"></i>
                            <div>
                                <span class="account-label">Role</span>
                                <span class="account-value">Super Admin</span>
                            </div>
                        </div>
                        <div class="account-item">
                            <i class="fas fa-calendar"></i>
                            <div>
                                <span class="account-label">Last Login</span>
                                <span class="account-value">Nov 1, 2025 10:30 AM</span>
                            </div>
                        </div>
                        <button class="btn-action full-width" id="changePasswordBtn">
                            <i class="fas fa-key"></i>
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Logout Confirmation Modal -->
    <div class="modal-overlay" id="logoutModal">
        <div class="modal glass-card logout-modal">
            <div class="modal-icon">
                <i class="fas fa-sign-out-alt"></i>
            </div>
            <div class="modal-body">
                <h2 class="modal-title">Confirm Logout</h2>
                <p class="modal-text">Are you sure you want to log out of AquaCart Admin?</p>
            </div>
            <div class="modal-footer">
                <button class="btn-outline" id="cancelLogoutBtn">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
                <button class="btn-danger" id="confirmLogoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </div>
    </div>

    <script src="../Js/Dashboard.js"></script>
    <script src="../Js/Settings.js"></script>
</body>
</html>