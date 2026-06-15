"use client";

import { Toaster } from "react-hot-toast";

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#F0F7F3",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#00A86B", secondary: "#F0F7F3" },
          },
        }}
      />
      {children}
    </>
  );
}
