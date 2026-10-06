"use strict";

const express = require("express");

function createMspRouter(mspService) {
  const router = express.Router();

  // GET /v1/msp/current — Current active MSP across all commodities
  router.get("/msp/current", (req, res) => {
    const data = mspService.getCurrentMsp();
    res.status(200).json({
      success: true,
      data: data,
      meta: {
        count: data.length,
        description: "Latest statutory floor prices announced across all mandated commodities.",
        rate_limit: "100 requests per 15 minutes",
        fetched_at: new Date().toISOString()
      }
    });
  });

  // GET /v1/msp/crops — All commodities with optional category & season filters
  router.get("/msp/crops", (req, res) => {
    const { category, season } = req.query;
    const data = mspService.getAllCrops({ category, season });
    res.status(200).json({
      success: true,
      data: data,
      meta: {
        count: data.length,
        filters: {
          category: category || "all",
          season: season || "all"
        },
        fetched_at: new Date().toISOString()
      }
    });
  });

  // GET /v1/msp/crops/:slug — Full historical price series for a single crop
  router.get("/msp/crops/:slug", (req, res) => {
    const { slug } = req.params;
    const data = mspService.getCropBySlug(slug);

    if (!data) {
      const validSlugs = mspService.commodities.map((c) => c.slug);
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Unknown crop slug '${slug}'.`,
          valid_slugs: validSlugs
        }
      });
    }

    res.status(200).json({
      success: true,
      data: data,
      meta: {
        crop_slug: data.crop_slug,
        history_count: data.history.length,
        fetched_at: new Date().toISOString()
      }
    });
  });

  // GET /v1/msp/seasons/:season — Crops filtered by season (kharif, rabi, commercial)
  router.get("/msp/seasons/:season", (req, res) => {
    const { season } = req.params;
    const data = mspService.getBySeason(season);

    if (!data) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_SEASON",
          message: `Invalid season '${season}'. Valid values are 'kharif', 'rabi', or 'commercial'.`
        }
      });
    }

    res.status(200).json({
      success: true,
      data: data,
      meta: {
        season: season.toLowerCase(),
        count: data.length,
        fetched_at: new Date().toISOString()
      }
    });
  });

  // GET /v1/freshness — Data snapshot & metadata
  router.get("/freshness", (req, res) => {
    const stats = mspService.getStats();
    res.status(200).json({
      success: true,
      data: stats,
      meta: {
        checked_at: new Date().toISOString()
      }
    });
  });

  return router;
}

module.exports = { createMspRouter };
