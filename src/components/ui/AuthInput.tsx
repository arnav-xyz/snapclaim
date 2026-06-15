import React from "react";
import { AlertCircle } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
  error?: string;
  rightLabel?: React.ReactNode;
}

export function AuthInput({
  label,
  optional,
  error,
  rightLabel,
  className = "",
  ...props
}: AuthInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs text-[#5A8A6E] font-medium">
          {label}
          {optional && <span className="text-[#3A6A4E] ml-1">(optional)</span>}
        </label>
        {rightLabel}
      </div>
      <div className="relative">
        <input
          className={`w-full bg-[#FFFFFF] border border-[#00A86B]/20 
            rounded-xl px-4 py-3 text-[#0A1A12] text-sm
            placeholder:text-[#3A6A4E] outline-none
            focus:border-[#00A86B]/50 focus:ring-1 
            focus:ring-[#00A86B]/20 transition-all
            disabled:opacity-50 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}
