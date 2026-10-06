# Candidate: Indian Minimum Support Price (MSP) & Crop Benchmark API

Date: 2026-09-25
Researched by: api-idea-scout (discovery mode)

## Idea

A keyless REST API serving the Government of India's official Minimum Support Prices (MSP) and comprehensive cost of production benchmarks for mandated agricultural crops. Sourced from the Commission for Agricultural Costs and Prices (CACP) and the Ministry of Agriculture & Farmers Welfare, the API covers 23 mandated crops across Kharif and Rabi seasons (including Paddy, Wheat, Gram, Tur/Arhar, Moong, Urad, Mustard, Groundnut, Cotton, Soyabean), plus the Fair and Remunerative Price (FRP) for Sugarcane.

While `mandi-api` delivers daily fluctuating market arrivals and modal prices across agricultural markets, it does not provide the statutory government floor prices (MSP) or production cost estimates (A2+FL, C2). Agri-fintech applications, farm yield planners, mandi trading tools, and crop insurance services currently lack a unified, keyless REST API to compare daily mandi prices against the official MSP benchmark and evaluate historical price escalation.

## Data source

Primary source:
- Commission for Agricultural Costs and Prices (CACP), Ministry of Agriculture and Farmers Welfare (`https://cacp.dacnet.nic.in`):
  - Annual Price Policy Reports for Kharif and Rabi crops.
  - Cabinet Committee on Economic Affairs (CCEA) official notifications.

Secondary & Catalog Source:
- Open Government Data (OGD) Platform India (`data.gov.in`):
  - Catalog: Minimum Support Prices (MSP) of mandated agricultural commodities.
  - Resource: State-wise and crop-wise historical MSP datasets.

Sources:
- https://cacp.dacnet.nic.in
- https://agricoop.nic.in
- https://data.gov.in
- https://pib.gov.in (Cabinet decisions on MSP for Kharif/Rabi seasons)

## License findings

**data.gov.in Government Open Data License (GODL-India)**:
> "All users are provided a worldwide, royalty-free, non-exclusive license to use, adapt, publish (either in original, or in adapted and/or derivative forms), translate, display, add value, and create derivative works (including products and services), for all lawful commercial and non-commercial purposes, and for the duration of existence of such rights over the data."

**Ministry of Agriculture and Farmers Welfare Website Terms**:
> "Material featured on this website may be reproduced free of charge in any format or media without requiring specific permission. This is subject to the material being reproduced accurately and not being used in a derogatory manner or in a misleading context."

Statutory price notifications approved by the Cabinet Committee on Economic Affairs (CCEA) and gazetted by the Government of India are public domain government policy documents, officially catalogued under GODL on data.gov.in.

Criterion 1 is a clean **pass**.

## Duplication check

