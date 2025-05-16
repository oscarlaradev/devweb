<?php
// Configuración de la base de datos
define('DB_HOST', 'kodevo.ftp.tb-hosting.com');
define('DB_USER', 'kodevo_acggxh95');
define('DB_PASSWORD', 'M7&cV!3zXp4KdQ@');
define('DB_NAME', 'kodevo_acggxh95');

// Configuración de JWT
define('JWT_SECRET', 'G$7vKz2pXr9LdQ!mT'); // ¡Cambia esto por una clave secreta fuerte!
define('JWT_EXPIRES_IN', 3600); // 1 hora en segundos

// Configuración de seguridad
define('HASH_COST', 12); // Parámetro de costo para password_hash

// Reporte de errores
ini_set('display_errors', 0); // Debería ser 0 en producción
ini_set('log_errors', 1);
ini_set('error_log', './php_errors.log');
error_reporting(E_ALL);

// Solo establece las cabeceras si aún no se han enviado
if (!headers_sent()) {
    // Configuración de CORS
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-Domain');

    // Maneja las peticiones de preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Conexión a la base de datos con reporte de errores
function getDbConnection()
{
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
        if ($conn->connect_error) {
            error_log("Conexión a la base de datos fallida: " . $conn->connect_error);
            throw new Exception("Error de conexión a la base de datos: " . $conn->connect_error);
        }
        $conn->set_charset("utf8mb4");
        return $conn;
    } catch (Exception $e) {
        error_log("Excepción en getDbConnection: " . $e->getMessage());
        return null;
    }
}

// Función para sanitizar los datos de entrada
function sanitizeInput($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Genera un token JWT
function generateJWT($userId, $username)
{
    $issuedAt = time();
    $expiresAt = $issuedAt + JWT_EXPIRES_IN;

    $payload = [
        'iat' => $issuedAt,
        'exp' => $expiresAt,
        'userId' => $userId,
        'username' => $username
    ];

    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode($payload);

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

/**
 * Verifica un token JWT.
 *
 * @param string $token El token JWT a verificar.
 * @return array|null El payload del token decodificado si el token es válido, null en caso contrario.
 */
function verifyJWT($token) {
    try {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            throw new Exception('Formato de token inválido');
        }

        $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0])), true);
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1])), true);
        $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[2]));

        if (!$header || !$payload || !$signature) {
             throw new Exception('Formato de token inválido');
        }
      // Verifica el algoritmo
        if (!isset($header['alg']) || $header['alg'] !== 'HS256') {
            throw new Exception('Algoritmo inválido');
        }
        // Verifica la expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token expirado');
        }
        // Verifica la firma
        $expectedSignature = base64_decode(str_replace(['-', '_'], ['+', '/'],base64_encode(hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], JWT_SECRET, true))));

        if ($expectedSignature !== $signature) {
            throw new Exception('Firma inválida');
        }
        return $payload;

    } catch (Exception $e) {
        error_log('Error de verificación de JWT: ' . $e->getMessage());
        return null;
    }
}
?>