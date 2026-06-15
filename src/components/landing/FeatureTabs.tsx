"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Upload, FileImage, User } from "lucide-react";

const tabs = ["Upload & Organize", "AI Face Match", "Guest Access"] as const;

type TabKey = (typeof tabs)[number];

interface FeatureItem {
  text: string;
}

const tabFeatures: Record<TabKey, FeatureItem[]> = {
  "Upload & Organize": [
    { text: "Drag & drop bulk upload · 500MB per file" },
    { text: "Auto photo compression (no quality loss)" },
    { text: "Event folders with cover photos" },
    { text: "Upload progress per file" },
    { text: "Supports JPEG PNG WEBP MP4 MOV" },
  ],
  "AI Face Match": [
    { text: "Faces indexed in background · No manual tagging" },
    { text: "80%+ confidence threshold" },
    { text: "Processes 1000 photos in ~2 minutes" },
    { text: "Handles group photos, crowds, candids" },
  ],
  "Guest Access": [
    { text: "No login required for guests" },
    { text: "6-digit passcode or QR code entry" },
    { text: "Single selfie scan · instant results" },
    { text: "ZIP download of matched photos" },
  ],
};

function UploadMockup() {
  return (
    <div>
      <div className="border-2 border-dashed border-[#00A86B]/[0.18] rounded-xl p-8 text-center">
        <Upload className="size-10 text-[#00A86B]/25 mx-auto" />
        <p className="text-sm text-[#9ABFAD] mt-3">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-[#9ABFAD] mt-1">500MB max per file</p>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg p-3 flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <FileImage className="size-4 text-[#9ABFAD]" />
          <span className="text-xs text-[#00A86B]/[0.12]0">DSC_0234.jpg</span>
        </div>
        <span className="text-xs text-[#00A86B]">64%</span>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg p-3 flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <FileImage className="size-4 text-[#9ABFAD]" />
          <span className="text-xs text-[#00A86B]/[0.12]0">IMG_1087.png</span>
        </div>
        <span className="text-xs text-[#00A86B]">32%</span>
      </div>
    </div>
  );
}

function FaceMatchMockup() {
  const matches = [
    { label: "Match 1", confidence: 97.4 },
    { label: "Match 2", confidence: 94.1 },
    { label: "Match 3", confidence: 89.7 },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-full bg-[#E8F2EC] border-2 border-[#00A86B] flex items-center justify-center"
          >
            <User className="size-5 text-[#00A86B]/25" />
          </div>
        ))}
      </div>
      <p className="text-xs text-[#9ABFAD] mb-5">3 faces detected</p>

      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[#00A86B]/[0.12]0">{match.label}</span>
              <span className="text-xs text-[#00A86B]">
                {match.confidence}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-[#00A86B]/[0.12] w-full">
              <div
                className="h-1 rounded-full bg-[#00A86B]"
                style={{ width: `${match.confidence}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuestAccessMockup() {
  const passcode = ["S", "N", "A", "P", "", ""];

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-4">
        {passcode.map((char, i) => (
          <div
            key={i}
            className="w-10 h-12 bg-[#FFFFFF] border border-[#00A86B]/[0.18] rounded-lg flex items-center justify-center text-[#0A1A12] text-lg font-mono"
          >
            {char}
          </div>
        ))}
      </div>

      <button className="w-full bg-[#00A86B] rounded-full py-3 text-sm text-[#0A1A12] font-medium mt-4 cursor-default">
        Enter Event →
      </button>
    </div>
  );
}

const mockups: Record<TabKey, React.ReactNode> = {
  "Upload & Organize": <UploadMockup />,
  "AI Face Match": <FaceMatchMockup />,
  "Guest Access": <GuestAccessMockup />,
};

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("Upload & Organize");

  return (
    <section className="bg-[#FFFFFF] py-32 px-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        {/* Label */}
        <p className="text-xs font-medium tracking-[3px] text-[#00A86B] uppercase mb-4">
          FEATURES
        </p>

        {/* Heading */}
        <h2 className="text-5xl md:text-6xl font-bold text-[#0A1A12] tracking-tight mb-12 font-sans">
          Everything you need.
          <br />
          Nothing you don&apos;t.
        </h2>

        {/* Tab Switcher */}
        <div className="inline-flex bg-[#F0F7F3] rounded-full p-1 border border-[#00A86B]/[0.12] mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#00A86B] rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span
                className={`relative z-10 block px-6 py-2.5 text-sm font-medium transition-colors rounded-full ${
                  activeTab === tab
                    ? "text-[#0A1A12]"
                    : "text-[#4A7A5E] hover:text-[#0A1A12] cursor-pointer"
                }`}
              >
                {tab}
              </span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
            >
              {/* Left Column — Feature List */}
              <div>
                {tabFeatures[activeTab].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <Check className="size-4 text-[#00A86B] mt-1 shrink-0" />
                    <span className="text-sm text-[#5A8A6E] leading-relaxed">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Column — Mockup Card */}
              <div className="bg-[#F0F7F3] rounded-2xl border border-[#00A86B]/[0.12] p-6">
                {mockups[activeTab]}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
