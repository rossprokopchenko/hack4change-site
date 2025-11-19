"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "@/services/i18n/client";

export default function HeroMotion({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
}) {

  const { t } = useTranslation("home");

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
    <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden bg-black text-white flex flex-col justify-center items-center">

      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(120deg, #001f3f 0%, #004f8c 40%, #00a9ff 100%)",
          backgroundSize: "300% 300%",
          opacity: 0.55,
          filter: "blur(2px)",
        }}
      />

      {/* Title */}
      <motion.h1
        className="z-20 text-5xl md:text-6xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        style={{
          textShadow: "0 0 12px rgba(0,255,255,0.5), 0 0 24px rgba(0,140,255,0.4)",
        }}
      >
        {children}
      </motion.h1>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className="z-20 mt-4 text-lg text-cyan-100/80 text-center max-w-xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Countdown using react-countdown */}
        <motion.div
        className="z-20 mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        >
        <Countdown date={eventDate} renderer={countdownRenderer} />
        </motion.div>


      {/* Divider */}
      <motion.div
        className="z-20 mt-6 w-32 h-[2px] bg-cyan-400/40 shadow-[0_0_8px_#00ffff]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      />
    </div>
  );
}
