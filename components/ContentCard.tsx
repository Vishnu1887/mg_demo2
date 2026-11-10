"use client";

import React, { useState } from "react";
import { 
  FileText, 
  BookOpen, 
  Briefcase, 
  Layers, 
  Download, 
  ArrowRight, 
  User as UserIcon, 
  Clock,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { ContentCategory, ContentItem } from "@/lib/db/types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { EnrollModal } from "./EnrollModal";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { dataStore } from "@/lib/db/store";

interface ContentCardProps {
  item: ContentItem;
  showDivisionBadge?: boolean;
}

export function ContentCard({ item, showDivisionBadge = true }: ContentCardProps) {
  const { user } = useAuth();
  const [readModalOpen, setReadModalOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);

  const enrollments = user ? dataStore.getEnrollments(user.id) : [];
  const isEnrolled = enrollments.some((e) => e.courseId === item.id);

  const categoryConfigs: Record<ContentCategory, { label: string; icon: any; color: string }> = {
    service: { label: "Enterprise Service", icon: Briefcase, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
    "case-study": { label: "Client Case Study", icon: Layers, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    "course-module": { label: "Course Module", icon: BookOpen, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    article: { label: "Technical Insight", icon: FileText, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    resource: { label: "Resource & Guide", icon: Download, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  };

  const divisionLabels = {
    orgintech: "OrginTech",
    edtech: "EdTech",
    bbs: "BBS Advisory",
  };

  const category = categoryConfigs[item.category] || categoryConfigs.article;
  const CategoryIcon = category.icon;
  const isCourse = item.category === "course-module";

  return (
    <>
      <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:shadow-2xl relative group overflow-hidden">
        {/* Cover Image preview if available */}
        {item.coverImage && (
          <div className="h-44 w-full -mx-6 -mt-6 mb-5 overflow-hidden relative">
            <img
              src={item.coverImage}
              alt={item.title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>
        )}

        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {showDivisionBadge && (
              <Badge variant="division" division={item.divisionId}>
                {divisionLabels[item.divisionId]}
              </Badge>
            )}
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border", category.color)}>
              <CategoryIcon className="h-3 w-3" />
              <span>{category.label}</span>
            </span>
          </div>

          {item.readTime && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.readTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {item.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author & Footer Action */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800/80 mt-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <UserIcon className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate max-w-[140px]">{item.author}</span>
          </div>

          <div className="flex items-center gap-2">
            {isCourse && isEnrolled ? (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Enrolled
              </span>
            ) : isCourse ? (
              <Button
                size="sm"
                variant="division"
                division="edtech"
                onClick={() => setEnrollModalOpen(true)}
                className="text-xs h-8 px-3"
              >
                Enroll Free
              </Button>
            ) : null}

            <Button
              size="sm"
              variant="outline"
              onClick={() => setReadModalOpen(true)}
              className="text-xs h-8 px-3 gap-1 hover:border-slate-600"
            >
              <span>Explore</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reading / Detail Modal */}
      {readModalOpen && (
        <Modal
          isOpen={readModalOpen}
          onClose={() => setReadModalOpen(false)}
          title={item.title}
          description={`${category.label} • Published by ${item.author}`}
          maxWidth="xl"
        >
          <div className="space-y-5 text-slate-300">
            {item.coverImage && (
              <div className="h-56 w-full rounded-xl overflow-hidden">
                <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <Badge variant="division" division={item.divisionId}>
                {divisionLabels[item.divisionId]}
              </Badge>
              <Badge variant="secondary">{item.readTime}</Badge>
              {item.tags.map((t, i) => (
                <span key={i} className="text-slate-400">#{t}</span>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Executive Overview
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {item.summary}
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-slate-300 border-t border-slate-800 pt-4">
              <h4 className="text-sm font-semibold text-white">Full Analysis & Documentation:</h4>
              <p>{item.content}</p>
              <p>
                MGSolutions actively implements these frameworks across our enterprise partner portfolios, maintaining stringent compliance, low latency execution, and clear ROI metrics.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {isCourse ? (
                <Button
                  size="sm"
                  variant="division"
                  division="edtech"
                  onClick={() => {
                    setReadModalOpen(false);
                    setEnrollModalOpen(true);
                  }}
                  className="gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Enroll in Program</span>
                </Button>
              ) : (
                <span className="text-xs text-slate-400">
                  Reference ID: {item.id}
                </span>
              )}

              <Button size="sm" variant="ghost" onClick={() => setReadModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Enrollment Modal */}
      {enrollModalOpen && (
        <EnrollModal
          course={item}
          isOpen={enrollModalOpen}
          onClose={() => setEnrollModalOpen(false)}
        />
      )}
    </>
  );
}
