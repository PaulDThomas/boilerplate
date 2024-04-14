<?php
class Database
{
  public function dbConnection()
  {
    // Read config file
    $config = json_decode(file_get_contents(__DIR__ . "/app.info.json"));

    // Make connection
    $MYSQLI = new mysqli(
      $config->Database->Host,
      $config->Database->Username,
      $config->Database->Pass,
      $config->Database->Name,
    );

    if (mysqli_connect_errno()) {
      printf("Connect failed: %s", mysqli_connect_error());
      exit();
    }

    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

    return $MYSQLI;
  }
}
