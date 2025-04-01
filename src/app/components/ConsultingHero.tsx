import React from "react";
import "./ConsultingHero.css";
import ScrollLine from "./ScrollLine";

export default function ConsultingHero() {
  return (
    <div className={`consulting-hero-container`}>
      <div className="hero-content">
        <h3>Consulting Approach</h3>
        <p>
          I provide tailored solutions to meet your specific needs, and bring a
          wealth of experience across public and private sectors. With a focus
          on practical, implementable strategies that drive real business
          outcomes, I placeholder placeholder placeholder placeholder
          placeholder
        </p>
        <ScrollLine
          maxLength={200}
          lineWidth={4}
          startPosition={0.5}
          color={"#fcca0b"}
          speedFactor={1}
        />
        {/* chatgpt placeholder text for cards */}
        <div className="services-grid">
          <div className="service-card">
            <h4>Strategic Planning</h4>
            <p>
              Comprehensive strategic planning to align your business objectives
              with market opportunities.
            </p>
          </div>
          <div className="service-card">
            <h4>Process Optimization</h4>
            <p>
              Streamline your operations for maximum efficiency and
              productivity.
            </p>
          </div>
          <div className="service-card">
            <h4>Digital Transformation</h4>
            <p>
              Leverage cutting-edge technologies to revolutionize your business
              model.
            </p>
          </div>
          <div className="service-card">
            <h4>Market Analysis</h4>
            <p>
              In-depth research and insights to identify growth opportunities
              and competitive advantages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
