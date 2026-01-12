<?php
// api/kinerja_ecourt.php
error_reporting(0);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once "koneksi.php";

// Hitung total perkara Perdata (Gugatan/Permohonan) tahun 2025
$query = "SELECT 
            COUNT(*) as total_perdata,
            SUM(CASE WHEN is_ecourt = 1 THEN 1 ELSE 0 END) as pengguna_ecourt
          FROM t_perkara 
          WHERE jenis_perkara LIKE '%Perdata%' 
          AND YEAR(tanggal_register) = 2025";

$result = $conn->query($query);
$data = $result->fetch_assoc();

$total = (int)$data['total_perdata'];
$ecourt = (int)$data['pengguna_ecourt'];
$persen = ($total > 0) ? round(($ecourt / $total) * 100, 2) : 0;

// Target e-Court biasanya tinggi (Modernisasi)
$status = ($persen >= 50) ? "OPTIMAL" : "PERLU TINGKATKAN";
$warna = ($persen >= 50) ? "blue" : "orange";

echo json_encode([
    "iku_label" => "IKU 1.10 - Pengguna E-Court",
    "total" => $total,
    "ecourt" => $ecourt,
    "persentase" => $persen,
    "status" => $status,
    "warna" => $warna
]);
?>