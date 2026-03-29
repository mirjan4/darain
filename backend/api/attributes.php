<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $cats = $conn->query("SELECT * FROM product_categories ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    $sizes = $conn->query("SELECT * FROM product_sizes ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
    $colors = $conn->query("SELECT * FROM product_colors ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => [
            'categories' => $cats,
            'sizes' => $sizes,
            'colors' => $colors
        ]
    ]);
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $type = $data['type'] ?? ''; // 'category', 'size', 'color'
    $action = $data['action'] ?? ''; // 'add', 'edit', 'delete', 'toggle'

    try {
        if ($type === 'category') {
            if ($action === 'add') {
                $name = $data['name'];
                $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
                $stmt = $conn->prepare("INSERT INTO product_categories (name, slug) VALUES (?, ?)");
                $stmt->execute([$name, $slug]);
            } else if ($action === 'edit') {
                $id = $data['id'];
                $name = $data['name'];
                $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));
                $stmt = $conn->prepare("UPDATE product_categories SET name = ?, slug = ? WHERE id = ?");
                $stmt->execute([$name, $slug, $id]);
            } else if ($action === 'delete') {
                $id = $data['id'];
                $stmt = $conn->prepare("DELETE FROM product_categories WHERE id = ?");
                $stmt->execute([$id]);
            } else if ($action === 'toggle') {
                $id = $data['id'];
                $stmt = $conn->prepare("UPDATE product_categories SET is_active = !is_active WHERE id = ?");
                $stmt->execute([$id]);
            }
        } else if ($type === 'size') {
            if ($action === 'add') {
                $stmt = $conn->prepare("INSERT INTO product_sizes (name) VALUES (?)");
                $stmt->execute([$data['name']]);
            } else if ($action === 'edit') {
                $stmt = $conn->prepare("UPDATE product_sizes SET name = ? WHERE id = ?");
                $stmt->execute([$data['name'], $data['id']]);
            } else if ($action === 'delete') {
                $stmt = $conn->prepare("DELETE FROM product_sizes WHERE id = ?");
                $stmt->execute([$data['id']]);
            } else if ($action === 'toggle') {
                $stmt = $conn->prepare("UPDATE product_sizes SET is_active = !is_active WHERE id = ?");
                $stmt->execute([$data['id']]);
            }
        } else if ($type === 'color') {
            if ($action === 'add') {
                $stmt = $conn->prepare("INSERT INTO product_colors (name, hex_code) VALUES (?, ?)");
                $stmt->execute([$data['name'], $data['hex_code']]);
            } else if ($action === 'edit') {
                $stmt = $conn->prepare("UPDATE product_colors SET name = ?, hex_code = ? WHERE id = ?");
                $stmt->execute([$data['name'], $data['hex_code'], $data['id']]);
            } else if ($action === 'delete') {
                $stmt = $conn->prepare("DELETE FROM product_colors WHERE id = ?");
                $stmt->execute([$data['id']]);
            } else if ($action === 'toggle') {
                $stmt = $conn->prepare("UPDATE product_colors SET is_active = !is_active WHERE id = ?");
                $stmt->execute([$data['id']]);
            }
        }
        echo json_encode(['success' => true, 'message' => 'Attribute updated successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
