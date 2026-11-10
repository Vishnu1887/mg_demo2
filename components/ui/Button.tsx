import React from "react";
import { cn } from "@/lib/utils";
import { Division } from "@/lib/db/types";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "division";
  size?: "sm" | "md" | "lg";
  division?: Division;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", division, isLoading, children, disabled, ...props }, ref) => {
    const sizeStyles = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 text-base font-medium",
    };

    const divisionStyles = {
      orgintech: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20 shadow-md",
      edtech: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 shadow-md",
      bbs: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20 shadow-md",
    };

    const variantStyles = {
      primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 shadow-md",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
      outline: "border border-slate-700 hover:bg-slate-800/80 text-slate-200 bg-transparent",
      ghost: "text-slate-300 hover:bg-slate-800/60 hover:text-white bg-transparent",
      danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/25",
      division: division ? divisionStyles[division] : "bg-blue-600 hover:bg-blue-500 text-white",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
