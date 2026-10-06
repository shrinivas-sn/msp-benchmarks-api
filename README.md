# Indian Minimum Support Price (MSP) & Crop Benchmark API

A free, keyless, zero-auth public REST API serving the Government of India's official Minimum Support Prices (MSP), CACP recommendations, and statutory production cost benchmarks (A2+FL) for 28 mandated agricultural commodities across Kharif, Rabi, and Commercial crop seasons (2010–2026/27).

**Status: in-development**

## Overview

While wholesale market prices fluctuate daily across physical mandis (served by [`mandi-api`](https://github.com/shrinivas-sn/mandi-api)), farmers, agri-fintech lenders, crop insurance underwriters, and policy researchers require the statutory floor prices and cost-of-production guarantees established by the Commission for Agricultural Costs and Prices (CACP) and approved by the Cabinet Committee on Economic Affairs (CCEA).

This service bridges that gap with:
- Zero authentication, zero API keys, and open CORS.
- Official recommended vs fixed statutory prices from 2010 to 2026/27.
- Comprehensive cost of production (A2+FL) benchmarks and guaranteed margin evaluations.
- High-speed in-memory serverless execution on Vercel.

## Quick Start

```bash
# Clone and install dependencies
npm install

# Start local development server
npm start
```

## API Endpoints (v1)

- `GET /health` — Service health & API discovery.
- `GET /v1/freshness` — Dataset snapshot version, source URLs, and publication dates.
- `GET /v1/msp/current` — Current active MSP across all 28 commodities with YoY growth.
- `GET /v1/msp/crops` — List all commodities with season, category, and active price filters.
- `GET /v1/msp/crops/:slug` — Historical price series (2010–present), footnotes, and variety notes.
- `GET /v1/msp/seasons/:season` — Filter crops by season (`kharif`, `rabi`, `commercial`).
- `GET /v1/msp/compare?crop=wheat&year=2026` — Benchmark evaluation of MSP against cost of production (A2+FL).

## Data Sources & Legal Attribution

- **Primary Source:** Commission for Agricultural Costs and Prices (CACP), Department of Agriculture & Farmers Welfare (`https://cacp.da.gov.in`).
- **Gazette & Cost Benchmarks:** Cabinet Committee on Economic Affairs (CCEA) notifications via Press Information Bureau (`https://pib.gov.in`).
- **License:** Sourced from government gazettes and public-domain open notifications catalogued under Government Open Data License (GODL-India).
