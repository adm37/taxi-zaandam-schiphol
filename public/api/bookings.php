<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Config file not found']);
    exit;
}

$config = require $configPath;

function jsonResponse(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function getConfigValue(array $config, string $key): string
{
    return trim((string)($config[$key] ?? ''));
}

function buildPdo(array $config): PDO
{
    $host = getConfigValue($config, 'db_host');
    $port = (int)($config['db_port'] ?? 3306);
    $dbName = getConfigValue($config, 'db_name');
    $user = getConfigValue($config, 'db_user');
    $password = (string)($config['db_password'] ?? '');

    if ($host === '' || $dbName === '' || $user === '' || $password === '') {
        jsonResponse(500, ['error' => 'Database configuration is incomplete in /api/config.php']);
    }

    if (str_starts_with($dbName, 'CHANGE_ME_') || str_starts_with($user, 'CHANGE_ME_') || str_starts_with($password, 'CHANGE_ME_')) {
        jsonResponse(500, ['error' => 'Update /api/config.php with your real Hostinger database credentials']);
    }

    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, $dbName);

    return new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}

function getSafeTableName(array $config): string
{
    $tableName = getConfigValue($config, 'db_table');
    if ($tableName === '') {
        $tableName = 'bookings';
    }

    if (!preg_match('/^[a-zA-Z0-9_]+$/', $tableName)) {
        jsonResponse(500, ['error' => 'Invalid db_table name in /api/config.php']);
    }

    return $tableName;
}

function ensureTableExists(PDO $pdo, string $tableName): void
{
    $sql = "CREATE TABLE IF NOT EXISTS {$tableName} (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      pickup VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      date VARCHAR(30) NOT NULL,
      time VARCHAR(30) NOT NULL,
      passengers INT NOT NULL DEFAULT 1,
      suitcases INT NOT NULL DEFAULT 0,
      vehicle_type VARCHAR(80) NOT NULL,
      payment_method VARCHAR(80) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
      return_pickup VARCHAR(255) NULL,
      return_destination VARCHAR(255) NULL,
      return_date VARCHAR(30) NULL,
      return_time VARCHAR(30) NULL,
      PRIMARY KEY (id),
      KEY idx_created_at (created_at)
    )";

    $pdo->exec($sql);

    $requiredColumns = [
        'return_pickup' => "ALTER TABLE {$tableName} ADD COLUMN return_pickup VARCHAR(255) NULL AFTER total_price",
        'return_destination' => "ALTER TABLE {$tableName} ADD COLUMN return_destination VARCHAR(255) NULL AFTER return_pickup",
        'return_date' => "ALTER TABLE {$tableName} ADD COLUMN return_date VARCHAR(30) NULL AFTER return_destination",
        'return_time' => "ALTER TABLE {$tableName} ADD COLUMN return_time VARCHAR(30) NULL AFTER return_date",
    ];

    $columnCheckStmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?'
    );

    foreach ($requiredColumns as $columnName => $alterSql) {
        $columnCheckStmt->execute([$tableName, $columnName]);
        $hasColumn = (int)$columnCheckStmt->fetchColumn() > 0;

        if (!$hasColumn) {
            $pdo->exec($alterSql);
        }
    }
}

function getAuthorizationHeader(): string
{
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        return (string)$_SERVER['HTTP_AUTHORIZATION'];
    }

    if (!empty($_SERVER['Authorization'])) {
        return (string)$_SERVER['Authorization'];
    }

    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        foreach ($headers as $name => $value) {
            if (strtolower((string)$name) === 'authorization') {
                return (string)$value;
            }
        }
    }

    return '';
}

function isAuthorized(array $config): bool
{
    $expectedUsername = getConfigValue($config, 'admin_username');
    $expectedPassword = (string)($config['admin_password'] ?? '');

    if ($expectedUsername === '' || $expectedPassword === '') {
        return false;
    }

    if (isset($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])) {
        return $_SERVER['PHP_AUTH_USER'] === $expectedUsername && $_SERVER['PHP_AUTH_PW'] === $expectedPassword;
    }

    $authHeader = getAuthorizationHeader();
    if (!str_starts_with($authHeader, 'Basic ')) {
        return false;
    }

    $encoded = trim(substr($authHeader, 6));
    $decoded = base64_decode($encoded, true);
    if ($decoded === false || !str_contains($decoded, ':')) {
        return false;
    }

    [$username, $password] = explode(':', $decoded, 2);

    return $username === $expectedUsername && $password === $expectedPassword;
}

$method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));

try {
    $pdo = buildPdo($config);
    $tableName = getSafeTableName($config);
    ensureTableExists($pdo, $tableName);
} catch (Throwable $error) {
    jsonResponse(500, ['error' => 'Database connection failed']);
}

