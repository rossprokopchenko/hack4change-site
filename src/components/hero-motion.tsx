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
    const countdownStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '9999px',
      backgroundColor: 'transparent',
      backdropFilter: 'blur(4px)',
      padding: '0.5rem 1.5rem',
      color: 'var(--mui-palette-primary-main)',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: '1.125rem',
      letterSpacing: '0.05em',
      boxShadow: '0 0 12px var(--mui-palette-primary-main)',
      border: '1px solid var(--mui-palette-primary-main)'
    };

    if (completed) {
      return (
        <div style={countdownStyle}>
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
      <div style={countdownStyle}>
        {text}
      </div>
    );
  };
  

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '80vh',
      borderRadius: '1rem',
      overflow: 'hidden',
      // border: '1px solid var(--mui-palette-primary-main)',
      color: 'var(--mui-palette-text-primary)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem 1rem'
    }}>

      {/* Main content container - centered */}
      <div style={{
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%'
      }}>
        
        {/* Partner Logos at top-right */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "3.5rem",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
            marginBottom: "0rem",
            paddingRight: "1rem",
          }}
        >
          {/* United Way Logo */}
          <a
            href="https://gmsenbunitedway.ca/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/Logos/Partners/UnitedWay_light.png"
              alt="United Way"
              width={180}
              height={60}
              className="logo-light"
              style={{ 
                height: "clamp(60px, 10vw, 100px)", 
                width: "auto",
                cursor: "pointer",
              }}
            />
            <Image
              src="/Logos/Partners/UnitedWay_dark.png"
              alt="United Way"
              width={180}
              height={60}
              className="logo-dark"
              style={{ 
                height: "clamp(60px, 10vw, 100px)", 
                width: "auto",
                cursor: "pointer",
              }}
            />
          </a>

          {/* GMHSC Logo */}
          <a
            href="https://www.monctonhomelessness.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/Logos/Partners/gmhsc_light.png"
              alt="Greater Moncton Homelessness Steering Committee"
              width={220}
              height={60}
              className="logo-light"
              style={{ 
                height: "clamp(60px, 10vw, 100px)", 
                width: "auto",
                cursor: "pointer",
              }}
            />
            <Image
              src="/Logos/Partners/gmhsc_dark.png"
              alt="Greater Moncton Homelessness Steering Committee"
              width={220}
              height={60}
              className="logo-dark"
              style={{ 
                height: "clamp(60px, 10vw, 100px)", 
                width: "auto",
                cursor: "pointer",
              }}
            />
          </a>
        </motion.div>

        {/* Title - Main Focus (Logo) */}
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}
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

        {/* Subtitle with CTM Logo - Horizontally Aligned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
          style={{ 
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            marginTop: '1rem'
          }}
        >
          {subtitle && (                                           
            <span
              style={{ 
                color: "var(--mui-palette-text-primary)",
                fontSize: "clamp(1.25rem, 4vw, 1.5rem)",
                fontWeight: 600,
              }}
            >
              {subtitle}
            </span>
          )}
          <a
            href="https://civictechmoncton.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <Image
              src="/Logos/CTM SVG/Logo With Sign/CTM_Logotype_horizontal_4.svg"
              alt="Civic Tech Moncton"
              width={200}
              height={50}
              className="logo-light"
              style={{ 
                height: "clamp(32px, 5vw, 44px)", 
                width: "auto",
                cursor: "pointer"
              }}
            />
            <Image
              src="/Logos/CTM SVG/Logo With Sign/CTM_Logotype_horizontal_5.svg"
              alt="Civic Tech Moncton"
              width={200}
              height={50}
              className="logo-dark"
              style={{ 
                height: "clamp(32px, 5vw, 44px)", 
                width: "auto",
                cursor: "pointer"
              }}
            />
          </a>
        </motion.div>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            style={{ 
              color: "var(--mui-palette-text-primary)",
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              maxWidth: "48rem",
              lineHeight: 1.625,
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center"
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
          >
            {subheadline}
          </motion.p>
        )}
      </div>

      {/* Spacer to help balance middle content */}
      <div style={{ flex: 0.5 }} />

      {/* Countdown - Centered in bottom space */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        width: '100%',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}>
        <motion.div
          style={{ 
            fontSize: "1.2rem", 
            color: "var(--mui-palette-text-primary)" 
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        >
          <Countdown date={eventDate} renderer={countdownRenderer} />
        </motion.div>
      </div>
    </div>
  );
}
