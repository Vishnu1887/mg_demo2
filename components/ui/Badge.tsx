import React from "react";
import { cn } from "@/lib/utils";
import { Division } from "@/lib/db/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "division";
  division?: Division;
}

export function Badge({ className, variant = "default", division, children, ...props }: BadgeProps) {
  const divisionStyles = {
    orgintech: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    edtech: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    bbs: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  const variants = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    secondary: "bg-slate-800/80 text-slate-300 border-slate-700/50",
    outline: "border border-slate-600 text-slate-300 bg-transparent",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    division: division ? divisionStyles[division] : "bg-slate-800 text-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
