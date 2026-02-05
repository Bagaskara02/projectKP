<?php
/**
 * Database Connection - Single Source
 * SIMONEV-KIP
 */

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

// Start session for auth
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'simonev_kip';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

$conn->set_charset("utf8mb4");

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get current user from session
 */
function getCurrentUser()
{
    return $_SESSION['user'] ?? null;
}

/**
 * Check if user is logged in
 */
function isLoggedIn()
{
    return isset($_SESSION['user']) && !empty($_SESSION['user']['id']);
}

/**
 * Log activity to audit_logs
 */
function logActivity($conn, $action, $tableName = null, $recordId = null, $oldData = null, $newData = null)
{
    $user = getCurrentUser();
    $userId = $user['id'] ?? null;
    $userName = $user['nama'] ?? 'Guest';
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

    $stmt = $conn->prepare("INSERT INTO audit_logs (user_id, user_name, action, table_name, record_id, old_data, new_data, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $oldJson = $oldData ? json_encode($oldData) : null;
    $newJson = $newData ? json_encode($newData) : null;

    $stmt->bind_param("isssissss", $userId, $userName, $action, $tableName, $recordId, $oldJson, $newJson, $ip, $userAgent);
    $stmt->execute();
    $stmt->close();
}

/**
 * Sanitize input
 */
function sanitize($conn, $input)
{
    return $conn->real_escape_string(trim($input));
}

/**
 * Get current year from request or default
 */
function getCurrentYear()
{
    return $_GET['tahun'] ?? $_POST['tahun'] ?? date('Y');
}
?>