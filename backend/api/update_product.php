<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

include_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->product_code) && !empty($data->name) && !empty($data->price) && !empty($data->category)){
    try {
        $conn->beginTransaction();

        $query = "UPDATE products SET product_code = ?, name = ?, description = ?, category = ?, price = ?, offer_price = ?, stock_status = ?, sizes = ?, colors = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([
            $data->product_code,
            $data->name,
            $data->description ?? "",
            $data->category,
            $data->price,
            $data->offer_price ?? null,
            $data->stock_status ?? 'In Stock',
            $data->sizes ?? "",
            $data->colors ?? "",
            $data->id
        ]);

        if(isset($data->images) && is_array($data->images)){
            // Clear existing images
            $delQuery = "DELETE FROM product_images WHERE product_id = ?";
            $delStmt = $conn->prepare($delQuery);
            $delStmt->execute([$data->id]);

            // Insert new images
            if(!empty($data->images)){
                $imgQuery = "INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)";
                $imgStmt = $conn->prepare($imgQuery);
                foreach($data->images as $index => $imageUrl){
                    $imgStmt->execute([$data->id, $imageUrl, $index]);
                }
            }
        }

        $conn->commit();
        echo json_encode(["status" => "success", "message" => "Product updated successfully"]);
    } catch(Exception $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data"]);
}
?>
