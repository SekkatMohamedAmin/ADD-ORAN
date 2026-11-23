import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

export interface InsuranceAdherentRow {
  index: number;
  id: string;
  lastName: string;
  firstName: string;
  fullName: string;
  dateOfBirth: string; // "DD/MM/YYYY"
  rawDateOfBirth?: string;
  placeOfBirth: string;
  isMinor: boolean;
  ageCategory: string; // "Mineur" | "Majeur"
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  disciplines: string;
  membershipCardNumber: string;
  registrationReference: string;
  registrationStatus: string;
  seasonCode: string;
  seasonLabel: string;
}

export interface InsuranceExportMetadata {
  clubName: string;
  clubSubtitle: string;
  seasonLabel: string;
  seasonCode: string;
  generatedAt: string;
  statusFilterLabel: string;
  totalAdherents: number;
  totalMinors: number;
  totalAdults: number;
  disciplinesBreakdown: Record<string, number>;
}

export function formatDateFrench(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "—";
  }
}

/**
 * Normalizes participants into tabular rows specifically structured for Sports Insurance (Bordereau / Excel).
 */
export function buildInsuranceRows(
  participants: any[],
  options?: {
    seasonCode?: string;
    seasonLabel?: string;
    statusFilter?: "ALL" | "ACTIVE_PAID_ONLY";
  }
): { rows: InsuranceAdherentRow[]; metadata: InsuranceExportMetadata } {
  const targetSeason = options?.seasonCode && options.seasonCode !== "ALL" ? options.seasonCode : undefined;
  const statusFilter = options?.statusFilter || "ACTIVE_PAID_ONLY";

  const rows: InsuranceAdherentRow[] = [];
  const disciplinesBreakdown: Record<string, number> = {};
  let totalMinors = 0;
  let totalAdults = 0;

  let seasonLabelResolved = options?.seasonLabel || (targetSeason ? `Saison ${targetSeason}` : "Toutes saisons");

  participants.forEach((p) => {
    // Find relevant registration
    let relevantReg = p.registrations?.[0];
    if (targetSeason) {
      const match = p.registrations?.find((r: any) => r.season?.code === targetSeason);
      if (match) {
        relevantReg = match;
      }
    }

    // Filter by status if requested
    if (statusFilter === "ACTIVE_PAID_ONLY" && relevantReg) {
      const allowed = ["ACTIVE", "PAID", "ACCEPTED", "SUBMITTED"];
      if (!allowed.includes(relevantReg.status)) {
        return;
      }
    }

    if (relevantReg?.season) {
      seasonLabelResolved = relevantReg.season.label || relevantReg.season.name || relevantReg.season.code;
    }

    // Extract disciplines
    const disciplineList: string[] = [];
    if (relevantReg?.disciplines && Array.isArray(relevantReg.disciplines)) {
      relevantReg.disciplines.forEach((rd: any) => {
        const name = rd.discipline?.nameFr || rd.discipline?.name || rd.discipline?.slug;
        if (name) {
          disciplineList.push(name);
          disciplinesBreakdown[name] = (disciplinesBreakdown[name] || 0) + 1;
        }
      });
    }
    const disciplinesStr = disciplineList.length > 0 ? disciplineList.join(", ") : "Parkour";

    const isMinor = Boolean(p.isMinor);
    if (isMinor) {
      totalMinors++;
    } else {
      totalAdults++;
    }

    const index = rows.length + 1;
    const lastName = (p.lastName || "").toUpperCase().trim();
    const firstName = (p.firstName || "")
      .trim()
      .split(" ")
      .map((w: string) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
      .join(" ");

    rows.push({
      index,
      id: p.id,
      lastName: lastName || "—",
      firstName: firstName || "—",
      fullName: `${lastName} ${firstName}`.trim(),
      dateOfBirth: formatDateFrench(p.dateOfBirth),
      rawDateOfBirth: p.dateOfBirth ? String(p.dateOfBirth) : undefined,
      placeOfBirth: (p.placeOfBirth || "").trim() || "—",
      isMinor,
      ageCategory: isMinor ? "Mineur" : "Majeur",
      bloodType: p.bloodType || "—",
      phone: p.phone || "—",
      email: p.email || "—",
      address: p.address || "—",
      disciplines: disciplinesStr,
      membershipCardNumber: p.membershipCardNumber || "—",
      registrationReference: relevantReg?.reference || "—",
      registrationStatus: relevantReg?.status || "—",
      seasonCode: relevantReg?.season?.code || targetSeason || "—",
      seasonLabel: relevantReg?.season?.label || seasonLabelResolved,
    });
  });

  const now = new Date();
  const generatedAt = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} à ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const metadata: InsuranceExportMetadata = {
    clubName: "CLUB SPORTIF AMATEUR ART DU DÉPLACEMENT PARKOUR ORAN",
    clubSubtitle: "C.S.A - ADD PARKOUR ORAN (Agrément W31/2022 - Wilaya d'Oran)",
    seasonLabel: seasonLabelResolved,
    seasonCode: targetSeason || "ALL",
    generatedAt,
    statusFilterLabel: statusFilter === "ACTIVE_PAID_ONLY" ? "Dossiers validés & payés" : "Tous les adhérents",
    totalAdherents: rows.length,
    totalMinors,
    totalAdults,
    disciplinesBreakdown,
  };

  return { rows, metadata };
}

