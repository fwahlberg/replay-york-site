import Image from "next/image";
import {
  lineBreaks,
  StoryParagraphs,
  OpeningHours,
  FAQs,
} from "./ContentSections";
import {
  clean,
  edit,
  email,
  imageUrl,
  imageStyle,
  safeUrl,
  tracked,
  type WebsiteContent,
} from "@/lib/content";

export function ReplayPage({ content: c }: { content: WebsiteContent }) {
  const instagramHandle = (() => {
    try {
      return (
        new URL(clean(c.settings.instagramUrl)).pathname
          .split("/")
          .filter(Boolean)[0] || "replayyork"
      );
    } catch {
      return "replayyork";
    }
  })();
  return (
    <div data-replay-site data-contact-email={email(c)}>
      <svg
        className="svg-library"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <symbol id="arrow" viewBox="0 0 24 24">
          <path d="M5 19 19 5M5 5h14v14"></path>
        </symbol>
        <symbol id="right" viewBox="0 0 24 24">
          <path d="M4 12h16m-6-6 6 6-6 6"></path>
        </symbol>
        <symbol id="pin" viewBox="0 0 24 24">
          <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
          <circle cx="12" cy="10" r="2.5"></circle>
        </symbol>
        <symbol id="ticket" viewBox="0 0 24 24">
          <path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V7Z"></path>
          <path d="M15 7v3m0 3v2m0 2v2"></path>
        </symbol>
        <symbol id="instagram" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="5"></rect>
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M17 7h.01"></path>
        </symbol>
        <symbol id="play" viewBox="0 0 40 40">
          <path d="M8 2 38 20 8 38Z" fill="currentColor" stroke="none"></path>
        </symbol>
        <symbol id="spark" viewBox="0 0 40 40">
          <path
            d="m20 0 4 15 13-8-8 13 11 4-15 2 4 14-9-11-9 11 4-14-15-2 11-4L3 7l13 8Z"
            fill="currentColor"
            stroke="none"
          ></path>
        </symbol>
      </svg>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="reading-progress" aria-hidden="true"></div>
        <div className="header-inner">
          <a
            className={`brand${c.settings.logo?.asset?.url ? " has-custom-logo" : ""}`}
            href="#"
            aria-label="Replay York home"
          >
            <Image
              src={imageUrl(c.settings.logo, "/assets/replay-brand.jpg", 800)}
              alt="Replay York"
              width="2048"
              height="762"
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </a>
          <button
            className="menu-toggle"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="main-nav"
          >
            <span>Menu</span>
            <span className="menu-lines" aria-hidden="true"></span>
          </button>
          <nav id="main-nav" className="main-nav" aria-label="Main navigation">
            <a href="#whats-on">What's on</a>
            <a href="#the-feeling">The music</a>
            <a href="#membership">Membership</a>
            <a href="#find-us">Find us</a>
          </nav>
          <a
            data-conversion="events_and_tickets_click"
            className="button button-pink header-ticket"
            href={tracked(c.settings.ticketsUrl, "header_tickets")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Events &amp; tickets{" "}
            <svg className="icon">
              <use href="#arrow"></use>
            </svg>
          </a>
        </div>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-stage">
            <Image
              className="hero-photo"
              src={imageUrl(c.hero.photo, "/assets/dancefloor.jpg", 2200)}
              alt={clean(c.hero.photoAlt)}
              width="2200"
              height="1467"
              fetchPriority="high"
              style={imageStyle(c.hero.photo)}
              data-sanity={edit("hero.photo")}
              priority={true}
              sizes="100vw"
            />
            <div className="play-portal" aria-hidden="true">
              <svg viewBox="0 0 600 600">
                <defs>
                  <clipPath id="play-window">
                    <path d="M174 94 510 300 174 506Z"></path>
                  </clipPath>
                </defs>
                <path
                  className="play-frame"
                  d="M128 10 588 300 128 590Z"
                ></path>
                <image
                  href={imageUrl(c.hero.photo, "/assets/dancefloor.jpg")}
                  x="-75"
                  y="0"
                  width="900"
                  height="600"
                  preserveAspectRatio="xMidYMid slice"
                  clip-path="url(#play-window)"
                ></image>
              </svg>
            </div>
            <div className="portal-wash" aria-hidden="true"></div>
            <div className="hero-inner page-width">
              <div className="hero-copy">
                <h1
                  id="hero-title"
                  aria-label={`Replay York nightclub. ${clean(c.hero.title).replace(/\n/g, " ")}`}
                  data-sanity={edit("hero.title")}
                >
                  {lineBreaks(c.hero.title)}
                </h1>
                <p
                  className="hero-description"
                  data-sanity={edit("hero.description")}
                >
                  {lineBreaks(c.hero.description)}
                </p>
                <div className="hero-actions">
                  <a
                    data-conversion="events_and_tickets_click"
                    className="button button-pink"
                    href={tracked(c.settings.ticketsUrl, "hero_tickets")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Events &amp; tickets{" "}
                    <svg className="icon">
                      <use href="#arrow"></use>
                    </svg>
                  </a>
                  <a className="hero-secondary" href="#whats-on">
                    Explore Replay <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
              <div className="hero-bottom">
                <a href="#find-us">
                  <svg className="icon">
                    <use href="#pin"></use>
                  </svg>{" "}
                  3 George Hudson Street, York
                </a>
                <a className="scroll-invitation" href="#whats-on">
                  <span className="scroll-line" aria-hidden="true"></span>{" "}
                  Scroll to hit play
                </a>
              </div>
            </div>
            <div className="replay-moment" aria-hidden="true">
              <p data-sanity={edit("hero.momentIntro")}>{c.hero.momentIntro}</p>
              <div data-sanity={edit("hero.momentTitle")}>
                {lineBreaks(c.hero.momentTitle)}
              </div>
              <span data-sanity={edit("hero.momentCaption")}>
                {c.hero.momentCaption}
              </span>
            </div>
          </div>
        </section>

        <div
          className="anthem-strip"
          aria-label="Throwbacks, singalongs, dancefloor classics"
        >
          <div className="anthem-track">
            <span>THROWBACKS</span>
            <svg>
              <use href="#spark"></use>
            </svg>
            <span>THE SONGS YOU LOVE</span>
            <svg>
              <use href="#spark"></use>
            </svg>
            <span>DANCEFLOOR CLASSICS</span>
            <svg>
              <use href="#spark"></use>
            </svg>
            <span>ONE MORE SONG</span>
            <svg aria-hidden="true">
              <use href="#play"></use>
            </svg>
            <span aria-hidden="true">THROWBACKS</span>
            <svg aria-hidden="true">
              <use href="#play"></use>
            </svg>
            <span aria-hidden="true">THE SONGS YOU LOVE</span>
            <svg>
              <use href="#spark"></use>
            </svg>
          </div>
        </div>

        <section
          className="nights-section section-space page-width"
          id="whats-on"
          aria-labelledby="nights-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="nights-title" data-sanity={edit("nights.title")}>
                {lineBreaks(c.nights.title)}
              </h2>
            </div>
            <div className="section-heading-aside">
              <p data-sanity={edit("nights.description")}>
                {lineBreaks(c.nights.description)}
              </p>
              <a
                data-conversion="events_and_tickets_click"
                className="text-link"
                href={tracked(c.settings.ticketsUrl, "events_all")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Latest events &amp; tickets{" "}
                <svg className="icon">
                  <use href="#arrow"></use>
                </svg>
              </a>
            </div>
          </div>
          <div className="night-grid">
            <article className="night-card">
              <a
                data-conversion="events_and_tickets_click"
                className="night-art friday-art"
                href={tracked(
                  c.nights.first.ticketUrl || c.settings.ticketsUrl,
                  "friday_card",
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find the latest Friday events at Replay"
              >
                <Image
                  src={imageUrl(
                    c.nights.first.photo,
                    "/assets/party.jpg",
                    1200,
                  )}
                  alt={clean(c.nights.first.photoAlt)}
                  loading="lazy"
                  width="1000"
                  height="667"
                  style={imageStyle(c.nights.first.photo)}
                  data-sanity={edit("nights.first.photo")}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
                <span
                  className="art-tag"
                  data-sanity={edit("nights.first.tag")}
                >
                  {c.nights.first.tag}
                </span>
                <div
                  className="poster-title"
                  data-sanity={edit("nights.first.posterTitle")}
                >
                  {
                    <>
                      {lineBreaks(c.nights.first.posterTitle)}
                      <span className="poster-star" aria-hidden="true">
                        ✳
                      </span>
                    </>
                  }
                </div>
                <span className="card-arrow">
                  <svg className="icon">
                    <use href="#arrow"></use>
                  </svg>
                </span>
              </a>
              <div className="night-info">
                <h3 data-sanity={edit("nights.first.title")}>
                  {c.nights.first.title}
                </h3>
                <p data-sanity={edit("nights.first.description")}>
                  {c.nights.first.description}
                </p>
                <a
                  data-conversion="events_and_tickets_click"
                  className="text-link"
                  href={tracked(
                    c.nights.first.ticketUrl || c.settings.ticketsUrl,
                    "friday_tickets",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Events &amp; tickets{" "}
                  <svg className="icon">
                    <use href="#arrow"></use>
                  </svg>
                </a>
              </div>
            </article>
            <article className="night-card">
              <a
                data-conversion="events_and_tickets_click"
                className="night-art saturday-art"
                href={tracked(
                  c.nights.second.ticketUrl || c.settings.ticketsUrl,
                  "saturday_card",
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find the latest Saturday events at Replay"
              >
                <Image
                  src={imageUrl(
                    c.nights.second.photo,
                    "/assets/replay-brand.jpg",
                    1200,
                  )}
                  alt={clean(c.nights.second.photoAlt)}
                  loading="lazy"
                  width="2048"
                  height="762"
                  style={imageStyle(c.nights.second.photo)}
                  data-sanity={edit("nights.second.photo")}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
                <span
                  className="art-tag"
                  data-sanity={edit("nights.second.tag")}
                >
                  {c.nights.second.tag}
                </span>
                <div
                  className="saturday-type"
                  data-sanity={edit("nights.second.posterTitle")}
                >
                  {c.nights.second.posterTitle
                    .split("\n")
                    .map((line, index) => (
                      <span key={index}>{line}</span>
                    ))}
                </div>
                <span
                  className="saturday-caption"
                  data-sanity={edit("nights.second.caption")}
                >
                  {c.nights.second.caption}
                </span>
                <span className="card-arrow">
                  <svg className="icon">
                    <use href="#arrow"></use>
                  </svg>
                </span>
              </a>
              <div className="night-info">
                <h3 data-sanity={edit("nights.second.title")}>
                  {c.nights.second.title}
                </h3>
                <p data-sanity={edit("nights.second.description")}>
                  {c.nights.second.description}
                </p>
                <a
                  data-conversion="events_and_tickets_click"
                  className="text-link"
                  href={tracked(
                    c.nights.second.ticketUrl || c.settings.ticketsUrl,
                    "saturday_tickets",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Events &amp; tickets{" "}
                  <svg className="icon">
                    <use href="#arrow"></use>
                  </svg>
                </a>
              </div>
            </article>
            <article className="night-card">
              <button
                className="night-art party-art"
                data-enquiry="Celebration"
                aria-label="Enquire about celebrating at Replay"
              >
                <Image
                  src={imageUrl(
                    c.nights.celebration.photo,
                    "/assets/dancefloor.jpg",
                    1200,
                  )}
                  alt={clean(c.nights.celebration.photoAlt)}
                  loading="lazy"
                  width="2200"
                  height="1467"
                  style={imageStyle(c.nights.celebration.photo)}
                  data-sanity={edit("nights.celebration.photo")}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
                <span
                  className="art-tag"
                  data-sanity={edit("nights.celebration.tag")}
                >
                  {c.nights.celebration.tag}
                </span>
                <div
                  className="poster-title"
                  data-sanity={edit("nights.celebration.posterTitle")}
                >
                  {<>{lineBreaks(c.nights.celebration.posterTitle)}</>}
                </div>
                <span className="card-arrow">
                  <svg className="icon">
                    <use href="#arrow"></use>
                  </svg>
                </span>
              </button>
              <div className="night-info">
                <h3 data-sanity={edit("nights.celebration.title")}>
                  {c.nights.celebration.title}
                </h3>
                <p data-sanity={edit("nights.celebration.description")}>
                  {c.nights.celebration.description}
                </p>
                <button className="text-link" data-enquiry="Celebration">
                  Enquire about your night{" "}
                  <svg className="icon">
                    <use href="#arrow"></use>
                  </svg>
                </button>
              </div>
            </article>
          </div>
          <p className="event-note">
            <svg className="icon">
              <use href="#ticket"></use>
            </svg>{" "}
            Check the latest event listing for dates, opening times and entry
            prices. 18+ with photo ID.
          </p>
        </section>

        <section
          className="feeling-section"
          id="the-feeling"
          aria-labelledby="feeling-title"
        >
          <div className="feeling-inner page-width">
            <div className="feeling-photo">
              <div className="image-viewport">
                <Image
                  src={imageUrl(c.story.photo, "/assets/dancefloor.jpg", 2200)}
                  alt={clean(c.story.photoAlt)}
                  loading="lazy"
                  width="2200"
                  height="1467"
                  style={imageStyle(c.story.photo)}
                  data-sanity={edit("story.photo")}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>
              <div className="photo-caption">
                <svg>
                  <use href="#spark"></use>
                </svg>{" "}
                ONE MORE SONG.
              </div>
              <span
                className="stock-note"
                data-sanity={edit("story.photoNote")}
              >
                {c.story.photoNote}
              </span>
            </div>
            <div className="feeling-copy">
              <h2 id="feeling-title" data-sanity={edit("story.title")}>
                {lineBreaks(c.story.title)}
              </h2>
              {<StoryParagraphs story={c.story} />}
              <a
                className="text-link"
                href={safeUrl(c.settings.instagramUrl)} data-sanity={edit("settings.instagramUrl")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow Replay on Instagram{" "}
                <svg className="icon">
                  <use href="#instagram"></use>
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section
          className="membership-section page-width"
          id="membership"
          aria-labelledby="member-title"
        >
          <div className="membership-panel">
            <div>
              <h2 id="member-title" data-sanity={edit("membership.title")}>
                {lineBreaks(c.membership.title)}
              </h2>
              <p data-sanity={edit("membership.description")}>
                {c.membership.description}
              </p>
              <a
                className="button button-black"
                data-conversion="membership_click"
                href={tracked(c.settings.membershipUrl, "membership")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore membership{" "}
                <svg className="icon">
                  <use href="#arrow"></use>
                </svg>
              </a>
              <span
                className="membership-small"
                data-sanity={edit("membership.note")}
              >
                {c.membership.note}
              </span>
            </div>
            <div className="member-pass" aria-hidden="true">
              <span className="pass-top">
                REPLAY YORK MEMBERSHIP <span>↗</span>
              </span>
              <span className="pass-title">
                REPLAY <br />
                REGULAR.
              </span>
              <div className="pass-bottom">
                <span>
                  GOOD TO SEE <br />
                  YOU AGAIN.
                </span>
                <svg viewBox="0 0 60 60">
                  <path d="M18 10 49 30 18 50Z" fill="currentColor"></path>
                  <path d="m27 25 9 5-9 5Z" fill="#101011"></path>
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section
          className="map-section page-width"
          id="find-us"
          aria-labelledby="map-title"
        >
          <div className="map-heading">
            <h2 id="map-title">
              YOUR NIGHT
              <br />
              STARTS HERE.
            </h2>
            <a
              className="text-link"
              href="https://www.google.com/maps/search/?api=1&query=Replay+York+3+George+Hudson+Street+York+YO1+6JL"
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions to Replay{" "}
              <svg className="icon">
                <use href="#arrow"></use>
              </svg>
            </a>
          </div>
          <div className="map-shell">
            <div
              id="venue-map"
              role="region"
              aria-label="Interactive map showing Replay York on George Hudson Street"
            >
              <div className="map-fallback">
                <svg className="icon">
                  <use href="#pin"></use>
                </svg>
                <strong>Replay York</strong>
                <span>3 George Hudson Street, YO1 6JL</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Replay+York+3+George+Hudson+Street+York+YO1+6JL"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open directions
                </a>
              </div>
            </div>
            <div className="map-address">
              <svg
                className="map-address-icon"
                viewBox="0 0 40 40"
                aria-hidden="true"
                focusable="false"
              >
                <use href="#play"></use>
              </svg>
              <div>
                <strong>Replay York</strong>
                <span>3 George Hudson Street, YO1 6JL</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Replay+York+3+George+Hudson+Street+York+YO1+6JL"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get directions to Replay York"
              >
                <svg className="icon">
                  <use href="#arrow"></use>
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section
          className="visit-section page-width section-space"
          id="visit-details"
          aria-labelledby="visit-title"
        >
          <div className="visit-info">
            <h2 id="visit-title">
              RIGHT HERE. <br />
              IN YORK.
            </h2>
            <address>
              3 George Hudson Street <br />
              York, YO1 6JL
            </address>
            <a
              className="button button-outline"
              href="https://www.google.com/maps/search/?api=1&query=Replay+York+3+George+Hudson+Street+York+YO1+6JL"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions{" "}
              <svg className="icon">
                <use href="#arrow"></use>
              </svg>
            </a>
            <p
              className="visit-description"
              data-sanity={edit("visit.description")}
            >
              {c.visit.description}
            </p>
            {<OpeningHours hours={c.visit.openingHours} />}
            <div className="visit-contact">
              <p>A question before your visit?</p>
              <a href={`mailto:${email(c)}`}>
                {"info@replayyork.co.uk".replaceAll(
                  "info@replayyork.co.uk",
                  email(c),
                )}
              </a>
            </div>
          </div>
          <div className="faq">
            {
              <>
                <h2>GOOD TO KNOW.</h2>
                <FAQs content={c} />
              </>
            }
          </div>
        </section>

        <section className="closing-section">
          <div className="page-width closing-inner">
            <div>
              <p data-sanity={edit("footer.intro")}>{c.footer.intro}</p>
              <h2 data-sanity={edit("footer.title")}>
                {lineBreaks(c.footer.title)}
              </h2>
              <a
                data-conversion="events_and_tickets_click"
                className="button button-pink"
                href={tracked(c.settings.ticketsUrl, "closing_tickets")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Events &amp; tickets{" "}
                <svg className="icon">
                  <use href="#arrow"></use>
                </svg>
              </a>
            </div>
            <a
              className="closing-social"
              href={safeUrl(c.settings.instagramUrl)} data-sanity={edit("settings.instagramUrl")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="icon">
                <use href="#instagram"></use>
              </svg>
              <span>
                Follow Replay York <br />
                <strong
                  data-sanity={edit("settings.instagramUrl")}
                >{`@${instagramHandle}`}</strong>
              </span>
              <svg className="icon">
                <use href="#arrow"></use>
              </svg>
            </a>
          </div>
        </section>
      </main>

      <div className="mobile-booking" aria-label="Plan your night">
        <button data-enquiry="Celebration">Group enquiries</button>
        <a
          data-conversion="events_and_tickets_click"
          href={tracked(c.settings.ticketsUrl, "mobile_tickets")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Events &amp; tickets{" "}
          <svg className="icon">
            <use href="#arrow"></use>
          </svg>
        </a>
      </div>

      <footer className="site-footer page-width">
        <div className="footer-top">
          <a
            className={`brand${c.settings.logo?.asset?.url ? " has-custom-logo" : ""}`}
            href="#"
            aria-label="Replay York home"
          >
            <Image
              src={imageUrl(c.settings.logo, "/assets/replay-brand.jpg", 800)}
              alt="Replay York"
              width="2048"
              height="762"
              loading="lazy"
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </a>
          <p data-sanity={edit("footer.tagline")}>{c.footer.tagline}</p>
          <div className="footer-socials">
            <a
              href={safeUrl(c.settings.instagramUrl)} data-sanity={edit("settings.instagramUrl")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram{" "}
              <svg className="icon">
                <use href="#arrow"></use>
              </svg>
            </a>
            <a
              href={safeUrl(c.settings.facebookUrl)} data-sanity={edit("settings.facebookUrl")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook{" "}
              <svg className="icon">
                <use href="#arrow"></use>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © <span id="year">2026</span> Replay York. 18+.
          </span>
          <span className="footer-links">
            <a
              href={safeUrl(c.settings.lostPropertyUrl)} data-sanity={edit("settings.lostPropertyUrl")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lost property
            </a>
            <a
              href={safeUrl(c.settings.giftCardsUrl)} data-sanity={edit("settings.giftCardsUrl")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Gift cards
            </a>
            <button id="photo-credits">Photo credits</button>
          </span>
        </div>
      </footer>

      <dialog id="enquiry-dialog" aria-labelledby="enquiry-title">
        <button className="dialog-close" aria-label="Close enquiry">
          ×
        </button>
        <h2 id="enquiry-title">
          A NIGHT <br />
          TO REMEMBER.
        </h2>
        <p>
          Tell us what you've got in mind. The Replay team will confirm
          availability and help you plan.
        </p>
        <form id="enquiry-form">
          <div className="form-row">
            <label>
              Your name
              <input
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="First and last name"
              />
            </label>
            <label>
              Your email
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={200}
                placeholder="you@example.com"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Preferred date
              <input type="date" name="date" id="enquiry-date" required />
            </label>
            <label>
              Group size
              <input
                type="number"
                name="guests"
                min="1"
                max="999"
                step="1"
                required
                placeholder="e.g. 12"
              />
            </label>
          </div>
          <label>
            What's the occasion?
            <select name="occasion">
              <option>Birthday</option>
              <option>Hen party</option>
              <option>Group night out</option>
              <option>Celebration</option>
              <option>Something else</option>
            </select>
          </label>
          <label>
            Anything else?
            <textarea
              name="message"
              rows={3}
              maxLength={2000}
              placeholder="Tell us a little about your plans…"
            ></textarea>
          </label>
          <button className="button button-pink" type="submit">
            Email your enquiry{" "}
            <svg className="icon">
              <use href="#arrow"></use>
            </svg>
          </button>
          <p className="form-note" id="enquiry-status" role="status">
            Opens your email app with your enquiry ready to send. This is an
            enquiry, not a confirmed booking.
          </p>
        </form>
        <a className="direct-email" href={`mailto:${email(c)}`}>
          {"Or email info@replayyork.co.uk directly".replaceAll(
            "info@replayyork.co.uk",
            email(c),
          )}
        </a>
      </dialog>
      <dialog id="credits-dialog" aria-labelledby="credits-title">
        <button className="dialog-close" aria-label="Close photo credits">
          ×
        </button>
        <h2 id="credits-title">THE PICTURES.</h2>
        <p>
          Our nightlife photography is temporary stock imagery, used to give you
          a feel for the atmosphere. Replay's own photos are coming soon.
        </p>
        <p>
          Dancefloor photograph by{" "}
          <a
            href="https://unsplash.com/photos/blurred-motion-of-people-dancing-under-blue-lights-Dg8svdtFETU"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ingrid Martinussen on Unsplash
          </a>
          . Additional party photograph from{" "}
          <a
            href="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          .
        </p>
        <p>Replay artwork and logo supplied by Replay York.</p>
      </dialog>
    </div>
  );
}
