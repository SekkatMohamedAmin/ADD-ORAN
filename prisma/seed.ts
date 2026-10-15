import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Seasons
  const season2026 = await prisma.season.upsert({
    where: { code: "2026" },
    update: { isActive: true },
    create: {
      code: "2026",
      label: "Saison 2025/2026",
      isActive: true,
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-08-31"),
    },
  });

  console.log(`Season ready: ${season2026.label} (${season2026.code})`);

  // 2. The 3 Official Disciplines (strict requirement: Parkour, Escalade & sports de montagne, Trail)
  const disciplinesData = [
    {
      slug: "parkour",
      nameFr: "Parkour",
      nameAr: "باركور",
      nameEn: "Parkour",
      descriptionFr: "L'art du déplacement en milieu urbain et naturel — fluidité, franchissement d'obstacles, maîtrise corporelle et mentale.",
      descriptionAr: "فن الانتقال في البيئة الحضرية والطبيعية — سلاسة، تخطي الحواجز، وتحكم بدني وذهني متكامل.",
      descriptionEn: "The art of displacement in urban and natural terrains — agility, obstacle overcoming, mental and physical mastery.",
    },
    {
      slug: "escalade-montagne",
      nameFr: "Escalade & sports de montagne",
      nameAr: "التسلق ورياضات الجبال",
      nameEn: "Climbing & Mountain Sports",
      descriptionFr: "Techniques de grimpe, bloc, voie, sécurité et exploration des espaces naturels et falaises.",
      descriptionAr: "تقنيات التسلق، المسارات، السلامة الميدانية واستكشاف الفضاءات الطبيعية والجبلية.",
      descriptionEn: "Rock climbing, bouldering, vertical rope safety, and mountain terrain navigation.",
    },
    {
      slug: "trail",
      nameFr: "Trail",
      nameAr: "تريل / ركض المسارات",
      nameEn: "Trail Running",
      descriptionFr: "Course à pied en pleine nature et dénivelé, endurance tout terrain et dépassement de soi.",
      descriptionAr: "ركض المسارات الطبيعية والمنحدرات، قوة التحمل في التضاريس الوعرة وتحدي الذات.",
      descriptionEn: "Off-road and wilderness running, elevation mastery, endurance and self-transcendence.",
    },
  ];

  for (const disc of disciplinesData) {
    await prisma.discipline.upsert({
      where: { slug: disc.slug },
      update: disc,
      create: disc,
    });
  }
  console.log("The 3 official disciplines seeded successfully.");

  // 3. Admin Account
  const adminPhone = "0555000000";
  const adminPasswordHash = await bcrypt.hash("AdminPassword2026!", 10);

  const adminUser = await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      phone: adminPhone,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log(`Admin user seeded: Phone ${adminPhone} (Role: ${adminUser.role})`);

  // 4. Initialize Sequential Counters
  await prisma.sequentialCounter.upsert({
    where: { key: "REG_2026" },
    update: {},
    create: { key: "REG_2026", lastValue: 0 },
  });

  await prisma.sequentialCounter.upsert({
    where: { key: "PAY_2026" },
    update: {},
    create: { key: "PAY_2026", lastValue: 0 },
  });

  console.log("Sequential counters initialized.");

  // 5. Official Club Upcoming Events
  const eventsData = [
    {
      id: "event-jam-front-de-mer-2026",
      title: "Parkour Jam & Gathering — Front de Mer",
      description: "Session intensive de franchissements urbains, fluidité sur modules et partage inter-générationnel sur le front de mer d'Oran.",
      discipline: "parkour",
      category: "ALL",
      date: new Date("2026-10-24T15:00:00Z"),
      location: "Esplanade des Sablettes, Front de Mer, Oran",
      capacity: 50,
      isPublished: true,
    },
    {
      id: "event-escalade-kristel-2026",
      title: "Sortie Falaise Naturelle & Escalade Bloc Kristel",
      description: "Grimpe sur roche calcaire naturelle, travail de lecture des voies, placement des appuis et assurage encadré par les moniteurs.",
      discipline: "escalade-montagne",
      category: "ALL",
      date: new Date("2026-11-07T09:00:00Z"),
      location: "Site Naturel de Kristel / Falaises de Murdjadjo, Oran",
      capacity: 30,
      isPublished: true,
    },
    {
      id: "event-trail-santa-cruz-2026",
      title: "Session Trail & Conditionnement Forêt des Planteurs",
      description: "Entraînement outdoor de dénivelé, travail des appuis en descente technique et respiration en côte sur les hauteurs de Santa Cruz.",
      discipline: "trail",
      category: "ALL",
      date: new Date("2026-11-14T08:30:00Z"),
      location: "Forêt des Planteurs & Sentiers de Santa Cruz, Oran",
      capacity: 40,
      isPublished: true,
    },
  ];

  for (const ev of eventsData) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: ev,
      create: ev,
    });
  }
  console.log("Official upcoming events seeded.");

  // 6. Demo Family Parent Account with 2 Children
  const parentPhone = "0555123456";
  const parentPasswordHash = await bcrypt.hash("ParentPassword2026!", 10);
  const parentUser = await prisma.user.upsert({
    where: { phone: parentPhone },
    update: { passwordHash: parentPasswordHash, role: "PARTICIPANT" },
    create: { phone: parentPhone, passwordHash: parentPasswordHash, role: "PARTICIPANT" },
  });

  // Child 1: Yassine Benali (ACTIVE, Has Card, Paid)
  let yassine = await prisma.participant.findFirst({
    where: { userId: parentUser.id, firstName: "Yassine" },
  });
  if (!yassine) {
    yassine = await prisma.participant.create({
      data: {
        userId: parentUser.id,
        firstName: "Yassine",
        lastName: "Benali",
        dateOfBirth: new Date("2012-05-14"),
        placeOfBirth: "Oran",
        phone: parentPhone,
        bloodType: "O+",
        isMinor: true,
        membershipCardNumber: "ADD-CARD-2026-0001",
      },
    });
  }

  // Registration for Yassine
  let yassineReg = await prisma.registration.findFirst({
    where: { participantId: yassine.id, seasonId: season2026.id },
  });
  if (!yassineReg) {
    yassineReg = await prisma.registration.create({
      data: {
        participantId: yassine.id,
        seasonId: season2026.id,
        reference: "ADD-2026-000001",
        status: "ACTIVE",
      },
    });

    const parkourDisc = await prisma.discipline.findUnique({ where: { slug: "parkour" } });
    if (parkourDisc) {
      await prisma.registrationDiscipline.create({
        data: { registrationId: yassineReg.id, disciplineId: parkourDisc.id },
      });
    }

    // Documents for Yassine
    await prisma.document.createMany({
      data: [
        {
          registrationId: yassineReg.id,
          participantId: yassine.id,
          type: "PHOTO",
          originalFilename: "photo_identite_yassine.jpg",
          storagePath: "demo_photo_yassine.jpg",
          mimeType: "image/jpeg",
          fileSize: 45000,
          status: "VERIFIED",
        },
        {
          registrationId: yassineReg.id,
          participantId: yassine.id,
          type: "MEDICAL_CERTIFICATE",
          originalFilename: "certificat_medical_yassine.pdf",
          storagePath: "demo_medical_yassine.pdf",
          mimeType: "application/pdf",
          fileSize: 120000,
          status: "VERIFIED",
        },
        {
          registrationId: yassineReg.id,
          participantId: yassine.id,
          type: "NATIONAL_ID",
          originalFilename: "cni_tuteur_benali.jpg",
          storagePath: "demo_cni_benali.jpg",
          mimeType: "image/jpeg",
          fileSize: 85000,
          status: "VERIFIED",
        },
        {
          registrationId: yassineReg.id,
          participantId: yassine.id,
          type: "PARENTAL_AUTHORIZATION",
          originalFilename: "autorisation_parentale_signee.pdf",
          storagePath: "demo_auto_yassine.pdf",
          mimeType: "application/pdf",
          fileSize: 95000,
          status: "VERIFIED",
        },
      ],
    });

    // Payment for Yassine
    await prisma.payment.create({
      data: {
        registrationId: yassineReg.id,
        receiptNumber: "ADD-PAY-2026-000001",
        amount: 3000,
        paymentMethod: "CASH",
        paymentPurpose: "Cotisation annuelle + Assurance",
        status: "PAID",
      },
    });
  }

  // Child 2: Aya Benali (NEEDS_CORRECTION with flagged file)
  let aya = await prisma.participant.findFirst({
    where: { userId: parentUser.id, firstName: "Aya" },
  });
  if (!aya) {
    aya = await prisma.participant.create({
      data: {
        userId: parentUser.id,
        firstName: "Aya",
        lastName: "Benali",
        dateOfBirth: new Date("2017-09-22"),
        placeOfBirth: "Oran",
        phone: parentPhone,
        bloodType: "A+",
        isMinor: true,
      },
    });
  }

  let ayaReg = await prisma.registration.findFirst({
    where: { participantId: aya.id, seasonId: season2026.id },
  });
  if (!ayaReg) {
    ayaReg = await prisma.registration.create({
      data: {
        participantId: aya.id,
        seasonId: season2026.id,
        reference: "ADD-2026-000002",
        status: "NEEDS_CORRECTION",
        correctionReason: "Le certificat médical fourni est incomplet : il manque le cachet du médecin et la mention explicite d'aptitude à la pratique du Parkour.",
        correctionFields: "medicalCertificate",
      },
    });

    const parkourDisc = await prisma.discipline.findUnique({ where: { slug: "parkour" } });
    if (parkourDisc) {
      await prisma.registrationDiscipline.create({
        data: { registrationId: ayaReg.id, disciplineId: parkourDisc.id },
      });
    }

    // Documents for Aya
    await prisma.document.createMany({
      data: [
        {
          registrationId: ayaReg.id,
          participantId: aya.id,
          type: "PHOTO",
          originalFilename: "photo_identite_aya.jpg",
          storagePath: "demo_photo_aya.jpg",
          mimeType: "image/jpeg",
          fileSize: 42000,
          status: "VERIFIED",
        },
        {
          registrationId: ayaReg.id,
          participantId: aya.id,
          type: "MEDICAL_CERTIFICATE",
          originalFilename: "certificat_medical_non_conforme.pdf",
          storagePath: "demo_medical_aya.pdf",
          mimeType: "application/pdf",
          fileSize: 110000,
          status: "REJECTED",
          rejectionReason: "Manque cachet du médecin",
        },
      ],
    });
  }

  console.log(`Demo Family Account seeded: Phone ${parentPhone} (Password: ParentPassword2026!) with 2 children (Yassine & Aya)`);
  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
