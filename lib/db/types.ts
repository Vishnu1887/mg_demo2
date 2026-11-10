export type Role = 'STUDENT' | 'ADMIN';

export type Division = 'orgintech' | 'edtech' | 'bbs';

export type ContentCategory = 
  | 'service' 
  | 'case-study' 
  | 'course-module' 
  | 'article' 
  | 'resource';

export type EventCategory = 
  | 'hackathon' 
  | 'bootcamp' 
  | 'seminar' 
  | 'webinar' 
  | 'workshop';

export type EventStatus = 
  | 'upcoming' 
  | 'ongoing' 
  | 'completed' 
  | 'cancelled';

export type RegistrationStatus = 
  | 'confirmed' 
  | 'waitlist' 
  | 'attended' 
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
  bio?: string;
  divisionInterest?: Division;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  divisionId: Division;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: ContentCategory;
  author: string;
  coverImage?: string;
  tags: string[];
  readTime?: string;
  featured?: boolean;
  published: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  divisionId: Division;
  title: string;
  description: string;
  category: EventCategory;
  eventDate: string; // ISO date string
  duration: string;
  location: string;
  isVirtual: boolean;
  meetingUrl?: string;
  speaker: string;
  speakerRole?: string;
  coverImage?: string;
  maxAttendees: number;
  registeredCount: number;
  status: EventStatus;
  featured?: boolean;
  createdAt: string;
}

export type Event = EventItem;

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  divisionId: Division;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: Role;
  registrationDate: string;
  status: RegistrationStatus;
  notes?: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  divisionId: Division;
  progress: number; // 0 - 100
  enrolledAt: string;
  lastActivityAt: string;
}

export interface DivisionMeta {
  id: Division;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  accentColor: string;
  themeClass: string;
  features: string[];
  stats: { label: string; value: string }[];
}
