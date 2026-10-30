# scripts/package.ps1 - Packages production-ready build into inscription.zip
$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "  Packaging ADD Oran for Production Deployment" -ForegroundColor Cyan
Write-Host "=======================================================`n" -ForegroundColor Cyan

$zipPath = Join-Path $rootDir "inscription.zip"

if (-not (Test-Path (Join-Path $rootDir ".next"))) {
    Write-Error "ERROR: .next folder not found! Run 'npm run build' first."
    exit 1
}

if (Test-Path $zipPath) {
    Write-Host "Removing previous inscription.zip..." -ForegroundColor Yellow
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
    ".env",
    "prisma.config.ts"
)

$includeDirs = @(
    ".next",
    "public",
    "src",
    "prisma",
    "storage",
    "scripts"
)

$base = (Get-Item .).FullName

Write-Host "Adding production files..." -ForegroundColor Gray
foreach ($f in $includeFiles) {
    if (Test-Path $f) {
        $full = (Get-Item $f).FullName
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $full, $f, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        Write-Host "  + [File] $f" -ForegroundColor Green
    }
}

Write-Host "`nAdding directories..." -ForegroundColor Gray
foreach ($d in $includeDirs) {
    if (Test-Path $d) {
        $files = Get-ChildItem -Path $d -Recurse -File | Where-Object {
            $_.Extension -notin @('.db', '.db-journal', '.sqlite') -and $_.Name -notmatch '\.tmp'
        }
        foreach ($file in $files) {
            $rel = $file.FullName.Substring($base.Length + 1).Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $rel, [System.IO.Compression.CompressionLevel]::Fastest) | Out-Null
        }
        Write-Host "  + [Dir]  $d ($($files.Count) files)" -ForegroundColor Green
    }
}

$zip.Dispose()
$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "  SUCCESS: Created inscription.zip ($sizeMb MB)" -ForegroundColor Green
Write-Host "=======================================================`n" -ForegroundColor Cyan
