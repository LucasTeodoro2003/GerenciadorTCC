"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "next-themes";

const COLORS = {
  darkBg: "#23272a",        
  lightBg: "#f3f4f6",       
  border: "#a1a1aa",        
  sun: "#ffd600",
  moon: "#64748b",
  knobDark: "#0f172a",
  knobLight: "#ffeccf",
  shadow: "#d1d5db", 
};

export default function ThemeToggleV2() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setChecked(currentTheme === "dark");
  }, [theme, systemTheme]);

  function handleToggle() {
    setTheme(checked ? "light" : "dark");
    setChecked((prev) => !prev);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <label className="relative inline-block w-[4.873em] h-[2.436em]">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          className="absolute opacity-0 w-0 h-0"
        />

        <motion.div
          className={`absolute w-full h-full rounded-full border-[1.2px] transition-colors`}
          style={{
            backgroundColor: checked ? COLORS.darkBg : COLORS.lightBg,
            borderColor: COLORS.border,
            boxShadow: `0 3px 7px ${COLORS.shadow}`,
          }}
        >
          <motion.span
            className="absolute"
            style={{ height: "1.462em", width: "1.462em" }}
            initial={false}
            animate={{
              opacity: checked ? 0 : 1,
              transform: checked
                ? "translate(0.730em, 0.487em) rotate(0deg)"
                : "translate(0.389em, 0.487em) rotate(15deg)",
            }}
            transition={{
              opacity: { duration: 0.15 },
              transform: { duration: 0.5, ease: [0.26, 2, 0.46, 0.71] },
            }}
          >
            <FaSun size="1.462em" color={COLORS.sun} />
          </motion.span>

          <motion.span
            className="absolute"
            style={{ height: "1.462em", width: "1.462em" }}
            initial={false}
            animate={{
              opacity: checked ? 1 : 0,
              transform: checked
                ? "translate(2.924em, 0.487em) rotate(-15deg)"
                : "translate(2.680em, 0.487em) rotate(0deg)",
            }}
            transition={{
              opacity: { duration: 0.15 },
              transform: { duration: 0.5, ease: [0.26, 2.5, 0.46, 0.71] },
            }}
          >
            <FaMoon size="1.462em" color={COLORS.moon} />
          </motion.span>

          <motion.div
            className="absolute rounded-full"
            initial={false}
            animate={{
              backgroundColor: checked ? COLORS.knobDark : COLORS.knobLight,
              boxShadow: checked
                ? `inset 0px 0px 0px 0.293em ${COLORS.lightBg}`
                : `inset 0px 0px 0px 0.293em ${COLORS.sun}`,
              transform: checked
                ? "translate(0.389em, 0.341em)"
                : "translate(2.631em, 0.341em)",
            }}
            style={{ height: "1.656em", width: "1.656em" }}
            transition={{
              backgroundColor: { duration: 0.25 },
              boxShadow: { duration: 0.25 },
              transform: { duration: 0.5, ease: [0.26, 2, 0.46, 0.71] },
            }}
          />
        </motion.div>
      </label>
    </div>
  );
}