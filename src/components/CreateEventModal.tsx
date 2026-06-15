"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export function CreateEventModal({ isOpen, onClose, onCreated }: CreateEventModalProps) {
  const [generatedCode, setGeneratedCode] = useState("");
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateCode = () => {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setGeneratedCode(code);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Event name is required");
      return;
    }
    if (!eventDate) {
      setError("Event date is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          eventType,
          eventDate,
          passcode: generatedCode || undefined,
          description: description.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create event");
        setLoading(false);
        return;
      }

      toast.success("Event created!");
      // Reset form
      setName("");
      setEventType("Wedding");
      setEventDate("");
      setDescription("");
      setGeneratedCode("");
      setError("");
      onCreated?.();
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          >
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#00A86B]/10 rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[#0A1A12] text-xl font-bold">Create New Event</h2>
                <button
                  onClick={onClose}
                  className="text-[#4A7A5E] hover:text-[#0A1A12] rounded-full transition-colors p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                {/* Event Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#5A8A6E] font-medium">Event Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sharma & Priya Wedding"
                    className="w-full bg-[#FFFFFF] border border-[#00A86B]/20 rounded-xl px-4 py-3 text-[#0A1A12] text-sm placeholder:text-[#3A6A4E] outline-none focus:border-[#00A86B]/50 focus:ring-1 focus:ring-[#00A86B]/20 transition-all"
                  />
                </div>

                {/* Event Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#5A8A6E] font-medium">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#00A86B]/20 rounded-xl px-4 py-3 text-[#0A1A12] text-sm outline-none focus:border-[#00A86B]/50 focus:ring-1 focus:ring-[#00A86B]/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Concert">Concert</option>
                    <option value="College Event">College Event</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Event Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#5A8A6E] font-medium">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#00A86B]/20 rounded-xl px-4 py-3 text-[#0A1A12] text-sm outline-none focus:border-[#00A86B]/50 focus:ring-1 focus:ring-[#00A86B]/20 transition-all [color-scheme:dark]"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#5A8A6E] font-medium">
                    Description <span className="text-[#3A6A4E] ml-1">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the event..."
                    className="w-full bg-[#FFFFFF] border border-[#00A86B]/20 rounded-xl px-4 py-3 text-[#0A1A12] text-sm placeholder:text-[#3A6A4E] outline-none focus:border-[#00A86B]/50 focus:ring-1 focus:ring-[#00A86B]/20 transition-all resize-none"
                  />
                </div>

                {/* Passcode */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-xs text-[#5A8A6E] font-medium">Event Passcode</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generatedCode}
                      onChange={(e) => setGeneratedCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SNAP42"
                      className="flex-1 bg-[#FFFFFF] border border-[#00A86B]/20 rounded-xl px-4 py-3 text-[#0A1A12] text-sm font-mono placeholder:text-[#3A6A4E] outline-none focus:border-[#00A86B]/50 focus:ring-1 focus:ring-[#00A86B]/20 transition-all"
                    />
                    <button
                      onClick={generateCode}
                      className="bg-[#00A86B]/[0.12] hover:bg-[#00A86B]/[0.18] border border-[#00A86B]/20 text-[#0A1A12] text-sm px-4 py-3 rounded-xl transition-colors whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-[#3A6A4E] mt-1">
                    Share this code with your guests to access the event
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-transparent border border-[#00A86B]/20 text-[#0A1A12] text-sm py-3 rounded-xl hover:bg-[#00A86B]/[0.12] transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
