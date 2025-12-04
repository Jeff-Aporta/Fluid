node "$PSScriptRoot\build.js"
if ($?) {
    Write-Host "Build successful! Open index.html to test." -ForegroundColor Green
} else {
    Write-Host "Build failed." -ForegroundColor Red
}
