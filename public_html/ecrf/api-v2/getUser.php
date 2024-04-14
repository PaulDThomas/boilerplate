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

// Connect to the database
require __DIR__ . "/../php2/Database.php";
$db_connection = new Database();
$conn = $db_connection->dbConnection();

// Get the user information
require __DIR__ . "/../php2/AuthMiddleware.php";
$allHeaders = getallheaders();
$auth = new Auth($conn, $allHeaders);

// Return success or failure
echo json_encode($auth->getUser());

// Close session
session_write_close();
