"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Calendar,
  Image as ImageIcon,
  ScanFace,
  Copy,
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

const coverColors: Record<string, string> = {
  Wedding: "from-rose-500/20 to-pink-900/20",
  Concert: "from-violet-500/20 to-purple-900/20",
  "College Event": "from-blue-500/20 to-indigo-900/20",
  Corporate: "from-green-500/20 to-emerald-900/20",
  Birthday: "from-amber-500/20 to-orange-900/20",
  Sports: "from-cyan-500/20 to-blue-900/20",
  Other: "from-gray-500/20 to-gray-900/20",
};

export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      } else {
        toast.error("Failed to load events");
      }
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => fetchEvents(), 0);
  }, [fetchEvents]);

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

  const filteredEvents = events
    .filter((ev) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Active") return ev.status === "ACTIVE";
      if (activeFilter === "Archived") return ev.status === "ARCHIVED";
      return true;
    })
    .filter((ev) => {
      if (!searchQuery) return true;
      return ev.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <DashboardLayout pageTitle="My Events">
      <div className="px-4 lg:px-8 py-8 max-w-7xl mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-[#0A1A12]">My Events</h2>
            <p className="text-[#4A7A5E] text-sm mt-1">{events.length} events total</p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-medium px-5 py-2.5 rounded-full transition-all flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
          >
            <Plus size={16} /> Create New Event
          </motion.button>
        </div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A6A4E]" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-xl pl-10 pr-4 py-2.5 text-[#0A1A12] text-sm outline-none focus:border-[#00A86B]/50 focus:ring-1 focus:ring-[#00A86B]/20 transition-all placeholder:text-[#3A6A4E]"
            />
          </div>

          <div className="flex items-center justify-between lg:justify-start gap-3 flex-1">
            {/* Filter Pills */}
            <div className="flex gap-2">
              {["All", "Active", "Archived"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-xs px-4 py-2 rounded-full transition-colors font-medium ${
                    activeFilter === filter
                      ? "bg-[#00A86B] text-[#0A1A12]"
                      : "bg-[#F0F7F3] border border-[#00A86B]/[0.12] text-[#4A7A5E] hover:text-[#0A1A12] hover:border-[#00A86B]/20"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="ml-auto lg:ml-0">
              <select className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-xl px-3 py-2.5 text-[#4A7A5E] text-sm outline-none focus:border-[#00A86B]/50 cursor-pointer appearance-none">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Most Photos</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* EVENTS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-32 bg-[#00A86B]/[0.12]" />
                <div className="p-5">
                  <div className="h-4 w-48 bg-[#00A86B]/[0.12] rounded mb-2" />
                  <div className="h-3 w-32 bg-[#00A86B]/[0.12] rounded mb-4" />
                  <div className="h-3 w-24 bg-[#00A86B]/[0.12] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-2xl p-12 text-center mb-8">
            <Camera size={32} className="text-[#2A5A3E] mx-auto mb-3" />
            <p className="text-[#4A7A5E] text-sm">
              {events.length === 0
                ? "No events yet. Create your first event!"
                : "No events match your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
            {filteredEvents.map((ev, i) => (
              <Link key={ev.id} href={`/dashboard/events/${ev.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                  className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-2xl overflow-hidden group hover:border-[#00A86B]/20 transition-all duration-300 block h-full flex flex-col"
                >
                  {/* Cover Area */}
                  <div className={`h-32 relative bg-gradient-to-br ${coverColors[ev.eventType] || coverColors.Other} shrink-0`}>
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
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[#0A1A12] font-semibold text-sm group-hover:text-[#00A86B] transition-colors line-clamp-1">
                          {ev.name}
                        </h4>
                        <p className="text-[#4A7A5E] text-xs mt-1 flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(ev.eventDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 mb-4">
                      <div className="flex items-center gap-1.5 text-[#4A7A5E] text-xs">
                        <ImageIcon size={12} className="text-[#3A6A4E]" />
                        {ev._count.photos} photos
                      </div>
                      <div className="flex items-center gap-1.5 text-[#4A7A5E] text-xs">
                        <ScanFace size={12} className="text-[#3A6A4E]" />
                        {ev._count.scanSessions} scans
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#00A86B]/[0.12]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#3A6A4E] text-xs">Code</span>
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
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchEvents}
      />
    </DashboardLayout>
  );
}
