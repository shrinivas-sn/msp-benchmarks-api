"use strict";

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { MspService } = require("./services/msp-service");
const { createMspRouter } = require("./routes/msp");
const { createCompareRouter } = require("./routes/compare");

function createApp(options = {}) {
  const app = express();
  const mspService = options.mspService || new MspService(options);

  // Enable CORS for all origins (Public API Convention)
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "HEAD", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Accept"]
    })
  );

  // Rate Limiting (100 req / 15 mins default per CONVENTIONS.md)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: options.rateLimitMax || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Rate limit is 100 requests per 15 minutes."
      }
    }
  });

  if (options.rateLimit !== false) {
    app.use(limiter);
  }

  app.use(express.json());

  // Root route & Health check: API Discovery per CONVENTIONS.md
  const handleHealth = (req, res) => {
    const stats = mspService.getStats();
    res.status(200).json({
      success: true,
      data: {
        name: "Indian Minimum Support Price (MSP) & Crop Benchmark API",
        version: stats.version,
        description:
          "Free, keyless REST API for exploring statutory floor prices (MSP), CACP recommendations, and production cost (A2+FL) margins for 28 mandated Indian agricultural crops.",
        data_source: "https://cacp.da.gov.in",
        secondary_source: "https://pib.gov.in",
        coverage_years: `${stats.start_year} - ${stats.latest_year}`,
        commodities_count: stats.commodities_count,
        endpoints: [
          "GET /health",
          "GET /v1/freshness",
          "GET /v1/msp/current",
          "GET /v1/msp/crops",
          "GET /v1/msp/crops/:slug",
          "GET /v1/msp/seasons/:season",
          "GET /v1/msp/compare?crop=:slug&year=:year"
        ],
        rate_limit: "100 requests per 15 minutes per IP",
        status: "operational"
      }
    });
  };

  app.get("/", handleHealth);
  app.get("/health", handleHealth);

  // Mount API routes under /v1
  const mspRouter = createMspRouter(mspService);
  const compareRouter = createCompareRouter(mspService);

  app.use("/v1", mspRouter);
  app.use("/v1", compareRouter);

  // 404 handler for unmatched routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Route '${req.method} ${req.originalUrl}' not found. See GET /health for available endpoints.`
      }
    });
  });

  // Global error handler
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(err);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected internal server error occurred."
      }
    });
  });

  return { app, mspService };
}

module.exports = { createApp };