/**
 * Builds an Excel Workbook using SheetJS with formatting and insurance tracking columns.
 */
export function buildInsuranceExcelWorkbook(
  rows: InsuranceAdherentRow[],
  metadata: InsuranceExportMetadata
): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  // Header rows
  const aoa: any[][] = [
    [metadata.clubName],
    [metadata.clubSubtitle],
    ["BORDEREAU NOMINATIF DES ADHÉRENTS - SOUSCRIPTION ASSURANCE SPORTIVE"],
    [
      `Saison : ${metadata.seasonLabel} | Date d'export : ${metadata.generatedAt} | Total : ${metadata.totalAdherents} adhérents (${metadata.totalMinors} mineurs, ${metadata.totalAdults} majeurs)`,
    ],
    [], // empty row separator
    [
      "N°",
      "Nom",
      "Prénom",
      "Date de Naissance",
      "Lieu de Naissance",
      "Catégorie",
      "Groupe Sanguin",
      "Discipline(s)",
      "N° Carte Adhérent",
      "Réf. Dossier",
      "Téléphone",
      "Email",
      "Adresse",
      "Statut Dossier",
      "Saison",
      // Tracking columns for the insurance company & club administration:
      "N° Police / Quittance Assurance",
      "Statut Assurance",
      "Date d'effet / Souscription",
      "Montant Prime (DZD)",
      "Observations / Émargement",
    ],
  ];

  // Append data rows
  rows.forEach((r) => {
    aoa.push([
      r.index,
      r.lastName,
      r.firstName,
      r.dateOfBirth,
      r.placeOfBirth,
      r.ageCategory,
      r.bloodType,
      r.disciplines,
      r.membershipCardNumber,
      r.registrationReference,
      r.phone,
      r.email,
      r.address,
      r.registrationStatus,
      r.seasonCode,
      // Pre-filled blank tracking cells
      "", // N° Police / Quittance
      "À assurer", // Statut Assurance
      "", // Date d'effet
      "", // Montant Prime
      "", // Observations
    ]);
  });

  // Summary row at bottom
  aoa.push([]);
  aoa.push(["TOTAL ADHÉRENTS", metadata.totalAdherents]);
  aoa.push(["TOTAL MINEURS", metadata.totalMinors]);
  aoa.push(["TOTAL MAJEURS", metadata.totalAdults]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Set column widths
  ws["!cols"] = [
    { wch: 6 }, // N°
    { wch: 18 }, // Nom
    { wch: 18 }, // Prénom
    { wch: 16 }, // Date de Naissance
    { wch: 22 }, // Lieu de Naissance
    { wch: 12 }, // Catégorie
    { wch: 14 }, // Groupe Sanguin
    { wch: 28 }, // Discipline(s)
    { wch: 24 }, // N° Carte Adhérent
    { wch: 20 }, // Réf. Dossier
    { wch: 16 }, // Téléphone
    { wch: 26 }, // Email
    { wch: 32 }, // Adresse
    { wch: 16 }, // Statut Dossier
    { wch: 12 }, // Saison
    { wch: 28 }, // N° Police / Quittance
    { wch: 18 }, // Statut Assurance
    { wch: 20 }, // Date effet
    { wch: 18 }, // Montant Prime
    { wch: 30 }, // Observations
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Assurance Adhérents");
  return wb;
}

/**
 * Returns Excel file binary Buffer for server response.
 */
export function buildInsuranceExcelBuffer(
  rows: InsuranceAdherentRow[],
  metadata: InsuranceExportMetadata
): Buffer {
  const wb = buildInsuranceExcelWorkbook(rows, metadata);
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
}

/**
 * Direct client-side download for Excel (.xlsx).
 */
export function downloadInsuranceExcelClient(
  rows: InsuranceAdherentRow[],
  metadata: InsuranceExportMetadata,
  filename?: string
): void {
  const wb = buildInsuranceExcelWorkbook(rows, metadata);
  const dateStr = new Date().toISOString().slice(0, 10);
  const seasonSlug = (metadata.seasonCode || "ALL").replace(/[^a-zA-Z0-9_-]/g, "_");
  const finalName = filename || `ADD_Oran_Assurance_Adherents_${seasonSlug}_${dateStr}.xlsx`;
  XLSX.writeFile(wb, finalName);
}

/**
 * Direct client-side trigger for PDF (download or open print preview).
 */
export function downloadInsurancePdfClient(
  rows: InsuranceAdherentRow[],
  metadata: InsuranceExportMetadata,
  action: "download" | "print" = "download",
  filename?: string
): void {
  const doc = generateInsurancePdf(rows, metadata);
  const dateStr = new Date().toISOString().slice(0, 10);
  const seasonSlug = (metadata.seasonCode || "ALL").replace(/[^a-zA-Z0-9_-]/g, "_");
  const finalName = filename || `ADD_Oran_Bordereau_Assurance_${seasonSlug}_${dateStr}.pdf`;

  if (action === "download") {
    doc.save(finalName);
  } else {
    const blobUrl = doc.output("bloburl");
    const printWindow = window.open(blobUrl, "_blank");
    if (printWindow) {
      printWindow.focus();
    }
  }
}

/**
 * Generates an official, print-ready A4 Landscape PDF Bordereau using jsPDF.
 * Optimized for physical printing and presentation at Algerian insurance centers.
 */
export function generateInsurancePdf(
  rows: InsuranceAdherentRow[],
  metadata: InsuranceExportMetadata
): jsPDF {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const marginLeft = 12;
  const marginRight = 12;
  const contentWidth = pageWidth - marginLeft - marginRight; // 273mm

  // Table Column Specifications (Total = 273mm)
  const columns = [
    { title: "N°", width: 10, align: "center" as const },
    { title: "Nom", width: 28, align: "left" as const },
    { title: "Prénom", width: 30, align: "left" as const },
    { title: "Né(e) le", width: 22, align: "center" as const },
    { title: "Lieu Naissance", width: 30, align: "left" as const },
    { title: "Catégorie", width: 18, align: "center" as const },
    { title: "Gr. Sang.", width: 16, align: "center" as const },
    { title: "Discipline(s)", width: 38, align: "left" as const },
    { title: "N° Carte / Réf.", width: 36, align: "center" as const },
    { title: "N° Police / Émargement", width: 45, align: "center" as const },
  ];

  const rowHeight = 6.8;
  const headerRowHeight = 7.5;
  const footerHeight = 14;

  let currentPage = 1;
  let currentY = 10;

  const drawPageHeader = (isFirstPage: boolean) => {
    if (isFirstPage) {
      // Top Republic Banner
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99); // gray-600
      doc.text("RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE", pageWidth / 2, currentY, { align: "center" });

      currentY += 4;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(107, 114, 128); // gray-500
      doc.text("MINISTÈRE DE LA JEUNESSE ET DES SPORTS — WILAYA D'ORAN", pageWidth / 2, currentY, { align: "center" });

      // Club Title Box
      currentY += 4;
      doc.setFillColor(15, 23, 42); // slate-900
      doc.roundedRect(marginLeft, currentY, contentWidth, 12, 1.5, 1.5, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text("CLUB SPORTIF AMATEUR ART DU DÉPLACEMENT PARKOUR ORAN (C.S.A - ADD ORAN)", pageWidth / 2, currentY + 5, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(226, 232, 240); // slate-200
      doc.text(
        "BORDEREAU NOMINATIF DE SOUSCRIPTION / ÉTAT DES ADHÉRENTS POUR ASSURANCE SPORTIVE",
        pageWidth / 2,
        currentY + 9.5,
        { align: "center" }
      );

      // Metadata info box
      currentY += 15;
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.3);
      doc.rect(marginLeft, currentY, contentWidth, 8, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);

      const infoLeft = `Saison Sportive : ${metadata.seasonLabel}   |   Édité le : ${metadata.generatedAt}`;
      doc.text(infoLeft, marginLeft + 3, currentY + 5.2);

      const infoRight = `Effectif Total : ${metadata.totalAdherents} adhérents  (${metadata.totalMinors} Mineurs, ${metadata.totalAdults} Majeurs)`;
      doc.text(infoRight, marginLeft + contentWidth - 3, currentY + 5.2, { align: "right" });

      currentY += 10.5;
    } else {
      // Compact top banner on subsequent pages
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text("C.S.A ART DU DÉPLACEMENT PARKOUR ORAN — BORDEREAU D'ASSURANCE SPORTIVE", marginLeft, currentY + 2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Saison : ${metadata.seasonLabel}  |  Page ${currentPage}`, marginLeft + contentWidth, currentY + 2, {
        align: "right",
      });

      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.line(marginLeft, currentY + 3.5, marginLeft + contentWidth, currentY + 3.5);

      currentY += 6;
    }

    // Draw Table Header
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(marginLeft, currentY, contentWidth, headerRowHeight, "F");

    let colX = marginLeft;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    columns.forEach((col) => {
      let textX = colX + 2;
      if (col.align === "center") {
        textX = colX + col.width / 2;
      }
      doc.text(col.title, textX, currentY + 5, { align: col.align });
      colX += col.width;
    });

    currentY += headerRowHeight;
  };

  const drawPageFooter = (pageNum: number) => {
    const footerY = pageHeight - 7;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginLeft, footerY - 2.5, marginLeft + contentWidth, footerY - 2.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      "Document officiel du Club Sportif Amateur Art Du Déplacement Parkour Oran — Agrément W31/2022 — Tél: 0550 00 00 00",
      marginLeft,
      footerY + 1
    );

    doc.setFont("helvetica", "bold");
    doc.text(`Page ${pageNum}`, marginLeft + contentWidth, footerY + 1, { align: "right" });
  };

  // Draw first page header
  drawPageHeader(true);

  // Iterate rows
  rows.forEach((row, rowIndex) => {
    // Check if we need a new page (reserve space for row + footer)
    if (currentY + rowHeight > pageHeight - footerHeight) {
      drawPageFooter(currentPage);
      doc.addPage("a4", "landscape");
      currentPage++;
      currentY = 10;
      drawPageHeader(false);
    }

    // Alternating background
    if (rowIndex % 2 === 1) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(marginLeft, currentY, contentWidth, rowHeight, "F");
    }

    // Row borders
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.15);
    doc.rect(marginLeft, currentY, contentWidth, rowHeight, "D");

    // Cell data
    const cells = [
      { text: String(row.index), width: columns[0].width, align: columns[0].align },
      { text: row.lastName, width: columns[1].width, align: columns[1].align, bold: true },
      { text: row.firstName, width: columns[2].width, align: columns[2].align },
      { text: row.dateOfBirth, width: columns[3].width, align: columns[3].align },
      { text: row.placeOfBirth, width: columns[4].width, align: columns[4].align },
      { text: row.ageCategory, width: columns[5].width, align: columns[5].align },
      { text: row.bloodType, width: columns[6].width, align: columns[6].align },
      { text: row.disciplines, width: columns[7].width, align: columns[7].align },
      { text: row.membershipCardNumber !== "—" ? row.membershipCardNumber : row.registrationReference, width: columns[8].width, align: columns[8].align },
      { text: "", width: columns[9].width, align: columns[9].align }, // Blank box for policy stamp/receipt
    ];

    let cellX = marginLeft;
    cells.forEach((cell, idx) => {
      // Draw vertical separators
      if (idx > 0) {
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.1);
        doc.line(cellX, currentY, cellX, currentY + rowHeight);
      }

      if (cell.text) {
        doc.setFont("helvetica", cell.bold ? "bold" : "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(15, 23, 42); // slate-900

        // Truncate long text if necessary
        let txt = cell.text;
        const maxTextWidth = cell.width - 3;
        if (doc.getTextWidth(txt) > maxTextWidth) {
          while (txt.length > 3 && doc.getTextWidth(txt + "…") > maxTextWidth) {
            txt = txt.slice(0, -1);
          }
          txt += "…";
        }

        let textX = cellX + 1.5;
        if (cell.align === "center") {
          textX = cellX + cell.width / 2;
        }
        doc.text(txt, textX, currentY + 4.6, { align: cell.align });
      }

      cellX += cell.width;
    });

    currentY += rowHeight;
  });

  // Check if signature section fits on current page (requires ~30mm)
  const signatureHeight = 32;
  if (currentY + signatureHeight > pageHeight - footerHeight) {
    drawPageFooter(currentPage);
    doc.addPage("a4", "landscape");
    currentPage++;
    currentY = 12;
    // Draw mini header on final page
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text("C.S.A ART DU DÉPLACEMENT PARKOUR ORAN — VALIDATION & SIGNATURES ASSURANCE", marginLeft, currentY + 2);
    currentY += 8;
  } else {
    currentY += 4;
  }

  // Draw Signature Boxes
  const sigBoxWidth = (contentWidth - 8) / 2;
  const sigBoxHeight = 26;

  // Club Signature Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, currentY, sigBoxWidth, sigBoxHeight, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("POUR LE CLUB (C.S.A ADD PARKOUR ORAN)", marginLeft + 3, currentY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("Le Président du Club / Secrétaire Général", marginLeft + 3, currentY + 8.5);
  doc.text("Fait à Oran, le .....................................................", marginLeft + 3, currentY + 13);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text("(Cachet officiel & Signature obligatoire)", marginLeft + sigBoxWidth / 2, currentY + 23, {
    align: "center",
  });

  // Insurance Agency Box
  const insBoxX = marginLeft + sigBoxWidth + 8;
  doc.roundedRect(insBoxX, currentY, sigBoxWidth, sigBoxHeight, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text("POUR L'AGENCE / COMPAGNIE D'ASSURANCE", insBoxX + 3, currentY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("Visa de Souscription & Quittance", insBoxX + 3, currentY + 8.5);
  doc.text("N° Police / Quittance Globale : .....................................................", insBoxX + 3, currentY + 13);
  doc.text("Date d'effet : ..... / ..... / 20.....     Échéance : ..... / ..... / 20.....", insBoxX + 3, currentY + 17.5);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text("(Cachet de l'Agence & Signature de l'Assureur)", insBoxX + sigBoxWidth / 2, currentY + 23, {
    align: "center",
  });

  // Draw footer on last page
  drawPageFooter(currentPage);

  // Update total page numbers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    // Overwrite the Page X placeholder with Page X sur Y
    doc.setFillColor(255, 255, 255);
    doc.rect(marginLeft + contentWidth - 25, pageHeight - 9, 25, 4.5, "F");
    doc.text(`Page ${i} sur ${totalPages}`, marginLeft + contentWidth, pageHeight - 6, { align: "right" });
  }

  return doc;
}
