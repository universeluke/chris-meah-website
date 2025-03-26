// import styles from "./consulting.module.css";
"use client";

import Menu from "../components/Menu";
import LLMNavbar from "../components/LLMNavbar";
import PageHeaders from "../components/PageHeaders";

export default function Consulting() {
  return (
    <>
      <PageHeaders
        mainTitle="Consulting"
        subTitle="Bespoke, practical, tailored"
      />
      <LLMNavbar
        menuItems={[
          { id: "section1", label: "one bit" },
          { id: "section2", label: "two bits" },
          { id: "section3", label: "three bits" },
          { id: "section4", label: "four bits" },
        ]}
      />
      <Menu />
    </>
  );
}
