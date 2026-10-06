"use strict";

const fs = require("node:fs");
const path = require("node:path");

const rawFile = path.resolve(__dirname, "../data/raw-cacp.json");
const outputDir = path.resolve(__dirname, "../data");

if (!fs.existsSync(rawFile)) {
  console.error("Raw CACP file not found at " + rawFile);
  process.exit(1);
}

const rawRecords = JSON.parse(fs.readFileSync(rawFile, "utf8"));

const COMMODITY_MAP = {
  "Paddy Common": { slug: "paddy-common", name: "Paddy (Common)", category: "Cereals", season: "kharif" },
  "Paddy(F)/Grade A": { slug: "paddy-grade-a", name: "Paddy (Grade A)", category: "Cereals", season: "kharif" },
  "Jowar-Hybrid": { slug: "jowar-hybrid", name: "Jowar (Hybrid)", category: "Cereals", season: "kharif" },
  "Jowar-Maldandi": { slug: "jowar-maldandi", name: "Jowar (Maldandi)", category: "Cereals", season: "kharif" },
  "Bajra": { slug: "bajra", name: "Bajra", category: "Cereals", season: "kharif" },
  "Maize": { slug: "maize", name: "Maize", category: "Cereals", season: "kharif" },
  "Ragi": { slug: "ragi", name: "Ragi", category: "Cereals", season: "kharif" },
  "Tur (Arhar)": { slug: "tur-arhar", name: "Tur (Arhar)", category: "Pulses", season: "kharif" },
  "Moong": { slug: "moong", name: "Moong", category: "Pulses", season: "kharif" },
  "Urad": { slug: "urad", name: "Urad", category: "Pulses", season: "kharif" },
  "Groundnut": { slug: "groundnut", name: "Groundnut", category: "Oilseeds", season: "kharif" },
  "Sunflower Seed": { slug: "sunflower-seed", name: "Sunflower Seed", category: "Oilseeds", season: "kharif" },
  "Soyabean Black": { slug: "soyabean-black", name: "Soyabean (Black)", category: "Oilseeds", season: "kharif" },
  "Soyabean Yellow": { slug: "soyabean-yellow", name: "Soyabean (Yellow)", category: "Oilseeds", season: "kharif" },
  "Sesamum": { slug: "sesamum", name: "Sesamum", category: "Oilseeds", season: "kharif" },
  "Nigerseed": { slug: "nigerseed", name: "Nigerseed", category: "Oilseeds", season: "kharif" },
  "Medium Staple Cotton": { slug: "cotton-medium-staple", name: "Cotton (Medium Staple)", category: "Commercial Crops", season: "kharif" },
  "Long Staple Cotton": { slug: "cotton-long-staple", name: "Cotton (Long Staple)", category: "Commercial Crops", season: "kharif" },
  "Wheat": { slug: "wheat", name: "Wheat", category: "Cereals", season: "rabi" },
  "Barley": { slug: "barley", name: "Barley", category: "Cereals", season: "rabi" },
  "Gram": { slug: "gram", name: "Gram", category: "Pulses", season: "rabi" },
  "Lentil (Masur)": { slug: "lentil-masur", name: "Lentil (Masur)", category: "Pulses", season: "rabi" },
  "Rapeseed/ Mustard": { slug: "rapeseed-mustard", name: "Rapeseed & Mustard", category: "Oilseeds", season: "rabi" },
  "Safflower": { slug: "safflower", name: "Safflower", category: "Oilseeds", season: "rabi" },
  "Copra (Milling)": { slug: "copra-milling", name: "Copra (Milling)", category: "Commercial Crops", season: "commercial" },
  "Copra (Ball)": { slug: "copra-ball", name: "Copra (Ball)", category: "Commercial Crops", season: "commercial" },
  "Jute": { slug: "jute", name: "Jute", category: "Commercial Crops", season: "commercial" },
  "Sugarcane": { slug: "sugarcane", name: "Sugarcane (FRP)", category: "Commercial Crops", season: "commercial" }
};

