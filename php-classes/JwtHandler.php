<?php

/** File copied/slightly updated from
 *  https://www.w3jar.com/how-to-implement-the-jwt-with-php/
 * and
 *  https://www.w3jar.com/php-login-and-registration-restful-api/
 */

require "../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHandler
{
  protected $jwt_secrect;
  protected $token;
  protected $issuedAt;
  protected $expire;
  protected $jwt;
  protected $key;
  protected $payload;

  public function __construct()
  {
    // Read config file
    $config = json_decode(file_get_contents("../secrets/app.info.json"));

    // set your default time-zone
    //date_default_timezone_set('Europe/London');
    $this->issuedAt = time();

    // Token Validity (3600 second = 1hr)
    $this->expire = $this->issuedAt + 86400;

    // Set your secret or signature
    $this->key = $config->Secret;
  }

  public function jwtEncodeData($iss, $data)
  {
    $this->payload = [
      //Adding the identifier to the token (who issue the token)
      "iss" => $iss,
      "aud" => $iss,
      // Adding the current timestamp to the token, for identifying that when the token was issued.
      "iat" => $this->issuedAt,
      // Token expiration
      "exp" => $this->expire,
      // Data
      "data" => $data,
    ];

    $this->jwt = JWT::encode($this->payload, $this->key, "HS256");
    return $this->jwt;
  }

  public function jwtDecodeData($jwt_token)
  {
    try {
      $decode = JWT::decode($jwt_token, new Key($this->key, "HS256"));
      return $decode->data;
    } catch (Exception $e) {
      return $e->getMessage();
    }
  }
}
