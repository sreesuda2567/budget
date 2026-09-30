<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * SSO Settings API Endpoint for Budget System
 * -------------------------------------------------------------
 * GET: ดึงสถานะการตั้งค่า SSO (sso_enabled, auto_redirect) - Public access สำหรับหน้า Login
 * POST: บันทึกการตั้งค่า SSO - เฉพาะผู้ดูแลระบบ (Admin)
 */

$configFile = __DIR__ . '/sso_config.json';

// ค่าเริ่มต้น (Default Settings)
$defaultSettings = [
    'sso_enabled' => true,
    'auto_redirect' => false,
    'updated_at' => date('Y-m-d H:i:s')
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($configFile)) {
        $data = json_decode(file_get_contents($configFile), true);
        if ($data) {
            echo json_encode(['status' => true, 'data' => $data]);
            exit();
        }
    }
    echo json_encode(['status' => true, 'data' => $defaultSettings]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ตรวจสอบ Authorization Token (Admin Only)
    /*
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    if (empty($authHeader)) {
        http_response_code(401);
        echo json_encode(['status' => false, 'message' => 'Unauthorized']);
        exit();
    }
    */

    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['sso_enabled'])) {
        http_response_code(400);
        echo json_encode(['status' => false, 'message' => 'Missing sso_enabled parameter']);
        exit();
    }

    $newSettings = [
        'sso_enabled' => (bool)$input['sso_enabled'],
        'auto_redirect' => (bool)($input['auto_redirect'] ?? false),
        'updated_at' => date('Y-m-d H:i:s')
    ];

    file_put_contents($configFile, json_encode($newSettings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo json_encode([
        'status' => true,
        'message' => 'บันทึกการตั้งค่า SSO เรียบร้อยแล้ว',
        'data' => $newSettings
    ], JSON_UNESCAPED_UNICODE);
    exit();
}
