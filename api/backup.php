<?php
/**
 * Backup & Restore API
 * SIMONEV-KIP
 */

require_once __DIR__ . '/db.php';
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check login for backup/restore
if (!isLoggedIn()) {
    echo json_encode(["status" => "error", "message" => "Anda harus login untuk menggunakan fitur ini"]);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'backup':
        handleBackup($conn);
        break;
    case 'restore':
        handleRestore($conn);
        break;
    case 'list':
        handleListBackups();
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

function handleBackup($conn)
{
    global $db;

    $backupDir = __DIR__ . '/backups/';
    if (!file_exists($backupDir)) {
        mkdir($backupDir, 0777, true);
    }

    $filename = 'simonev_backup_' . date('Y-m-d_His') . '.sql';
    $filepath = $backupDir . $filename;

    $tables = ['detail_perkara', 'detail_survei', 'detail_nilai', 'users', 'audit_logs', 'uploaded_files'];

    $sql = "-- SIMONEV Backup\n";
    $sql .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
    $sql .= "-- Database: simonev_2025\n\n";
    $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

    foreach ($tables as $table) {
        // Get create table
        $result = $conn->query("SHOW CREATE TABLE $table");
        if ($result && $row = $result->fetch_assoc()) {
            $sql .= "DROP TABLE IF EXISTS `$table`;\n";
            $sql .= $row['Create Table'] . ";\n\n";
        }

        // Get data
        $result = $conn->query("SELECT * FROM $table");
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $values = array_map(function ($val) use ($conn) {
                    if ($val === null)
                        return 'NULL';
                    return "'" . $conn->real_escape_string($val) . "'";
                }, array_values($row));

                $cols = implode('`, `', array_keys($row));
                $vals = implode(', ', $values);
                $sql .= "INSERT INTO `$table` (`$cols`) VALUES ($vals);\n";
            }
            $sql .= "\n";
        }
    }

    $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

    // Save to file
    file_put_contents($filepath, $sql);

    // Log activity
    logActivity($conn, 'BACKUP', null, null, null, ['filename' => $filename]);

    // Return download link
    echo json_encode([
        "status" => "success",
        "message" => "Backup berhasil dibuat",
        "filename" => $filename,
        "download_url" => "backups/" . $filename
    ]);
}

function handleRestore($conn)
{
    if (!isset($_FILES['backup_file'])) {
        echo json_encode(["status" => "error", "message" => "File backup tidak ditemukan"]);
        return;
    }

    $file = $_FILES['backup_file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(["status" => "error", "message" => "Error upload file"]);
        return;
    }

    $content = file_get_contents($file['tmp_name']);

    // Simple security check
    if (strpos($content, 'DROP TABLE') === false || strpos($content, 'SIMONEV Backup') === false) {
        echo json_encode(["status" => "error", "message" => "File backup tidak valid"]);
        return;
    }

    // Execute SQL
    $conn->multi_query($content);

    // Wait for all queries to complete
    while ($conn->next_result()) {
        ;
    }

    // Log activity
    logActivity($conn, 'RESTORE', null, null, null, ['filename' => $file['name']]);

    echo json_encode([
        "status" => "success",
        "message" => "Restore berhasil. Data telah dipulihkan."
    ]);
}

function handleListBackups()
{
    $backupDir = __DIR__ . '/backups/';
    $files = [];

    if (file_exists($backupDir)) {
        $allFiles = scandir($backupDir);
        foreach ($allFiles as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'sql') {
                $filepath = $backupDir . $file;
                $files[] = [
                    'filename' => $file,
                    'size' => filesize($filepath),
                    'created' => date('Y-m-d H:i:s', filemtime($filepath))
                ];
            }
        }
    }

    // Sort by newest first
    usort($files, function ($a, $b) {
        return strtotime($b['created']) - strtotime($a['created']);
    });

    echo json_encode(["status" => "success", "data" => $files]);
}
?>