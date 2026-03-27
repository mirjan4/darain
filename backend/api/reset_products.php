<?php
/**
 * Clean test data and properly import production products
 */
include_once 'db.php';

$steps = [];

try {
    // ─── STEP 1: Delete dummy/test products (no real product_code pattern) ───
    // Production product codes follow patterns like "D 0344", "DS 051", "SD 0201" etc.
    // Test data has codes like "d 504", random strings, etc.
    // Safest: wipe all existing products and re-import cleanly.
    
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
    $conn->exec("TRUNCATE TABLE product_images");
    $conn->exec("TRUNCATE TABLE products");
    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");
    $steps[] = "✅ Cleared old test/dummy products and images.";

    // ─── STEP 2: Import ALL 39 production products ───────────────────────────
    $products = [
        [1,  1, 'Soola Pleated Milhafa (D 0344)',   'soola-pleated-milhafa-d-0344',    'D 0344',  2550.00, 'S, M, L, XL',      1, 1, '696931f809397-2d83ab7f-b85b-4b1b-a1f1-5cc5b9f48179.jpeg'],
        [2,  1, 'AISAL (D 0351)',                   'aisal-d-0351',                     'D 0351',  2350.00, 'S, M, L, XL',      0, 1, '6981bb26ee071-IMG-20251112-WA0015[1].jpg'],
        [3,  1, 'SULAIKHA (D 0315)',                'sulaikha-d-0315',                  'D 0315',  2800.00, 'S, M, L, XL',      0, 1, '6989ccfb4da68-DARAIN.jpeg'],
        [4,  1, 'ANSAM (D 0355)',                   'ansam-d-0355',                     'D 0355',  2250.00, 'S, M, L, XL',      0, 1, '698ad82fcd46f-WhatsApp Image 2026-02-10 at 12.23.53 PM.jpeg'],
        [5,  1, 'QAMAR (D 0316)',                   'qamar-d-0316',                     'D 0316',  2250.00, 'S, M, L, XL',      0, 1, '698addb2926e6-WhatsApp Image 2026-02-10 at 12.50.09 PM.jpeg'],
        [6,  1, 'D 0341',                           'd-0341',                           'D 0341',  1950.00, 'S, M, L, XL',      0, 1, '698adf4a0dfe8-WhatsApp Image 2026-02-10 at 12.58.22 PM.jpeg'],
        [7,  1, 'D 0318',                           'd-0318',                           'D 0318',  2350.00, 'S, M, L, XL',      0, 1, '698af8460704e-WhatsApp Image 2026-02-10 at 1.57.11 PM.jpeg'],
        [8,  1, 'D 0319',                           'd-0319',                           'D 0319',  2499.00, 'S, M, L, XL',      0, 1, '698afa5385412-319.jpeg'],
        [9,  1, 'RUMAISA (D 0337)',                 'rumaisa-d-0337',                   'D 0337',  2650.00, 'S, M, L, XL',      0, 1, '698afffb108e6-337 (6).jpeg'],
        [10, 1, '340',                              '340',                              'D 0340',  2750.00, 'S, M, L, XL',      0, 1, '698b017f47786-340 (3).jpeg'],
        [11, 1, 'AISAL (D0350)',                    'aisal-d0350',                      'D 0350',  2550.00, 'S, M, L, XL',      0, 1, '698b0607b28e1-350 (4).jpeg'],
        [12, 2, 'DS 050',                           'ds-050',                           'DS 050',  1650.00, 'M, L, XL, XXL',    0, 1, '698c467318ae8-DS 50.jpeg'],
        [13, 2, 'DS 051',                           'ds-051',                           'DS 051',  2650.00, 'M, L, XL, XXL',    0, 1, '698c46ef49470-DS51.jpeg'],
        [14, 1, 'D 310',                            'd-310',                            'D 310',   2650.00, 'XL',               0, 1, '69905492eb6ad-DS 052.jpeg'],
        [15, 2, 'DS 052',                           'ds-052',                           'DS 052',  2350.00, 'XL',               0, 1, '69afb7aa7d2e5-DS 052.jpeg'],
        [16, 1, 'FAKHAMA (D 0345)',                 'fakhama-d-0345',                   'D 0345',  1750.00, 'M, L',             0, 1, '69941e0e58285-FAKHAMA (2).jpeg'],
        [17, 1, 'D 0314',                           'd-0314',                           'D 0314',  2250.00, 'S, M, L, XL, XXL', 0, 1, '69942fd0f153a-D 0314.jpeg'],
        [18, 1, 'D 0324',                           'd-0324',                           'D 0324',  1550.00, 'M & L',            0, 1, '6996af134f759-D 0324 (2).jpeg'],
        [19, 1, 'SHAIKHA (D 0318)',                 'shaikha-d-0318',                   'D 0318B', 3600.00, 'XL, XXL',          0, 1, '69981e151ae14-d 318.jpeg'],
        [20, 1, 'D 0346',                           'd-0346',                           'D 0346',  2150.00, 'XL',               0, 1, '69981f4bc8656-D 346.jpeg'],
        [21, 2, 'DS 053',                           'ds-053',                           'DS 053',  1650.00, 'S, M, L, XL, XXL', 0, 1, '699820aee5cfb-DS 53.jpeg'],
        [22, 2, 'DS 054',                           'ds-054',                           'DS 054',  1550.00, 'S, M, L, XL, XXL', 0, 1, '6998227942f37-DS 54.jpeg'],
        [23, 2, 'DS 055',                           'ds-055',                           'DS 055',  1400.00, 'S, M, L, XL, XXL', 0, 1, '699824e17827f-DS 55.jpeg'],
        [24, 2, 'DS 056',                           'ds-056',                           'DS 056',  1350.00, 'S, M, L, XL, XXL', 0, 1, '6998285318fc9-DS 56 (3).jpeg'],
        [25, 2, 'DS 057',                           'ds-057',                           'DS 057',  1400.00, 'S, M, L, XL, XXL', 0, 1, '6998291dd8126-DS 57 (2).jpeg'],
        [26, 2, 'DS 058',                           'ds-058',                           'DS 058',  1450.00, 'S, M, L, XL, XXL', 0, 1, '699829f2605cd-DS 58 (2).jpeg'],
        [27, 2, 'DS 059',                           'ds-059',                           'DS 059',  1500.00, 'S, M, L, XL, XXL', 0, 1, '69982d2b397a6-DS 59 (2).jpeg'],
        [28, 2, 'DS 060',                           'ds-060',                           'DS 060',  1900.00, 'S, M, L, XL, XXL', 0, 1, '699831241e6bc-DS 60 (3).jpeg'],
        [29, 2, 'DS 061',                           'ds-061',                           'DS 061',  1350.00, 'S, M, L, XL, XXL', 0, 1, '699832f6225f2-DS 61.jpeg'],
        [30, 2, 'DS 062',                           'ds-062',                           'DS 062',  1600.00, 'S, M, L, XL, XXL', 0, 1, '6998336a9d20c-DS 62.jpeg'],
        [31, 4, 'CHIFFON SHAWLS (SD 0201)',         'chiffon-shawls-sd-0201',           'SD 0201',  290.00, '2M',               0, 1, '69983819b2bae-CHIFFON (3).jpeg'],
        [32, 4, 'JERSEY SHAWLS (SD 202)',           'jersey-shawls-sd-202',             'SD 202',   269.00, '2M',               0, 1, '69983bcbe42a0-SD 202 (4).jpeg'],
        [33, 5, 'EGYPTIAN NIQAB (DN 701)',          'egyptian-niqab-dn-701',            'DN 701',   260.00, 'S, L',             0, 1, '6998410b7bdf7-DN 701 (2).jpeg'],
        [34, 1, 'D 0370',                           'd-0370',                           'D 0370',  3400.00, 'S, M, L, XL, XXL', 0, 1, '69afb15f3e3d8-WhatsApp Image 2026-03-05 at 6.15.01 AM.jpeg'],
        [35, 1, 'D 0330',                           'd-0330',                           'D 0330',  2250.00, 'S, M, L, XL',      0, 1, '69afb8fcbacf5-WhatsApp Image 2026-03-08 at 2.51.18 PM.jpeg'],
        [36, 1, 'D 0320',                           'd-0320',                           'D 0320',  2350.00, 'S, M, L, XL',      0, 1, '69afb9bf3a689-WhatsApp Image 2026-03-08 at 2.27.00 PM.jpeg'],
        [37, 1, 'D 0328',                           'd-0328',                           'D 0328',  2499.00, 'S, M, L, XL',      0, 1, '69afba9fab061-WhatsApp Image 2026-03-08 at 2.04.19 PM (1).jpeg'],
        [38, 1, 'D 0327',                           'd-0327',                           'D 0327',  2450.00, 'M, XL, XXL',       0, 1, '69afbc11da44e-WhatsApp Image 2026-03-09 at 11.01.06 PM (1).jpeg'],
        [39, 7, 'DM 601',                           'dm-601',                           'DM 601',   690.00, 'S, M, L',          0, 1, '69c1284bb48ef-MADRASA ABAYA2.jpeg'],
    ];

    $prodStmt = $conn->prepare("
        INSERT INTO `products` 
            (`id`, `category_id`, `category`, `product_code`, `name`, `slug`, `price`, `offer_price`, `stock_status`, `is_featured`, `is_available`, `sizes`) 
        VALUES 
            (?, ?, (SELECT name FROM product_categories WHERE id = ?), ?, ?, ?, ?, NULL, 'In Stock', ?, ?, ?)
    ");

    foreach ($products as $p) {
        [$id, $catId, $name, $slug, $code, $price, $sizes, $isFeatured, $isAvail, $img] = $p;
        $prodStmt->execute([$id, $catId, $catId, $code, $name, $slug, $price, $isFeatured, $isAvail, $sizes]);
    }
    $steps[] = "✅ Imported " . count($products) . " real products.";

    // ─── STEP 3: Import main images for each product ───────────────────────
    $imgStmt = $conn->prepare("INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, 0)");
    foreach ($products as $p) {
        [$id, , , , , , , , , $img] = $p;
        if ($img) $imgStmt->execute([$id, $img]);
    }
    $steps[] = "✅ Main images linked.";

    // Also import additional multi-images from production
    $multiImages = [
        [1,  '6969320c3c12b-7076510f-15b4-4377-bd7d-697f8e0cf94c.jpeg', 1],
        [1,  '6969320c3c630-c056b64a-7768-46de-9039-75268d85c204.jpeg', 2],
        [5,  '698addc8776ee-WhatsApp Image 2026-02-10 at 12.50.12 PM.jpeg', 1],
        [5,  '698adddd1e663-WhatsApp Image 2026-02-10 at 12.50.11 PM.jpeg', 2],
        [9,  '698b001e051d9-337.jpeg', 1],
        [9,  '698b004b87c55-337 (4).jpeg', 2],
        [33, '6998413e3a610-DN 701 (3).jpeg', 1],
        [31, '69983826f293f-CHIFFON (2).jpeg', 1],
        [31, '699838312d8d6-CHIFFON.jpeg', 2],
        [39, '69c128c0ac14d-MADRASA ABAYA 1.jpeg', 1],
        [39, '69c128cf0f57f-MADRASA ABAYA3.jpeg', 2],
    ];

    $multiStmt = $conn->prepare("INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)");
    foreach ($multiImages as $mi) {
        $multiStmt->execute($mi);
    }
    $steps[] = "✅ Additional gallery images imported.";

    echo "=== MIGRATION COMPLETE ===\n" . implode("\n", $steps) . "\n\nTotal products: " . count($products);

} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n\nCompleted:\n" . implode("\n", $steps);
}
?>
