<?php

// === START DEBUGGING BLOCK ===
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// === END DEBUGGING BLOCK ===

session_start();
include '../../db_connect.php';

// Initialize cart items array and user-related variables
$cartItems = [];
$user_id = null;
$cartCount = 0;
$is_logged_in = false;

// Safe read of session email (supports guests)
$email = $_SESSION['email'] ?? null;

// If a logged-in user exists, resolve their user_id and cart count.
if (!empty($email)) {
    $stmtU = $conn->prepare("SELECT user_id FROM register WHERE email = ? LIMIT 1");
    if ($stmtU) {
        $stmtU->bind_param('s', $email);
        $stmtU->execute();
        $resU = $stmtU->get_result();
        $rowU = $resU->fetch_assoc();

        if ($rowU) {
            $user_id = (int)$rowU['user_id'];
            $is_logged_in = true;

            // Get cart count for logged-in user
            $stmtCart = $conn->prepare("SELECT COALESCE(SUM(quantity), 0) as total_quantity FROM cart WHERE user_id = ?");
            if ($stmtCart) {
                $stmtCart->bind_param('i', $user_id);
                $stmtCart->execute();
                $cartResult = $stmtCart->get_result();
                $cartCount = (int)($cartResult->fetch_assoc()['total_quantity'] ?? 0);
                $stmtCart->close();
            }
        } else {
            // !!! THIS IS THE PROBLEM AREA !!!
            // Session email is present but user lookup failed — clear session to avoid surprises
            error_log("INVALID USER SESSION: Email " . $email . " not found in register table. Session destroyed.");
            session_unset();
            session_destroy();
            $email = null;
        }
        $stmtU->close();
    } else {
        error_log("DATABASE ERROR: Failed to prepare user lookup statement: " . $conn->error);
    }
}

// Add cart count to JavaScript
echo "<script>window.initialCartCount = " . json_encode($cartCount) . ";</script>";

// Handle AJAX actions (update quantity, remove item, clear cart)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true);
    $action = $_POST['action'] ?? $json['action'] ?? null;

    // All modifying actions require a logged-in user.
    if (!$is_logged_in || $user_id === null) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'not_logged_in', 'message' => 'Please log in to manage your cart.', 'redirect' => '../../LogIn/LogIn.php']);
        exit();
    }
    
    // --- AJAX: update_quantity ---
    if ($action === 'update_quantity') {
        $cart_id = (int)($json['cart_id'] ?? 0);
        $quantity = (int)($json['quantity'] ?? 1);
        $ok = false;
        
        if ($cart_id && $quantity >= 1) {
            $upd = $conn->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?");
            if ($upd) {
                $upd->bind_param('iii', $quantity, $cart_id, $user_id);
                $ok = $upd->execute();
                $upd->close();
            }
        }

        $totStmt = $conn->prepare("SELECT SUM(p.price * c.quantity) as subtotal FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?");
        $totStmt->bind_param('i', $user_id);
        $totStmt->execute();
        $totRow = $totStmt->get_result()->fetch_assoc();
        $subtotal_calc = (float)($totRow['subtotal'] ?? 0);
        $tax_calc = $subtotal_calc * 0.08;
        $shipping_calc = $subtotal_calc < 500 ? 10 : 0;
        $total_calc = $subtotal_calc + $tax_calc + $shipping_calc;
        $totStmt->close();

        header('Content-Type: application/json');
        echo json_encode(['success' => (bool)$ok, 'subtotal' => $subtotal_calc, 'tax' => $tax_calc, 'shipping' => $shipping_calc, 'total' => $total_calc]);
        exit();
    }

    // --- AJAX: remove_item ---
    if ($action === 'remove_item') {
        header('Content-Type: application/json');
        $cart_id = (int)($json['cart_id'] ?? 0);
        
        if (!$cart_id) { echo json_encode(['success' => false, 'message' => 'Invalid cart ID provided']); exit(); }

        try {
            $conn->begin_transaction();
            $del = $conn->prepare("DELETE FROM cart WHERE cart_id = ? AND user_id = ?");
            $del->bind_param('ii', $cart_id, $user_id);
            $del->execute();
            $del->close();

            $totalsStmt = $conn->prepare("SELECT COALESCE(SUM(p.price * c.quantity), 0) as subtotal, COALESCE(SUM(c.quantity), 0) as total_quantity FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?");
            $totalsStmt->bind_param('i', $user_id);
            $totalsStmt->execute();
            $totals = $totalsStmt->get_result()->fetch_assoc();
            $totalsStmt->close();

            $newSubtotal = (float)($totals['subtotal'] ?? 0);
            $newCount = (int)($totals['total_quantity'] ?? 0);
            $newTax = $newSubtotal * 0.08;
            $newShipping = $newSubtotal < 500 ? 10 : 0;
            $newTotal = $newSubtotal + $newTax + $newShipping;

            $conn->commit();
            echo json_encode([
                'success' => true, 'message' => 'Item removed successfully', 'cartCount' => $newCount, 
                'newSubtotal' => $newSubtotal, 'newTotal' => $newTotal, 'newTax' => $newTax, 'newShipping' => $newShipping
            ]);
            exit();

        } catch (Exception $e) {
            $conn->rollback();
            error_log("Remove cart item error: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Failed to remove item. Please try again.']);
            exit();
        }
    }

    // --- AJAX: clear_cart ---
    if ($action === 'clear_cart') {
        $del = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
        $del->bind_param('i', $user_id);
        $ok = $del->execute();
        $del->close();
        header('Content-Type: application/json');
        echo json_encode(['success' => (bool)$ok]);
        exit();
    }
}

