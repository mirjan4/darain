<?php
include_once 'db.php';

echo "=== PRODUCTS TABLE COLUMNS ===\n";
$s = $conn->query('DESCRIBE products');
foreach($s->fetchAll(PDO::FETCH_ASSOC) as $row) {
    echo $row['Field'] . " | " . $row['Type'] . " | " . $row['Null'] . "\n";
}

echo "\n=== PRODUCT_IMAGES TABLE COLUMNS ===\n";
$s = $conn->query('DESCRIBE product_images');
foreach($s->fetchAll(PDO::FETCH_ASSOC) as $row) {
    echo $row['Field'] . " | " . $row['Type'] . "\n";
}

echo "\n=== SAMPLE PRODUCTS (5) ===\n";
$s = $conn->query('SELECT id, name, category, category_id, product_code FROM products LIMIT 5');
foreach($s->fetchAll(PDO::FETCH_ASSOC) as $row) {
    print_r($row);
}

echo "\n=== SAMPLE PRODUCT_IMAGES (5) ===\n";
$s = $conn->query('SELECT * FROM product_images LIMIT 5');
foreach($s->fetchAll(PDO::FETCH_ASSOC) as $row) {
    print_r($row);
}

echo "\n=== MAIN_IMAGE SUBQUERY TEST ===\n";
$s = $conn->query("
    SELECT p.id, p.name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) AS main_image
    FROM products p LIMIT 3
");
foreach($s->fetchAll(PDO::FETCH_ASSOC) as $row) {
    print_r($row);
}
?>
