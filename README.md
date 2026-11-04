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
Deploy the Vite frontend to a static host and the Express server to a persistent Node.js host. Use a managed MongoDB service and restrict its network access. Set `VITE_API_URL` to the deployed API origin when building the frontend, and set API `CLIENT_ORIGIN`, `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `COOKIE_SECURE=true` in the API host environment. Configure the static host's SPA history fallback for marketplace deep links. Do not deploy placeholder credentials or secrets.

## Existing portfolio customization
- Contact details and site structure: `src/App.jsx`
- Services: `src/data/services.js`
- Portfolio projects: `src/data/projects.js`
- Service pricing: `src/data/pricing.js`
- Marketplace UI: `src/components/Marketplace.jsx`, `src/marketplace.css`
- Marketplace server: `server/`
