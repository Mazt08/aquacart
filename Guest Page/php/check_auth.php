<?php
session_start();

function checkAuth() {
    if (!isset($_SESSION['email'])) {
        http_response_code(401);
        echo json_encode(['error' => 'login_required', 'message' => 'Please log in to add items to cart']);
        exit();
    }
    return true;
}
?>