"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    monthlyPrice: "₹0",
    annualPrice: "₹0",
    priceSuffix: "/ month",
    featured: false,
    features: [
      "1 active event",
      "Up to 50 photos",
      "Basic face scan",
      "Passcode sharing",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    monthlyPrice: "₹999",
    annualPrice: "₹799",
    priceSuffix: "/ month",
    featured: true,
    features: [
      "Unlimited events",
      "2,000 photos / month",
      "AI face scan + ZIP download",
      "QR code generation",
      "Download analytics",
      "Priority support",
    ],
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    priceSuffix: "pricing",
    featured: false,
    features: [
      "Unlimited everything",
      "White label (your domain)",
      "Custom branding on photos",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Us",
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
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="bg-[#FFFFFF] py-32 px-6">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerVariants}
      >
        <motion.p
          className="text-xs font-medium tracking-[3px] text-[#00A86B] uppercase mb-4"
          variants={itemVariants}
        >
          PRICING
        </motion.p>

        <motion.h2
          className="text-5xl md:text-6xl font-bold text-[#0A1A12] tracking-tight mb-8 font-sans"
          variants={itemVariants}
        >
          Start free.
          <br />
          Scale when you&apos;re ready.
        </motion.h2>

        {/* Toggle */}
        <motion.div
          className="flex items-center gap-3 mb-12"
          variants={itemVariants}
        >
          <div className="bg-[#F0F7F3] rounded-full p-1 border border-[#00A86B]/15 inline-flex">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm transition-colors ${
                !isAnnual ? "bg-[#00A86B]/[0.18] text-[#0A1A12]" : "text-[#4A7A5E]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm transition-colors ${
                isAnnual ? "bg-[#00A86B]/[0.18] text-[#0A1A12]" : "text-[#4A7A5E]"
              }`}
            >
              Annual
            </button>
          </div>
          {isAnnual && (
            <span className="bg-[#00A86B]/20 text-[#00A86B] text-xs px-2 py-0.5 rounded-full ml-2">
              Save 20%
            </span>
          )}
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {plans.map((plan) => {
            const isFeatured = plan.featured;
            return (
              <motion.div
                key={plan.name}
                className={`rounded-2xl p-8 relative overflow-hidden ${
                  isFeatured
                    ? "bg-[#00A86B]"
                    : "bg-white border border-[#00A86B]/10 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                }`}
                variants={itemVariants}
              >
                {isFeatured && (
                  <span className="absolute top-4 right-4 bg-[#FFFFFF]/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                <p className={`text-xl font-semibold ${isFeatured ? 'text-white' : 'text-[#0A1A12]'}`}>{plan.name}</p>

                <div className="mt-2">
                  <span className={`text-4xl font-bold ${isFeatured ? 'text-white' : 'text-[#0A1A12]'}`}>
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      isFeatured ? "text-white/70" : "text-[#4A7A5E]"
                    }`}
                  >
                    {plan.priceSuffix}
                  </span>
                </div>

                <div
                  className={`my-6 border-t ${
                    isFeatured ? "border-[#FFFFFF]/20" : "border-[#00A86B]/[0.12]"
                  }`}
                />

                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check
                        className={`size-4 shrink-0 ${
                          isFeatured ? "text-white" : "text-[#4A7A5E]"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isFeatured ? "text-white/90" : "text-[#5A8A6E]"
                        }`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full rounded-full py-3 text-sm font-medium mt-6 transition-colors ${
                    isFeatured
                      ? "bg-white text-[#00A86B] font-semibold hover:bg-white/90"
                      : "border border-[#00A86B]/25 text-[#0A1A12] hover:bg-[#00A86B]/[0.12]"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
