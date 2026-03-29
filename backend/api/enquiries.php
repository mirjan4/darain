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
    if (!empty($data['id']) && (!empty($data['status']))) {
        try {
            $status = $data['status'];
            $id = $data['id'];
            
            // Auto-set flags based on status
            if ($status === 'Archived') {
                 // Move to archive while keeping the previous status information?
                 // Actually, if we're archiving, we just want to set the flag.
                 // We don't want to lose the current status label (like Closed Won).
                 // So we'll skip updating the "status" column and just update is_archived?
                 // But wait, the updateEnquiryStatus is usually used to set the status label.
                 $stmt = $conn->prepare("UPDATE enquiries SET is_archived = 1 WHERE id = ?");
                 $stmt->execute([$id]);
            } else {
                 $is_delivered = ($status === 'Closed Won') ? 1 : 0;
                 $is_rejected = ($status === 'Closed Lost') ? 1 : 0;
                 // If you restore it, automatically clear archive flag
                 $stmt = $conn->prepare("UPDATE enquiries SET status = ?, is_delivered = ?, is_rejected = ?, is_archived = 0 WHERE id = ?");
                 $stmt->execute([$status, $is_delivered, $is_rejected, $id]);
            }
            
            echo json_encode(["status" => "success", "message" => "Record updated successfully"]);
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
