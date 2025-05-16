<?php
// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-Domain, Cache-Control');

// Enable error logging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_log("Auth request received: " . date('Y-m-d H:i:s'));

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get action from query string
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Define hardcoded credentials for testing
$adminUser = 'adminlara2007';
$adminPass = 'r4D9mX2pL7vQ8sT1';

// Handle token check
if ($action === 'check') {
    // Get token from Authorization header
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    $token = '';
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(['authenticated' => false, 'message' => 'No token provided']);
        exit();
    }
    
    try {
        // For simplicity, we'll use a basic token validation
        // In production, you should use proper JWT validation
        $decodedToken = base64_decode($token);
        $tokenData = json_decode($decodedToken, true);
        
        // If we can't decode the token, it's invalid
        if (!$tokenData) {
            // Try to decode as JWT
            $tokenParts = explode('.', $token);
            if (count($tokenParts) === 3) {
                $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
                $tokenData = json_decode($payload, true);
            }
        }
        
        // If we still don't have valid token data, it's invalid
        if (!$tokenData) {
            throw new Exception('Invalid token format');
        }
        
        // Check if token has expired
        if (isset($tokenData['exp']) && $tokenData['exp'] < time()) {
            throw new Exception('Token expired');
        }
        
        // Token is valid
        echo json_encode([
            'authenticated' => true, 
            'username' => $tokenData['username'] ?? 'Admin'
        ]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['authenticated' => false, 'message' => $e->getMessage()]);
    }
    
    exit();
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($action)) {
    // Get request data
    $requestData = json_decode(file_get_contents('php://input'), true);
    
    // Check if request data is valid
    if (!$requestData || !isset($requestData['username']) || !isset($requestData['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos de solicitud inválidos']);
        exit();
    }
    
    $username = $requestData['username'];
    $password = $requestData['password'];
    
    // Log login attempt
    error_log("Login attempt for user: $username");
    
    // Simple hardcoded authentication for testing
    if ($username === $adminUser && $password === $adminPass) {
        // Generate a simple token
        $tokenData = [
            'userId' => 1,
            'username' => $username,
            'exp' => time() + 3600
        ];
        
        $token = base64_encode(json_encode($tokenData));
        
        error_log("Login successful for user: $username");
        echo json_encode(['success' => true, 'token' => $token, 'username' => $username]);
    } else {
        error_log("Login failed for user: $username");
        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
    }
    exit();
}

// Handle token refresh
if ($action === 'refresh') {
    // Get token from Authorization header
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    $token = '';
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No token provided']);
        exit();
    }
    
    try {
        // Decode token
        $decodedToken = base64_decode($token);
        $tokenData = json_decode($decodedToken, true);
        
        // If we can't decode the token, try JWT format
        if (!$tokenData) {
            $tokenParts = explode('.', $token);
            if (count($tokenParts) === 3) {
                $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
                $tokenData = json_decode($payload, true);
            }
        }
        
        if (!$tokenData) {
            throw new Exception('Invalid token');
        }
        
        // Generate new token with updated expiration
        $newTokenData = $tokenData;
        $newTokenData['exp'] = time() + 3600;
        
        $newToken = base64_encode(json_encode($newTokenData));
        
        echo json_encode(['success' => true, 'token' => $newToken]);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
    
    exit();
}

// Handle logout
if ($action === 'logout') {
    // No server-side session to destroy, just return success
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    exit();
}

// If we get here, the request is invalid
http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Método de solicitud inválido']);
?>