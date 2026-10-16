import { prisma } from "./prisma";

export type AuditAction =
  | "REGISTRATION_SUBMITTED"
  | "REGISTRATION_REVIEWED"
  | "REGISTRATION_ACCEPTED"
  | "REGISTRATION_REJECTED"
  | "CORRECTION_REQUESTED"
  | "REGISTRATION_RESUBMITTED"
  | "DOCUMENT_VIEWED"
  | "DOCUMENT_VALIDATED"
  | "DOCUMENT_REJECTED"
  | "PAYMENT_RECORDED"
  | "PAYMENT_MODIFIED"
  | "PAYMENT_DELETED"
  | "DUPLICATE_FLAGGED"
  | "DUPLICATE_RESOLVED"
  | "MEMBER_ARCHIVED"
  | "MEMBER_ACTIVATED"
  | "MEMBERSHIP_CARD_GENERATED"
  | "PASSWORD_RESET"
  | "MEMBER_DELETED"
  | "REGISTRATION_DELETED"
  | "MEMBER_RESTORED"
  | "REGISTRATION_RESTORED"
  | "MEMBER_PURGED"
  | "REGISTRATION_PURGED";

export interface LogAuditParams {
  action: AuditAction;
  userId?: string;
  registrationId?: string;
  details?: Record<string, unknown> | string;
  ipAddress?: string;
}

export async function logAudit({
  action,
  userId,
  registrationId,
  details,
  ipAddress,
}: LogAuditParams) {
  try {
    const detailsString =
      typeof details === "object" ? JSON.stringify(details) : details;

    await prisma.auditLog.create({
      data: {
        action,
        userId: userId || null,
        registrationId: registrationId || null,
        details: detailsString || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
