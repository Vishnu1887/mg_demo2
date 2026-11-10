"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  FileText, 
  Users, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Layers, 
  Cpu, 
  GraduationCap, 
  Briefcase, 
  Sparkles,
  BarChart3,
  TrendingUp,
  X
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { dataStore } from "@/lib/db/store";
import { ContentCategory, ContentItem, Division, Event, EventCategory, EventRegistration, EventStatus, User } from "@/lib/db/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { eventFormSchema, contentFormSchema } from "@/lib/validations";

export default function AdminPage() {
  const { user, isAdmin, loginAs } = useAuth();

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<"analytics" | "content" | "events" | "users">("analytics");
  const [divisionFilter, setDivisionFilter] = useState<"all" | Division>("all");

  // Live Data Lists
  const [events, setEvents] = useState<Event[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);

  // Form States - Event
  const [eventForm, setEventForm] = useState({
    title: "",
    divisionId: "orgintech" as Division,
    category: "hackathon" as EventCategory,
    description: "",
    eventDate: "2026-11-20T10:00",
    duration: "2 Hours",
    location: "Virtual (Live Stream)",
    isVirtual: true,
    meetingUrl: "https://meet.mgsolutions.com/session",
    speaker: "",
    speakerRole: "",
    maxAttendees: 150,
    status: "upcoming" as EventStatus,
    featured: false,
  });

  // Form States - Content
  const [contentForm, setContentForm] = useState({
    title: "",
    divisionId: "orgintech" as Division,
    category: "service" as ContentCategory,
    summary: "",
    content: "",
    author: "",
    tags: "",
    readTime: "5 min read",
    featured: false,
    published: true,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const loadData = () => {
    setEvents(dataStore.getEvents());
    setContentItems(dataStore.getContentItems());
    setRegistrations(dataStore.getRegistrations());
    setUsers(dataStore.getUsers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage-update", loadData);
    return () => window.removeEventListener("storage-update", loadData);
  }, []);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Content Handlers
  const handleOpenCreateContent = () => {
    setEditingContent(null);
    setContentForm({
      title: "",
      divisionId: "orgintech",
      category: "service",
      summary: "",
      content: "",
      author: user?.name || "Admin Staff",
      tags: "Enterprise, Cloud, Architecture",
      readTime: "6 min read",
      featured: false,
      published: true,
    });
    setFormError(null);
    setContentModalOpen(true);
  };

  const handleOpenEditContent = (item: ContentItem) => {
    setEditingContent(item);
    setContentForm({
      title: item.title,
      divisionId: item.divisionId,
      category: item.category,
      summary: item.summary,
      content: item.content,
      author: item.author,
      tags: item.tags.join(", "),
      readTime: item.readTime || "5 min read",
      featured: !!item.featured,
      published: item.published,
    });
    setFormError(null);
    setContentModalOpen(true);
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = contentFormSchema.safeParse(contentForm);
    if (!validation.success) {
      setFormError(validation.error.errors[0]?.message || "Validation failed");
      return;
    }

    const tagArray = contentForm.tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingContent) {
      dataStore.updateContentItem(editingContent.id, {
        ...contentForm,
        tags: tagArray,
      });
      showNotice(`Updated article/service "${contentForm.title}"`);
    } else {
      dataStore.createContentItem({
        ...contentForm,
        slug: contentForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        tags: tagArray,
      });
      showNotice(`Created new content item in ${contentForm.divisionId.toUpperCase()}`);
    }

    setContentModalOpen(false);
    loadData();
  };

  const handleDeleteContent = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      dataStore.deleteContentItem(id);
      showNotice(`Deleted content "${title}"`);
      loadData();
    }
  };

  // Event Handlers
  const handleOpenCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      divisionId: "orgintech",
      category: "hackathon",
      description: "",
      eventDate: "2026-11-25T14:00",
      duration: "2 Hours",
      location: "Virtual & Hub (Hybrid)",
      isVirtual: true,
      meetingUrl: "https://meet.mgsolutions.com/session",
      speaker: user?.name || "Senior Lead",
      speakerRole: "Keynote Speaker",
      maxAttendees: 200,
      status: "upcoming",
      featured: false,
    });
    setFormError(null);
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      divisionId: event.divisionId,
      category: event.category,
      description: event.description,
      eventDate: event.eventDate.slice(0, 16),
      duration: event.duration,
      location: event.location,
      isVirtual: event.isVirtual,
      meetingUrl: event.meetingUrl || "",
      speaker: event.speaker,
      speakerRole: event.speakerRole || "",
      maxAttendees: event.maxAttendees,
      status: event.status,
      featured: !!event.featured,
    });
    setFormError(null);
    setEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = eventFormSchema.safeParse(eventForm);
    if (!validation.success) {
      setFormError(validation.error.errors[0]?.message || "Validation failed");
      return;
    }

    if (editingEvent) {
      dataStore.updateEvent(editingEvent.id, {
        ...eventForm,
        eventDate: new Date(eventForm.eventDate).toISOString(),
      });
      showNotice(`Updated event "${eventForm.title}"`);
    } else {
      dataStore.createEvent({
        ...eventForm,
        eventDate: new Date(eventForm.eventDate).toISOString(),
      });
      showNotice(`Published new event tagged to ${eventForm.divisionId.toUpperCase()}`);
    }

    setEventModalOpen(false);
    loadData();
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Are you sure you want to cancel and delete "${title}"?`)) {
      dataStore.deleteEvent(id);
      showNotice(`Deleted event "${title}"`);
      loadData();
    }
  };

  const handleStatusChange = (eventId: string, newStatus: EventStatus) => {
    dataStore.updateEvent(eventId, { status: newStatus });
    showNotice(`Event status updated to ${newStatus.toUpperCase()}`);
    loadData();
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["Registration ID", "Event Title", "Division", "User Name", "User Email", "Role", "Date", "Status", "Notes"];
    const rows = registrations.map((r) => [
      r.id,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      r.divisionId,
      `"${r.userName.replace(/"/g, '""')}"`,
      r.userEmail,
      r.userRole,
      r.registrationDate,
      r.status,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mgsolutions_event_attendees_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice("Attendee data exported as CSV");
  };

  // If visitor is not currently logged in as Administrator, prompt to sign in
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl border border-purple-500/30 bg-purple-950/20 text-center space-y-6 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            This management console requires verified Administrator privileges. Please sign in with your administrative credentials to continue.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/auth/signin">
            <Button size="md" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold">
              Sign In to Admin Portal
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter lists based on division
  const filteredContent = contentItems
    .filter((c) => divisionFilter === "all" || c.divisionId === divisionFilter)
    .filter((c) => searchQuery === "" || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.author.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredEvents = events
    .filter((e) => divisionFilter === "all" || e.divisionId === divisionFilter)
    .filter((e) => searchQuery === "" || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.speaker.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredRegistrations = registrations
    .filter((r) => divisionFilter === "all" || r.divisionId === divisionFilter)
    .filter((r) => searchQuery === "" || r.userName.toLowerCase().includes(searchQuery.toLowerCase()) || r.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) || r.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-8 backdrop-blur-sm shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="warning" className="text-xs font-bold gap-1 bg-purple-500/20 text-purple-300 border-purple-500/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              ADMINISTRATIVE CONTROL CONSOLE
            </Badge>
            <span className="text-xs text-slate-400">Signed in as {user?.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            MGSolutions Company Staff Panel
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Company Staff Operations: Content management, event scheduling, student attendee lists, and division analytics across OrginTech, EdTech, and BBS. Authorized by Website Owner.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            onClick={handleOpenCreateEvent}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 shadow-blue-500/20 font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Host New Event</span>
          </Button>
          <Button
            size="sm"
            onClick={handleOpenCreateContent}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 shadow-indigo-500/20 font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Publish Article / Service</span>
          </Button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 gap-1 overflow-x-auto">
          {[
            { id: "analytics", label: "Analytics Overview", icon: BarChart3 },
            { id: "content", label: `Content Management (${contentItems.length})`, icon: FileText },
            { id: "events", label: `Event Management (${events.length})`, icon: Calendar },
            { id: "users", label: `User & Attendees (${registrations.length})`, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Division Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium">Division Scope:</span>
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value as any)}
            className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Divisions (3)</option>
            <option value="orgintech">OrginTech (Cloud & AI)</option>
            <option value="edtech">MGSolutions EdTech</option>
            <option value="bbs">BBS (Business Services)</option>
          </select>
        </div>
      </div>

      {/* SUB-PANEL 1: ANALYTICS OVERVIEW */}
      {adminTab === "analytics" && (
        <div className="space-y-8 animate-in fade-in-50">
          {/* Quick Analytics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Registered Students & Users</span>
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{users.length}</p>
              <span className="text-[11px] text-emerald-400 font-medium">↑ Active RBAC Accounts</span>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Division Events</span>
                <Calendar className="h-4 w-4 text-purple-400" />
              </div>
              <p className="text-3xl font-extrabold text-white">{events.length}</p>
              <span className="text-[11px] text-purple-300 font-medium">Across OrginTech, EdTech, BBS</span>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Event RSVPs Confirmed</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400">{registrations.length}</p>
              <span className="text-[11px] text-slate-400">Exportable attendee records</span>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Published Knowledge Offerings</span>
                <FileText className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400">{contentItems.length}</p>
              <span className="text-[11px] text-slate-400">Services, Case Studies, Modules</span>
            </div>
          </div>

          {/* Breakdown per Division */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "orgintech" as Division,
                name: "OrginTech",
                color: "text-indigo-400 border-indigo-500/30 bg-indigo-950/20",
                icon: Cpu,
                topModule: "Autonomous AI Agents Orchestration",
              },
              {
                id: "edtech" as Division,
                name: "MGSolutions EdTech",
                color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20",
                icon: GraduationCap,
                topModule: "Full-Stack Distributed Systems Masterclass",
              },
              {
                id: "bbs" as Division,
                name: "BBS (Business Services)",
                color: "text-amber-400 border-amber-500/30 bg-amber-950/20",
                icon: Briefcase,
                topModule: "Strategic Enterprise Transformation",
              },
            ].map((d) => {
              const divEvents = events.filter((e) => e.divisionId === d.id);
              const divContent = contentItems.filter((c) => c.divisionId === d.id);
              const divRegs = registrations.filter((r) => r.divisionId === d.id);
              const Icon = d.icon;

              return (
                <div key={d.id} className={`p-6 rounded-2xl border ${d.color} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <h4 className="font-bold text-white text-base">{d.name}</h4>
                    </div>
                    <Badge variant="division" division={d.id}>Division</Badge>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span>Published Items:</span>
                      <strong className="text-white">{divContent.length}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span>Live Events Scheduled:</span>
                      <strong className="text-white">{divEvents.length}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/80">
                      <span>Total Confirmed RSVPs:</span>
                      <strong className="text-white">{divRegs.length}</strong>
                    </div>
                  </div>

                  <div className="pt-2 text-xs">
                    <span className="text-slate-400 block text-[11px] mb-1">Top Performing Module:</span>
                    <p className="font-semibold text-white truncate">{d.topModule}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-PANEL 2: CONTENT MANAGEMENT */}
      {adminTab === "content" && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search articles, services, case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <Button size="sm" onClick={handleOpenCreateContent} className="gap-1.5 text-xs">
              <Plus className="h-4 w-4" />
              <span>Add New Content Item</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="px-5 py-3">Title & Summary</th>
                    <th className="px-4 py-3">Division</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 max-w-md">
                        <p className="font-bold text-white text-sm truncate">{item.title}</p>
                        <p className="text-slate-400 line-clamp-1 mt-0.5 text-xs">{item.summary}</p>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant="division" division={item.divisionId}>
                          {item.divisionId.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap capitalize">
                        <span className="font-medium text-slate-200">{item.category}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-400">
                        {item.author}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-slate-400">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditContent(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Edit Content"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContent(item.id, item.title)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                            title="Delete Content"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PANEL 3: EVENT MANAGEMENT */}
      {adminTab === "events" && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search events, webinars, speakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <Button size="sm" onClick={handleOpenCreateEvent} className="gap-1.5 text-xs">
              <Plus className="h-4 w-4" />
              <span>Host / Schedule New Event</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="division" division={event.divisionId}>
                      {event.divisionId.toUpperCase()}
                    </Badge>
                    <select
                      value={event.status}
                      onChange={(e) => handleStatusChange(event.id, e.target.value as EventStatus)}
                      className={`text-[11px] font-bold rounded px-2 py-0.5 border ${
                        event.status === "upcoming"
                          ? "bg-blue-950 text-blue-300 border-blue-700"
                          : event.status === "completed"
                          ? "bg-slate-800 text-slate-400 border-slate-700"
                          : "bg-rose-950 text-rose-300 border-rose-800"
                      }`}
                    >
                      <option value="upcoming">UPCOMING</option>
                      <option value="ongoing">ONGOING</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>

                  <h3 className="font-bold text-white text-base line-clamp-2">{event.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{event.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(event.eventDate)} ({event.duration})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>{event.registeredCount} / {event.maxAttendees} registered</span>
                    </div>
                    <div className="text-slate-400">
                      Speaker: <strong className="text-slate-200">{event.speaker}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-auto">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditEvent(event)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit / Reschedule
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                    title="Cancel Event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-PANEL 4: USER & ATTENDEE MANAGEMENT */}
      {adminTab === "users" && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search attendee name, email, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              className="gap-2 text-xs font-semibold"
            >
              <Download className="h-4 w-4 text-blue-400" />
              <span>Export Attendee List (.CSV)</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
                  <tr>
                    <th className="px-5 py-3">Attendee Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-5 py-3">Event Registered</th>
                    <th className="px-4 py-3">Division</th>
                    <th className="px-4 py-3">Registration Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-white">
                        {reg.userName}
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {reg.userEmail}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className="text-[10px]">
                          {reg.userRole}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-200 max-w-xs truncate">
                        {reg.eventTitle}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="division" division={reg.divisionId}>
                          {reg.divisionId.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {formatDate(reg.registrationDate)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="success">CONFIRMED</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EVENT CREATE / EDIT MODAL */}
      {eventModalOpen && (
        <Modal
          isOpen={eventModalOpen}
          onClose={() => setEventModalOpen(false)}
          title={editingEvent ? "Edit Event / Reschedule" : "Host New Division Event"}
          description="Create or modify webinars, hackathons, and corporate seminars."
          maxWidth="xl"
        >
          <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="e.g. AI Autonomous Agents Hackathon 2026"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Assigned Division *
                </label>
                <select
                  value={eventForm.divisionId}
                  onChange={(e) => setEventForm({ ...eventForm, divisionId: e.target.value as any })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                >
                  <option value="orgintech">OrginTech (Cloud & AI)</option>
                  <option value="edtech">MGSolutions EdTech</option>
                  <option value="bbs">BBS (Business Services)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Event Category *
                </label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="webinar">Webinar</option>
                  <option value="seminar">Seminar</option>
                  <option value="workshop">Workshop</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                Event Description *
              </label>
              <textarea
                rows={3}
                required
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Detail the agenda, prerequisites, and learning outcomes..."
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.duration}
                  onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })}
                  placeholder="e.g. 90 Minutes"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Max Capacity
                </label>
                <input
                  type="number"
                  min="5"
                  max="10000"
                  value={eventForm.maxAttendees}
                  onChange={(e) => setEventForm({ ...eventForm, maxAttendees: parseInt(e.target.value) || 100 })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Speaker / Keynote Host *
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.speaker}
                  onChange={(e) => setEventForm({ ...eventForm, speaker: e.target.value })}
                  placeholder="e.g. Dr. Jonathan Ross"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Speaker Role
                </label>
                <input
                  type="text"
                  value={eventForm.speakerRole}
                  onChange={(e) => setEventForm({ ...eventForm, speakerRole: e.target.value })}
                  placeholder="e.g. Chief AI Architect"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                Location / Virtual Meeting URL
              </label>
              <input
                type="text"
                value={eventForm.meetingUrl}
                onChange={(e) => setEventForm({ ...eventForm, meetingUrl: e.target.value })}
                placeholder="https://meet.mgsolutions.com/session"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button type="button" variant="ghost" size="sm" onClick={() => setEventModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="px-5">
                {editingEvent ? "Save Changes" : "Publish Event"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CONTENT CREATE / EDIT MODAL */}
      {contentModalOpen && (
        <Modal
          isOpen={contentModalOpen}
          onClose={() => setContentModalOpen(false)}
          title={editingContent ? "Edit Content Item" : "Create New Content Offering"}
          description="Publish services, articles, learning modules, and case studies per tab."
          maxWidth="xl"
        >
          <form onSubmit={handleSaveContent} className="space-y-4 text-xs">
            {formError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={contentForm.title}
                onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                placeholder="e.g. Zero-Trust DevSecOps Hardening Blueprint"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Division *
                </label>
                <select
                  value={contentForm.divisionId}
                  onChange={(e) => setContentForm({ ...contentForm, divisionId: e.target.value as any })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                >
                  <option value="orgintech">OrginTech (Cloud & AI)</option>
                  <option value="edtech">MGSolutions EdTech</option>
                  <option value="bbs">BBS (Business Services)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={contentForm.category}
                  onChange={(e) => setContentForm({ ...contentForm, category: e.target.value as any })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                >
                  <option value="service">Enterprise Service</option>
                  <option value="case-study">Case Study</option>
                  <option value="course-module">Course Module</option>
                  <option value="article">Technical Article</option>
                  <option value="resource">Resource / Guide</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                Executive Summary *
              </label>
              <textarea
                rows={2}
                required
                value={contentForm.summary}
                onChange={(e) => setContentForm({ ...contentForm, summary: e.target.value })}
                placeholder="High-level overview (1-2 sentences)..."
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">
                Content Body & Architecture *
              </label>
              <textarea
                rows={4}
                required
                value={contentForm.content}
                onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                placeholder="In-depth technical content, methodologies, and findings..."
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Author / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.author}
                  onChange={(e) => setContentForm({ ...contentForm, author: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  Tags (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={contentForm.tags}
                  onChange={(e) => setContentForm({ ...contentForm, tags: e.target.value })}
                  placeholder="Cloud, AI, Rust, Security"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button type="button" variant="ghost" size="sm" onClick={() => setContentModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="px-5">
                {editingContent ? "Save Changes" : "Publish Content"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
