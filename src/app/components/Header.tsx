import React, { useState, useEffect } from "react";
import NetworkGraph from "./NetworkGraph";
import "./Header.css";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [subtitleOpacity, setSubtitleOpacity] = useState(1);

  useEffect(() => {
    const animationDelay = 1750; // approx time for the svg lines to draw in +/-50ms

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollPosition(currentScroll);

      const fadeStartPoint = 1150;
      const fadeEndPoint = 1200;

      if (currentScroll <= fadeStartPoint) {
        setSubtitleOpacity(1);
      } else if (currentScroll >= fadeEndPoint) {
        setSubtitleOpacity(0);
      } else {
        const fadeProgress =
          (currentScroll - fadeStartPoint) / (fadeEndPoint - fadeStartPoint);
        setSubtitleOpacity(1 - fadeProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const titleTransform = `translateY(${scrollPosition * 0.2}px)`;
  const subtitleTransform = `translateY(${scrollPosition * 0.67}px)`;
  const graphTransform = `translateY(${scrollPosition * 0.35}px)`;

  return (
    <div className="header-section">
      <div className="header-content">
        <div className="text-content">
          <h1
            className={`name-title ${isVisible ? "visible" : ""}`}
            style={{
              transform: isVisible ? titleTransform : "translateY(30px)",
            }}
          >
            Chris[Meah]
          </h1>
          <h2
            className={`name-subtitle ${isVisible ? "visible" : ""}`}
            style={{
              transform: isVisible ? subtitleTransform : "translateY(-30px)",
              opacity: isVisible ? subtitleOpacity : 0,
              transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
            }}
          >
            the AI Genius Extraordinaire
          </h2>
        </div>
        <div
          className={`network-wrapper ${isVisible ? "visible" : ""}`}
          style={{
            transform: isVisible ? graphTransform : "translateX(60px)",
          }}
        >
          <NetworkGraph />
        </div>
      </div>
    </div>
  );
}
