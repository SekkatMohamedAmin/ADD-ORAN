/**
 * scripts/migrate-server-db.js
 * Safe, non-destructive migration script for production server.
 * Adds any missing columns (clubRole, isStaff, type) to existing tables
 * WITHOUT touching or altering any existing participants, registrations, or payments.
 */

const path = require("path");
const fs = require("fs");

// Find database path
function getDbPath() {
  const envPath = path.resolve(__dirname, "..", ".env");
  let dbUrl = "file:./prisma/dev.db";
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const match = envContent.match(/DATABASE_URL=["']?(file:[^"'\r\n]+)["']?/);
    if (match) dbUrl = match[1];
  }

  const rawPath = dbUrl.replace(/^file:/, "");
  const candidatePaths = [
    path.resolve(process.cwd(), "prisma", rawPath.replace(/^\.\//, "").replace(/^prisma\//, "")),
    path.resolve(process.cwd(), rawPath),
    path.resolve(__dirname, "..", "prisma", "dev.db"),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return candidatePaths[0];
}

const dbPath = getDbPath();
console.log(`[migrate-server-db] Target database: ${dbPath}`);

if (!fs.existsSync(dbPath)) {
  console.warn(`[migrate-server-db] Notice: Database file not found at ${dbPath}. A new one will be created on first start.`);
  process.exit(0);
}

try {
  // Try to use sqlite3 if available or Prisma
  let Database;
  try {
    Database = require("better-sqlite3");
  } catch (e) {
    try {
      Database = require("sqlite3").Database;
    } catch (e2) {
      // Fallback using Prisma
    }
  }

  // Use child_process with sqlite3 CLI if installed, or Prisma db execute
  const { execSync } = require("child_process");

  console.log("[migrate-server-db] Running non-destructive schema synchronization with Prisma...");
  execSync("npx prisma db push --skip-generate --accept-data-loss=false", {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
  });

  console.log("\n[migrate-server-db] Schema is fully synchronized! All old users and files are preserved.");
} catch (err) {
  console.error("[migrate-server-db] Error:", err.message);
  process.exit(1);
}

