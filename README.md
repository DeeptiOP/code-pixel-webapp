# CodePixel Portfolio and Template Marketplace

CodePixel is a responsive React/Vite portfolio with a Node.js/Express API and MongoDB-backed template marketplace. It preserves the existing portfolio and adds marketplace routes and an administrator workspace.

## Requirements
- Node.js 20.19 or newer
- npm
- MongoDB (local or hosted)

## Run locally
1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI`, a random `JWT_SECRET` of at least 32 characters, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_ORIGIN`. Use a strong private admin password. Keep `.env` out of git. Set `TRUST_PROXY=true` only when the API runs behind one trusted reverse proxy and the host's forwarded IP headers are configured.
3. Install packages and seed the catalogue:

```bash
npm install
npm run db:seed
npm run dev:full
```

The frontend is served by Vite (normally http://localhost:5173), and its `/api` requests proxy to Express on port 4000. The seed uses insert-only upserts for the initial 24 categories and templates and does not overwrite existing records. Every seeded demo is marked unavailable; no demo, rating or completed client project is invented.

## Routes
- `/` — existing CodePixel portfolio
- `/templates` — marketplace catalogue
- `/templates/websites`, `/templates/admin-dashboards`, `/templates/web-applications`
- `/templates/category/:slug`
- `/template/:slug`
- `/template/:slug/preview`
- `/customize/:slug`
- `/pricing`
- `/admin/marketplace` — administrator sign-in and marketplace management

## API
Public:
- `GET /api/health`
- `GET /api/template-categories`
- `GET /api/templates` — search, filters, sorting, pagination
- `GET /api/templates/featured`
- `GET /api/templates/popular`
- `GET /api/templates/:slug`
- `POST /api/template-enquiries`

Admin (authenticated with an HttpOnly, SameSite=Strict cookie):
- `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/session`
- `GET /api/admin/overview`
- `GET/POST /api/admin/templates`, `PUT/DELETE /api/admin/templates/:id`
- `GET/POST /api/admin/categories`, `PUT/DELETE /api/admin/categories/:id`
- `GET /api/admin/enquiries`, `PATCH /api/admin/enquiries/:id`

The API uses Mongoose validation, bounded request sizes, HTTPS URL validation, rate limits, secure HTTP headers, and protected administrator endpoints. Set `COOKIE_SECURE=true` when API traffic is HTTPS.

## Marketplace limitations / external configuration
Customization enquiries are stored in MongoDB and are visible to admins. File attachments are disabled because no secure object-storage provider is configured; the form says so. There is no customer account system, email provider, quotation sending/acceptance, order processing, invoice system, payment provider, audit log, or production demo environment in this project. Payments are not simulated. Admin demo previews are configured only from explicit HTTPS URLs and run in a sandboxed iframe. The main portfolio's contact/package forms still open a prefilled email draft.

The admin overview displays actual template/enquiry counts only; revenue is omitted without payment data. Ratings and testimonials are not fabricated. A template card's generated UI artwork is an illustrative concept, not a real screenshot or functional demo.

## Build and tests
```bash
npm test
npm run build
npm run preview
```
The Node test suite covers API health, administrator session protections, login cookie flags, enquiry validation, and HTTPS URL validation. MongoDB-backed CRUD and persistence tests require a configured MongoDB server.

## Deployment
The repository includes deployment configuration for Netlify (frontend) and Render (Express API). Use a managed MongoDB service and restrict its network access. Netlify proxies `/api/*` through a function, so API requests and the administrator's `SameSite=Strict` session cookie remain same-origin; do not set `VITE_API_URL` on Netlify.

### Deploy the API to Render
1. In Netlify, import this repository. The checked-in `netlify.toml` sets `npm run build`, publishes `dist`, and provides the SPA fallback for deep links. Deploy once to obtain the site's origin, such as `https://your-site.netlify.app`.
2. Create a MongoDB database and copy its connection string.
3. In Render, create a Blueprint from this repository and apply `render.yaml`. Set the prompted environment values: `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters), and `CLIENT_ORIGIN` (the exact Netlify site origin). Render generates `JWT_SECRET`; keep it private.
4. Wait for the Render service to become healthy at `/api/health` and note its HTTPS origin, such as `https://code-pixel-api.onrender.com`.
5. In Netlify's environment variables, set `API_URL` to the Render API origin only (no `/api` suffix). Do not prefix it with `VITE_`. Redeploy the Netlify site so the function can reach the API.
6. Run `npm run db:seed` once against the production `MONGODB_URI` from a trusted local environment, or run it in the Render shell if available. The seed is insert-only and preserves existing records.

Keep database credentials and secrets only in the relevant host environment variables—never commit `.env` or expose secrets as frontend `VITE_` variables. For a custom domain, update Render's `CLIENT_ORIGIN` to the exact frontend origin.

## Existing portfolio customization
- Contact details and site structure: `src/App.jsx`
- Services: `src/data/services.js`
- Portfolio projects: `src/data/projects.js`
- Service pricing: `src/data/pricing.js`
- Marketplace UI: `src/components/Marketplace.jsx`, `src/marketplace.css`
- Marketplace server: `server/`
