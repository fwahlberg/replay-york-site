# Replay York website

Public website: https://replay-york.onrender.com
Production domain: https://replayyork.co.uk
Editor: https://replay-york.onrender.com/admin/ (https://replayyork.co.uk/admin/ after DNS connects)

The public site uses static HTML, CSS and JavaScript. Sanity Studio provides authenticated content editing; a build turns published Sanity content into the public HTML, preserving search-engine content and the existing animations.

## For website editors

1. Open the editor and sign in using a Sanity account that has access to the Replay York project.
2. Select **Website content**. Use the tabs for Home page, Featured nights, Visiting & FAQs, Contact & links, or Search & sharing.
3. Edit text or upload a photograph. Use a new line to split a large heading. Add accurate photo descriptions for accessibility. The image hotspot sets its focal point.
4. Press **Publish**. Draft edits do not change the public site. The publishing webhook starts a Render rebuild; the live site changes when that deployment finishes. Refresh the public site after the build completes.
5. Leave a featured night's specific ticket link blank to use the main events link. The website adds UTM tracking automatically.

Add only confirmed opening hours. The existing copy sends visitors to event listings for event-specific times. To remove the temporary photo note, clear its field after replacing the stock photograph.

Sanity project owners can add staff in Sanity Manage → Replay York → Members. Website content is in the public dataset: keep passwords, customer records and internal notes out of it.

## Development

Requires Node 22.12 or later (Render is pinned to 22.18.0).

```sh
npm ci
npm run build
npm run check
npm test
```

- `site/template.html`: website layout.
- `site/content.defaults.json`: original website content, used for optional-field fallbacks and first-time setup.
- `cms/build.mjs`: queries the published singleton document and safely renders the HTML.
- `studio/`: Sanity schema, editor configuration and CLI configuration.
- `dist/`: public static files. The compiled `dist/admin/` is generated during the build and excluded from Git.

A failed content request or invalid link fails the build so Render keeps its last successful deployment. Draft documents are excluded. No Sanity write token is used by the build or included in browser assets.

Sanity project: `7i0l1smd`; dataset: `production`; singleton document: `website`.
The CLI uses the owner's normal Sanity sign-in. To seed an empty dataset only:

```sh
cd studio
../node_modules/.bin/sanity dataset import ../cms/seed.ndjson --dataset production --missing
```

Do not re-import with `--replace` on a site that staff have edited.

After schema changes, register the externally hosted Studio and update its stored schema with `sanity deploy --external --url https://replayyork.co.uk/admin --schema-required` from `studio/`.

## Hosting and DNS

Render static service: `srv-dbkf43mk1f9s73d5us90`, repository `fwahlberg/replay-york-site`, branch `main`.
Build: `npm ci && npm run build`; publish directory: `dist`.
Environment: `SKIP_INSTALL_DEPS=true`, `NODE_VERSION=22.18.0`.
SPA rewrite: `/admin/*` → `/admin/index.html`. Root website routes are not rewritten.

Point these records at Render (replace the existing website records):

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 216.24.57.1 |
| CNAME | www | replay-york.onrender.com |

Remove the old root AAAA record, which points to the previous host. Keep email records unchanged. Render is configured for both domains with www redirecting to the root domain; it issues HTTPS certificates after DNS verification.

Sanity's project has an automatic Growth trial that downgrades to Free. This integration uses Free-plan features only.
Paid scheduling, releases and comments are disabled in the editor. Compatible dependency overrides patch high-severity advisories in Sanity's build-tool dependencies; upstream CLI dependencies still report moderate advisories.

Keep the Render deploy-hook URL secret. It belongs only in the Sanity publishing webhook configuration, never in this repository or browser JavaScript.

Opening-hours source checked on 2 November 2026: Google Maps, **REPLAY Nightclub York**, 3 George Hudson Street (place ID `ChIJ1cYjLqgxeUgRV1KwGwZuQ44`). Monday closed; Tuesday 22:00–03:00; Wednesday 21:00–03:00; Thursday 22:00–03:00; Friday 18:00–03:00; Saturday 15:00–03:00; Sunday 22:00–03:00. These are editable content, not an ongoing Google sync.

The existing public photos were uploaded to Sanity during initial setup. `cms/seed-assets.mjs` can add missing image references without replacing existing image selections or publishing a draft.
