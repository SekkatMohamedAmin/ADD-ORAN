# scripts/package-update.ps1 - Creates lightweight update zip (NO db, NO storage uploads)
$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "  Packaging Clean Update for Production Server" -ForegroundColor Cyan
Write-Host "=======================================================`n" -ForegroundColor Cyan

$zipPath = Join-Path $rootDir "update-deploy.zip"

if (-not (Test-Path (Join-Path $rootDir ".next"))) {
    Write-Error "ERROR: .next folder not found! Run 'npm run build' first."
    exit 1
}

if (Test-Path $zipPath) {
    Write-Host "Removing previous update-deploy.zip..." -ForegroundColor Yellow
    Remove-Item -Path $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

$includeFiles = @(
    "server.js",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "prisma.config.ts"
)

$base = (Get-Item .).FullName

Write-Host "Adding production configuration files..." -ForegroundColor Gray
foreach ($f in $includeFiles) {
    if (Test-Path $f) {
        $full = (Get-Item $f).FullName
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $full, $f, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        Write-Host "  + [File] $f" -ForegroundColor Green
    }
}

# Add .next directory
Write-Host "`nAdding .next build..." -ForegroundColor Gray
$nextFiles = Get-ChildItem -Path ".next" -Recurse -File
foreach ($file in $nextFiles) {
    $rel = $file.FullName.Substring($base.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $rel, [System.IO.Compression.CompressionLevel]::Fastest) | Out-Null
}
Write-Host "  + [Dir]  .next ($($nextFiles.Count) files)" -ForegroundColor Green

# Add public directory
Write-Host "`nAdding public assets..." -ForegroundColor Gray
$publicFiles = Get-ChildItem -Path "public" -Recurse -File
foreach ($file in $publicFiles) {
    $rel = $file.FullName.Substring($base.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $rel, [System.IO.Compression.CompressionLevel]::Fastest) | Out-Null
}
Write-Host "  + [Dir]  public ($($publicFiles.Count) files)" -ForegroundColor Green

# Add schema.prisma only (NO database file)
Write-Host "`nAdding schema.prisma (Schema definition only, NO database)..." -ForegroundColor Gray
$schemaFile = Join-Path $rootDir "prisma/schema.prisma"
if (Test-Path $schemaFile) {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $schemaFile, "prisma/schema.prisma", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    Write-Host "  + [File] prisma/schema.prisma" -ForegroundColor Green
}

# Add scripts (migration scripts only)
Write-Host "`nAdding migration helper scripts..." -ForegroundColor Gray
$migrationScript = Join-Path $rootDir "scripts/migrate-server-db.js"
if (Test-Path $migrationScript) {
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $migrationScript, "scripts/migrate-server-db.js", [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    Write-Host "  + [File] scripts/migrate-server-db.js" -ForegroundColor Green
}

$zip.Dispose()
$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "  SUCCESS: Created update-deploy.zip ($sizeMb MB)" -ForegroundColor Green
Write-Host "  Contains: .next, public, schema.prisma, server.js" -ForegroundColor Green
Write-Host "  EXCLUDED: NO database (.db) and NO storage uploads" -ForegroundColor Green
Write-Host "=======================================================`n" -ForegroundColor Cyan

