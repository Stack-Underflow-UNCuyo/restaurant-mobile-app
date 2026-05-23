"use client";

import React from "react";

interface IconProps {
  className?: string;
}

export function CheckedIcon({ className = "w-6 h-6 text-emerald-500" }: IconProps) {
  return (
    <> 
      <svg 
        className={`transition-transform duration-150 scale-100 ${className}`} 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          fillRule="evenodd" 
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.6z" 
          clipRule="evenodd" 
        />
      </svg>
    </>
  );
}

export function UncheckedIcon({ className = "w-6 h-6 text-gray-300 dark:text-white/10" }: IconProps) {
  return (
    <> 
    <svg 
      className={`transition-transform duration-150 scale-100 ${className}`} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
    </>
  );
}