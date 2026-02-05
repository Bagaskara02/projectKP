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

// === HELPER: Determine table based on indikator_id ===
function getTableName($indikator_id)
{
    if (strpos($indikator_id, '1.') === 0)
        return 'detail_perkara';
    if ($indikator_id === '2.1')
        return 'detail_survei';
    if (strpos($indikator_id, '3.') === 0)
        return 'detail_nilai';
    return 'detail_perkara'; // default
}

// =====================================================
// GET REQUESTS
// =====================================================
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $action = $_GET['action'] ?? '';

    // === Summary endpoint for Dashboard ===
    if ($action == 'summary') {
        $summaryData = [];

        // Perkara indicators (1.x)
        $perkaraInd = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10', '1.11', '1.12', '1.13', '1.14'];
        foreach ($perkaraInd as $ind) {
            $sql = "SELECT COUNT(*) as total, 
                    SUM(CASE WHEN status_akhir IN ('Tepat Waktu','Berhasil','Elektronik') THEN 1 ELSE 0 END) as success
                    FROM detail_perkara WHERE indikator_id = '$ind'";
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            $total = (int) $row['total'];
            $success = (int) $row['success'];
            $percentage = $total > 0 ? round(($success / $total) * 100, 2) : 0;
            $summaryData[$ind] = ['total' => $total, 'success' => $success, 'percentage' => $percentage];
        }

        // Survei indicator (2.1)
        $sql = "SELECT AVG(nilai_ikm) as avg_ikm, SUM(jumlah_responden) as total_resp FROM detail_survei WHERE indikator_id = '2.1'";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        $ikm = $row['avg_ikm'] ? round($row['avg_ikm'] * 25, 2) : 0;
        $summaryData['2.1'] = ['total' => (int) $row['total_resp'], 'success' => 0, 'percentage' => $ikm];

        // Nilai indicators (3.x)
        $nilaiInd = ['3.1', '3.2', '3.3', '3.4'];
        foreach ($nilaiInd as $ind) {
            $sql = "SELECT AVG(nilai_akhir) as avg_score, COUNT(*) as total FROM detail_nilai WHERE indikator_id = '$ind'";
            $result = $conn->query($sql);
            $row = $result->fetch_assoc();
            $percentage = $row['avg_score'] ? round($row['avg_score'], 2) : 0;
            $summaryData[$ind] = ['total' => (int) $row['total'], 'success' => 0, 'percentage' => $percentage];
        }

        echo json_encode(["status" => "success", "data" => $summaryData]);
        exit;
    }

    // === Sync Status endpoint for Settings page ===
    if ($action == 'sync_status') {
        $logFile = __DIR__ . '/auto_sync_log.txt';
        $syncData = [
            'last_sync' => null,
            'last_result' => null,
            'stats' => null
        ];

        if (file_exists($logFile)) {
            $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $lines = array_reverse($lines); // Get latest first

            foreach ($lines as $line) {
                // Find last SYNC COMPLETE line
                if (strpos($line, 'SYNC COMPLETE') !== false) {
                    preg_match('/\[(.*?)\]/', $line, $dateMatch);
                    preg_match('/Total: (\d+), Created: (\d+), Updated: (\d+), Failed: (\d+)/', $line, $statsMatch);

                    if ($dateMatch)
                        $syncData['last_sync'] = $dateMatch[1];
                    if ($statsMatch) {
                        $syncData['stats'] = [
                            'total' => (int) $statsMatch[1],
                            'created' => (int) $statsMatch[2],
                            'updated' => (int) $statsMatch[3],
                            'failed' => (int) $statsMatch[4]
                        ];
                        $syncData['last_result'] = 'success';
                    }
                    break;
                }
                // Check for errors
                if (strpos($line, 'ERROR') !== false) {
                    preg_match('/\[(.*?)\]/', $line, $dateMatch);
                    if ($dateMatch)
                        $syncData['last_sync'] = $dateMatch[1];
                    $syncData['last_result'] = 'error';
                    $syncData['error_message'] = trim(substr($line, strpos($line, 'ERROR') + 7));
                    break;
                }
            }
        }

        echo json_encode(["status" => "success", "data" => $syncData]);
        exit;
    }

    // === Regular GET for data ===
    $indikator_id = $_GET['id'] ?? '';
    $start_date = $_GET['start_date'] ?? '';
    $end_date = $_GET['end_date'] ?? '';

    $table = getTableName($indikator_id);
    $sql = "SELECT * FROM $table WHERE indikator_id = '$indikator_id'";

    // Date filter for perkara
    if ($table == 'detail_perkara' && $start_date && $end_date) {
        $sql .= " AND tgl_register BETWEEN '$start_date' AND '$end_date'";
    }

    $sql .= " ORDER BY id DESC";

    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        // Map survei columns to match frontend expectations
        if ($table == 'detail_survei') {
            $row['keterangan'] = $row['triwulan'];
            $row['status_teknis'] = $row['link_bukti'];
        }
        if ($table == 'detail_nilai') {
            $row['status_teknis'] = $row['link_bukti'] ?? '';
        }
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
}

