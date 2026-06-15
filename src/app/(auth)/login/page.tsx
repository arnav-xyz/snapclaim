"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Camera,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { AuthInput } from "@/components/ui/AuthInput";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      if (res?.ok) {
        // Since we are photographer-focused in this updated UI
        router.push("/dashboard");
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
        <div className="absolute top-[20%] left-[-20%] w-96 h-96 bg-[#00A86B] rounded-full blur-[120px] opacity-10 pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Camera className="size-6 text-[#00A86B]" />
            <span className="text-xl font-bold text-[#0A1A12] tracking-tight">SnapClaim</span>
          </Link>

          {/* Main Copy */}
          <h1 className="mt-16 text-4xl lg:text-5xl font-bold text-[#0A1A12] leading-[1.1] tracking-tight">
            Welcome back.<br />Let's deliver<br />some moments.
          </h1>

          {/* Stats */}
          <div className="mt-10 flex flex-col gap-6">
            {[
              { stat: "50K+", label: "Photos delivered today" },
              { stat: "98%", label: "Face match accuracy" },
              { stat: "< 3s", label: "Time to find photos" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-end gap-3"
              >
                <span className="text-3xl font-bold text-[#00A86B] leading-none">{item.stat}</span>
                <span className="text-[#5A8A6E] text-sm mb-1">{item.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-16 pt-10 border-t border-[#00A86B]/[0.12]">
            <div className="bg-[#F0F7F3] rounded-xl p-5 border border-[#00A86B]/[0.12]">
              <div className="text-[#00A86B] text-xs tracking-widest mb-3">★★★★★</div>
              <p className="text-[#5A8A6E] text-sm italic leading-relaxed">
                "My wedding couples used to wait weeks for their album. Now they have all their candids the same evening. SnapClaim is just magic."
              </p>
              <p className="text-[#4A7A5E] text-xs mt-3 font-medium">
                Priya Nair · Wedding Photographer, Bangalore
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:flex-1 flex flex-col items-center justify-center px-6 py-12">
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
              <h2 className="text-2xl font-bold text-[#0A1A12]">Log in to SnapClaim</h2>
              <p className="text-sm text-[#4A7A5E] mt-1 flex items-center gap-1.5">
                <Camera className="size-3.5 text-[#00A86B]" />
                Photographer account
              </p>
            </div>

            {justRegistered && (
              <div className="mt-6 bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <p className="text-[#00A86B] text-sm">Account created! Please sign in.</p>
              </div>
            )}

            {error && (
              <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertCircle className="size-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <AuthInput
                label="Email"
                type="email"
                name="email"
                placeholder="you@studio.com"
                value={form.email}
                onChange={handleChange}
                required
              />

              <div className="relative">
                <AuthInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  rightLabel={
                    <Link
                      href="/forgot-password"
                      className="text-[#00A86B] text-xs hover:underline"
                    >
                      Forgot password?
                    </Link>
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-[#3A6A4E] hover:text-[#0A1A12] transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border border-[#00A86B]/25 appearance-none checked:bg-[#00A86B] checked:border-[#00A86B] cursor-pointer relative after:content-[''] after:absolute after:hidden checked:after:block after:left-[5px] after:top-[2px] after:w-[5px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                />
                <label htmlFor="rememberMe" className="text-[#4A7A5E] text-sm cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] font-semibold py-3.5 rounded-full transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[#00A86B]/[0.12]" />
              <span className="text-[#3A6A4E] text-xs">or</span>
              <div className="flex-1 h-px bg-[#00A86B]/[0.12]" />
            </div>

            <p className="text-center text-sm text-[#4A7A5E]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#00A86B] font-medium hover:text-[#009960] transition-colors"
              >
                Create one free
              </Link>
            </p>
          </motion.div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#4A7A5E]">
              Are you a guest looking for photos?
              <Link href="/event" className="text-[#00A86B] ml-1 hover:underline">
                Enter event code →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
        <Loader2 className="size-8 text-[#00A86B] animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
