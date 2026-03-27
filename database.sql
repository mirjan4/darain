-- =============================================
-- Darain Modest Fashions - Unified Database Schema
-- Database: darain_db
-- =============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- 1. Create Database
-- --------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `darain_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `darain_db`;

-- --------------------------------------------------------
-- 2. Create Tables
-- --------------------------------------------------------

-- Users Table (for Admin authentication)
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Product Categories Table
CREATE TABLE IF NOT EXISTS `product_categories` (
    `id`          INT AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(150) NOT NULL,
    `slug`        VARCHAR(170) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `name` (`name`),
    UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products Table
CREATE TABLE IF NOT EXISTS `products` (
    `id`           INT AUTO_INCREMENT PRIMARY KEY,
    `category_id`  INT NULL,
    `category`     VARCHAR(100) DEFAULT NULL,           -- legacy text fallback
    `product_code` VARCHAR(50) DEFAULT NULL,
    `name`         VARCHAR(255) NOT NULL,
    `slug`         VARCHAR(255) DEFAULT NULL,
    `description`  TEXT,
    `details`      LONGTEXT DEFAULT NULL,               -- rich HTML from production
    `price`        DECIMAL(10, 2) NOT NULL,
    `offer_price`  DECIMAL(10, 2) DEFAULT NULL,
    `stock_status` ENUM('In Stock', 'Out of Stock') DEFAULT 'In Stock',
    `is_featured`  TINYINT(1) NOT NULL DEFAULT 0,
    `is_available` TINYINT(1) NOT NULL DEFAULT 1,
    `sizes`        VARCHAR(255),
    `created_at`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Product Images Table
CREATE TABLE IF NOT EXISTS `product_images` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `sort_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Enquiries Table
CREATE TABLE IF NOT EXISTS `enquiries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `phone` VARCHAR(20),
    `message` TEXT,
    `product_id` INT,
    `selected_size` VARCHAR(10),
    `status` ENUM('New', 'Contacted', 'In Progress', 'Confirmed', 'Closed', 'Archived') DEFAULT 'New',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Hero Slides Table (for Home page Carousel)
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  -- Basic Info
  `brand_name` VARCHAR(255) DEFAULT 'Darain Fashion',
  `logo` VARCHAR(255) DEFAULT NULL,
  `favicon` VARCHAR(255) DEFAULT NULL,
  `top_bar_text` TEXT,
  `theme` VARCHAR(50) DEFAULT 'default',
  -- Contact Info
  `phone` VARCHAR(50) DEFAULT NULL,
  `whatsapp` VARCHAR(50) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `business_hours` VARCHAR(255) DEFAULT NULL,
  `map_embed_url` TEXT DEFAULT NULL,
  -- About Section
  `about_title` VARCHAR(255) DEFAULT 'Where Modesty Meets Elegance',
  `about_subtitle` VARCHAR(255) DEFAULT 'About Us',
  `about_description` TEXT,
  `about_image` VARCHAR(255) DEFAULT NULL,
  -- System
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 3. Seed Initial Data
-- --------------------------------------------------------

-- Default Admin User (username: admin, password: admin123)
INSERT IGNORE INTO `users` (`id`, `username`, `password`) VALUES 
(1, 'admin', '$2y$10$8.tD3lVqXvY7.u0f.0.0.u.U/k.G/G/G/G/G/G/G/G/G/G/G/G/G');

-- Default Settings Row
INSERT IGNORE INTO `settings` (
  `id`, `brand_name`, `top_bar_text`, `phone`, `whatsapp`, `email`, `address`, `business_hours`, `map_embed_url`
) VALUES (
  1, 
  'Darain Fashion', 
  'Free Shipping! Explore Our Premium Collection.', 
  '+91 62381 86495', 
  '916238186495', 
  'fd786darain@gmail.com', 
  'Kottakkal, Malappuram, Kerala, India', 
  '9:00 AM – 9:00 PM', 
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31317.06059905973!2d75.98774052069675!3d10.998495632007823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b161f5cce121%3A0x6bba4da34947dc16!2sKottakkal%2C%20Kerala!5e0!3m2!1sen!2sin!4v1710505809786!5m2!1sen!2sin'
);

-- Default Product Categories
INSERT IGNORE INTO `product_categories` (`id`, `name`, `slug`) VALUES
(1, 'PREMIUM ABAYA',    'premium-abaya'),
(2, 'STANDARD ABAYA',   'standard-abaya'),
(3, 'CHILDRENS ABAYA',  'childrens-abaya'),
(4, 'SCARF',            'scarf'),
(5, 'NIQAB',            'niqab'),
(6, 'GLOVES & SOCKS',   'gloves-socks'),
(7, 'MADRASA ABAYA',    'madrasa-abaya');

COMMIT;
