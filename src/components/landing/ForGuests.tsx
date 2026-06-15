"use client";

import { motion } from "framer-motion";
import { Camera, Check } from "lucide-react";

const features = [
  {
    title: "No app download",
    body: "Works directly in any mobile browser. Just open the link.",
  },
  {
    title: "No account needed",
    body: "Enter the event code and scan — that's literally it.",
  },
  {
    title: "Download instantly",
    body: "Save your photos one by one or grab all of them as a ZIP.",
  },
  {
    title: "Private & secure",
    body: "Your selfie is never stored. It's only used to find your photos.",
  },
];

const animationProps = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
};

export default function ForGuests() {
  return (
    <section className="bg-[#FFFFFF] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* LEFT — Phone Mockup (appears second on mobile via order) */}
          <motion.div className="md:order-1 order-2" {...animationProps}>
            <div className="max-w-xs mx-auto bg-[#F0F7F3] rounded-3xl border border-[#00A86B]/[0.12] p-4 overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center gap-2 mb-4">
                <Camera className="size-4 text-[#5A8A6E]" />
                <span className="text-sm text-[#5A8A6E]">Find My Photos</span>
              </div>

              {/* Camera viewfinder */}
              <div className="rounded-2xl bg-[#FFFFFF] aspect-[3/4] relative flex items-center justify-center overflow-hidden">
                {/* Pulsing ring */}
                <div className="absolute w-32 h-40 rounded-full border-2 border-[#00A86B]/40 animate-ping" />

                {/* Dashed oval */}
                <div className="w-32 h-40 rounded-full border-2 border-dashed border-[#00A86B]" />

                {/* Scanning text */}
                <div className="absolute bottom-4 w-full text-center">
                  <span className="text-[#00A86B] text-xs animate-pulse">
                    Hold still — scanning...
                  </span>
                </div>
              </div>

              {/* Scan button */}
              <button className="mt-4 w-full bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] py-3 rounded-full text-sm font-medium transition-colors">
                Scan My Face
              </button>
            </div>
          </motion.div>

          {/* RIGHT — Text Column (appears first on mobile via order) */}
          <motion.div className="md:order-2 order-1" {...animationProps}>
            <span className="text-xs font-medium tracking-[3px] text-[#00A86B] uppercase mb-4 inline-block">
              FOR GUESTS
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1A12] tracking-tight font-sans">
              Just show
              <br />
              your face.
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
