"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

const features = [
  {
    title: "Batch upload 500+ photos",
    body: "Drag and drop your entire event folder. We handle compression and organization.",
  },
  {
    title: "Auto face indexing",
    body: "Every photo is analyzed by AI the moment it uploads. No manual tagging ever.",
  },
  {
    title: "QR code & link sharing",
    body: "Print a QR code for the venue or just send a WhatsApp message with the link.",
  },
  {
    title: "Download analytics",
    body: "See who downloaded what, when, and how many times.",
  },
];

const animationProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
};

export default function ForPhotographers() {
  return (
    <section className="bg-[#FFFFFF] py-32 px-6 relative overflow-hidden">
      {/* Background photo — photographer working */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/photographers-bg.jfif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            filter: 'saturate(0.5) brightness(1.05)',
          }}
        />
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(248,251,249,0.97) 50%, rgba(248,251,249,0.4) 100%)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* LEFT — Text Column */}
          <motion.div {...animationProps}>
            <span className="text-xs font-medium tracking-[3px] text-[#00A86B] uppercase mb-4 inline-block">
              FOR PHOTOGRAPHERS
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1A12] tracking-tight font-sans">
              Upload once.
              <br />
              Deliver to everyone.
            </h2>

            <div className="mt-8 flex flex-col gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#00A86B]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-4 text-[#00A86B]" />
                  </div>
                  <div>
                    <p className="text-[#0A1A12] font-medium text-base">
                      {feature.title}
                    </p>
                    <p className="text-sm text-[#4A7A5E] mt-1">
                      {feature.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="text-[#00A86B] hover:underline font-medium mt-6 inline-block"
            >
              Start uploading free →
            </a>
          </motion.div>

          {/* RIGHT — Dashboard Mockup Card */}
          <motion.div {...animationProps}>
            <div className="bg-[#F0F7F3] rounded-2xl border border-[#00A86B]/[0.12] overflow-hidden">
              {/* Fake browser bar */}
              <div className="bg-[#FFFFFF] px-4 py-3 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
                <span className="text-xs text-[#9ABFAD] ml-4">
                  dashboard.snapclaim.com
                </span>
              </div>

              {/* Inner content */}
              <div className="p-6">
                <h3 className="text-base font-semibold text-[#0A1A12]">
                  Wedding — Sharma &amp; Priya
                </h3>
                <p className="text-xs text-[#9ABFAD] mt-1">
                  247 photos · 12 videos
                </p>

                {/* Progress section */}
                <div className="mt-4">
                  <span className="text-xs text-[#9ABFAD]">Face indexing</span>
                  <div className="w-full h-1.5 rounded-full bg-[#00A86B]/[0.12] mt-2">
                    <div className="w-[91%] h-full bg-[#00A86B] rounded-full" />
                  </div>
                  <span className="text-xs text-[#00A86B] mt-1 inline-block">
                    91% complete
                  </span>
                </div>

                {/* Photo grid */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#E8F2EC] rounded-lg aspect-square"
                    />
                  ))}
                </div>

                {/* Share section */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#9ABFAD]">Share passcode</span>
                  <div className="bg-[#E8F2EC] px-3 py-1.5 rounded-full text-xs text-[#5A8A6E] flex items-center gap-2">
                    SNAP42
                    <Copy className="size-3 text-[#9ABFAD]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
