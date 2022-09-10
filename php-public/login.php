<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json; charset=UTF-8');
header(
  'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
);

require __DIR__ . '/../php-classes/Database.php';
require __DIR__ . '/../php-classes/JwtHandler.php';
// Read config file
$config = json_decode(file_get_contents('../secrets/app.info.json'));

function msg($success, $status, $message, $extra = [])
{
  return array_merge(
    [
      'success' => $success,
      'status' => $status,
      'response' => $message,
    ],
    $extra,
  );
}

$db_connection = new Database();
$MYSQLI = $db_connection->dbConnection();

$data = json_decode(file_get_contents('php://input'));
$returnData = [];

// IF REQUEST METHOD IS NOT EQUAL TO POST
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  http_response_code(404);
  exit();
}

// CHECKING EMPTY FIELDS
elseif (
  !isset($data->email) ||
  !isset($data->password) ||
  empty(trim($data->email)) ||
  empty(trim($data->password))
) {
  $fields = ['fields' => ['email', 'password']];
  $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
}
// IF THERE ARE NO EMPTY FIELDS THEN-
else {
  $email = trim($data->email);
  $password = trim($data->password);

  // CHECKING THE EMAIL FORMAT (IF INVALID FORMAT)
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $returnData = msg(0, 422, 'Invalid Email Address!');
  }
  // IF PASSWORD IS LESS THAN 8 THE SHOW THE ERROR
  elseif (strlen($password) < 8) {
    $returnData = msg(0, 422, 'Your password must be at least 8 characters long!');
  }
  // THE USER IS ABLE TO PERFORM THE LOGIN ACTION
  else {
    try {
      $query = "SELECT * FROM `struc_users` WHERE `userEmail`='$email'";
      $result = $MYSQLI->query($query);

      // IF THE USER IS FOUNDED BY EMAIL
      if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        // VERIFYING THE PASSWORD (IS CORRECT OR NOT?)
        // IF PASSWORD IS CORRECT THEN SEND THE LOGIN TOKEN
        if (crypt($password, $row['userPass']) === $row['userPass']) {
          $jwt = new JwtHandler();
          $token = $jwt->jwtEncodeData($config->SiteUrl, ['user_id' => $row['userPK']]);

          $returnData = [
            'success' => 1,
            'response' => 'You have successfully logged in.',
            'token' => $token,
          ];
        }
        // IF INVALID PASSWORD
        else {
          $returnData = msg(0, 422, 'Invalid Password!');
        }
      }
      // IF THE USER IS NOT FOUNDED BY EMAIL THEN SHOW THE FOLLOWING ERROR
      else {
        $returnData = msg(0, 422, 'Invalid Email Address!');
      }
    } catch (mysqli_sql_exception $e) {
      $returnData = msg(0, 500, $e->getMessage());
    }
  }
  echo json_encode($returnData);
}
