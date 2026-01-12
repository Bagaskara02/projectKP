<?php
// api/kinerja_anggaran.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "koneksi.php";

// Ambil data bulan terakhir yang tersedia
$query = "SELECT * FROM t_laporan_bulanan ORDER BY periode_bulan DESC LIMIT 1";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    $data = $result->fetch_assoc();
    
    // Format Tanggal (Contoh: 2025-03-01 jadi Maret 2025)
    $bulan = date("F Y", strtotime($data['periode_bulan']));
    
    echo json_encode([
        "found" => true,
        "periode" => $bulan,
        "nilai_ikpa" => (float)$data['nilai_ikpa'], // IKU 3.2
        "realisasi" => (float)$data['realisasi_anggaran_persen'],
        "ikm" => (float)$data['nilai_ikm']
    ]);
} else {
    echo json_encode([
        "found" => false,
        "periode" => "-",
        "nilai_ikpa" => 0,
        "realisasi" => 0,
        "ikm" => 0
    ]);
}
?>