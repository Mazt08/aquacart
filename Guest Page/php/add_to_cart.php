<?php
require_once '../../db_connect.php';

header('Content-Type: application/json');

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'method_not_allowed', 'message' => 'Only POST method is allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$productId = isset($data['productId']) ? (int)$data['productId'] : null;
$quantity = isset($data['quantity']) ? (int)$data['quantity'] : 1;

if (!$productId || $quantity < 1) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid_request', 'message' => 'Product ID and positive quantity are required']);
    exit();
}

// Start session explicitly; allow guests to use session cart
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Check if user is logged in
$email = $_SESSION['email'] ?? null;
if (!$email) {
    http_response_code(401);
    echo json_encode(['error' => 'not_logged_in', 'message' => 'Please login to add items to cart']);
    exit();
}

// Logged-in flow: use DB-backed cart
try {
    $stmtU = $conn->prepare("SELECT user_id FROM register WHERE email = ? LIMIT 1");
    $stmtU->bind_param('s', $email);
    $stmtU->execute();
    $resU = $stmtU->get_result();
    if (!($rowU = $resU->fetch_assoc())) {
        http_response_code(500);
        echo json_encode(['error' => 'server_error', 'message' => 'User not found']);
        exit();
    }
    $user_id = (int)$rowU['user_id'];
    $stmtU->close();

        // If an entry for this user+product exists, update quantity. Otherwise insert.
        $check = $conn->prepare("SELECT cart_id, quantity FROM cart WHERE user_id = ? AND product_id = ? LIMIT 1");
        $check->bind_param('ii', $user_id, $productId);
        $check->execute();
        $res = $check->get_result();

        if ($row = $res->fetch_assoc()) {
            $cart_id = (int)$row['cart_id'];
            $newQty = (int)$row['quantity'] + $quantity;
            $upd = $conn->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
            $upd->bind_param('ii', $newQty, $cart_id);
            $upd->execute();
            $upd->close();
        } else {
            $ins = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
            $ins->bind_param('iii', $user_id, $productId, $quantity);
            $ins->execute();
            $cart_id = $ins->insert_id;
            $ins->close();
        }

        // Return new cart count for UI update
        $countStmt = $conn->prepare("SELECT COALESCE(SUM(quantity),0) as cnt FROM cart WHERE user_id = ?");
        $countStmt->bind_param('i', $user_id);
        $countStmt->execute();
        $cntRes = $countStmt->get_result();
        $cntRow = $cntRes->fetch_assoc();
        $count = (int)$cntRow['cnt'];
        $countStmt->close();

        echo json_encode(['success' => true, 'message' => 'Item added to cart', 'cart_id' => $cart_id, 'count' => $count]);
        exit();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'server_error', 'message' => 'Failed to add item to cart', 'debug' => $e->getMessage()]);
        exit();
    }
}

?>