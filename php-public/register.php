<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: OPTIONS, POST');
header('Content-Type: application/json; charset=UTF-8');
header(
  'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
);

// Check method
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit();
} elseif ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(404);
  exit();
}

require __DIR__ . '/../php-classes/Database.php';
$db_connection = new Database();
$MYSQLI = $db_connection->dbConnection();

function msg($success, $status, $message, $extra = [])
{
  http_response_code($status);
  return array_merge(
    [
      'success' => $success,
      'status' => $status,
      'response' => $message,
    ],
    $extra,
  );
}

// Read data
$data = json_decode(file_get_contents('php://input'));
$returnData = [];

// Check fields
if (
  !isset($data->first_name) ||
  !isset($data->last_name) ||
  !isset($data->email) ||
  !isset($data->password) ||
  empty(trim($data->first_name)) ||
  empty(trim($data->last_name)) ||
  empty(trim($data->email)) ||
  empty(trim($data->password))
) {
  $fields = ['fields' => ['first_name', 'last_name', 'email', 'password']];
  $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
}
// Enough data has been received
else {
  $first_name = trim($data->first_name);
  $last_name = trim($data->last_name);
  $first_name = trim($data->first_name);
  $last_name = trim($data->last_name);
  $email = trim($data->email);
  $password = trim($data->password);
  // Check input data
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $returnData = msg(0, 422, 'Invalid Email Address!');
  } elseif (strlen($password) < 8) {
    $returnData = msg(0, 422, 'Your password must be at least 8 characters long!');
  } elseif (strlen($first_name) < 3 || strlen($last_name) < 3) {
    $returnData = msg(0, 422, 'Your names must be at least 3 characters long!');
  }
  // Check database
  else {
    try {
      // Query for email already exists
      $query = "SELECT `userEmail` FROM `struc_users` WHERE `userEmail`='$email'";
      $result = $MYSQLI->query($query);

      // Email found
      if ($result->num_rows) {
        $returnData = msg(0, 422, 'This E-mail already in use!');
      }
      // Add new user
      else {
        $salt = strtr(base64_encode(random_bytes(16)), '+', '.');
        $salt = sprintf("$2a$%02d$", 11) . $salt;
        $c_pass = crypt($password, $salt);
        $insert_query = "INSERT INTO `struc_users` (`userFirstName`,`userLastName`,`userEmail`,`userPass`) VALUES ('$first_name', '$last_name', '$email', '$c_pass')";
        $MYSQLI->query($insert_query);
        $returnData = msg(1, 201, 'You have successfully registered.');
      }
    } catch (mysqli_sql_exception $e) {
      $returnData = msg(0, 500, $e->getMessage());
    }
  }
}

echo json_encode($returnData);
