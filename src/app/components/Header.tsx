import React, { useState, useEffect } from "react";
import "./Header.css";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const animationDelay = 1750; // approx time for the svg lines to draw in = 1400 + 300 + 200 ms (minus 150ms for my own preference)

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const titleTransform = `translateY(${scrollPosition * 0.2}px)`;
  const subtitleTransform = `translateY(${scrollPosition * 0.63}px)`;

  return (
    <div className="header-section">
      <h1
        className={`name-title ${isVisible ? "visible" : ""}`}
        style={{ transform: isVisible ? titleTransform : "translateY(30px)" }}
      >
        Chris Meah
      </h1>
      <h2
        className={`name-subtitle ${isVisible ? "visible" : ""}`}
        style={{
          transform: isVisible ? subtitleTransform : "translateY(-30px)",
        }}
      >
        the AI Genius Extraodinaire
      </h2>
    </div>
  );
}
