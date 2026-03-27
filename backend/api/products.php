<?php
include_once 'db.php';

$query = "
    SELECT 
        p.*,
        pc.name AS category_name,
        pc.slug AS category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) AS main_image
    FROM products p
    LEFT JOIN product_categories pc ON p.category_id = pc.id
    ORDER BY p.created_at DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Normalise: ensure 'category' field is always the name (for backward compat with frontend)
foreach ($products as &$p) {
    if (empty($p['category']) && !empty($p['category_name'])) {
        $p['category'] = $p['category_name'];
    }
}

echo json_encode($products);
?>
