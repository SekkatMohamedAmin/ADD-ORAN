"use client";

import { useState, useEffect } from "react";

export interface DisciplineImageItem {
  src: string;
  alt: string;
}

export interface HomeDisciplineImagesData {
  parkour: DisciplineImageItem[];
  climbing: DisciplineImageItem[];
  trail: DisciplineImageItem[];
}

export const DEFAULT_HOME_IMAGES: HomeDisciplineImagesData = {
  parkour: [
    {
      src: "/images/disciplines/discipline-parkour.jpg",
      alt: "ADD Parkour Oran - Art du Déplacement",
    },
    {
      src: "/images/homePage/733127115_18036290213816291_5589127572874927298_n.jpg",
      alt: "ADD Parkour Oran entraînement",
    },
    {
      src: "/images/homePage/744088777_18604132903044482_6608679076356787624_n.jpg",
      alt: "ADD Parkour Oran session",
    },
    {
      src: "/images/homePage/744821683_18604132933044482_8092442562257906338_n.jpg",
      alt: "ADD Parkour Oran communauté",
    },
    {
      src: "/images/homePage/747753358_18604132846044482_3870763485454154032_n.jpg",
      alt: "ADD Parkour Oran saut",
    },
    {
      src: "/images/homePage/parkour/5893075819293249589.jpg",
      alt: "ADD Parkour Oran voltige",
    },
    {
      src: "/images/homePage/parkour/5893075819293249591.jpg",
      alt: "ADD Parkour Oran équipe",
    },
  ],
  climbing: [
    {
      src: "/images/disciplines/discipline-climbing.jpg",
      alt: "ADD Parkour Oran - Escalade et Bloc",
    },
  ],
  trail: [
    {
      src: "/images/disciplines/discipline-trail.jpg",
      alt: "ADD Parkour Oran - Trail et Nature",
    },
  ],
};

export function useHomeDisciplineImages(): HomeDisciplineImagesData {
  const [images, setImages] = useState<HomeDisciplineImagesData>(DEFAULT_HOME_IMAGES);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/public/home-images")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: HomeDisciplineImagesData | null) => {
        if (isMounted && data && Array.isArray(data.parkour) && data.parkour.length > 0) {
          setImages(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return images;
}

