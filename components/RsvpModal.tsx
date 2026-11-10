"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle2, Video, AlertCircle } from "lucide-react";
import { Event } from "@/lib/db/types";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useAuth } from "@/lib/auth/auth-context";
import { dataStore } from "@/lib/db/store";
import { formatDate } from "@/lib/utils";
import { rsvpFormSchema } from "@/lib/validations";

interface RsvpModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RsvpModal({ event, isOpen, onClose, onSuccess }: RsvpModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate with Zod
    const validation = rsvpFormSchema.safeParse({
      eventId: event.id,
      fullName,
      email,
      notes,
    });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);

    const currentUser = user || {
      id: `guest-${Date.now()}`,
      name: fullName,
      email,
      role: "STUDENT" as const,
      createdAt: new Date().toISOString(),
    };

    const res = dataStore.registerForEvent(event.id, currentUser, notes);

    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={success ? "Registration Confirmed!" : `RSVP: ${event.title}`}
      description={success ? "Your spot has been reserved successfully." : "Confirm your attendee credentials for this session."}
    >
      {success ? (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">You're on the Guestlist!</h4>
            <p className="text-sm text-slate-400 mt-1">
              A calendar invite and virtual link have been dispatched to <strong>{email}</strong>.
            </p>
          </div>
          <div className="pt-2">
            <Button size="sm" onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Summary Pill */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-medium text-slate-200">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>{formatDate(event.eventDate)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {event.duration}
              </span>
              <span className="flex items-center gap-1.5">
                {event.isVirtual ? <Video className="h-3.5 w-3.5 text-blue-400" /> : <MapPin className="h-3.5 w-3.5 text-amber-400" />}
                {event.location}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Work / Academic Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@university.edu"
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Questions or Topics you'd like covered (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Looking forward to learning about distributed consensus..."
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} className="px-5">
              Confirm RSVP
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
