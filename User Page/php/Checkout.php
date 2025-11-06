<?php
require_once __DIR__ . '/../../auth.php';
include '../../db_connect.php';

// auth.php already includes `session_boot.php` which starts the session.
// Avoid calling session_start() again to prevent the "session already active" notice.

// Normalise incoming data: prefer POST form fields, fall back to JSON body for API calls.
$rawBody = file_get_contents('php://input');
$json = json_decode($rawBody, true);
$data = $_POST ?: ($json ?: []);

// Helper: ensure required tables exist (development convenience).
function ensure_orders_schema(mysqli $conn)
{
    // Check for `orders` table
    $db = $conn->real_escape_string($conn->query("SELECT DATABASE() as db")->fetch_object()->db);

    $checkOrders = $conn->prepare("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'orders'");
    $checkOrders->bind_param('s', $db);
    $checkOrders->execute();
    $resOrders = $checkOrders->get_result();

    if ($resOrders->num_rows === 0) {
        // Create a permissive orders table that covers both admin and user flows.
        $createOrders = "CREATE TABLE IF NOT EXISTS `orders` (
            `order_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT UNSIGNED DEFAULT NULL,
            `first_name` VARCHAR(150) DEFAULT NULL,
            `last_name` VARCHAR(150) DEFAULT NULL,
            `email` VARCHAR(255) DEFAULT NULL,
            `phone` VARCHAR(50) DEFAULT NULL,
            `address` VARCHAR(500) DEFAULT NULL,
            `city` VARCHAR(150) DEFAULT NULL,
            `zip_code` VARCHAR(50) DEFAULT NULL,
            `notes` TEXT DEFAULT NULL,
            `payment_method` VARCHAR(100) DEFAULT 'cash',
            `subtotal` DECIMAL(10,2) DEFAULT 0.00,
            `tax` DECIMAL(10,2) DEFAULT 0.00,
            `total` DECIMAL(10,2) DEFAULT 0.00,
            `total_amount` DECIMAL(10,2) DEFAULT 0.00,
            `order_status` VARCHAR(50) DEFAULT 'Processing',
            `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        $conn->query($createOrders);
    }

    // Check for order_items
    $checkItems = $conn->prepare("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'order_items'");
    $checkItems->bind_param('s', $db);
    $checkItems->execute();
    $resItems = $checkItems->get_result();

    if ($resItems->num_rows === 0) {
        $createItems = "CREATE TABLE IF NOT EXISTS `order_items` (
            `item_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `order_id` INT UNSIGNED NOT NULL,
            `product_id` INT UNSIGNED NOT NULL,
            `quantity` INT NOT NULL DEFAULT 1,
            `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            INDEX (`order_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        $conn->query($createItems);
    }

    // Optionally create a minimal `cart` table used by some pages
    $checkCart = $conn->prepare("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'cart'");
    $checkCart->bind_param('s', $db);
    $checkCart->execute();
    $resCart = $checkCart->get_result();

    if ($resCart->num_rows === 0) {
        $createCart = "CREATE TABLE IF NOT EXISTS `cart` (
            `cart_id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT UNSIGNED NOT NULL,
            `product_id` INT UNSIGNED NOT NULL,
            `quantity` INT NOT NULL DEFAULT 1,
            INDEX (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        $conn->query($createCart);
    }
}

// Get user and order details
$user_id = $_SESSION['user_id']; // assuming you store this during login
$total_amount = $data['total_amount'] ?? 0;
$payment_method = $data['payment_method'] ?? 'cash';
$cart_items = $data['cart_items'] ?? []; // array of items
$order_date = date('Y-m-d H:i:s');

// Ensure schema is present (will create minimal tables in local/dev DBs)
ensure_orders_schema($conn);

// Defensive: make sure we have a user id; fall back to 0 for guest orders
$user_id = $_SESSION['user_id'] ?? 0;

// Insert order record. Use `total` and `order_status` which are present in the permissive schema above.
$sql_order = "INSERT INTO orders (user_id, total, payment_method, order_date, order_status)
              VALUES (?, ?, ?, ?, 'Processing')";

$stmt_order = $conn->prepare($sql_order);
if ($stmt_order === false) {
    // Clear, actionable error for developers
    echo json_encode(["status" => "error", "message" => "DB prepare failed: " . $conn->error]);
    exit;
}

$uid_bind = (int)$user_id;
$stmt_order->bind_param("idss", $uid_bind, $total_amount, $payment_method, $order_date);

if ($stmt_order->execute()) {
    $order_id = $stmt_order->insert_id;

    // Insert ordered items
    $sql_item = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
    $stmt_item = $conn->prepare($sql_item);
    if ($stmt_item !== false) {
        foreach ($cart_items as $item) {
            $product_id = $item['product_id'] ?? 0;
            $quantity = $item['quantity'] ?? 1;
            $price = $item['price'] ?? 0.00;
            $stmt_item->bind_param("iiid", $order_id, $product_id, $quantity, $price);
            $stmt_item->execute();
        }
    }

    // Clear user cart if you use a cart table
    if ($user_id) {
        $safe_uid = (int)$user_id;
        $conn->query("DELETE FROM cart WHERE user_id = $safe_uid");
    }

    // Success response
    echo json_encode([
        "status" => "success",
        "message" => "Order placed successfully.",
        "redirect" => "user_dashboard.php"
    ]);
    exit;
} else {
    echo json_encode(["status" => "error", "message" => "Failed to place order: " . $stmt_order->error]);
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - AquaCart</title>
    <meta name="description" content="Complete your AquaCart order - Secure checkout for premium bottled water delivery.">
    <link rel="stylesheet" href="../css/Checkout.css">
    <link rel="stylesheet" href="../css/nav-footer.css">
    <link rel="stylesheet" href="../css/mobileview.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
            <a href="index.html" class="nav-logo" aria-label="Aqua Cart Home">
                <svg class="logo" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <!-- Water Droplet Icon -->
                    <g transform="translate(10, 5)">
                        <path d="M25 10 C25 10, 15 25, 15 35 C15 42, 19 48, 25 48 C31 48, 35 42, 35 35 C35 25, 25 10, 25 10 Z" 
                              fill="#4DD0E1" opacity="0.9"/>
                        <path d="M25 10 C25 10, 15 25, 15 35 C15 42, 19 48, 25 48 C31 48, 35 42, 35 35 C35 25, 25 10, 25 10 Z" 
                              fill="none" stroke="#00838F" stroke-width="2"/>
                        <ellipse cx="22" cy="30" rx="4" ry="6" fill="#FFFFFF" opacity="0.4"/>
                    </g>
                    <!-- Text: Aqua Cart -->
                    <text x="60" y="38" font-family="Inter, sans-serif" font-size="24" font-weight="700" fill="#006064">
                        Aqua
                    </text>
                    <text x="115" y="38" font-family="Inter, sans-serif" font-size="24" font-weight="400" fill="#00838F">
                        Cart
                    </text>
                    <!-- Wavy underline -->
                    <path d="M 60 42 Q 70 45, 80 42 T 100 42 T 120 42 T 140 42 T 160 42" 
                          stroke="#4DD0E1" stroke-width="2" fill="none" opacity="0.6"/>
                </svg>
            </a>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu" role="menubar">
                <li role="none"><a href="index.html" role="menuitem">Home</a></li>
                <li role="none"><a href="products.html" role="menuitem">Products</a></li>
                <li role="none"><a href="About.html" role="menuitem">About</a></li>
                <li role="none"><a href="mission.html" role="menuitem">Mission</a></li>
                <li role="none"><a href="Reviews.html" role="menuitem">Reviews</a></li>
                <li role="none"><a href="Contact.html" role="menuitem">Contact</a></li>
                <li role="none" class="nav-cart"><a href="Cart.html" role="menuitem" class="btn-cart" aria-label="Shopping Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="cart-count">0</span>
                </a></li>
                <li role="none" class="nav-cta"><a href="../Dashboard/Dashboard.html" role="menuitem" class="btn-login">Dashboard</a></li>
            </ul>
        </div>
    </nav>
    
    <!-- Navbar Underline -->
    <div class="nav-underline"></div>

    <!-- Animated Water Background -->
    <div class="water-bg">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
    </div>

    <!-- Checkout Content -->
    <main class="checkout-container">
        <!-- Progress Steps -->
        <div class="progress-steps">
            <div class="step completed">
                <div class="step-circle">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <span class="step-label">Cart</span>
            </div>
            <div class="step-line completed"></div>
            <div class="step active">
                <div class="step-circle">
                    <i class="fas fa-credit-card"></i>
                </div>
                <span class="step-label">Checkout</span>
            </div>
            <div class="step-line"></div>
            <div class="step">
                <div class="step-circle">
                    <i class="fas fa-check"></i>
                </div>
                <span class="step-label">Complete</span>
            </div>
        </div>

        <!-- Checkout Header -->
        <div class="checkout-header">
            <h1 class="checkout-title">Secure Checkout 🔒</h1>
            <p class="checkout-subtitle">Complete your order with confidence</p>
        </div>

        <!-- Checkout Grid -->
        <div class="checkout-content">
            <!-- Left Column: Forms -->
            <div class="checkout-forms">
                <!-- Shipping Information -->
                <section class="form-section glass-card">
                    <div class="section-header">
                        <h2><i class="fas fa-truck"></i> Shipping Information</h2>
                    </div>
                    <form action="orders.php" method="POST" class="shipping-form">
  <div class="form-group">
    <label>First Name</label>
    <input type="text" name="first_name" required>
  </div>
  <div class="form-group">
    <label>Last Name</label>
    <input type="text" name="last_name" required>
  </div>
  <div class="form-group">
    <label>Email</label>
    <input type="email" name="email" required>
  </div>
  <div class="form-group">
    <label>Phone</label>
    <input type="text" name="phone" required>
  </div>
  <div class="form-group">
    <label>Address</label>
    <input type="text" name="address" required>
  </div>
  <div class="form-group">
    <label>City</label>
    <input type="text" name="city" required>
  </div>
  <div class="form-group">
    <label>ZIP Code</label>
    <input type="text" name="zip_code" required>
  </div>
  <div class="form-group">
    <label>Notes (Optional)</label>
    <textarea name="notes"></textarea>
  </div>

  <div class="form-group">
    <label>Payment Method</label>
    <select name="payment" required>
      <option value="cash">Cash</option>
      <option value="gcash">GCash</option>
      <option value="bank transfer">Bank Transfer</option>
    </select>
  </div>

  <!-- These can be calculated dynamically later -->
  <input type="hidden" name="subtotal" value="1000">
  <input type="hidden" name="tax" value="100">
  <input type="hidden" name="total" value="1100">

  <button type="submit" class="btn-place-order">
    <i class="fas fa-lock"></i> Place Order
  </button>
</form>



                    <!-- Card Details Form -->
                    <form class="payment-form" id="cardForm">
                        <div class="form-group">
                            <label for="cardNumber">Card Number *</label>
                            <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="expiryDate">Expiry Date *</label>
                                <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" maxlength="5">
                            </div>
                            <div class="form-group">
                                <label for="cvv">CVV *</label>
                                <input type="text" id="cvv" name="cvv" placeholder="123" maxlength="3">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="cardName">Cardholder Name *</label>
                            <input type="text" id="cardName" name="cardName" placeholder="JOHN DOE">
                        </div>
                    </form>
                </section>
            </div>

            <!-- Right Column: Order Summary -->
            <aside class="order-summary glass-card">
                <h2 class="summary-title">Order Summary</h2>
                
                <!-- Order Items -->
                <div class="summary-items">
                    <div class="summary-item">
                        <img src="https://via.placeholder.com/60x80/00A9D6/ffffff?text=Alkaline" alt="Premium Alkaline Water">
                        <div class="item-info">
                            <h4>Premium Alkaline Water</h4>
                            <p>24 Bottles × 500ml</p>
                            <span class="item-qty">Qty: 2</span>
                        </div>
                        <span class="item-price">$49.98</span>
                    </div>
                    <div class="summary-item">
                        <img src="https://via.placeholder.com/60x80/00737F/ffffff?text=Sparkling" alt="Sparkling Mineral Water">
                        <div class="item-info">
                            <h4>Sparkling Mineral Water</h4>
                            <p>12 Bottles × 750ml</p>
                            <span class="item-qty">Qty: 1</span>
                        </div>
                        <span class="item-price">$18.50</span>
                    </div>
                    <div class="summary-item">
                        <img src="https://via.placeholder.com/60x80/00D6A1/ffffff?text=Spring" alt="Natural Spring Water">
                        <div class="item-info">
                            <h4>Natural Spring Water</h4>
                            <p>18 Bottles × 1L</p>
                            <span class="item-qty">Qty: 1</span>
                        </div>
                        <span class="item-price">$22.00</span>
                    </div>
                </div>

                <!-- Price Breakdown -->
                <div class="summary-details">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>$90.48</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span class="free-shipping">FREE</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (8%):</span>
                        <span>$7.24</span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row summary-total">
                        <span>Total:</span>
                        <span>$97.72</span>
                    </div>
                </div>

                <!-- Place Order Button -->
                <button class="btn-place-order" id="placeOrderBtn">
                    <i class="fas fa-lock"></i> Place Order
                </button>

                <!-- Security Badges -->
                <div class="security-info">
                    <div class="security-badge">
                        <i class="fas fa-shield-alt"></i>
                        <span>Secure SSL Encryption</span>
                    </div>
                    <div class="security-badge">
                        <i class="fas fa-undo"></i>
                        <span>30-Day Money Back</span>
                    </div>
                </div>

                <!-- Back to Cart -->
                <a href="Cart.html" class="back-to-cart">
                    <i class="fas fa-arrow-left"></i> Back to Cart
                </a>
            </aside>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-column">
                    <h3>Aqua Cart</h3>
                    <p>Pure, crisp hydration delivered responsibly to your doorstep. ISO certified, locally sourced, eco-friendly.</p>
                    <div class="social-links">
                        <a href="https://facebook.com/aquacart" aria-label="Facebook" target="_blank" rel="noopener">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
                        </a>
                        <a href="https://instagram.com/aquacart" aria-label="Instagram" target="_blank" rel="noopener">
                            <svg viewBox="0 0 24 24" width="24" height="24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                        </a>
                        <a href="https://twitter.com/aquacart" aria-label="Twitter" target="_blank" rel="noopener">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
                        </a>
                    </div>
                </div>
                <div class="footer-column">
                    <h4>Products</h4>
                    <ul>
                        <li><a href="products.html">Purified Water</a></li>
                        <li><a href="products.html">Mineral Water</a></li>
                        <li><a href="products.html">Alkaline Water</a></li>
                        <li><a href="products.html">Sparkling Water</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="About.html">About Us</a></li>
                        <li><a href="mission.html">Our Mission</a></li>
                        <li><a href="Reviews.html">Reviews</a></li>
                        <li><a href="Contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Contact</h4>
                    <ul>
                        <li>📞 (02) 8123-4567</li>
                        <li>📱 +63 917 123 4567</li>
                        <li>✉️ hello@aquacart.ph</li>
                        <li>📍 Metro Manila, Philippines</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Aqua Cart. All rights reserved.</p>
                <div class="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <script src="../js/Checkout.js"></script>
</body>
</html>