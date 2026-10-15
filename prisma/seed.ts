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
