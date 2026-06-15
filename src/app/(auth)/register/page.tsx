"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Camera,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";

export default function RegisterPage() {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    studioName: "",
    city: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords don't match" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          studioName: form.studioName,
          city: form.city,
          phone: form.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const errors: Record<string, string> = {};
          for (const err of data.details) {
            const field = err.path?.[0];
            if (field) errors[field] = err.message;
          }
          setFieldErrors(errors);
        }
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-sans">
      
      {/* LEFT SIDE (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 max-w-xl xl:max-w-2xl border-r border-[#00A86B]/[0.12] min-h-screen relative overflow-hidden">
        
        {/* Subtle background gradient */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00A86B] rounded-full blur-[120px] opacity-10 pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Camera className="size-6 text-[#00A86B]" />
            <span className="text-xl font-bold text-[#0A1A12] tracking-tight">SnapClaim</span>
          </Link>

          {/* Main Copy */}
          <h1 className="mt-16 text-4xl lg:text-5xl font-bold text-[#0A1A12] leading-[1.1] tracking-tight">
            The fastest way to deliver<br />your event photos.
          </h1>

          {/* Trust Points */}
          <div className="mt-10 flex flex-col gap-5">
            {[
              "Set up your first event in under 2 minutes",
              "AI indexes every face automatically",
              "Guests find their photos by scanning their face"
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#00A86B]/10 rounded-full flex items-center justify-center shrink-0">
                  <Check className="size-3.5 text-[#00A86B]" />
                </div>
                <span className="text-[#5A8A6E] text-sm">{point}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-16 pt-10 border-t border-[#00A86B]/[0.12]">
            <div className="bg-[#F0F7F3] rounded-xl p-5 border border-[#00A86B]/[0.12]">
              <div className="text-[#00A86B] text-xs tracking-widest mb-3">★★★★★</div>
              <p className="text-[#5A8A6E] text-sm italic leading-relaxed">
                "SnapClaim saved me hours of sorting after every event. I just upload the entire folder and the AI does the rest."
              </p>
              <p className="text-[#4A7A5E] text-xs mt-3 font-medium">
                Rohan Mehta · Event Photographer, Pune
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mx-auto">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-10">
            <Camera className="size-6 text-[#00A86B]" />
            <span className="text-xl font-bold text-[#0A1A12] tracking-tight">SnapClaim</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#00A86B]/10 rounded-2xl p-8 w-full"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#0A1A12]">Create your account</h2>
              <p className="text-sm text-[#4A7A5E] mt-1">
                For photographers only. Guests don't need an account.
              </p>
            </div>

            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertCircle className="size-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <AuthInput
                label="Full Name"
                name="name"
                placeholder="Rohan Mehta"
                value={form.name}
                onChange={handleChange}
                error={fieldErrors.name}
                required
              />

              <AuthInput
                label="Email"
                type="email"
                name="email"
                placeholder="you@studio.com"
                value={form.email}
                onChange={handleChange}
                error={fieldErrors.email}
                required
              />

              <AuthInput
                label="Studio Name"
                name="studioName"
                placeholder="Rohan Photography Co."
                value={form.studioName}
                onChange={handleChange}
                error={fieldErrors.studioName}
                optional
              />

              <div className="grid grid-cols-2 gap-3">
                <AuthInput
                  label="City"
                  name="city"
                  placeholder="Pune"
                  value={form.city}
                  onChange={handleChange}
                  error={fieldErrors.city}
                  optional
                />
                <AuthInput
                  label="Phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  error={fieldErrors.phone}
                  optional
                />
              </div>

              <div className="relative">
                <AuthInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  error={fieldErrors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-[#3A6A4E] hover:text-[#0A1A12] transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              <div className="relative">
                <AuthInput
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Min. 8 characters"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={fieldErrors.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-9 text-[#3A6A4E] hover:text-[#0A1A12] transition-colors"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] font-semibold py-3.5 rounded-full transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#00A86B]/[0.12]" />
              <span className="text-[#3A6A4E] text-xs">or</span>
              <div className="flex-1 h-px bg-[#00A86B]/[0.12]" />
            </div>

            <p className="text-center text-sm text-[#4A7A5E]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#00A86B] hover:text-[#009960] font-medium transition-colors"
              >
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
