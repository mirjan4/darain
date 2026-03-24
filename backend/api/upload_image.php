<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No image file received."]);
    exit;
}

$target_dir = "../uploads/";

// Ensure uploads directory exists and is writable
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0755, true);
}

$file_extension = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
$allowed_types  = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'];

if (!in_array($file_extension, $allowed_types)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "File type not allowed. Use: JPG, PNG, GIF, WEBP, SVG, ICO."]);
    exit;
}

$new_filename = uniqid('img_', true) . "." . $file_extension;
$target_file  = $target_dir . $new_filename;

if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
    echo json_encode([
        "success"   => true,
        "filename"  => $new_filename,        // <- what admin components read
        "image_url" => $new_filename,         // <- keep legacy key for compatibility
        "message"   => "Upload successful"
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Upload failed. Check server permissions on /uploads/ folder."]);
}
?>
