"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  Plus,
  CalendarDays,
  Image as ImageIcon,
  ScanFace,
  Download,
  Calendar,
  Copy,
  Upload,
  Share2,
  BarChart2,
  ChevronRight,
  Camera,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreateEventModal } from "@/components/CreateEventModal";

interface ApiEvent {
  id: string;
  name: string;
  eventType: string;
  eventDate: string;
  passcode: string;
  status: string;
  _count: { photos: number; scanSessions: number };
}

interface DashboardStats {
  totalEvents: number;
  totalPhotos: number;
  totalScans: number;
}

const coverColors: Record<string, string> = {
  Wedding: "from-rose-500/20 to-pink-900/20",
  Concert: "from-violet-500/20 to-purple-900/20",
  "College Event": "from-blue-500/20 to-indigo-900/20",
  Corporate: "from-green-500/20 to-emerald-900/20",
  Birthday: "from-amber-500/20 to-orange-900/20",
  Sports: "from-cyan-500/20 to-blue-900/20",
  Other: "from-gray-500/20 to-gray-900/20",
};

export default function DashboardHome() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      toast.error("Failed to load stats");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => fetchEvents(), 0);
    setTimeout(() => fetchStats(), 0);
  }, [fetchEvents, fetchStats]);

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast("Passcode copied!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const userName = session?.user?.name || "Photographer";

  // Show only recent 4 events
  const recentEvents = events.slice(0, 4);

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="px-4 lg:px-8 py-8 max-w-7xl mx-auto">
        
        {/* GREETING ROW */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-[#5A8A6E] text-sm">{getGreeting()} 👋</p>
            <h2 className="text-[#0A1A12] text-2xl font-bold mt-0.5">{userName}</h2>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-medium px-5 py-2.5 rounded-full transition-all flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <Plus size={16} /> Create New Event
          </motion.button>
        </div>

        {/* STATS CARDS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: CalendarDays,
              value: loadingStats ? "—" : String(stats?.totalEvents ?? 0),
              label: "Total Events",
              badge: "↑ 2 this month",
              color: "text-[#00A86B]",
              bg: "bg-[#00A86B]/10",
              badgeColor: "bg-green-500/10 text-green-400",
            },
            {
              icon: ImageIcon,
              value: loadingStats ? "—" : (stats?.totalPhotos ?? 0).toLocaleString(),
              label: "Photos Uploaded",
              badge: "↑ 340 today",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
              badgeColor: "bg-green-500/10 text-green-400",
            },
            {
              icon: ScanFace,
              value: loadingStats ? "—" : (stats?.totalScans ?? 0).toLocaleString(),
              label: "Face Scans",
              badge: "↑ 48 today",
              color: "text-purple-400",
              bg: "bg-purple-500/10",
              badgeColor: "bg-green-500/10 text-green-400",
            },
            {
              icon: Download,
              value: "—",
              label: "Downloads",
              badge: "↑ 5%",
              color: "text-green-400",
              bg: "bg-green-500/10",
              badgeColor: "bg-green-500/10 text-green-400",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#00A86B]/10 rounded-2xl p-5 hover:border-[#00A86B]/[0.18] transition-all relative"
              >
                <div className="flex justify-between items-start">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <Icon className={`size-5 ${stat.color}`} />
                  </div>
                  <div className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${stat.badgeColor}`}>
                    {stat.badge}
                  </div>
                </div>
                {loadingStats ? (
                  <div className="h-8 w-16 bg-[#00A86B]/[0.12] rounded-lg mt-4 animate-pulse" />
                ) : (
                  <h3 className="text-2xl font-bold text-[#0A1A12] mt-4">{stat.value}</h3>
                )}
                <p className="text-[#4A7A5E] text-xs mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* RECENT EVENTS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center justify-between mb-4"
        >
          <h3 className="text-[#0A1A12] font-semibold">Recent Events</h3>
          <Link href="/dashboard/events" className="text-[#00A86B] text-sm hover:underline">
            View all →
          </Link>
        </motion.div>

        {loadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#00A86B]/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-32 bg-[#00A86B]/[0.12]" />
                <div className="p-5">
                  <div className="h-4 w-48 bg-[#00A86B]/[0.12] rounded mb-2" />
                  <div className="h-3 w-32 bg-[#00A86B]/[0.12] rounded mb-4" />
                  <div className="h-3 w-24 bg-[#00A86B]/[0.12] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#00A86B]/10 rounded-2xl p-12 text-center mb-8">
            <Camera size={32} className="text-[#2A5A3E] mx-auto mb-3" />
            <p className="text-[#4A7A5E] text-sm">No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mb-8">
            {recentEvents.map((ev, i) => (
              <Link key={ev.id} href={`/dashboard/events/${ev.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                  className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#00A86B]/10 rounded-2xl overflow-hidden group hover:border-[#00A86B]/20 transition-all duration-300 block"
                >
                  {/* Cover Area */}
                  <div className={`h-32 relative bg-gradient-to-br ${coverColors[ev.eventType] || coverColors.Other}`}>
                    <div className="absolute top-3 right-3">
                      {ev.status === "ACTIVE" ? (
                        <span className="bg-green-500/20 text-green-400 border border-green-500/20 text-xs px-2.5 py-1 rounded-full">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="bg-[#00A86B]/[0.12] text-[#4A7A5E] border border-[#00A86B]/[0.18] text-xs px-2.5 py-1 rounded-full">
                          ARCHIVED
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-[#4A7A5E] text-xs px-2.5 py-1 rounded-full">
                      {ev.eventType}
                    </div>
                    <Camera className="absolute top-3 left-3 text-[#00A86B]/25 size-5" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-black text-[#00A86B]/[0.12] select-none">
                        {getInitials(ev.name)}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[#0A1A12] font-semibold text-sm group-hover:text-[#00A86B] transition-colors truncate max-w-[200px] sm:max-w-[250px]">
                          {ev.name}
                        </h4>
                        <p className="text-[#4A7A5E] text-xs mt-1 flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(ev.eventDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5 text-[#4A7A5E] text-xs">
                        <ImageIcon size={12} className="text-[#3A6A4E]" />
                        {ev._count.photos} photos
                      </div>
                      <div className="flex items-center gap-1.5 text-[#4A7A5E] text-xs">
                        <ScanFace size={12} className="text-[#3A6A4E]" />
                        {ev._count.scanSessions} scans
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#00A86B]/10">
                      <div className="flex items-center gap-2">
                        <span className="text-[#9ABFAD] text-xs">Code</span>
                        <span className="bg-[#00A86B]/10 text-[#00A86B] font-mono text-xs px-2.5 py-1 rounded-full">
                          {ev.passcode}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleCopy(e, ev.passcode)}
                        className="text-[#3A6A4E] hover:text-[#00A86B] transition-colors p-1"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {/* QUICK ACTIONS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: Upload,
              title: "Upload Photos",
              subtitle: "Select an event to upload",
              href: "/dashboard/events",
              bg: "bg-[#00A86B]/10",
              color: "text-[#00A86B]",
            },
            {
              icon: Share2,
              title: "Share Event",
              subtitle: "Send passcode to guests",
              href: "/dashboard/events",
              bg: "bg-blue-500/10",
              color: "text-blue-400",
            },
            {
              icon: BarChart2,
              title: "Analytics",
              subtitle: "See download stats",
              href: "/dashboard/analytics",
              bg: "bg-purple-500/10",
              color: "text-purple-400",
            },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} href={action.href}>
                <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] rounded-2xl p-5 border border-[#00A86B]/10 flex items-center gap-4 hover:border-[#00A86B]/30 transition-all cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${action.bg}`}>
                    <Icon className={action.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0A1A12] font-medium text-sm group-hover:text-[#00A86B] transition-colors">
                      {action.title}
                    </p>
                    <p className="text-[#4A7A5E] text-xs mt-0.5">{action.subtitle}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#9ABFAD] group-hover:text-[#00A86B] transition-colors" />
                </div>
              </Link>
            );
          })}
        </motion.div>

      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => {
          setTimeout(() => fetchEvents(), 0);
          setTimeout(() => fetchStats(), 0);
        }}
      />
    </DashboardLayout>
  );
}
