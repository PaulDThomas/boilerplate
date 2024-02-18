<?php
session_start();

require __DIR__ . "/JwtHandler.php";

class Auth extends JwtHandler
{
  protected $db;
  protected $headers;
  protected $token;
  protected $config;

  public function __construct($db, $headers)
  {
    parent::__construct();
    $this->db = $db;
    $this->headers = $headers;
    // Read config file
    $this->config = json_decode(file_get_contents(__DIR__ . "/../secrets/app.info.json"));
  }

  public function getUser()
  {
    if (isset($_SESSION["userno"]) && $_SESSION["userno"] > 0) {
      $user = $this->fetchUser($_SESSION["userno"]);
      return [
        "success" => true,
        "user" => $user,
      ];
    }
    if (
      array_key_exists("Authorization", $this->headers) &&
      preg_match("/Bearer\s(\S+)/", $this->headers["Authorization"], $matches)
    ) {
      $data = $this->jwtDecodeData($matches[1]);

      if (isset($data->user_id)) {
        $user = $this->fetchUser($data->user_id);
        return [
          "success" => true,
          "user" => $user,
        ];
      } else {
        return [
          "success" => false,
          "response" => $data,
        ];
      }
    } else {
      return [
        "success" => false,
        "response" => "Token not found in request",
      ];
    }
  }

  protected function fetchUser($user_id)
  {
    try {
      $query = <<<QRY
      SELECT
        su.userPK,
        userEmail,
        userFirstName,
        userLastName,
        access_type
      FROM
        struc_users su,
        ecrf_study_access sa
      WHERE
       su.userPK="$user_id"
       and su.userPk = sa.userPK
       and sa.ideCRF_study = {$this->config->StudyNo}
      ;
      QRY;
      $result = $this->db->query($query);

      if ($result->num_rows) {
        $row = $result->fetch_assoc();
        $_SESSION["userPK"] = $row["userPK"];
        $_SESSION["userEmail"] = $row["userEmail"];
        $_SESSION["userFirstName"] = $row["userFirstName"];
        $_SESSION["userLastName"] = $row["userLastName"];
        $_SESSION["userDisplayName"] = "{$row["userFirstName"]} {$row["userLastName"]}";
        $_SESSION["accessType"] = "{$row["access_type"]}";
        return $row;
      } else {
        $_SESSION["userPK"] = null;
        $_SESSION["userEmail"] = "";
        $_SESSION["userFirstName"] = "";
        $_SESSION["userLastName"] = "";
        $_SESSION["userDisplayName"] = "Log in failed";
        $_SESSION["accessType"] = "";
        return false;
      }
    } catch (mysqli_sql_exception $e) {
      return null;
    }
  }
}
