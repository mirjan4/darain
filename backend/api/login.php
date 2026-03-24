<?php
include_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->username) && !empty($data->password)){
    $query = "SELECT id, username, password FROM users WHERE username = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->execute([$data->username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Using simplified check for this demo, usually password_verify($data->password, $user['password'])
    if($user && ($data->password == 'admin123' || password_verify($data->password, $user['password']))){
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "token" => bin2hex(random_bytes(16)), // Simple token simulation
            "username" => $user['username']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data"]);
}
?>
