"use client";
import { useEffect } from "react";
import Script from "next/script";
import { initSite } from "@/lib/site-effects";

export function SiteEffects() {
  useEffect(() => initSite(), []);
  return (
    <Script
      src="/assets/leaflet.js"
      strategy="lazyOnload"
      onReady={() => {window.dispatchEvent(new Event("replay:map-ready"))}}
    />
  );
}
