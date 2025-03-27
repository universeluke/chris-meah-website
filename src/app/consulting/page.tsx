// import styles from "./consulting.module.css";
"use client";

import Menu from "../components/Menu";
import LLMNavbar from "../components/LLMNavbar";
import PageHeaders from "../components/PageHeaders";
import ConsultingHero from "../components/ConsultingHero";

export default function Consulting() {
  return (
    <>
      <section id="section1">
        <PageHeaders
          mainTitle="Consulting"
          subTitle="Bespoke, practical, tailored"
        />
      </section>
      <section id="section2">
        <ConsultingHero />
      </section>
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