if ($method === 'GET') {
    if (!isAuthorized($config)) {
        header('WWW-Authenticate: Basic realm="Admin dashboard"');
        jsonResponse(401, ['error' => 'Unauthorized']);
    }

    try {
        $stmt = $pdo->query("SELECT
            id,
            created_at AS createdAt,
            name,
            phone,
            pickup,
            destination,
            date,
            time,
            passengers,
            suitcases,
            vehicle_type AS vehicleType,
            payment_method AS paymentMethod,
                        total_price AS totalPrice,
                        return_pickup AS returnPickup,
                        return_destination AS returnDestination,
                        return_date AS returnDate,
                        return_time AS returnTime
          FROM {$tableName}
          ORDER BY created_at DESC
          LIMIT 2000");

        $rows = $stmt->fetchAll();
        jsonResponse(200, ['bookings' => $rows]);
    } catch (Throwable $error) {
        jsonResponse(500, ['error' => 'Could not read bookings from database']);
    }
}

if ($method === 'POST') {
    $body = file_get_contents('php://input');
    $payload = json_decode((string)$body, true);

    if (!is_array($payload)) {
        jsonResponse(400, ['error' => 'Invalid JSON body']);
    }

    $requiredFields = ['name', 'phone', 'pickup', 'destination', 'date', 'time'];
    foreach ($requiredFields as $field) {
        if (trim((string)($payload[$field] ?? '')) === '') {
            jsonResponse(400, ['error' => "Missing field: {$field}"]);
        }
    }

    $booking = [
        'name' => trim((string)$payload['name']),
        'phone' => trim((string)$payload['phone']),
        'pickup' => trim((string)$payload['pickup']),
        'destination' => trim((string)$payload['destination']),
        'date' => trim((string)$payload['date']),
        'time' => trim((string)$payload['time']),
        'passengers' => min(4, max(1, (int)($payload['passengers'] ?? 1))),
        'suitcases' => max(0, (int)($payload['suitcases'] ?? 0)),
        'vehicleType' => trim((string)($payload['vehicleType'] ?? '')),
        'paymentMethod' => trim((string)($payload['paymentMethod'] ?? '')),
        'totalPrice' => is_numeric($payload['totalPrice'] ?? null) ? (float)$payload['totalPrice'] : 0,
        'returnPickup' => trim((string)($payload['returnPickup'] ?? '')),
        'returnDestination' => trim((string)($payload['returnDestination'] ?? '')),
        'returnDate' => trim((string)($payload['returnDate'] ?? '')),
        'returnTime' => trim((string)($payload['returnTime'] ?? '')),
    ];

    try {
        $sql = "INSERT INTO {$tableName}
          (
            name,
            phone,
            pickup,
            destination,
            date,
            time,
            passengers,
            suitcases,
            vehicle_type,
            payment_method,
                        total_price,
                        return_pickup,
                        return_destination,
                        return_date,
                        return_time
          )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $booking['name'],
            $booking['phone'],
            $booking['pickup'],
            $booking['destination'],
            $booking['date'],
            $booking['time'],
            $booking['passengers'],
            $booking['suitcases'],
            $booking['vehicleType'],
            $booking['paymentMethod'],
            $booking['totalPrice'],
            $booking['returnPickup'] !== '' ? $booking['returnPickup'] : null,
            $booking['returnDestination'] !== '' ? $booking['returnDestination'] : null,
            $booking['returnDate'] !== '' ? $booking['returnDate'] : null,
            $booking['returnTime'] !== '' ? $booking['returnTime'] : null,
        ]);

        jsonResponse(200, ['ok' => true, 'bookingId' => (int)$pdo->lastInsertId()]);
    } catch (Throwable $error) {
        jsonResponse(500, ['error' => 'Could not save booking to database']);
    }
}

if ($method === 'DELETE') {
    if (!isAuthorized($config)) {
        header('WWW-Authenticate: Basic realm="Admin dashboard"');
        jsonResponse(401, ['error' => 'Unauthorized']);
    }

    $body = file_get_contents('php://input');
    $payload = json_decode((string)$body, true);

    $bookingIdRaw = $payload['id'] ?? ($_GET['id'] ?? null);
    if (!is_numeric($bookingIdRaw)) {
        jsonResponse(400, ['error' => 'Missing or invalid booking id']);
    }

    $bookingId = (int)$bookingIdRaw;
    if ($bookingId <= 0) {
        jsonResponse(400, ['error' => 'Missing or invalid booking id']);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM {$tableName} WHERE id = ? LIMIT 1");
        $stmt->execute([$bookingId]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(404, ['error' => 'Booking not found']);
        }

        jsonResponse(200, ['ok' => true, 'deletedId' => $bookingId]);
    } catch (Throwable $error) {
        jsonResponse(500, ['error' => 'Could not delete booking']);
    }
}

jsonResponse(405, ['error' => 'Method not allowed']);
