<?php
// Centralized session bootstrap: consistent cookie and session settings for all pages
// Include this file at the very top of entry scripts BEFORE any output.

if (session_status() !== PHP_SESSION_ACTIVE) {
    // Improved HTTPS detection (works behind some trusted proxies if they set X-Forwarded-Proto)
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
             || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)
             || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && stripos($_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false);

    // Use an app-specific session name to avoid collisions with other apps
    session_name('AQUA_SESSID');

    // Cookie path: use URL path (NOT filesystem path). Use '/' by default. If your app is served
    // from a subdirectory (e.g. '/aquacart/'), change this value accordingly.
    $cookiePath = '/';

    // For domain, prefer null so browser uses the host that served the page. Setting a domain
    // explicitly can cause issues on localhost or with ports.
    $cookieDomain = null;

    // Set server-side session lifetime (gc_maxlifetime) in seconds (example: 24 hours).
    ini_set('session.gc_maxlifetime', (string) (60 * 60 * 24));

    // PHP 7.3+ supports passing an array with SameSite. Fall back for older versions.
    if (defined('PHP_VERSION_ID') && PHP_VERSION_ID >= 70300) {
        session_set_cookie_params([
            'lifetime' => 0,        // session cookie (expires on browser close)
            'path'     => $cookiePath,
            'domain'   => $cookieDomain,
            'secure'   => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax',    // consider 'Strict' for stricter CSRF protection
        ]);
    } else {
        // Older PHP: set the common params and note SameSite fallback (may not be available)
        session_set_cookie_params(0, $cookiePath, $cookieDomain, $isHttps, true);
        // Note: SameSite cannot be set via session_set_cookie_params on PHP < 7.3 —
        // you can add a Set-Cookie header manually where needed for older PHP versions.
    }

    // Prevent cache headers that can interfere across CDNs/proxies
    if (function_exists('session_cache_limiter')) {
        @session_cache_limiter('nocache');
    }

    // Start session and log on failure
    if (!session_start()) {
        error_log('session_start() failed in ' . __FILE__);
    }

    // Initialize a CSRF token for use in forms (safe random source)
    if (empty($_SESSION['csrf_token'])) {
        try {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        } catch (Exception $e) {
            // Fallback to openssl if random_bytes is unavailable
            $_SESSION['csrf_token'] = bin2hex(openssl_random_pseudo_bytes(32));
        }
    }

    // Note: regenerate session ID after successful login (do that in the login handler):
    // session_regenerate_id(true);
}