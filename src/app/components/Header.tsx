import React, { useState, useEffect } from "react";
import "./Header.css";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animationDelay = 1750; // approx time for the svg lines to draw in = 1400 + 300 + 200 ms (minus 150ms for my own preference)

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="header-section">
      <h1 className={`name-title ${isVisible ? "visible" : ""}`}>Chris Meah</h1>
      <h2 className={`name-subtitle ${isVisible ? "visible" : ""}`}>
        AI Genius Extraodinaire
      </h2>
    </div>
  );
}
