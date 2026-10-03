"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText, CheckCircle2, AlertTriangle, Shield, HeartHandshake } from "lucide-react";

export default function RegulationsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0D] text-[#F5F5F2] selection:bg-[#E52421] selection:text-white relative overflow-hidden">
      <Navbar />

      {/* Atmospheric Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <Image
          src="/images/hero/hero-parkour.jpg"
          alt="ADD Oran Athletic"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20 filter contrast-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0D] via-[#0A0A0D]/85 to-[#0A0A0D]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0A0A0D_85%)]" />
        <div className="absolute inset-0 sports-grid-pattern opacity-30" />
      </div>

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-14 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#E52421]/15 border border-[#E52421]/30 text-[#FFD21F] font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <FileText className="w-3.5 h-3.5 text-[#E52421]" />
          <span>RÈGLEMENT INTÉRIEUR & CHARTE DU CLUB</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
          {t.paperwork.engagementTitle}
        </h1>

        <p className="font-editorial italic text-base text-[#9E9EA8] mb-10">
          Club Sportif Art Du Déplacement Parkour Oran — Saison Sportive 2026
        </p>

        <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 sm:p-10 text-[#9E9EA8] space-y-8 text-sm leading-relaxed font-body shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E52421]/10 blur-3xl pointer-events-none" />

          <section className="space-y-3 relative z-10">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#E52421]" />
              <span>1. Objet & Adhésion</span>
            </h2>
            <p>
              L&apos;adhésion au Club Sportif Art Du Déplacement Parkour Oran implique l&apos;acceptation pleine et entière du présent règlement intérieur. Le club a pour objet l&apos;apprentissage, la pratique, la promotion et le développement sécurisé de l&apos;Art Du Déplacement (Parkour / Freerun), de l&apos;Escalade et des sports de montagne, ainsi que du Trail (course nature).
            </p>
          </section>

          <section className="space-y-3 relative z-10">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E52421]" />
              <span>2. Certificat Médical & Aptitude Physique</span>
            </h2>
            <p>
              Tout adhérent doit obligatoirement fournir un certificat médical datant de moins de 3 mois attestant l&apos;absence de contre-indication à la pratique des activités physiques et sportives choisies. En cas de blessure ou d&apos;évolution de l&apos;état de santé au cours de la saison, l&apos;adhérent est tenu d&apos;en informer immédiatement les éducateurs.
            </p>
          </section>

          <section className="space-y-3 relative z-10">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FFD21F]" />
              <span>3. Connaissance & Conscience des Risques</span>
            </h2>
            <p>
              Les activités de déplacement en milieu urbain, d&apos;escalade et de course sur sentiers comportent des exigences physiques et des risques de chute ou de blessure. L&apos;adhérent s&apos;engage à respecter scrupuleusement les consignes de sécurité, le port des équipements obligatoires (casque, baudrier, chaussures adaptées) et les zones autorisées définies par l&apos;encadrement.
            </p>
          </section>

          <section className="space-y-3 relative z-10">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#E52421]" />
              <span>4. Esprit Sportif, Citoyenneté & Respect de l&apos;Environnement</span>
            </h2>
            <p>
              L&apos;Art Du Déplacement repose sur des valeurs d&apos;entraide, de dépassement de soi, de respect des infrastructures publiques et de préservation des espaces naturels (sentiers, falaises, mobilier urbain). Tout comportement antisportif, dégradation ou mise en danger d&apos;autrui entraînera l&apos;exclusion immédiate de l&apos;adhérent sans remboursement de cotisation.
            </p>
          </section>

          <section className="space-y-3 relative z-10">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FFD21F]" />
              <span>5. Droit à l&apos;Image & Utilisation des Données</span>
            </h2>
            <p>
              L&apos;adhérent (ou son tuteur légal pour les mineurs) autorise le club à photographier ou filmer les séances et événements sportifs à des fins d&apos;archivage, de communication pédagogique ou promotionnelle sur les canaux officiels du club (site web, réseaux sociaux associatifs), sans contrepartie financière, conformément aux lois en vigueur.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
