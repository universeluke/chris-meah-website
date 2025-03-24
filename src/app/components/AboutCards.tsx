import React, { useState, useEffect, useRef } from "react";
import "./AboutCards.css";

interface CardItem {
  id: string;
  title: string;
  description: string;
}

const AboutCards: React.FC = () => {
  const [nodePositions, setNodePositions] = useState<number[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<number[]>([]);
  const [showLines, setShowLines] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardItems: CardItem[] = React.useMemo(
    () => [
      {
        id: "card1",
        title: "School of Code",
        description: "blah blah chris is great",
      },
      {
        id: "card2",
        title: "Building",
        description: "blah blah chris is great",
      },
      {
        id: "card3",
        title: "Training",
        description: "blah blah chris is great",
      },
      {
        id: "card4",
        title: "School of ",
        description: "blah blah chris is great",
      },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 } // starts at 30% visibility
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const startAnimation = () => {
    const positions = cardItems.map(() => {
      return Math.floor(Math.random() * 100) + 20;
    });
    setNodePositions(positions);

    const nodeIndices = Array.from({ length: cardItems.length }, (_, i) => i);
    const shuffledIndices = shuffleArray([...nodeIndices]);

    shuffledIndices.forEach((nodeIndex, i) => {
      setTimeout(() => {
        setVisibleNodes((prev) => [...prev, nodeIndex]);

        if (i === shuffledIndices.length - 1) {
          setTimeout(() => {
            setShowLines(true);
          }, 300);
        }
      }, i * 200);
    });
  };

  // fisher-yates algorithm again to make the cards appear in a random order
  const shuffleArray = (array: number[]): number[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="horizontal-cards-container" ref={containerRef}>
      <svg className="horizontal-cards-svg" style={{ overflow: "visible" }}>
        {nodePositions.length > 0 &&
          cardItems.map((_, index) => {
            if (index >= cardItems.length - 1) return null;

            const startTop = nodePositions[index] || 40;
            const endTop = nodePositions[index + 1] || 40;

            const centerOffsetY = 125;

            const startY = startTop + centerOffsetY;
            const endY = endTop + centerOffsetY;

            const startXPercent = index / (cardItems.length - 1);
            const endXPercent = (index + 1) / (cardItems.length - 1);

            return (
              <line
                key={`line-${index}`}
                x1={`${startXPercent * 100}%`}
                y1={startY}
                x2={`${endXPercent * 100}%`}
                y2={endY}
                stroke="#000000"
                strokeWidth="2"
                className={`horizontal-cards-line ${
                  showLines ? "visible" : ""
                }`}
              />
            );
          })}
      </svg>

      {cardItems.map((item, index) => {
        const topPos = nodePositions[index] || 40;
        const leftPercent = index / (cardItems.length - 1);
        const isVisible = visibleNodes.includes(index);

        return (
          <div
            key={item.id}
            className={`horizontal-card-node ${isVisible ? "visible" : ""}`}
            style={{
              left: `calc(${leftPercent * 100}% - 125px)`, // center horizontally (125px = half of card width)
              top: `${topPos}px`,
            }}
          >
            <div className="horizontal-card">
              <h3 className="card-title">{item.title}</h3>
              {/* <p className="card-description">{item.description}</p> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AboutCards;
