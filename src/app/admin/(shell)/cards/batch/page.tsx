"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import {
  CardRectoFace,
  CardVersoFace,
  condenseDisciplineName,
} from "@/components/MembershipCard";
import { getClubRoleDefinition } from "@/lib/clubRoles";
import {
  Archive as FiArchive,
  ArrowLeft as FiArrowLeft,
  CheckSquare as FiCheckSquare,
  FileText as FiFileText,
  Folder as FiFolder,
  Loader2 as FiLoader,
  Printer as FiPrinter,
  Search as FiSearch,
  Square as FiSquare,
  Users as FiUsers,
  X as FiX,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface BatchCardItem {
  registrationId: string;
  participant: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    bloodType?: string | null;
    isMinor: boolean;
    phone: string;
    emergencyPhone?: string | null;
    membershipCardNumber?: string | null;
    rfidCardId?: string | null;
    clubRole?: string | null;
    isStaff?: boolean;
  };
  registration: {
    reference: string;
    status: string;
    type?: string;
    season: {
      code: string;
      label?: string;
    };
    disciplines?: Array<{
      discipline: {
        id: string;
        nameFr?: string;
        nameAr?: string;
        slug?: string;
      };
    }>;
  };
  photoDocId?: string | null;
}

interface SeasonOption {
  id: string;
  code: string;
  label: string;
  isActive: boolean;
}

