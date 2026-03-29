<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];


if ($method === 'GET') {

    $stmt = $conn->prepare("SELECT * FROM settings WHERE id = 1");
    $stmt->execute();
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$settings) {
        $settings = [
            'id' => 1, 'logo' => null, 'favicon' => null,
            'phone' => null, 'whatsapp' => null, 'email' => null,
            'address' => null, 'business_hours' => null, 'map_embed_url' => null,
            'about_title' => 'Where Modesty Meets Elegance',
            'about_subtitle' => 'About Us',
            'about_description' => null,
            'about_image' => null,
            'theme' => 'default',
            'brand_name' => 'Darain Fashion',
            'top_bar_text' => 'Free Shipping Over $50! Returns are always on us.',
        ];
    }
    echo json_encode(['success' => true, 'data' => $settings]);
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Collect all allowed fields
    $allowed = [
        'logo', 'favicon', 'phone', 'whatsapp', 'email', 'address', 
        'business_hours', 'map_embed_url',
        'about_title', 'about_subtitle', 'about_description', 'about_image',
        'theme', 'brand_name', 'top_bar_text', 'slider_interval'
    ];

    // Check if row exists
    $check = $conn->prepare("SELECT id FROM settings WHERE id = 1");
    $check->execute();
    $exists = $check->fetch();

    $fields = [];
    $params = [':id' => 1];
    foreach ($allowed as $key) {
        if (array_key_exists($key, $data)) {
            $fields[] = "$key = :$key";
            $params[":$key"] = $data[$key];
        }
    }

    if ($exists) {
        if (!empty($fields)) {
            $stmt = $conn->prepare("UPDATE settings SET " . implode(', ', $fields) . " WHERE id = :id");
            $stmt->execute($params);
        }
    } else {
        $stmt = $conn->prepare("INSERT INTO settings (id) VALUES (1)");
        $stmt->execute();
        if (!empty($fields)) {
            $stmt2 = $conn->prepare("UPDATE settings SET " . implode(', ', $fields) . " WHERE id = :id");
            $stmt2->execute($params);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Settings saved successfully']);
}
?>
