import React, { useState, useEffect } from "react";
import "./PageHeaders.css";

export default function PageHeaders() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // approx time for the svg lines to draw in +/-50ms
    // different for each pageheader, depending on number of props passed in to the navbar
    const animationDelay = 1250;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollPosition(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const titleTransform = `translateY(${scrollPosition * 0.2}px)`;

  return (
    <div className="pageheader-section">
      <div
        className={`pageheader-title ${isVisible ? "visible" : ""}`}
        style={{ transform: isVisible ? titleTransform : "translateY(30px)" }}
      >
        <h1>Consulting</h1>
        <h2 className="pageheader-subtitle">Bespoke, practical, tailored</h2>
      </div>
    </div>
  );
}
