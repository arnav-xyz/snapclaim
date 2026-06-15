"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "react-hot-toast";
import {
  Camera,
  CheckCircle,
  Download,
  Share2,
  ScanFace,
  ArrowLeft

} from "lucide-react";

interface ApiPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: string;
  aspectRatio: number;
}

export default function MyPhotosPage({
  params: paramsPromise,
}: {
  params: Promise<{ passcode: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const [myPhotos, setMyPhotos] = useState<ApiPhoto[]>([]);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Read from session storage
      const scannedEvent = sessionStorage.getItem("scannedEvent");
      if (scannedEvent !== params.passcode) {
        // Data might be from a different event or missing
        setLoaded(true);
        return;
      }

      const photosStr = sessionStorage.getItem("matchedPhotos");
      const countStr = sessionStorage.getItem("matchCount");

      if (photosStr) {
        try {
          const photos = JSON.parse(photosStr);
          setMyPhotos(photos);
          if (photos.length > 0) {
            confetti({
              particleCount: 100,
              spread: 70,
              colors: ["#00A86B", "#009960", "#ffffff"],
              origin: { y: 0.6 },
            });
          }
        } catch {
          console.error("Failed to parse matched photos");
        }
      }
      
      if (countStr) {
        setMatchCount(parseInt(countStr, 10));
      }
      
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [params.passcode]);

  if (!loaded) {
    return <div className="min-h-screen bg-[#FFFFFF]" />;
  }

  // If directly visited without a scan or for wrong event
  if (matchCount === null) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] font-sans flex flex-col">
        <nav className="px-6 py-5 flex items-center justify-between border-b border-[#00A86B]/10">
          <Link href="/" className="flex items-center gap-2">
            <Camera className="size-6 text-[#00A86B]" />
            <span className="text-xl font-semibold text-[#0A1A12] tracking-tight">SnapClaim</span>
          </Link>
          <Link href={`/event/${params.passcode}`} className="text-[#4A7A5E] hover:text-[#0A1A12] text-sm transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Event
          </Link>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ScanFace size={48} className="text-[#00A86B] mb-4" />
          <h1 className="text-2xl font-bold text-[#0A1A12] mb-2">Please scan your face first</h1>
          <p className="text-[#5A8A6E] mb-6">We need to scan your face to find your photos.</p>
          <button
            onClick={() => router.push(`/event/${params.passcode}/scan`)}
            className="bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            <ScanFace size={18} /> Start Scan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans">
      
      {/* GUEST NAV */}
      <nav className="px-6 py-5 flex items-center justify-between bg-[#FFFFFF]">
        <Link href="/" className="flex items-center gap-2">
          <Camera className="size-6 text-[#00A86B]" />
          <span className="text-xl font-semibold text-[#0A1A12] tracking-tight">SnapClaim</span>
        </Link>
        <Link
          href={`/event/${params.passcode}`}
          className="text-[#4A7A5E] hover:text-[#0A1A12] text-sm transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to all photos
        </Link>
      </nav>

      {/* SUCCESS BANNER */}
      <div className="bg-[#00A86B] py-8 px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <CheckCircle size={40} className="text-white mx-auto mb-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            We found {matchCount} photos of you! 🎉
          </h1>
          <p className="text-white/70 text-sm mt-2">
            View your personal gallery below
          </p>
        </motion.div>
      </div>

      {/* ACTIONS BAR */}
      <div className="bg-[#F8FBF9] border-b border-[#00A86B]/[0.12] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-[#0A1A12] font-medium">{matchCount} photos found</p>
            <p className="text-[#4A7A5E] text-sm mt-0.5">by AI face recognition</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => toast.success("Preparing your ZIP download...")}
              className="bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2"
            >
              <Download size={16} /> Download All ({matchCount})
            </button>
            <button className="border border-[#00A86B]/[0.18] hover:bg-[#00A86B]/[0.12] text-[#0A1A12] text-sm font-medium px-4 py-2.5 rounded-full transition-colors flex items-center gap-2">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* PHOTO GRID */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:auto]">
          {myPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="break-inside-avoid mb-3 relative group rounded-xl overflow-hidden cursor-pointer bg-[#F0F7F3]"
            >
              {/* Image */}
              <img
                src={photo.thumbnailUrl || photo.url}
                alt="Matched photo"
                className="w-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                style={{ aspectRatio: photo.aspectRatio || 1 }}
                loading="lazy"
              />

              {/* Hover overlay with orange glow */}
              <div className="absolute inset-0 group-hover:ring-2 ring-[#00A86B]/30 rounded-xl transition-all pointer-events-none" />

              {/* Watermark overlay */}
              <div className="absolute top-2 right-2 bg-[#00A86B]/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">
                ✓ You
              </div>

              {/* Bottom Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                <div className="p-3 flex justify-end">
                  <a
                    href={photo.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.success("Download started");
                    }}
                    className="bg-[#00A86B]/[0.18] backdrop-blur-sm hover:bg-[#00A86B] text-[#0A1A12] rounded-full p-2 transition-colors"
                  >
                    <Download size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SCAN AGAIN SECTION */}
      <div className="text-center py-12 border-t border-[#00A86B]/[0.12] mt-8">
        <p className="text-[#4A7A5E] text-sm">Not finding all your photos?</p>
        <button
          onClick={() => router.push(`/event/${params.passcode}/scan`)}
          className="text-[#00A86B] text-sm mt-2 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <ScanFace size={14} /> Try scanning again
        </button>
      </div>

      {/* VIEW ALL PHOTOS LINK */}
      <div className="text-center mt-4">
        <Link
          href={`/event/${params.passcode}`}
          className="text-[#4A7A5E] text-sm hover:text-[#0A1A12] transition-colors"
        >
          ← View all event photos
        </Link>
      </div>

      {/* SHARE SNAPCLAIM BANNER */}
      <div className="mx-6 mb-12 mt-12 bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-2xl p-6 text-center max-w-2xl lg:mx-auto">
        <p className="text-[#0A1A12] font-medium">Love SnapClaim?</p>
        <p className="text-[#4A7A5E] text-sm mt-1">
          Tell your photographer to use SnapClaim for every event.
        </p>
        <button className="mt-4 bg-[#00A86B]/10 text-[#00A86B] border border-[#00A86B]/20 text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#00A86B]/20 transition-all">
          Share SnapClaim →
        </button>
      </div>

    </div>
  );
}
