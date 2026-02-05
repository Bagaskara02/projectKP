<?php
/**
 * Audit Trail API
 * SIMONEV-KIP
 */

require_once __DIR__ . '/db.php';
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        handleGetLogs($conn);
        break;
    case 'stats':
        handleGetStats($conn);
        break;
    default:
        handleGetLogs($conn);
}

function handleGetLogs($conn)
{
    $page = (int) ($_GET['page'] ?? 1);
    $limit = (int) ($_GET['limit'] ?? 50);
    $offset = ($page - 1) * $limit;

    // Filters
    $whereClause = "1=1";

    if (!empty($_GET['user_id'])) {
        $userId = (int) $_GET['user_id'];
        $whereClause .= " AND user_id = $userId";
    }

    if (!empty($_GET['action_type'])) {
        $actionType = sanitize($conn, $_GET['action_type']);
        $whereClause .= " AND action = '$actionType'";
    }

    if (!empty($_GET['start_date'])) {
        $startDate = sanitize($conn, $_GET['start_date']);
        $whereClause .= " AND DATE(created_at) >= '$startDate'";
    }

    if (!empty($_GET['end_date'])) {
        $endDate = sanitize($conn, $_GET['end_date']);
        $whereClause .= " AND DATE(created_at) <= '$endDate'";
    }

    // Get total count
    $countResult = $conn->query("SELECT COUNT(*) as total FROM audit_logs WHERE $whereClause");
    $total = $countResult->fetch_assoc()['total'];

    // Get logs
    $sql = "SELECT * FROM audit_logs WHERE $whereClause ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);

    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $row['old_data'] = $row['old_data'] ? json_decode($row['old_data'], true) : null;
        $row['new_data'] = $row['new_data'] ? json_decode($row['new_data'], true) : null;
        $logs[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $logs,
        "pagination" => [
            "page" => $page,
            "limit" => $limit,
            "total" => (int) $total,
            "total_pages" => ceil($total / $limit)
        ]
    ]);
}

function handleGetStats($conn)
{
    // Get activity stats for last 30 days
    $stats = [];

    // Actions by type
    $result = $conn->query("SELECT action, COUNT(*) as count FROM audit_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY action");
    while ($row = $result->fetch_assoc()) {
        $stats['by_action'][] = $row;
    }

    // Actions by day (last 7 days)
    $result = $conn->query("SELECT DATE(created_at) as date, COUNT(*) as count FROM audit_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date");
    while ($row = $result->fetch_assoc()) {
        $stats['by_day'][] = $row;
    }

    // Top active users
    $result = $conn->query("SELECT user_name, COUNT(*) as count FROM audit_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY user_id, user_name ORDER BY count DESC LIMIT 5");
    while ($row = $result->fetch_assoc()) {
        $stats['top_users'][] = $row;
    }

    echo json_encode(["status" => "success", "data" => $stats]);
}
?>