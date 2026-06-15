"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Image as ImageIcon,
  ScanFace,
  QrCode,
  Upload,
  Download,
  Trash2,
  Copy,
  Share2,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface ApiEvent {
  id: string;
  name: string;
  eventType: string;
  eventDate: string;
  passcode: string;
  status: string;
  _count: { photos: number; scanSessions: number };
}

interface ApiPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: string;
  aspectRatio: number;
}

export default function SingleEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: eventId } = React.use(params);

  const [eventData, setEventData] = useState<ApiEvent | null>(null);
  const [photos, setPhotos] = useState<ApiPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [indexingStatus, setIndexingStatus] = useState<{ status: string; indexed: number; total: number } | null>(null);

  const fetchEventData = useCallback(async () => {
    try {
      const [eventRes, photosRes] = await Promise.all([
        fetch(`/api/events/${eventId}`),
        fetch(`/api/events/${eventId}/photos`)
      ]);
      
      if (eventRes.ok && photosRes.ok) {
        const ev = await eventRes.json();
        const ph = await photosRes.json();
        setEventData(ev);
        setPhotos(ph.photos || ph || []);
      } else {
        toast.error("Failed to load event details");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    setTimeout(() => fetchEventData(), 0);
  }, [fetchEventData]);

  // Polling for indexing status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}/status`);
        if (res.ok) {
          const data = await res.json();
          setIndexingStatus(data);
          
          if (data.status === 'LIVE' || data.status === 'ERROR') {
            clearInterval(interval);
            if (data.status === 'LIVE' && indexingStatus?.status === 'INDEXING') {
              toast.success("Indexing complete!");
            }
          }
        }
      } catch (err) {
        // ignore polling errors
      }
    };

    if (indexingStatus?.status === 'INDEXING' || eventData?.status === 'INDEXING') {
       interval = setInterval(checkStatus, 5000);
    } else {
       checkStatus();
       interval = setInterval(checkStatus, 5000);
    }
    
    return () => clearInterval(interval);
  }, [eventId, eventData?.status, indexingStatus?.status]);


  const handleCopyLink = () => {
    if (!eventData) return;
    navigator.clipboard.writeText(`${window.location.origin}/event/${eventData.passcode}`);
    toast.success("Guest link copied!");
  };

  const handleCopyPasscode = () => {
    if (!eventData) return;
    navigator.clipboard.writeText(eventData.passcode);
    toast.success("Passcode copied!");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch(`/api/events/${eventId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Photos uploaded successfully!");
        setTimeout(() => fetchEventData(), 0); // Refresh list
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
      }
    } catch {
      toast.error("Network error during upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Delete this photo?")) return;
    
    try {
      const res = await fetch(`/api/events/${eventId}/photos/${photoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Photo deleted");
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        setEventData(prev => prev ? { ...prev, _count: { ...prev._count, photos: prev._count.photos - 1 } } : null);
      } else {
        toast.error("Failed to delete photo");
      }
    } catch {
      toast.error("Network error");
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Event Details">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={48} className="animate-spin text-[#00A86B]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!eventData) {
    return (
      <DashboardLayout pageTitle="Event Details">
        <div className="px-4 lg:px-8 py-8 text-center text-[#0A1A12]">Event not found</div>
      </DashboardLayout>
    );
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout pageTitle="Event Details">
      <div className="px-4 lg:px-8 py-8 max-w-7xl mx-auto">
        
        {/* Back Link */}
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 text-[#4A7A5E] text-sm hover:text-[#0A1A12] transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Events
        </Link>

        {/* EVENT HEADER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-2xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <span className={`border text-xs px-2.5 py-1 rounded-full inline-block mb-3 ${
                eventData.status === 'ACTIVE' || eventData.status === 'LIVE' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 
                eventData.status === 'INDEXING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                'bg-gray-500/20 text-gray-400 border-gray-500/20'
              }`}>
                {indexingStatus?.status === 'INDEXING' ? 'INDEXING...' : eventData.status}
              </span>
              <h2 className="text-2xl font-bold text-[#0A1A12] mb-3">{eventData.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-[#4A7A5E] text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} /> {formatDate(eventData.eventDate)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag size={14} /> {eventData.eventType}
                </div>
                <div className="flex items-center gap-1.5">
                  <ImageIcon size={14} /> {eventData._count?.photos || photos.length} photos
                </div>
                <div className="flex items-center gap-1.5">
                  <ScanFace size={14} /> {eventData._count?.scanSessions || 0} scans
                </div>
              </div>
            </div>
            
            <div className="flex flex-row md:flex-col gap-3">
              <button className="border border-[#00A86B]/[0.18] hover:border-white/[0.2] hover:bg-[#00A86B]/[0.12] text-[#0A1A12] text-sm font-medium px-4 py-2 rounded-xl transition-all">
                Edit Event
              </button>
              <button className="text-[#4A7A5E] hover:text-red-400 text-sm font-medium px-4 py-2 transition-all">
                Archive Event
              </button>
            </div>
          </div>
        </motion.div>

        {/* PASSCODE & SHARE SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#FFFFFF] border border-[#00A86B]/[0.12] rounded-2xl p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Share Link */}
            <div>
              <p className="text-xs text-[#5A8A6E] uppercase tracking-widest mb-3">
                Guest Access Link
              </p>
              <div className="flex items-center gap-2">
                <div className="bg-[#F0F7F3] rounded-xl px-4 py-3 flex-1 text-[#00A86B] text-sm font-mono truncate">
                  snapclaim.com/event/{eventData.passcode}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="bg-[#F0F7F3] p-3 rounded-xl text-[#4A7A5E] hover:text-[#00A86B] hover:bg-[#00A86B]/10 transition-colors"
                  title="Copy Link"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="bg-[#F0F7F3] p-3 rounded-xl text-[#4A7A5E] hover:text-[#00A86B] hover:bg-[#00A86B]/10 transition-colors"
                  title="Share"
                >
                  <Share2 size={18} />
                </button>
              </div>
              <p className="text-[#4A7A5E] text-xs mt-3">
                Guests can use this link to access photos directly without entering the code.
              </p>
            </div>

            {/* Passcode & QR */}
            <div>
              <p className="text-xs text-[#5A8A6E] uppercase tracking-widest mb-3">
                Event Passcode
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div
                  onClick={handleCopyPasscode}
                  className="bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-xl px-6 py-4 text-center cursor-pointer hover:bg-[#00A86B]/15 transition-colors"
                >
                  <p className="text-3xl font-black font-mono text-[#00A86B] tracking-widest">
                    {eventData.passcode}
                  </p>
                  <p className="text-[#5A8A6E] text-xs mt-1">Click to copy code</p>
                </div>
                
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shrink-0">
                  <QrCode size={48} className="text-black" />
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* INDEXING STATUS PROGRESS */}
        {indexingStatus?.status === 'INDEXING' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#F0F7F3] border border-yellow-500/20 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-yellow-400 font-medium flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> AI Indexing in progress...
              </p>
              <p className="text-[#4A7A5E] text-sm">{indexingStatus.indexed} / {indexingStatus.total} photos</p>
            </div>
            <div className="w-full bg-[#00A86B]/[0.12] rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, (indexingStatus.indexed / (indexingStatus.total || 1)) * 100)}%` }}
              ></div>
            </div>
          </motion.div>
        )}

        {/* UPLOAD ZONE */}
        <input 
          type="file" 
          multiple 
          accept="image/*,video/*"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <motion.div
          onClick={() => !uploading && fileInputRef.current?.click()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`border-2 border-dashed border-[#00A86B]/15 rounded-2xl p-10 text-center mb-8 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#00A86B]/30 hover:bg-[#00A86B]/[0.02] cursor-pointer group'}`}
        >
          {uploading ? (
            <Loader2 size={32} className="text-[#00A86B] animate-spin mx-auto mb-3" />
          ) : (
            <Upload size={32} className="text-[#2A5A3E] group-hover:text-[#00A86B] mx-auto mb-3 transition-colors" />
          )}
          <p className="text-[#0A1A12] font-medium">
            {uploading ? 'Uploading photos...' : 'Drop photos here or click to upload'}
          </p>
          <p className="text-[#3A6A4E] text-sm mt-1">
            JPEG, PNG, WEBP, MP4, MOV · Max 50MB per file
          </p>
          <button 
            disabled={uploading}
            className="mt-4 bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-medium px-6 py-2.5 rounded-full transition-all"
          >
            {uploading ? 'Uploading...' : 'Browse Files'}
          </button>
        </motion.div>

        {/* PHOTOS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-[#0A1A12] font-semibold mb-4 flex items-center gap-2">
            Uploaded Photos <span className="text-[#4A7A5E] font-normal text-sm">({photos.length})</span>
          </h3>

          {photos.length === 0 ? (
             <div className="text-center py-12 text-[#4A7A5E]">No photos uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-[#F0F7F3] rounded-xl relative group overflow-hidden border border-[#00A86B]/10"
                >
                  <img src={photo.thumbnailUrl || photo.url} className="w-full h-full object-cover" alt="Event photo" />

                  {/* File Type Badge (for videos) */}
                  {photo.type === "VIDEO" && (
                    <div className="bg-black/60 text-[#5A8A6E] text-[10px] absolute bottom-2 left-2 px-1.5 py-0.5 rounded font-medium z-10">
                      VIDEO
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                    <a href={photo.url} download target="_blank" rel="noreferrer" className="bg-[#00A86B]/[0.18] hover:bg-[#00A86B] text-[#0A1A12] p-2 rounded-lg transition-colors">
                      <Download size={16} />
                    </a>
                    <button 
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="bg-[#00A86B]/[0.18] hover:bg-red-500 text-[#0A1A12] p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {photos.length > 0 && (
            <button className="text-[#00A86B] text-sm hover:underline mx-auto block mt-6 font-medium">
              Load more photos
            </button>
          )}
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
