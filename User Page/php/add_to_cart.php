<?php
session_start();
// Adjust the path to your db_connect.php as needed (assuming two levels up from /Guest Page/php/)
include '../../db_connect.php'; 

header('Content-Type: application/json');

// Get POST data
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

$productId = (int)($data['productId'] ?? 0);
$quantity = (int)($data['quantity'] ?? 1);

// --- 1. Check Authentication ---
$email = $_SESSION['email'] ?? null;
$user_id = null;

if (empty($email)) {
    // Guest user: reject the request and prompt login
    echo json_encode([
        'success' => false,
        'error' => 'not_logged_in',
        'message' => 'Please log in to add items to your cart.',
        'redirect' => '../../LogIn/LogIn.php' // Adjust path to your login page
    ]);
    exit();
}

// Find user_id from session email
$stmtU = $conn->prepare("SELECT user_id FROM register WHERE email = ? LIMIT 1");
if ($stmtU) {
    $stmtU->bind_param('s', $email);
    $stmtU->execute();
    $resU = $stmtU->get_result();
    if ($rowU = $resU->fetch_assoc()) {
        $user_id = (int)$rowU['user_id'];
    }
    $stmtU->close();
}

if (!$user_id) {
     echo json_encode(['success' => false, 'error' => 'user_not_found', 'message' => 'User session invalid. Please log in again.']);
    session_unset();
    session_destroy();
    exit();
}

if ($productId <= 0 || $quantity <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid product or quantity.']);
    exit();
}

try {
    $conn->begin_transaction();

    // --- 2. Check if item already exists in cart ---
    $checkStmt = $conn->prepare("SELECT cart_id, quantity FROM cart WHERE user_id = ? AND product_id = ? LIMIT 1");
    $checkStmt->bind_param('ii', $user_id, $productId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    $cartItem = $result->fetch_assoc();
    $checkStmt->close();

    if ($cartItem) {
        // --- 3. Update existing item quantity ---
        $newQuantity = $cartItem['quantity'] + $quantity;
        $updateStmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
        $updateStmt->bind_param('ii', $newQuantity, $cartItem['cart_id']);
        $updateSuccess = $updateStmt->execute();
        $updateStmt->close();
        $message = "Cart item quantity updated successfully.";
    } else {
        // --- 4. Insert new item ---
        $insertStmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
        $insertStmt->bind_param('iii', $user_id, $productId, $quantity);
        $updateSuccess = $insertStmt->execute();
        $insertStmt->close();
        $message = "Item added to cart successfully.";
    }

    if (!$updateSuccess) {
        throw new Exception("Database operation failed: " . $conn->error);
    }
    
    // --- 5. Get the new total cart count for the frontend ---
    $countStmt = $conn->prepare("SELECT COALESCE(SUM(quantity), 0) as total FROM cart WHERE user_id = ?");
    $countStmt->bind_param('i', $user_id);
    $countStmt->execute();
    $res = $countStmt->get_result();
    $newCount = (int)$res->fetch_assoc()['total'];
    $countStmt->close();

    $conn->commit();
    
    echo json_encode([
        'success' => true, 
        'message' => $message,
        'count' => $newCount
    ]);

} catch (Exception $e) {
    $conn->rollback();
    error_log("Add to Cart Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred while adding to cart.']);
}
?>