"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: "#FFFFFF",
            border: "1px solid rgba(0,168,107,0.12)",
            color: "#0A1A12",
          },
        }}
      />
      {children}
    </SessionProvider>
  );
}
