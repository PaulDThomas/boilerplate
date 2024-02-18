<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: OPTIONS, GET");
header("Content-Type: application/json; charset=UTF-8");
header(
  "Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
);

// Check method
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  exit();
} elseif ($_SERVER["REQUEST_METHOD"] !== "GET") {
  http_response_code(404);
  exit();
}

require __DIR__ . "/../php-classes/Database.php";
require __DIR__ . "/../php-classes/AuthMiddleware.php";

$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$auth = new Auth($conn, $allHeaders);

echo json_encode($auth->getUser());
