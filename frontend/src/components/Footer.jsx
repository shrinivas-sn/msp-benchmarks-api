import React from 'react';
import { Link } from 'react-router-dom';
import { IconExternal, IconShieldCheck } from './Icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
            <IconShieldCheck size={16} className="text-primary" />
            <span>Indian Minimum Support Price (MSP) & Crop Benchmark API</span>
          </div>
          <p style={{ marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Official statutory prices gazetted by CCEA & compiled by Commission for Agricultural Costs & Prices (CACP). Free, keyless public infrastructure.
          </p>
        </div>

        <nav aria-label="Footer Links" className="footer-links">
          <a href="https://cacp.da.gov.in" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>CACP Portal</span>
            <IconExternal size={12} />
          </a>
          <a href="https://github.com/shrinivas-sn/msp-benchmarks-api" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>GitHub Repository</span>
            <IconExternal size={12} />
          </a>
          <a href="https://github.com/public-apis/public-apis" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>public-apis Directory</span>
            <IconExternal size={12} />
          </a>
          <Link to="/docs">
            API Reference
          </Link>
        </nav>
      </div>
    </footer>
  );
}
