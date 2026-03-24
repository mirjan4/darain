<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$title       = $data['title'] ?? '';
$subtitle    = $data['subtitle'] ?? '';
$description = $data['description'] ?? '';
$image       = $data['image'] ?? '';
$sort_order  = $data['sort_order'] ?? 0;

if (empty($title)) {
    echo json_encode(['success' => false, 'message' => 'Title is required']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO hero_slides (title, subtitle, description, image, sort_order) VALUES (:title, :subtitle, :description, :image, :sort_order)");
$stmt->execute([
    ':title'       => $title,
    ':subtitle'    => $subtitle,
    ':description' => $description,
    ':image'       => $image,
    ':sort_order'  => $sort_order,
]);

echo json_encode(['success' => true, 'id' => $conn->lastInsertId(), 'message' => 'Slide added successfully']);
