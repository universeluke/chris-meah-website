import React, { useState, useEffect } from "react";
import "./LLMNavbar.css";

interface MenuItem {
  id: string;
  label: string;
}

const LLMNavbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<number[]>([]);

  // Menu items for your navbar - 7 sections
  const menuItems: MenuItem[] = [
    { id: "section1", label: "Home" },
    { id: "section2", label: "About" },
    { id: "section3", label: "Services" },
    { id: "section4", label: "Projects" },
    { id: "section5", label: "Portfolio" },
    { id: "section6", label: "Team" },
    { id: "section7", label: "Contact" },
  ];

  // Generate random positions on mount
  useEffect(() => {
    // Generate random positions with a wider range (20-180px from right edge)
    const positions = menuItems.map(() => {
      return Math.floor(Math.random() * 160) + 20; // Random between 20-180px
    });
    setNodePositions(positions);
  }, []);

  // Handle scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Calculate the percentage of the page that has been scrolled
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);

      // Determine the active section based on scroll percentage
      const sectionIndex = Math.min(
        Math.floor(scrollPercentage * menuItems.length),
        menuItems.length - 1
      );

      const currentSectionId = menuItems[sectionIndex]?.id;

      if (currentSectionId !== activeSection) {
        setActiveSection(currentSectionId);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, menuItems]);

  return (
    <div className="llm-navbar">
      {/* SVG Lines */}
      <svg className="llm-navbar-svg" style={{ overflow: "visible" }}>
        {nodePositions.length > 0 &&
          menuItems.map((_, index) => {
            if (index >= menuItems.length - 1) return null;

            const startRight = nodePositions[index] || 40;
            const endRight = nodePositions[index + 1] || 40;

            // Calculate exact centers of the nodes
            // Node radius is 24px (12px width/2)
            const centerOffsetX = 24; // Half of button radius

            // Convert to SVG coordinates (from right edge)
            const startX = 200 - startRight - centerOffsetX;
            const endX = 200 - endRight - centerOffsetX;

            // Calculate vertical positions as percentage of viewport height
            const startYPercent = index / (menuItems.length - 1);
            const endYPercent = (index + 1) / (menuItems.length - 1);

            // We use percentages for Y coordinates to maintain full-height spanning
            return (
              <line
                key={`line-${index}`}
                x1={startX}
                y1={`${startYPercent * 100}%`}
                x2={endX}
                y2={`${endYPercent * 100}%`}
                stroke="#94A3B8" // slate-400 (darker for better visibility)
                strokeWidth="2"
              />
            );
          })}
      </svg>

      {/* Nodes */}
      {menuItems.map((item, index) => {
        const rightPos = nodePositions[index] || 40;
        const topPercent = index / (menuItems.length - 1);

        return (
          <div
            key={item.id}
            className="llm-navbar-node"
            style={{
              top: `calc(${topPercent * 100}% - 24px)`, // center vertically (24px = half of node height)
              right: `${rightPos}px`,
            }}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`llm-navbar-button ${
                activeSection === item.id ? "active" : ""
              }`}
              aria-label={item.label}
            >
              <span className="llm-navbar-number">{index + 1}</span>

              {/* Label that appears on hover */}
              <span className="llm-navbar-label">{item.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default LLMNavbar;
