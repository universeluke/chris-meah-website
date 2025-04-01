import React, { useState, useEffect, useRef } from "react";
import "./Building.css";
import ScrollLine from "./ScrollLine";

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
      //     <div key={i} className="building-content-segment">
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
    <div className="building-main-container" ref={containerRef}>
      {isInView && (
        <>
          <div className="building-bg-layer building-dark-layer" />

          <div
            className="building-bg-layer building-white-layer"
            style={{
              maskImage: getRadialGradient(),
              WebkitMaskImage: getRadialGradient(),
              transition:
                "mask-image 0.3s ease-out, -webkit-mask-image 0.3s ease-out",
            }}
          />
        </>
      )}

      <div className="building-content-wrapper">
        <div className="building-header-block">
          <h1>Building</h1>
        </div>
        <ScrollLine
          maxLength={200}
          lineWidth={4}
          startPosition={0.39}
          color={"#181818"}
          speedFactor={6}
        />
        <div className="building-content-segment">
          <h2>Core Expertise</h2>
          <div className="building-cards-container">
            <div className="building-card">
              <h3>Machine Learning</h3>
              <p>
                Developing systems that learn from data and improve over time
              </p>
            </div>
            <div className="building-card">
              <h3>Neural Networks</h3>
              <p>
                Building artificial neural networks inspired by the human brain
              </p>
            </div>
            <div className="building-card">
              <h3>Natural Language</h3>
              <p>Creating AI that understands and generates human language</p>
            </div>
          </div>
        </div>

        <div className="building-content-segment">
          <h2>Recent Projects</h2>
          <div className="building-project-card">
            <h3>
              Led a research project on single-snapshot 3D cameras and
              tomography
            </h3>
            <p>
              Paving the way for cutting-edge volume microscopy and
              bioluminescence imaging, this work resulted in multiple
              publications, national and international collaborations, and new
              research avenues at the University.
            </p>
          </div>
          <div className="building-project-card">
            <h3>Building an AI No Limit Texas Hold&apos;em Poker Bot</h3>
            <p>
              This was a large neural network trained on a distributed
              supercomputer cluster (BEAR) on over 1 billion poker hands, also
              using reinforcement learning (using a tournament of evolutionary
              algorithms and montecarlo simulation for automated rewards) during
              self-play to explore the game, resulting in beating the benchmarks
              for the best systems in the world.
            </p>
          </div>
          <div className="building-project-card">
            <h3>Using MALDI to detect glioblastoma boundaries</h3>
            <p>
              In collaboration with the Medical School, Computer Science and
              Chemistry, in order to improve surgical outcomes.
            </p>
          </div>
        </div>

        <div className="building-content-segment">
          <h2>AI Building Philosophy</h2>
          <p className="quotes">
            &quot;Many think AI will leave people behind and if we aren’t
            careful there’s a chance it will, but we also have a chance to make
            sure everyone can access what they need to.&quot;
          </p>
          <p className="quotes">
            &quot;One of the purposes of AI is researching it will help us
            understand biological intelligence and the brain much better. As we
            learn more about how the brain works, we can also feed that
            understanding back towards AI to unlock improved performance. &quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default Building;
