# Replay York — Next.js + Sanity

Website: https://replay-york-next.onrender.com
Visual editor: https://replay-york-next.onrender.com/admin/
Production domain: https://www.replayyork.co.uk (the root domain redirects here).

The site uses Next.js App Router, React and Sanity. The existing design, native-scroll play animation, parallax, mobile menu, enquiry dialog, Leaflet map, Google-sourced opening hours and UTM booking links are preserved.

## Editing the website

1. Open `/admin/` and sign in with a Sanity account that has access to Replay York.
2. Choose **Visual editor**. Click text or a photograph in the website preview to open its matching field. The **Structure** tab also provides the full section-based editor.
3. Changes save as drafts. The preview updates while you type; regular visitors continue to see published content.
4. Press **Publish** when ready. A signed Sanity webhook refreshes the public page cache, without rebuilding the application.
5. To browse links in the preview, toggle **Edit** off or hold Alt/Option. The editor's viewport button switches between desktop and mobile previews.

Sanity handles staff sign-in and permissions. Project owners manage invitations in Sanity Manage → Replay York → Members. Only public website content belongs in the dataset; customer records and private operational notes should live elsewhere.

The home page, featured nights, photographs, photo descriptions, opening hours, FAQs, membership copy, booking destinations, contact/social links and search metadata are editable. Booking links retain their UTM parameters automatically.

## Development

Node 22.12 or later is required. Render uses Node 22.18.0.

```sh
npm ci
npm run build
PORT=3001 npm start
npm run check
npm test
npm run test:web
```

`npm run dev` runs the Next.js development server on port 3001. `npm start` runs the standalone production server; Render supplies `PORT`. Build copies the compiled Studio and public assets into the standalone output.

- `app/`: Next.js page, metadata, layout and API routes.
- `components/ReplayPage.tsx`: the existing design as React markup.
- `components/ContentSections.tsx`: editable paragraphs, hours and FAQs.
- `lib/content.ts`: content defaults, safe links, tracking and visual-editing attributes.
- `lib/site-effects.js`: native scroll effects and interactions, with mount/unmount cleanup.
- `lib/sanity/`: query, client and live-content integration.
- `studio/`: Sanity schemas, Presentation Tool and section-based editor.
- `public/`: website assets; `public/admin/` is built and ignored in Git.
- `site/`, `cms/build.mjs` and `dist/`: retained static-site fallback. `npm run build:static` rebuilds that version.

Copy `.env.example` to `.env.local` for configured local development. No credential belongs in Git or a `NEXT_PUBLIC_` variable.

`SANITY_API_READ_TOKEN` must use the **Viewer** role. It lets the server read drafts and is shared by the official Sanity integration only with authenticated Draft Mode sessions. Published visitors receive no preview token. The Draft Mode enable route validates Sanity's preview secret before issuing a preview cookie.

`SANITY_REVALIDATE_SECRET` is an independent shared signing secret between Sanity's publishing webhook and Render. `POST /api/revalidate` validates Sanity's signature and accepts only the published `website` singleton; it expires the `replay-website` data tag and the home page. Metadata uses the same content tag and disables stega encoding.

For hosted checks:

```sh
REPLAY_TEST_URL=https://replay-york-next.onrender.com REPLAY_REQUIRE_PUBLISHING=true npm run test:web
```

## Render hosting

Next.js web service: `replay-york-next`, ID `srv-dbkg3b0ae00c73cl6t0g`.
Repository: `https://github.com/fwahlberg/replay-york-site`.
Build command: `npm ci && npm run build`.
Start command: `npm start`.
Health check: `/api/health`.
Environment: `NODE_VERSION=22.18.0`, `SKIP_INSTALL_DEPS=true`, plus the two private Sanity settings above.
The production service builds `main`. The original static implementation is preserved on `static-backup`.

The selected Render compute plan is **Free**. Free web services sleep after 15 minutes without traffic; the next visit can take about a minute to start. Monthly compute, bandwidth and build limits also apply. Sanity's editor uses Free-plan features; releases, scheduling and comments are disabled.

Legacy static service: `srv-dbkf43mk1f9s73d5us90`, https://replay-york.onrender.com. It is suspended and can be resumed as a fallback from `static-backup`.

## Sanity project and publishing

Project `7i0l1smd`, dataset `production`, singleton document `website`.
The embedded Studio is built at `/admin`, and Next.js handles its deep links. Studio pages send `noindex` metadata and HTTP headers.

The publishing webhook belongs to the `production` dataset with create/update enabled, drafts and versions disabled, filter `_type == "website" && _id == "website"`, projection `{_id, _type}`, method POST, destination `https://replay-york-next.onrender.com/api/revalidate`, and the shared secret. Keep secrets out of webhook URLs and logs.

After schema changes, update Sanity's registered schema from `studio/`:

```sh
../node_modules/.bin/sanity deploy --external --url https://www.replayyork.co.uk/admin --schema-required --yes
```

## Domain DNS

Both custom domains are attached to the Next.js service with certificates issued. The desired website DNS records are:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 216.24.57.1 |
| CNAME | www | replay-york-next.onrender.com |

The root A record and removal of the old AAAA record are verified. The www CNAME still points at the old Render hostname and should be updated to the value above. Leave email records unchanged. Render redirects the root domain to www, matching the canonical URL and sitemap.

## Opening-hours source

Google Maps, **REPLAY Nightclub York**, 3 George Hudson Street, checked 2 November 2026 (place ID `ChIJ1cYjLqgxeUgRV1KwGwZuQ44`). Monday closed; Tuesday 22:00–03:00; Wednesday 21:00–03:00; Thursday 22:00–03:00; Friday 18:00–03:00; Saturday 15:00–03:00; Sunday 22:00–03:00. These are editable CMS content, not an ongoing Google sync.
