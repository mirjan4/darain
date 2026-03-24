<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

include_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle Status Updates (POST)
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!empty($data['id']) && !empty($data['status'])) {
        try {
            $stmt = $conn->prepare("UPDATE enquiries SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(["status" => "success", "message" => "Status updated to " . $data['status']]);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            exit;
        }
    }
}

// Handle Clear/Delete (DELETE)
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        try {
            $stmt = $conn->prepare("DELETE FROM enquiries WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["status" => "success", "message" => "Enquiry cleared"]);
            exit;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            exit;
        }
    }
}

// Default Fetch All (GET)
$query = "SELECT e.*, p.name as product_name, p.product_code 
          FROM enquiries e 
          LEFT JOIN products p ON e.product_id = p.id 
          ORDER BY e.created_at DESC";
$stmt = $conn->prepare($query);
$stmt->execute();

$enquiries = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($enquiries);
?>
