<?php
/**
 * Import Data API (Excel/CSV)
 * SIMONEV-KIP
 */

require_once __DIR__ . '/db.php';
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check login
if (!isLoggedIn()) {
    echo json_encode(["status" => "error", "message" => "Anda harus login untuk import data"]);
    exit;
}

$action = $_GET['action'] ?? 'import';

switch ($action) {
    case 'import':
        handleImport($conn);
        break;
    case 'template':
        handleGetTemplate();
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

function handleImport($conn)
{
    if (!isset($_FILES['file'])) {
        echo json_encode(["status" => "error", "message" => "File tidak ditemukan"]);
        return;
    }

    $file = $_FILES['file'];
    $indikatorId = $_POST['indikator_id'] ?? '';
    $tahun = (int) ($_POST['tahun'] ?? date('Y'));

    if (empty($indikatorId)) {
        echo json_encode(["status" => "error", "message" => "Indikator ID harus diisi"]);
        return;
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, ['csv', 'xls', 'xlsx'])) {
        echo json_encode(["status" => "error", "message" => "Format file harus CSV atau Excel"]);
        return;
    }

    // Parse file based on extension
    if ($ext === 'csv') {
        $data = parseCSV($file['tmp_name']);
    } else {
        // For Excel, we'll use CSV conversion approach
        // In production, use PhpSpreadsheet library
        $data = parseCSV($file['tmp_name']); // Simplified - should use PhpSpreadsheet
    }

    if (empty($data)) {
        echo json_encode(["status" => "error", "message" => "File kosong atau format tidak valid"]);
        return;
    }

    // Determine table
    $table = getTableFromIndicator($indikatorId);

    // Process import
    $stats = ['total' => 0, 'success' => 0, 'failed' => 0, 'errors' => []];

    foreach ($data as $idx => $row) {
        $stats['total']++;

        try {
            if ($table === 'detail_perkara') {
                $result = importPerkara($conn, $row, $indikatorId, $tahun);
            } elseif ($table === 'detail_survei') {
                $result = importSurvei($conn, $row, $indikatorId, $tahun);
            } else {
                $result = importNilai($conn, $row, $indikatorId, $tahun);
            }

            if ($result) {
                $stats['success']++;
            } else {
                $stats['failed']++;
                $stats['errors'][] = "Baris " . ($idx + 2) . ": Gagal insert";
            }
        } catch (Exception $e) {
            $stats['failed']++;
            $stats['errors'][] = "Baris " . ($idx + 2) . ": " . $e->getMessage();
        }
    }

    // Log activity
    logActivity($conn, 'IMPORT', $table, null, null, $stats);

    echo json_encode([
        "status" => "success",
        "message" => "Import selesai. Berhasil: {$stats['success']}, Gagal: {$stats['failed']}",
        "stats" => $stats
    ]);
}

function parseCSV($filepath)
{
    $data = [];
    $handle = fopen($filepath, 'r');

    if (!$handle)
        return [];

    // Skip header
    $headers = fgetcsv($handle, 0, ',');
    if (!$headers)
        return [];

    // Normalize headers
    $headers = array_map('trim', $headers);
    $headers = array_map('strtolower', $headers);

    while (($row = fgetcsv($handle, 0, ',')) !== false) {
        if (count($row) !== count($headers))
            continue;
        $data[] = array_combine($headers, $row);
    }

    fclose($handle);
    return $data;
}

function getTableFromIndicator($indikatorId)
{
    if (strpos($indikatorId, '1.') === 0)
        return 'detail_perkara';
    if ($indikatorId === '2.1')
        return 'detail_survei';
    if (strpos($indikatorId, '3.') === 0)
        return 'detail_nilai';
    return 'detail_perkara';
}

function importPerkara($conn, $row, $indikatorId, $tahun)
{
    $nomor = sanitize($conn, $row['nomor_perkara'] ?? $row['nomor'] ?? '');
    $klas = sanitize($conn, $row['klasifikasi'] ?? $row['jenis'] ?? '');
    $tgl_reg = !empty($row['tgl_register']) ? "'" . $row['tgl_register'] . "'" : "NULL";
    $tgl_sid = !empty($row['tgl_sidang_pertama']) ? "'" . $row['tgl_sidang_pertama'] . "'" : "NULL";
    $tgl_put = !empty($row['tgl_putus']) ? "'" . $row['tgl_putus'] . "'" : "NULL";
    $waktu = sanitize($conn, $row['waktu_proses'] ?? '');
    $status_tek = sanitize($conn, $row['status_teknis'] ?? '');
    $status_akhir = sanitize($conn, $row['status_akhir'] ?? 'Tepat Waktu');

    if (empty($nomor))
        return false;

    $sql = "INSERT INTO detail_perkara (indikator_id, tahun, nomor_perkara, klasifikasi, tgl_register, tgl_sidang_pertama, tgl_putus, waktu_proses, status_teknis, status_akhir) 
            VALUES ('$indikatorId', $tahun, '$nomor', '$klas', $tgl_reg, $tgl_sid, $tgl_put, '$waktu', '$status_tek', '$status_akhir')";

    return $conn->query($sql);
}

function importSurvei($conn, $row, $indikatorId, $tahun)
{
    $triwulan = sanitize($conn, $row['triwulan'] ?? 'Triwulan 1');
    $responden = (int) ($row['jumlah_responden'] ?? 0);
    $ikm = (float) ($row['nilai_ikm'] ?? 0);
    $link = sanitize($conn, $row['link_bukti'] ?? '');

    $sql = "INSERT INTO detail_survei (indikator_id, tahun, triwulan, jumlah_responden, nilai_ikm, link_bukti) 
            VALUES ('$indikatorId', $tahun, '$triwulan', $responden, $ikm, '$link')";

    return $conn->query($sql);
}

function importNilai($conn, $row, $indikatorId, $tahun)
{
    $ket = sanitize($conn, $row['keterangan'] ?? '');
    $nilai = (float) ($row['nilai_akhir'] ?? 0);
    $link = sanitize($conn, $row['link_bukti'] ?? '');

    $sql = "INSERT INTO detail_nilai (indikator_id, tahun, keterangan, nilai_akhir, link_bukti) 
            VALUES ('$indikatorId', $tahun, '$ket', $nilai, '$link')";

    return $conn->query($sql);
}

function handleGetTemplate()
{
    $indikatorId = $_GET['indikator_id'] ?? '1.1';

    $templates = [
        'perkara' => [
            'headers' => ['nomor_perkara', 'klasifikasi', 'tgl_register', 'tgl_sidang_pertama', 'tgl_putus', 'waktu_proses', 'status_teknis', 'status_akhir'],
            'sample' => ['1/Pdt.G/2025/PN Yyk', 'Perdata Gugatan', '2025-01-15', '2025-02-01', '2025-03-15', '60 hari', 'Minutasi', 'Tepat Waktu']
        ],
        'survei' => [
            'headers' => ['triwulan', 'jumlah_responden', 'nilai_ikm', 'link_bukti'],
            'sample' => ['Triwulan 1', '50', '3.6868', 'https://example.com/bukti']
        ],
        'nilai' => [
            'headers' => ['keterangan', 'nilai_akhir', 'link_bukti'],
            'sample' => ['IP ASN Semester 1', '85.5', 'https://example.com/bukti']
        ]
    ];

    $type = 'perkara';
    if ($indikatorId === '2.1')
        $type = 'survei';
    elseif (strpos($indikatorId, '3.') === 0)
        $type = 'nilai';

    echo json_encode([
        "status" => "success",
        "template" => $templates[$type]
    ]);
}
?>