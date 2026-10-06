import React, { useState, useEffect } from 'react';
import commoditiesData from '../../../backend/data/commodities.json';

export default function PlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/v1/msp/current');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedSeason, setSelectedSeason] = useState('rabi');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [responseJson, setResponseJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const getComputedUrl = () => {
    if (selectedEndpoint === '/v1/msp/current') return '/v1/msp/current';
    if (selectedEndpoint === '/v1/msp/crops') return `/v1/msp/crops?season=${selectedSeason}`;
    if (selectedEndpoint === '/v1/msp/crops/:slug') return `/v1/msp/crops/${selectedCrop}`;
    if (selectedEndpoint === '/v1/msp/seasons/:season') return `/v1/msp/seasons/${selectedSeason}`;
    if (selectedEndpoint === '/v1/msp/compare') return `/v1/msp/compare?crop=${selectedCrop}&year=${selectedYear}`;
    if (selectedEndpoint === '/v1/freshness') return '/v1/freshness';
    return '/health';
  };

  const executeQuery = () => {
    setLoading(true);
    const url = getComputedUrl();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setResponseJson(data);
        setLoading(false);
      })
      .catch((err) => {
        setResponseJson({ success: false, error: { message: err.message } });
        setLoading(false);
      });
  };

  useEffect(() => {
    executeQuery();
  }, [selectedEndpoint, selectedCrop, selectedSeason, selectedYear]);

  const handleCopy = () => {
    if (!responseJson) return;
    navigator.clipboard?.writeText(JSON.stringify(responseJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Interactive API Playground
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Test API endpoints, explore historical timeseries, and simulate return-over-cost comparisons.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Control Box */}
        <div className="table-container" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Request Configuration
          </h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Select Endpoint
            </label>
            <select
              className="filter-select"
              style={{ width: '100%' }}
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              aria-label="Select endpoint"
            >
              <option value="/v1/msp/current">GET /v1/msp/current (All Active Rates)</option>
              <option value="/v1/msp/crops/:slug">GET /v1/msp/crops/:slug (Historical Timeseries)</option>
              <option value="/v1/msp/compare">GET /v1/msp/compare (Cost of Production & Margin)</option>
              <option value="/v1/msp/crops">GET /v1/msp/crops (Commodity Catalog)</option>
              <option value="/v1/msp/seasons/:season">GET /v1/msp/seasons/:season (Filter by Season)</option>
              <option value="/v1/freshness">GET /v1/freshness (Snapshot Freshness)</option>
            </select>
          </div>

          {(selectedEndpoint === '/v1/msp/crops/:slug' || selectedEndpoint === '/v1/msp/compare') && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Commodity
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                aria-label="Select commodity"
              >
                {commoditiesData.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.season})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedEndpoint === '/v1/msp/compare' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Crop Year
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                aria-label="Select crop year"
              >
                <option value="2026">2026 (RMS 2027-28 / KMS 2026-27 Gazetted)</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          )}

          {(selectedEndpoint === '/v1/msp/seasons/:season' || selectedEndpoint === '/v1/msp/crops') && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Season
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                aria-label="Select season"
              >
                <option value="kharif">Kharif Crops</option>
                <option value="rabi">Rabi Crops</option>
                <option value="commercial">Commercial Crops</option>
              </select>
            </div>
          )}

          <div style={{ background: 'var(--bg-canvas)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
            <strong>URL:</strong> {getComputedUrl()}
          </div>
        </div>

        {/* Output Box */}
        <div className="table-container" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              Live JSON Response
            </h3>
            <button className="copy-btn" onClick={handleCopy} disabled={!responseJson}>
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>

          <div className="code-block" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ color: 'var(--text-light)', padding: '1rem' }}>Loading response...</div>
            ) : responseJson ? (
              <pre>{JSON.stringify(responseJson, null, 2)}</pre>
            ) : (
              <div style={{ color: 'var(--text-light)', padding: '1rem' }}>No data fetched.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
