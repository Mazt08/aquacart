-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 04, 2025 at 10:26 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aquacart_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `user_id`, `product_id`, `quantity`) VALUES
(1, 1, 11, 1),
(2, 1, 5, 1),
(3, 1, 1, 1),
(4, 2, 11, 3);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `first_name` varchar(150) DEFAULT NULL,
  `last_name` varchar(150) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `city` varchar(150) DEFAULT NULL,
  `zip_code` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT 'cash',
  `subtotal` decimal(10,2) DEFAULT 0.00,
  `tax` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT 0.00,
  `total_amount` decimal(10,2) DEFAULT 0.00,
  `order_status` varchar(50) DEFAULT 'Processing',
  `order_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `address`, `city`, `zip_code`, `notes`, `payment_method`, `subtotal`, `tax`, `total`, `total_amount`, `order_status`, `order_date`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'cash', 0.00, 0.00, 0.00, 0.00, 'Processing', '2025-11-04 20:06:37');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `item_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) UNSIGNED NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `category` varchar(150) NOT NULL,
  `sub_category` varchar(150) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `size` varchar(100) DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `category`, `sub_category`, `description`, `price`, `image`, `size`, `featured`) VALUES
(1, 'Aquafresh Alkaline', 'alkaline', 'Local Alkaline Brands', 'Premium local alkaline water with pH 8.5+. Perfect for daily hydration.', 45.00, '../../Assets/Products/Alkaline Water/Local Alkaline Brands/aquafresh.jpeg', '500ml', 1),
(2, 'Crystal Clear Alkaline', 'alkaline', 'Local Alkaline Brands', 'Pure alkaline water for optimal hydration and wellness.', 40.00, '../../Assets/Products/Alkaline Water/Local Alkaline Brands/crystalclear.jpg', '500ml', 0),
(3, 'Viva Alkaline', 'alkaline', 'Local Alkaline Brands', 'Enhanced alkaline water with essential minerals.', 42.00, '../../Assets/Products/Alkaline Water/Local Alkaline Brands/viva.jpg', '500ml', 1),
(4, 'Essentia Water', 'alkaline', 'Premium Imported Alkaline', 'Ionized alkaline water with pH 9.5+ from USA. Premium quality.', 95.00, '../../Assets/Products/Alkaline Water/Premium Imported Alkaline/essentia.jpg', '500ml', 1),
(5, 'Eternal Natural Alkaline', 'alkaline', 'Premium Imported Alkaline', 'Naturally alkaline spring water, sourced from pure mountain springs.', 90.00, '../../Assets/Products/Alkaline Water/Premium Imported Alkaline/eternal_natural.jpg', '500ml', 0),
(6, 'Life Water Singapore', 'alkaline', 'Premium Imported Alkaline', 'Premium alkaline water from Singapore with natural minerals.', 85.00, '../../Assets/Products/Alkaline Water/Premium Imported Alkaline/life_singapore.jpg', '500ml', 0),
(7, 'Highland Spring', 'mineral', 'Local Natural Mineral Water', 'Natural mineral water from highland springs. Rich in minerals.', 55.00, '../../Assets/Products/Mineral Water/Local Natural Mineral Water/Highland Spring.png', '1L', 1),
(8, 'Nature Spring Mineral', 'mineral', 'Local Natural Mineral Water', '100% natural mineral water with balanced mineral content.', 50.00, '../../Assets/Products/Mineral Water/Local Natural Mineral Water/NatureSpring-Mineral.png', '1L', 1),
(9, 'Summit Natural Mineral', 'mineral', 'Local Natural Mineral Water', 'Premium natural mineral water from protected springs.', 48.00, '../../Assets/Products/Mineral Water/Local Natural Mineral Water/Summit1L.png', '1L', 0),
(10, 'Absolute Purified', 'purified', 'Local Brands', 'Multi-stage purified drinking water. Clean and refreshing.', 30.00, '../../Assets/Products/Purified Water/Local Brands/3.Absolute.png', '500ml', 0),
(11, 'Absolute 5L', 'purified', 'Local Brands', 'Family size purified water. Perfect for home use.', 120.00, '../../Assets/Products/Purified Water/Local Brands/Absolute-5L.png', '5L', 1),
(12, 'Nature\'s Spring Purified', 'purified', 'Local Brands', 'Pure and refreshing drinking water for everyday use.', 28.00, '../../Assets/Products/Purified Water/Local Brands/NaturesSpring-1L.png', '1L', 1),
(13, 'Summit Purified 500ml', 'purified', 'Local Brands', 'Convenient purified water for on-the-go hydration.', 25.00, '../../Assets/Products/Purified Water/Local Brands/Summit-500ml.png', '500ml', 0),
(14, 'Wilkins Pure 1L', 'purified', 'Local Brands', 'Trusted purified drinking water. Quality you can rely on.', 32.00, '../../Assets/Products/Purified Water/Local Brands/WilkinsPure-1L.png', '1L', 1),
(15, 'Wilkins Pure 500ml', 'purified', 'Local Brands', 'Trusted purified drinking water in convenient size.', 20.00, '../../Assets/Products/Purified Water/Local Brands/Wilkin_s Pure - 500 ml.png', '500ml', 0);

-- --------------------------------------------------------

--
-- Table structure for table `register`
--

CREATE TABLE `register` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT NULL,
  `confirm_password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `register`
--

INSERT INTO `register` (`user_id`, `full_name`, `email`, `password`, `role`, `confirm_password`) VALUES
(1, 'Kim Ramirez', 'qkramirez04@tip.edu.ph', '$2y$10$DG8M4q1LHOoN2yzu4mwvbuYT4ZPLrmD2QoPGKK2TFewXqKPBKYWSG', 'customer', 'Ram!rez1410'),
(2, 'Ramirez Kimichi', 'ramirezkimichi1410@gmail.com', '$2y$10$PLskr5S3P/V04aeQW6ewFu.bSpA3OMxAAr2UGM2.Fu2As6aW/auIm', 'customer', 'K!ram1410');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_sub_category` (`sub_category`),
  ADD KEY `idx_featured` (`featured`);

--
-- Indexes for table `register`
--
ALTER TABLE `register`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `email_2` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `register`
--
ALTER TABLE `register`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
