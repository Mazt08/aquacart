<?php
require_once __DIR__ . '/../../auth.php';
include '../../db_connect.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Reviews - Aqua Cart | Premium Water Delivery</title>
    <meta name="description" content="Read what our customers say about Aqua Cart. Real reviews from satisfied customers who trust us for premium water delivery.">
    <link rel="stylesheet" href="../css/Reviews.css">
    <link rel="stylesheet" href="../css/nav-footer.css">
    <link rel="stylesheet" href="../css/mobileview.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <!-- NAVIGATION -->
    <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
            <a href="index.html" class="nav-logo" aria-label="Aqua Cart Home">
                <svg class="logo" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <!-- Water Droplet Icon -->
                    <g transform="translate(10, 5)">
                        <path d="M25 10 C25 10, 15 25, 15 35 C15 42, 19 48, 25 48 C31 48, 35 42, 35 35 C35 25, 25 10, 25 10 Z" 
                              fill="#4DD0E1" opacity="0.9"/>
                        <path d="M25 10 C25 10, 15 25, 15 35 C15 42, 19 48, 25 48 C31 48, 35 42, 35 35 C35 25, 25 10, 25 10 Z" 
                              fill="none" stroke="#00838F" stroke-width="2"/>
                        <!-- Water Highlight -->
                        <ellipse cx="22" cy="30" rx="4" ry="6" fill="#FFFFFF" opacity="0.4"/>
                    </g>
                    <!-- Text: Aqua Cart -->
                    <text x="60" y="38" font-family="Inter, sans-serif" font-size="24" font-weight="700" fill="#006064">
                        Aqua
                    </text>
                    <text x="115" y="38" font-family="Inter, sans-serif" font-size="24" font-weight="400" fill="#00838F">
                        Cart
                    </text>
                    <!-- Wavy underline -->
                    <path d="M 60 42 Q 70 45, 80 42 T 100 42 T 120 42 T 140 42 T 160 42" 
                          stroke="#4DD0E1" stroke-width="2" fill="none" opacity="0.6"/>
                </svg>
            </a>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu" role="menubar">
                <li role="none"><a href="../html/index.html" role="menuitem">Home</a></li>
                <li role="none"><a href="products.php" role="menuitem">Products</a></li>
                <li role="none"><a href="../html/About.html" role="menuitem">About</a></li>
                <li role="none"><a href="../html/mission.html" role="menuitem">Mission</a></li>
                <li role="none"><a href="#" role="menuitem">Reviews</a></li>
                <li role="none"><a href="../html/Contact.html" role="menuitem">Contact</a></li>
                <li role="none" class="nav-cart"><a href="Cart.html" role="menuitem" class="btn-cart" aria-label="Shopping Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="cart-count">0</span>
                </a></li>
                <li role="none" class="nav-cta"><a href="../Dashboard/Dashboard.html" role="menuitem" class="btn-login">Dashboard</a></li>
            </ul>
        </div>
    </nav>
    <div class="mobile-overlay"></div>

    <!-- HERO SECTION -->
    <section class="reviews-hero">
        <div class="container">
            <div class="hero-content">
                <span class="hero-badge">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path d="M10 1l2.5 6.5L19 8.5l-5.5 4.5L15 19l-5-3.5L5 19l1.5-6L1 8.5l6.5-1z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    4.9/5 Average Rating
                </span>
                <h1>What Our Customers Say</h1>
                <p class="hero-subtitle">Join thousands of satisfied customers who trust Aqua Cart for premium water delivery</p>
            </div>
        </div>
    </section>

    <!-- SUMMARY SECTION -->
    <section class="summary-section">
        <div class="container">
            <div class="summary-content">
                <div class="summary-stats">
                    <div class="rating-overview">
                        <div class="rating-number">4.9</div>
                        <div class="rating-stars">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4DD0E1">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4DD0E1">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4DD0E1">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4DD0E1">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#B2EBF2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <p class="rating-count">Based on 2,547 reviews</p>
                    </div>
                    <div class="rating-bars">
                        <div class="rating-bar-item">
                            <span class="bar-label">5 stars</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: 85%"></div>
                            </div>
                            <span class="bar-count">2,165</span>
                        </div>
                        <div class="rating-bar-item">
                            <span class="bar-label">4 stars</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: 10%"></div>
                            </div>
                            <span class="bar-count">255</span>
                        </div>
                        <div class="rating-bar-item">
                            <span class="bar-label">3 stars</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: 3%"></div>
                            </div>
                            <span class="bar-count">76</span>
                        </div>
                        <div class="rating-bar-item">
                            <span class="bar-label">2 stars</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: 1%"></div>
                            </div>
                            <span class="bar-count">25</span>
                        </div>
                        <div class="rating-bar-item">
                            <span class="bar-label">1 star</span>
                            <div class="bar-container">
                                <div class="bar-fill" style="width: 1%"></div>
                            </div>
                            <span class="bar-count">26</span>
                        </div>
                    </div>
                </div>
                <div class="summary-highlights">
                    <div class="highlight-card">
                        <div class="highlight-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="highlight-content">
                            <h3>Premium Quality</h3>
                            <p>99% customers rate our water quality as excellent</p>
                        </div>
                    </div>
                    <div class="highlight-card">
                        <div class="highlight-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                                <polyline points="12 6 12 12 16 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="highlight-content">
                            <h3>Fast Delivery</h3>
                            <p>97% deliveries arrive within promised time</p>
                        </div>
                    </div>
                    <div class="highlight-card">
                        <div class="highlight-icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="7" r="4" stroke-width="2"/>
                            </svg>
                        </div>
                        <div class="highlight-content">
                            <h3>Great Service</h3>
                            <p>98% would recommend us to friends and family</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FEATURED REVIEWS -->
    <section class="featured-reviews-section">
        <div class="container">
            <div class="section-header">
                <h2>Customer Reviews</h2>
                <p>Hear from our most satisfied customers</p>
            </div>
            <div class="reviews-grid">
                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">SM</div>
                            <div class="reviewer-details">
                                <h4>Sarah Mitchell</h4>
                                <p class="reviewer-location">Lusaka, Zambia</p>
                            </div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <span class="verified-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4DD0E1">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Verified Purchase
                            </span>
                        </div>
                    </div>
                    <div class="review-content">
                        <h3>"Outstanding quality and service!"</h3>
                        <p>I've been using Aqua Cart for over a year now, and I'm consistently impressed by the quality of their water and reliability of delivery. The drivers are professional and the app makes ordering so convenient. Highly recommend!</p>
                    </div>
                    <div class="review-footer">
                        <span class="review-date">2 days ago</span>
                        <div class="review-actions">
                            <button class="action-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>42</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">JK</div>
                            <div class="reviewer-details">
                                <h4>James Kabwe</h4>
                                <p class="reviewer-location">Kitwe, Zambia</p>
                            </div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <span class="verified-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4DD0E1">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Verified Purchase
                            </span>
                        </div>
                    </div>
                    <div class="review-content">
                        <h3>"Best water delivery service!"</h3>
                        <p>Clean, refreshing water delivered right to my door. The subscription service is perfect for my family's needs, and I love that they use eco-friendly packaging. Customer service is also top-notch!</p>
                    </div>
                    <div class="review-footer">
                        <span class="review-date">1 week ago</span>
                        <div class="review-actions">
                            <button class="action-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>38</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">PM</div>
                            <div class="reviewer-details">
                                <h4>Patricia Mwansa</h4>
                                <p class="reviewer-location">Ndola, Zambia</p>
                            </div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <span class="verified-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4DD0E1">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Verified Purchase
                            </span>
                        </div>
                    </div>
                    <div class="review-content">
                        <h3>"Reliable and convenient"</h3>
                        <p>As a busy professional, Aqua Cart has made my life so much easier. The app is intuitive, deliveries are always on time, and the water quality is exceptional. Worth every kwacha!</p>
                    </div>
                    <div class="review-footer">
                        <span class="review-date">2 weeks ago</span>
                        <div class="review-actions">
                            <button class="action-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>29</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">CN</div>
                            <div class="reviewer-details">
                                <h4>Charity Nachula</h4>
                                <p class="reviewer-location">Lusaka, Zambia</p>
                            </div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <span class="verified-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4DD0E1">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Verified Purchase
                            </span>
                        </div>
                    </div>
                    <div class="review-content">
                        <h3>"Fresh water, excellent service"</h3>
                        <p>Excellent service! The water is always fresh and the delivery is prompt. I appreciate the eco-friendly bottles they use. This company truly cares about quality and sustainability.</p>
                    </div>
                    <div class="review-footer">
                        <span class="review-date">3 days ago</span>
                        <div class="review-actions">
                            <button class="action-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>15</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">DM</div>
                            <div class="reviewer-details">
                                <h4>David Mulenga</h4>
                                <p class="reviewer-location">Livingstone, Zambia</p>
                            </div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <span class="verified-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4DD0E1">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Verified Purchase
                            </span>
                        </div>
                    </div>
                    <div class="review-content">
                        <h3>"Perfect for my office"</h3>
                        <p>Great quality water at reasonable prices. The subscription model works perfectly for my office. Highly recommended! Our team is very satisfied with the consistent quality.</p>
                    </div>
                    <div class="review-footer">
                        <span class="review-date">5 days ago</span>
                        <div class="review-actions">
                            <button class="action-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>12</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">BT</div>
                            <div class="reviewer-details">
                                <h4>Brian Tembo</h4>
                                <p class="reviewer-location">Solwezi, Zambia</p>
                            </div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">⭐⭐⭐⭐⭐</div>
                            <span class="verified-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="#4DD0E1">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Verified Purchase
                            </span>
                        </div>
                    </div>
                    <div class="review-content">
                        <h3>"Best in Zambia!"</h3>
                        <p>Best water delivery in Zambia! Clean, affordable, and their customer service is exceptional. Been a customer for 2 years and never had any issues. Keep up the great work!</p>
                    </div>
                    <div class="review-footer">
                        <span class="review-date">1 week ago</span>
                        <div class="review-actions">
                            <button class="action-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span>21</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA SECTION -->
    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2>Share Your Experience</h2>
                <p>Your feedback helps us serve you better and helps others make informed decisions</p>
                <button class="btn-primary" id="writeReviewBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Write a Review
                </button>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-column">
                    <h3>Aqua Cart</h3>
                    <p>Pure, crisp hydration delivered responsibly to your doorstep. ISO certified, locally sourced, eco-friendly.</p>
                    <div class="social-links">
                        <a href="https://facebook.com/aquacart" aria-label="Facebook" target="_blank" rel="noopener">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
                        </a>
                        <a href="https://instagram.com/aquacart" aria-label="Instagram" target="_blank" rel="noopener">
                            <svg viewBox="0 0 24 24" width="24" height="24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                        </a>
                        <a href="https://twitter.com/aquacart" aria-label="Twitter" target="_blank" rel="noopener">
                            <svg viewBox="0 0 24 24" width="24" height="24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
                        </a>
                    </div>
                </div>
                <div class="footer-column">
                    <h4>Products</h4>
                    <ul>
                        <li><a href="products.html">Purified Water</a></li>
                        <li><a href="products.html">Mineral Water</a></li>
                        <li><a href="products.html">Alkaline Water</a></li>
                        <li><a href="products.html">Sparkling Water</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="About.html">About Us</a></li>
                        <li><a href="mission.html">Our Mission</a></li>
                        <li><a href="Reviews.html">Reviews</a></li>
                        <li><a href="Contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Contact</h4>
                    <ul>
                        <li>📞 (02) 8123-4567</li>
                        <li>📱 +63 917 123 4567</li>
                        <li>✉️ hello@aquacart.ph</li>
                        <li>📍 Metro Manila, Philippines</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Aqua Cart. All rights reserved.</p>
                <div class="footer-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <script src="../js/Reviews.js"></script>
</body>
</html>