$currentDirectory = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
$distPath = Join-Path $currentDirectory "public_html"
$distSite = Join-Path $distPath "ecrf/target"
$targetPath = Join-Path $currentDirectory "../asupcouk"
$targetSite = Join-Path $targetPath "/public_html/ecrf/target"

# Delete previous build
if (Test-Path ($distSite)) {
  Get-ChildItem -Path $distSite -Exclude ".htaccess", ".gitignore" -Recurse | Remove-Item -Force
}
# Delet previous build at target
if (Test-Path ($targetSite)) {
  Remove-Item -Path $targetSite -Recurse -Force
}

# Build the site
npm run build

# Copy the site to the target path
Copy-Item -Path $distPath -Destination $targetPath -Recurse -Force
