# Architecture Decisions Log

Decisions made for the Indian Minimum Support Price (MSP) & Crop Benchmark API.

## 2026-10-06 — Architecture & Storage Decision

- **Storage:** Bundled in-memory JSON (`backend/data/msp_records.json`).
  - *Context:* The total official CACP dataset contains 504 rows total across 28 commodities and 18 crop years (2010–2027), approximately 61 KB uncompressed.
  - *Decision:* No external database (PostgreSQL, Supabase, SQLite server) is required. Data is bundled directly inside the Express serverless function (`api/index.js`), eliminating cold starts, database pause issues, and hosting costs.
- **Hosting:** Vercel (Hobby Tier).
  - *Decision:* Backend runs as a Node.js Vercel Function with bundled data. Frontend is a React + Vite SPA prerendered to static HTML at build time (`scripts/prerender.mjs`) for 100% crawler indexability, with zero catch-all wildcard routing to ensure real HTTP 404 responses.
- **Brand Identity:** Deep institutional emerald (`#064e3b`) and crop amber (`#d97706`), differentiated from mandi-api's earthy rust tones.
- **V1 Scope Boundary:** 28 mandated commodities across Kharif, Rabi, and Commercial crops (2010–2026/27) including recommended vs fixed prices and KMS 2026-27 / RMS 2027-28 A2+FL cost margins. Pre-2026 historical C2 costs are deferred to v2 due to unstructured PDF source formats.
