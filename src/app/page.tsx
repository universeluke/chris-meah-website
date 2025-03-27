"use client";

import React, { useMemo, useState, useEffect } from "react";
import styles from "./page.module.css";
import LLMNavbar from "./components/LLMNavbar";
import Header from "./components/Header";
import AboutMe from "./components/AboutMe";
import Menu from "./components/Menu";
import GridLines from "./components/GridLines";

export default function Home() {
  const [showChatbox, setShowChatbox] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [promptText, setPromptText] = useState("");

  // making sure that the chatbot animation only plays on new tab open, not on refresh
  useEffect(() => {
    // need to distinguish between tab close (a new page loaded) and page refresh
    // sessionStorage is cleared when tab is cloesd but stays on refresh
    const isTabOpen = sessionStorage.getItem("isTabOpen");

    if (!isTabOpen) {
      // only clear localStorage when the tab is ACTUALLY closed and reopened
      localStorage.removeItem("hasVisitedBefore");

      sessionStorage.setItem("isTabOpen", "true");
    }

    const shouldShowAnimation = !localStorage.getItem("hasVisitedBefore");

    if (shouldShowAnimation) {
      // check if it should show the animation based on what's in local storage

      setShowChatbox(true);
      localStorage.setItem("hasVisitedBefore", "true");

      const text =
        "make me a webstie for chris meah and make it really great and cool";
      let index = -1; // set index to start at -1 for some reason, otherwise it misses off the first character of the string. i THINK this happens because, before we increment, the prev state is empty?
      // claude magic for animating text
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setPromptText((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(typeInterval);

          setTimeout(() => {
            setShowChatbox(false);

            setTimeout(() => {
              setAnimationComplete(true);
            }, 1000);
          }, 1500);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    } else {
      setAnimationComplete(true);
    }
  }, []);

  // usememo here to cache the result and stop the navbar rerendering whenever the mouse moves (although it is quite funny when the navbar wiggles around!)
  const menuItems = useMemo(
    () => [
      { id: "section1", label: "Home" },
      { id: "section2", label: "About" },
      { id: "section3", label: "Building" },
      { id: "section4", label: "Training" },
      { id: "section5", label: "Speaking" },
      { id: "section6", label: "Services" },
      { id: "section7", label: "Contact" },
    ],
    []
  );

  //i'm only using css modules for page.tsx, so it's a bit weird and i might change to use css modules for the components too, just to avoid possible global style conflicts
  if (!animationComplete && showChatbox) {
    return (
      <div className={styles.fakeChatContainer}>
        <div className={styles.fakeChatbox}>
          <div className={styles.fakeChatHeader}>
            <span>The most recent and trendy LLM</span>
          </div>
          <div className={styles.fakeChatContent}>
            <div className={styles.promptContainer}>
              <span className={styles.promptUser}>Chris: </span>
              <span className={styles.promptText}>{promptText}</span>
              <span className={styles.cursor}>|</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // after animation plays, add the fadeOut and get rid of the fake cursor animation
  if (!animationComplete && !showChatbox) {
    return (
      <div className={`${styles.fakeChatContainer} ${styles.fadeOut}`}>
        <div className={styles.fakeChatbox}>
          <div className={styles.fakeChatHeader}>
            <span>The most recent and trendy LLM</span>
          </div>
          <div className={styles.fakeChatContent}>
            <div className={styles.promptContainer}>
              <span className={styles.promptUser}>Chris: </span>
              <span className={styles.promptText}>{promptText}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // actual app page
  return (
    <div style={{ position: "relative" }}>
      <GridLines />
      <div>
        <div>
          <section id="section1">
            <Header />
          </section>
          {/* pass the info in as props, might be easier to see what to change later */}
          <section id="section2">
            <AboutMe
              imageUrl="/chris.jpeg"
              altText="Chris Meah"
              //   bioText={`I'm Chris, an engineer who specialises in building, training, and speaking about AI.

              // 10 years ago, I founded the School of Code to teach people how to learn to code. Since then I've shifted to building and teaching people about my PhD: Artificial Intelligence.

              // When I'm not teaching, building, or training AI, you can find me solving other mysteries of the universe (like why aren't people more passionate about good sandwiches, and has everyone noticed my beard yet?)`}
            />
          </section>

          <section id="section3">
            <h2>Building</h2>
          </section>

          <section id="section4">
            <h2>Training</h2>
          </section>

          <section id="section5">
            <h2>Speaking</h2>
          </section>

          <section id="section6">
            <h2>Services</h2>
          </section>

          <section id="section7">
            <h2>Contact</h2>
          </section>

          <LLMNavbar menuItems={menuItems} />
          <Menu />
        </div>
      </div>
    </div>
  );
}
