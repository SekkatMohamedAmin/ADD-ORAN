"use client";

import React from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  Clock,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CreditCard,
  Check,
  ShieldCheck,
  Archive,
  FileEdit,
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
  | "ARCHIVED"
  | "DRAFT"
  | string;

interface StatusBadgeProps {
  status: RegistrationStatus;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, label, size = "md" }: StatusBadgeProps) {
  const { t, locale } = useLanguage();
  const isArabic = locale === "ar";

  let badgeStyle = "status-submitted";
  let Icon = Clock;

  switch (status) {
    case "SUBMITTED":
      badgeStyle = "status-submitted";
      Icon = Clock;
      break;

    case "UNDER_REVIEW":
      badgeStyle = "status-under-review";
      Icon = Search;
      break;

    case "NEEDS_CORRECTION":
      badgeStyle = "status-needs-correction";
      Icon = AlertTriangle;
      break;

    case "ACCEPTED":
      badgeStyle = "status-accepted";
      Icon = CheckCircle2;
      break;

    case "REJECTED":
      badgeStyle = "status-rejected";
      Icon = XCircle;
      break;

    case "PAYMENT_PENDING":
      badgeStyle = "status-payment-pending";
      Icon = CreditCard;
      break;

    case "PAID":
      badgeStyle = "status-paid";
      Icon = Check;
      break;

    case "ACTIVE":
      badgeStyle = "status-active";
      Icon = ShieldCheck;
      break;

    case "ARCHIVED":
      badgeStyle = "bg-white/5 text-[#9E9EA8] border border-white/15";
      Icon = Archive;
      break;

    case "DRAFT":
      badgeStyle = "bg-white/5 text-[#9E9EA8] border border-white/10";
      Icon = FileEdit;
      break;

    default:
      badgeStyle = "bg-white/5 text-[#9E9EA8] border border-white/10";
      Icon = Clock;
      break;
  }

  // Localized label lookup from dictionary
  const translatedStatus =
    t.statuses?.[status as keyof typeof t.statuses] || status;
  const displayLabel = label || translatedStatus;

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2.5 py-0.5 gap-1.5"
      : size === "lg"
      ? "text-sm px-4 py-2 gap-2"
      : "text-xs px-3 py-1 gap-1.5";

  const iconSizes =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5";

  return (
    <span
      className={`inline-flex items-center font-medium tracking-wide rounded-full shadow-sm transition-colors ${
        isArabic ? "font-arabic text-[11px]" : "font-mono uppercase text-[10px]"
      } ${badgeStyle} ${sizeClasses}`}
    >
      <Icon className={`${iconSizes} shrink-0`} />
      <span className="leading-none">{displayLabel}</span>
    </span>
  );
}

export default StatusBadge;
