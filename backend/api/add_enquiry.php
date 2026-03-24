<?php
include_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->phone)){
    $name = $data->name;
    $phone = $data->phone;
    $message = $data->message ?? "";
    $product_id = $data->product_id ?? null;

    $selected_size = $data->selected_size ?? null;

    $query = "INSERT INTO enquiries (name, phone, message, product_id, selected_size) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);

    if($stmt->execute([$name, $phone, $message, $product_id, $selected_size])){
        http_response_code(201);
        echo json_encode(["message" => "Enquiry sent."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to send enquiry."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
