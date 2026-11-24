"use client";

import React from "react";

interface FlaticonProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  active?: boolean;
}

/**
 * Bespoke Flaticon Vector Suite for ADD Parkour Oran Administration
 * High-definition dual-tone vector icons (Red #E52421 accent + crisp geometry)
 */

// 1. Dashboard: Telemetry Control Panel with Dual Needle & Sports Grid
export function FlaticonAdminDashboard({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="2.5"
        y="2.5"
        width="8"
        height="8"
        rx="2"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.9 : 0.2}
        stroke={active ? "#E52421" : "currentColor"}
        strokeWidth="1.5"
      />
      <rect
        x="13.5"
        y="2.5"
        width="8"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="2.5"
        y="13.5"
        width="8"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="13.5"
        y="13.5"
        width="8"
        height="8"
        rx="2"
        fill="#E52421"
        fillOpacity={active ? 1 : 0.6}
        stroke="#E52421"
        strokeWidth="1.5"
      />
      <circle cx="6.5" cy="6.5" r="1.5" fill="#FFFFFF" />
      <path
        d="M16 16.5L19 19.5"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 2. Registrations: Athletic Clipboard & Validation Seal
export function FlaticonAdminRegistrations({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8 3.5H16M9 3.5C9 2.67 9.67 2 10.5 2H13.5C14.33 2 15 2.67 15 3.5V5H9V3.5Z"
        fill="#E52421"
        stroke="#E52421"
        strokeWidth="1.2"
      />
      <rect
        x="4"
        y="4"
        width="16"
        height="17"
        rx="2.5"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.15 : 0.05}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="7.5"
        y1="9.5"
        x2="16.5"
        y2="9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="7.5"
        y1="13.5"
        x2="13.5"
        y2="13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="16.5"
        cy="16.5"
        r="3"
        fill="#E52421"
        stroke="#FFFFFF"
        strokeWidth="1"
      />
      <path
        d="M15.5 16.5L16.2 17.2L17.8 15.6"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 3. Participants: Athletic Team & Individual Silhouette
export function FlaticonAdminParticipants({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="9"
        cy="7"
        r="3.5"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.3 : 0.15}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M2.5 19.5C2.5 16.5 5 14 8.5 14H9.5C13 14 15.5 16.5 15.5 19.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="8.5" r="2.5" fill="#E52421" />
      <path
        d="M16 14.5C18.5 14.8 20.5 16.5 20.5 19.5"
        stroke="#E52421"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 4. Batch Cards: Smart RFID Member Badge with Chip
export function FlaticonAdminCards({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="3"
        y="4.5"
        width="18"
        height="14"
        rx="2.5"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.2 : 0.08}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="5.5"
        y="7.5"
        width="4"
        height="3"
        rx="0.5"
        fill="#FFD21F"
        stroke="#FFB800"
        strokeWidth="0.8"
      />
      <circle cx="16.5" cy="11.5" r="2" fill="#E52421" />
      <line
        x1="5.5"
        y1="13.5"
        x2="12.5"
        y2="13.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="5.5"
        y1="15.5"
        x2="9.5"
        y2="15.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 5. Seasons: Calendar Chronometer with Starting Flag
export function FlaticonAdminSeasons({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2.5"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.15 : 0.05}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="3"
        y1="9"
        x2="21"
        y2="9"
        stroke="#E52421"
        strokeWidth="1.5"
      />
      <line
        x1="7.5"
        y1="2"
        x2="7.5"
        y2="5"
        stroke="#E52421"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="16.5"
        y1="2"
        x2="16.5"
        y2="5"
        stroke="#E52421"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="7.5" cy="13.5" r="1" fill="currentColor" />
      <circle cx="12" cy="13.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="13.5" r="1" fill="#E52421" />
      <circle cx="7.5" cy="17" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="#E52421" />
      <circle cx="16.5" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

// 6. Prices: Subscription Tier Tag
export function FlaticonAdminPrices({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12.5 2.5L20.5 10.5C21.2 11.2 21.2 12.3 20.5 13L13 20.5C12.3 21.2 11.2 21.2 10.5 20.5L2.5 12.5V3.5C2.5 2.9 2.9 2.5 3.5 2.5H12.5Z"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.2 : 0.08}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="6.5" r="1.5" fill="#E52421" />
      <path
        d="M11.5 11.5L14.5 14.5M14.5 11.5L11.5 14.5"
        stroke="#FFD21F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 7. Payments: Club Treasury & Currency Voucher
export function FlaticonAdminPayments({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="2.5"
        y="5"
        width="19"
        height="14"
        rx="2.5"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.18 : 0.06}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" stroke="#E52421" strokeWidth="1.5" />
      <rect
        x="5.5"
        y="13"
        width="4"
        height="2.5"
        rx="0.5"
        fill="#FFD21F"
      />
      <circle cx="16.5" cy="14" r="1.5" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

// 8. Documents: Medical Certificate & Dossier Folder
export function FlaticonAdminDocuments({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M5 4C5 2.9 5.9 2 7 2H14L19 7V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V4Z"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.15 : 0.05}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 2V7H19" stroke="#E52421" strokeWidth="1.5" strokeLinejoin="round" />
      <line
        x1="8.5"
        y1="12"
        x2="15.5"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="8.5"
        y1="15.5"
        x2="13.5"
        y2="15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 9. Duplicates: Dual Dossier Scanner
export function FlaticonAdminDuplicates({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="3"
        y="3"
        width="12"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.05"
      />
      <rect
        x="8.5"
        y="7.5"
        width="12"
        height="13.5"
        rx="2"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.25 : 0.1}
        stroke="#E52421"
        strokeWidth="1.5"
      />
      <circle cx="14.5" cy="14" r="2" fill="#E52421" />
    </svg>
  );
}

// 10. Audit: Chronological Security Ledger with Lens
export function FlaticonAdminAudit({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.15 : 0.05}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 7V12L15 15"
        stroke="#E52421"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="#E52421" />
    </svg>
  );
}

// 11. Settings: Mechanical Precision Cogwheel
export function FlaticonAdminSettings({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="#E52421"
        fillOpacity={active ? 1 : 0.8}
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 12. Trash: Secure Recycling Container
export function FlaticonAdminTrash({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4 7H20M10 3H14M6 7L7 20C7 20.6 7.4 21 8 21H16C16.6 21 17 20.6 17 20L18 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="11"
        x2="10"
        y2="17"
        stroke="#E52421"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="11"
        x2="14"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 13. Profile: Administrator Identity
export function FlaticonAdminProfile({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.3 : 0.15}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 20C4 16.7 7.6 14 12 14C16.4 14 20 16.7 20 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="8" r="1.5" fill="#E52421" />
    </svg>
  );
}

// 14. Nature / Mountain Topography (Celebrating Murdjadjo & Kristel Outdoor Terrain)
export function FlaticonAdminNature({
  size = 20,
  className = "",
  active = false,
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3 19L9.5 8L15 17L18 12.5L22 19H3Z"
        fill={active ? "#E52421" : "currentColor"}
        fillOpacity={active ? 0.2 : 0.08}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8L12 12.5L10 14"
        stroke="#E52421"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17.5" cy="6.5" r="2" fill="#FFD21F" />
    </svg>
  );
}

// 15. PDF Document Export Badge
export function FlaticonAdminPdf({
  size = 20,
  className = "",
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M6 3H15L19 7V20C19 20.6 18.6 21 18 21H6C5.4 21 5 20.6 5 20V4C5 3.4 5.4 3 6 3Z"
        fill="#FFD21F"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 3V7H18" stroke="#FFD21F" strokeWidth="1.5" />
      <rect x="7" y="11" width="10" height="6" rx="1.5" fill="#E52421" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="5"
        fontWeight="bold"
        fill="#FFFFFF"
        fontFamily="sans-serif"
      >
        PDF
      </text>
    </svg>
  );
}

// 16. ZIP Compressed Folder
export function FlaticonAdminZip({
  size = 20,
  className = "",
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M4 5C4 3.9 4.9 3 6 3H10L12 5H18C19.1 5 20 5.9 20 7V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V5Z"
        fill="#E52421"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line x1="12" y1="9" x2="12" y2="17" stroke="#E52421" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
      <rect x="10.5" y="14" width="3" height="4" rx="0.5" fill="#E52421" />
    </svg>
  );
}

// 17. Batch Print Beacon
export function FlaticonAdminBatchPrint({
  size = 20,
  className = "",
  ...props
}: FlaticonProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M6 9V3H18V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="4"
        y="9"
        width="16"
        height="9"
        rx="2"
        fill="#E52421"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 15H17V21H7V15Z"
        fill="#06060A"
        stroke="#E52421"
        strokeWidth="1.5"
      />
      <circle cx="16.5" cy="12" r="1" fill="#FFD21F" />
    </svg>
  );
}
