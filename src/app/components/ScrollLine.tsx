import React, { useState, useEffect, useRef } from "react";

interface ScrollLineProps {
  maxLength?: number;

  lineWidth?: number;
  startPosition?: number;
}

const ScrollLine: React.FC<ScrollLineProps> = ({
  maxLength = 200,

  lineWidth = 4,
  startPosition = 0.5, // start it later so that the animation can be seen
}) => {
  const [lineLength, setLineLength] = useState<number>(0);
  const lineRef = useRef<SVGLineElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      if (!containerRef.current) return;
      // getBoundingClientRect returns a DOMRect object which is "the smallest rectangle which contains the entire element"
      // claude did a lot of heavy lifting with tracking how far the page has been scrolled,
      // and checking if the element is in the viewport
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // current scroll percentage of the entire page
      const scrollPercentage = scrollTop / (documentHeight - windowHeight);

      // check if element is in viewport
      if (containerRect.top < windowHeight && containerRect.bottom > 0) {
        if (scrollPercentage >= startPosition) {
          const adjustedPercentage =
            (scrollPercentage - startPosition) / (1 - startPosition);

          const visiblePortion = Math.min(adjustedPercentage, 0.9);

          setLineLength(
            Math.max(0, Math.min(visiblePortion * maxLength, maxLength))
          );
        } else {
          setLineLength(0);
        }
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [maxLength, startPosition]);

  // svg line with a circle that tracks its y-coord to the current length of the svg line
  return (
    <div className="scroll-line-container">
      <div ref={containerRef} className="line-container">
        <svg
          width="40"
          height={maxLength}
          viewBox={`0 0 40 ${maxLength}`}
          className="line-svg"
        >
          <line
            ref={lineRef}
            x1="20"
            y1="0"
            x2="20"
            y2={lineLength}
            stroke="#105d91"
            strokeWidth={lineWidth}
            strokeLinecap="round"
          />
          {lineLength > 0 && (
            <circle cx="20" cy={lineLength} r="6" fill="#105d91" />
          )}
        </svg>
      </div>

      <style jsx>{`
        .scroll-line-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .line-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 0rem;
          position: relative;
        }

        .line-svg {
          transition: all 0.1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ScrollLine;
