"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Camera,
  Tag,
  Calendar,
  Images,
  ScanFace,
  Download,
  Play,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface ApiEvent {
  id: string;
  name: string;
  eventType: string;
  eventDate: string;
  photographer: { name: string; studioName: string } | null;
  _count: { photos: number };
}

interface ApiPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: string;
  aspectRatio: number;
}

export default function EventGalleryPage({
  params,
}: {
  params: Promise<{ passcode: string }>;
}) {
  const { passcode } = React.use(params);
  const router = useRouter();
  const [filter, setFilter] = useState("All"); // 'All', 'Photos', 'Videos'
  
  const [eventData, setEventData] = useState<ApiEvent | null>(null);
  const [photos, setPhotos] = useState<ApiPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch Event Info
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/by-passcode/${passcode}`);
        if (res.ok) {
          const data = await res.json();
          setEventData(data);
        } else {
          toast.error("Event not found");
          router.push("/event");
        }
      } catch {
        toast.error("Network error");
      }
    };
    fetchEvent();
  }, [passcode, router]);

  // Fetch Photos
  const fetchPhotos = useCallback(async (pageNum: number, currentFilter: string, append: boolean) => {
    if (!passcode) return;
    try {
      if (!append) setLoadingInitial(true);
      else setLoadingMore(true);

      let url = `/api/events/by-passcode/${passcode}/photos?page=${pageNum}&limit=20`;
      if (currentFilter === "Photos") url += "&type=IMAGE";
      if (currentFilter === "Videos") url += "&type=VIDEO";

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.photos.length < 20) setHasMore(false);
        else setHasMore(true);
        
        if (append) {
          setPhotos(prev => [...prev, ...(data.photos || [])]);
        } else {
          setPhotos(data.photos || []);
        }
      }
    } catch {
      toast.error("Failed to load photos");
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }, [passcode]);

  // Initial load or filter change
  useEffect(() => {
    const load = async () => {
      setPage(1);
      await fetchPhotos(1, filter, false);
    };
    load();
  }, [filter, fetchPhotos]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(nextPage, filter, true);
  };

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length > 0) {
      setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev + 1) % photos.length);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, photos.length]);

  if (!eventData) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#00A86B]" />
      </div>
    );
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const photographerName = eventData.photographer?.name || "Photographer";

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans">
      
      {/* TOP NAV */}
      <nav className="px-6 py-5 flex items-center justify-between border-b border-[#00A86B]/10 sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <Camera className="size-6 text-[#00A86B]" />
          <span className="text-xl font-semibold text-[#0A1A12] tracking-tight">SnapClaim</span>
        </Link>
        <div className="hidden md:block">
          <span className="text-[#5A8A6E] text-sm truncate max-w-xs">{eventData.name}</span>
        </div>
        <Link href="/login" className="text-[#4A7A5E] hover:text-[#0A1A12] text-sm transition-colors">
          Photographer login
        </Link>
      </nav>

      {/* EVENT HEADER SECTION */}
      <div className="relative overflow-hidden px-6 py-8 md:py-12">
        {/* Background photo — subtle texture */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/images/howitworks-bg.jfif')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.2) brightness(0.2)',
          }}
        />
        <div className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(248,251,249,0.7) 0%, #FFFFFF 100%)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* LEFT: Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="bg-[#00A86B]/10 text-[#00A86B] text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Tag size={10} /> {eventData.eventType}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A1A12] tracking-tight mt-3">
              {eventData.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-[#4A7A5E] text-sm">
                <Calendar size={14} /> {formatDate(eventData.eventDate)}
              </div>
              <div className="flex items-center gap-1.5 text-[#4A7A5E] text-sm">
                <Camera size={14} /> {photographerName}
              </div>
              <div className="flex items-center gap-1.5 text-[#4A7A5E] text-sm">
                <Images size={14} /> {eventData._count?.photos || 0} photos
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Scan Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            className="bg-[#00A86B] rounded-2xl p-6 text-center"
          >
            <ScanFace size={32} className="text-white mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg">Find YOUR photos</h3>
            <p className="text-white/70 text-sm mt-1">
              Scan your face — our AI finds every photo you&apos;re in, instantly.
            </p>
            <button
              onClick={() => router.push(`/event/${passcode}/scan`)}
              className="mt-4 w-full bg-white text-[#00A86B] font-semibold py-3 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
            >
              <ScanFace size={18} /> Scan My Face
            </button>
            <p className="text-white/40 text-xs mt-3">
              Takes 3 seconds · No account needed · 100% private
            </p>
          </motion.div>

        </div>
        </div>
      </div>

      {/* FILTER + SEARCH BAR */}
      <div className="px-6 mb-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          
          <div className="flex gap-2">
            {["All", "Photos", "Videos"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-4 py-2 rounded-full cursor-pointer transition-colors ${
                  filter === f
                    ? "bg-[#00A86B] text-[#0A1A12]"
                    : "bg-[#F0F7F3] border border-[#00A86B]/[0.12] text-[#4A7A5E] hover:text-[#0A1A12]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[#4A7A5E] text-sm">
              {photos.length} photos
            </span>
            <button
              onClick={() => toast("Preparing download...")}
              className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] text-[#0A1A12] text-sm px-4 py-2 rounded-full flex items-center gap-2 hover:border-[#00A86B]/25 transition-colors"
            >
              <Download size={14} /> Download All
            </button>
          </div>
          
        </div>
      </div>

      {/* MASONRY PHOTO GRID */}
      <div className="px-6 max-w-7xl mx-auto min-h-[40vh]">
        {loadingInitial ? (
           <div className="flex justify-center py-20">
             <Loader2 size={32} className="animate-spin text-[#00A86B]" />
           </div>
        ) : photos.length === 0 ? (
           <div className="text-center py-20 text-[#4A7A5E]">
             No media found.
           </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:auto]">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 12) * 0.04 }} // Limit delay max to avoid long waits
                className="break-inside-avoid mb-3 relative group rounded-xl overflow-hidden cursor-pointer bg-[#F0F7F3]"
                onClick={() => openLightbox(i)}
              >
                {/* Note: In a real app we'd use next/image, but img is fine for mock */}
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt={`Photo ${photo.id}`}
                  className="w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  style={{ aspectRatio: photo.aspectRatio || 1 }}
                  loading="lazy"
                />
                
                {/* Video Badge */}
                {photo.type === "VIDEO" && (
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-[#0A1A12] text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Play size={10} fill="white" /> VIDEO
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success("Download started");
                      }}
                      className="bg-[#00A86B]/[0.18] backdrop-blur-sm hover:bg-[#00A86B]/25 text-[#0A1A12] rounded-full p-2 transition-all"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      className="bg-[#00A86B]/[0.18] backdrop-blur-sm hover:bg-[#00A86B]/25 text-[#0A1A12] rounded-full p-2 transition-all"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* LOAD MORE */}
      {!loadingInitial && photos.length > 0 && hasMore && (
        <div className="text-center mt-8 mb-12">
          <button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] text-[#0A1A12] text-sm px-8 py-3 rounded-full hover:border-[#00A86B]/25 transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {loadingMore && <Loader2 size={14} className="animate-spin" />}
            {loadingMore ? "Loading..." : "Load More Photos"}
          </button>
        </div>
      )}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxOpen && photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-[#00A86B]/[0.18] rounded-full p-2 text-[#0A1A12] hover:bg-[#00A86B]/25 transition-colors z-50"
            >
              <X size={20} />
            </button>

            {/* Arrows */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#00A86B]/[0.18] hover:bg-[#00A86B]/25 rounded-full p-3 text-[#0A1A12] transition-colors z-50"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#00A86B]/[0.18] hover:bg-[#00A86B]/25 rounded-full p-3 text-[#0A1A12] transition-colors z-50"
            >
              <ChevronRight size={24} />
            </button>

            {/* Center Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              src={photos[lightboxIndex].url}
              alt="Expanded photo"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Bottom Bar */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 flex justify-between items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[#5A8A6E] text-sm">
                {lightboxIndex + 1} / {photos.length}
              </span>
              <a
                href={photos[lightboxIndex].url}
                download
                target="_blank"
                rel="noreferrer"
                onClick={() => toast.success("Download started")}
                className="bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-semibold px-6 py-2.5 rounded-full transition-all flex items-center gap-2"
              >
                <Download size={16} /> Download Photo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
