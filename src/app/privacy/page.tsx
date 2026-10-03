"use client";

import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, FileText, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
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
          <ShieldCheck className="w-3.5 h-3.5 text-[#E52421]" />
          <span>Conformité Réglementaire // Loi 18-07</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
          Protection des Données Personnelles
        </h1>

        <p className="font-editorial italic text-base text-[#9E9EA8] mb-10">
          Cadre juridique : Loi algérienne n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.
        </p>

        <div className="bg-[#141419]/90 border border-white/10 rounded-3xl p-6 sm:p-10 text-[#9E9EA8] space-y-8 text-sm leading-relaxed font-body shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="p-5 bg-[#0A0A0D]/90 border border-[#FFD21F]/30 rounded-2xl text-xs text-[#FFD21F] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#FFD21F] shrink-0 mt-0.5" />
            <p>
              Le Club Sportif Art Du Déplacement Parkour Oran s&apos;engage formellement à respecter la confidentialité et l&apos;intégrité des informations et justificatifs collectés lors des inscriptions. Les présentes dispositions sont conformes à la réglementation nationale en vigueur.
            </p>
          </div>

          <section className="space-y-3 relative z-10">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E52421]" />
              <span>1. Données collectées</span>
            </h2>
            <p>
              Dans le cadre de l&apos;adhésion, de la gestion sportive et de la délivrance des licences, le club collecte les données strictement nécessaires :
            </p>
            <ul className="list-disc list-inside ps-4 space-y-1.5 text-white/90">
              <li><strong>Données d&apos;identité :</strong> Nom, prénom, date et lieu de naissance, adresse de résidence.</li>
              <li><strong>Données de contact :</strong> Numéro de téléphone portable (obligatoire), email, WhatsApp (optionnels).</li>
              <li><strong>Données biométriques & visuelles :</strong> Photographie d&apos;identité récente (pour le dossier et la carte de membre).</li>
              <li><strong>Justificatifs officiels :</strong> Pièce d&apos;identité nationale (CNI/Passeport), certificat médical d&apos;aptitude physique.</li>
              <li><strong>Données médicales d&apos;urgence :</strong> Groupe sanguin (optionnel), indications d&apos;urgence.</li>
              <li><strong>Données relatives aux mineurs :</strong> Pièce d&apos;identité du tuteur légal, déclaration formelle d&apos;autorisation parentale.</li>
            </ul>
          </section>

          <section className="space-y-3 relative z-10">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#E52421]" />
              <span>2. Finalités du traitement</span>
            </h2>
            <p>
              Les données sont exclusivement traitées pour :
            </p>
            <ul className="list-disc list-inside ps-4 space-y-1.5 text-white/90">
              <li>L&apos;instruction et la validation des dossiers d&apos;adhésion pour la saison sportive en cours.</li>
              <li>La souscription aux assurances responsabilité civile et individuelle accident auprès de l&apos;assureur partenaire.</li>
              <li>L&apos;organisation des créneaux d&apos;entraînement, stages et événements sportifs.</li>
              <li>La communication administrative d&apos;urgence avec les adhérents ou leurs tuteurs légaux.</li>
            </ul>
          </section>

          <section className="space-y-3 relative z-10">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#E52421]" />
              <span>3. Sécurité & Droits des Adhérents</span>
            </h2>
            <p>
              Les documents et identifiants sont chiffrés et stockés dans un environnement sécurisé à accès restreint. Conformément à la loi 18-07, chaque adhérent dispose d&apos;un droit d&apos;accès, de rectification et de mise à jour de ses données personnelles auprès de l&apos;administration du club.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
