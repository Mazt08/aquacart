document.addEventListener('DOMContentLoaded', function() {
    // Find all cart links
    const cartLinks = document.querySelectorAll('.nav-cart a, a[href*="Cart.php"]');
    
    cartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check auth status first
            fetch('/check_auth.php')
                .then(r => r.json())
                .then(data => {
                    if (!data.isLoggedIn) {
                        // Store intended destination
                        const currentPage = window.location.pathname;
                        sessionStorage.setItem('redirect_after_login', currentPage);
                        // Redirect to login
                        window.location.href = data.redirectUrl;
                    } else {
                        // Proceed to cart if logged in
                        window.location.href = link.href;
                    }
                })
                .catch(err => {
                    console.error('Auth check failed:', err);
                    // Default to redirect to cart
                    window.location.href = link.href;
                });
        });
    });
});