import React, { useEffect, useRef, useState } from "react";
import "./AboutMe.css";

interface AboutMeProps {
  imageUrl?: string;
  altText?: string;
}

const AboutMe: React.FC<AboutMeProps> = ({ imageUrl = "", altText = "" }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [itemsVisible, setItemsVisible] = useState({
    firstItem: false,
    secondItem: false,
    thirdItem: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // staggered animations delays
          setTimeout(
            () => setItemsVisible((prev) => ({ ...prev, firstItem: true })),
            300
          );
          setTimeout(
            () => setItemsVisible((prev) => ({ ...prev, secondItem: true })),
            600
          );
          setTimeout(
            () => setItemsVisible((prev) => ({ ...prev, thirdItem: true })),
            900
          );

          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // trigger at 10% visibility
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const sectionTop = sectionRef.current?.offsetTop || 0;
      const relativeScroll = scrollTop - sectionTop;

      if (
        relativeScroll > -window.innerHeight &&
        relativeScroll < window.innerHeight
      ) {
        setScrollPosition(relativeScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const calculateTitleOpacity = () => {
    if (!isVisible) return 0;

    const viewportHeight = window.innerHeight;

    // fade zones - top 30% and bottom 30% of viewport will have fade effect
    const fadeZone = viewportHeight * 0.3;

    // where the element is compared to the viewport
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return 1;

    const titlePosition = rect.top + 300; // wiggle the + 400 to adjust where the title fade will be

    if (titlePosition < fadeZone) {
      return titlePosition / fadeZone;
    }

    if (titlePosition > viewportHeight - fadeZone) {
      return (viewportHeight - titlePosition) / fadeZone;
    }

    return 1;
  };

  const titleParallax = {
    transform: isVisible
      ? `translateY(${scrollPosition * 0.5 - 120}px)`
      : "translateY(20px)",
    opacity: calculateTitleOpacity(),
  };

  return (
    <div
      ref={sectionRef}
      className={`about-me-container ${isVisible ? "animate" : ""}`}
    >
      <div className="about-me-content">
        <h2 className="about-me-title" style={titleParallax}>
          About
        </h2>

        <div className="about-me-body">
          <div
            className={`profile-item ${
              itemsVisible.firstItem ? "visible" : ""
            }`}
          >
            <div className="profile-image-container">
              <img src={imageUrl} alt={altText} className="profile-image" />

              <div className="profile-image-border">
                <svg
                  className="circle-svg"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="animated-circle"
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <div className="svg-connector">
              <svg width="2" height="140" xmlns="http://www.w3.org/2000/svg">
                <line
                  className="connector-line"
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="140"
                  stroke="#444444"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="info-circle-container">
              <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                <circle
                  className="info-circle"
                  cx="150"
                  cy="150"
                  r="140"
                  fill="#f5f5f5"
                  stroke="#444444"
                  strokeWidth="2"
                />
              </svg>
              <div className="info-text">
                <p>chris</p>
                <p>batman</p>
              </div>
            </div>
          </div>

          <div
            className={`profile-item ${
              itemsVisible.secondItem ? "visible" : ""
            }`}
          >
            <div className="profile-image-container">
              <img src={"/soc.png"} alt="soc image" className="profile-image" />

              <div className="profile-image-border">
                <svg
                  className="circle-svg"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="animated-circle"
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <div className="svg-connector">
              <svg width="2" height="140" xmlns="http://www.w3.org/2000/svg">
                <line
                  className="connector-line"
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="140"
                  stroke="#444444"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="info-circle-container">
              <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                <circle
                  className="info-circle"
                  cx="150"
                  cy="150"
                  r="140"
                  fill="#f5f5f5"
                  stroke="#444444"
                  strokeWidth="2"
                />
              </svg>
              <div className="info-text">
                <p>school</p>
                <p>of rock!</p>
              </div>
            </div>
          </div>

          <div
            className={`profile-item ${
              itemsVisible.thirdItem ? "visible" : ""
            }`}
          >
            <div className="profile-video-container">
              <div className="video-wrapper">
                <video
                  className="header-video"
                  autoPlay
                  loop
                  muted
                  width="400"
                  height="400"
                >
                  <source src="/christalks.mp4"></source>
                </video>
              </div>

              <div className="profile-image-border">
                <svg
                  className="circle-svg"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="animated-circle"
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            <div className="svg-connector">
              <svg width="2" height="140" xmlns="http://www.w3.org/2000/svg">
                <line
                  className="connector-line"
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="140"
                  stroke="#444444"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="info-circle-container">
              <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                <circle
                  className="info-circle"
                  cx="150"
                  cy="150"
                  r="140"
                  fill="#f5f5f5"
                  stroke="#444444"
                  strokeWidth="2"
                />
              </svg>
              <div className="info-text">
                <p>talkin</p>
                <p>and chattin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
