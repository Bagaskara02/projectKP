<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "simonev_2025");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $action = $_GET['action'] ?? '';
    
    // === NEW: Summary endpoint for Dashboard ===
    if ($action == 'summary') {
        $summaryData = [];
        $indicators = ['1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9','1.10','1.11','1.12','2.1','3.1','3.2','3.3','3.4'];
        
        foreach ($indicators as $ind) {
            $sql = "SELECT COUNT(*) as total, 
                    SUM(CASE WHEN status_akhir IN ('Tepat Waktu','Berhasil','Elektronik') THEN 1 ELSE 0 END) as success,
                    AVG(nilai_ikm) as avg_ikm,
                    AVG(nilai_akhir) as avg_score
                    FROM detail_kinerja WHERE indikator_id = '$ind'";
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            
            $total = (int)$row['total'];
            $success = (int)$row['success'];
            $percentage = $total > 0 ? round(($success / $total) * 100, 2) : 0;
            
            // For survey (2.1) use IKM value
            if ($ind == '2.1') {
                $percentage = $row['avg_ikm'] ? round($row['avg_ikm'] * 25, 2) : 0;
            }
            // For score (3.x) use nilai_akhir
            if (strpos($ind, '3.') === 0) {
                $percentage = $row['avg_score'] ? round($row['avg_score'], 2) : 0;
            }
            
            $summaryData[$ind] = [
                'total' => $total,
                'success' => $success,
                'percentage' => $percentage
            ];
        }
        echo json_encode(["status" => "success", "data" => $summaryData]);
        exit;
    }
    
    $indikator_id = $_GET['id'] ?? '';
    $periode = $_GET['periode'] ?? '';
    $start_date = $_GET['start_date'] ?? '';
    $end_date = $_GET['end_date'] ?? '';
    
    $sql = "SELECT * FROM detail_kinerja WHERE indikator_id = '$indikator_id'";
    if($periode) $sql .= " AND periode = '$periode'";
    
    // === NEW: Date range filter ===
    if($start_date && $end_date) {
        $sql .= " AND tgl_register BETWEEN '$start_date' AND '$end_date'";
    }
    
    $sql .= " ORDER BY id DESC";
    
    $result = $conn->query($sql);
    $data = [];
    while($row = $result->fetch_assoc()) { $data[] = $row; }
    echo json_encode(["status" => "success", "data" => $data]);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? '';
    
    // === DELETE ===
    if ($action == 'delete') {
        $id = (int)$input['id'];
        $conn->query("DELETE FROM detail_kinerja WHERE id = $id");
        echo json_encode(["status" => "success"]);
        exit;
    }
    
    // === NEW: UPDATE ===
    if ($action == 'update') {
        $id = (int)$input['id'];
        $nomor = $conn->real_escape_string($input['nomor_perkara'] ?? '');
        $klas = $conn->real_escape_string($input['klasifikasi'] ?? '');
        $tgl_reg = !empty($input['tgl_register']) ? "'".$input['tgl_register']."'" : "NULL";
        $tgl_sid = !empty($input['tgl_sidang_pertama']) ? "'".$input['tgl_sidang_pertama']."'" : "NULL";
        $tgl_put = !empty($input['tgl_putus']) ? "'".$input['tgl_putus']."'" : "NULL";
        $waktu = $conn->real_escape_string($input['waktu_proses'] ?? '');
        $status_akhir = $conn->real_escape_string($input['status_akhir'] ?? '');
        $status_teknis = $conn->real_escape_string($input['status_teknis'] ?? '');
        $jml_resp = (int)($input['jumlah_responden'] ?? 0);
        $nilai_ikm = (float)($input['nilai_ikm'] ?? 0);
        $nilai_akhir = (float)($input['nilai_akhir'] ?? 0);
        $ket = $conn->real_escape_string($input['keterangan'] ?? '');
        
        $sql = "UPDATE detail_kinerja SET 
                nomor_perkara = '$nomor',
                klasifikasi = '$klas',
                tgl_register = $tgl_reg,
                tgl_sidang_pertama = $tgl_sid,
                tgl_putus = $tgl_put,
                waktu_proses = '$waktu',
                status_akhir = '$status_akhir',
                status_teknis = '$status_teknis',
                jumlah_responden = $jml_resp,
                nilai_ikm = $nilai_ikm,
                nilai_akhir = $nilai_akhir,
                keterangan = '$ket'
                WHERE id = $id";
        
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        exit;
    }

    // === INSERT (default) ===
    $indikator_id = $input['indikator_id'];
    $periode = $input['periode'] ?? "Januari 2026";
    
    $nomor = $conn->real_escape_string($input['nomor_perkara'] ?? '');
    $klas = $conn->real_escape_string($input['klasifikasi'] ?? '');
    $tgl_reg = !empty($input['tgl_register']) ? "'".$input['tgl_register']."'" : "NULL";
    $tgl_sid = !empty($input['tgl_sidang_pertama']) ? "'".$input['tgl_sidang_pertama']."'" : "NULL";
    $tgl_put = !empty($input['tgl_putus']) ? "'".$input['tgl_putus']."'" : "NULL";
    $waktu = $conn->real_escape_string($input['waktu_proses'] ?? '');
    $status_akhir = $conn->real_escape_string($input['status_akhir'] ?? '');
    $status_teknis = $conn->real_escape_string($input['status_teknis'] ?? '');
    $jml_resp = (int)($input['jumlah_responden'] ?? 0);
    $nilai_ikm = (float)($input['nilai_ikm'] ?? 0);
    $nilai_akhir = (float)($input['nilai_akhir'] ?? 0);
    $ket = $conn->real_escape_string($input['keterangan'] ?? '');

    $sql = "INSERT INTO detail_kinerja 
            (indikator_id, periode, nomor_perkara, klasifikasi, tgl_register, tgl_sidang_pertama, tgl_putus, waktu_proses, status_akhir, status_teknis, jumlah_responden, nilai_ikm, nilai_akhir, keterangan) 
            VALUES 
            ('$indikator_id', '$periode', '$nomor', '$klas', $tgl_reg, $tgl_sid, $tgl_put, '$waktu', '$status_akhir', '$status_teknis', $jml_resp, $nilai_ikm, $nilai_akhir, '$ket')";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "new_id" => $conn->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}
?>