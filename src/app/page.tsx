"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import LLMNavbar from "./components/LLMNavbar";
import Header from "./components/Header";

export default function Home() {
  const [showChatbox, setShowChatbox] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [promptText, setPromptText] = useState("");

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
      // this should show ai animation

      setShowChatbox(true);
      localStorage.setItem("hasVisitedBefore", "true");

      const text =
        "make me a webstie for chris meah and make it really great and cool";
      let index = -1; // set index to start at -1 for some reason, otherwise it misses off the first character of the string, i cba to work out why this happens
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
    <div>
      <section id="section1">
        <Header />
      </section>

      <section id="section2">
        <h2>About</h2>
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

      <LLMNavbar />
    </div>
  );
}
