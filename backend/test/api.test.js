"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { createApp } = require("../src/app");

let server;
let baseUrl;

test.before(async () => {
  const { app } = createApp({ rateLimit: false });
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

async function get(path) {
  const res = await fetch(`${baseUrl}${path}`);
  const json = await res.json();
  return { status: res.status, headers: res.headers, body: json };
}

test("CORS is enabled for all origins on API routes", async () => {
  const res = await get("/v1/msp/current");
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
});

test("GET / and /health return 200 with API discovery metadata", async () => {
  const resHealth = await get("/health");
  assert.equal(resHealth.status, 200);
  assert.equal(resHealth.body.success, true);
  assert.equal(resHealth.body.data.name, "Indian Minimum Support Price (MSP) & Crop Benchmark API");
  assert.ok(Array.isArray(resHealth.body.data.endpoints));
  assert.ok(resHealth.body.data.endpoints.includes("GET /v1/msp/current"));

  const resRoot = await get("/");
  assert.equal(resRoot.status, 200);
  assert.deepEqual(resRoot.body, resHealth.body);
});

test("GET /v1/freshness returns dataset timestamp and coverage", async () => {
  const res = await get("/v1/freshness");
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.version, "1.0.0");
  assert.equal(res.body.data.commodities_count, 28);
  assert.ok(res.body.data.records_count > 400);
  assert.equal(res.body.data.latest_year, 2026);
});

test("GET /v1/msp/current returns latest prices across all 28 commodities", async () => {
  const res = await get("/v1/msp/current");
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.meta.count, 28);
  assert.ok(Array.isArray(res.body.data));

  const wheat = res.body.data.find((c) => c.crop_slug === "wheat");
  assert.ok(wheat, "Wheat must exist in current list");
  assert.equal(wheat.fixed_price, 2610);
  assert.equal(wheat.season, "rabi");
  assert.equal(wheat.marketing_season, "RMS 2027-28");
  assert.ok(wheat.cost_a2_fl === 1264);
  assert.ok(wheat.margin_percent > 100);

  const paddy = res.body.data.find((c) => c.crop_slug === "paddy-common");
  assert.ok(paddy, "Paddy Common must exist in current list");
  assert.equal(paddy.fixed_price, 2441);
  assert.equal(paddy.season, "kharif");
  assert.equal(paddy.marketing_season, "KMS 2026-27");
});

test("GET /v1/msp/crops returns catalog and supports filtering", async () => {
  const resAll = await get("/v1/msp/crops");
  assert.equal(resAll.status, 200);
  assert.equal(resAll.body.meta.count, 28);

  const resCereals = await get("/v1/msp/crops?category=cereals");
  assert.equal(resCereals.status, 200);
  assert.ok(resCereals.body.data.length >= 7);
  assert.ok(resCereals.body.data.every((c) => c.category === "Cereals"));

  const resRabi = await get("/v1/msp/crops?season=rabi");
  assert.equal(resRabi.status, 200);
  assert.equal(resRabi.body.data.length, 6);
  assert.ok(resRabi.body.data.every((c) => c.season === "rabi"));
});

test("GET /v1/msp/crops/:slug returns full historical series", async () => {
  const res = await get("/v1/msp/crops/wheat");
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.crop_slug, "wheat");
  assert.ok(res.body.data.history.length >= 15);

  const year2010 = res.body.data.history.find((h) => h.crop_year === 2010);
  assert.ok(year2010);
  assert.equal(year2010.fixed_price, 1170);
  assert.equal(year2010.recommended_price, 1120);
  assert.equal(year2010.bonus_included, 50);

  const year2026 = res.body.data.history.find((h) => h.crop_year === 2026);
  assert.ok(year2026);
  assert.equal(year2026.fixed_price, 2610);
});

test("GET /v1/msp/crops/:slug returns 404 with valid slugs on unknown slug", async () => {
  const res = await get("/v1/msp/crops/fake-crop");
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.code, "NOT_FOUND");
  assert.ok(Array.isArray(res.body.error.valid_slugs));
  assert.ok(res.body.error.valid_slugs.includes("wheat"));
});

test("GET /v1/msp/seasons/:season filters correctly and validates input", async () => {
  const resKharif = await get("/v1/msp/seasons/kharif");
  assert.equal(resKharif.status, 200);
  assert.ok(resKharif.body.data.length >= 14);

  const resInvalid = await get("/v1/msp/seasons/winter");
  assert.equal(resInvalid.status, 400);
  assert.equal(resInvalid.body.success, false);
  assert.equal(resInvalid.body.error.code, "INVALID_SEASON");
});

test("GET /v1/msp/compare evaluates margin over cost correctly", async () => {
  const resWheat = await get("/v1/msp/compare?crop=wheat&year=2026");
  assert.equal(resWheat.status, 200);
  assert.equal(resWheat.body.success, true);
  assert.equal(resWheat.body.data.crop_slug, "wheat");
  assert.equal(resWheat.body.data.fixed_msp, 2610);
  assert.equal(resWheat.body.data.cost_of_production_a2_fl, 1264);
  assert.equal(resWheat.body.data.return_over_cost, 1346);
  assert.equal(resWheat.body.data.margin_percent, 106.49);
  assert.equal(resWheat.body.data.meets_50_percent_margin, true);
});

test("GET /v1/msp/compare requires 'crop' query parameter", async () => {
  const res = await get("/v1/msp/compare");
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.code, "MISSING_PARAM");
});

test("Unmatched route returns 404 with error envelope", async () => {
  const res = await get("/v1/random-route");
  assert.equal(res.status, 404);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.code, "NOT_FOUND");
});
