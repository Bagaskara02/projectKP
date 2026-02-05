<?php
// Test login API
require_once __DIR__ . '/db.php';

$email = 'admin@pn-yogyakarta.go.id';
$password = 'admin123';

echo "Testing login for: $email\n";

$stmt = $conn->prepare("SELECT id, nama, email, password, jabatan, role FROM users WHERE email = ? AND is_active = 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "ERROR: User not found\n";
    exit;
}

$user = $result->fetch_assoc();
echo "User found: " . $user['nama'] . "\n";
echo "Password hash: " . $user['password'] . "\n";
echo "Password verify: " . (password_verify($password, $user['password']) ? 'SUCCESS' : 'FAILED') . "\n";
?>