import React, { useState, useEffect } from "react";
import "./Menu.css";
import Link from "next/link";

interface MenuItem {
  id: string;
  label: string;
  href: string;
}

const Menu: React.FC = () => {
  const [active, setActive] = useState(false);
  const [nodePositions, setNodePositions] = useState<number[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<number[]>([]);
  const [showLines, setShowLines] = useState(false);

  const menuItems: MenuItem[] = React.useMemo(
    () => [
      { id: "menu1", label: "Home", href: "/" },
      { id: "menu2", label: "Consulting", href: "/consulting" },
      { id: "menu3", label: "Public Speaking", href: "/public_speaking" },
      { id: "menu4", label: "Testimonials", href: "/testimonials" },
      { id: "menu5", label: "Bookings", href: "/bookings" },
    ],
    []
  );

  // same code as for the navbar
  useEffect(() => {
    // less variation
    const positions = menuItems.map(() => {
      return Math.floor(Math.random() * 20) + 10;
    });
    setNodePositions(positions);
  }, [menuItems]);

  // for clicking the burger menu icon
  // this should: check current active state, and change it to whatever it isn't
  //
  const toggleMenu = () => {
    if (!active) {
      setActive(true);

      // create new array of numbers that correspond to each item from the menuItmes array
      // the underscore is to indicate that we don't need the first argument
      const nodeIndices = Array.from({ length: menuItems.length }, (_, i) => i);

      // use the new array to animate each node, so i can use a timeout of the indices to animate them one by one
      nodeIndices.forEach((nodeIndex, i) => {
        setTimeout(() => {
          setVisibleNodes((prev) => [...prev, nodeIndex]);

          // after all timeouts are finished, show the lines
          if (i === nodeIndices.length - 1) {
            setTimeout(() => {
              setShowLines(true);
            }, 300);
          }
        }, i * 200);
      });
    } else {
      // hide lines first on menu close, then close the nodes backwards
      setShowLines(false);

      setTimeout(() => {
        setVisibleNodes([]);

        setTimeout(() => {
          setActive(false);
        }, 300);
      }, 300);
    }
  };

  return (
    <div className={`menu-container ${active ? "active" : ""}`}>
      <div className="menu-main-button-container">
        <button
          onClick={toggleMenu}
          className="menu-main-button"
          aria-label="Toggle Menu"
        >
          <span className="menu-icon">{active ? "×" : "≡"}</span>
        </button>
      </div>

      {active && (
        <>
          <svg className="menu-svg" style={{ overflow: "visible" }}>
            {nodePositions.length > 0 &&
              menuItems.map((_, index) => {
                if (index >= menuItems.length - 1) return null;

                const startY = nodePositions[index] - 60 || 0; // -60px to raise it higher than the burger menu button
                const endY = nodePositions[index + 1] - 60 || 0; // -60px to raise it higher than the burger menu button

                // same as before, calulate centre of nodes
                const centreOfNodesOffset = 24;

                // not sure why i need to do 0.5 and 1.5 instead of 1 and 2, but i do
                const startXPercent = (index + 0.5) / menuItems.length;
                const endXPercent = (index + 1.5) / menuItems.length;

                return (
                  <line
                    key={`line-${index}`}
                    x1={`${startXPercent * 100}%`}
                    y1={startY + centreOfNodesOffset}
                    x2={`${endXPercent * 100}%`}
                    y2={endY + centreOfNodesOffset}
                    stroke="#000000"
                    strokeWidth="2"
                    className={`menu-line ${showLines ? "visible" : ""}`}
                  />
                );
              })}
          </svg>

          {menuItems.map((item, index) => {
            const itemYPos = nodePositions[index] - 60 || 0; // -60px to raise it higher than the burger menu button
            const itemXPercent = (index + 0.5) / menuItems.length; // same here, it's +0.5 instead of +1
            const isVisible = visibleNodes.includes(index);

            return (
              <div
                key={item.id}
                className={`menu-node ${isVisible ? "visible" : ""}`}
                style={{
                  left: `calc(${itemXPercent * 100}% - 24px)`, // center horizontally
                  top: `${itemYPos}px`,
                }}
              >
                {/* NEXTJS APP ROUTER TO NAV TO THE DIFFERENT PAGES */}
                <Link
                  className="menu-button"
                  aria-label={item.label}
                  href={item.href}
                >
                  <span className="menu-number">{index + 1}</span>

                  <span className="menu-label">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Menu;
