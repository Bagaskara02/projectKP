<?php
/**
 * File Upload API
 * SIMONEV-KIP
 */

require_once __DIR__ . '/db.php';
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? 'upload';

switch ($action) {
    case 'upload':
        handleUpload($conn);
        break;
    case 'delete':
        handleDelete($conn);
        break;
    case 'list':
        handleList($conn);
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
}

function handleUpload($conn)
{
    // Check login
    if (!isLoggedIn()) {
        echo json_encode(["status" => "error", "message" => "Anda harus login untuk upload file"]);
        return;
    }

    if (!isset($_FILES['file'])) {
        echo json_encode(["status" => "error", "message" => "File tidak ditemukan"]);
        return;
    }

    $file = $_FILES['file'];
    $relatedTable = $_POST['related_table'] ?? '';
    $relatedId = (int) ($_POST['related_id'] ?? 0);

    // Validate file
    $allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'];
    $maxSize = 10 * 1024 * 1024; // 10MB

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowedTypes)) {
        echo json_encode(["status" => "error", "message" => "Tipe file tidak diizinkan. Tipe yang diizinkan: " . implode(', ', $allowedTypes)]);
        return;
    }

    if ($file['size'] > $maxSize) {
        echo json_encode(["status" => "error", "message" => "Ukuran file maksimal 10MB"]);
        return;
    }

    // Create upload directory
    $uploadDir = __DIR__ . '/uploads/' . date('Y') . '/' . date('m') . '/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generate unique filename
    $storedName = uniqid() . '_' . time() . '.' . $ext;
    $targetPath = $uploadDir . $storedName;
    $relativePath = 'uploads/' . date('Y') . '/' . date('m') . '/' . $storedName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // Save to database
        $user = getCurrentUser();
        $stmt = $conn->prepare("INSERT INTO uploaded_files (original_name, stored_name, file_path, file_type, file_size, related_table, related_id, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "ssssissi",
            $file['name'],
            $storedName,
            $relativePath,
            $file['type'],
            $file['size'],
            $relatedTable,
            $relatedId,
            $user['id']
        );
        $stmt->execute();
        $fileId = $conn->insert_id;
        $stmt->close();

        echo json_encode([
            "status" => "success",
            "message" => "File berhasil diupload",
            "file" => [
                "id" => $fileId,
                "original_name" => $file['name'],
                "file_path" => $relativePath,
                "file_url" => "http://localhost/simonev-pn2/api/" . $relativePath
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan file"]);
    }
}

function handleDelete($conn)
{
    if (!isLoggedIn()) {
        echo json_encode(["status" => "error", "message" => "Unauthorized"]);
        return;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $fileId = (int) ($input['id'] ?? 0);

    // Get file info
    $result = $conn->query("SELECT * FROM uploaded_files WHERE id = $fileId");
    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "File tidak ditemukan"]);
        return;
    }

    $file = $result->fetch_assoc();
    $filepath = __DIR__ . '/' . $file['file_path'];

    // Delete physical file
    if (file_exists($filepath)) {
        unlink($filepath);
    }

    // Delete from database
    $conn->query("DELETE FROM uploaded_files WHERE id = $fileId");

    echo json_encode(["status" => "success", "message" => "File berhasil dihapus"]);
}

function handleList($conn)
{
    $relatedTable = sanitize($conn, $_GET['table'] ?? '');
    $relatedId = (int) ($_GET['id'] ?? 0);

    $where = "1=1";
    if ($relatedTable)
        $where .= " AND related_table = '$relatedTable'";
    if ($relatedId)
        $where .= " AND related_id = $relatedId";

    $result = $conn->query("SELECT * FROM uploaded_files WHERE $where ORDER BY created_at DESC");

    $files = [];
    while ($row = $result->fetch_assoc()) {
        $row['file_url'] = "http://localhost/simonev-pn2/api/" . $row['file_path'];
        $files[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $files]);
}
?>