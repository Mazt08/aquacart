<?php
// Centralized authentication helper for the project.
// Use this file from other scripts instead of duplicating logic.

// Ensure sessions are bootstrapped with the project's session settings.
if (session_status() !== PHP_SESSION_ACTIVE) {
    // session_boot.php sets cookie params and starts the session
    require_once __DIR__ . '/session_boot.php';
}

/**
 * Returns whether the current request has an authenticated user.
 * @return bool
 */
function isLoggedIn(): bool {
    return !empty($_SESSION['email']);
}

/**
 * Require a logged-in user for the current request.
 * If unauthenticated, either returns JSON (for AJAX) or redirects to login.
 *
 * @param bool $asJsonOnAjax When true (default) return JSON for XHR requests; when false always redirect.
 * @return bool Returns true when the user is logged in. Otherwise exits after responding.
 */
function require_login(bool $asJsonOnAjax = true): bool {
    if (isLoggedIn()) {
        return true;
    }

    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
             strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

    if ($isAjax && $asJsonOnAjax) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'redirect' => '/LogIn/LogIn.php',
            'message' => 'Please log in to continue'
        ]);
        exit();
    }

    // Regular request: redirect to a web path
    header('Location: /LogIn/LogIn.php');
    exit();
}

/**
 * Sends JSON auth status for client-side checks and exits.
 */
function auth_status_json(): void {
    header('Content-Type: application/json');
    $isLoggedIn = isLoggedIn();
    echo json_encode([
        'isLoggedIn' => $isLoggedIn,
        'redirectUrl' => $isLoggedIn ? null : '/LogIn/LogIn.php'
    ]);
    exit();
}

?>
