<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Centralized session bootstrap
require_once __DIR__ . '/../session_boot.php';

// Initialize error variable
$error = '';

// Debug log function
function debug_log($message) {
    error_log("[SignUp Debug] " . $message);
}

// If already logged in, don't allow access to register page
if (!empty($_SESSION['email'])) {
    $role = strtolower($_SESSION['role'] ?? '');
    if (in_array($role, ['admin','manager'], true)) {
        header("Location: " . __DIR__ . "/../Admin Page/Html/Dashboard.html");
    } else {
        header("Location: " . __DIR__ . "/../User Page/html/index.html");
    }
    exit();
}

// Include database connection
include __DIR__ . '/../db_connect.php';

// Check if database connection is successful
if ($conn->connect_error) {
    debug_log("Database connection failed: " . $conn->connect_error);
    die("Database connection failed: " . $conn->connect_error);
}

$error = "";

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    debug_log("POST data received: " . print_r($_POST, true));
    debug_log('Form submitted');
    $fullName = trim($_POST['fullname'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPwd = $_POST['confirmPassword'] ?? '';
    
    debug_log("Received data - Name: $fullName, Email: $email");

    // Basic validation
    if (empty($fullName) || empty($email) || empty($password) || empty($confirmPwd)) {
        $error = "❌ All required fields must be filled.";
    } elseif (!preg_match("/^[a-zA-Z\s]+$/", $fullName)) {
        $error = "❌ Full name can only contain letters and spaces.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "❌ Invalid email format.";
    } elseif ($password !== $confirmPwd) {
        $error = "❌ Passwords do not match.";
    } elseif (strlen($password) < 8 || 
              !preg_match('/[A-Z]/', $password) || 
              !preg_match('/[a-z]/', $password) || 
              !preg_match('/[0-9]/', $password) || 
              !preg_match('/[\W]/', $password)) {
        $error = "❌ Password must be at least 8 chars long, with uppercase, lowercase, number, and special character.";
    } else {
        try {
            // Derive a username from email local-part to satisfy schemas expecting a username
            $username = strtolower(preg_replace('/[^a-z0-9_]/', '', strtok($email, '@')));
            $phone = '';

            // Check duplicate email
            $stmtCheck = $conn->prepare("SELECT COUNT(*) FROM register WHERE email = ?");
            if (!$stmtCheck) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmtCheck->bind_param("s", $email);
            $stmtCheck->execute();
            $stmtCheck->bind_result($count);
            $stmtCheck->fetch();
            $stmtCheck->close();
            debug_log("Duplicate check complete. Count: $count");

            if ($count > 0) {
                $error = "❌ Username or Email already exists.";
            } else {
                // Hash password
                $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

                // Insert into register table with customer role
                $stmtUser = $conn->prepare("INSERT INTO register (full_name, email, password, role, confirm_password) VALUES (?, ?, ?, 'customer', ?)");
                if (!$stmtUser) {
                    throw new Exception("Prepare failed: " . $conn->error);
                }
                $stmtUser->bind_param("ssss", $fullName, $email, $hashedPassword, $confirmPwd);

                if ($stmtUser->execute()) {
                    $stmtUser->close();

                    // Optionally set a flash session and redirect to login
                    $_SESSION['registered_email'] = $email;
                    header("Location: LogIn.php");
                    exit();
                } else {
                    $error = "❌ Database error: " . $conn->error;
                }
            }
        } catch (Exception $e) {
            $error = "❌ Error: " . $e->getMessage();
        }
    }
} // end of POST processing

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - Aqua Cart | Create Your Account</title>
    <meta name="description" content="Join Aqua Cart today! Create your account to enjoy exclusive benefits, order tracking, and seamless water delivery.">
    <link rel="stylesheet" href="SignUp.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Background Wave Pattern -->
    <div class="background-pattern">
        <svg class="wave-pattern" viewBox="0 0 1440 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4DD0E1;stop-opacity:0.1" />
                    <stop offset="50%" style="stop-color:#00ACC1;stop-opacity:0.15" />
                    <stop offset="100%" style="stop-color:#00838F;stop-opacity:0.2" />
                </linearGradient>
            </defs>
            <path d="M 0,400 C 240,320 480,480 720,400 C 960,320 1200,480 1440,400 L 1440,800 L 0,800 Z" fill="url(#waveGradient)">
                <animate attributeName="d" 
                    dur="20s" 
                    repeatCount="indefinite"
                    values="M 0,400 C 240,320 480,480 720,400 C 960,320 1200,480 1440,400 L 1440,800 L 0,800 Z;
                            M 0,400 C 240,480 480,320 720,400 C 960,480 1200,320 1440,400 L 1440,800 L 0,800 Z;
                            M 0,400 C 240,320 480,480 720,400 C 960,320 1200,480 1440,400 L 1440,800 L 0,800 Z" />
            </path>
            <path d="M 0,450 C 240,380 480,520 720,450 C 960,380 1200,520 1440,450 L 1440,800 L 0,800 Z" fill="url(#waveGradient)" opacity="0.5">
                <animate attributeName="d" 
                    dur="15s" 
                    repeatCount="indefinite"
                    values="M 0,450 C 240,380 480,520 720,450 C 960,380 1200,520 1440,450 L 1440,800 L 0,800 Z;
                            M 0,450 C 240,520 480,380 720,450 C 960,520 1200,380 1440,450 L 1440,800 L 0,800 Z;
                            M 0,450 C 240,380 480,520 720,450 C 960,380 1200,520 1440,450 L 1440,800 L 0,800 Z" />
            </path>
            <path d="M 0,500 C 240,440 480,560 720,500 C 960,440 1200,560 1440,500 L 1440,800 L 0,800 Z" fill="url(#waveGradient)" opacity="0.3">
                <animate attributeName="d" 
                    dur="25s" 
                    repeatCount="indefinite"
                    values="M 0,500 C 240,440 480,560 720,500 C 960,440 1200,560 1440,500 L 1440,800 L 0,800 Z;
                            M 0,500 C 240,560 480,440 720,500 C 960,560 1200,440 1440,500 L 1440,800 L 0,800 Z;
                            M 0,500 C 240,440 480,560 720,500 C 960,440 1200,560 1440,500 L 1440,800 L 0,800 Z" />
            </path>
        </svg>

        <!-- Side Illustration -->
        <div class="side-illustration">
            <div class="bottle-mockup">
                <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
                    <!-- Water Bottle -->
                    <defs>
                        <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#E1F5FE;stop-opacity:0.9" />
                            <stop offset="100%" style="stop-color:#B3E5FC;stop-opacity:0.7" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    
                    <!-- Bottle Cap -->
                    <rect x="70" y="30" width="60" height="25" rx="8" fill="#00ACC1" opacity="0.9"/>
                    <rect x="75" y="35" width="50" height="15" rx="5" fill="#4DD0E1" opacity="0.8"/>
                    
                    <!-- Bottle Body -->
                    <path d="M 80 55 L 70 80 L 70 320 Q 70 340, 85 345 L 115 345 Q 130 340, 130 320 L 130 80 L 120 55 Z" 
                          fill="url(#bottleGradient)" 
                          stroke="#00ACC1" 
                          stroke-width="2" 
                          opacity="0.9"/>
                    
                    <!-- Water Level -->
                    <path d="M 72 180 Q 100 185, 128 180 L 128 320 Q 128 338, 115 342 L 85 342 Q 72 338, 72 320 Z" 
                          fill="#4DD0E1" 
                          opacity="0.6">
                        <animate attributeName="d" 
                            dur="3s" 
                            repeatCount="indefinite"
                            values="M 72 180 Q 100 185, 128 180 L 128 320 Q 128 338, 115 342 L 85 342 Q 72 338, 72 320 Z;
                                    M 72 185 Q 100 180, 128 185 L 128 320 Q 128 338, 115 342 L 85 342 Q 72 338, 72 320 Z;
                                    M 72 180 Q 100 185, 128 180 L 128 320 Q 128 338, 115 342 L 85 342 Q 72 338, 72 320 Z" />
                    </path>
                    
                    <!-- Label -->
                    <rect x="75" y="150" width="50" height="60" rx="4" fill="white" opacity="0.8"/>
                    <text x="100" y="175" font-family="Inter" font-size="12" font-weight="700" fill="#00838F" text-anchor="middle">Aqua</text>
                    <text x="100" y="190" font-family="Inter" font-size="12" font-weight="400" fill="#00ACC1" text-anchor="middle">Cart</text>
                    
                    <!-- Droplet Icon on Label -->
                    <path d="M 100 195 C 100 195, 95 202, 95 207 C 95 210, 97 213, 100 213 C 103 213, 105 210, 105 207 C 105 202, 100 195, 100 195 Z" 
                          fill="#4DD0E1" 
                          opacity="0.7"/>
                    
                    <!-- Highlights -->
                    <ellipse cx="85" cy="100" rx="8" ry="20" fill="white" opacity="0.4"/>
                    <ellipse cx="90" cy="250" rx="6" ry="15" fill="white" opacity="0.3"/>
                </svg>
            </div>
            
            <!-- Water Splash Effect -->
            <div class="water-splash">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="40" fill="#4DD0E1" opacity="0.2">
                        <animate attributeName="r" values="40;60;40" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="100" cy="100" r="30" fill="#00ACC1" opacity="0.3">
                        <animate attributeName="r" values="30;50;30" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" begin="0.5s"/>
                    </circle>
                </svg>
            </div>
        </div>
    </div>

    <!-- SignUp Container -->
    <div class="signup-wrapper">
        <div class="signup-container">
            <!-- Back to Home Link -->
            <a href="../Guest Page/html/index.html" class="back-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back to Home
            </a>

            <!-- Logo -->
            <div class="logo-section">
                <svg class="logo" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(10, 5)">
                        <path d="M25 10 C25 10, 15 25, 15 35 C15 42, 19 48, 25 48 C31 48, 35 42, 35 35 C35 25, 25 10, 25 10 Z" 
                              fill="#4DD0E1" opacity="0.9"/>
                        <path d="M25 10 C25 10, 15 25, 15 35 C15 42, 19 48, 25 48 C31 48, 35 42, 35 35 C35 25, 25 10, 25 10 Z" 
                              fill="none" stroke="#00838F" stroke-width="2"/>
                        <ellipse cx="22" cy="30" rx="4" ry="6" fill="#FFFFFF" opacity="0.4"/>
                    </g>
                    <text x="60" y="38" font-family="Inter, sans-serif" font-size="24" font-weight="700" fill="#006064">Aqua</text>
                    <text x="115" y="38" font-family="Inter, sans-serif" font-size="24" font-weight="400" fill="#00838F">Cart</text>
                    <path d="M 60 42 Q 70 45, 80 42 T 100 42 T 120 42 T 140 42 T 160 42" 
                          stroke="#4DD0E1" stroke-width="2" fill="none" opacity="0.6"/>
                </svg>
            </div>

            <!-- Glass Card -->
            <div class="glass-card">
                <div class="card-header">
                    <h1>Create Your Aqua Cart Account 💦</h1>
                    <p>Join thousands of customers choosing clean hydration</p>
                </div>

                <!-- SignUp Form -->
                                <!-- SignUp Form -->
                <form class="signup-form" id="signupForm" method="POST" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" novalidate>
                    <!-- Full Name Field -->
                    <div class="form-group">
                        <label for="fullname">Full Name</label>
                        <div class="input-wrapper">
                            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <input 
                                type="text" 
                                id="fullname" 
                                name="fullname" 
                                placeholder="John Doe" 
                                required 
                                autocomplete="name"
                                aria-label="Full name"
                            >
                            <svg class="status-icon success-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span class="error-message" role="alert"></span>
                    </div>

                    <!-- Email Field -->
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <div class="input-wrapper">
                            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="your.email@example.com" 
                                required 
                                autocomplete="email"
                                aria-label="Email address"
                            >
                            <svg class="status-icon success-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span class="error-message" role="alert"></span>
                    </div>

                    <!-- Password Field -->
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="input-wrapper">
                            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Create a strong password" 
                                required 
                                autocomplete="new-password"
                                aria-label="Password"
                            >
                            <button type="button" class="toggle-password" aria-label="Toggle password visibility">
                                <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>
                        <span class="error-message" role="alert"></span>
                        <div class="password-strength">
                            <div class="strength-bar">
                                <div class="strength-fill"></div>
                            </div>
                            <span class="strength-text"></span>
                        </div>
                    </div>

                    <!-- Confirm Password Field -->
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <div class="input-wrapper">
                            <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <input 
                                type="password" 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                placeholder="Re-enter your password" 
                                required 
                                autocomplete="new-password"
                                aria-label="Confirm password"
                            >
                            <svg class="status-icon success-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <span class="error-message" role="alert"></span>
                    </div>

                    <!-- Terms & Privacy Checkbox -->
                    <div class="form-group checkbox-group">
                        <label class="checkbox-wrapper">
                            <input type="checkbox" id="terms" name="terms" required>
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">I agree to the <a href="#terms" class="link">Terms of Service</a> and <a href="#privacy" class="link">Privacy Policy</a></span>
                        </label>
                        <span class="error-message" role="alert"></span>
                    </div>

                    <!-- Create Account Button -->
                    <button type="submit" class="btn-signup">
                        <span class="btn-text">Create Account</span>
                        <span class="ripple-container"></span>
                    </button>
                </form>

                <!-- Sign In Link -->
                <div class="signin-link">
                    <p>Already have an account? <a href="LogIn.php">Sign In</a></p>
                </div>
            </div>

            <!-- Footer Note -->
            <p class="footer-note">
                By creating an account, you agree to receive promotional emails and updates from Aqua Cart
            </p>
        </div>
    </div>

    <script src="SignUp.js"></script>
</body>
</html>