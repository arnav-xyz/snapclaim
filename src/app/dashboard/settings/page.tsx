"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface ProfileData {
  name: string;
  email: string;
  studioName: string;
  city: string;
  phone: string;
}

export default function SettingsPage() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    studioName: "",
    city: "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/photographer/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || "",
            email: data.email || "",
            studioName: data.studioName || "",
            city: data.city || "",
            phone: data.phone || "",
          });
        } else {
          toast.error("Failed to load profile");
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/photographer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success("Settings saved!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save settings");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch("/api/photographer/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (res.ok) {
        toast.success("Password updated!");
        setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update password");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const inputClass =
    "w-full bg-[#FFFFFF] border border-[#00A86B]/15 rounded-xl px-4 py-3 text-[#0A1A12] text-sm placeholder:text-[#3A6A4E] outline-none focus:border-[#00A86B]/50 focus:ring-1 focus:ring-[#00A86B]/20 transition-all";
  const labelClass = "text-xs text-[#5A8A6E] font-medium mb-1.5 block";

  return (
    <DashboardLayout pageTitle="Settings">
      <div className="px-4 lg:px-8 py-8 max-w-2xl mx-auto">
        
        {/* SECTION 1: PROFILE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-2xl p-6 mb-6"
        >
          <h2 className="text-[#0A1A12] text-lg font-bold mb-6">Profile Information</h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#00A86B]/20 rounded-full flex items-center justify-center text-[#00A86B] text-xl font-bold shrink-0">
              {profileLoading ? "..." : getInitials(profile.name || "U")}
            </div>
            <button className="border border-[#00A86B]/[0.18] hover:bg-[#00A86B]/[0.12] text-[#0A1A12] text-xs font-medium px-4 py-2 rounded-full transition-colors">
              Change Photo
            </button>
          </div>

          {profileLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={i <= 3 ? "md:col-span-2" : ""}>
                  <div className="h-3 w-20 bg-[#00A86B]/[0.12] rounded mb-2 animate-pulse" />
                  <div className="h-11 bg-[#00A86B]/[0.12] rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Studio Name</label>
                <input
                  type="text"
                  name="studioName"
                  value={profile.studioName}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2 mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-semibold px-6 py-2.5 rounded-full transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* SECTION 2: PASSWORD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#F0F7F3] border border-[#00A86B]/[0.12] rounded-2xl p-6 mb-6"
        >
          <h2 className="text-[#0A1A12] text-lg font-bold mb-6">Change Password</h2>
          
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Min. 8 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                placeholder="Min. 8 characters"
                className={inputClass}
              />
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="bg-[#00A86B] hover:bg-[#009960] text-[#0A1A12] text-sm font-semibold px-6 py-2.5 rounded-full transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {changingPassword ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* SECTION 3: DANGER ZONE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#F0F7F3] border border-red-500/20 rounded-2xl p-6"
        >
          <h2 className="text-red-400 text-lg font-bold mb-6">Danger Zone</h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[#0A1A12] font-medium text-sm">Delete Account</p>
              <p className="text-[#4A7A5E] text-xs mt-1">
                Permanently delete your account and all data.
              </p>
            </div>
            <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium px-4 py-2 rounded-xl transition-all whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
