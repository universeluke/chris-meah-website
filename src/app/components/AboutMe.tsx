import React, { useEffect, useRef, useState } from "react";
import "./AboutMe.css";
import Link from "next/link";

interface AboutMeProps {
  imageUrl?: string;
  altText?: string;
}

const AboutMe: React.FC<AboutMeProps> = ({ imageUrl = "", altText = "" }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [sectionOpacity, setSectionOpacity] = useState(1);

  const [itemsVisible, setItemsVisible] = useState({
    firstItem: false,
    secondItem: false,
    thirdItem: false,
  });

  const circleTitles = {
    chris: "LINKEDIN",
    schoolOfCode: "SCHOOL OF CODE",
    video: "TALKS",
  };

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
      const sectionHeight = sectionRef.current?.offsetHeight || 0;
      const relativeScroll = scrollTop - sectionTop;

      const fadeOutStart = 0;
      const fadeOutEnd = sectionHeight * 0.5; // when to complete fading out

      if (relativeScroll > fadeOutStart) {
        const fadeProgress = Math.min(
          1,
          (relativeScroll - fadeOutStart) / (fadeOutEnd - fadeOutStart)
        );
        setSectionOpacity(Math.max(0, 1 - fadeProgress));
      } else {
        setSectionOpacity(1);
      }

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

    // fade zones - top 50% and bottom 50% of viewport will have fade effect
    const fadeZone = viewportHeight * 0.4;

    // where the element is compared to the viewport
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return 1;

    const titlePosition = rect.top * 2 + 400; // wiggle the + 400 to adjust where the title fade will be

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
      className={`about-me-container ${isVisible ? "animate" : ""} ${
        hoveredItem ? "item-hovered" : ""
      }`}
      style={{ opacity: sectionOpacity }}
    >
      <div className="about-me-content">
        <h2
          className={`about-me-title ${hoveredItem ? "hidden" : ""}`}
          style={titleParallax}
        >
          About
        </h2>

        <div className="about-me-body">
          <div
            className={`profile-item ${
              itemsVisible.firstItem ? "visible" : ""
            } ${
              hoveredItem === "chris"
                ? "hovered"
                : hoveredItem
                ? "not-hovered"
                : ""
            }`}
            onMouseEnter={() => setHoveredItem("chris")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link href="https://www.linkedin.com/in/chrismeah/">
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
            </Link>
          </div>

          <div
            className={`profile-item ${
              itemsVisible.secondItem ? "visible" : ""
            } ${
              hoveredItem === "schoolOfCode"
                ? "hovered"
                : hoveredItem
                ? "not-hovered"
                : ""
            }`}
            onMouseEnter={() => setHoveredItem("schoolOfCode")}
            onMouseLeave={() => setHoveredItem(null)}
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
          </div>

          <div
            className={`profile-item ${
              itemsVisible.thirdItem ? "visible" : ""
            } ${
              hoveredItem === "video"
                ? "hovered"
                : hoveredItem
                ? "not-hovered"
                : ""
            }`}
            onMouseEnter={() => setHoveredItem("video")}
            onMouseLeave={() => setHoveredItem(null)}
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
          </div>
        </div>

        <div className={`white-overlay ${hoveredItem ? "active" : ""}`}></div>

        <div className={`hover-title-container ${hoveredItem ? "active" : ""}`}>
          <h1 className="hover-title">
            {hoveredItem
              ? circleTitles[hoveredItem as keyof typeof circleTitles]
              : ""}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
