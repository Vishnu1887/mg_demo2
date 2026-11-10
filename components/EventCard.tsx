"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  CheckCircle2, 
  ExternalLink,
  Tag,
  ArrowRight
} from "lucide-react";
import { Event } from "@/lib/db/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { cn, formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { dataStore } from "@/lib/db/store";
import { RsvpModal } from "./RsvpModal";

interface EventCardProps {
  event: Event;
  onRegisteredChange?: () => void;
  showDivisionBadge?: boolean;
}

export function EventCard({ event, onRegisteredChange, showDivisionBadge = true }: EventCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if current user is registered
  const userRegistrations = user ? dataStore.getRegistrations({ userId: user.id }) : [];
  const isRegistered = userRegistrations.some((r) => r.eventId === event.id);

  const divisionThemes = {
    orgintech: {
      border: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      accent: "text-indigo-400",
      buttonDivision: "orgintech" as const,
      tag: "OrginTech"
    },
    edtech: {
      border: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      accent: "text-emerald-400",
      buttonDivision: "edtech" as const,
      tag: "MGSolutions EdTech"
    },
    bbs: {
      border: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      accent: "text-amber-400",
      buttonDivision: "bbs" as const,
      tag: "BBS Advisory"
    },
  };

  const theme = divisionThemes[event.divisionId] || divisionThemes.orgintech;
  const isFull = event.registeredCount >= event.maxAttendees;
  const spotsLeft = Math.max(0, event.maxAttendees - event.registeredCount);

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 relative group overflow-hidden",
          theme.border
        )}
      >
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {showDivisionBadge && (
              <Badge variant="division" division={event.divisionId}>
                {theme.tag}
              </Badge>
            )}
            <Badge variant="secondary" className="capitalize text-[11px]">
              <Tag className="h-3 w-3 mr-1 opacity-70" />
              {event.category}
            </Badge>
          </div>

          {event.isVirtual ? (
            <Badge variant="outline" className="text-blue-400 border-blue-500/30 gap-1 text-[11px]">
              <Video className="h-3 w-3" />
              Virtual
            </Badge>
          ) : (
            <Badge variant="outline" className="text-slate-300 border-slate-700 gap-1 text-[11px]">
              <MapPin className="h-3 w-3" />
              In-Person
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
          {event.description}
        </p>

        {/* Metadata Details */}
        <div className="space-y-2.5 py-4 border-t border-b border-slate-800/80 text-xs text-slate-300 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-200">{formatDate(event.eventDate)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <span>{event.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400 shrink-0" />
              <span className={cn(isFull ? "text-rose-400 font-semibold" : "text-slate-400")}>
                {event.registeredCount} / {event.maxAttendees} attendees
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-1">
            <span className="text-slate-400 font-medium">Speaker:</span>
            <span className="text-slate-200 font-semibold truncate">
              {event.speaker} {event.speakerRole && <span className="font-normal text-slate-400">({event.speakerRole})</span>}
            </span>
          </div>
        </div>

        {/* Bottom CTA / RSVP Action */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <div className="text-xs">
            {isFull ? (
              <span className="text-rose-400 font-medium">Waitlist Only</span>
            ) : (
              <span className="text-slate-400">
                <strong className={theme.accent}>{spotsLeft}</strong> spots remaining
              </span>
            )}
          </div>

          {isRegistered ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                RSVP Confirmed
              </span>
            </div>
          ) : (
            <Button
              size="sm"
              variant="division"
              division={theme.buttonDivision}
              disabled={isFull}
              onClick={() => setRsvpOpen(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <span>{isFull ? "Fully Booked" : "Register / RSVP"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* RSVP Modal */}
      {rsvpOpen && (
        <RsvpModal
          event={event}
          isOpen={rsvpOpen}
          onClose={() => setRsvpOpen(false)}
          onSuccess={() => {
            setRsvpOpen(false);
            if (onRegisteredChange) onRegisteredChange();
          }}
        />
      )}
    </>
  );
}
