"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface DocumentItem {
  id: string;
  type: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  status: string;
  rejectionReason?: string | null;
  createdAt: string;
}

export interface PaymentItem {
  id: string;
  receiptNumber: string;
  amount: number;
  paymentMethod: string;
  paymentPurpose: string;
  status: string;
  paidAt: string;
}

export interface DisciplineItem {
  id: string;
  discipline: {
    id: string;
    slug: string;
    nameFr: string;
    nameAr: string;
    nameEn: string;
  };
}

export interface RegistrationItem {
  id: string;
  reference: string;
  status: string;
  correctionReason?: string | null;
  correctionFields?: string | null;
  submittedAt: string;
  season: {
    id: string;
    code: string;
    label: string;
  };
  disciplines: DisciplineItem[];
  documents: DocumentItem[];
  payments: PaymentItem[];
  parentalAuthorization?: {
    id: string;
    guardianName?: string | null;
    declarationAccepted: boolean;
  } | null;
}

export interface ParticipantData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  phone: string;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  bloodType?: string | null;
  isMinor: boolean;
  membershipCardNumber?: string | null;
  registrations: RegistrationItem[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  discipline: string;
  category: string;
  date: string;
  location: string;
  capacity?: number | null;
  attendeeCount: number;
  isAttending: boolean;
}

interface PortalContextType {
  loading: boolean;
  userPhone: string;
  userId: string;
  participants: ParticipantData[];
  selectedParticipantId: string;
  setSelectedParticipantId: (id: string) => void;
  selectedParticipant: ParticipantData | null;
  activeRegistration: RegistrationItem | null;
  isFamilyAccount: boolean;
  hasPendingCorrection: boolean;
  refreshUserData: () => Promise<void>;
  events: EventItem[];
  eventsLoading: boolean;
  togglingEventId: string | null;
  toggleAttendance: (eventId: string) => Promise<void>;
  isAddChildModalOpen: boolean;
  openAddChildModal: () => void;
  closeAddChildModal: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>("");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [togglingEventId, setTogglingEventId] = useState<string | null>(null);

  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/login");
        return;
      }

      setUserPhone(data.user.phone || "");
      setUserId(data.user.id || "");
      const fetchedParticipants: ParticipantData[] = data.user.participants || [];
      setParticipants(fetchedParticipants);

      if (fetchedParticipants.length > 0) {
        setSelectedParticipantId((prev) => {
          if (prev && fetchedParticipants.some((p) => p.id === prev)) {
            return prev;
          }
          const needsFix = fetchedParticipants.find((p) =>
            p.registrations.some(
              (r) => r.status === "NEEDS_CORRECTION" || r.status === "REJECTED"
            )
          );
          return needsFix ? needsFix.id : fetchedParticipants[0].id;
        });
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error("Failed to fetch events:", e);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchEvents();
  }, []);

  const selectedParticipant = useMemo(() => {
    return (
      participants.find((p) => p.id === selectedParticipantId) ||
      participants[0] ||
      null
    );
  }, [participants, selectedParticipantId]);

  const activeRegistration = useMemo(() => {
    return selectedParticipant?.registrations?.[0] || null;
  }, [selectedParticipant]);

  const isFamilyAccount = useMemo(() => {
    return participants.length > 1 || participants.some((p) => p.isMinor);
  }, [participants]);

  const hasPendingCorrection = useMemo(() => {
    return (
      activeRegistration?.status === "NEEDS_CORRECTION" ||
      activeRegistration?.status === "REJECTED"
    );
  }, [activeRegistration]);

  const toggleAttendance = async (eventId: string) => {
    if (!selectedParticipant) return;
    try {
      setTogglingEventId(eventId);
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          participantId: selectedParticipant.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEvents((prev) =>
          prev.map((evt) =>
            evt.id === eventId
              ? {
                  ...evt,
                  isAttending: data.isAttending,
                  attendeeCount: data.attendeeCount,
                }
              : evt
          )
        );
      }
    } catch (err) {
      console.error("Error toggling event attendance:", err);
    } finally {
      setTogglingEventId(null);
    }
  };

  return (
    <PortalContext.Provider
      value={{
        loading,
        userPhone,
        userId,
        participants,
        selectedParticipantId,
        setSelectedParticipantId,
        selectedParticipant,
        activeRegistration,
        isFamilyAccount,
        hasPendingCorrection,
        refreshUserData: fetchUserData,
        events,
        eventsLoading,
        togglingEventId,
        toggleAttendance,
        isAddChildModalOpen,
        openAddChildModal: () => setIsAddChildModalOpen(true),
        closeAddChildModal: () => setIsAddChildModalOpen(false),
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
