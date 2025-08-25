"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "next-themes";

// Substitua as cores abaixo pelas cores do seu projeto se necessário.
const COLORS = {
  darkBg: "#23272a",         // Exemplo: fundo do toggle no modo escuro
  lightBg: "#f3f4f6",        // Exemplo: fundo do toggle no modo claro
  border: "#a1a1aa",         // Exemplo: cor da borda
  sun: "#ffd600",            // Exemplo: cor do sol (ícone claro)
  moon: "#64748b",           // Exemplo: cor da lua (ícone escuro)
  knobDark: "#0f172a",       // Exemplo: cor do botão no modo escuro
  knobLight: "#ffeccf",      // Exemplo: cor do botão no modo claro
  shadow: "#d1d5db",         // Exemplo: shadow
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

  // 5% menor: 5.13em -> 4.873em, 2.565em -> 2.436em, 1.539em -> 1.462em, 1.744em -> 1.656em,
  // 3.078em -> 2.924em, 2.821em -> 2.680em, 0.410em -> 0.389em, 0.513em -> 0.487em, 0.359em -> 0.341em, 2.77em -> 2.631em
  // Borda segue border-[1.2px]
  // Shadow reduzido: 4.104px -> 3px, 12.312px -> 7px

  return (
    <div className="flex items-center justify-center h-full">
      <label className="relative inline-block w-[4.873em] h-[2.436em]">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          className="absolute opacity-0 w-0 h-0"
        />

        {/* Toggle Slot */}
        <motion.div
          className={`absolute w-full h-full rounded-full border-[1.2px] transition-colors`}
          style={{
            backgroundColor: checked ? COLORS.darkBg : COLORS.lightBg,
            borderColor: COLORS.border,
            boxShadow: `0 3px 7px ${COLORS.shadow}`,
          }}
        >
          {/* Sun Icon */}
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

          {/* Moon Icon */}
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

          {/* Toggle Button */}
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