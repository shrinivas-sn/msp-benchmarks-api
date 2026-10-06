"use strict";

const { createApp } = require("./app");

const port = process.env.PORT || 3000;
const { app } = createApp();

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Indian MSP & Crop Benchmark API running on http://localhost:${port}`);
  });
}

module.exports = app;