function sanitizeFilename(input: string): string {
  return (input || "membre")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

async function waitForImagesInNode(node: HTMLElement): Promise<void> {
  const imgs = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
        // Safety timeout so a broken image never stalls the batch
        setTimeout(done, 3000);
      });
    })
  );
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function BatchCardsPrintPage() {
  const [cards, setCards] = useState<BatchCardItem[]>([]);
  const [seasons, setSeasons] = useState<SeasonOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [seasonFilter, setSeasonFilter] = useState("current");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Batch Generation State
  const [exportingMode, setExportingMode] = useState<"zip" | "merged_pdf" | null>(null);
  const [progressCurrent, setProgressCurrent] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [currentMemberName, setCurrentMemberName] = useState("");
  const [activeRenderCard, setActiveRenderCard] = useState<BatchCardItem | null>(null);
  const cancelRef = useRef(false);

  const rectoRef = useRef<HTMLDivElement>(null);
  const versoRef = useRef<HTMLDivElement>(null);

  const fetchBatchCards = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        season: seasonFilter,
        status: statusFilter,
        type: typeFilter,
        search: search.trim(),
      });
      const res = await fetch(`/api/admin/cards/batch?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de chargement.");
      setCards(data.cards || []);
      if (data.seasons) setSeasons(data.seasons);
      // Automatically select all returned cards by default
      setSelectedIds(new Set((data.cards || []).map((c: BatchCardItem) => c.registrationId)));
    } catch (err: any) {
      setError(err.message || "Impossible de charger les cartes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBatchCards();
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonFilter, statusFilter, typeFilter, search]);

  const toggleSelectAll = () => {
    if (selectedIds.size === cards.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cards.map((c) => c.registrationId)));
    }
  };

  const toggleOne = (regId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(regId)) next.delete(regId);
      else next.add(regId);
      return next;
    });
  };

  const selectedCards = useMemo(
    () => cards.filter((c) => selectedIds.has(c.registrationId)),
    [cards, selectedIds]
  );

  const staffCount = useMemo(
    () =>
      selectedCards.filter(
        (c) => c.participant.isStaff || c.participant.clubRole || c.registration.type === "STAFF"
      ).length,
    [selectedCards]
  );
  const memberCount = selectedCards.length - staffCount;

  const captureCardFaces = async (card: BatchCardItem) => {
    setActiveRenderCard(card);
    // Wait two animation frames + small settle delay for React DOM + SVG barcode/QR
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 90));

    if (!rectoRef.current || !versoRef.current) {
      throw new Error("Conteneur de rendu introuvable.");
    }

    await Promise.all([
      waitForImagesInNode(rectoRef.current),
      waitForImagesInNode(versoRef.current),
    ]);

    const [rectoPng, versoPng] = await Promise.all([
      toPng(rectoRef.current, {
        pixelRatio: 4,
        backgroundColor: "#0E0E12",
        cacheBust: false,
      }),
      toPng(versoRef.current, {
        pixelRatio: 4,
        backgroundColor: "#0E0E12",
        cacheBust: false,
      }),
    ]);

    return { rectoPng, versoPng };
  };

  const handleBatchExport = async (mode: "zip" | "merged_pdf") => {
    if (selectedCards.length === 0) return;

    cancelRef.current = false;
    setExportingMode(mode);
    setProgressCurrent(0);
    setProgressTotal(selectedCards.length);
    setCurrentMemberName("");

    try {
      const zip = mode === "zip" ? new JSZip() : null;
      const dirigeantsFolder = zip ? zip.folder("Dirigeants") : null;
      const adherentsFolder = zip ? zip.folder("Adherents") : null;

      const mergedDoc =
        mode === "merged_pdf"
          ? new jsPDF({
              orientation: "landscape",
              unit: "mm",
              format: [85.6, 53.98],
              compress: true,
            })
          : null;

      for (let i = 0; i < selectedCards.length; i++) {
        if (cancelRef.current) break;

        const card = selectedCards[i];
        const fullName = `${card.participant.lastName.toUpperCase()} ${card.participant.firstName}`;
        setCurrentMemberName(fullName);
        setProgressCurrent(i + 1);

        const { rectoPng, versoPng } = await captureCardFaces(card);

        if (cancelRef.current) break;

        if (mode === "zip" && zip) {
          const singlePdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [85.6, 53.98],
            compress: true,
          });
          singlePdf.addImage(rectoPng, "PNG", 0, 0, 85.6, 53.98, undefined, "FAST");
          singlePdf.addPage([85.6, 53.98], "landscape");
          singlePdf.addImage(versoPng, "PNG", 0, 0, 85.6, 53.98, undefined, "FAST");

          const isStaff = Boolean(
            card.participant.isStaff ||
              card.participant.clubRole ||
              card.registration.type === "STAFF"
          );
          const refOrCard =
            card.participant.membershipCardNumber || card.registration.reference;
          const fileName = `${sanitizeFilename(card.participant.lastName)}_${sanitizeFilename(
            card.participant.firstName
          )}_${sanitizeFilename(refOrCard)}.pdf`;

          const targetFolder = isStaff ? dirigeantsFolder : adherentsFolder;
          (targetFolder || zip).file(fileName, singlePdf.output("arraybuffer"));
        } else if (mode === "merged_pdf" && mergedDoc) {
          if (i > 0) {
            mergedDoc.addPage([85.6, 53.98], "landscape");
          }
          mergedDoc.addImage(rectoPng, "PNG", 0, 0, 85.6, 53.98, undefined, "FAST");
          mergedDoc.addPage([85.6, 53.98], "landscape");
          mergedDoc.addImage(versoPng, "PNG", 0, 0, 85.6, 53.98, undefined, "FAST");
        }
      }

      if (!cancelRef.current) {
        const seasonTag =
          seasonFilter === "current"
            ? seasons.find((s) => s.isActive)?.code || "saison"
            : seasonFilter;

        if (mode === "zip" && zip) {
          setCurrentMemberName("Compression de l'archive ZIP...");
          const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
          });
          triggerBlobDownload(zipBlob, `cartes-pvc-add-oran-${seasonTag}.zip`);
        } else if (mode === "merged_pdf" && mergedDoc) {
          setCurrentMemberName("Finalisation du PDF multi-pages...");
          const pdfBlob = mergedDoc.output("blob");
          triggerBlobDownload(pdfBlob, `cartes-pvc-lot-cr80-${seasonTag}.pdf`);
        }
      }
    } catch (err: any) {
      console.error("Batch export error:", err);
      alert(err?.message || "Erreur lors de la génération du lot de cartes.");
    } finally {
      setActiveRenderCard(null);
      setExportingMode(null);
      setCurrentMemberName("");
    }
  };

  // Prepare props for offscreen renderer
  const renderCardProps = useMemo(() => {
    if (!activeRenderCard) return null;
    const { participant, registration, photoDocId } = activeRenderCard;
    const cardNumber =
      participant.membershipCardNumber ||
      `ADD-CARD-${registration?.season?.code || "2026"}-PENDING`;
    const seasonLabel =
      registration?.season?.label ||
      (registration?.season?.code
        ? `Saison ${registration.season.code}`
        : "Saison 2026-2027");
    const birthDateFormatted = participant.dateOfBirth
      ? new Date(participant.dateOfBirth).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "—";
    const photoUrl = photoDocId ? `/api/documents/${photoDocId}` : null;
    const rawDisciplines =
      registration?.disciplines?.map(
        (d) => d.discipline.nameFr || d.discipline.slug?.toUpperCase() || "PARKOUR"
      ) || ["PARKOUR"];
    const disciplines: string[] = Array.from(
      new Set(rawDisciplines.map(condenseDisciplineName))
    );

    return {
      participant,
      cardNumber,
      seasonLabel,
      birthDateFormatted,
      photoUrl,
      disciplines,
      registration,
    };
  }, [activeRenderCard]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/participants"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
              title="Retour aux adhérents"
            >
              <FiArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <FiPrinter className="w-6 h-6 text-[#E52421]" />
              Impression Batch des Cartes PVC (CR-80)
            </h1>
          </div>
          <p className="text-xs text-gray-400 pl-11">
            Générez en un clic toutes les cartes (Recto + Verso au format exact{" "}
            <span className="text-gray-200 font-mono">85.60 × 53.98 mm</span>) dans un fichier{" "}
            <strong className="text-[#FFD21F]">ZIP</strong> classé par dossiers (
            <code className="text-gray-300">Dirigeants/</code> et{" "}
            <code className="text-gray-300">Adherents/</code>) ou en{" "}
            <strong className="text-white">PDF multi-pages</strong> prêt pour l&apos;imprimeur.
          </p>
        </div>

        {/* Batch Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={selectedCards.length === 0 || exportingMode !== null}
            onClick={() => handleBatchExport("merged_pdf")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold transition disabled:opacity-40 cursor-pointer"
            title="Toutes les cartes Recto/Verso à la suite dans un seul fichier PDF CR-80"
          >
            <FiFileText className="w-4 h-4 text-[#FFD21F]" />
            <span>PDF Unique ({selectedCards.length * 2} pages)</span>
          </button>

          <button
            type="button"
            disabled={selectedCards.length === 0 || exportingMode !== null}
            onClick={() => handleBatchExport("zip")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E52421] hover:bg-[#ff2d2a] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#E52421]/25 transition disabled:opacity-40 cursor-pointer active:scale-95"
            title="Télécharge un dossier compressé ZIP contenant un PDF CR-80 par personne"
          >
            <FiArchive className="w-4 h-4" />
            <span>Télécharger ZIP ({selectedCards.length} cartes)</span>
          </button>
        </div>
      </div>

      {/* Filters & Selection Summary Bar */}
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Season Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Saison
            </label>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0D0D10] border border-white/10 text-xs text-white focus:border-[#E52421] outline-none"
            >
              <option value="current">Saison Active (Courante)</option>
              <option value="all">Toutes les saisons</option>
              {seasons.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.label} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Statut d&apos;adhésion
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0D0D10] border border-white/10 text-xs text-white focus:border-[#E52421] outline-none"
            >
              <option value="ACTIVE">Actifs / Validés uniquement (Recommandé)</option>
              <option value="all">Tous les statuts</option>
              <option value="PAYMENT_PENDING">En attente de paiement</option>
              <option value="SUBMITTED">Soumis / En révision</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Catégorie
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0D0D10] border border-white/10 text-xs text-white focus:border-[#E52421] outline-none"
            >
              <option value="all">Tous (Dirigeants & Adhérents)</option>
              <option value="STAFF">Dirigeants / Bureau / Coachs</option>
              <option value="MEMBER">Adhérents Sportifs uniquement</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Recherche rapide
            </label>
            <div className="relative">
              <FiSearch className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom, tél, N° carte..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D0D10] border border-white/10 text-xs text-white placeholder-gray-500 focus:border-[#E52421] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ZIP Structure Preview + Counters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-gray-300">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition cursor-pointer"
            >
              {selectedIds.size === cards.length && cards.length > 0 ? (
                <FiCheckSquare className="w-4 h-4 text-[#E52421]" />
              ) : (
                <FiSquare className="w-4 h-4 text-gray-400" />
              )}
              <span>
                {selectedIds.size === cards.length && cards.length > 0
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </span>
            </button>

            <span className="font-mono text-gray-400">
              Sélection :{" "}
              <strong className="text-white">{selectedCards.length}</strong> / {cards.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <FiFolder className="w-3.5 h-3.5" />
              Dirigeants/ ({staffCount})
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
              <FiFolder className="w-3.5 h-3.5" />
              Adherents/ ({memberCount})
            </span>
          </div>
        </div>
      </div>

      {/* Table of Cards */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
          {error}
        </div>
      )}

      <div className="bg-[#121216] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
            <FiLoader className="w-6 h-6 animate-spin text-[#E52421]" />
            <span className="text-xs font-mono">Chargement des cartes éligibles...</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="p-12 text-center space-y-2 text-gray-400">
            <FiUsers className="w-8 h-8 mx-auto text-gray-600" />
            <p className="text-sm font-semibold text-white">Aucune carte trouvée</p>
            <p className="text-xs">
              Ajustez les filtres (saison, statut ou recherche) pour afficher les adhérents.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#0D0D10] text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4 w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-gray-300 hover:text-white cursor-pointer"
                    >
                      {selectedIds.size === cards.length ? (
                        <FiCheckSquare className="w-4 h-4 text-[#E52421]" />
                      ) : (
                        <FiSquare className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Adhérent / Dirigeant</th>
                  <th className="py-3 px-4">Type / Dossier ZIP</th>
                  <th className="py-3 px-4">N° Carte & Référence</th>
                  <th className="py-3 px-4">Disciplines</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Aperçu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {cards.map((card) => {
                  const isSelected = selectedIds.has(card.registrationId);
                  const isStaff = Boolean(
                    card.participant.isStaff ||
                      card.participant.clubRole ||
                      card.registration.type === "STAFF"
                  );
                  const roleDef = getClubRoleDefinition(card.participant.clubRole);
                  const condensed = Array.from(
                    new Set(
                      (card.registration.disciplines || []).map((d) =>
                        condenseDisciplineName(d.discipline.nameFr || d.discipline.slug)
                      )
                    )
                  );

                  return (
                    <tr
                      key={card.registrationId}
                      onClick={() => toggleOne(card.registrationId)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? "bg-[#E52421]/[0.04] hover:bg-[#E52421]/[0.08]"
                          : "hover:bg-white/[0.02] opacity-60"
                      }`}
                    >
                      <td className="py-3 px-4">
                        {isSelected ? (
                          <FiCheckSquare className="w-4 h-4 text-[#E52421]" />
                        ) : (
                          <FiSquare className="w-4 h-4 text-gray-500" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#1C1C24] border border-white/10 shrink-0 flex items-center justify-center">
                            {card.photoDocId ? (
                              <img
                                src={`/api/documents/${card.photoDocId}`}
                                alt={card.participant.firstName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[11px] font-bold text-gray-400">
                                {card.participant.firstName.charAt(0)}
                                {card.participant.lastName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white uppercase">
                              {card.participant.lastName} {card.participant.firstName}
                            </div>
                            <div className="text-[11px] font-mono text-gray-400">
                              {card.participant.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isStaff ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" />
                            Dirigeants/ ({roleDef?.labelFr || "Staff"})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono text-[10px]">
                            Adherents/
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="text-[#FFD21F] font-bold text-[11px]">
                          {card.participant.membershipCardNumber || "En attente N°"}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {card.registration.reference}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {isStaff ? (
                            <span className="text-[10px] font-mono text-amber-300/80">
                              Accréditation Officielle
                            </span>
                          ) : condensed.length > 0 ? (
                            condensed.map((d) => (
                              <span
                                key={d}
                                className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-gray-200"
                              >
                                {d}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-gray-500">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            card.registration.status === "ACTIVE"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {card.registration.status === "ACTIVE" && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {card.registration.status}
                        </span>
                      </td>
                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/card/${card.participant.id}/print`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-[11px] font-mono transition"
                        >
                          <FiPrinter className="w-3 h-3 text-[#FFD21F]" />
                          <span>Ouvrir</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Progress Modal during Batch Generation */}
      {exportingMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141419] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E52421]/15 border border-[#E52421]/40 flex items-center justify-center">
                  <FiLoader className="w-5 h-5 text-[#E52421] animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wide">
                    {exportingMode === "zip"
                      ? "Création de l'archive ZIP..."
                      : "Création du PDF multi-pages..."}
                  </h3>
                  <p className="text-[11px] font-mono text-gray-400">
                    Rendu Haute Définition CR-80 (300+ DPI)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  cancelRef.current = true;
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
                title="Annuler"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-300 truncate max-w-[240px]">
                  {currentMemberName || "Initialisation..."}
                </span>
                <span className="text-[#FFD21F] font-bold">
                  {progressCurrent} / {progressTotal}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E52421] to-[#FFD21F] transition-all duration-200"
                  style={{
                    width: `${
                      progressTotal > 0
                        ? Math.round((progressCurrent / progressTotal) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[10px] font-mono text-gray-500 text-center pt-1">
                Ne fermez pas cet onglet pendant la génération des badges PVC.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Offscreen CR-80 Render Stage (1 card rendered at a time for crisp 300+ DPI capture) */}
      {renderCardProps && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-10000px",
            top: 0,
            pointerEvents: "none",
            opacity: 1,
            zIndex: -1,
          }}
        >
          <div
            ref={rectoRef}
            style={{
              width: "85.6mm",
              height: "53.98mm",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <CardRectoFace
              participant={renderCardProps.participant}
              cardNumber={renderCardProps.cardNumber}
              seasonLabel={renderCardProps.seasonLabel}
              birthDateFormatted={renderCardProps.birthDateFormatted}
              photoUrl={renderCardProps.photoUrl}
              disciplines={renderCardProps.disciplines}
              registration={renderCardProps.registration}
              isPrintVersion
            />
          </div>

          <div
            ref={versoRef}
            style={{
              width: "85.6mm",
              height: "53.98mm",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <CardVersoFace
              participant={renderCardProps.participant}
              seasonLabel={renderCardProps.seasonLabel}
              isPrintVersion
            />
          </div>
        </div>
      )}
    </div>
  );
}

