<?php
// Script to create admin user with proper password hash
require_once __DIR__ . '/db.php';

$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Generated hash: " . $hash . "\n";

// Check if user exists
$result = $conn->query("SELECT * FROM users WHERE email = 'admin@pn-yogyakarta.go.id'");
if ($result->num_rows > 0) {
    // Update existing user
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = 'admin@pn-yogyakarta.go.id'");
    $stmt->bind_param("s", $hash);
    $stmt->execute();
    echo "User updated successfully!\n";
} else {
    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (nama, email, password, jabatan, role) VALUES (?, ?, ?, ?, ?)");
    $nama = 'Administrator';
    $email = 'admin@pn-yogyakarta.go.id';
    $jabatan = 'Admin Sistem';
    $role = 'admin';
    $stmt->bind_param("sssss", $nama, $email, $hash, $jabatan, $role);
    $stmt->execute();
    echo "User created successfully!\n";
}

// Verify
$result = $conn->query("SELECT * FROM users WHERE email = 'admin@pn-yogyakarta.go.id'");
$user = $result->fetch_assoc();
echo "User ID: " . $user['id'] . "\n";
echo "Password verify test: " . (password_verify('admin123', $user['password']) ? 'SUCCESS' : 'FAILED') . "\n";
?>