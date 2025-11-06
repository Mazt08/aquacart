<?php
// auth.php — thin shim that requires the centralized auth helper and
// enforces login for pages that must be private. Keeps backwards compatibility
// for includes that expect to include 'auth.php'.
require_once __DIR__ . '/auth_common.php';

// Enforce login for this request. Do NOT return JSON on AJAX here; behave
// like a normal page redirect (this mirrors the previous auth.php behavior).
require_login(false);