- **public-apis GitHub repository & public-apis.io**: Searched for `MSP`, `agriculture India`, `crop price`. `mandi-api` (the user's own project) is present, which serves daily spot wholesale market prices. No API exists for official Minimum Support Price benchmarks or CACP cost data.
- **Direct web search (`"Minimum Support Price" API India free`, `Indian MSP API`)**: No free hosted public API exists. Government portals offer PDF reports and raw CSV tables on data.gov.in. Developers use custom scripts or wrapper packages like `datagovindia` requiring private API keys.
- **GitHub search**: Repositories contain one-off web scrapers, Jupyter notebooks analyzing MSP vs market prices, or static CSV files, but no hosted, keyless, CORS-enabled REST service.
- **Scope differentiation from `mandi-api`**: Mandi-api handles daily dynamic time-series price data (modal prices, arrivals by mandi and market date). MSP API provides the institutional price floor, official production cost estimates (A2+FL, C2), and 15-year statutory price growth series. The two complement each other without duplication.

Criterion 2 is a clean **pass**.

## Update cadence

- The Government of India announces MSP twice each year:
  - Kharif crops: Announced in May/June before the monsoon sowing season.
  - Rabi crops: Announced in September/October before the winter sowing season.
- Follows formal approval by the Cabinet Committee on Economic Affairs (CCEA) with immediate Press Information Bureau (PIB) releases and gazette notifications.
- Highly stable, predictable biannual cadence. Ingestible via an automated bi-monthly or monthly GitHub Actions verification run, with zero real-time streaming overhead.

Criterion 3 is a clean **pass**.

## Scope sketch

A clean, 5-endpoint v1:
- `GET /v1/msp/current` — Current active MSP across all 23 mandated crops with season, marketing year, and percentage increase over previous year.
- `GET /v1/msp/crops/{crop_slug}` — Historical MSP series (2010–present), variety specifications, and CACP production cost benchmarks (A2+FL and C2) for a specific crop (e.g. `wheat`, `paddy-common`, `gram`, `mustard`).
- `GET /v1/msp/seasons/{season}` — Crops filtered by season (`kharif`, `rabi`, `other`).
- `GET /v1/msp/categories` — Breakdown by commodity group: Cereals (7), Pulses (5), Oilseeds (8), and Commercial Crops (3).
- `GET /v1/msp/compare?crop=wheat&year=2024` — Benchmark comparison endpoint exposing Return over Cost of Production (A2+FL margin percentage).

Data volume: ~23 crops over 15 years (~350 crop-year records), ideal for flat JSON or SQLite/Supabase. Comparable in size to `calendar-api`.

Criterion 4 is a clean **pass**.

## Scorecard

| # | Criterion | Result |
|---|---|---|
| 1 | Data source exists & is legally redistributable | **pass** — Sourced from CACP/MoA&FW gazettes catalogued under GODL-India on data.gov.in; reproduction permitted with attribution. |
| 2 | Not already well-served | **pass** — No free, hosted, keyless REST API serves Indian MSP and CACP cost benchmarks; distinct from `mandi-api`'s daily spot market rates. |
| 3 | Sane update cadence | **pass** — Formal biannual announcements (Kharif in May/June, Rabi in Sept/Oct) backed by official CCEA calendar. |
| 4 | Buildable v1 scope | **pass** — 5 endpoints, ~350 structured records, easily delivered via Node.js + Express with flat JSON or SQLite storage. |
| 5 | Awesome-list submission fit | **pass** — Fully keyless, CORS-enabled, HTTPS, working root route, zero-auth public interface. |

## Verdict: go

Clear `go` with 5/5 passes. Directly complements the agricultural developer ecosystem alongside `mandi-api` while solving an unserved benchmark data need.

---

## Re-check 2026-10-06 (validation refresh before planning)

### Duplication, re-run across the open web and GitHub

- **Parse.bot UPAg wrapper** (`get_commodity_msp`): third-party scraper of upag.gov.in. Needs signup
  and an API key. Not free/keyless, so it does not serve this audience; it does show demand.
- **UPAg official API** (upag.gov.in): login with user ID and password
  (`POST /v1/upag/api-data-share/login`); documented scope is area/production/yield and crop
  master data. MSP not confirmed in it. Not public.
- **GitHub** (`minimum support price`: 53 repos; `msp crop price`: 35 repos; `msp api india`,
  `msp kharif rabi`, `cacp msp`: 0): analysis notebooks, ML MSP predictors, Power BI work and
  dashboards with hardcoded values. Closest data repo: `Mridlll/india-agri-market-data` (static
  CSVs: MSP 2024-25, 2025-26, and MSP + A2+FL + C2 for 12 crops 2018-2026; no API, licence not
  stated). `ghost9967/msp_web_app` (2020, no README, inactive).
- **npm / PyPI**: no MSP package.

Criterion 2 stays **pass**: no free, keyless, hosted MSP API exists.

### Data source, much better than first recorded

CACP's own "Crop and Year-wise MSP" page (`https://cacp.da.gov.in/Home/msp`) renders its table
from a public JSON file: **`https://cacp.da.gov.in/json.json`**.

- Fetched 06/10/2026: HTTP 200, `Content-Type: application/json`, 60,938 bytes, 504 rows,
  no `Access-Control-Allow-Origin` header (irrelevant: ingestion is server-side).
- Row shape: `{"seasonname":"Kharif Crops","commodityname":"Paddy Common","financialyear":2026,"reco_price":"2441","fixed_price":"2441"}`.
- 28 commodity rows x 18 years (2010-2027). Seasons: `Kharif Crops`, `Rabi Crops`, `Commercial Crops`.
- Both the CACP-recommended price and the government-fixed price, e.g. 2018 Paddy Common reco 1745 / fixed 1750; 2017 Tur reco 5250 / fixed 5450.
- Values: 919 integers, 2 decimals, 87 `-` (no value). Gaps: Soyabean Black has no value after
  2014 (dropped from the mandated list); Copra 2026 not yet announced; 2027 is an empty placeholder.
- Page says "Updated on 30.09.2026", i.e. it already carries the rabi MSPs approved by the
  cabinet on 30/09/2026.
- **Year key = crop-year start.** `financialyear` 2026 holds Paddy Common 2441 (KMS 2026-27) and
  Wheat 2610 (RMS 2027-28, approved 30/09/2026). So kharif marketing season = crop year, rabi
  marketing season = crop year + 1.
- Footnotes a-o on the page mark bonus-inclusive years (e.g. Tur/Urad/Moong 2016-17 include a
  ₹425 bonus), the sugarcane FRP recovery-rate basis, jute variety, and cotton staple specs.

Production cost (A2+FL) is **not** in this JSON. Each PIB cabinet release carries a table of
MSP, all-India weighted average cost of production and margin over cost for that season.
C2 cost exists only in CACP price-policy report PDFs.

### Licence on the exact ingestion path

- CACP Terms & Conditions page (`/Home/TermsandConditions`, updated 30/09/2025): disclaimer and
  liability text only, **no reuse clause either way**. A CACP copyright/website-policy page was
  not reachable at guessed URLs.
- Still applicable: GODL-India on data.gov.in MSP catalog entries, and the Ministry of
  Agriculture website terms permitting free reproduction if accurate and not misleading (quoted
  above). PIB releases are freely reproducible.

Criterion 1 on the CACP JSON path is therefore **unconfirmed** until the CACP website policy is
read or the same values are matched to a GODL-licensed data.gov.in resource (plan Task 0.1).

### Updated scorecard

| # | Criterion | Result |
|---|---|---|
| 1 | Legally redistributable | **unconfirmed** on the CACP JSON path (no clause found); pass via GODL/MoA&FW terms if the values are matched (Task 0.1) |
| 2 | Not already well-served | **pass**, re-checked 06/10/2026 |
| 3 | Sane cadence | **pass**, two cabinet announcements a year plus copra/jute/sugarcane |
| 4 | Buildable v1 | **pass**, 504 rows, one machine-readable official file |
| 5 | Awesome-list fit | **pass**, no key needed anywhere in the chain |

## Verdict (06/10/2026): caution, pending Task 0.1 only

Build plan: `E:\OSC\DOCS\PLAN-msp-api.md`.