// =====================================================
// POST REQUESTS
// =====================================================
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? '';
    $indikator_id = $input['indikator_id'] ?? '';
    $table = getTableName($indikator_id);

    // === DELETE ===
    if ($action == 'delete') {
        $id = (int) $input['id'];
        // Determine table from id - need to check all tables
        $deleted = false;
        foreach (['detail_perkara', 'detail_survei', 'detail_nilai'] as $t) {
            $result = $conn->query("SELECT id FROM $t WHERE id = $id");
            if ($result->num_rows > 0) {
                $conn->query("DELETE FROM $t WHERE id = $id");
                $deleted = true;
                break;
            }
        }
        echo json_encode(["status" => $deleted ? "success" : "error"]);
        exit;
    }

    // === UPDATE ===
    if ($action == 'update') {
        $id = (int) $input['id'];

        if ($table == 'detail_perkara') {
            $nomor = $conn->real_escape_string($input['nomor_perkara'] ?? '');
            $klas = $conn->real_escape_string($input['klasifikasi'] ?? '');
            $tgl_reg = !empty($input['tgl_register']) ? "'" . $input['tgl_register'] . "'" : "NULL";
            $tgl_sid = !empty($input['tgl_sidang_pertama']) ? "'" . $input['tgl_sidang_pertama'] . "'" : "NULL";
            $tgl_put = !empty($input['tgl_putus']) ? "'" . $input['tgl_putus'] . "'" : "NULL";
            $waktu = $conn->real_escape_string($input['waktu_proses'] ?? '');
            $status_akhir = $conn->real_escape_string($input['status_akhir'] ?? '');
            $status_teknis = $conn->real_escape_string($input['status_teknis'] ?? '');

            $sql = "UPDATE detail_perkara SET 
                    nomor_perkara = '$nomor', klasifikasi = '$klas',
                    tgl_register = $tgl_reg, tgl_sidang_pertama = $tgl_sid, tgl_putus = $tgl_put,
                    waktu_proses = '$waktu', status_akhir = '$status_akhir', status_teknis = '$status_teknis'
                    WHERE id = $id";
        } elseif ($table == 'detail_survei') {
            $triwulan = $conn->real_escape_string($input['keterangan'] ?? '');
            $jml_resp = (int) ($input['jumlah_responden'] ?? 0);
            $nilai_ikm = (float) ($input['nilai_ikm'] ?? 0);
            $link = $conn->real_escape_string($input['status_teknis'] ?? '');

            $sql = "UPDATE detail_survei SET 
                    triwulan = '$triwulan', jumlah_responden = $jml_resp, nilai_ikm = $nilai_ikm, link_bukti = '$link'
                    WHERE id = $id";
        } elseif ($table == 'detail_nilai') {
            $ket = $conn->real_escape_string($input['keterangan'] ?? '');
            $nilai = (float) ($input['nilai_akhir'] ?? 0);
            $link = $conn->real_escape_string($input['status_teknis'] ?? '');

            $sql = "UPDATE detail_nilai SET 
                    keterangan = '$ket', nilai_akhir = $nilai, link_bukti = '$link'
                    WHERE id = $id";
        }

        if ($conn->query($sql)) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        exit;
    }

    // === INSERT ===
    if ($table == 'detail_perkara') {
        $nomor = $conn->real_escape_string($input['nomor_perkara'] ?? '');
        $klas = $conn->real_escape_string($input['klasifikasi'] ?? '');
        $tgl_reg = !empty($input['tgl_register']) ? "'" . $input['tgl_register'] . "'" : "NULL";
        $tgl_sid = !empty($input['tgl_sidang_pertama']) ? "'" . $input['tgl_sidang_pertama'] . "'" : "NULL";
        $tgl_put = !empty($input['tgl_putus']) ? "'" . $input['tgl_putus'] . "'" : "NULL";
        $waktu = $conn->real_escape_string($input['waktu_proses'] ?? '');
        $status_akhir = $conn->real_escape_string($input['status_akhir'] ?? '');
        $status_teknis = $conn->real_escape_string($input['status_teknis'] ?? '');

        $sql = "INSERT INTO detail_perkara 
                (indikator_id, nomor_perkara, klasifikasi, tgl_register, tgl_sidang_pertama, tgl_putus, waktu_proses, status_teknis, status_akhir) 
                VALUES ('$indikator_id', '$nomor', '$klas', $tgl_reg, $tgl_sid, $tgl_put, '$waktu', '$status_teknis', '$status_akhir')";
    } elseif ($table == 'detail_survei') {
        $triwulan = $conn->real_escape_string($input['keterangan'] ?? 'Triwulan 1');
        $jml_resp = (int) ($input['jumlah_responden'] ?? 0);
        $nilai_ikm = (float) ($input['nilai_ikm'] ?? 0);
        $link = $conn->real_escape_string($input['status_teknis'] ?? '');

        $sql = "INSERT INTO detail_survei 
                (indikator_id, triwulan, jumlah_responden, nilai_ikm, link_bukti) 
                VALUES ('$indikator_id', '$triwulan', $jml_resp, $nilai_ikm, '$link')";
    } elseif ($table == 'detail_nilai') {
        $ket = $conn->real_escape_string($input['keterangan'] ?? '');
        $nilai = (float) ($input['nilai_akhir'] ?? 0);
        $link = $conn->real_escape_string($input['status_teknis'] ?? '');

        $sql = "INSERT INTO detail_nilai 
                (indikator_id, keterangan, nilai_akhir, link_bukti) 
                VALUES ('$indikator_id', '$ket', $nilai, '$link')";
    }

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success", "new_id" => $conn->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}
?>