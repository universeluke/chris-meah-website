import React, { useState, useEffect, useRef } from "react";
import "./CircleTransition.css";

const CircleTransition: React.FC = () => {
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

      if (isVisible) {
        const componentHeight = rect.height;
        const totalScrollDistance = componentHeight + windowHeight - 250; //define startpoint
        const scrolledDistance = windowHeight - rect.top;

        const progress = Math.max(
          0,
          Math.min(1, scrolledDistance / totalScrollDistance)
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
    const circleSize = scrollProgress * 250;

    return `radial-gradient(circle at center, transparent ${circleSize}%, white ${circleSize}%)`;
  };

  // dummy content courtesy of claude
  const dummyContent = Array(20)
    .fill(null)
    .map((_, i) => (
      <div key={i} className="rstz-content-segment">
        <h2>Section {i + 1}</h2>
      </div>
    ));

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
          <h1>Building, Training, Speaking</h1>
          <p>Hi I build and train and speak</p>
        </div>
        {dummyContent}
      </div>
    </div>
  );
};

export default CircleTransition;
