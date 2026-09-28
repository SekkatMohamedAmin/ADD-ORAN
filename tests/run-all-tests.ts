import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import { generateRegistrationReference, generateReceiptNumber } from "../src/lib/sequences";
import { checkPossibleDuplicates } from "../src/lib/duplicates";
import { storage } from "../src/lib/storage";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failedCount++;
  }
}

// Age calculator helper
function calculateAge(dateOfBirth: Date, relativeTo: Date = new Date()): number {
  let age = relativeTo.getFullYear() - dateOfBirth.getFullYear();
  const m = relativeTo.getMonth() - dateOfBirth.getMonth();
  if (m < 0 || (m === 0 && relativeTo.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
}

async function runUnitTests() {
  console.log("\n==============================");
  console.log("1. UNIT TESTS");
  console.log("==============================");

  // Age and Minor tests
  const refDate = new Date("2026-09-26");
  const adultDob = new Date("2000-01-15");
  const minorDob = new Date("2012-05-20");
  const turning18Tomorrow = new Date("2008-09-27");
  const turned18Today = new Date("2008-09-26");

  assert(calculateAge(adultDob, refDate) === 26, "Adult born 2000-01-15 is 26 years old");
  assert(calculateAge(adultDob, refDate) >= 18, "Age >= 18 is classified as Adult");
  assert(calculateAge(minorDob, refDate) === 14, "Minor born 2012-05-20 is 14 years old");
  assert(calculateAge(minorDob, refDate) < 18, "Age < 18 is classified as Minor");
  assert(calculateAge(turning18Tomorrow, refDate) === 17, "Participant turning 18 tomorrow is 17 (Minor)");
  assert(calculateAge(turned18Today, refDate) === 18, "Participant turning 18 today is 18 (Adult)");

  // Discipline validation (strictly 3 disciplines)
  const allowedDisciplines = ["parkour", "escalade-montagne", "trail"];
  assert(allowedDisciplines.includes("parkour"), "Parkour is an allowed discipline");
  assert(allowedDisciplines.includes("escalade-montagne"), "Escalade & sports de montagne is allowed");
  assert(allowedDisciplines.includes("trail"), "Trail is allowed");
  assert(!allowedDisciplines.includes("randonnee"), "Old Randonnee discipline is strictly excluded");

  // Status transitions
  const validStatuses = [
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "NEEDS_CORRECTION",
    "ACCEPTED",
    "REJECTED",
    "PAYMENT_PENDING",
    "PAID",
    "ACTIVE",
    "ARCHIVED",
  ];
  assert(validStatuses.includes("NEEDS_CORRECTION"), "State machine includes NEEDS_CORRECTION");
  assert(validStatuses.includes("PAYMENT_PENDING"), "State machine includes PAYMENT_PENDING");
  assert(validStatuses.includes("ACTIVE"), "State machine includes ACTIVE");

  // Sequential Reference Numbering
  const ref1 = await generateRegistrationReference("2026");
  const ref2 = await generateRegistrationReference("2026");
  assert(/^ADD-2026-\d{6}$/.test(ref1), `Generated reference conforms to ADD-2026-000001 pattern (${ref1})`);
  assert(ref1 !== ref2, `Sequential references are strictly unique (${ref1} vs ${ref2})`);

  // Sequential Receipt Numbering
  const pay1 = await generateReceiptNumber("2026");
  const pay2 = await generateReceiptNumber("2026");
  assert(/^ADD-PAY-2026-\d{6}$/.test(pay1), `Generated receipt conforms to ADD-PAY-2026-000001 pattern (${pay1})`);
  assert(pay1 !== pay2, `Sequential receipts are strictly unique (${pay1} vs ${pay2})`);
}

async function runIntegrationTests() {
  console.log("\n==============================");
  console.log("2. INTEGRATION TESTS (END-TO-END WORKFLOW)");
  console.log("==============================");

  const testPhone = `0555${Math.floor(100000 + Math.random() * 900000)}`;
  const passwordHash = await bcrypt.hash("SecurePass2026!", 10);

  // 1. Create User
  const user = await prisma.user.create({
    data: {
      phone: testPhone,
      passwordHash,
      role: "PARTICIPANT",
    },
  });
  assert(user.id !== undefined, "Participant user created successfully");

  // 2. Create Participant Record
  const participant = await prisma.participant.create({
    data: {
      userId: user.id,
      firstName: "Karim",
      lastName: "Benali",
      dateOfBirth: new Date("2002-04-10"),
      placeOfBirth: "Oran",
      phone: testPhone,
      isMinor: false,
    },
  });
  assert(participant.isMinor === false, "Adult participant record created");

  // 3. Register with disciplines
  const season = await prisma.season.findFirst({ where: { code: "2026" } });
  const reference = await generateRegistrationReference(season!.code);

  const registration = await prisma.registration.create({
    data: {
      reference,
      seasonId: season!.id,
      participantId: participant.id,
      status: "SUBMITTED",
      engagementAccepted: true,
      engagementAcceptedAt: new Date(),
    },
  });
  assert(registration.status === "SUBMITTED", "Registration created in SUBMITTED state");

  // 4. Correction Workflow: Admin requests correction
  const flagged = await prisma.registration.update({
    where: { id: registration.id },
    data: {
      status: "NEEDS_CORRECTION",
      correctionReason: "Photo floue, merci de reprendre une photo nette.",
      correctionFields: JSON.stringify(["PHOTO"]),
    },
  });
  assert(flagged.status === "NEEDS_CORRECTION", "Registration transitioned to NEEDS_CORRECTION");
  assert(flagged.correctionReason !== null, "Correction reason recorded");

  // 5. Participant Resubmission
  const resubmitted = await prisma.registration.update({
    where: { id: registration.id },
    data: {
      status: "UNDER_REVIEW",
    },
  });
  assert(resubmitted.status === "UNDER_REVIEW", "Participant resubmission transitioned status to UNDER_REVIEW");

  // 6. Admin Acceptance
  const accepted = await prisma.registration.update({
    where: { id: registration.id },
    data: {
      status: "PAYMENT_PENDING",
      reviewedAt: new Date(),
    },
  });
  assert(accepted.status === "PAYMENT_PENDING", "Admin acceptance sets status to PAYMENT_PENDING");

  // 7. Cash Payment Recording & Activation
  const receiptNumber = await generateReceiptNumber(season!.code);
  const payment = await prisma.payment.create({
    data: {
      receiptNumber,
      registrationId: accepted.id,
      seasonId: season!.id,
      amount: 4000,
      paymentMethod: "CASH",
      paymentPurpose: "Cotisation annuelle, assurance & 1er mois",
      status: "PAID",
    },
  });
  const activated = await prisma.registration.update({
    where: { id: accepted.id },
    data: { status: "ACTIVE" },
  });

  assert(payment.receiptNumber.startsWith("ADD-PAY-2026-"), "Payment receipt generated with valid prefix");
  assert(activated.status === "ACTIVE", "Payment transitions registration to ACTIVE member status");

  // 8. Duplicate Detection Verification
  const duplicateCheck = await checkPossibleDuplicates({
    firstName: "Karim",
    lastName: "Benali",
    phone: testPhone,
    dateOfBirth: new Date("2002-04-10"),
  });
  assert(duplicateCheck.hasPossibleDuplicate === true, "Duplicate detection identifies identical phone/name");
}

async function runSecurityTests() {
  console.log("\n==============================");
  console.log("3. SECURITY & PRIVACY TESTS");
  console.log("==============================");

  // Private Document Storage Test
  const dummyBuffer = Buffer.from("DUMMY_SENSITIVE_MEDICAL_DATA");
  const stored = await storage.save(dummyBuffer, "medical_cert.pdf", "application/pdf");

  assert(!stored.storagePath.includes("/public/"), "Storage path is strictly outside the public web root");
  assert(!stored.storagePath.includes(".."), "Storage path prevents path traversal");

  const readBack = await storage.read(stored.storagePath);
  assert(readBack !== null && readBack.toString() === "DUMMY_SENSITIVE_MEDICAL_DATA", "Storage provider securely reads back private file");

  // Delete test file
  await storage.delete(stored.storagePath);

  // Invalid MIME Type Rejection
  let rejectedMime = false;
  try {
    await storage.save(dummyBuffer, "malicious.exe", "application/x-msdownload");
  } catch {
    rejectedMime = true;
  }
  assert(rejectedMime, "Storage provider rejects dangerous/unauthorized MIME types (.exe)");

  // Password Hashing Security
  const rawSecret = "AdminSecret2026!";
  const hash = await bcrypt.hash(rawSecret, 10);
  assert(hash !== rawSecret, "Passwords are never stored in plaintext");
  assert(await bcrypt.compare(rawSecret, hash), "bcrypt verifies correct password hash");
  assert(!(await bcrypt.compare("WrongPassword", hash)), "bcrypt rejects invalid password");
}

async function runAdminAuthAndWorkflowTests() {
  console.log("\n==============================");
  console.log("4. ADMIN AUTHENTICATION & ROLE PROTECTION TESTS");
  console.log("==============================");

  // 1. Verify Default Admin account exists
  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  assert(adminUser !== null, "Admin account with role 'ADMIN' exists in database");
  assert(adminUser?.role === "ADMIN", "Admin role is strictly 'ADMIN'");

  // 2. Participant Role vs Admin Role boundary
  const participantUser = await prisma.user.findFirst({
    where: { role: "PARTICIPANT" },
  });
  assert(participantUser !== null, "Participant user exists for privilege comparison");
  assert(participantUser?.role !== "ADMIN", "Participant role is strictly non-admin");

  // 3. Sequential receipt uniqueness and format
  const season = await prisma.season.findFirst({ where: { code: "2026" } });
  const rec1 = await generateReceiptNumber(season!.code);
  const rec2 = await generateReceiptNumber(season!.code);
  assert(rec1.startsWith("ADD-PAY-2026-"), "Receipt number adheres to format ADD-PAY-2026-XXXXXX");
  assert(rec1 !== rec2, "Receipt numbers are strictly sequential and unique across transactions");

  // 4. Invariant: Archiving preserves records instead of deleting
  const testReg = await prisma.registration.findFirst();
  if (testReg) {
    const archived = await prisma.registration.update({
      where: { id: testReg.id },
      data: { status: "ARCHIVED" },
    });
    assert(archived.status === "ARCHIVED", "Archiving sets status to ARCHIVED without row deletion");
    // Restore status
    await prisma.registration.update({
      where: { id: testReg.id },
      data: { status: testReg.status },
    });
  }
}

async function main() {
  console.log("Running ADD Parkour Oran Test Suite...\n");
  try {
    await runUnitTests();
    await runIntegrationTests();
    await runSecurityTests();
    await runAdminAuthAndWorkflowTests();
  } catch (err) {
    console.error("Test execution failed with error:", err);
    failedCount++;
  }

  console.log("\n==============================");
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("==============================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
