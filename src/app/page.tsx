"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import ForPhotographers from "@/components/landing/ForPhotographers";
import ForGuests from "@/components/landing/ForGuests";
import FeatureTabs from "@/components/landing/FeatureTabs";
import SocialProof from "@/components/landing/SocialProof";
import Pricing from "@/components/landing/Pricing";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#0A1A12] font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Section 1 — Hero */}
      <Hero />

      {/* Section 2 — Stats Row */}
      <Stats />

      {/* Section 3 — How It Works */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Section 4 — For Photographers */}
      <section id="for-photographers">
        <ForPhotographers />
      </section>

      {/* Section 5 — For Guests */}
      <ForGuests />

      {/* Section 6 — Feature Tabs */}
      <FeatureTabs />

      {/* Section 7 — Social Proof / Testimonials */}
      <SocialProof />

      {/* Section 8 — Pricing */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* Section 9 — CTA Banner */}
      <CTABanner />

      {/* Section 10 — Footer */}
      <Footer />
    </div>
  );
}
