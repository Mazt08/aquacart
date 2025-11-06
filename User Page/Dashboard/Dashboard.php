<?php
require_once __DIR__ . '/../../auth.php';
include '../../db_connect.php';
session_start();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AquaCart - User Dashboard</title>
    <link rel="stylesheet" href="Dashboard.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Mobile Menu Toggle -->
    <button class="mobile-menu-toggle" aria-label="Toggle Menu">
        <i class="fas fa-bars"></i>
    </button>

    <!-- Glassmorphic Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <h2 class="brand">AquaCart</h2>
            <div class="water-drop-icon">💧</div>
        </div>

        <nav class="sidebar-nav">
            <ul>
                <li>
                    <a href="#" class="nav-item active" data-page="dashboard">
                        <i class="fas fa-home"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-item" data-page="orders">
                        <i class="fas fa-box"></i>
                        <span>Orders</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-item" data-page="favorites">
                        <i class="fas fa-heart"></i>
                        <span>Favorites</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-item" data-page="profile">
                        <i class="fas fa-user"></i>
                        <span>Profile</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-item" data-page="settings">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </li>
                <li>
                    <a href="#" class="nav-item logout-btn" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </a>
                </li>
                <li>
                    <button class="nav-item back-to-home-btn" id="backToUserHome">
                        <i class="fas fa-arrow-left"></i>
                        <span>Back to Home</span>
                    </button>
                </li>
            </ul>
        </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
        <!-- Dashboard Page -->
        <section class="page active" id="dashboard-page">
            <h1 class="page-title">Welcome back, Alex! 💧</h1>
            <p class="page-subtitle">Here's your AquaCart overview</p>

            <div class="dashboard-grid">
                <!-- Current Order Card -->
                <div class="glass-card current-order-card">
                    <h2 class="card-title">Current Order</h2>
                    <div class="order-content">
                        <div class="order-product">
                            <img src="https://via.placeholder.com/80x120/00A9D6/ffffff?text=Water" alt="Product" class="product-image">
                            <div class="product-info">
                                <h3>Premium Alkaline Water</h3>
                                <p>24 Bottles • 500ml each</p>
                                <span class="price">$24.99</span>
                            </div>
                        </div>
                        <div class="order-progress">
                            <div class="progress-steps">
                                <div class="progress-step completed">
                                    <div class="step-icon"><i class="fas fa-check"></i></div>
                                    <span>Processing</span>
                                </div>
                                <div class="progress-step active">
                                    <div class="step-icon"><i class="fas fa-truck"></i></div>
                                    <span>Out for Delivery</span>
                                </div>
                                <div class="progress-step">
                                    <div class="step-icon"><i class="fas fa-home"></i></div>
                                    <span>Delivered</span>
                                </div>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 60%;"></div>
                            </div>
                        </div>
                        <button class="track-order-btn">
                            <i class="fas fa-map-marker-alt"></i>
                            Track Order
                        </button>
                    </div>
                </div>

                <!-- Recent Orders Mini List -->
                <div class="glass-card recent-orders-mini">
                    <h2 class="card-title">Recent Orders</h2>
                    <div class="mini-order-list">
                        <div class="mini-order-item">
                            <div class="mini-order-info">
                                <h4>Sparkling Mineral Water</h4>
                                <p>Oct 28, 2025 • $18.50</p>
                            </div>
                            <span class="status-badge delivered">Delivered</span>
                        </div>
                        <div class="mini-order-item">
                            <div class="mini-order-info">
                                <h4>Natural Spring Water</h4>
                                <p>Oct 25, 2025 • $22.00</p>
                            </div>
                            <span class="status-badge delivered">Delivered</span>
                        </div>
                        <div class="mini-order-item">
                            <div class="mini-order-info">
                                <h4>Purified Water Pack</h4>
                                <p>Oct 20, 2025 • $15.99</p>
                            </div>
                            <span class="status-badge delivered">Delivered</span>
                        </div>
                        <div class="mini-order-item">
                            <div class="mini-order-info">
                                <h4>Alkaline Water Premium</h4>
                                <p>Oct 15, 2025 • $28.50</p>
                            </div>
                            <span class="status-badge delivered">Delivered</span>
                        </div>
                    </div>
                    <a href="#" class="view-all-link" data-page="orders">View All Orders →</a>
                </div>

                <!-- Favorites Preview -->
                <div class="glass-card favorites-preview">
                    <h2 class="card-title">Your Favorites</h2>
                    <div class="favorites-grid">
                        <div class="favorite-item">
                            <img src="https://via.placeholder.com/100/00A9D6/ffffff?text=Water" alt="Product" class="fav-image">
                            <h4>Premium Alkaline</h4>
                            <p class="fav-price">$24.99</p>
                            <button class="add-to-cart-mini">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                        <div class="favorite-item">
                            <img src="https://via.placeholder.com/100/00737F/ffffff?text=Water" alt="Product" class="fav-image">
                            <h4>Sparkling Water</h4>
                            <p class="fav-price">$18.50</p>
                            <button class="add-to-cart-mini">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                        <div class="favorite-item">
                            <img src="https://via.placeholder.com/100/00D6A1/ffffff?text=Water" alt="Product" class="fav-image">
                            <h4>Natural Spring</h4>
                            <p class="fav-price">$22.00</p>
                            <button class="add-to-cart-mini">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                    <a href="#" class="view-all-link" data-page="favorites">View All Favorites →</a>
                </div>

                <!-- Quick Profile Info -->
                <div class="glass-card profile-quick-info">
                    <h2 class="card-title">Quick Info</h2>
                    <div class="profile-info-content">
                        <div class="profile-avatar">
                            <img src="https://via.placeholder.com/80/00A9D6/ffffff?text=A" alt="Avatar">
                        </div>
                        <div class="profile-details">
                            <h3>Alex Johnson</h3>
                            <p><i class="fas fa-envelope"></i> alex.johnson@email.com</p>
                            <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
                            <p><i class="fas fa-map-marker-alt"></i> 123 Water Street, Miami, FL</p>
                        </div>
                        <a href="#" class="edit-profile-link" data-page="profile">
                            <i class="fas fa-edit"></i> Edit Profile
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Orders Page -->
        <section class="page" id="orders-page">
            <h1 class="page-title">My Orders</h1>
            <p class="page-subtitle">Track and manage your water deliveries</p>
            
            <!-- Order Filters -->
            <div class="order-filters">
                <button class="filter-tab active" data-filter="all">All</button>
                <button class="filter-tab" data-filter="processing">Processing</button>
                <button class="filter-tab" data-filter="delivered">Delivered</button>
                <button class="filter-tab" data-filter="cancelled">Cancelled</button>
            </div>

            <!-- Orders List -->
            <div class="orders-container">
                <div class="order-card" data-status="processing">
                    <div class="order-header">
                        <div class="order-id-date">
                            <h3>Order #AQC-2025-1234</h3>
                            <p>November 1, 2025</p>
                        </div>
                        <div class="order-total">
                            <span class="total-label">Total</span>
                            <span class="total-amount">$24.99</span>
                        </div>
                        <span class="status-badge-large processing">Processing</span>
                    </div>
                    <div class="order-body">
                        <div class="order-thumbnail">
                            <img src="https://via.placeholder.com/100/00A9D6/ffffff?text=Water" alt="Product">
                        </div>
                        <div class="order-items-info">
                            <h4>Premium Alkaline Water</h4>
                            <p>24 Bottles • 500ml each</p>
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="order-action-btn secondary">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="order-action-btn secondary">
                            <i class="fas fa-redo"></i> Reorder
                        </button>
                        <button class="order-action-btn primary">
                            <i class="fas fa-truck"></i> Track Delivery
                        </button>
                    </div>
                </div>

                <div class="order-card" data-status="delivered">
                    <div class="order-header">
                        <div class="order-id-date">
                            <h3>Order #AQC-2025-1233</h3>
                            <p>October 28, 2025</p>
                        </div>
                        <div class="order-total">
                            <span class="total-label">Total</span>
                            <span class="total-amount">$18.50</span>
                        </div>
                        <span class="status-badge-large delivered">Delivered</span>
                    </div>
                    <div class="order-body">
                        <div class="order-thumbnail">
                            <img src="https://via.placeholder.com/100/00737F/ffffff?text=Water" alt="Product">
                        </div>
                        <div class="order-items-info">
                            <h4>Sparkling Mineral Water</h4>
                            <p>12 Bottles • 750ml each</p>
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="order-action-btn secondary">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="order-action-btn primary">
                            <i class="fas fa-redo"></i> Reorder
                        </button>
                    </div>
                </div>

                <div class="order-card" data-status="delivered">
                    <div class="order-header">
                        <div class="order-id-date">
                            <h3>Order #AQC-2025-1232</h3>
                            <p>October 25, 2025</p>
                        </div>
                        <div class="order-total">
                            <span class="total-label">Total</span>
                            <span class="total-amount">$22.00</span>
                        </div>
                        <span class="status-badge-large delivered">Delivered</span>
                    </div>
                    <div class="order-body">
                        <div class="order-thumbnail">
                            <img src="https://via.placeholder.com/100/00D6A1/ffffff?text=Water" alt="Product">
                        </div>
                        <div class="order-items-info">
                            <h4>Natural Spring Water</h4>
                            <p>18 Bottles • 1L each</p>
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="order-action-btn secondary">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="order-action-btn primary">
                            <i class="fas fa-redo"></i> Reorder
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State (hidden by default) -->
            <div class="empty-state" style="display: none;">
                <div class="empty-illustration">
                    <i class="fas fa-droplet"></i>
                    <i class="fas fa-droplet"></i>
                    <i class="fas fa-droplet"></i>
                </div>
                <h2>No orders yet</h2>
                <p>Start hydrating today!</p>
                <button class="start-shopping-btn">
                    <i class="fas fa-shopping-cart"></i> Start Shopping
                </button>
            </div>
        </section>

        <!-- Favorites Page -->
        <section class="page" id="favorites-page">
            <h1 class="page-title">Favorite Products</h1>
            <p class="page-subtitle">Quick access to your most loved water brands</p>
            
            <!-- Favorites Grid -->
            <div class="favorites-products-grid">
                <div class="product-card">
                    <button class="remove-favorite-btn" title="Remove from favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <div class="product-image-container">
                        <img src="https://via.placeholder.com/250x350/00A9D6/ffffff?text=Premium+Alkaline" alt="Premium Alkaline Water">
                    </div>
                    <div class="product-card-content">
                        <h3>Premium Alkaline Water</h3>
                        <p class="product-description">pH 9.5+ Ionized water with essential minerals</p>
                        <div class="product-card-footer">
                            <span class="product-price">$24.99</span>
                            <button class="add-to-cart-btn">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div class="product-card">
                    <button class="remove-favorite-btn" title="Remove from favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <div class="product-image-container">
                        <img src="https://via.placeholder.com/250x350/00737F/ffffff?text=Sparkling+Water" alt="Sparkling Water">
                    </div>
                    <div class="product-card-content">
                        <h3>Sparkling Mineral Water</h3>
                        <p class="product-description">Naturally carbonated with crisp refreshment</p>
                        <div class="product-card-footer">
                            <span class="product-price">$18.50</span>
                            <button class="add-to-cart-btn">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div class="product-card">
                    <button class="remove-favorite-btn" title="Remove from favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <div class="product-image-container">
                        <img src="https://via.placeholder.com/250x350/00D6A1/ffffff?text=Natural+Spring" alt="Natural Spring Water">
                    </div>
                    <div class="product-card-content">
                        <h3>Natural Spring Water</h3>
                        <p class="product-description">Pure mountain spring with natural minerals</p>
                        <div class="product-card-footer">
                            <span class="product-price">$22.00</span>
                            <button class="add-to-cart-btn">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div class="product-card">
                    <button class="remove-favorite-btn" title="Remove from favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <div class="product-image-container">
                        <img src="https://via.placeholder.com/250x350/FF6B9D/ffffff?text=Flavored+Water" alt="Flavored Water">
                    </div>
                    <div class="product-card-content">
                        <h3>Flavored Sparkling Water</h3>
                        <p class="product-description">Zero sugar, naturally flavored refreshment</p>
                        <div class="product-card-footer">
                            <span class="product-price">$19.99</span>
                            <button class="add-to-cart-btn">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div class="product-card">
                    <button class="remove-favorite-btn" title="Remove from favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <div class="product-image-container">
                        <img src="https://via.placeholder.com/250x350/9B59B6/ffffff?text=Mineral+Water" alt="Mineral Water">
                    </div>
                    <div class="product-card-content">
                        <h3>Imported Mineral Water</h3>
                        <p class="product-description">Premium European mineral water</p>
                        <div class="product-card-footer">
                            <span class="product-price">$32.50</span>
                            <button class="add-to-cart-btn">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                <div class="product-card">
                    <button class="remove-favorite-btn" title="Remove from favorites">
                        <i class="fas fa-heart"></i>
                    </button>
                    <div class="product-image-container">
                        <img src="https://via.placeholder.com/250x350/3498DB/ffffff?text=Purified+Water" alt="Purified Water">
                    </div>
                    <div class="product-card-content">
                        <h3>Purified Drinking Water</h3>
                        <p class="product-description">Advanced filtration, pure hydration</p>
                        <div class="product-card-footer">
                            <span class="product-price">$15.99</span>
                            <button class="add-to-cart-btn">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State (hidden by default) -->
            <div class="favorites-empty-state" style="display: none;">
                <div class="empty-illustration">
                    💧
                </div>
                <h2>You haven't added any favorites yet</h2>
                <p>Start exploring our collection and save your favorites!</p>
                <button class="browse-products-btn">
                    <i class="fas fa-search"></i> Browse Products
                </button>
            </div>
        </section>

        <!-- Profile Page -->
        <section class="page" id="profile-page">
            <h1 class="page-title">My Profile</h1>
            <p class="page-subtitle">Manage your account information</p>
            
            <div class="profile-container">
                <!-- Profile Banner -->
                <div class="glass-card profile-banner">
                    <div class="banner-gradient"></div>
                    <div class="profile-avatar-large">
                        <img src="https://via.placeholder.com/150/00A9D6/ffffff?text=A" alt="Alex Johnson">
                        <button class="change-avatar-btn" title="Change Avatar">
                            <i class="fas fa-camera"></i>
                        </button>
                    </div>
                    <h2 class="profile-name">Alex Johnson</h2>
                    <p class="profile-member-since">Member since October 2024</p>
                </div>

                <!-- Profile Information -->
                <div class="glass-card profile-info-card">
                    <div class="card-header-with-action">
                        <h2 class="card-title">Personal Information</h2>
                        <button class="edit-profile-btn" id="editProfileBtn">
                            <i class="fas fa-edit"></i> Edit Profile
                        </button>
                    </div>

                    <form class="profile-form" id="profileForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="fullName">Full Name</label>
                                <input type="text" id="fullName" value="Alex Johnson" disabled>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" value="alex.johnson@email.com" disabled>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" value="+1 (555) 123-4567" disabled>
                            </div>
                            <div class="form-group">
                                <label for="birthdate">Birthdate</label>
                                <input type="date" id="birthdate" value="1990-05-15" disabled>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="address">Delivery Address</label>
                            <textarea id="address" rows="3" disabled>123 Water Street, Apt 4B
