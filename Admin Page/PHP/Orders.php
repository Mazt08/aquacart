<?php
require_once __DIR__ . '/../../auth.php';
include '../../db_connect.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data from checkout.php
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];
    $city = $_POST['city'];
    $zip_code = $_POST['zip_code'];
    $notes = $_POST['notes'] ?? '';
    $payment = $_POST['payment'];
    $subtotal = $_POST['subtotal'];
    $tax = $_POST['tax'];
    $total = $_POST['total'];

    // Insert order into the database
    $sql = "INSERT INTO orders (
                first_name, last_name, email, phone, address, city, zip_code, notes,
                payment_method, subtotal, tax, total, order_status, order_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Processing', NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssssssssdd",
        $first_name,
        $last_name,
        $email,
        $phone,
        $address,
        $city,
        $zip_code,
        $notes,
        $payment,
        $subtotal,
        $tax,
        $total
    );

    if ($stmt->execute()) {
        // ✅ Redirect user to Dashboard after successful checkout
        header("Location: ../Dashboard/Dashboard.html");
        exit;
    } else {
        echo "<script>alert('Failed to place order. Please try again.'); window.history.back();</script>";
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders Management - AquaCart Admin</title>
    <meta name="description" content="Manage all AquaCart orders">
    <link rel="stylesheet" href="../Css/Dashboard.css">
    <link rel="stylesheet" href="../Css/Orders.css">
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
            <a href="Orders.html" class="nav-item active">
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
                <input type="text" placeholder="Search orders..." id="searchInput">
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

        <!-- Orders Management Section -->
        <section class="orders-section">
            <!-- Page Header -->
            <div class="page-header">
                <div class="header-content">
                    <h1 class="page-title">Orders Management 📦</h1>
                    <p class="page-subtitle">Manage and track all customer orders</p>
                </div>
                <div class="header-stats">
                    <div class="stat-mini glass-mini">
                        <i class="fas fa-shopping-cart"></i>
                        <div>
                            <span class="stat-mini-value">2,547</span>
                            <span class="stat-mini-label">Total Orders</span>
                        </div>
                    </div>
                    <div class="stat-mini glass-mini">
                        <i class="fas fa-clock"></i>
                        <div>
                            <span class="stat-mini-value">143</span>
                            <span class="stat-mini-label">Processing</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Filters & Actions -->
            <div class="filters-section glass-card">
                <div class="filter-group">
                    <button class="filter-btn active" data-status="all">
                        <i class="fas fa-list"></i>
                        All Orders
                        <span class="filter-count">2547</span>
                    </button>
                    <button class="filter-btn" data-status="processing">
                        <i class="fas fa-spinner"></i>
                        Processing
                        <span class="filter-count">143</span>
                    </button>
                    <button class="filter-btn" data-status="delivery">
                        <i class="fas fa-truck"></i>
                        Out for Delivery
                        <span class="filter-count">98</span>
                    </button>
                    <button class="filter-btn" data-status="delivered">
                        <i class="fas fa-check-circle"></i>
                        Delivered
                        <span class="filter-count">2234</span>
                    </button>
                    <button class="filter-btn" data-status="cancelled">
                        <i class="fas fa-times-circle"></i>
                        Cancelled
                        <span class="filter-count">72</span>
                    </button>
                </div>
                
                <div class="action-group">
                    <button class="action-btn-secondary glass-mini" id="exportBtn">
                        <i class="fas fa-download"></i>
                        Export
                    </button>
                    <button class="action-btn-secondary glass-mini" id="refreshBtn">
                        <i class="fas fa-sync"></i>
                        Refresh
                    </button>
                </div>
            </div>

            <!-- Orders Table -->
            <div class="table-container glass-card">
                <div class="table-wrapper">
                    <table class="orders-table" id="ordersTable">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" id="selectAll">
                                </th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Total</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Order Row 1 -->
                            <tr data-order-id="2547">
                                <td>
                                    <input type="checkbox" class="row-checkbox">
                                </td>
                                <td class="order-id">#2547</td>
                                <td>
                                    <div class="customer-info">
                                        <div class="customer-avatar">JD</div>
                                        <div>
                                            <div class="customer-name">Juan Dela Cruz</div>
                                            <div class="customer-email">juan@email.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="products-preview">
                                        <span>Premium Alkaline Water</span>
                                        <span class="product-count">+2 more</span>
                                    </div>
                                </td>
                                <td class="order-total">₱2,450.00</td>
                                <td class="order-date">Nov 1, 2025</td>
                                <td>
                                    <span class="status-badge processing">
                                        <i class="fas fa-spinner"></i>
                                        Processing
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon view-btn" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon edit-btn" title="Update Status">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon delete-btn" title="Delete Order">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <!-- Order Row 2 -->
                            <tr data-order-id="2546">
                                <td>
                                    <input type="checkbox" class="row-checkbox">
                                </td>
                                <td class="order-id">#2546</td>
                                <td>
                                    <div class="customer-info">
                                        <div class="customer-avatar">MS</div>
                                        <div>
                                            <div class="customer-name">Maria Santos</div>
                                            <div class="customer-email">maria@email.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="products-preview">
                                        <span>Sparkling Mineral Water</span>
                                        <span class="product-count">+1 more</span>
                                    </div>
                                </td>
                                <td class="order-total">₱1,850.00</td>
                                <td class="order-date">Nov 1, 2025</td>
                                <td>
                                    <span class="status-badge delivery">
                                        <i class="fas fa-truck"></i>
                                        Out for Delivery
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon view-btn" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon edit-btn" title="Update Status">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon delete-btn" title="Delete Order">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <!-- Order Row 3 -->
                            <tr data-order-id="2545">
                                <td>
                                    <input type="checkbox" class="row-checkbox">
                                </td>
                                <td class="order-id">#2545</td>
                                <td>
                                    <div class="customer-info">
                                        <div class="customer-avatar">RC</div>
                                        <div>
                                            <div class="customer-name">Roberto Cruz</div>
                                            <div class="customer-email">roberto@email.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="products-preview">
                                        <span>Natural Spring Water</span>
                                    </div>
                                </td>
                                <td class="order-total">₱3,200.00</td>
                                <td class="order-date">Oct 31, 2025</td>
                                <td>
                                    <span class="status-badge delivered">
                                        <i class="fas fa-check-circle"></i>
                                        Delivered
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon view-btn" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon edit-btn" title="Update Status">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon delete-btn" title="Delete Order">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <!-- Order Row 4 -->
                            <tr data-order-id="2544">
                                <td>
                                    <input type="checkbox" class="row-checkbox">
                                </td>
                                <td class="order-id">#2544</td>
                                <td>
                                    <div class="customer-info">
                                        <div class="customer-avatar">AR</div>
                                        <div>
                                            <div class="customer-name">Anna Reyes</div>
                                            <div class="customer-email">anna@email.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="products-preview">
                                        <span>Premium Alkaline Water</span>
                                        <span class="product-count">+3 more</span>
                                    </div>
                                </td>
                                <td class="order-total">₱4,150.00</td>
                                <td class="order-date">Oct 31, 2025</td>
                                <td>
                                    <span class="status-badge cancelled">
                                        <i class="fas fa-times-circle"></i>
                                        Cancelled
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon view-btn" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon edit-btn" title="Update Status" disabled>
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon delete-btn" title="Delete Order">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <!-- Order Row 5 -->
                            <tr data-order-id="2543">
                                <td>
                                    <input type="checkbox" class="row-checkbox">
                                </td>
                                <td class="order-id">#2543</td>
                                <td>
                                    <div class="customer-info">
                                        <div class="customer-avatar">PG</div>
                                        <div>
                                            <div class="customer-name">Pedro Garcia</div>
                                            <div class="customer-email">pedro@email.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div class="products-preview">
                                        <span>Mineral Water Pack</span>
                                    </div>
                                </td>
                                <td class="order-total">₱1,200.00</td>
                                <td class="order-date">Oct 30, 2025</td>
                                <td>
                                    <span class="status-badge delivered">
                                        <i class="fas fa-check-circle"></i>
                                        Delivered
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon view-btn" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon edit-btn" title="Update Status">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon delete-btn" title="Delete Order">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <button class="page-btn" id="prevPage">
                        <i class="fas fa-chevron-left"></i>
                        Previous
                    </button>
                    <div class="page-numbers">
                        <button class="page-num active">1</button>
                        <button class="page-num">2</button>
                        <button class="page-num">3</button>
                        <span class="page-dots">...</span>
                        <button class="page-num">12</button>
                    </div>
                    <button class="page-btn" id="nextPage">
                        Next
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>
    </main>

    <!-- Order Details Modal -->
    <div class="modal-overlay" id="orderDetailsModal">
        <div class="modal glass-card">
            <div class="modal-header">
                <h3>Order Details</h3>
                <button class="modal-close" id="modalClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="order-details-content">
                    <div class="detail-section">
                        <h4>Customer Information</h4>
                        <div class="detail-row">
                            <span class="detail-label">Name:</span>
                            <span class="detail-value" id="modalCustomerName">Juan Dela Cruz</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value" id="modalCustomerEmail">juan@email.com</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value" id="modalCustomerPhone">+63 917 123 4567</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value" id="modalCustomerAddress">123 Main St, Quezon City</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4>Order Items</h4>
                        <div class="order-items-list" id="modalOrderItems">
                            <div class="order-item-row">
                                <span class="item-name">Premium Alkaline Water (24 bottles)</span>
                                <span class="item-quantity">x2</span>
                                <span class="item-price">₱1,200.00</span>
                            </div>
                            <div class="order-item-row">
                                <span class="item-name">Natural Spring Water (12 bottles)</span>
                                <span class="item-quantity">x1</span>
                                <span class="item-price">₱600.00</span>
                            </div>
                            <div class="order-item-row">
                                <span class="item-name">Sparkling Mineral Water</span>
                                <span class="item-quantity">x3</span>
                                <span class="item-price">₱650.00</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4>Order Summary</h4>
                        <div class="detail-row">
                            <span class="detail-label">Subtotal:</span>
                            <span class="detail-value">₱2,450.00</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Shipping:</span>
                            <span class="detail-value">FREE</span>
                        </div>
                        <div class="detail-row total-row">
                            <span class="detail-label">Total:</span>
                            <span class="detail-value">₱2,450.00</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="modalCancelBtn">Close</button>
                <button class="btn btn-primary" id="modalPrintBtn">
                    <i class="fas fa-print"></i> Print Receipt
                </button>
            </div>
        </div>
    </div>

    <!-- Update Status Modal -->
    <div class="modal-overlay" id="updateStatusModal">
        <div class="modal glass-card small">
            <div class="modal-header">
                <h3>Update Order Status</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Current Status</label>
                    <input type="text" value="Processing" readonly class="form-input glass-mini">
                </div>
                <div class="form-group">
                    <label>New Status</label>
                    <select class="form-select glass-mini" id="statusSelect">
                        <option value="processing">Processing</option>
                        <option value="delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes (Optional)</label>
                    <textarea class="form-textarea glass-mini" rows="3" placeholder="Add any notes..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary">Cancel</button>
                <button class="btn btn-primary">
                    <i class="fas fa-save"></i> Update Status
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-overlay" id="deleteModal">
        <div class="modal glass-card small">
            <div class="modal-header">
                <h3>Confirm Delete</h3>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to delete this order? This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary">Cancel</button>
                <button class="btn btn-danger">
                    <i class="fas fa-trash"></i> Delete Order
                </button>
            </div>
        </div>
    </div>

    <script src="../Js/Dashboard.js"></script>
    <script src="../Js/Orders.js"></script>
</body>
</html>