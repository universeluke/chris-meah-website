"use client";

import React, { useMemo } from "react";
import Menu from "../components/Menu";
import LLMNavbar from "../components/LLMNavbar";
import PageHeaders from "../components/PageHeaders";
import GridLines from "../components/GridLines";

export default function Bookings() {
  const menuItems = useMemo(
    () => [
      { id: "section1", label: "one bit" },
      { id: "section2", label: "two bits" },
      { id: "section3", label: "three bits" },
      { id: "section4", label: "four bits" },
      { id: "section5", label: "five bits" },
    ],
    []
  );

  return (
    <>
      <GridLines />
      <section id="section1">
        <PageHeaders mainTitle="Bookings" subTitle="unfinished" />
      </section>

      <LLMNavbar menuItems={menuItems} />
      <Menu />
    </>
  );
}
