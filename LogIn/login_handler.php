<?php
function handleSuccessfulLogin($user) {
    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['full_name'] = $user['full_name'];
    $_SESSION['role'] = $user['role'];

    // Check for redirect URL
    if (!empty($_SESSION['redirect_after_login'])) {
        $redirect = $_SESSION['redirect_after_login'];
        unset($_SESSION['redirect_after_login']);
        header("Location: $redirect");
    } else {
        // Default redirects based on role
        if ($user['role'] === 'admin') {
            header("Location: ../Admin Page/PHP/Dashboard.php");
        } else {
            header("Location: ../User Page/html/index.html");
        }
    }
    exit();
}
?>