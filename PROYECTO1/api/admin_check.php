<?php
define('SECURE_ACCESS', true);

require_once 'auth.php';
require_once 'config.php';

if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
    handleUnauthorized();
}

$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
$token = '';
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];
}

if (!$token) {
     handleUnauthorized();
}
$payload = verifyJWT($token);

if (!$payload) {
    handleUnauthorized();
}
$userId = $payload['userId'];

function handleUnauthorized() {
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Autenticación requerida']);
        exit;
    } else {
        header('Location: ../login.php');
        exit;
    }
}

function updateLastActivity($userId) {
    $conn = getDbConnection();
     if (!$conn) {
        error_log("Falló la conexión a la base de datos en updateLastActivity.");
        return;
    }
    $lastActivity = time();
    $stmt = $conn->prepare("UPDATE users SET last_activity = ? WHERE id = ?");
     if (!$stmt) {
        error_log("Error de la sentencia preparada en updateLastActivity: " . $conn->error);
        $conn->close();
        return;
    }
    $stmt->bind_param("ii", $lastActivity, $userId);
    $stmt->execute();
    $stmt->close();
    $conn->close();
}

function logActivity($userId, $activity) {
    $conn = getDbConnection();
    if (!$conn) {
        error_log("Falló la conexión a la base de datos en logActivity.");
        return;
    }

    $stmt = $conn->prepare("INSERT INTO activity_log (user_id, activity, timestamp) VALUES (?, ?, ?)");
     if (!$stmt) {
        error_log("Error de la sentencia preparada en logActivity: " . $conn->error);
        $conn->close();
        return;
    }
    $timestamp = time();
    $stmt->bind_param("isi", $userId, $activity, $timestamp);
    $stmt->execute();
    $stmt->close();
    $conn->close();
}

updateLastActivity($userId);
logActivity($userId, 'Accessed admin area');
?>
