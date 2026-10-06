"use strict";

const fs = require("node:fs");
const path = require("node:path");

class MspService {
  constructor(options = {}) {
    const dataDir = options.dataDir || path.resolve(__dirname, "../../data");
    this.records = options.records || JSON.parse(fs.readFileSync(path.join(dataDir, "msp_records.json"), "utf8"));
    this.commodities = options.commodities || JSON.parse(fs.readFileSync(path.join(dataDir, "commodities.json"), "utf8"));
    this.meta = options.meta || JSON.parse(fs.readFileSync(path.join(dataDir, "meta.json"), "utf8"));
  }

  getStats() {
    return {
      version: this.meta.version,
      commodities_count: this.commodities.length,
      records_count: this.records.length,
      start_year: this.meta.coverage_start_year,
      latest_year: this.meta.coverage_end_year,
      sources: {
        primary: this.meta.source_primary,
        secondary: this.meta.source_secondary
      },
      last_snapshot: this.meta.last_snapshot_at
    };
  }

  getCurrentMsp() {
    const currentList = [];

    for (const comm of this.commodities) {
      // Find all records for this crop with valid fixed_price
      const cropRecords = this.records
        .filter((r) => r.crop_slug === comm.slug && r.fixed_price !== null)
        .sort((a, b) => b.crop_year - a.crop_year);

      if (cropRecords.length === 0) continue;

      const latest = cropRecords[0];
      const previous = cropRecords.length > 1 ? cropRecords[1] : null;

      let absoluteChange = null;
      let percentChange = null;

      if (previous && previous.fixed_price) {
        absoluteChange = Math.round((latest.fixed_price - previous.fixed_price) * 100) / 100;
        percentChange = Math.round(((latest.fixed_price - previous.fixed_price) / previous.fixed_price) * 10000) / 100;
      }

      currentList.push({
        crop_slug: latest.crop_slug,
        crop_name: latest.crop_name,
        category: latest.category,
        season: latest.season,
        crop_year: latest.crop_year,
        marketing_season: latest.marketing_season,
        fixed_price: latest.fixed_price,
        recommended_price: latest.recommended_price,
        unit: latest.unit,
        previous_year_price: previous ? previous.fixed_price : null,
        absolute_increase: absoluteChange,
        percentage_increase: percentChange,
        cost_a2_fl: latest.cost_a2_fl,
        margin_percent: latest.margin_percent,
        notes: latest.notes
      });
    }

    return currentList.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.crop_name.localeCompare(b.crop_name);
    });
  }

  getAllCrops(filters = {}) {
    let result = [...this.commodities];

    if (filters.category) {
      const catLower = filters.category.trim().toLowerCase();
      result = result.filter((c) => c.category.toLowerCase().includes(catLower));
    }

    if (filters.season) {
      const seasonLower = filters.season.trim().toLowerCase();
      result = result.filter((c) => c.season.toLowerCase() === seasonLower);
    }

    return result;
  }

  getCropBySlug(slug) {
    if (!slug) return null;
    const cleanSlug = slug.trim().toLowerCase();
    const commodity = this.commodities.find((c) => c.slug === cleanSlug);
    if (!commodity) return null;

    const history = this.records
      .filter((r) => r.crop_slug === cleanSlug)
      .sort((a, b) => b.crop_year - a.crop_year);

    return {
      crop_slug: commodity.slug,
      crop_name: commodity.name,
      category: commodity.category,
      season: commodity.season,
      latest_msp: commodity.latest_msp,
      latest_crop_year: commodity.latest_crop_year,
      latest_marketing_season: commodity.latest_marketing_season,
      total_historical_years: history.length,
      history: history
    };
  }

  getBySeason(season) {
    if (!season) return null;
    const seasonLower = season.trim().toLowerCase();
    const validSeasons = ["kharif", "rabi", "commercial"];
    if (!validSeasons.includes(seasonLower)) return null;

    const seasonCrops = this.commodities.filter((c) => c.season.toLowerCase() === seasonLower);
    return seasonCrops;
  }

  compareCost(cropSlug, targetYear = null) {
    if (!cropSlug) return { error: "MISSING_PARAM", message: "Query parameter 'crop' is required." };
    const cleanSlug = cropSlug.trim().toLowerCase();
    const commodity = this.commodities.find((c) => c.slug === cleanSlug);
    if (!commodity) {
      return {
        error: "NOT_FOUND",
        message: `Unknown crop slug '${cropSlug}'. Valid slugs: ${this.commodities.map((c) => c.slug).join(", ")}`
      };
    }

    const cropRecords = this.records.filter((r) => r.crop_slug === cleanSlug && r.fixed_price !== null);

    let record = null;
    if (targetYear) {
      const y = parseInt(targetYear, 10);
      record = cropRecords.find((r) => r.crop_year === y);
    } else {
      // Default to latest record with cost data, or latest available
      record = cropRecords.find((r) => r.cost_a2_fl !== null) || cropRecords[0];
    }

    if (!record) {
      return {
        error: "NO_DATA_FOR_YEAR",
        message: `No MSP record found for ${commodity.name} in year ${targetYear}.`
      };
    }

    const hasCost = record.cost_a2_fl !== null && record.cost_a2_fl > 0;
    let absoluteMargin = null;
    let computedMarginPercent = null;
    let fulfillsFormula = null;

    if (hasCost) {
      absoluteMargin = Math.round((record.fixed_price - record.cost_a2_fl) * 100) / 100;
      computedMarginPercent = Math.round(((record.fixed_price - record.cost_a2_fl) / record.cost_a2_fl) * 10000) / 100;
      fulfillsFormula = computedMarginPercent >= 50.0;
    }

    return {
      crop_slug: commodity.slug,
      crop_name: commodity.name,
      category: commodity.category,
      season: commodity.season,
      crop_year: record.crop_year,
      marketing_season: record.marketing_season,
      fixed_msp: record.fixed_price,
      cost_of_production_a2_fl: record.cost_a2_fl,
      cost_data_status: hasCost ? "gazetted" : "not_available_for_year",
      return_over_cost: absoluteMargin,
      margin_percent: record.margin_percent !== null ? record.margin_percent : computedMarginPercent,
      policy_formula: "MSP >= 1.5x All-India weighted average Cost of Production (A2+FL)",
      meets_50_percent_margin: fulfillsFormula,
      unit: "INR per quintal"
    };
  }
}

module.exports = { MspService };
