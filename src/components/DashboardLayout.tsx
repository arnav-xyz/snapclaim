"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  LayoutDashboard,
  CalendarDays,
  Upload,
  BarChart2,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Events", href: "/dashboard/events", icon: CalendarDays },
    { name: "Upload", href: "/dashboard/upload", icon: Upload },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFFFF] font-sans">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#00A86B]/10 flex-col z-50">
        
        {/* Top Section */}
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Camera className="size-6 text-[#00A86B]" />
            <span className="text-xl font-semibold text-[#0A1A12] tracking-tight">SnapClaim</span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="mt-8 flex flex-col gap-1 px-3 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#00A86B]/10 text-[#00A86B]"
                    : "text-[#4A7A5E] hover:text-[#0A1A12] hover:bg-[#00A86B]/10"
                }`}
              >
                <Icon className={`size-5 ${isActive ? "text-[#00A86B]" : "text-[#3A6A4E] group-hover:text-[#0A1A12]"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Photographer Info */}
        <div className="absolute bottom-0 w-full p-4 border-t border-[#00A86B]/[0.12] bg-[#F8FBF9]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#00A86B]/20 rounded-full flex items-center justify-center text-[#00A86B] text-sm font-bold shrink-0">
              RM
            </div>
            <div className="flex-1 truncate">
              <p className="text-[#0A1A12] text-sm font-medium truncate">Rohan Mehta</p>
              <p className="text-[#4A7A5E] text-xs truncate">Pro Plan</p>
            </div>
            <LogOut className="text-[#3A6A4E] hover:text-[#0A1A12] cursor-pointer size-4 shrink-0" />
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white border-t border-[#00A86B]/10 flex justify-around py-3 z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`p-2 rounded-xl transition-all ${
                isActive ? "text-[#00A86B]" : "text-[#9ABFAD]"
              }`}
            >
              <Icon className="size-6" />
            </Link>
          );
        })}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0 min-h-screen flex flex-col">
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#00A86B]/[0.08] px-4 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-[#0A1A12] font-semibold text-lg">{pageTitle}</h1>
          
          <div className="flex items-center gap-4">
            <button className="relative text-[#9ABFAD] hover:text-[#00A86B] transition-colors">
              <Bell className="size-5" />
              <div className="w-2 h-2 bg-[#00A86B] rounded-full absolute top-0 right-0 border border-white" />
            </button>
            <div className="w-8 h-8 bg-[#00A86B]/20 rounded-full flex items-center justify-center text-[#00A86B] text-xs font-bold cursor-pointer">
              RM
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1">
          {children}
        </div>
      </main>

    </div>
  );
}