// CCEA Gazetted Cost of Production (A2+FL) & Margin Data for 2026 crop year
const COST_BENCHMARKS_2026 = {
  // Rabi Marketing Season 2027-28 (Crop Year 2026)
  "wheat": { cost_a2_fl: 1264, margin_percent: 106.49 },
  "barley": { cost_a2_fl: 1447, margin_percent: 57.98 },
  "gram": { cost_a2_fl: 3751, margin_percent: 58.84 },
  "lentil-masur": { cost_a2_fl: 3854, margin_percent: 91.75 },
  "rapeseed-mustard": { cost_a2_fl: 3367, margin_percent: 96.41 },
  "safflower": { cost_a2_fl: 4810, margin_percent: 50.00 },
  // Kharif Marketing Season 2026-27 (Crop Year 2026)
  "paddy-common": { cost_a2_fl: 1627, margin_percent: 50.03 },
  "paddy-grade-a": { cost_a2_fl: 1627, margin_percent: 51.26 },
  "jowar-hybrid": { cost_a2_fl: 2247, margin_percent: 50.02 },
  "jowar-maldandi": { cost_a2_fl: 2247, margin_percent: 52.25 },
  "bajra": { cost_a2_fl: 1551, margin_percent: 86.98 },
  "ragi": { cost_a2_fl: 2860, margin_percent: 50.00 },
  "maize": { cost_a2_fl: 1607, margin_percent: 49.97 },
  "tur-arhar": { cost_a2_fl: 5633, margin_percent: 50.01 },
  "moong": { cost_a2_fl: 5853, margin_percent: 50.01 },
  "urad": { cost_a2_fl: 4933, margin_percent: 50.01 },
  "groundnut": { cost_a2_fl: 4522, margin_percent: 50.00 },
  "sunflower-seed": { cost_a2_fl: 4853, margin_percent: 50.01 },
  "soyabean-yellow": { cost_a2_fl: 3261, margin_percent: 50.02 },
  "sesamum": { cost_a2_fl: 6178, margin_percent: 50.00 },
  "nigerseed": { cost_a2_fl: 5811, margin_percent: 50.01 },
  "cotton-medium-staple": { cost_a2_fl: 4747, margin_percent: 50.01 },
  "cotton-long-staple": { cost_a2_fl: 4747, margin_percent: 58.44 },
  "jute": { cost_a2_fl: 3244, margin_percent: 64.46 }
};

// Known historical bonus inclusions per CACP footnotes
function getBonusForRecord(slug, year) {
  if (year === 2010 && slug === "wheat") return 50;
  if ((year === 2010 || year === 2011) && ["tur-arhar", "moong", "urad"].includes(slug)) return 500;
  if (year === 2015 && ["gram", "lentil-masur"].includes(slug)) return 75;
  if (year === 2015 && ["tur-arhar", "moong", "urad"].includes(slug)) return 200;
  if (year === 2016 && ["tur-arhar", "moong", "urad"].includes(slug)) return 425;
  if (year === 2016 && ["gram", "sesamum"].includes(slug)) return 200;
  if (year === 2016 && ["groundnut", "sunflower-seed", "soyabean-yellow", "nigerseed", "rapeseed-mustard", "safflower"].includes(slug)) return 100;
  if (year === 2017 && ["gram", "lentil-masur"].includes(slug)) return 150;
  if (year === 2017 && ["tur-arhar", "moong", "urad", "soyabean-yellow", "groundnut"].includes(slug)) return 200;
  if (year === 2017 && ["sunflower-seed", "sesamum", "nigerseed", "rapeseed-mustard", "safflower"].includes(slug)) return 100;
  return null;
}

function parsePrice(value) {
  if (!value || value === "-" || value.trim() === "") return null;
  const num = parseFloat(value.trim());
  return isNaN(num) ? null : num;
}

function getMarketingSeason(cropYear, season) {
  if (season === "rabi") {
    return `RMS ${cropYear + 1}-${String(cropYear + 2).slice(2)}`;
  }
  return `KMS ${cropYear}-${String(cropYear + 1).slice(2)}`;
}

// Transform raw records
const records = [];
const commoditiesCatalog = {};

