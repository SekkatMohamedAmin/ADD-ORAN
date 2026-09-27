"use client";

import React from "react";
import {
  Clock,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CreditCard,
  Check,
  ShieldCheck,
} from "lucide-react";

export type RegistrationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "NEEDS_CORRECTION"
  | "ACCEPTED"
  | "REJECTED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "ACTIVE"
  | string;

interface StatusBadgeProps {
  status: RegistrationStatus;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  let badgeStyle = "status-submitted";
  let Icon = Clock;
  let defaultLabel = status;

  switch (status) {
    case "SUBMITTED":
      badgeStyle = "status-submitted";
      Icon = Clock;
      defaultLabel = "Dossier Soumis";
      break;

    case "UNDER_REVIEW":
      badgeStyle = "status-under-review";
      Icon = Search;
      defaultLabel = "En cours d'examen";
      break;

    case "NEEDS_CORRECTION":
      badgeStyle = "status-needs-correction";
      Icon = AlertTriangle;
      defaultLabel = "Correction requise";
      break;

    case "ACCEPTED":
      badgeStyle = "status-accepted";
      Icon = CheckCircle2;
      defaultLabel = "Dossier Validé";
      break;

    case "REJECTED":
      badgeStyle = "status-rejected";
      Icon = XCircle;
      defaultLabel = "Dossier Refusé";
      break;

    case "PAYMENT_PENDING":
      badgeStyle = "status-payment-pending";
      Icon = CreditCard;
      defaultLabel = "Paiement en attente";
      break;

    case "PAID":
      badgeStyle = "status-paid";
      Icon = Check;
      defaultLabel = "Cotisation Réglée";
      break;

    case "ACTIVE":
      badgeStyle = "status-active";
      Icon = ShieldCheck;
      defaultLabel = "Adhérent Actif";
      break;

    default:
      badgeStyle = "bg-[#072538] text-[#8faec5] border border-[#17425f]";
      Icon = Clock;
      defaultLabel = status;
      break;
  }

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 gap-1"
      : size === "lg"
      ? "text-sm px-4 py-2 gap-2"
      : "text-xs px-3 py-1 gap-1.5";

  const iconSizes = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5";

  return (
    <span
      className={`inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-full ${badgeStyle} ${sizeClasses}`}
    >
      <Icon className={`${iconSizes} shrink-0`} />
      <span>{label || defaultLabel}</span>
    </span>
  );
}
