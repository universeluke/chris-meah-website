import React, { useState, useEffect, useRef } from "react";
import "./Building.css";

const Building: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // check if component is in view
      const isVisible = rect.top < windowHeight && rect.bottom > 0;

      setIsInView(isVisible);

      // dummy content courtesy of claude
      // const dummyContent = Array(20)
      //   .fill(null)
      //   .map((_, i) => (
      //     <div key={i} className="rstz-content-segment">
      //       <h2>Section {i + 1}</h2>
      //     </div>
      //   ));

      if (isVisible) {
        const revealDistance = windowHeight + 400; // Adjust this value as needed
        const scrolledDistance = windowHeight - rect.top;

        // Normalize to 0-1 range
        const progress = Math.max(
          0,
          Math.min(1, scrolledDistance / revealDistance)
        );
        setScrollProgress(progress);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // radial gradient size based on scroll progress
  const getRadialGradient = (): string => {
    const initialSize = 8;
    const maxSize = 100;
    const circleSize = initialSize + scrollProgress * (maxSize - initialSize);

    return `radial-gradient(circle at 50% 95%, transparent ${circleSize}%, white ${circleSize}%)`;
  };

  return (
    <div className="rstz-main-container" ref={containerRef}>
      {isInView && (
        <>
          <div className="rstz-bg-layer rstz-dark-layer" />

          <div
            className="rstz-bg-layer rstz-white-layer"
            style={{
              maskImage: getRadialGradient(),
              WebkitMaskImage: getRadialGradient(),
              transition:
                "mask-image 0.3s ease-out, -webkit-mask-image 0.3s ease-out",
            }}
          />
        </>
      )}

      <div className="rstz-content-wrapper">
        <div className="rstz-header-block">
          <h1>Building</h1>
        </div>
        <div className="rstz-content-segment">
          <h2>Core Expertise</h2>
          <div className="rstz-cards-container">
            <div className="rstz-card">
              <h3>Machine Learning</h3>
              <p>
                Developing systems that learn from data and improve over time
              </p>
            </div>
            <div className="rstz-card">
              <h3>Neural Networks</h3>
              <p>
                Building artificial neural networks inspired by the human brain
              </p>
            </div>
            <div className="rstz-card">
              <h3>Natural Language</h3>
              <p>Creating AI that understands and generates human language</p>
            </div>
          </div>
        </div>

        <div className="rstz-content-segment">
          <h2>Recent Projects</h2>
          <div className="rstz-project-card">
            <h3>Conversational AI Assistant</h3>
            <p>
              An intelligent system that can understand context and have natural
              conversations
            </p>
          </div>
          <div className="rstz-project-card">
            <h3>Computer Vision for Healthcare</h3>
            <p>
              AI that helps doctors identify patterns in medical images for
              earlier diagnosis
            </p>
          </div>
        </div>

        <div className="rstz-content-segment">
          <h2>AI Building Philosophy</h2>
          <p>
            &quot;AI should augment human capabilities, not replace them. The
            most powerful systems are those that combine human creativity with
            machine intelligence.&quot;
          </p>
          <p>
            &quot;Building ethical AI requires diverse perspectives and a deep
            consideration of societal impact at every step.&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default Building;
