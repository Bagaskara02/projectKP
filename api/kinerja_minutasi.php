<?php
// MATIKAN LAPORAN ERROR AGAR JSON TIDAK RUSAK
error_reporting(0); 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once "koneksi.php";

// Query ambil data
$query = "
    SELECT 
        COUNT(*) as total_perkara,
        SUM(CASE 
            WHEN DATEDIFF(tanggal_minutasi, tanggal_register) <= 150 THEN 1 
            ELSE 0 
        END) as tepat_waktu
    FROM t_perkara 
    WHERE status_akhir = 'Minutasi' 
    AND YEAR(tanggal_minutasi) = 2025
";

$result = $conn->query($query);

// Inisialisasi default biar tidak error
$total = 0;
$tepat = 0;
$persentase = 0; // Pakai nama $persentase
$status = "MERAH";
$warna_kode = "red";

if ($result) {
    $data = $result->fetch_assoc();
    $total = (int)$data['total_perkara'];
    $tepat = (int)$data['tepat_waktu'];
    
    if ($total > 0) {
        $persentase = round(($tepat / $total) * 100, 2);
    }
    
    if ($persentase >= 90) {
        $status = "HIJAU"; $warna_kode = "green";
    } elseif ($persentase >= 80) {
        $status = "KUNING"; $warna_kode = "yellow";
    }
}

// OUTPUT JSON (PASTIKAN NAMA VARIABEL SAMA)
echo json_encode([
    "status" => "success",
    "iku_label" => "IKU 1.1 - Penyelesaian Perkara Tepat Waktu",
    "total_perkara" => $total,
    "tepat_waktu" => $tepat,
    "persentase" => $persentase, // <-- INI YANG TADI ERROR ($persen)
    "status_kinerja" => $status,
    "warna_indikator" => $warna_kode
]);

$conn->close();
?>