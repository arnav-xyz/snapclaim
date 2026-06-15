"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  AlertCircle,
  Key,
  Images,
  ScanFace,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function PasscodeEntryPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    setError(false);

    try {
      const res = await fetch(`/api/events/by-passcode/${passcode}`);
      if (res.ok) {
        router.push(`/event/${passcode}`);
      } else {
        setError(true);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans relative">
      
      {/* Full page background photo */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/passcode-bg.jfif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.6) brightness(1.1)',
          }}
        />
        <div className="absolute inset-0"
          style={{ background: 'rgba(248,251,249,0.82)' }}
        />
      </div>

      {/* TOP NAV */}
      <nav className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-[#00A86B]/10">
        <Link href="/" className="flex items-center gap-2">
          <Camera className="size-6 text-[#00A86B]" />
          <span className="text-xl font-semibold text-[#0A1A12] tracking-tight">SnapClaim</span>
        </Link>
        <div className="flex items-center">
          <span className="text-[#4A7A5E] text-sm mr-4 hidden md:block">
            Are you a photographer?
          </span>
          <Link href="/login" className="text-[#00A86B] text-sm font-medium hover:underline">
            Log in →
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
          >
            <div className="w-20 h-20 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Camera size={36} className="text-[#00A86B]" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-[#0A1A12] tracking-tight"
          >
            Find Your Photos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            className="text-[#5A8A6E] text-base mt-3 leading-relaxed"
          >
            Enter the event code your photographer shared with you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
            className="bg-[#F0F7F3]/80 backdrop-blur-md border border-[#00A86B]/[0.12] rounded-2xl p-8 mt-10 text-left"
          >
            <form onSubmit={handleSubmit}>
              <label className="text-xs text-[#5A8A6E] font-medium uppercase tracking-widest block mb-3">
                Event Code
              </label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value.toUpperCase());
                  setError(false);
                }}
                maxLength={8}
                placeholder="· · · · · ·"
                className="w-full bg-[#FFFFFF] border border-[#00A86B]/15 rounded-xl px-5 py-4 text-center text-[#0A1A12] text-2xl font-mono font-bold tracking-[8px] uppercase placeholder:text-[#2A5A3E] placeholder:tracking-[4px] outline-none focus:border-[#00A86B]/50 focus:ring-1 focus:ring-[#00A86B]/20 transition-all"
              />

              {error && (
                <div className="mt-3 flex items-center justify-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={14} />
                  Invalid code — check with your photographer
                </div>
              )}

              <button
                type="submit"
                disabled={loading || passcode.length < 3}
                className="mt-4 w-full bg-[#00A86B] hover:bg-[#009960] disabled:opacity-50 disabled:hover:scale-100 text-[#0A1A12] font-semibold py-4 rounded-xl text-base transition-all hover:scale-[1.01] flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Finding event...
                  </>
                ) : (
                  <>
                    View Photos <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-[#2A5A3E] mt-6">
              No account needed. Just the code.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
            className="mt-8 flex justify-center gap-4 sm:gap-8 flex-wrap"
          >
            <div className="flex items-center gap-2">
              <Key size={14} className="text-[#3A6A4E]" />
              <span className="text-xs text-[#3A6A4E]">Enter code</span>
            </div>
            <ArrowRight size={14} className="text-[#2A5A3E] hidden sm:block" />
            <div className="flex items-center gap-2">
              <Images size={14} className="text-[#3A6A4E]" />
              <span className="text-xs text-[#3A6A4E]">See all photos</span>
            </div>
            <ArrowRight size={14} className="text-[#2A5A3E] hidden sm:block" />
            <div className="flex items-center gap-2">
              <ScanFace size={14} className="text-[#3A6A4E]" />
              <span className="text-xs text-[#3A6A4E]">Find yours with AI</span>
            </div>
          </motion.div>

        </div>
      </main>

    </div>
  );
}
