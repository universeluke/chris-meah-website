// using use client for page.tsx is so dumb, might aswell have not used nextjs :)))
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";

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

          // After typing finishes, wait a bit then fade away
          setTimeout(() => {
            setShowChatbox(false);

            // After fade animation completes, mark animation as done
            setTimeout(() => {
              setAnimationComplete(true);
            }, 1000); // Matches the fade-out duration
          }, 1500);
        }
      }, 50); // Speed of typing

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
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
