<?php
// Backwards-compatible wrapper that delegates to the centralized auth helper.
require_once __DIR__ . '/auth_common.php';

/**
 * Existing code expected a function named checkAuth(). Keep that API and
 * delegate to require_login() from auth_common.php. This will exit on
 * unauthenticated requests (JSON for XHR or Location redirect otherwise).
 */
function checkAuth() {
    return require_login(true);
}

?>