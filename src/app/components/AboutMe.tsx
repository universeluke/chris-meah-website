import React, { useEffect, useRef, useState } from "react";
import "./AboutMe.css";

interface AboutMeProps {
  title?: string;
  imageUrl?: string;
  altText?: string;
  bioText?: string;
}

const AboutMe: React.FC<AboutMeProps> = ({
  title = "",
  imageUrl = "",
  altText = "",
  bioText = "",
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // split the text into paragraphs
  const paragraphs = bioText.split("\n").filter((para) => para.trim() !== "");

  return (
    <div
      ref={sectionRef}
      className={`about-me-container ${isVisible ? "animate" : ""}`}
    >
      <div className="about-me-content">
        <h2 className="about-me-title">{title}</h2>

        <div className="about-me-body">
          <div className="profile-image-container">
            {imageUrl ? (
              <img src={imageUrl} alt={altText} className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">
                <span>Your Photo</span>
              </div>
            )}
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

          <div className="bio-text">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
