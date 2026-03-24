<?php
require_once 'db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Slide ID is required']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM hero_slides WHERE id = :id");
$stmt->execute([':id' => $id]);

echo json_encode(['success' => true, 'message' => 'Slide deleted successfully']);
