<?php
/**
 * SIMONEV - Auto Sync Script
 * 
 * Script ini dijalankan otomatis oleh Windows Task Scheduler
 * untuk sync data dari e-Berpadu secara berkala
 * 
 * CARA SETUP:
 * 1. Buka Windows Task Scheduler
 * 2. Create Basic Task → Name: "SIMONEV Auto Sync"
 * 3. Trigger: Daily (atau sesuai kebutuhan)
 * 4. Action: Start a program
 *    Program: C:\xampp\php\php.exe
 *    Arguments: C:\xampp\htdocs\simonev-pn2\api\auto_sync.php
 * 5. Finish
 */

// Load konfigurasi
$config = require __DIR__ . '/config_eberpadu.php';

// Database connection
$conn = new mysqli("localhost", "root", "", "simonev_2025");
if ($conn->connect_error) {
    logSync("ERROR: Database connection failed");
    exit(1);
}

logSync("=== AUTO SYNC STARTED ===");

// Check if configured
if (empty($config['api_key']) || $config['api_key'] === 'ISI_API_KEY_DARI_TIM_IT_EBERPADU') {
    logSync("ERROR: API e-Berpadu belum dikonfigurasi");
    exit(1);
}

// Date range: last 7 days by default
$startDate = date('Y-m-d', strtotime('-7 days'));
$endDate = date('Y-m-d');

logSync("Sync periode: $startDate s/d $endDate");

// Call e-Berpadu API
$endpoint = $config['endpoints']['perkara'] . "?start_date=$startDate&end_date=$endDate";
$url = rtrim($config['api_url'], '/') . $endpoint;

$headers = [
    'Content-Type: application/json',
    'Accept: application/json',
];

if (!empty($config['bearer_token'])) {
    $headers[] = 'Authorization: Bearer ' . $config['bearer_token'];
} elseif (!empty($config['api_key'])) {
    $headers[] = 'X-API-Key: ' . $config['api_key'];
}

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => $config['timeout'],
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_SSL_VERIFYPEER => $config['verify_ssl'],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    logSync("ERROR: CURL failed - $error");
    exit(1);
}

if ($httpCode !== 200) {
    logSync("ERROR: HTTP $httpCode");
    exit(1);
}

$responseData = json_decode($response, true);
$data = $responseData['data'] ?? $responseData;

if (empty($data) || !is_array($data)) {
    logSync("INFO: Tidak ada data baru");
    exit(0);
}

// Process data
$stats = ['total' => 0, 'created' => 0, 'updated' => 0, 'failed' => 0];

foreach ($data as $record) {
    $stats['total']++;

    try {
        // Map fields
        $mapped = [];
        foreach ($config['field_mapping'] as $simonevField => $eberpaduField) {
            $mapped[$simonevField] = $record[$eberpaduField] ?? '';
        }

        // Determine indicator
        $klasifikasi = $mapped['klasifikasi'] ?? '';
        $indikator = $config['indikator_mapping'][$klasifikasi] ?? '1.1';

        $nomor = $conn->real_escape_string($mapped['nomor_perkara']);

        // Check if exists
        $check = $conn->query("SELECT id FROM detail_perkara WHERE nomor_perkara = '$nomor'");

        if ($check->num_rows > 0) {
            // Update
            $id = $check->fetch_assoc()['id'];
            $klas = $conn->real_escape_string($mapped['klasifikasi']);
            $tgl_reg = !empty($mapped['tgl_register']) ? "'" . $mapped['tgl_register'] . "'" : "NULL";
            $tgl_sid = !empty($mapped['tgl_sidang_pertama']) ? "'" . $mapped['tgl_sidang_pertama'] . "'" : "NULL";
            $tgl_put = !empty($mapped['tgl_putus']) ? "'" . $mapped['tgl_putus'] . "'" : "NULL";
            $waktu = $conn->real_escape_string($mapped['waktu_proses']);
            $status_tek = $conn->real_escape_string($mapped['status_teknis']);
            $status_akhir = $conn->real_escape_string($mapped['status_akhir']);

            $sql = "UPDATE detail_perkara SET 
                    indikator_id='$indikator', klasifikasi='$klas', 
                    tgl_register=$tgl_reg, tgl_sidang_pertama=$tgl_sid, tgl_putus=$tgl_put,
                    waktu_proses='$waktu', status_teknis='$status_tek', status_akhir='$status_akhir'
                    WHERE id=$id";
            $conn->query($sql);
            $stats['updated']++;
        } else {
            // Insert
            $klas = $conn->real_escape_string($mapped['klasifikasi']);
            $tgl_reg = !empty($mapped['tgl_register']) ? "'" . $mapped['tgl_register'] . "'" : "NULL";
            $tgl_sid = !empty($mapped['tgl_sidang_pertama']) ? "'" . $mapped['tgl_sidang_pertama'] . "'" : "NULL";
            $tgl_put = !empty($mapped['tgl_putus']) ? "'" . $mapped['tgl_putus'] . "'" : "NULL";
            $waktu = $conn->real_escape_string($mapped['waktu_proses']);
            $status_tek = $conn->real_escape_string($mapped['status_teknis']);
            $status_akhir = $conn->real_escape_string($mapped['status_akhir']);

            $sql = "INSERT INTO detail_perkara 
                    (indikator_id, nomor_perkara, klasifikasi, tgl_register, tgl_sidang_pertama, tgl_putus, waktu_proses, status_teknis, status_akhir) 
                    VALUES ('$indikator', '$nomor', '$klas', $tgl_reg, $tgl_sid, $tgl_put, '$waktu', '$status_tek', '$status_akhir')";
            $conn->query($sql);
            $stats['created']++;
        }
    } catch (Exception $e) {
        $stats['failed']++;
        logSync("ERROR: " . $e->getMessage());
    }
}

logSync("SYNC COMPLETE - Total: {$stats['total']}, Created: {$stats['created']}, Updated: {$stats['updated']}, Failed: {$stats['failed']}");
logSync("=== AUTO SYNC FINISHED ===\n");

function logSync($message)
{
    $logFile = __DIR__ . '/auto_sync_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $message\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
    echo $logEntry; // Also output to console
}
?>