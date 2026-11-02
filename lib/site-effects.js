export function initSite() {
  const controller = new AbortController();
  let frameId;
  const on = (target, event, handler, options = {}) =>
    target.addEventListener(event, handler, {
      ...options,
      signal: controller.signal,
    });
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-nav");
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    mainNav.classList.remove("is-open");
  };
  on(menuToggle, "click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mainNav.classList.toggle("is-open", open);
  });
  on(document, "click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (
      event.target.closest("#main-nav a") ||
      !event.target.closest(".site-header")
    )
      closeMenu();
  });
  on(document, "keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuToggle.focus();
    }
  });
  on(matchMedia("(min-width: 801px)"), "change", (event) => {
    if (event.matches) closeMenu();
  });
  const enquiryDialog = document.querySelector("#enquiry-dialog");
  const enquiryForm = document.querySelector("#enquiry-form");
  const enquiryStatus = document.querySelector("#enquiry-status");
  const dateInput = document.querySelector("#enquiry-date");
  dateInput.min = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  document.querySelector("#year").textContent = new Intl.DateTimeFormat("en", {
    year: "numeric",
    timeZone: "Europe/London",
  }).format(new Date());
  on(document, "click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-enquiry]");
    if (button) {
      enquiryForm.elements.occasion.value = button.dataset.enquiry;
      enquiryStatus.textContent =
        "Opens your email app with your enquiry ready to send. This is an enquiry, not a confirmed booking.";
      enquiryStatus.classList.remove("ready");
      enquiryDialog.showModal();
      document.body.classList.add("modal-open");
    }
    if (event.target.closest("#photo-credits")) {
      document.querySelector("#credits-dialog").showModal();
      document.body.classList.add("modal-open");
    }
    const close = event.target.closest(".dialog-close");
    if (close) close.closest("dialog").close();
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    on(dialog, "click", (event) => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close();
    });
    on(dialog, "close", () => document.body.classList.remove("modal-open"));
  });
  on(enquiryForm, "submit", (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;
    const data = new FormData(enquiryForm);
    const date = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "long",
      timeZone: "Europe/London",
    }).format(new Date(`${data.get("date")}T12:00:00Z`));
    const subject = `Replay York enquiry: ${data.get("occasion")} — ${date}`;
    const body = `Hi Replay team,\n\nI'd like to enquire about a night out at Replay.\n\nName: ${data.get("name").trim()}\nEmail: ${data.get("email").trim()}\nPreferred date: ${date}\nGroup size: ${data.get("guests")}\nOccasion: ${data.get("occasion")}\n\n${data.get("message").trim()}\n\nPlease let me know what is available.\n\nThanks,\n${data.get("name").trim()}`;
    const email =
      document.querySelector("[data-replay-site]").dataset.contactEmail;
    const link = document.createElement("a");
    link.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    enquiryStatus.textContent =
      "Your enquiry is ready in your email app. Send it there to contact Replay. If your email app did not open, use the direct email link below. Your booking is only confirmed once the team replies.";
    enquiryStatus.classList.add("ready");
  });
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".hero");
  const stage = document.querySelector(".hero-stage");
  const portal = document.querySelector(".play-portal");
  const heroBackdrop = document.querySelector(".hero-photo");
  const heroCopy = document.querySelector(".hero-copy");
  const heroBottom = document.querySelector(".hero-bottom");
  const portalWash = document.querySelector(".portal-wash");
  const moment = document.querySelector(".replay-moment");
  const photo = document.querySelector(".image-viewport > img");
  const photoWindow = document.querySelector(".feeling-photo");
  const memberPass = document.querySelector(".member-pass");
  const anthem = document.querySelector(".anthem-track");
  const progressLine = document.querySelector(".reading-progress");
  const mobileBooking = document.querySelector(".mobile-booking");
  const clamp = (value, min = 0, max = 1) =>
    Math.max(min, Math.min(value, max));
  let framePending = false;

  function renderScroll() {
    framePending = false;
    // Read layout together before touching compositor properties.
    const heroRect = hero.getBoundingClientRect();
    const photoRect = photoWindow.getBoundingClientRect();
    const passRect = document
      .querySelector(".membership-panel")
      .getBoundingClientRect();
    const viewport = innerHeight;
    const range = Math.max(hero.offsetHeight - stage.offsetHeight, 1);
    const progress = clamp(-heroRect.top / range);
    const pageProgress = clamp(
      scrollY / Math.max(document.documentElement.scrollHeight - viewport, 1),
    );
    progressLine.style.transform = `scaleX(${pageProgress})`;
    mobileBooking.classList.toggle(
      "is-visible",
      heroRect.bottom < viewport * 0.65,
    );

    if (motionPreference.matches) return;
    const zoom = 1 + 17 * Math.pow(progress, 2.4);
    const moveX = -innerWidth * 0.18 * progress;
    portal.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% - ${progress * 25}px)) rotate(${-11 * (1 - progress)}deg) scale(${zoom})`;
    // Pass through the mark into a full-resolution scene, rather than scaling
    // one small crop into an increasingly pixelated photograph.
    const sceneReveal = clamp((progress - 0.34) / 0.32);
    heroBackdrop.style.opacity = String(0.16 + sceneReveal * 0.84);
    heroBackdrop.style.transform = `scale(${1.06 - sceneReveal * 0.06})`;
    portal.style.opacity = String(
      (innerWidth <= 580 ? 0.8 : 1) * (1 - clamp((progress - 0.43) / 0.25)),
    );
    heroCopy.style.transform = `translate3d(0,${-progress * 160}px,0)`;
    heroCopy.style.opacity = String(clamp(1 - progress / 0.32));
    heroCopy.inert = progress > 0.32;
    heroBottom.style.opacity = String(clamp(1 - progress / 0.18));
    heroBottom.inert = progress > 0.18;
    const emerge = clamp((progress - 0.29) / 0.32);
    portalWash.style.opacity = String(emerge * 0.4);
    moment.style.opacity = String(emerge);
    moment.style.transform = `translate3d(0,${(1 - emerge) * 40}px,0)`;

    const photoProgress = clamp(
      (viewport - photoRect.top) / (viewport + photoRect.height),
    );
    photo.style.transform = `translate3d(0,${-photoProgress * 12}%,0)`;
    const passProgress = clamp(
      (viewport - passRect.top) / (viewport + passRect.height),
    );
    memberPass.style.transform = `rotate(${12 - passProgress * 10}deg) translate3d(0,${(passProgress - 0.5) * -26}px,0)`;
    anthem.style.transform = `translate3d(${-clamp(scrollY / viewport, 0, 5) * 60}px,0,0)`;
  }

  function queueScrollFrame() {
    if (!framePending) {
      framePending = true;
      frameId = requestAnimationFrame(renderScroll);
    }
  }

  function configureMotion() {
    document.documentElement.classList.toggle(
      "motion-ready",
      !motionPreference.matches,
    );
    if (motionPreference.matches) {
      [
        portal,
        heroBackdrop,
        heroCopy,
        heroBottom,
        portalWash,
        moment,
        photo,
        memberPass,
        anthem,
      ].forEach((element) => element.removeAttribute("style"));
      heroCopy.inert = false;
      heroBottom.inert = false;
    }
    queueScrollFrame();
  }
  on(window, "scroll", queueScrollFrame, { passive: true });
  on(window, "resize", queueScrollFrame, { passive: true });
  on(window, "load", queueScrollFrame, { once: true });
  on(motionPreference, "change", configureMotion);
  configureMotion();

  const mapElement = document.querySelector("#venue-map");
  let venueMap;
  let mapResize;
  let mapApproaching = false;
  function initVenueMap() {
    if (venueMap || !window.L) return;
    const L = window.L;
    mapElement.querySelector(".map-fallback")?.remove();
    venueMap = L.map(mapElement, {
      scrollWheelZoom: false,
      zoomControl: false,
      dragging: !matchMedia("(pointer: coarse)").matches,
      tap: false,
    }).setView([53.9579, -1.0859], 16);
    L.control.zoom({ position: "topright" }).addTo(venueMap);
    const tiles = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
        maxZoom: 19,
        minZoom: 12,
      },
    ).addTo(venueMap);
    let failedTiles = 0;
    tiles.on("tileerror", () => {
      failedTiles += 1;
      if (failedTiles > 3 && !mapElement.querySelector(".map-tile-fallback")) {
        const note = document.createElement("p");
        note.className = "map-tile-fallback";
        note.textContent =
          "Map tiles are unavailable. Use “Directions to Replay” to plan your route.";
        mapElement.append(note);
      }
    });
    tiles.on("tileload", () => {
      mapElement.querySelector(".map-tile-fallback")?.remove();
      failedTiles = 0;
    });
    const icon = L.divIcon({
      className: "replay-map-marker",
      iconSize: [54, 62],
      iconAnchor: [27, 60],
      tooltipAnchor: [0, -50],
      html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 62" aria-hidden="true"><path d="M27 61 7 35A25 25 0 1 1 47 35Z" fill="#ff00a8"/><path d="m20 13 22 13-22 13Z" fill="#050505"/></svg>',
    });
    L.marker([53.9575026, -1.0868521], {
      icon,
      alt: "Replay York, 3 George Hudson Street",
      title: "Replay York",
    })
      .addTo(venueMap)
      .bindTooltip("Replay York", {
        permanent: true,
        direction: "top",
        className: "replay-map-label",
      });
    mapResize = new ResizeObserver(() =>
      venueMap.invalidateSize({ animate: false }),
    );
    mapResize.observe(mapElement);
  }
  const mapObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        mapApproaching = true;
        initVenueMap();
        mapObserver.disconnect();
      }
    },
    { rootMargin: "400px" },
  );
  mapObserver.observe(mapElement);

  on(window, "replay:map-ready", () => {
    if (mapApproaching) initVenueMap();
  });
  const contentResize = new ResizeObserver(queueScrollFrame);
  contentResize.observe(document.querySelector("#main"));
  on(document, "click", (event) => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest("a,button");
    if (!target) return;
    let action;
    if (target.matches("[data-enquiry]")) action = "group_enquiry_open";
    else if (target.dataset.conversion) action = target.dataset.conversion;
    else if (target.href?.includes("google.com/maps"))
      action = "directions_click";
    if (action)
      document.dispatchEvent(
        new CustomEvent("replay:conversion", {
          detail: {
            action,
            section: target.closest("section")?.id || "navigation",
          },
        }),
      );
  });
  return () => {
    controller.abort();
    cancelAnimationFrame(frameId);
    mapObserver.disconnect();
    mapResize?.disconnect();
    contentResize.disconnect();
    venueMap?.remove();
    document.body.classList.remove("modal-open");
  };
}