Miami, FL 33101
United States</textarea>
                        </div>

                        <div class="form-actions" style="display: none;">
                            <button type="button" class="btn btn-secondary" id="cancelEditBtn">Cancel</button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Account Security -->
                <div class="glass-card account-security">
                    <h2 class="card-title">Account Security</h2>
                    <div class="security-options">
                        <div class="security-item">
                            <div class="security-info">
                                <i class="fas fa-lock"></i>
                                <div>
                                    <h4>Password</h4>
                                    <p>Last changed 3 months ago</p>
                                </div>
                            </div>
                            <button class="change-password-btn" id="changePasswordBtn">Change Password</button>
                        </div>
                        <div class="security-item">
                            <div class="security-info">
                                <i class="fas fa-shield-alt"></i>
                                <div>
                                    <h4>Two-Factor Authentication</h4>
                                    <p>Add an extra layer of security</p>
                                </div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Settings Page -->
        <section class="page" id="settings-page">
            <h1 class="page-title">Settings</h1>
            <p class="page-subtitle">Customize your AquaCart experience</p>
            
            <div class="settings-container">
                <!-- Notifications Settings -->
                <div class="glass-card settings-card">
                    <h2 class="card-title"><i class="fas fa-bell"></i> Notifications</h2>
                    <div class="settings-divider"></div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Order Updates</h4>
                            <p>Receive notifications about your order status</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Promotional Emails</h4>
                            <p>Get notified about special offers and discounts</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Newsletter</h4>
                            <p>Weekly hydration tips and product updates</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>SMS Notifications</h4>
                            <p>Text messages for delivery updates</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- Appearance Settings -->
                <div class="glass-card settings-card">
                    <h2 class="card-title"><i class="fas fa-palette"></i> Appearance</h2>
                    <div class="settings-divider"></div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Theme Mode</h4>
                            <p>Choose your preferred display mode</p>
                        </div>
                        <div class="theme-selector">
                            <button class="theme-option active" data-theme="light">
                                <i class="fas fa-sun"></i>
                                <span>Light</span>
                            </button>
                            <button class="theme-option" data-theme="dark">
                                <i class="fas fa-moon"></i>
                                <span>Dark</span>
                            </button>
                            <button class="theme-option" data-theme="auto">
                                <i class="fas fa-circle-half-stroke"></i>
                                <span>Auto</span>
                            </button>
                        </div>
                    </div>

                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Compact Mode</h4>
                            <p>Reduce spacing for a denser layout</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <!-- Account Options -->
                <div class="glass-card settings-card">
                    <h2 class="card-title"><i class="fas fa-user-cog"></i> Account Options</h2>
                    <div class="settings-divider"></div>
                    
                    <button class="setting-action-btn">
                        <i class="fas fa-key"></i>
                        <div>
                            <h4>Change Password</h4>
                            <p>Update your account password</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </button>

                    <button class="setting-action-btn">
                        <i class="fas fa-credit-card"></i>
                        <div>
                            <h4>Payment Methods</h4>
                            <p>Manage your saved payment options</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </button>

                    <button class="setting-action-btn">
                        <i class="fas fa-map-marked-alt"></i>
                        <div>
                            <h4>Saved Addresses</h4>
                            <p>Manage delivery locations</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </button>

                    <button class="setting-action-btn">
                        <i class="fas fa-download"></i>
                        <div>
                            <h4>Download My Data</h4>
                            <p>Export your account information</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </button>

                    <div class="settings-divider danger-zone"></div>

                    <button class="setting-action-btn danger">
                        <i class="fas fa-user-slash"></i>
                        <div>
                            <h4>Delete Account</h4>
                            <p>Permanently remove your account</p>
                        </div>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>
    </main>

    <!-- Logout Confirmation Modal -->
    <div class="modal-overlay" id="logoutModal">
        <div class="modal glass-card">
            <div class="modal-header">
                <h3>Confirm Logout</h3>
                <button class="modal-close" id="modalClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to log out of AquaCart?</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" id="backToHomeBtn">
                    <i class="fas fa-home"></i> Back to Home
                </button>
                <button class="btn btn-secondary" id="cancelLogout">Cancel</button>
                <button class="btn btn-danger" id="confirmLogout">
                    <i class="fas fa-sign-out-alt"></i> Log Out
                </button>
            </div>
        </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal-overlay" id="changePasswordModal">
        <div class="modal glass-card">
            <div class="modal-header">
                <h3>Change Password</h3>
                <button class="modal-close" id="passwordModalClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="changePasswordForm">
                    <div class="form-group">
                        <label for="currentPassword">Current Password</label>
                        <input type="password" id="currentPassword" required>
                    </div>
                    <div class="form-group">
                        <label for="newPassword">New Password</label>
                        <input type="password" id="newPassword" required>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="cancelPasswordChange">Cancel</button>
                <button class="btn btn-primary" id="confirmPasswordChange">
                    <i class="fas fa-save"></i> Update Password
                </button>
            </div>
        </div>
    </div>

    <!-- Animated Water Background -->
    <div class="water-bg">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
    </div>

    <script src="Dashboard.js"></script>
</body>
</html>