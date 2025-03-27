import React, { useState, useEffect } from "react";
import "./LLMNavbar.css";

interface MenuItem {
  id: string;
  label: string;
}

interface LLMNavbarProps {
  menuItems: MenuItem[];
}

const LLMNavbar: React.FC<LLMNavbarProps> = ({ menuItems }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<number[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<number[]>([]);
  const [showLines, setShowLines] = useState(false);

  // claude does a lot of heavy lifting here, thank you claude
  // Generate random positions on mount
  useEffect(() => {
    // Generate random positions with a wider range (20-180px from right edge)
    const positions = menuItems.map(() => {
      return Math.floor(Math.random() * 140) + 20; // Random between 20-180px
    });
    setNodePositions(positions);

    // Create random order for nodes to appear
    const nodeIndices = Array.from({ length: menuItems.length }, (_, i) => i);
    const shuffledIndices = shuffleArray([...nodeIndices]);

    // Animate nodes appearing one by one
    shuffledIndices.forEach((nodeIndex, i) => {
      setTimeout(() => {
        setVisibleNodes((prev) => [...prev, nodeIndex]);

        // After the last node appears, show the lines
        if (i === shuffledIndices.length - 1) {
          setTimeout(() => {
            setShowLines(true);
          }, 300); // Delay before showing lines
        }
      }, i * 200); // 200ms delay between each node
    });
  }, [menuItems]);

  // Shuffle array function (Fisher-Yates algorithm)
  const shuffleArray = (array: number[]): number[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Handle scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Updated function to determine which section is in the viewport
  const isElementInViewport = (el: Element): boolean => {
    const rect = el.getBoundingClientRect();
    // Consider the element in viewport if at least 50% of it is visible
    return (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    );
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're at the top of the page (special case for "Home")
      if (window.scrollY === 0) {
        setActiveSection("section1");
        return;
      }

      // Find which section is currently most visible in the viewport
      for (const item of menuItems) {
        const element = document.getElementById(item.id);
        if (element && isElementInViewport(element)) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Call once on mount to set initial active section
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

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
                stroke="#cccccc"
                strokeWidth="2"
                className={`llm-navbar-line ${showLines ? "visible" : ""}`}
              />
            );
          })}
      </svg>

      {/* Nodes */}
      {menuItems.map((item, index) => {
        const rightPos = nodePositions[index] || 40;
        const topPercent = index / (menuItems.length - 1);
        const isVisible = visibleNodes.includes(index);

        return (
          <div
            key={item.id}
            className={`llm-navbar-node ${isVisible ? "visible" : ""}`}
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
