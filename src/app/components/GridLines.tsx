"use client";

import { useEffect, useState } from "react";

export default function GridLines() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);

  // grid settings (size of squares, area revealed by mouse, and amount of feathering)
  const gridSize = 20;
  const revealRadius = 70;
  const featherSize = 1000;

  // these styles need to be inline here, because otherwise they get lost as the page scrolls
  // React.CSSProperties type
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: -1, // Place behind all content
  };

  // css grid pattern
  // // these styles need to be inline here, because otherwise they get lost as the page scrolls
  const gridStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `
            linear-gradient(to right, rgba(200, 200, 200, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(200, 200, 200, 0.4) 1px, transparent 1px)
          `,
    backgroundSize: `${gridSize}px ${gridSize}px`,
    opacity: 0,
    mixBlendMode: "multiply",
  };

  // circular mask to follow mouse over the top of the gridStyle grid pattern
  // these styles need to be inline here, because otherwise they get lost as the page scrolls
  const maskStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `radial-gradient(
            circle ${revealRadius}px at ${mousePosition.x}px ${
      mousePosition.y
    }px, 
            rgba(255, 255, 255, 1) 0%, 
            rgba(255, 255, 255, 0.8) ${revealRadius - featherSize}px, 
            rgba(255, 255, 255, 0) ${revealRadius}px
          )`,
    // claude magic to only show the grid where the mouse mask exists
    mixBlendMode: "source-in" as React.CSSProperties["mixBlendMode"], // claude also suggested defining specifically this type, as it was throwing a type error, and defining the whole style block didn't work
    display: isMouseInside ? "block" : "none",
  };

  // functions to track mous emovement
  useEffect(() => {
    // use type MouseEvent for the type of the event handler
    // tried using React.ChangeEvent<any>, but it didn't work
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setIsMouseInside(true);
    };

    const handleMouseLeave = () => {
      setIsMouseInside(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  return (
    <div style={containerStyle}>
      <div id="grid-layer" style={gridStyle} />
      <div
        id="mask-layer"
        style={{
          ...maskStyle,
          WebkitMaskImage: `radial-gradient(
      circle ${revealRadius}px at ${mousePosition.x}px ${mousePosition.y}px, 
      black 0%, 
      rgba(0, 0, 0, 0.8) ${revealRadius - featherSize}px, 
      transparent ${revealRadius}px
    )`,
          maskImage: `radial-gradient(
      circle ${revealRadius}px at ${mousePosition.x}px ${mousePosition.y}px, 
      black 0%, 
      rgba(0, 0, 0, 0.8) ${revealRadius - featherSize}px, 
      transparent ${revealRadius}px
    )`,
          background: `
      linear-gradient(to right, rgba(100, 100, 100, 0.7) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(100, 100, 100, 0.7) 1px, transparent 1px)
    `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          mixBlendMode: "normal",
        }}
      />
    </div>
  );
}
