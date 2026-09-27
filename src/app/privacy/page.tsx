"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, FileText, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#00141f] text-[#f4f7f9]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#003D5B] border border-[#00798C] text-[#38b6cb] font-mono text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#EDAE49]" />
          <span>Conformité Réglementaire // Loi 18-07</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
          Protection des Données Personnelles
        </h1>

        <p className="font-editorial italic text-base text-[#8faec5] mb-10">
          Cadre juridique : Loi algérienne n° 18-07 du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel.
        </p>

        <div className="bg-[#072538] border-2 border-[#17425f] rounded-3xl p-6 sm:p-10 text-[#8faec5] space-y-8 text-sm leading-relaxed font-body shadow-2xl">
          <div className="p-5 bg-[#00141f] border border-[#EDAE49]/40 rounded-2xl text-xs text-[#EDAE49] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#EDAE49] shrink-0 mt-0.5" />
            <p>
              Le Club Sportif Art Du Déplacement Parkour Oran s&apos;engage formellement à respecter la confidentialité et l&apos;intégrité des informations et justificatifs collectés lors des inscriptions. Les présentes dispositions sont soumises à la révision légale du bureau exécutif et des conseils juridiques compétents.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#EDAE49]" />
              <span>1. Données collectées</span>
            </h2>
            <p>
              Dans le cadre de l&apos;adhésion, de la gestion sportive et de la délivrance des licences, le club collecte les données strictement nécessaires :
            </p>
            <ul className="list-disc list-inside ps-4 space-y-1.5 text-[#f4f7f9]">
              <li><strong>Données d&apos;identité :</strong> Nom, prénom, date et lieu de naissance, adresse de résidence.</li>
              <li><strong>Données de contact :</strong> Numéro de téléphone portable (obligatoire), email, WhatsApp (optionnels).</li>
              <li><strong>Données biométriques & visuelles :</strong> Photographie d&apos;identité récente (pour le dossier et la carte de membre).</li>
              <li><strong>Justificatifs officiels :</strong> Pièce d&apos;identité nationale (CNI/Passeport), certificat médical d&apos;aptitude physique.</li>
              <li><strong>Données médicales d&apos;urgence :</strong> Groupe sanguin (optionnel), indications d&apos;urgence.</li>
              <li><strong>Données relatives aux mineurs :</strong> Pièce d&apos;identité du tuteur légal, déclaration formelle d&apos;autorisation parentale.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#EDAE49]" />
              <span>2. Finalités du traitement</span>
            </h2>
            <p>
              Les données sont exclusivement traitées pour :
            </p>
            <ul className="list-disc list-inside ps-4 space-y-1.5 text-[#f4f7f9]">
              <li>L&apos;établissement et la gestion des affiliations sportives annuelles.</li>
              <li>La souscription aux assurances responsabilité civile et individuelle accident.</li>
              <li>L&apos;accès sécurisé aux entraînements en falaise, salle et milieu urbain encadré.</li>
              <li>La communication d&apos;urgence avec les membres ou représentants légaux.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-white uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#EDAE49]" />
              <span>3. Sécurité & Stockage Privé Sécurisé</span>
            </h2>
            <p>
              Les pièces sensibles (pièces d&apos;identité, certificats médicaux) sont stockées dans un répertoire d&apos;archivage privé à accès restreint hors de l&apos;arborescence publique web. L&apos;accès est rigoureusement limité à l&apos;administrateur et au bureau médical officiel.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
