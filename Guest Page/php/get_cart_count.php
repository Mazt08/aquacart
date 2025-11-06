<?php
header('Content-Type: application/json');
require_once '../../db_connect.php';
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// If guest cart exists in session, return its total count
if (!isset($_SESSION['email'])) {
    if (isset($_SESSION['guest_cart']) && is_array($_SESSION['guest_cart'])) {
        $count = 0;
        foreach ($_SESSION['guest_cart'] as $q) {
            $count += (int)$q;
        }
        echo json_encode(['count' => $count]);
        exit();
    }
    echo json_encode(['count' => 0]);
    exit();
}

$email = $_SESSION['email'];
$stmt = $conn->prepare("SELECT user_id FROM register WHERE email = ? LIMIT 1");
$stmt->bind_param('s', $email);
$stmt->execute();
$res = $stmt->get_result();
if (!$row = $res->fetch_assoc()) {
    echo json_encode(['count' => 0]);
    exit();
}
$user_id = (int)$row['user_id'];
$stmt->close();

$countStmt = $conn->prepare("SELECT COALESCE(SUM(quantity),0) as cnt FROM cart WHERE user_id = ?");
$countStmt->bind_param('i', $user_id);
$countStmt->execute();
$cntRes = $countStmt->get_result();
$cntRow = $cntRes->fetch_assoc();
$count = (int)$cntRow['cnt'];
$countStmt->close();

echo json_encode(['count' => $count]);

?>
