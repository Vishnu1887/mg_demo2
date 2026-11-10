"use client";

import type { 
  ContentCategory, 
  ContentItem, 
  CourseEnrollment, 
  Division, 
  EventItem, 
  EventRegistration, 
  Role, 
  User 
} from "./types";
import { 
  INITIAL_CONTENT, 
  INITIAL_ENROLLMENTS, 
  INITIAL_EVENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_USERS 
} from "./mock-data";

export type Event = EventItem;

const STORAGE_KEYS = {
  EVENTS: "mgsolutions_events_v1",
  CONTENT: "mgsolutions_content_v1",
  REGISTRATIONS: "mgsolutions_registrations_v1",
  ENROLLMENTS: "mgsolutions_enrollments_v1",
  USERS: "mgsolutions_users_v1",
};

// Helper for safe client storage reading
function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch storage event so other components immediately react
    window.dispatchEvent(new CustomEvent("storage-update"));
  } catch (e) {
    console.error(`Failed to write ${key} to storage`, e);
  }
}

export const dataStore = {
  // EVENTS
  getEvents(divisionId?: Division): EventItem[] {
    const events = getStorage<EventItem[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    if (!divisionId) return events;
    return events.filter((e) => e.divisionId === divisionId);
  },

  getEventById(id: string): EventItem | undefined {
    const events = this.getEvents();
    return events.find((e) => e.id === id);
  },

  createEvent(data: Omit<EventItem, "id" | "createdAt" | "registeredCount">): EventItem {
    const events = this.getEvents();
    const newEvent: EventItem = {
      ...data,
      id: `event-${Date.now()}`,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEvent, ...events];
    setStorage(STORAGE_KEYS.EVENTS, updated);
    return newEvent;
  },

  updateEvent(id: string, updates: Partial<EventItem>): EventItem | null {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;
    const updatedEvent = { ...events[index], ...updates };
    events[index] = updatedEvent;
    setStorage(STORAGE_KEYS.EVENTS, events);
    return updatedEvent;
  },

  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length === events.length) return false;
    setStorage(STORAGE_KEYS.EVENTS, filtered);
    return true;
  },

  // CONTENT ITEMS
  getContentItems(divisionId?: Division, category?: ContentCategory): ContentItem[] {
    const items = getStorage<ContentItem[]>(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
    return items.filter((item) => {
      if (divisionId && item.divisionId !== divisionId) return false;
      if (category && item.category !== category) return false;
      return true;
    });
  },

  getContentItemById(id: string): ContentItem | undefined {
    const items = getStorage<ContentItem[]>(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
    return items.find((i) => i.id === id);
  },

  createContentItem(data: Omit<ContentItem, "id" | "createdAt" | "updatedAt">): ContentItem {
    const items = getStorage<ContentItem[]>(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
    const newItem: ContentItem = {
      ...data,
      id: `content-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...items];
    setStorage(STORAGE_KEYS.CONTENT, updated);
    return newItem;
  },

  updateContentItem(id: string, updates: Partial<ContentItem>): ContentItem | null {
    const items = getStorage<ContentItem[]>(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updatedItem;
    setStorage(STORAGE_KEYS.CONTENT, items);
    return updatedItem;
  },

  deleteContentItem(id: string): boolean {
    const items = getStorage<ContentItem[]>(STORAGE_KEYS.CONTENT, INITIAL_CONTENT);
    const filtered = items.filter((i) => i.id !== id);
    if (filtered.length === items.length) return false;
    setStorage(STORAGE_KEYS.CONTENT, filtered);
    return true;
  },

  // REGISTRATIONS
  getRegistrations(filter?: { eventId?: string; divisionId?: Division; userId?: string }): EventRegistration[] {
    const regs = getStorage<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    return regs.filter((r) => {
      if (filter?.eventId && r.eventId !== filter.eventId) return false;
      if (filter?.divisionId && r.divisionId !== filter.divisionId) return false;
      if (filter?.userId && r.userId !== filter.userId) return false;
      return true;
    });
  },

  registerForEvent(
    eventId: string,
    user: { id: string; name: string; email: string; role: Role },
    notes?: string
  ): { success: boolean; message: string; registration?: EventRegistration } {
    const regs = this.getRegistrations();
    const event = this.getEventById(eventId);
    if (!event) return { success: false, message: "Event not found" };

    // Check if user is already registered
    const existing = regs.find((r) => r.eventId === eventId && r.userId === user.id);
    if (existing) {
      return { success: false, message: "You are already registered for this event." };
    }

    if (event.registeredCount >= event.maxAttendees) {
      return { success: false, message: "This event is at maximum capacity." };
    }

    const newRegistration: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      eventTitle: event.title,
      divisionId: event.divisionId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      registrationDate: new Date().toISOString(),
      status: "confirmed",
      notes,
    };

    setStorage(STORAGE_KEYS.REGISTRATIONS, [newRegistration, ...regs]);

    // Increment event count
    this.updateEvent(eventId, {
      registeredCount: event.registeredCount + 1,
    });

    return {
      success: true,
      message: `Successfully registered for "${event.title}"!`,
      registration: newRegistration,
    };
  },

  cancelRegistration(registrationId: string): boolean {
    const regs = this.getRegistrations();
    const target = regs.find((r) => r.id === registrationId);
    if (!target) return false;

    const filtered = regs.filter((r) => r.id !== registrationId);
    setStorage(STORAGE_KEYS.REGISTRATIONS, filtered);

    // Decrement event registeredCount
    const event = this.getEventById(target.eventId);
    if (event && event.registeredCount > 0) {
      this.updateEvent(target.eventId, {
        registeredCount: event.registeredCount - 1,
      });
    }

    return true;
  },

  // COURSE ENROLLMENTS
  getEnrollments(userId?: string): CourseEnrollment[] {
    const enrollments = getStorage<CourseEnrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    if (!userId) return enrollments;
    return enrollments.filter((e) => e.userId === userId);
  },

  enrollInCourse(userId: string, courseId: string, courseTitle: string, divisionId: Division = "edtech"): { success: boolean; message: string } {
    const enrollments = getStorage<CourseEnrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const existing = enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (existing) {
      return { success: false, message: "Already enrolled in this course." };
    }

    const newEnrollment: CourseEnrollment = {
      id: `enr-${Date.now()}`,
      userId,
      courseId,
      courseTitle,
      divisionId,
      progress: 0,
      enrolledAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEYS.ENROLLMENTS, [newEnrollment, ...enrollments]);
    return { success: true, message: `Successfully enrolled in ${courseTitle}!` };
  },

  // USERS
  getUsers(): User[] {
    return getStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  addUser(user: User): void {
    const users = this.getUsers();
    setStorage(STORAGE_KEYS.USERS, [...users, user]);
  },

  // RESET
  resetToDefaults(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEYS.EVENTS);
    window.localStorage.removeItem(STORAGE_KEYS.CONTENT);
    window.localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    window.localStorage.removeItem(STORAGE_KEYS.ENROLLMENTS);
    window.localStorage.removeItem(STORAGE_KEYS.USERS);
    window.dispatchEvent(new CustomEvent("storage-update"));
  }
};
