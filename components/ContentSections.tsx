import { Fragment } from "react";
import type { WebsiteContent, FAQ } from "@/lib/content";
import {
  clean,
  edit,
  email,
  safeUrl,
  tracked,
  time,
  weekdays,
} from "@/lib/content";

export function lineBreaks(value: string) {
  return value.split("\n").map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
}
export function StoryParagraphs({ story }: { story: WebsiteContent["story"] }) {
  return (
    <>
      <p data-sanity={edit("story.intro")}>{story.intro}</p>
      {story.body
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p, index) => (
          <p key={index} data-sanity={edit("story.body")}>
            {p}
          </p>
        ))}
    </>
  );
}
export function OpeningHours({
  hours,
}: {
  hours: WebsiteContent["visit"]["openingHours"];
}) {
  if (!hours?.length) return null;
  return (
    <div
      className="opening-hours"
      id="opening-hours"
      data-sanity={edit("visit.openingHours")}
    >
      <h3>Opening hours</h3>
      <dl>
        {[...hours]
          .sort(
            (a, b) =>
              weekdays.indexOf(clean(a.day)) - weekdays.indexOf(clean(b.day)),
          )
          .map((h) => (
            <div
              key={h._key || clean(h.day)}
              className={h.closed ? "is-closed" : undefined}
            >
              <dt>{h.day}</dt>
              <dd>
                {h.closed ? "Closed" : `${time(h.opens)} – ${time(h.closes)}`}
              </dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
function FaqAnswer({ item, content }: { item: FAQ; content: WebsiteContent }) {
  const label = item.linkLabel?.replaceAll(
    "info@replayyork.co.uk",
    email(content),
  );
  const answer = item.answer.replaceAll(
    "info@replayyork.co.uk",
    email(content),
  );
  let link;
  if (label && item.action === "enquiry")
    link = (
      <button className="inline-link" data-enquiry="Celebration">
        {label}
      </button>
    );
  else if (label && item.linkUrl) {
    let href = clean(item.linkUrl).replace(
      "mailto:info@replayyork.co.uk",
      `mailto:${email(content)}`,
    );
    if (href === "https://loggitapp.com/report/venue/replayyork")
      href = content.settings.lostPropertyUrl;
    let tickets = false;
    try {
      const u = new URL(href);
      if (u.hostname === "klurrb.com") {
        tickets = true;
        href = tracked(
          u.pathname === "/join/replayyork"
            ? content.settings.ticketsUrl
            : href,
          "opening_times",
        );
      }
    } catch {}
    link = (
      <a
        href={safeUrl(href, "#", ["https:", "mailto:"])}
        data-conversion={tickets ? "events_and_tickets_click" : undefined}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }
  const marker = answer.indexOf("{{link}}");
  return link && marker >= 0 ? (
    <>
      {answer.slice(0, marker)}
      {link}
      {answer.slice(marker + 8)}
    </>
  ) : (
    <>
      {answer.replaceAll("{{link}}", "")}
      {link && <> {link}</>}
    </>
  );
}
export function FAQs({ content }: { content: WebsiteContent }) {
  return content.visit.faqs.map((item) => (
    <details key={item._key}>
      <summary
        data-sanity={edit(`visit.faqs[_key=="${clean(item._key)}"].question`)}
      >
        {item.question}
        <span aria-hidden="true" />
      </summary>
      <p data-sanity={edit(`visit.faqs[_key=="${clean(item._key)}"].answer`)}>
        <FaqAnswer item={item} content={content} />
      </p>
    </details>
  ));
}
