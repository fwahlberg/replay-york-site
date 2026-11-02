import { createDataAttribute, stegaClean } from "next-sanity";
import defaults from "@/site/content.defaults.json";

type Base = typeof defaults;
export type Photo = {
  asset?: {
    url?: string;
    metadata?: { dimensions?: { width: number; height: number } };
  };
  hotspot?: { x: number; y: number };
};
export type Hours = {
  day: string;
  closed?: boolean;
  opens?: string;
  closes?: string;
  _key?: string;
};
export type FAQ = {
  question: string;
  answer: string;
  _key: string;
  action?: string;
  linkLabel?: string;
  linkUrl?: string;
};
type WithPhoto<T> = T & { photo?: Photo };
export type WebsiteContent = Omit<
  Base,
  "hero" | "story" | "nights" | "settings" | "seo" | "visit"
> & {
  _rev?: string;
  hero: WithPhoto<Base["hero"]>;
  story: WithPhoto<Base["story"]>;
  nights: Omit<Base["nights"], "first" | "second" | "celebration"> & {
    first: WithPhoto<Base["nights"]["first"]> & { ticketUrl?: string };
    second: WithPhoto<Base["nights"]["second"]> & { ticketUrl?: string };
    celebration: WithPhoto<Base["nights"]["celebration"]>;
  };
  settings: Base["settings"] & { logo?: Photo };
  seo: Base["seo"] & { shareImage?: Photo };
  visit: Omit<Base["visit"], "faqs"> & { openingHours?: Hours[]; faqs: FAQ[] };
};
export const clean = (value: string | undefined): string =>
  stegaClean(value || "");
function merge(base: unknown, value: unknown): unknown {
  if (value === undefined || value === null) return base;
  if (Array.isArray(value) || typeof value !== "object") return value;
  const a = (base || {}) as Record<string, unknown>,
    b = value as Record<string, unknown>;
  return Object.fromEntries(
    [...new Set([...Object.keys(a), ...Object.keys(b)])].map((k) => [
      k,
      merge(a[k], b[k]),
    ]),
  );
}
export function contentWithDefaults(
  value: Partial<WebsiteContent> | null,
): WebsiteContent {
  const result = merge(defaults, value) as WebsiteContent;
  if (value?.story && !("photoNote" in value.story))
    result.story.photoNote = "";
  if (value?.nights?.second && !("caption" in value.nights.second))
    result.nights.second.caption = "";
  return result;
}
export const edit = (path: string) =>
  createDataAttribute({
    projectId: "7i0l1smd",
    dataset: "production",
    baseUrl: "/admin",
    id: "website",
    type: "website",
    path,
  }).toString();
export function safeUrl(
  value: string | undefined,
  fallback = "#",
  protocols = ["https:"],
): string {
  try {
    const u = new URL(clean(value || ""));
    return protocols.includes(u.protocol) ? u.href : fallback;
  } catch {
    return fallback;
  }
}
export function tracked(value: string | undefined, placement: string): string {
  const u = new URL(safeUrl(value, defaults.settings.ticketsUrl));
  for (const [key, v] of Object.entries({
    utm_source: "replayyork.co.uk",
    utm_medium: "website",
    utm_campaign: "website",
    utm_content: placement,
  }))
    u.searchParams.set(key, v);
  return u.href;
}
export function imageUrl(
  image: Photo | undefined,
  fallback: string,
  width = 2200,
): string {
  try {
    const u = new URL(clean(image?.asset?.url || ""));
    if (u.hostname !== "cdn.sanity.io" || u.protocol !== "https:")
      return fallback;
    u.searchParams.set("auto", "format");
    u.searchParams.set("w", String(width));
    u.searchParams.set("fit", "max");
    return u.href;
  } catch {
    return fallback;
  }
}
export function imageStyle(image: Photo | undefined) {
  return image?.hotspot
    ? { objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` }
    : undefined;
}
export function email(content: WebsiteContent) {
  const value = clean(content.settings.email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? value
    : defaults.settings.email;
}
export function time(value: string | undefined): string {
  if (!value || !/^([01]\d|2[0-3]):[0-5]\d$/.test(clean(value))) return "—";
  const [h, m] = clean(value).split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
}
export const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
