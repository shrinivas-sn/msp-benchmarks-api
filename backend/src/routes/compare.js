"use strict";

const express = require("express");

function createCompareRouter(mspService) {
  const router = express.Router();

  // GET /v1/msp/compare — Compare statutory MSP against Cost of Production (A2+FL)
  router.get("/msp/compare", (req, res) => {
    const { crop, year } = req.query;

    if (!crop || crop.trim() === "") {
      return res.status(400).json({
        success: false,
        error: {
          code: "MISSING_PARAM",
          message: "Query parameter 'crop' is required. Example: /v1/msp/compare?crop=wheat&year=2026"
        }
      });
    }

    const result = mspService.compareCost(crop, year);

    if (result.error) {
      const statusCode = result.error === "NOT_FOUND" ? 404 : result.error === "NO_DATA_FOR_YEAR" ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        error: {
          code: result.error,
          message: result.message
        }
      });
    }

    res.status(200).json({
      success: true,
      data: result,
      meta: {
        queried_crop: crop,
        queried_year: year || "latest_available",
        benchmark_standard: "CACP A2+FL Production Cost Formula (Union Budget 2018-19 Directive)",
        fetched_at: new Date().toISOString()
      }
    });
  });

  return router;
}

module.exports = { createCompareRouter };
