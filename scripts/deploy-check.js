// scripts/deploy-check.js - Diagnostic & Setup Assistant for Shared Hosting / Production
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

console.log("\n=======================================================");
console.log("  ADD Parkour Oran - Shared Hosting Setup & Diagnostic");
console.log("=======================================================\n");

const rootDir = path.resolve(__dirname, "..");
const prismaDir = path.join(rootDir, "prisma");
const dbPath = path.join(prismaDir, "dev.db");
const uploadsDir = path.join(rootDir, "storage", "uploads");

// 1. Environment Info
console.log("[1/5] Environment Information:");
console.log(`  - OS: ${process.platform} (${process.arch})`);
console.log(`  - Node.js: ${process.version}`);
console.log(`  - Working Directory (CWD): ${process.cwd()}`);
console.log(`  - Project Root: ${rootDir}\n`);

// 2. Check Database File (prisma/dev.db)
console.log("[2/5] Checking Database File (prisma/dev.db):");
if (!fs.existsSync(dbPath)) {
  console.error("  ❌ ERROR: prisma/dev.db was NOT found!");
  console.log("  👉 Solution: Upload your local 'prisma/dev.db' (466 KB) to the 'prisma/' directory on your server.");
  console.log("     Without this file, Prisma creates a blank database with 0 candidates.\n");
} else {
  const stats = fs.statSync(dbPath);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`  ✅ prisma/dev.db exists (Size: ${sizeKb} KB)`);
  if (stats.size < 50000) {
    console.warn(`  ⚠️ Warning: Database file size is only ${sizeKb} KB. If this is a newly created empty file, it will not have your candidates.`);
  }
}

// 3. Check Storage & Uploads Directory
console.log("\n[3/5] Checking Storage & Uploads Directory:");
if (!fs.existsSync(uploadsDir)) {
  console.log("  Creating missing storage/uploads directory...");
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const uploadFiles = fs.readdirSync(uploadsDir).filter((f) => !f.startsWith("."));
console.log(`  ✅ storage/uploads exists (Contains: ${uploadFiles.length} candidate documents/photos)`);
if (uploadFiles.length === 0) {
  console.warn("  ⚠️ Warning: No upload files found in storage/uploads. Be sure to upload your 'storage/uploads' folder so candidate photos/PDFs load.");
}

// 4. Test Prisma Client Generation
console.log("\n[4/5] Checking Prisma Client for OS Engine:");
try {
  console.log("  Running 'npx prisma generate' to ensure native Linux binary is compiled...");
  execSync("npx prisma generate", { stdio: "inherit", cwd: rootDir });
  console.log("  ✅ Prisma Client engine generated successfully for this OS.");
} catch (err) {
  console.error("  ❌ Failed to generate Prisma Client:", err.message);
}

// 5. Query Database Records
console.log("\n[5/5] Querying Database Content:");
try {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  Promise.all([
    prisma.user.count(),
    prisma.participant.count(),
    prisma.registration.count(),
    prisma.document.count(),
    prisma.payment.count(),
    prisma.season.findMany({ select: { code: true, label: true, isActive: true } }),
  ])
    .then(([userCount, participantCount, registrationCount, docCount, payCount, seasons]) => {
      console.log(`  - Utilisateurs / Comptes : ${userCount}`);
      console.log(`  - Adhérents (Participants) : ${participantCount}`);
      console.log(`  - Candidatures (Inscriptions) : ${registrationCount}`);
      console.log(`  - Justificatifs (Documents) : ${docCount}`);
      console.log(`  - Règlements (Paiements) : ${payCount}`);
      console.log(`  - Saisons configurées : ${seasons.map((s) => s.code + (s.isActive ? " (Active)" : "")).join(", ") || "Aucune"}`);

      if (participantCount === 0 || registrationCount === 0) {
        console.warn("\n  ⚠️ ATTENTION : La base de données actuelle contient 0 candidatures !");
        console.warn("  Raisons possibles :");
        console.warn("  1. Vous avez téléversé le code sans écraser 'prisma/dev.db' avec votre base locale réelle.");
        console.warn("  2. Le serveur a généré un nouveau fichier SQLite vide.");
        console.warn("  Pour résoudre :");
        console.warn("  -> Téléversez le fichier 'prisma/dev.db' depuis votre PC vers le dossier 'prisma/' sur le serveur.");
        console.warn("  -> Ou si vous souhaitez initialiser les données démo : exécutez 'npm run db:seed'");
      } else {
        console.log(`\n  🎉 SUCCÈS : Vos données sont bien connectées ! (${registrationCount} candidatures trouvées)`);
      }
      return prisma.$disconnect();
    })
    .catch((err) => {
      console.error("  ❌ Error querying database:", err.message);
    });
} catch (err) {
  console.error("  ❌ Could not load Prisma Client:", err.message);
}
