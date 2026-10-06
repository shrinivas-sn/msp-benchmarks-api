import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>Indian Minimum Support Price (MSP) & Crop Benchmark API</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.8125rem' }}>
            Data sourced from CACP (Ministry of Agriculture) & CCEA Gazette Notifications. Free & Keyless.
          </p>
        </div>

        <div className="footer-links">
          <a href="https://cacp.da.gov.in" target="_blank" rel="noopener noreferrer">
            CACP Source
          </a>
          <a href="https://github.com/shrinivas-sn/msp-benchmarks-api" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://github.com/public-apis/public-apis" target="_blank" rel="noopener noreferrer">
            public-apis
          </a>
          <a href="/docs">
            API Reference
          </a>
        </div>
      </div>
    </footer>
  );
}
