<?php
// Ensures columns for password reset + 2FA email code exist
function ensure_password_reset_schema(mysqli $conn): void {
    try {
        $needed = [
            'reset_token' => "ALTER TABLE register ADD COLUMN reset_token VARCHAR(128) NULL",
            'reset_expires' => "ALTER TABLE register ADD COLUMN reset_expires DATETIME NULL",
            'reset_code' => "ALTER TABLE register ADD COLUMN reset_code VARCHAR(12) NULL",
            'reset_code_expires' => "ALTER TABLE register ADD COLUMN reset_code_expires DATETIME NULL"
        ];
        $have = [];
        if ($res = $conn->query("SHOW COLUMNS FROM register")) {
            while ($row = $res->fetch_assoc()) { $have[strtolower($row['Field'])] = true; }
            $res->close();
        }
        foreach ($needed as $col => $ddl) {
            if (!isset($have[$col])) { @ $conn->query($ddl); }
        }
    } catch (Throwable $e) {
        // Best-effort
    }
}
?>
