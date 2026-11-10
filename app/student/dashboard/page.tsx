"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  User as UserIcon, 
  Video, 
  MapPin, 
  ExternalLink, 
  Trash2, 
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  Edit3,
  Save
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { dataStore } from "@/lib/db/store";
import { CourseEnrollment, EventRegistration, Event as EventType } from "@/lib/db/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isStudent, updateProfile } = useAuth();

  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [divisionInterest, setDivisionInterest] = useState(user?.divisionInterest || "edtech");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadData = () => {
    if (!user) return;
    const userRegs = dataStore.getRegistrations({ userId: user.id });
    const userEnrolls = dataStore.getEnrollments(user.id);
    const allEvents = dataStore.getEvents();

    setRegistrations(userRegs);
    setEnrollments(userEnrolls);
    setEvents(allEvents);

    setName(user.name);
    setBio(user.bio || "");
    setDivisionInterest(user.divisionInterest || "edtech");
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage-update", loadData);
    return () => window.removeEventListener("storage-update", loadData);
  }, [user]);

  const handleCancelRegistration = (regId: string) => {
    if (confirm("Are you sure you want to cancel this event registration?")) {
      dataStore.cancelRegistration(regId);
      loadData();
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      bio,
      divisionInterest,
    });
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl border border-slate-800 bg-slate-900 text-center space-y-4">
        <GraduationCap className="h-12 w-12 text-blue-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Student Portal Access</h3>
        <p className="text-xs text-slate-400">Please sign in to view your enrolled courses, registered webinars, and activity history.</p>
        <Link href="/auth/signin">
          <Button className="w-full">Sign In to Continue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Dashboard Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 p-8 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-slate-800 flex items-center justify-center shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">{user?.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name}</h1>
                <Badge variant="success" className="text-[10px]">ACTIVE STUDENT</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
              <p className="text-xs text-slate-300 mt-1 line-clamp-1 italic max-w-lg">
                "{user?.bio || "Upskilling across MGSolutions Cloud & Systems Engineering."}"
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a href="#profile">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </Button>
            </a>
            <Link href="/edtech">
              <Button size="sm" variant="division" division="edtech" className="gap-1.5 text-xs">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Browse All Courses</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Registered Events</span>
            <p className="text-2xl font-bold text-white">{registrations.length}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Enrolled Courses</span>
            <p className="text-2xl font-bold text-emerald-400">{enrollments.length}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Focus Division</span>
            <p className="text-sm font-bold text-indigo-400 uppercase mt-1">{user?.divisionInterest || "OrginTech"}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Certificates Earned</span>
            <p className="text-2xl font-bold text-amber-400">1</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Courses & Events, Right = Activity & Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Enrolled Courses & Registered Events */}
        <div className="lg:col-span-2 space-y-10">
          {/* Enrolled Courses Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">My Enrolled Programs & Modules</h2>
              </div>
              <Link href="/edtech" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">
                + Enroll in More
              </Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
                <BookOpen className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">You haven't enrolled in any EdTech courses yet.</p>
                <Link href="/edtech#courses">
                  <Button size="sm" variant="division" division="edtech">
                    Explore EdTech Course Modules
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {enrollments.map((enr) => (
                  <div
                    key={enr.id}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="division" division="edtech">EdTech Module</Badge>
                        <span className="text-xs text-slate-400">Enrolled: {formatDate(enr.enrolledAt)}</span>
                      </div>
                      <h4 className="font-bold text-white text-base">{enr.courseTitle}</h4>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1 max-w-md">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Syllabus Progress</span>
                          <span className="font-semibold text-emerald-400">{enr.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(10, enr.progress)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="text-xs">
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registered Events Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Registered Events & Hackathons</h2>
              </div>
              <Link href="/#events" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                Browse Global Events
              </Link>
            </div>

            {registrations.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-3">
                <Calendar className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">No active event reservations.</p>
                <Link href="/#events">
                  <Button size="sm">RSVP to an Upcoming Hackathon</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {registrations.map((reg) => {
                  const eventDetails = events.find((e) => e.id === reg.eventId);
                  return (
                    <div
                      key={reg.id}
                      className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="division" division={reg.divisionId}>
                            {reg.divisionId.toUpperCase()}
                          </Badge>
                          <Badge variant="success">Confirmed RSVP</Badge>
                          <span className="text-xs text-slate-400">
                            Booked: {formatDate(reg.registrationDate)}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base">{reg.eventTitle}</h4>
                        {eventDetails && (
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Clock className="h-3.5 w-3.5" /> {formatDate(eventDetails.eventDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              {eventDetails.isVirtual ? <Video className="h-3.5 w-3.5 text-blue-400" /> : <MapPin className="h-3.5 w-3.5 text-amber-400" />}
                              {eventDetails.location}
                            </span>
                          </div>
                        )}
                        {reg.notes && (
                          <p className="text-xs text-slate-400 italic">Attendee note: "{reg.notes}"</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {eventDetails?.meetingUrl && (
                          <a href={eventDetails.meetingUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="text-xs gap-1">
                              <span>Join Room</span>
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCancelRegistration(reg.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Profile & Activity History */}
        <div className="space-y-8">
          {/* Profile Management Box */}
          <div id="profile" className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-blue-400" />
                Profile Settings
              </h3>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {isEditingProfile ? (
              <form onSubmit={handleProfileSave} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-300 uppercase tracking-wider">
                      Student Division Focus
                    </label>
                    <span className="text-[10px] text-amber-400">OrginTech &amp; EdTech only</span>
                  </div>
                  <select
                    value={divisionInterest === "bbs" ? "orgintech" : divisionInterest}
                    onChange={(e) => setDivisionInterest(e.target.value as any)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white text-xs"
                  >
                    <option value="orgintech">OrginTech (Cloud, AI &amp; Software Dev)</option>
                    <option value="edtech">MGSolutions EdTech (Courses &amp; Bootcamps)</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    BBS is dedicated to corporate enterprise operations and not open to student enrollment.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Bio / Career Focus
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button type="submit" size="sm" className="w-full gap-1">
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <p className="font-semibold text-white text-sm">{user?.name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span>
                  <p className="font-semibold text-white">{user?.email}</p>
                </div>
                <div>
                  <span className="text-slate-400">Primary Focus:</span>
                  <p className="font-semibold text-indigo-300 uppercase">{user?.divisionInterest}</p>
                </div>
                <div>
                  <span className="text-slate-400">Bio:</span>
                  <p className="text-slate-300 mt-0.5 leading-relaxed">{user?.bio || "No bio added yet."}</p>
                </div>
              </div>
            )}
          </div>

          {/* Activity History Feed */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="h-4 w-4 text-amber-400" />
              Activity History & Milestones
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Enrolled in Full-Stack Distributed Systems</p>
                  <span className="text-slate-400">MGSolutions EdTech Masterclass • Completed 68%</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">RSVP Confirmed for AI & Cloud Hackathon</p>
                  <span className="text-slate-400">OrginTech Division Event • Nov 2026</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Completed Enterprise Cloud Security Assessment</p>
                  <span className="text-slate-400">Accredited Score: 96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
