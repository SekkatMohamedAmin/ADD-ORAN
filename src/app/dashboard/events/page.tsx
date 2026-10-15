"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { usePortal } from "@/components/portal/PortalContext";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Filter,
  Compass,
} from "lucide-react";

export default function DashboardEventsPage() {
  const { t } = useLanguage();
  const {
    selectedParticipant,
    events,
    eventsLoading,
    togglingEventId,
    toggleAttendance,
  } = usePortal();

  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState<string>("ALL");

  const filteredEvents = useMemo(() => {
    if (selectedDisciplineFilter === "ALL") return events;
    return events.filter(
      (e) =>
        e.discipline.toLowerCase() === selectedDisciplineFilter.toLowerCase()
    );
  }, [events, selectedDisciplineFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-[#FFD21F]" />
            <h1 className="text-2xl font-black font-display text-white">
              Événements, Jams & Séances Officielles
            </h1>
          </div>
          <p className="text-xs text-white/50 font-mono">
            Planning officiel ADD Oran • Confirmez la participation de {selectedParticipant?.firstName || "l'adhérent"}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#111116] border border-white/10 self-start sm:self-auto overflow-x-auto">
          {[
            { id: "ALL", label: "Tous" },
            { id: "Parkour", label: "Parkour" },
            { id: "Escalade", label: "Escalade" },
            { id: "Trail", label: "Trail" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedDisciplineFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedDisciplineFilter === item.id
                  ? "bg-[#E52421] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {eventsLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
          <RefreshCw className="w-8 h-8 text-[#FFD21F] animate-spin" />
          <p className="text-xs font-mono text-white/50">
            Chargement des événements...
          </p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#111116] border border-white/10 text-center space-y-3">
          <Compass className="w-12 h-12 text-white/30 mx-auto" />
          <h3 className="font-bold text-white text-base">
            Aucun événement prévu pour ce filtre
          </h3>
          <p className="text-xs text-white/50">
            Les nouvelles sessions et sorties nature seront annoncées prochainement par les encadrants.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isToggling = togglingEventId === evt.id;
            const eventDate = new Date(evt.date);

            return (
              <div
                key={evt.id}
                className="p-6 rounded-3xl bg-[#111116] border border-white/10 shadow-xl flex flex-col justify-between space-y-5 hover:border-white/20 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#E52421]/20 text-[#E52421] border border-[#E52421]/30">
                      {evt.discipline}
                    </span>
                    <span className="text-[11px] font-mono text-white/50">
                      {evt.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-[#FFD21F] transition-colors leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-white/60 mt-1.5 leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/5 text-xs font-mono text-white/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/40 shrink-0" />
                    <span>
                      {eventDate.toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/40 shrink-0" />
                    <span>
                      {eventDate.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/40 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/40 shrink-0" />
                    <span>
                      {evt.attendeeCount} participant(s) confirmé(s)
                      {evt.capacity ? ` / ${evt.capacity} places` : ""}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleAttendance(evt.id)}
                    disabled={isToggling}
                    className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                      evt.isAttending
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                        : "bg-[#FFD21F] hover:bg-[#e6bd19] text-black shadow-[#FFD21F]/10"
                    } disabled:opacity-50`}
                  >
                    {isToggling ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>
                      {evt.isAttending
                        ? t.dashboard.rsvpConfirmed
                        : t.dashboard.rsvpJoin}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Safety & Gear Checklist */}
      <div className="p-6 rounded-3xl bg-[#111116] border border-white/10 space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFD21F]" />
          <span>Consignes pour les sorties et entraînements</span>
        </h3>
        <ul className="text-xs text-white/60 space-y-1.5 list-disc list-inside">
          <li>Arrivez 15 minutes avant le début de la session pour l&apos;échauffement collectif.</li>
          <li>Munissez-vous d&apos;une gourde d&apos;eau et d&apos;une tenue de sport adaptée à la météo.</li>
          <li>La présence d&apos;un parent tuteur est recommandée pour les enfants de moins de 12 ans lors des sorties en extérieur.</li>
        </ul>
      </div>
    </div>
  );
}
