const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// 1. Locate schema.prisma
const candidateSchemaPaths = [
  path.resolve(__dirname, '../prisma/schema.prisma'),
  process.env.INIT_CWD ? path.resolve(process.env.INIT_CWD, 'prisma/schema.prisma') : null,
  path.resolve(process.cwd(), 'prisma/schema.prisma'),
  path.resolve(process.cwd(), 'schema.prisma'),
].filter(Boolean);

const foundSchema = candidateSchemaPaths.find((p) => fs.existsSync(p));

if (!foundSchema) {
  console.warn('[generate-prisma] schema.prisma not found in candidate paths:');
  candidateSchemaPaths.forEach((p) => console.warn('  -', p));
  console.warn('[generate-prisma] CWD:', process.cwd());
  // If running during cPanel npm install in nodevenv, exit cleanly without failing npm install
  process.exit(0);
}

console.log(`[generate-prisma] Using schema: ${foundSchema}`);

// 2. Locate Prisma CLI binary or script
const localPrismaCli = path.resolve(__dirname, '../node_modules/prisma/build/index.js');

try {
  if (fs.existsSync(localPrismaCli)) {
    execSync(`node "${localPrismaCli}" generate --schema="${foundSchema}"`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'), // Run with CWD set to project root
    });
  } else {
    execSync(`npx --yes prisma@6 generate --schema="${foundSchema}"`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    });
  }
} catch (error) {
  console.warn('[generate-prisma] Warning: Prisma generation encountered an issue:', error.message);
  // Don't fail the entire npm install if running from an unusual cPanel lifecycle hook
  if (process.env.npm_lifecycle_event === 'postinstall') {
    console.warn('[generate-prisma] Continuing install. You can run "npx prisma generate" from the project root afterward.');
    process.exit(0);
  }
  process.exit(1);
}
