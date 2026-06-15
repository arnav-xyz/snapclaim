"use client";

import { motion } from "framer-motion";

const stats = [
  { number: "50K+", label: "Photos delivered daily" },
  { number: "1,200+", label: "Events hosted" },
  { number: "98%", label: "Face match accuracy" },
  { number: "< 3s", label: "Time to find your photos" },
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

export default function Stats() {
  return (
    <section className="bg-[#FFFFFF] py-20 border-t border-b border-[#00A86B]/[0.12]">
      <motion.div
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.number}
            variants={itemVariants}
            className={`text-center md:text-left ${
              index < stats.length - 1
                ? "md:border-r md:border-[#00A86B]/[0.12]"
                : ""
            }`}
          >
            <p className="text-5xl md:text-6xl font-bold text-[#0A1A12] tracking-tight">
              {stat.number}
            </p>
            <p className="text-sm text-[#4A7A5E] mt-2 leading-relaxed">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
