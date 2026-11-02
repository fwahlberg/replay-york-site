import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./experience.css";

const anton = localFont({
  src: "../public/assets/anton.ttf",
  weight: "400",
  display: "swap",
  variable: "--font-anton",
});
const space = localFont({
  src: [
    { path: "../public/assets/space-grotesk-400.ttf", weight: "400" },
    { path: "../public/assets/space-grotesk-600.ttf", weight: "500 800" },
  ],
  display: "swap",
  variable: "--font-space",
});
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${anton.variable} ${space.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#050505" />
        <link rel="stylesheet" href="/assets/leaflet.css" />
        <script
          id="replay-motion"
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ready');",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
