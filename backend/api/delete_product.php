<?php
include_once 'db.php';

if(isset($_GET['id'])){
    $id = $_GET['id'];
    $query = "DELETE FROM products WHERE id = ?";
    $stmt = $conn->prepare($query);

    if($stmt->execute([$id])){
        echo json_encode(["message" => "Product deleted."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to delete product."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Product ID is required."]);
}
?>
