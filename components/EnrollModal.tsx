"use client";

import React, { useState } from "react";
import { GraduationCap, CheckCircle2, BookOpen, Clock, Award } from "lucide-react";
import { ContentItem } from "@/lib/db/types";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { useAuth } from "@/lib/auth/auth-context";
import { dataStore } from "@/lib/db/store";

interface EnrollModalProps {
  course: ContentItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EnrollModal({ course, isOpen, onClose, onSuccess }: EnrollModalProps) {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnroll = () => {
    if (!user) return;
    setLoading(true);
    const res = dataStore.enrollInCourse(user.id, course.id, course.title, course.divisionId);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1400);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={success ? "Enrolled Successfully!" : `Enroll: ${course.title}`}
      description="Instant access to syllabus, interactive lab environments, and mentor hours."
    >
      {success ? (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Welcome to the Cohort!</h4>
            <p className="text-sm text-slate-400 mt-1">
              This course has been added to your Student Dashboard learning track.
            </p>
          </div>
          <div className="pt-2">
            <Button size="sm" onClick={onClose} className="w-full">
              Go to Learning Track
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white text-sm">{course.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{course.summary}</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <BookOpen className="h-3.5 w-3.5" /> Industry Verified Syllabus
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <Clock className="h-3.5 w-3.5" /> {course.readTime || "12 Weeks"}
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Award className="h-3.5 w-3.5" /> Accredited Certificate
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Enrollment Includes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Direct access to weekly instructor Q&A sessions</li>
              <li>Hands-on cloud sandboxes & graded capstone projects</li>
              <li>Exclusive hiring partner network referrals</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="division"
              division="edtech"
              isLoading={loading}
              onClick={handleEnroll}
              className="gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Confirm Free Student Enrollment</span>
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
