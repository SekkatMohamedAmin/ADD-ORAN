// scripts/package-update.js - Invokes PowerShell update packaging script
const path = require("path");
const { execSync } = require("child_process");

const scriptPath = path.join(__dirname, "package-update.ps1");
try {
  execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`, {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
  });
} catch (err) {
  process.exit(err.status || 1);
}
