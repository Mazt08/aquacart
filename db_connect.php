<?php
$servername = "localhost";   // usually "localhost"
$port = "3306";            // default MySQL port
$username   = "root";        // your MySQL username
$password   = "";            // your MySQL password (default empty in XAMPP)
$dbname     = "aquacart_db"; // replace with your DB name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure the connection uses utf8mb4 for full Unicode support
// This helps avoid charset/collation mismatches with tables defined as utf8mb4
if (!$conn->set_charset('utf8mb4')) {
    error_log('Failed to set MySQL charset to utf8mb4: ' . $conn->error);
}
?>  