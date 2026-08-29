# Founder Website — React + Node + Strapi

Full stack: React (Vite) frontend, Express backend for forms, Strapi
headless CMS for all editable content. This is where your original
question — "where's the CMS login" — gets answered: **`cms/`**.

## Structure

```
frontend/   React (Vite) app — 9 pages, fetches content from Strapi
backend/    Express API — /api/contact, /api/speaking-inquiry
cms/        Strapi 5 — the actual CMS with an admin login
```

## Run locally (3 servers)

```bash
# Terminal 1 — CMS (start this first)
cd cms
cp .env.example .env
# Fill in APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, JWT_SECRET,
# TRANSFER_TOKEN_SALT, ENCRYPTION_KEY — generate each with:
#   openssl rand -base64 32
# APP_KEYS takes 4 comma-separated values; the rest take one each.
npm install
npm run develop      # http://localhost:1337

# Terminal 2 — backend (contact/speaking forms)
cd backend
cp .env.example .env
npm install
npm run dev           # http://localhost:4000

# Terminal 3 — frontend
cd frontend
cp .env.example .env  # optional, defaults to http://localhost:1337
npm install
npm run dev            # http://localhost:5173
```

## Creating your CMS login

The **first time** you run `npm run develop` in `cms/`, Strapi will:

1. Create a local SQLite database (`cms/.tmp/data.db`)
2. Auto-grant public read access to all content types (so the frontend
   can fetch without an API token — see `cms/src/index.js`)
3. Auto-seed every page and collection with the same Lorem ipsum /
   `[CONTENT TO BE PROVIDED]` placeholders the frontend used to have
   hardcoded — so the site works immediately, and you're editing real
   content from minute one

Then open **http://localhost:1337/admin** — Strapi will prompt you to
create your first administrator account (name, email, password). That's
your CMS login. There's no separate signup flow; whoever opens
`/admin` first on a fresh database creates the owner account. Add more
editors afterward under Settings → Administration Panel → Users.

## Editing header/footer links

Admin panel → Content Manager → **Site Link** (collection type).
Each entry has:
- `label` — the text shown in the nav
- `url` — where it points (e.g. `/about`)
- `placement` — `header` or `footer`
- `order` — sort position
- `openInNewTab`

Add, edit, delete, or reorder entries — the live site reflects it on
next page load, no redeploy needed.

## Editing page content

Admin panel → Content Manager → **Page** (collection type). One entry
per site page, matched by `slug` (`home`, `about`, `ventures`,
`achievements`, `media`, `lifestyle`, `philanthropy`, `speaking`,
`contact`). Each has a heading, intro text, optional secondary
heading/body, SEO title/description, and — on Home/Achievements/
Philanthropy — a repeatable `ledgerStats` field for the stat bar
(value + label pairs).

## Editing repeating content

Each of these is its own collection type in the Content Manager:

| Content type | Shows up on |
|---|---|
| Venture | Home, Ventures |
| Achievement | Achievements |
| Press Item | Media & Press |
| Lifestyle Image | Lifestyle |
| Philanthropy Initiative | Philanthropy |
| Timeline Entry | About (career journey) |
| Value | About (values grid) |
| Speaking Topic | Speaking (topic tags) |
| Past Engagement | Speaking (past stages) |

Each has an `order` field controlling display sequence.

## Site-wide settings

Admin panel → Content Manager → **Site Settings** (single type):
wordmark, footer blurb, positioning statement, email, location, social
links note, media kit URL.

## How the frontend consumes it

`frontend/src/lib/cms.js` — thin fetch wrapper around Strapi's REST API.
`frontend/src/lib/useCms.js` — React hooks (`useCmsPage`, `useCmsList`)
that fetch on mount and fall back to hardcoded Lorem ipsum if the CMS
is unreachable or a field is empty, so the site never blank-pages.
Every page component (`frontend/src/pages/*.jsx`) uses these instead
of hardcoded JSX now.