// Initialize variables for HTML output
$subtotal = 0.0;
$cartItems = [];

// Fetch cart items from DB with product details ONLY IF LOGGED IN
if ($is_logged_in && $user_id !== null) {
    // THIS SQL IS CORRECT AND PULLS ALL NECESSARY PRODUCT DATA VIA JOIN
    $sql = "SELECT c.cart_id, c.product_id, c.quantity, p.product_name, p.price, p.image, p.size, p.description,
        (p.price * c.quantity) as total_price
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = ?
        ORDER BY c.cart_id ASC";

    $stmt = $conn->prepare($sql);

    if ($stmt && $stmt->bind_param('i', $user_id) && $stmt->execute()) {
        $res = $stmt->get_result();
        
        while ($row = $res->fetch_assoc()) {
            $row['price'] = (float)$row['price'];
            $row['quantity'] = (int)$row['quantity'];
            $row['total'] = (float)$row['total_price'];
            $subtotal += $row['total'];
            $cartItems[] = $row;
        }
        $stmt->close();
    }
}
 
// Calculate totals for display
$tax = $subtotal * 0.08;
$shipping = $subtotal < 500 ? 10 : 0;
$total = $subtotal + $tax + $shipping;

$totalItems = 0;
if (!empty($cartItems)) {
    $totalItems = array_sum(array_column($cartItems, 'quantity'));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - AquaCart</title>
    <meta name="description" content="Review your AquaCart order - Pure, refreshing bottled water delivered to your door.">
    <link rel="stylesheet" href="../css/Cart.css">
    <link rel="stylesheet" href="../css/nav-footer.css">
    <link rel="stylesheet" href="../css/mobileview.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
            <a href="../html/index.html" class="nav-logo" aria-label="Aqua Cart Home">
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
                <li role="none"><a href="../html/index.html" role="menuitem">Home</a></li>
                <li role="none"><a href="products.php" role="menuitem">Products</a></li>
                <li role="none"><a href="../html/About.html" role="menuitem">About</a></li>
                <li role="none"><a href="../html/mission.html" role="menuitem">Mission</a></li>
                <li role="none"><a href="Reviews.php" role="menuitem">Reviews</a></li>
                <li role="none"><a href="../html/Contact.html" role="menuitem">Contact</a></li>
                <li role="none" class="nav-cart active"><a href="Cart.php" role="menuitem" class="btn-cart" aria-label="Shopping Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="cart-count"><?=htmlspecialchars($cartCount)?></span>
                </a></li>
                <li role="none" class="nav-cta"><a href="../Dashboard/Dashboard.php" role="menuitem" class="btn-login">Dashboard</a></li>
            </ul>
        </div>
    </nav>

    <!-- Animated Water Background -->
    <div class="water-bg">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
    </div>

    <!-- Cart Main Content -->
    <main class="cart-container">
        <div class="cart-header">
            <h1 class="cart-title">Your Cart 💧</h1>
            <p class="cart-subtitle">Review your refreshing selection</p>
        </div>

        <div class="cart-content">
            <!-- Cart Items Section -->
            <section class="cart-items-section">
                <!-- Conditional display for header -->
                <div class="cart-items-header" style="<?=!$is_logged_in || empty($cartItems) ? 'display: none;' : 'display: flex;'?>">
                    <h2>Cart Items</h2>
                    <button class="clear-cart-btn" id="clearCartBtn">
                        <i class="fas fa-trash-alt"></i> Clear All
                    </button>
                </div>

                <!-- Cart Items List - Shown only if logged in AND not empty -->
                <div class="cart-items" id="cartItems" style="<?=!$is_logged_in || empty($cartItems) ? 'display: none;' : 'display: block;'?>">
                    <?php foreach ($cartItems as $idx => $item): ?>
                        <div class="cart-item glass-card" 
                            data-cart-id="<?=htmlspecialchars($item['cart_id'])?>" 
                            data-id="<?=htmlspecialchars($item['product_id'])?>" 
                            data-price="<?=number_format($item['price'],2,'.','')?>"
                        >
                            <div class="item-image">
                                <?php if (!empty($item['image'])): ?>
                                    <img src="<?=htmlspecialchars($item['image'])?>" 
                                         alt="<?=htmlspecialchars($item['product_name'])?>"
                                         onerror="this.src='https://via.placeholder.com/120x180?text=No+Image'">
                                <?php else: ?>
                                    <img src="https://via.placeholder.com/120x180?text=No+Image" 
                                         alt="No image available">
                                <?php endif; ?>
                            </div>
                            <div class="item-details">
                                <h3 class="item-name"><?=htmlspecialchars($item['product_name'])?></h3>
                                <?php if (!empty($item['description'])): ?>
                                    <p class="item-description"><?=htmlspecialchars($item['description'])?></p>
                                <?php endif; ?>
                                <?php if (!empty($item['size'])): ?>
                                    <p class="item-size">Size: <?=htmlspecialchars($item['size'])?></p>
                                <?php endif; ?>
                                <div class="item-actions-mobile">
                                    <button class="remove-item-btn" 
                                            title="Remove item" 
                                            data-cart-id="<?=htmlspecialchars($item['cart_id'])?>"
                                    >
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="item-quantity">
                                <label for="qty-<?=$idx?>">Quantity:</label>
                                <div class="quantity-control">
                                    <button class="qty-btn qty-decrease" 
                                            aria-label="Decrease quantity" 
                                            data-cart-id="<?=htmlspecialchars($item['cart_id'])?>"
                                    > 
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <input type="number" 
                                           id="qty-<?=$idx?>" 
                                           class="qty-input" 
                                           value="<?=htmlspecialchars($item['quantity'])?>" 
                                           min="1" 
                                           max="99" 
                                           aria-label="Quantity" 
                                           data-cart-id="<?=htmlspecialchars($item['cart_id'])?>"
                                           data-product-id="<?=htmlspecialchars($item['product_id'])?>"
                                    >
                                    <button class="qty-btn qty-increase" 
                                            aria-label="Increase quantity"
                                            data-cart-id="<?=htmlspecialchars($item['cart_id'])?>"
                                    >
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="item-price">
                                <span class="price-label">Unit Price:</span>
                                <span class="price-value">₱<?=number_format($item['price'],2)?></span>
                            </div>
                            <div class="item-total">
                                <span class="total-label">Subtotal:</span>
                                <span class="total-value">₱<?=number_format($item['price'] * $item['quantity'],2)?></span>
                            </div>
                            <button class="remove-item-btn desktop-only" title="Remove item" data-cart-id="<?=htmlspecialchars($item['cart_id'])?>">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Empty Cart / Guest State -->
                <div class="empty-cart" id="emptyCart" style="<?php echo (!$is_logged_in || empty($cartItems)) ? 'display: flex;' : 'display: none;'; ?>">
                    <?php if (!$is_logged_in): ?>
                        <div class="guest-cart-message" style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                            <i class="fas fa-lock" style="font-size: 3rem; color: #00bcd4; margin-bottom: 20px;"></i>
                            <h2>Please Log In to Manage Your Cart</h2>
                            <p>Your cart status will be saved once you log in.</p>
                            <a href="../../LogIn/LogIn.php" class="btn-shop" style="margin-top: 20px;">
                                <i class="fas fa-sign-in-alt"></i> Log In Now
                            </a>
                        </div>
                    <?php else: ?>
                        <div class="empty-illustration">
                            <i class="fas fa-droplet"></i>
                            <i class="fas fa-droplet"></i>
                            <i class="fas fa-droplet"></i>
                        </div>
                        <h2>Your cart is empty</h2>
                        <p>Start adding some refreshing water to hydrate!</p>
                        <a href="products.php" class="btn-shop">
                            <i class="fas fa-shopping-bag"></i> Shop Products
                        </a>
                    <?php endif; ?>
                </div>
            </section>

            <!-- Order Summary Sidebar -->
            <aside class="order-summary glass-card">
                <h2 class="summary-title">Order Summary</h2>
                
                <div class="summary-details">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span id="subtotal">₱<?=number_format($subtotal,2)?></span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span id="shipping"><?=($subtotal >= 500) ? 'FREE' : '₱10.00'?></span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (8%):</span>
                        <span id="tax">₱<?=number_format($tax,2)?></span>
                    </div>
                    <div class="summary-divider"></div>
                    <div class="summary-row summary-total">
                        <span>Total:</span>
                        <span id="total">₱<?=number_format($total,2)?></span>
                    </div>
                </div>

                <div class="promo-code">
                    <input type="text" id="promoInput" placeholder="Enter promo code" aria-label="Promo code">
                    <button id="applyPromoBtn" class="btn-apply">Apply</button>
                </div>

                <div class="promo-message" id="promoMessage"></div>

                <button class="btn-checkout" id="checkoutBtn" <?php if (!$is_logged_in || empty($cartItems)) echo 'disabled'; ?>>
                    <i class="fas fa-lock"></i> Proceed to Checkout
                </button>
                <?php if (!$is_logged_in): ?>
                    <p style="text-align: center; color: #e74c3c; margin-top: 10px;">Log in to checkout.</p>
                <?php endif; ?>

                <div class="security-badges">
                    <div class="badge">
                        <i class="fas fa-shield-alt"></i>
                        <span>Secure Checkout</span>
                    </div>
                    <div class="badge">
                        <i class="fas fa-truck"></i>
                        <span>Free Shipping ₱500+</span>
                    </div>
                </div>

                <a href="products.php" class="continue-shopping">
                    <i class="fas fa-arrow-left"></i> Continue Shopping
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
                        <li><a href="products.php">Purified Water</a></li>
                        <li><a href="products.php">Mineral Water</a></li>
                        <li><a href="products.php">Alkaline Water</a></li>
                        <li><a href="products.php">Sparkling Water</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="../html/About.html">About Us</a></li>
                        <li><a href="../html/mission.html">Our Mission</a></li>
                        <li><a href="Reviews.php">Reviews</a></li>
                        <li><a href="../html/Contact.html">Contact</a></li>
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

    <script src="../js/Cart.js"></script>
</body>
</html>