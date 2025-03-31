"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className={`fixed bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full shadow-md focus:outline-none focus:ring-2 transition-all duration-300 
        ${isDark ? "bg-gradient-to-r from-slate-600 to-black text-white hover:from-black hover:to-slate-500 focus:ring-white" 
                : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-orange-500 hover:to-yellow-400 focus:ring-black"}`}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}