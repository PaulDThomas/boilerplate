<?php
require __DIR__ . '/JwtHandler.php';

class Auth extends JwtHandler
{
  protected $db;
  protected $headers;
  protected $token;

  public function __construct($db, $headers)
  {
    parent::__construct();
    $this->db = $db;
    $this->headers = $headers;
  }

  public function getUser()
  {
    if (
      array_key_exists('Authorization', $this->headers) &&
      preg_match('/Bearer\s(\S+)/', $this->headers['Authorization'], $matches)
    ) {
      $data = $this->jwtDecodeData($matches[1]);

      if (isset($data->user_id)):
        $user = $this->fetchUser($data->user_id);
        return [
          'success' => true,
          'user' => $user,
        ];
      else:
        return [
          'success' => false,
          'response' => $data['message'],
        ];
      endif;
    } else {
      return [
        'success' => false,
        'response' => 'Token not found in request',
      ];
    }
  }

  protected function fetchUser($user_id)
  {
    try {
      $query = "SELECT `userPK`, `userEmail`, `userFirstName`, `userLastName` FROM `struc_users` WHERE `userPk`=$user_id";
      $result = $this->db->query($query);

      if ($result->num_rows) {
        return $result->fetch_assoc();
      } else {
        return false;
      }
    } catch (mysqli_sql_exception $e) {
      return null;
    }
  }
}
