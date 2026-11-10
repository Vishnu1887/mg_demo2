"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  User,
  Briefcase,
  Cpu,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Send,
  KeyRound,
  Info,
  MessageSquare,
  Copy,
  Check,
  X,
  Signal,
  Wifi,
  Battery
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Division, Role } from "@/lib/db/types";
import { userSignUpSchema } from "@/lib/validations";

// Website Owner Phone Configuration
const OWNER_PHONE = "8328167452";
const FORMATTED_OWNER_PHONE = "+91 8328167452";

interface OwnerSmsMessage {
  id: string;
  sender: string;
  recipient: string;
  code: string;
  body: string;
  time: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("STUDENT");
  const [divisionInterest, setDivisionInterest] = useState<Division>("orgintech");
  const [bio, setBio] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Website Owner 5-Digit Verification Gate
  const [adminCodeDigits, setAdminCodeDigits] = useState<string[]>(["", "", "", "", ""]);
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [ownerCodeError, setOwnerCodeError] = useState<string | null>(null);

  // Secret Owner SMS Handset Box State (Hidden secretly from normal applicants)
  const [ownerSmsModalOpen, setOwnerSmsModalOpen] = useState(false);
  const [ownerMessages, setOwnerMessages] = useState<OwnerSmsMessage[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load existing owner SMS messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("mgsolutions_owner_sms_inbox");
        if (stored) {
          setOwnerMessages(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to parse stored owner SMS", e);
      }
    }
  }, []);

  // Secret Global Hotkey: Press Ctrl + Shift + O (or Cmd + Shift + O) to reveal the Owner's SMS box secretly!
  useEffect(() => {
    const handleSecretKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "O" || e.key === "o")) {
        e.preventDefault();
        setOwnerSmsModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleSecretKeydown);
    return () => window.removeEventListener("keydown", handleSecretKeydown);
  }, []);

  // Timer countdown for resending code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const currentEnteredCode = adminCodeDigits.join("");
  const isCodeComplete = currentEnteredCode.length === 5;
  const isCodeVerified = dispatchedCode !== null && currentEnteredCode === dispatchedCode;

  // Handle Dispatching 5-digit code to Website Owner Phone (8328167452)
  const handleDispatchOwnerCode = () => {
    setIsDispatching(true);
    setOwnerCodeError(null);

    setTimeout(() => {
      // Generate a dynamic 5-digit verification code
      const generated = Math.floor(10000 + Math.random() * 90000).toString();
      setDispatchedCode(generated);
      setIsDispatching(false);
      setDispatchSuccess(true);
      setCountdown(45); // 45 seconds cooldown
      setAdminCodeDigits(["", "", "", "", ""]);

      // Save secretly to Owner's Handset SMS Box (Only accessible via Owner's secret triggers)
      const newSms: OwnerSmsMessage = {
        id: `sms-${Date.now()}`,
        sender: "MGSOLUTIONS-SECURE",
        recipient: FORMATTED_OWNER_PHONE,
        code: generated,
        body: `MGSolutions Security: Authorization code to register new Company Administrator account is: ${generated}. Valid for 10 minutes. Do not share with unauthorized personnel.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const updatedList = [newSms, ...ownerMessages];
      setOwnerMessages(updatedList);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("mgsolutions_owner_sms_inbox", JSON.stringify(updatedList));
      }

      // Focus first digit input
      setTimeout(() => {
        digitRefs.current[0]?.focus();
      }, 100);
    }, 900);
  };

  const handleCopyFromOwnerSms = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric single characters
    const cleaned = value.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...adminCodeDigits];
    newDigits[index] = cleaned;
    setAdminCodeDigits(newDigits);
    setOwnerCodeError(null);

    // Auto-advance to next input if digit entered
    if (cleaned && index < 4) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !adminCodeDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteCode = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 5);
    if (pasted) {
      const newDigits = ["", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setAdminCodeDigits(newDigits);
      if (pasted.length === 5) {
        digitRefs.current[4]?.focus();
      } else {
        digitRefs.current[pasted.length]?.focus();
      }
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setError(null);
    setOwnerCodeError(null);
    // Students can only belong to OrginTech or EdTech, not BBS
    if (newRole === "STUDENT" && divisionInterest === "bbs") {
      setDivisionInterest("orgintech");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOwnerCodeError(null);

    // Students cannot register for BBS
    if (role === "STUDENT" && divisionInterest === "bbs") {
      setError("Students and learners can only enroll in OrginTech or EdTech. BBS (Business Services) is for corporate business services only.");
      return;
    }

    // Company Staff / Administrator strictly requires Website Owner's 5-digit verification code
    if (role === "ADMIN") {
      if (!dispatchedCode) {
        setError(`Company Administrator registration requires authorization from the Website Owner. Please request a 5-digit code dispatched to ${FORMATTED_OWNER_PHONE}.`);
        return;
      }

      if (currentEnteredCode.length !== 5) {
        setOwnerCodeError("Please enter the complete 5-digit verification code.");
        return;
      }

      if (currentEnteredCode !== dispatchedCode) {
        setOwnerCodeError(`Invalid code. The 5-digit code does not match the token received in the Website Owner's SMS box (${FORMATTED_OWNER_PHONE}).`);
        return;
      }
    }

    // Zod validation
    const validation = userSignUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      role,
      divisionInterest,
      bio,
      adminVerificationCode: role === "ADMIN" ? currentEnteredCode : undefined,
      agreeTerms,
    });

    if (!validation.success) {
      setError(validation.error.errors[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    const res = await signUp({
      name,
      email,
      role,
      divisionInterest,
      bio,
      adminVerificationCode: role === "ADMIN" ? currentEnteredCode : undefined,
    });
    setLoading(false);

    if (res.success) {
      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/student/dashboard");
      }
    } else {
      setError(res.message || "Failed to create account");
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    router.push("/student/dashboard");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-xl space-y-8">
        {/* Header with Official 3D Metallic MG Emblem */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center justify-center group">
            <div className="relative h-16 w-16 p-2 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="MGSolutions Official Logo"
                className="h-full w-auto object-contain drop-shadow-[0_2px_12px_rgba(59,130,246,0.4)]"
              />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Create Your MGSolutions Account
          </h2>
          <p className="text-xs text-slate-400">
            Join the enterprise platform across OrginTech, EdTech, and BBS.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Role Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Account Role *
                </label>
                <span className="text-[11px] text-slate-400">
                  {role === "ADMIN" ? (
                    <span className="text-purple-400 font-medium flex items-center gap-1">
                      <Lock className="h-3 w-3 inline" /> Owner Clearance Required
                    </span>
                  ) : (
                    <span className="text-blue-400 font-medium">Student / Joining Learner</span>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Student / Joiner */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("STUDENT")}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    role === "STUDENT"
                      ? "border-blue-500 bg-blue-950/40 text-white shadow-md shadow-blue-950/50"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${role === "STUDENT" ? "bg-blue-600/20 text-blue-400" : "bg-slate-800 text-slate-500"}`}>
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Student / Joiner
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Joining</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Joining OrginTech &amp; EdTech. Learn, RSVP &amp; Enroll. (Not for BBS).
                    </div>
                  </div>
                </button>

                {/* Company Staff / Administrator */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("ADMIN")}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                    role === "ADMIN"
                      ? "border-purple-500 bg-purple-950/40 text-white shadow-md shadow-purple-950/50"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${role === "ADMIN" ? "bg-purple-600/20 text-purple-400" : "bg-slate-800 text-slate-500"}`}>
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Company Admin
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Company Staff</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      Works in the company. Requires Owner code sent to {OWNER_PHONE}.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* WEBSITE OWNER SECURITY GATE: Displayed specifically when Company Administrator is chosen */}
            {role === "ADMIN" && (
              <div className="p-4 rounded-2xl border border-purple-800/80 bg-gradient-to-b from-purple-950/50 to-slate-950/80 space-y-3.5 shadow-xl transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-700/50 text-purple-400 shrink-0 mt-0.5">
                    <ShieldAlert className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                        Website Owner Authorization Gate
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        Owner Approval
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Administrators are staff members who work in the company. To register a Company Administrator account, an exclusive 5-digit authorization code must be dispatched to the Website Owner&apos;s phone.
                    </p>
                  </div>
                </div>

                {/* Dispatch Trigger Bar */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-900/50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Smartphone className="h-4 w-4 text-purple-400 shrink-0" />
                    <span>Website Owner: <span className="font-mono font-bold text-white">{FORMATTED_OWNER_PHONE}</span></span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDispatchOwnerCode}
                    disabled={isDispatching || countdown > 0}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-950"
                  >
                    {isDispatching ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Dispatching SMS...</span>
                      </>
                    ) : countdown > 0 ? (
                      <>
                        <span>Resend in {countdown}s</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Send 5-Digit Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* DELIVERY NOTICE (Code is 100% HIDDEN on screen, NO public SMS button shown) */}
                {dispatchSuccess && (
                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-purple-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        SMS Dispatched to Website Owner ({FORMATTED_OWNER_PHONE})
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                        Status: DELIVERED
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      A 5-digit verification token was delivered to the Website Owner&apos;s handset SMS inbox. Enter the code received on the Owner&apos;s phone below to authorize your account.
                    </p>
                  </div>
                )}

                {/* 5-Digit OTP Input Cells */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-purple-400" />
                      Enter 5-Digit Code Sent to Owner ({OWNER_PHONE}) *
                    </label>
                    {isCodeVerified ? (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approved by Website Owner
                      </span>
                    ) : isCodeComplete ? (
                      <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" /> Code Mismatch
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        {currentEnteredCode.length}/5 digits
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2.5 sm:gap-3" onPaste={handlePasteCode}>
                    {[0, 1, 2, 3, 4].map((idx) => {
                      const isFilled = adminCodeDigits[idx] !== "";
                      const isSuccess = isCodeVerified;
                      const isFailed = isCodeComplete && !isCodeVerified;

                      return (
                        <input
                          key={idx}
                          ref={(el) => {
                            digitRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={adminCodeDigits[idx]}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          placeholder="•"
                          className={`w-11 h-12 text-center text-lg font-mono font-bold rounded-xl border transition-all outline-none ${
                            isSuccess
                              ? "border-emerald-500 bg-emerald-950/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                              : isFailed
                              ? "border-rose-500 bg-rose-950/30 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                              : isFilled
                              ? "border-purple-400 bg-slate-900 text-white ring-1 ring-purple-400"
                              : "border-slate-800 bg-slate-950 text-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          }`}
                        />
                      );
                    })}
                  </div>

                  {ownerCodeError && (
                    <p className="text-center text-[11px] text-rose-400 font-medium">
                      {ownerCodeError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Division Selection: Students only get OrginTech & EdTech; BBS is for Company/Corporate only */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {role === "STUDENT" ? "Joining Focus Division *" : "Company Division Assignment *"}
                </label>
                {role === "STUDENT" && (
                  <span className="text-[10px] text-amber-400/90 font-medium flex items-center gap-1">
                    <Info className="h-3 w-3" /> BBS is not open to students
                  </span>
                )}
              </div>

              {role === "STUDENT" ? (
                // Students only have OrginTech and EdTech (BBS is omitted / restricted)
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: "orgintech", label: "OrginTech", desc: "Cloud & AI Innovations", icon: Cpu, color: "text-indigo-400" },
                      { id: "edtech", label: "MGSolutions EdTech", desc: "STEM Courses & Bootcamps", icon: GraduationCap, color: "text-emerald-400" },
                    ].map((div) => {
                      const Icon = div.icon;
                      const isSelected = divisionInterest === div.id;
                      return (
                        <button
                          key={div.id}
                          type="button"
                          onClick={() => setDivisionInterest(div.id as Division)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-950/40 text-white font-semibold shadow-sm"
                              : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                          }`}
                        >
                          <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? div.color : "text-slate-500"}`} />
                          <span className="text-xs font-bold text-white">{div.label}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">{div.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
                    <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>
                      <strong>Notice:</strong> Students and learners join <strong>OrginTech</strong> and <strong>EdTech</strong> programs. <strong>BBS (Business Services)</strong> is for corporate enterprise operations and company staff.
                    </span>
                  </div>
                </div>
              ) : (
                // Company Administrators can manage all 3 divisions
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "orgintech", label: "OrginTech", icon: Cpu, color: "text-indigo-400" },
                    { id: "edtech", label: "EdTech", icon: GraduationCap, color: "text-emerald-400" },
                    { id: "bbs", label: "BBS", icon: Briefcase, color: "text-purple-400" },
                  ].map((div) => {
                    const Icon = div.icon;
                    const isSelected = divisionInterest === div.id;
                    return (
                      <button
                        key={div.id}
                        type="button"
                        onClick={() => setDivisionInterest(div.id as Division)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-950/40 text-white font-semibold shadow-sm"
                            : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                        }`}
                      >
                        <Icon className={`h-4 w-4 mb-1 ${isSelected ? div.color : "text-slate-500"}`} />
                        <span className="text-xs">{div.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start pt-1">
              <input
                id="agree-terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500 mt-0.5"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-xs text-slate-400 leading-normal">
                I agree to the MGSolutions Enterprise Platform Terms and Privacy Policy.
              </label>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              isLoading={loading}
              disabled={role === "ADMIN" && !isCodeVerified}
              className={`w-full font-semibold gap-2 h-11 text-sm shadow-lg transition-all ${
                role === "ADMIN"
                  ? isCodeVerified
                    ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/25"
                    : "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                  : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
              }`}
            >
              {role === "ADMIN" ? (
                isCodeVerified ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authorize &amp; Create Company Administrator Account</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Enter 5-Digit Code Sent to Owner ({OWNER_PHONE})</span>
                  </>
                )
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Google Workspace */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-400">Or register with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800/80 text-sm font-medium text-slate-200 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign Up with Google Workspace</span>
          </button>

          <div className="text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-semibold text-blue-400 hover:text-blue-300">
              Sign In here
            </Link>
          </div>
        </div>
      </div>

      {/* OWNER'S HANDSET / SMS BOX MODAL (Revealed only via the Owner's secret triggers) */}
      {ownerSmsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-[2.5rem] border-[6px] border-slate-700 bg-slate-950 p-4 shadow-2xl overflow-hidden text-white space-y-4">
            {/* Phone Top Notch / Speaker Bar */}
            <div className="flex items-center justify-between px-3 pt-1 text-[11px] text-slate-400 font-mono">
              <span>9:41</span>
              <div className="h-4 w-24 bg-slate-800 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <Battery className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Handset Header */}
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-sm">
                  MG
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Owner SMS Inbox
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">
                      +91 {OWNER_PHONE}
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">SIM 1 • AirTel 5G Active</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOwnerSmsModalOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Stream */}
            <div className="space-y-3 min-h-[260px] max-h-[360px] overflow-y-auto pr-1">
              {ownerMessages.length === 0 ? (
                <div className="h-[240px] flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-500">
                  <MessageSquare className="h-10 w-10 text-slate-700" />
                  <p className="text-xs text-slate-400 font-medium">No SMS messages yet</p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    When someone taps &quot;Send 5-Digit Code&quot; on the registration screen, the SMS code sent to {FORMATTED_OWNER_PHONE} will appear here.
                  </p>
                </div>
              ) : (
                ownerMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1 animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                      <span className="font-semibold text-purple-300">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl rounded-tl-sm bg-purple-950/70 border border-purple-800/60 space-y-2 shadow-lg">
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        {msg.body}
                      </p>

                      <div className="pt-1 flex items-center justify-between border-t border-purple-900/50">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 uppercase font-mono">Code:</span>
                          <span className="font-mono text-base font-extrabold text-emerald-300 tracking-wider px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
                            {msg.code}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyFromOwnerSms(msg.code)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-800/80 hover:bg-purple-700 text-purple-100 text-[11px] font-semibold transition-all"
                        >
                          {copiedCode ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Handset Footer Note */}
            <div className="pt-2 border-t border-slate-800/80 text-center">
              <p className="text-[10px] text-slate-500">
                🔒 Handset simulation for Owner: <strong>{FORMATTED_OWNER_PHONE}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}