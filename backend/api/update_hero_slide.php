<?php
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id          = $data['id'] ?? null;
$title       = $data['title'] ?? '';
$subtitle    = $data['subtitle'] ?? '';
$description = $data['description'] ?? '';
$image       = $data['image'] ?? '';
$sort_order  = $data['sort_order'] ?? 0;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Slide ID is required']);
    exit;
}

// Only update image if a new one was provided
if (!empty($image)) {
    $stmt = $conn->prepare("UPDATE hero_slides SET title=:title, subtitle=:subtitle, description=:description, image=:image, sort_order=:sort_order WHERE id=:id");
    $stmt->execute([
        ':title'       => $title,
        ':subtitle'    => $subtitle,
        ':description' => $description,
        ':image'       => $image,
        ':sort_order'  => $sort_order,
        ':id'          => $id,
    ]);
} else {
    $stmt = $conn->prepare("UPDATE hero_slides SET title=:title, subtitle=:subtitle, description=:description, sort_order=:sort_order WHERE id=:id");
    $stmt->execute([
        ':title'       => $title,
        ':subtitle'    => $subtitle,
        ':description' => $description,
        ':sort_order'  => $sort_order,
        ':id'          => $id,
    ]);
}

echo json_encode(['success' => true, 'message' => 'Slide updated successfully']);
