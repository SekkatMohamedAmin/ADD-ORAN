"use client";

import React from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText, CheckCircle2, AlertTriangle, Shield, HeartHandshake } from "lucide-react";

export default function RegulationsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#00141f] text-[#f4f7f9]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#003D5B] border border-[#00798C] text-[#38b6cb] font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <FileText className="w-3.5 h-3.5 text-[#EDAE49]" />
          <span>RÈGLEMENT INTÉRIEUR & CHARTE DU CLUB</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
          {t.paperwork.engagementTitle}
        </h1>

        <p className="font-editorial italic text-base text-[#8faec5] mb-10">
          Club Sportif Art Du Déplacement Parkour Oran — Saison Sportive 2026
        </p>

        <div className="bg-[#072538] border-2 border-[#17425f] rounded-3xl p-6 sm:p-10 text-[#8faec5] space-y-8 text-sm leading-relaxed font-body shadow-2xl">
          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-[#EDAE49] uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#EDAE49]" />
              <span>1. Objet & Adhésion</span>
            </h2>
            <p>
              L&apos;adhésion au Club Sportif Art Du Déplacement Parkour Oran implique l&apos;acceptation pleine et entière du présent règlement intérieur. Le club a pour objet l&apos;apprentissage, la pratique, la promotion et le développement sécurisé de l&apos;Art Du Déplacement (Parkour / Freerun), de l&apos;Escalade et des sports de montagne, ainsi que du Trail (course nature).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-[#EDAE49] uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#EDAE49]" />
              <span>2. Certificat Médical & Aptitude Physique</span>
            </h2>
            <p>
              Tout adhérent doit obligatoirement fournir un certificat médical datant de moins de 3 mois attestant l&apos;absence de contre-indication à la pratique des activités physiques et sportives choisies. En cas de blessure ou d&apos;évolution de l&apos;état de santé au cours de la saison, l&apos;adhérent est tenu d&apos;en informer immédiatement les éducateurs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-[#EDAE49] uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EDAE49]" />
              <span>3. Connaissance & Conscience des Risques</span>
            </h2>
            <p>
              Les activités de déplacement en milieu urbain, d&apos;escalade et de course sur sentiers comportent des exigences physiques et des risques de chute ou de blessure. L&apos;adhérent s&apos;engage à respecter scrupuleusement les consignes de sécurité, le port des équipements obligatoires (casque, baudrier, chaussures adaptées) et les zones autorisées définies par l&apos;encadrement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-[#EDAE49] uppercase flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#EDAE49]" />
              <span>4. Esprit & Valeurs de l&apos;Art Du Déplacement</span>
            </h2>
            <p>
              La pratique s&apos;inscrit dans les valeurs fondatrices de l&apos;Art Du Déplacement : humilité, persévérance, respect de l&apos;environnement urbain et naturel, entraide mutuelle (« Être fort pour être utile ») et refus de la mise en danger téméraire d&apos;autrui ou de soi-même.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
