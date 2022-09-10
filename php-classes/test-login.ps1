## Test register/login process, assuming that PHP web server is running
$site = "http://localhost:8001/"
# Set uid, email
$testPerson = @{
  "email" = "test_user@asup.co.uk"
  "password" = "test-password" 
  "first_name" = "Test"
  "last_name" = "User"
} | ConvertTo-Json

mysql -u root asupcouk_asup -e "Delete from struc_users where userEmail like 'test%'"

# Register
Write-Output (Invoke-WebRequest -Uri "$site/register.php" -Method Post -Body $testPerson).Content

# curl, read token
$login = (Invoke-WebRequest -Uri "$site/login.php" -Method Post -Body $testPerson).Content
Write-Output "Login received: " $login
$token = ($login | ConvertFrom-Json).token

$headers = @{ 
  "Authorization" = "Bearer $token" 
}
Write-Output $headers

# Check it is fine
Write-Output "Get user: "
Write-Output (Invoke-WebRequest -Uri "$site/getUser.php" -Headers $headers -Method Get).Content