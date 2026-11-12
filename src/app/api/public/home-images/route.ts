import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface DisciplineImageItem {
  src: string;
  alt: string;
}

export interface HomeDisciplineImagesResponse {
  parkour: DisciplineImageItem[];
  climbing: DisciplineImageItem[];
  trail: DisciplineImageItem[];
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const homePageDir = path.join(publicDir, "images", "homePage");

    const imageRegex = /\.(jpg|jpeg|png|webp|avif)$/i;

    const readDirSafe = (dirPath: string): string[] => {
      if (!fs.existsSync(dirPath)) return [];
      try {
        return fs.readdirSync(dirPath).filter((f) => {
          const fullPath = path.join(dirPath, f);
          return fs.statSync(fullPath).isFile() && imageRegex.test(f);
        });
      } catch {
        return [];
      }
    };

    // Subfolders
    const parkourFiles = readDirSafe(path.join(homePageDir, "parkour"));
    const climbingFiles = [
      ...readDirSafe(path.join(homePageDir, "climbing")),
      ...readDirSafe(path.join(homePageDir, "escalade")),
    ];
    const trailFiles = [
      ...readDirSafe(path.join(homePageDir, "trail")),
      ...readDirSafe(path.join(homePageDir, "running")),
    ];

    // Root homePage folder files
    const rootFiles = readDirSafe(homePageDir);

    // Parkour images: parkour subfolder + root files + default poster
    const parkourImages: DisciplineImageItem[] = [
      {
        src: "/images/disciplines/discipline-parkour.jpg",
        alt: "ADD Parkour Oran - Art du Déplacement",
      },
    ];

    for (const f of rootFiles) {
      parkourImages.push({
        src: `/images/homePage/${f}`,
        alt: "ADD Parkour Oran entraînement",
      });
    }

    for (const f of parkourFiles) {
      parkourImages.push({
        src: `/images/homePage/parkour/${f}`,
        alt: "ADD Parkour Oran Parkour",
      });
    }

    // Climbing images
    const climbingImages: DisciplineImageItem[] = [
      {
        src: "/images/disciplines/discipline-climbing.jpg",
        alt: "ADD Parkour Oran - Escalade et Bloc",
      },
    ];
    for (const f of climbingFiles) {
      const sub = fs.existsSync(path.join(homePageDir, "climbing", f)) ? "climbing" : "escalade";
      climbingImages.push({
        src: `/images/homePage/${sub}/${f}`,
        alt: "ADD Parkour Oran Escalade",
      });
    }

    // Trail images
    const trailImages: DisciplineImageItem[] = [
      {
        src: "/images/disciplines/discipline-trail.jpg",
        alt: "ADD Parkour Oran - Trail et Nature",
      },
    ];
    for (const f of trailFiles) {
      const sub = fs.existsSync(path.join(homePageDir, "trail", f)) ? "trail" : "running";
      trailImages.push({
        src: `/images/homePage/${sub}/${f}`,
        alt: "ADD Parkour Oran Trail",
      });
    }

    const response: HomeDisciplineImagesResponse = {
      parkour: parkourImages,
      climbing: climbingImages,
      trail: trailImages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching home images:", error);
    return NextResponse.json(
      {
        parkour: [{ src: "/images/disciplines/discipline-parkour.jpg", alt: "Parkour" }],
        climbing: [{ src: "/images/disciplines/discipline-climbing.jpg", alt: "Escalade" }],
        trail: [{ src: "/images/disciplines/discipline-trail.jpg", alt: "Trail" }],
      },
      { status: 500 }
    );
  }
}

