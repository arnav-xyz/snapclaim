"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sun,
  Eye,
  Maximize,
  ScanFace,
  CheckCircle,
  AlertCircle,
  Shield,
  Loader2,
} from "lucide-react";
import Webcam from "react-webcam";

type ScanState = "idle" | "scanning" | "success" | "error" | "no_match";

export default function SelfieScanPage({
  params: paramsPromise,
}: {
  params: Promise<{ passcode: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const [status, setStatus] = useState<ScanState>("idle");
  const [instructionIndex, setInstructionIndex] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  const [eventId, setEventId] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const instructions = [
    "Center your face in the oval",
    "Make sure you're well lit",
    "Hold still...",
  ];

  const loadingMessages = [
    "Detecting faces...",
    "Matching your features...",
    "Almost there...",
  ];

  // Fetch Event ID
  useEffect(() => {
    const fetchEventId = async () => {
      try {
        const res = await fetch(`/api/events/by-passcode/${params.passcode}`);
        if (res.ok) {
          const data = await res.json();
          setEventId(data.id);
        }
      } catch {
        // Handle error quietly or show UI
      }
    };
    fetchEventId();
  }, [params.passcode]);

  // Cycle instructions in idle state
  useEffect(() => {
    if (status !== "idle" && status !== "no_match" && status !== "error") return;
    const interval = setInterval(() => {
      setInstructionIndex((prev) => (prev + 1) % instructions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [status, instructions.length]);

  // Handle fake scan counting animation
  useEffect(() => {
    if (status === "scanning") {
      const countInterval = setInterval(() => {
        setScanCount((prev) => {
          const next = prev + Math.floor(Math.random() * 15) + 5;
          return next > 247 ? 247 : next;
        });
      }, 100);

      const msgInterval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 800);

      return () => {
        clearInterval(countInterval);
        clearInterval(msgInterval);
      };
    }
  }, [status, loadingMessages.length]);

  const startScan = async () => {
    if (!eventId || !webcamRef.current) return;

    setStatus("scanning");
    setScanCount(0);
    
    const base64 = webcamRef.current.getScreenshot();
    if (!base64) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selfieBase64: base64, eventId }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "NO_FACE_DETECTED") {
          setStatus("error");
        } else {
          setStatus("error");
        }
      } else {
        if (data.matchCount === 0) {
          setStatus("no_match");
        } else {
          setScanCount(247);
          setStatus("success");
          sessionStorage.setItem("matchedPhotos", JSON.stringify(data.photos));
          sessionStorage.setItem("matchCount", String(data.matchCount));
          sessionStorage.setItem("scannedEvent", params.passcode);
          
          setTimeout(() => {
            router.push(`/event/${params.passcode}/myphotos`);
          }, 1000);
        }
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center px-6 py-12 font-sans relative">
      
      {/* Full page background photo */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/scan-bg.jfif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.5) brightness(1.1)',
          }}
        />
        <div className="absolute inset-0"
          style={{ background: 'rgba(248,251,249,0.85)' }}
        />
      </div>

      {/* Back Link */}
      <Link
        href={`/event/${params.passcode}`}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4A7A5E] text-sm hover:text-[#0A1A12] transition-colors z-10"
      >
        <ArrowLeft size={16} /> Back to all photos
      </Link>

      {/* MAIN CONTENT */}
      <div className="max-w-sm w-full mx-auto text-center z-10 relative">
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-[#00A86B] text-xs font-bold tracking-widest uppercase">
            AI FACE SEARCH
          </span>
          <h1 className="text-3xl font-bold text-[#0A1A12] mt-2">Find Your Photos</h1>
          <p className="text-[#5A8A6E] text-sm mt-2">
            Look straight at the camera and hold still
          </p>
        </motion.div>

        {/* CAMERA CARD */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-2xl p-4 w-full mt-8"
        >
          {/* Viewfinder */}
          <div className="relative bg-[#FFFFFF] rounded-xl overflow-hidden aspect-square w-full">
            
            {/* IDLE STATE */}
            {(status === "idle" || status === "no_match" || status === "error") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Face Guide Oval */}
                <div className="w-48 h-56 border-2 border-dashed border-[#00A86B]/50 rounded-full relative flex items-center justify-center">
                  
                  {/* Corner marks */}
                  <div className="w-6 h-6 border-[#00A86B] border-t-2 border-l-2 absolute -top-1 -left-1 rounded-tl-sm" />
                  <div className="w-6 h-6 border-[#00A86B] border-t-2 border-r-2 absolute -top-1 -right-1 rounded-tr-sm" />
                  <div className="w-6 h-6 border-[#00A86B] border-b-2 border-l-2 absolute -bottom-1 -left-1 rounded-bl-sm" />
                  <div className="w-6 h-6 border-[#00A86B] border-b-2 border-r-2 absolute -bottom-1 -right-1 rounded-br-sm" />
                  
                  {/* Pulsing ring */}
                  <div className="absolute -inset-3 border border-[#00A86B]/20 rounded-full animate-ping" style={{ animationDuration: "2s" }} />
                  
                  {/* Live Webcam Feed */}
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="absolute inset-0 w-full h-full object-cover"
                    mirrored={true}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={instructionIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 text-[#5A8A6E] text-sm absolute bottom-8"
                  >
                    {instructions[instructionIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}

            {/* SCANNING STATE (handled below in overlay too, but card needs some dark overlay) */}
            {status === "scanning" && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                {/* Scanning line animation */}
                <motion.div
                  animate={{ y: [0, 300, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 right-0 h-0.5 bg-[#00A86B]/60 shadow-[0_0_8px_#00A86B]"
                />
                <p className="text-[#00A86B] text-sm font-medium animate-pulse">
                  Scanning...
                </p>
              </div>
            )}

            {/* SUCCESS STATE */}
            {status === "success" && (
              <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle size={64} className="text-green-400" />
                </motion.div>
              </div>
            )}

            {/* NO MATCH STATE */}
            {status === "no_match" && (
              <div className="absolute inset-0 bg-yellow-500/10 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                <AlertCircle size={48} className="text-yellow-400" />
                <p className="text-yellow-400 font-medium mt-2">No photos found</p>
                <p className="text-[#5A8A6E] text-sm mt-1">
                  We couldn&apos;t find any photos of you
                </p>
              </div>
            )}

            {/* ERROR STATE */}
            {status === "error" && (
              <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                <AlertCircle size={48} className="text-red-400" />
                <p className="text-red-400 font-medium mt-2">No face detected</p>
                <p className="text-[#5A8A6E] text-sm mt-1">
                  Try better lighting or move closer
                </p>
              </div>
            )}
          </div>

          {/* BOTTOM OF CAMERA CARD */}
          <div className="mt-4 mb-4 flex justify-center gap-6">
            <div className="flex items-center gap-1.5">
              <Sun size={14} className="text-[#3A6A4E]" />
              <span className="text-[#3A6A4E] text-xs">Good lighting</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={14} className="text-[#3A6A4E]" />
              <span className="text-[#3A6A4E] text-xs">Look straight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize size={14} className="text-[#3A6A4E]" />
              <span className="text-[#3A6A4E] text-xs">Face centered</span>
            </div>
          </div>


          <button
            onClick={startScan}
            disabled={status === "scanning" || status === "success" || !eventId}
            className={`w-full font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
              status === "success"
                ? "bg-green-500 text-[#0A1A12] hover:scale-100"
                : "bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] hover:scale-[1.01] disabled:opacity-80 disabled:hover:scale-100"
            }`}
          >
            {status === "idle" && (
              <>
                <ScanFace size={20} /> Scan My Face
              </>
            )}
            {status === "scanning" && (
              <>
                <Loader2 size={20} className="animate-spin" /> Scanning your face...
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle size={20} /> Match found! Redirecting...
              </>
            )}
            {status === "error" && (
              <>
                <ScanFace size={20} /> Try Again
              </>
            )}
            {status === "no_match" && (
              <>
                <ScanFace size={20} /> Try Again
              </>
            )}
          </button>

          <p className="text-[#2A5A3E] text-xs text-center flex items-center justify-center gap-1 mt-4">
            <Shield size={12} /> Your selfie is never stored or saved
          </p>
        </motion.div>
      </div>

      {/* SEARCHING OVERLAY */}
      <AnimatePresence>
        {status === "scanning" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          >
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border-4 border-[#00A86B]/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-[#00A86B] rounded-full animate-spin" />
            </div>
            
            <p className="text-[#0A1A12] text-lg font-semibold mt-6">
              Searching photos...
            </p>
            <p className="text-[#5A8A6E] text-sm mt-2 tabular-nums">
              Analyzed {scanCount} photos
            </p>
            
            <p className="text-[#00A86B] text-sm mt-4 animate-pulse">
              {loadingMessages[loadingMessageIndex]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
