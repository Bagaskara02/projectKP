<?php
// File: api/koneksi.php

$servername = "localhost";
$username = "root";     // User default XAMPP
$password = "";         // Password default XAMPP biasanya kosong
$dbname = "pn_yogyakarta_db"; // Nama database yang sudah kita sepakati

// Membuat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    // Jika gagal, matikan proses dan tampilkan error
    die("Koneksi Database Gagal: " . $conn->connect_error);
}

// Set charset ke UTF-8 agar aman untuk karakter khusus
$conn->set_charset("utf8mb4");
?>