"use client";

import { useState, useEffect } from "react";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fade from "@mui/material/Fade";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fade in={isVisible}>
      <Fab
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: { xs: 16, md: 32 },
          right: { xs: 16, md: 32 },
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": {
            bgcolor: "primary.dark",
          },
          zIndex: 1000,
        }}
        aria-label="scroll to top"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Fade>
  );
}
