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
  | "DUPLICATE_FLAGGED"
  | "DUPLICATE_RESOLVED"
  | "MEMBER_ARCHIVED"
  | "PASSWORD_RESET";

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
