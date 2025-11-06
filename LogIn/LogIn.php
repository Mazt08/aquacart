<?php
// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../session_boot.php';
include '../db_connect.php';

// Initialize error message variable
$error_message = '';

// Debug log function
function debug_log($message) {
    error_log("[Login Debug] " . $message);
}

// Process login form submission
debug_log("Starting login process...");
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    debug_log("POST request received");
    debug_log("POST data: " . print_r($_POST, true));
    
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        debug_log("Missing email or password");
        $error_message = "❌ Please fill in all fields";
    } else {
        // Prepare SQL to check user credentials and role
        $stmt = $conn->prepare("SELECT user_id, full_name, password, role FROM register WHERE email = ?");
        
        if ($stmt) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();
                debug_log("User found: " . print_r($user, true));
                
                // Verify password
                $passwordMatch = password_verify($password, $user['password']);
                debug_log("Password verification result: " . ($passwordMatch ? "true" : "false"));
                
                if ($passwordMatch) {
                    // Start session and store user info
                    session_regenerate_id(true);
                    $_SESSION['user_id'] = $user['user_id'];
                    $_SESSION['email'] = $email;
                    $_SESSION['full_name'] = $user['full_name'];
                    $_SESSION['role'] = $user['role'];

                    // Handle redirects in order of priority:
                    
                    // 1. Redirect from query string
                    if (!empty($_GET['redirect'])) {
                        header("Location: " . $_GET['redirect']);
                    }
                    // 2. Redirect from session
                    else if (!empty($_SESSION['redirect_after_login'])) {
                        header("Location: " . $_SESSION['redirect_after_login']);
                        unset($_SESSION['redirect_after_login']);
                    }
                    // 3. Default based on role
                    else {
                        if ($user['role'] === 'admin') {
                            header("Location: ../Admin Page/PHP/Dashboard.php");
                        } else {
                            // Check if there's a pending cart item
                            $pendingCartItem = isset($_SESSION['pendingCartItem']) ? $_SESSION['pendingCartItem'] : null;
                            if ($pendingCartItem) {
                                unset($_SESSION['pendingCartItem']);
                                header("Location: ../User Page/php/Cart.php");
                            } else {
                                header("Location: ../User Page/html/index.html");
                            }
                        }
                    }
                    exit();
                } else {
                    $error_message = "❌ Invalid email";
                }
            } else {
                $error_message = "❌ password";
            }
            $stmt->close();
        } else {
            $error_message = "❌ Database error. Please try again later.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - Aqua Cart | Member Login</title>
    <meta name="description" content="Sign in to your Aqua Cart account to manage orders, track deliveries, and enjoy exclusive member benefits.">
    <link rel="stylesheet" href="LogIn.css">
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
    </div>

    <!-- Login Container -->
    <div class="login-wrapper">
        <div class="login-container">
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
                    <h1>Welcome Back 💧</h1>
                    <p>Sign in to continue hydrating with Aqua Cart</p>
                </div>

                <?php if (!empty($error_message)): ?>
                <div style="background: linear-gradient(135deg, rgba(255, 87, 87, 0.1), rgba(255, 87, 87, 0.2)); border-left: 4px solid #ff5757; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #d32f2f; font-weight: 500;">
                        <?php echo htmlspecialchars($error_message); ?>
                    </p>
                </div>
                <?php endif; ?>

                <!-- Login Form -->
                <form class="login-form" method="POST" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" id="loginForm" novalidate>
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
                                placeholder="Enter your password" 
                                required 
                                autocomplete="current-password"
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
                    </div>

                    <!-- Remember Me & Forgot Password -->
                    <div class="form-options">
                        <label class="checkbox-wrapper">
                            <input type="checkbox" id="remember" name="remember">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">Remember me</span>
                        </label>
                        <a href="#forgot-password" class="forgot-link">Forgot Password?</a>
                    </div>

                    <!-- Sign In Button -->
                    <button type="submit" class="btn-signin">
                        <span class="btn-text">Sign In</span>
                        <span class="ripple-container"></span>
                    </button>
                </form>

                <!-- Sign Up Link -->
                <div class="signup-link">
                    <p>Don't have an account? <a href="SignUp.php">Sign Up</a></p>
                </div>
            </div>

            <!-- Footer Note -->
            <p class="footer-note">
                By signing in, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
            </p>
        </div>
    </div>

    <script src="LogIn.js"></script>
</body>
</html>