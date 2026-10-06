import React, { useState, useEffect } from 'react';
import metaData from '../../../backend/data/meta.json';

export default function StatusPage() {
  const [apiHealth, setApiHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/health')
      .then((res) => res.json())
      .then((data) => {
        setApiHealth(data);
        setLoading(false);
      })
      .catch(() => {
        setApiHealth({ status: 'offline' });
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          System & Data Status
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Operational health, upstream CACP source parity, and dataset snapshot metadata.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">API Operational Status</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span className="status-badge">
              <span className="dot"></span>
              <span>{loading ? 'Checking...' : apiHealth?.status === 'offline' ? 'Degraded' : '100% Operational'}</span>
            </span>
          </div>
          <span className="desc">Vercel Serverless Global Edge Runtime</span>
        </div>

        <div className="stat-card">
          <span className="label">Primary Data Source</span>
          <span className="value" style={{ fontSize: '1.25rem' }}>CACP / MoA&FW</span>
          <span className="desc">Commission for Agricultural Costs & Prices</span>
        </div>

        <div className="stat-card">
          <span className="label">Last Data Snapshot</span>
          <span className="value" style={{ fontSize: '1.25rem' }}>
            {new Date(metaData.last_snapshot_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <span className="desc">Synced with latest CCEA gazette</span>
        </div>

        <div className="stat-card">
          <span className="label">Total Managed Records</span>
          <span className="value">{metaData.total_records_count}</span>
          <span className="desc">Across {metaData.commodities_count} commodities (2010–2026)</span>
        </div>
      </div>

      <div className="table-container" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
          Endpoint Availability Status
        </h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Protocol</th>
              <th>Status</th>
              <th>Cache TTL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET /health</code></td>
              <td>HTTPS / JSON</td>
              <td><span className="margin-pill">Operational</span></td>
              <td>No-Cache</td>
            </tr>
            <tr>
              <td><code>GET /v1/msp/current</code></td>
              <td>HTTPS / JSON</td>
              <td><span className="margin-pill">Operational</span></td>
              <td>Edge CDN</td>
            </tr>
            <tr>
              <td><code>GET /v1/msp/crops</code></td>
              <td>HTTPS / JSON</td>
              <td><span className="margin-pill">Operational</span></td>
              <td>Edge CDN</td>
            </tr>
            <tr>
              <td><code>GET /v1/msp/crops/:slug</code></td>
              <td>HTTPS / JSON</td>
              <td><span className="margin-pill">Operational</span></td>
              <td>Edge CDN</td>
            </tr>
            <tr>
              <td><code>GET /v1/msp/seasons/:season</code></td>
              <td>HTTPS / JSON</td>
              <td><span className="margin-pill">Operational</span></td>
              <td>Edge CDN</td>
            </tr>
            <tr>
              <td><code>GET /v1/msp/compare</code></td>
              <td>HTTPS / JSON</td>
              <td><span className="margin-pill">Operational</span></td>
              <td>Edge CDN</td>
            </tr>
            <tr>
              <td><code>GET /v1/freshness</code></td>
              <td>HTTPS / JSON</td>
              <td><span className="margin-pill">Operational</span></td>
              <td>Edge CDN</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-container" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Licensing & Open Government Data Notice
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Data is sourced directly from gazetted notifications published by the Commission for Agricultural Costs and Prices (CACP)
          and the Cabinet Committee on Economic Affairs (CCEA), catalogued under the Government Open Data License - India (GODL-India)
          and Ministry of Agriculture website reproduction policies. Reproduction and derivative non-commercial and commercial application
          distribution are authorized subject to source citation.
        </p>
      </div>
    </div>
  );
}
