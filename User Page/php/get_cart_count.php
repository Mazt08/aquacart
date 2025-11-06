<?php
require_once '../../db_connect.php';
require_once '../../session_boot.php';

header('Content-Type: application/json');

// Get user_id from session email
$email = $_SESSION['email'] ?? null;
if (!$email) {
    echo json_encode(['success' => false, 'error' => 'not_logged_in', 'count' => 0]);
    exit;
}

try {
    // First get the user_id from email
    $stmt = $conn->prepare("SELECT user_id FROM register WHERE email = ? LIMIT 1");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'user_not_found', 'count' => 0]);
        exit;
    }

    // Get just the total quantity from cart
    $stmt = $conn->prepare("SELECT COALESCE(SUM(quantity), 0) as count FROM cart WHERE user_id = ?");
    $stmt->bind_param("i", $user['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $count = (int)$result->fetch_assoc()['count'];

    echo json_encode([
        'success' => true,
        'count' => $count
    ]);
    
} catch (Exception $e) {
    error_log("Cart count error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'database_error', 'count' => 0]);
}