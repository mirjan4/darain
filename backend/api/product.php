<?php
include_once 'db.php';

if(isset($_GET['id'])){
    $id = $_GET['id'];
    
    // Get product info
    $query = "SELECT * FROM products WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($product){
        // Get all images
        $imgQuery = "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC";
        $imgStmt = $conn->prepare($imgQuery);
        $imgStmt->execute([$id]);
        $product['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo json_encode($product);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Product not found."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Product ID is required."]);
}
?>