## What's implemented

- Full Strapi CMS with 12 content types, auto-provisioned public read
  permissions, and auto-seeded placeholder content on first boot
- All 9 frontend pages + Nav + Footer wired to fetch from the CMS
- Contact form → `POST /api/contact`, Speaking inquiry → `POST /api/speaking-inquiry`
  (Express backend, unrelated to the CMS — these are form submissions,
  not editable content)
- Submissions persisted to `backend/data/*.ndjson`, honeypot + rate
  limiting on both endpoints
- Per-page `<title>`/meta description, sourced from the CMS Page content type
- `robots.txt`, placeholder `sitemap.xml`
- Vitest smoke tests + GitHub Actions CI

## What's still not built

Media library is wired (venture logos, press thumbnails, lifestyle
images, philanthropy images all support image uploads in Strapi and
render on the frontend) but nothing's been uploaded — add images
through the Content Manager's media picker on each entry. Also not
built: real authentication beyond Strapi's own admin login, a
production database (SQLite is fine for editing, swap to Postgres
before real traffic — one line in `cms/config/database.js` plus env
vars), real email delivery for form notifications, image CDN, i18n,
draft/preview links on the live site (draft & publish is enabled on
content types, but the frontend only reads published content).

Replace remaining `[CONTENT TO BE PROVIDED]` placeholders with real
founder content through the CMS before launch — no code changes
needed for that part anymore.

## Deploying (free/cheap path)

Total realistic cost: domain only (~$8–12/yr) if you're fine with
Render's free-tier cold starts; ~$7/mo once you want the CMS always warm.

### 1. Domain + DNS + WAF — Cloudflare (free)
Buy the domain wherever (Porkbun/Namecheap), then point its nameservers
at Cloudflare. This gets you free SSL, a free WAF, and DDoS protection
on everything below with no extra setup.

### 2. Frontend — Cloudflare Pages (free)
Connect the repo, set:
- Build command: `cd frontend && npm install && npm run build`
- Output directory: `frontend/dist`
- Env var: `VITE_STRAPI_URL=https://your-cms-url`

`frontend/public/_redirects` is already in place so client-side routing
(React Router) doesn't 404 on refresh.

### 3. Backend + CMS — Render (free tier to start)
`render.yaml` in the repo root is a Render Blueprint — "New +" →
"Blueprint" in the Render dashboard, point it at this repo, it
provisions both services.

Before deploying the CMS service, attach a Postgres database (Render's
own free Postgres, or Supabase's free tier) and fill in the
`DATABASE_HOST`/`DATABASE_NAME`/`DATABASE_USERNAME`/`DATABASE_PASSWORD`
values in the Render dashboard — SQLite doesn't survive Render's
free-tier ephemeral disk. All the Strapi secret keys
(`APP_KEYS`, `ADMIN_JWT_SECRET`, etc.) auto-generate — you don't set
those by hand.

Set `FRONTEND_ORIGIN` on the backend service to your deployed Cloudflare
Pages URL once you have it, so CORS allows it.

### 4. 2FA for the Strapi admin login
Strapi Community Edition doesn't ship 2FA (it's an Enterprise/Cloud
feature). Rather than install an unaudited third-party plugin, gate
`/admin` at the edge instead:

1. Cloudflare dashboard → Zero Trust → Access → Applications → Add an
   application for your CMS's `/admin` path
2. Require login via Google/GitHub (or email OTP) — both support 2FA
   on the identity provider side
3. Free for up to 50 users

This means an attacker needs to pass Cloudflare's login *and* Strapi's
own login to reach the admin panel, and you get real 2FA without
trusting unaudited code with your authentication.

### 5. Email
Zoho Mail (free plan, up to 5 mailboxes on your custom domain) or
Cloudflare Email Routing (free, forwarding-only — good enough if you
just need `hello@yourdomain.com` to land in an existing inbox).
