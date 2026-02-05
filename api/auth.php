<?php
/**
 * Authentication API
 * SIMONEV-KIP
 */

require_once __DIR__ . '/db.php';
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'login':
        handleLogin($conn, $input);
        break;
    case 'logout':
        handleLogout($conn);
        break;
    case 'check':
        handleCheck();
        break;
    case 'users':
        handleGetUsers($conn);
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

function handleLogin($conn, $input)
{
    $email = sanitize($conn, $input['email'] ?? '');
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Email dan password harus diisi"]);
        return;
    }

    $stmt = $conn->prepare("SELECT id, nama, email, password, jabatan, role FROM users WHERE email = ? AND is_active = 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "Email tidak ditemukan"]);
        return;
    }

    $user = $result->fetch_assoc();

    if (!password_verify($password, $user['password'])) {
        echo json_encode(["status" => "error", "message" => "Password salah"]);
        return;
    }

    // Update last login
    $conn->query("UPDATE users SET last_login = NOW() WHERE id = " . $user['id']);

    // Set session
    unset($user['password']);
    $_SESSION['user'] = $user;

    // Log activity
    logActivity($conn, 'LOGIN', 'users', $user['id'], null, ['email' => $email]);

    echo json_encode([
        "status" => "success",
        "message" => "Login berhasil",
        "user" => $user
    ]);
}

function handleLogout($conn)
{
    $user = getCurrentUser();
    if ($user) {
        logActivity($conn, 'LOGOUT', 'users', $user['id'], null, null);
    }

    session_destroy();
    echo json_encode(["status" => "success", "message" => "Logout berhasil"]);
}

function handleCheck()
{
    if (isLoggedIn()) {
        echo json_encode([
            "status" => "success",
            "logged_in" => true,
            "user" => getCurrentUser()
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "logged_in" => false,
            "user" => null
        ]);
    }
}

function handleGetUsers($conn)
{
    if (!isLoggedIn()) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        return;
    }

    $result = $conn->query("SELECT id, nama, email, jabatan, role, is_active, last_login, created_at FROM users ORDER BY nama");
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $users]);
}
?>