import { z } from "zod";

// User Authentication Schemas
export const userSignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type UserSignInInput = z.infer<typeof userSignInSchema>;

export const userSignUpSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  role: z.enum(["STUDENT", "ADMIN"]).default("STUDENT"),
  divisionInterest: z.enum(["orgintech", "edtech", "bbs"]).default("orgintech"),
  bio: z.string().max(300, "Bio cannot exceed 300 characters").optional(),
  adminVerificationCode: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms of service",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.role === "STUDENT" && data.divisionInterest === "bbs") {
    return false;
  }
  return true;
}, {
  message: "Students and learners can only enroll in OrginTech or EdTech. BBS (Business Services) is reserved for corporate clients and company staff.",
  path: ["divisionInterest"],
}).refine((data) => {
  if (data.role === "ADMIN") {
    return data.adminVerificationCode && data.adminVerificationCode.trim().length === 5;
  }
  return true;
}, {
  message: "5-digit authorization code sent to the Website Owner (+91 8328167452) is required for Company Staff Administrator accounts",
  path: ["adminVerificationCode"],
});

export type UserSignUpInput = z.infer<typeof userSignUpSchema>;

// Event Management Schemas
export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title too long"),
  divisionId: z.enum(["orgintech", "edtech", "bbs"], {
    errorMap: () => ({ message: "Please select a valid division" }),
  }),
  category: z.enum(["hackathon", "bootcamp", "seminar", "webinar", "workshop"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eventDate: z.string().min(1, "Event date and time is required"),
  duration: z.string().min(2, "Duration is required (e.g., '2 Hours', 'Full Day')"),
  location: z.string().min(2, "Location is required (e.g. 'Virtual', 'MGSolutions Tech Hub')"),
  isVirtual: z.boolean().default(true),
  meetingUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  speaker: z.string().min(2, "Speaker name is required"),
  speakerRole: z.string().optional(),
  maxAttendees: z.coerce.number().min(5, "Capacity must be at least 5").max(10000, "Capacity too large"),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).default("upcoming"),
  featured: z.boolean().default(false),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;

// Content Management Schemas
export const contentFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150, "Title too long"),
  divisionId: z.enum(["orgintech", "edtech", "bbs"], {
    errorMap: () => ({ message: "Please select a valid division" }),
  }),
  category: z.enum(["service", "case-study", "course-module", "article", "resource"]),
  summary: z.string().min(10, "Summary must be at least 10 characters").max(280, "Summary too long"),
  content: z.string().min(20, "Content body must be at least 20 characters"),
  author: z.string().min(2, "Author is required"),
  tags: z.string().min(1, "Provide at least one tag (comma-separated)"),
  readTime: z.string().default("5 min read"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type ContentFormInput = z.infer<typeof contentFormSchema>;

// Event RSVP Registration Schema
export const rsvpFormSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  notes: z.string().max(200, "Notes too long").optional(),
});

export type RsvpFormInput = z.infer<typeof rsvpFormSchema>;
