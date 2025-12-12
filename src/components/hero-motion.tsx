"use client";

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "@/services/i18n/client";

import { useTheme, useColorScheme } from "@mui/material/styles";
import Image from "next/image";

export default function HeroMotion({
  children,
  subtitle,
  subheadline,
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  subheadline?: React.ReactNode;
}) {
  const { t } = useTranslation("home");
  const theme = useTheme();
  const { mode } = useColorScheme();

  const logoSrc = mode === "dark"
    ? "/Logos/Hack4Change Logo SVG/Primary Full Logo/Final Logo Moncton.svg"
    : "/Logos/Hack4Change Logo SVG/Primary Full Logo/Final Logo Moncton_Primary Log_Light.svg";

  const [isTextHovered, setIsTextHovered] = useState(false);

  // Get secondary color for glow effect
  const glowColor = "#c8da2c";

  const eventDate = new Date("2026-03-13T17:00:00");

  // Renderer for Countdown display
  const countdownRenderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return (
        <div className="inline-flex items-center justify-center rounded-full bg-cyan-900/40 backdrop-blur-sm px-6 py-2 text-cyan-300 font-mono text-lg tracking-wider shadow-[0_0_12px_#00ffff] border border-cyan-400/30">
          {t("home:countdown.completed")}
        </div>
      );
    }

    const parts = [];
    if (days > 0) parts.push(`${days} ${days === 1 ? t("home:countdown.day") : t("home:countdown.days")}`);
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? t("home:countdown.hour") : t("home:countdown.hours")}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? t("home:countdown.minute") : t("home:countdown.minutes")}`);
    if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? t("home:countdown.second") : t("home:countdown.seconds")}`);

    let text = "";
    if (parts.length === 0) {
       text = ""; // Should ideally not happen if not completed, but safe fallback
    } else if (parts.length === 1) {
      text = parts[0];
    } else {
      const lastPart = parts.pop();
      text = `${parts.join(", ")} ${t("home:countdown.and")} ${lastPart}`;
    }

    return (
      <div className="inline-flex items-center justify-center rounded-full bg-cyan-900/40 backdrop-blur-sm px-6 py-2 text-cyan-300 font-mono text-lg tracking-wider shadow-[0_0_12px_#00ffff] border border-cyan-400/30">
        {text}
      </div>
    );
  };
  

  return (
    <div className="relative w-full min-h-[80vh] rounded-2xl overflow-hidden bg-black text-white flex flex-col justify-center items-center px-4 py-12">

      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(120deg, #001f3f 0%, #004f8c 40%, #00a9ff 80%)",
          backgroundSize: "100% 100%",
          opacity: 0.55,
          filter: "blur(2px)",
        }}
      />

      {/* Main content container - centered */}
      <div className="z-20 flex flex-col items-center justify-center flex-1 w-full">
        
        {/* Title - Main Focus (Logo) */}
        <motion.div
          className="flex justify-center items-center w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Image
            src="/Logos/Hack4Change Logo SVG/Primary Full Logo/Final Logo Moncton_Primary Log_Light.svg"
            alt="Hack4Change"
            width={800}
            height={300}
            priority
            className="logo-light"
            onMouseEnter={() => setIsTextHovered(true)}
            onMouseLeave={() => setIsTextHovered(false)}
            style={{ 
              width: "100%", 
              height: "auto", 
              maxWidth: "800px",
              filter: isTextHovered ? `drop-shadow(0 0 30px ${glowColor}) drop-shadow(0 0 60px ${glowColor})` : "none",
              transition: "filter 0.3s ease",
              cursor: "pointer"
            }}
          />
          <Image
            src="/Logos/Hack4Change Logo SVG/Primary Full Logo/Final Logo Moncton.svg"
            alt="Hack4Change"
            width={800}
            height={300}
            priority
            className="logo-dark"
            onMouseEnter={() => setIsTextHovered(true)}
            onMouseLeave={() => setIsTextHovered(false)}
            style={{ 
              width: "100%", 
              height: "auto", 
              maxWidth: "800px",
              filter: isTextHovered ? `drop-shadow(0 0 30px ${glowColor}) drop-shadow(0 0 60px ${glowColor})` : "none",
              transition: "filter 0.3s ease",
              cursor: "pointer"
            }}
          />
        </motion.div>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="mt-8 mb-4 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
            style={{ 
              color: "var(--mui-palette-text-main)",
              fontSize: "clamp(1.5rem, 5vw, 1.875rem)",
              fontWeight: 700,
            }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            className="text-base md:text-lg max-w-3xl leading-relaxed mx-auto text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
            style={{ color: "var(--mui-palette-text-main)" }}
          >
            {subheadline}
          </motion.p>
        )}
      </div>

      {/* Countdown at bottom */}
      <motion.div
        className="z-20 mt-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        style={{ fontSize: "1.2rem", color: "var(--mui-palette-text-main)" }}
        
      >
        <Countdown date={eventDate} renderer={countdownRenderer} />
      </motion.div>
    </div>
  );
}