for (const raw of rawRecords) {
  const meta = COMMODITY_MAP[raw.commodityname];
  if (!meta) {
    console.warn(`Unmapped commodity: ${raw.commodityname}`);
    continue;
  }

  const cropYear = parseInt(raw.financialyear, 10);
  const fixedPrice = parsePrice(raw.fixed_price);
  const recoPrice = parsePrice(raw.reco_price);

  // Skip 2027 placeholders with no announced price
  if (cropYear === 2027 && fixedPrice === null && recoPrice === null) {
    continue;
  }

  // Populate catalog
  if (!commoditiesCatalog[meta.slug]) {
    commoditiesCatalog[meta.slug] = {
      slug: meta.slug,
      name: meta.name,
      category: meta.category,
      season: meta.season,
      raw_name: raw.commodityname
    };
  }

  const bonus = getBonusForRecord(meta.slug, cropYear);
  const costBenchmark = (cropYear === 2026 && COST_BENCHMARKS_2026[meta.slug]) ? COST_BENCHMARKS_2026[meta.slug] : null;

  const record = {
    crop_slug: meta.slug,
    crop_name: meta.name,
    category: meta.category,
    season: meta.season,
    crop_year: cropYear,
    marketing_season: getMarketingSeason(cropYear, meta.season),
    fixed_price: fixedPrice,
    recommended_price: recoPrice,
    unit: "INR per quintal",
    cost_a2_fl: costBenchmark ? costBenchmark.cost_a2_fl : null,
    margin_percent: costBenchmark ? costBenchmark.margin_percent : null,
    bonus_included: bonus,
    notes: null
  };

  if (meta.slug === "sugarcane") {
    record.notes = "Fair and Remunerative Price (FRP) linked to basic sugar recovery rate (10.25% from 2022-23 onwards).";
  } else if (meta.slug === "jute" && cropYear >= 2015) {
    record.notes = "MSP corresponds to TDN3 variety (equivalent of erstwhile TD5).";
  } else if (bonus) {
    record.notes = `Includes announced central bonus of Rs. ${bonus} per quintal.`;
  }

  records.push(record);
}

// Sort chronologically and by category/slug
records.sort((a, b) => {
  if (a.crop_year !== b.crop_year) return b.crop_year - a.crop_year;
  if (a.category !== b.category) return a.category.localeCompare(b.category);
  return a.crop_slug.localeCompare(b.crop_slug);
});

// Update catalog with latest price and coverage
const commoditiesList = Object.values(commoditiesCatalog).map(comm => {
  const cropRecords = records.filter(r => r.crop_slug === comm.slug && r.fixed_price !== null);
  const latestRecord = cropRecords.length > 0 ? cropRecords[0] : null;
  return {
    ...comm,
    latest_msp: latestRecord ? latestRecord.fixed_price : null,
    latest_crop_year: latestRecord ? latestRecord.crop_year : null,
    latest_marketing_season: latestRecord ? latestRecord.marketing_season : null,
    history_years_count: cropRecords.length
  };
}).sort((a, b) => a.name.localeCompare(b.name));

const metadata = {
  version: "1.0.0",
  dataset_title: "Indian Minimum Support Prices (MSP) & Cost of Production Benchmarks",
  source_primary: "Commission for Agricultural Costs and Prices (CACP), Department of Agriculture and Farmers Welfare",
  source_primary_url: "https://cacp.da.gov.in/Home/msp",
  source_secondary: "Cabinet Committee on Economic Affairs (CCEA), Press Information Bureau (PIB)",
  source_secondary_url: "https://pib.gov.in",
  license: "Government Open Data License - India (GODL-India) & Department of Agriculture Terms of Use",
  last_snapshot_at: "2026-10-06T06:04:10Z",
  coverage_start_year: 2010,
  coverage_end_year: 2026,
  commodities_count: commoditiesList.length,
  total_records_count: records.length,
  mandated_categories: ["Cereals", "Pulses", "Oilseeds", "Commercial Crops"]
};

// Write output files
fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, "msp_records.json"), JSON.stringify(records, null, 2), "utf8");
fs.writeFileSync(path.join(outputDir, "commodities.json"), JSON.stringify(commoditiesList, null, 2), "utf8");
fs.writeFileSync(path.join(outputDir, "meta.json"), JSON.stringify(metadata, null, 2), "utf8");

console.log(`Normalized ${records.length} records across ${commoditiesList.length} commodities.`);
console.log(`Saved datasets to ${outputDir}`);
