import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import commoditiesData from '../../../backend/data/commodities.json';

export default function HomePage() {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [copied, setCopied] = useState(false);

  const curlCommand = 'curl "https://msp-benchmarks-api.vercel.app/v1/msp/current"';

  const handleCopy = () => {
    navigator.clipboard?.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredCrops = commoditiesData.filter((crop) => {
    if (selectedSeason === 'all') return true;
    return crop.season.toLowerCase() === selectedSeason.toLowerCase();
  });

  return (
    <div>
      <section className="hero">
        <div className="badge-row">
          <span className="pill-badge">🌾 Official CACP Data</span>
          <span className="pill-badge">⚡ Zero Key / Open CORS</span>
          <span className="pill-badge">🏛️ CCEA Gazetted Rates</span>
        </div>
        <h1>
          Indian Minimum Support Price <span>(MSP)</span> Benchmark API
        </h1>
        <p>
          A free, keyless, zero-auth public REST service providing statutory agricultural floor prices,
          CACP recommendations, and production cost (A2+FL) guaranteed margins across 28 crops from 2010 to 2026/27.
        </p>

        <div className="curl-box">
          <code>{curlCommand}</code>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy cURL'}
          </button>
        </div>
      </section>

      {/* High level metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">Mandated Commodities</span>
          <span className="value">28</span>
          <span className="desc">Cereals, Pulses, Oilseeds & Commercial crops</span>
        </div>
        <div className="stat-card">
          <span className="label">Historical Timeseries</span>
          <span className="value">16 Years</span>
          <span className="desc">Continuous series from crop-year 2010 to 2026/27</span>
        </div>
        <div className="stat-card">
          <span className="label">Active Benchmarks</span>
          <span className="value">RMS 27-28 & KMS 26-27</span>
          <span className="desc">Approved by CCEA including A2+FL cost margins</span>
        </div>
        <div className="stat-card">
          <span className="label">Public Access</span>
          <span className="value">100% Free</span>
          <span className="desc">No API keys, no registration, unrestricted CORS</span>
        </div>
      </div>

      {/* Live Rates Overview */}
      <div className="table-container">
        <div className="table-header">
          <div>
            <h2>Current Mandated Floor Prices (MSP)</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Showing {filteredCrops.length} agricultural commodities
            </p>
          </div>
          <div>
            <select
              className="filter-select"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              aria-label="Filter crops by season"
            >
              <option value="all">All Seasons</option>
              <option value="kharif">Kharif Crops</option>
              <option value="rabi">Rabi Crops</option>
              <option value="commercial">Commercial Crops</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Crop Name</th>
                <th>Category</th>
                <th>Season</th>
                <th>Latest Marketing Season</th>
                <th>Latest MSP (₹/qtl)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrops.map((crop) => (
                <tr key={crop.slug}>
                  <td>
                    <strong>{crop.name}</strong>
                  </td>
                  <td>{crop.category}</td>
                  <td>
                    <span className={`tag tag-${crop.season}`}>
                      {crop.season.toUpperCase()}
                    </span>
                  </td>
                  <td>{crop.latest_marketing_season || '—'}</td>
                  <td>
                    <span className="price-val">
                      {crop.latest_msp ? `₹${crop.latest_msp.toLocaleString('en-IN')}` : '—'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/playground?crop=${crop.slug}`} style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      Inspect History →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explore banner */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Need detailed cost-of-production comparisons, formula breakdowns, or historical records?
        </p>
        <Link to="/docs" className="copy-btn" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
          Explore Full API Documentation
        </Link>
      </div>
    </div>
  );
}
