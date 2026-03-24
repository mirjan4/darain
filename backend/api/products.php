<?php
include_once 'db.php';

$query = "SELECT p.*, 
          (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as main_image 
          FROM products p ORDER BY created_at DESC";
$stmt = $conn->prepare($query);
$stmt->execute();

$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($products);
?>
