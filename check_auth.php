<?php
// API endpoint: return current auth status as JSON.
require_once __DIR__ . '/auth_common.php';

// auth_common.php ensures session is started and configured.
auth_status_json();

?>