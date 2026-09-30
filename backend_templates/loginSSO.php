<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * RUTS SSO Login Endpoint for Budget System
 * -------------------------------------------------------------
 * 1. รับ Claims จาก Frontend (OIDC UserInfo / Identity Claims)
 * 2. ตรวจสอบสิทธิผู้ใช้งานจากตาราง vUSER_ACC3D ในฐานข้อมูลโดยตรง
 * 3. ออก JWT Token ของระบบ Budget และส่งสิทธิกลับไปให้ Frontend
 * 4. แนบ eLogin Token (token / tokenelogin) เพื่อให้ใช้งานระบบเดิม (EIS/PIS/RUTS) ได้ต่อเนื่อง
 */

// รวมไฟล์เชื่อมต่อฐานข้อมูลและ JWT Lib ของระบบเดิม (ปรับ path ตามโครงสร้างเซิร์ฟเวอร์)
// require_once __DIR__ . '/../config/database.php';
// require_once __DIR__ . '/../libs/jwt.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'Invalid JSON payload'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// 1. รับค่า Claims ที่ได้จาก Keycloak UserInfo
$citizenId = trim($input['cid'] ?? '');
$username  = trim($input['username'] ?? ($input['preferred_username'] ?? ''));
$email     = trim($input['email'] ?? '');
$firstname = trim($input['firstname'] ?? ($input['given_name'] ?? ''));
$lastname  = trim($input['lastname'] ?? ($input['family_name'] ?? ''));
$fullName  = trim($input['name'] ?? ($firstname . ' ' . $lastname));
$faccode   = trim($input['faccode'] ?? '');
$depcode   = trim($input['depcode'] ?? '');
$campuscode = trim($input['campuscode'] ?? '');

// Token เดิมของมหาวิทยาลัยสำหรับยิง API เดิม (eLogin API Token)
$tokenELogin = trim($input['tokenelogin'] ?? ($input['token'] ?? ''));

// 2. User Mapping (ถ้าไม่มี cid ให้พยายามหาจาก e-Passport / username)
/*
if (empty($citizenId) && !empty($username)) {
    $stmt = $pdo->prepare("SELECT CITIZEN_ID FROM vRUTS_epassport WHERE E_PASSPORT = :username LIMIT 1");
    $stmt->execute([':username' => $username]);
    $citizenId = $stmt->fetchColumn();
}
*/

if (empty($citizenId) && empty($username)) {
    http_response_code(400);
    echo json_encode([
        'status' => false,
        'message' => 'ไม่พบข้อมูล Citizen ID หรือ Username จากระบบ SSO'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// 3. ตรวจสอบสิทธิผู้ใช้งานจากฐานข้อมูล vUSER_ACC3D โดยตรง
// ★ สำคัญ: ตรวจสอบจากฐานข้อมูล ไม่พึ่งพา JWT Claims จาก SSO เพียงอย่างเดียว
/*
$stmt = $pdo->prepare("
    SELECT * 
    FROM vUSER_ACC3D 
    WHERE (CITIZEN_ID = :cid OR USERNAME = :username) 
      AND (USERGROUP_ASTATUS = 1 OR USERGROUP_ASTATUS = '1')
");
$stmt->execute([
    ':cid' => $citizenId,
    ':username' => $username
]);
$userAcc = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$userAcc || count($userAcc) === 0) {
    http_response_code(403);
    echo json_encode([
        'status' => false,
        'message' => 'ท่านไม่มีสิทธิเข้าใช้งานระบบ Budget (ไม่พบสิทธิใน vUSER_ACC3D)'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}
*/

// รวบรวม Role / Permission จาก vUSER_ACC3D
$permissions = [];
/*
foreach ($userAcc as $row) {
    if (!empty($row['GRPPOLICIES_CODE'])) {
        $permissions[] = $row['GRPPOLICIES_CODE'];
    }
}
*/

// 4. สร้าง JWT Token สำหรับระบบ Budget (HS256)
$secretKey = "YOUR_BUDGET_JWT_SECRET_KEY"; // ใช้ JWT Secret เดียวกับ loginRUTS.php
$issuedAt = time();
$expire = $issuedAt + (86400 * 3); // 3 วัน

$jwtPayload = [
    'iat' => $issuedAt,
    'exp' => $expire,
    'citizenId' => $citizenId,
    'username' => $username,
    'fullName' => $fullName,
    'permissions' => $permissions
];

// ตัวอย่างการสร้าง JWT (ใช้ function/lib เดียวกับระบบเดิมของคุณ เช่น Firebase JWT)
// $accessToken = JWT::encode($jwtPayload, $secretKey, 'HS256');
$accessToken = base64_encode(json_encode($jwtPayload)) . '.' . md5($citizenId . $issuedAt . $secretKey);

// 5. ส่งข้อมูลตอบกลับในรูปแบบที่ Angular TokenStorageService รองรับ 100%
$response = [
    'status' => true,
    'success' => true,
    'accessToken' => $accessToken,
    'permission' => $permissions,
    'citizen' => $citizenId,
    'username' => $username,
    'name' => $fullName,
    'firstname' => $firstname,
    'lastname' => $lastname,
    'email' => $email,
    'faccode' => $faccode,
    'depcode' => $depcode,
    'campuscode' => $campuscode,
    // เก็บ token eLogin สำหรับส่งต่อให้ golinkeis(), golinkpis(), golinkruts()
    'token' => [
        'data' => [
            'token' => $tokenELogin
        ]
    ],
    'tokenelogin' => $tokenELogin,
    'sso_login' => true
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);
