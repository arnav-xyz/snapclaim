"use client";

import { motion } from "framer-motion";
import { Upload, KeyRound, ScanFace, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: Upload,
    title: "Photographer uploads",
    body: "Upload hundreds of event photos in minutes. Organize by event, add a cover photo, set your passcode.",
  },
  {
    number: "02",
    icon: KeyRound,
    title: "Share the passcode",
    body: "Send guests a 6-digit code or QR code. They enter it on any device — no app download needed.",
  },
  {
    number: "03",
    icon: ScanFace,
    title: "AI finds their photos",
    body: "Guests scan their face once. Our AI searches every photo and delivers only the ones they're in.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="bg-[#FFFFFF] py-32 px-6 relative overflow-hidden">
      {/* Background photo — barely visible texture */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/howitworks-bg.jfif')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(0.4) brightness(1.1)',
          }}
        />
        <div className="absolute inset-0"
          style={{ background: 'rgba(248,251,249,0.93)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <p className="text-xs font-medium tracking-[3px] text-[#00A86B] uppercase mb-4">
            HOW IT WORKS
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-[#0A1A12] tracking-tight mb-16 font-sans">
            Simple for photographers.
            <br />
            Magical for guests.
          </h2>
        </motion.div>

        {/* Steps — Desktop: flex row with arrows, Mobile: stacked */}
        <motion.div
          className="hidden md:flex items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {steps.map((step, index) => (
            <div key={step.number} className="contents">
              {/* Step Card */}
              <motion.div
                variants={itemVariants}
                className="flex-1 bg-white border border-[#00A86B]/10 rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,168,107,0.12)] hover:border-[#00A86B]/25 transition-all duration-300"
              >
                <p className="text-5xl font-bold text-[#00A86B]/[0.08] mb-6">
                  {step.number}
                </p>
                <div className="bg-[#00A86B]/10 text-[#00A86B] rounded-xl p-3 w-12 h-12 flex items-center justify-center">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#0A1A12]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#4A7A5E] leading-relaxed">
                  {step.body}
                </p>
              </motion.div>

              {/* Arrow between cards */}
              {index < steps.length - 1 && (
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-center px-4 shrink-0"
                >
                  <ArrowRight className="w-6 h-6 text-[#00A86B]" />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Steps — Mobile: vertical stack */}
        <motion.div
          className="flex flex-col gap-6 md:hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="bg-white border border-[#00A86B]/10 rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300"
            >
              <p className="text-5xl font-bold text-[#00A86B]/[0.08] mb-6">
                {step.number}
              </p>
              <div className="bg-[#00A86B]/10 text-[#00A86B] rounded-xl p-3 w-12 h-12 flex items-center justify-center">
                <step.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[#0A1A12]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-[#4A7A5E] leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
