<?php
session_start();

// 1. Check if the user is logged in
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("location: login.php"); // Redirect to login page
    exit;
}

// 2. Role Check: Ensure the user is an 'admin'
if ($_SESSION['role'] !== 'admin') {
    // If not admin, maybe redirect to their own dashboard or an access denied page
    header("location: user_dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - AquaCart</title>
    <meta name="description" content="AquaCart Admin Dashboard - Manage orders, users, and deliveries">
    <link rel="stylesheet" href="../Css/Dashboard.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
            <a href="Dashboard.html" class="nav-item active">
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
            <a href="Settings.html" class="nav-item">
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
                <input type="text" placeholder="Search orders, users, products..." id="searchInput">
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

        <!-- Dashboard Content -->
        <section class="dashboard-section">
            <!-- Welcome Header -->
            <div class="welcome-header">
                <h1 class="page-title">Welcome back, Admin 💧</h1>
                <p class="page-subtitle">Here's your AquaCart performance overview.</p>
            </div>

            <!-- Statistics Cards -->
            <div class="stats-grid">
                <!-- Total Orders -->
                <div class="stat-card glass-card" data-color="aqua">
                    <div class="stat-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-label">Total Orders</span>
                        <h2 class="stat-value" data-target="2547">0</h2>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+12.5%</span>
                        </div>
                    </div>
                    <div class="stat-glow"></div>
                </div>

                <!-- Total Users -->
                <div class="stat-card glass-card" data-color="teal">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-label">Total Users</span>
                        <h2 class="stat-value" data-target="1834">0</h2>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+8.3%</span>
                        </div>
                    </div>
                    <div class="stat-glow"></div>
                </div>

                <!-- Active Deliveries -->
                <div class="stat-card glass-card" data-color="blue">
                    <div class="stat-icon">
                        <i class="fas fa-truck"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-label">Active Deliveries</span>
                        <h2 class="stat-value" data-target="143">0</h2>
                        <div class="stat-change neutral">
                            <i class="fas fa-minus"></i>
                            <span>0.0%</span>
                        </div>
                    </div>
                    <div class="stat-glow"></div>
                </div>

                <!-- Revenue This Month -->
                <div class="stat-card glass-card" data-color="gradient">
                    <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-content">
                        <span class="stat-label">Revenue This Month</span>
                        <h2 class="stat-value" data-target="45890" data-prefix="$">$0</h2>
                        <div class="stat-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+15.7%</span>
                        </div>
                    </div>
                    <div class="stat-glow"></div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="charts-grid">
                <!-- Orders Trend Chart -->
                <div class="chart-card glass-card">
                    <div class="chart-header">
                        <div class="chart-title">
                            <h3>Orders Trend</h3>
                            <p>Weekly overview of order activity</p>
                        </div>
                        <div class="chart-controls">
                            <button class="chart-btn active" data-period="week">Week</button>
                            <button class="chart-btn" data-period="month">Month</button>
                            <button class="chart-btn" data-period="year">Year</button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="ordersChart"></canvas>
                    </div>
                </div>

                <!-- Sales Breakdown Chart -->
                <div class="chart-card glass-card">
                    <div class="chart-header">
                        <div class="chart-title">
                            <h3>Sales Breakdown</h3>
                            <p>Bottle vs Jug orders distribution</p>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="salesChart"></canvas>
                    </div>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <span class="legend-color" style="background: #00A9D6;"></span>
                            <span class="legend-label">Bottles</span>
                            <span class="legend-value">68%</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color" style="background: #00737F;"></span>
                            <span class="legend-label">Jugs</span>
                            <span class="legend-value">32%</span>
                        </div>
                    </div>
                </div>

                <!-- Delivery Performance Chart -->
                <div class="chart-card glass-card large">
                    <div class="chart-header">
                        <div class="chart-title">
                            <h3>Delivery Performance</h3>
                            <p>Monthly delivery success rates</p>
                        </div>
                        <div class="chart-filters">
                            <select class="filter-select glass-mini">
                                <option>All Regions</option>
                                <option>Metro Manila</option>
                                <option>Quezon City</option>
                                <option>Makati</option>
                            </select>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="deliveryChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <h3 class="section-title">Quick Actions</h3>
                <div class="actions-grid">
                    <button class="action-card glass-card">
                        <i class="fas fa-plus-circle"></i>
                        <span>Add Product</span>
                    </button>
                    <button class="action-card glass-card">
                        <i class="fas fa-file-invoice"></i>
                        <span>New Order</span>
                    </button>
                    <button class="action-card glass-card">
                        <i class="fas fa-user-plus"></i>
                        <span>Add User</span>
                    </button>
                    <button class="action-card glass-card">
                        <i class="fas fa-chart-bar"></i>
                        <span>View Reports</span>
                    </button>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="recent-activity glass-card">
                <h3 class="section-title">Recent Activity</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon aqua">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <div class="activity-content">
                            <h4>New order placed</h4>
                            <p>Order #2547 - Premium Alkaline Water (24 bottles)</p>
                        </div>
                        <span class="activity-time">2 min ago</span>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon teal">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <div class="activity-content">
                            <h4>New user registered</h4>
                            <p>Juan Dela Cruz joined AquaCart</p>
                        </div>
                        <span class="activity-time">15 min ago</span>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon blue">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="activity-content">
                            <h4>Delivery completed</h4>
                            <p>Order #2543 delivered to Quezon City</p>
                        </div>
                        <span class="activity-time">1 hour ago</span>
                    </div>
                    <div class="activity-item">
                        <div class="activity-icon gradient">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="activity-content">
                            <h4>Payment received</h4>
                            <p>₱2,450.00 from Order #2542</p>
                        </div>
                        <span class="activity-time">2 hours ago</span>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="../Js/Dashboard.js"></script>
</body>
</html>