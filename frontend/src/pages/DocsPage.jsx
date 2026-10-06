import React, { useState } from 'react';
import {
  IconCopy,
  IconCheck,
  IconTerminal,
  IconShieldCheck,
  IconBolt
} from '../components/Icons';

const ENDPOINTS = [
  {
    id: 'current',
    method: 'GET',
    path: '/v1/msp/current',
    title: 'Current Mandated MSP Across All Crops',
    description: 'Returns the active statutory Minimum Support Price across all 28 commodities with year-over-year price change calculations, CCEA A2+FL cost benchmarks, and season classifications.',
    params: [],
    example: 'curl -s "https://msp-benchmarks-api.vercel.app/v1/msp/current"',
    response: {
      success: true,
      data: [
        {
          crop_slug: "wheat",
          crop_name: "Wheat",
          category: "Cereals",
          season: "rabi",
          crop_year: 2026,
          marketing_season: "RMS 2027-28",
          fixed_price: 2610,
          previous_year_price: 2585,
          absolute_increase: 25,
          percentage_increase: 0.97,
          cost_a2_fl: 1264,
          margin_percent: 106.49,
          unit: "INR per quintal"
        }
      ],
      meta: {
        count: 28,
        description: "Latest statutory floor prices announced across all mandated commodities.",
        rate_limit: "100 requests per 15 minutes"
      }
    }
  },
  {
    id: 'crops',
    method: 'GET',
    path: '/v1/msp/crops',
    title: 'List All Commodities Catalog',
    description: 'Returns the complete master catalog of all 28 agricultural commodities with their crop groupings, seasons, and available history counts.',
    params: [
      { name: 'category', type: 'string', required: false, desc: 'Filter by group: cereals, pulses, oilseeds, commercial' },
      { name: 'season', type: 'string', required: false, desc: 'Filter by crop season: kharif, rabi, commercial' }
    ],
    example: 'curl -s "https://msp-benchmarks-api.vercel.app/v1/msp/crops?category=pulses"',
    response: {
      success: true,
      data: [
        {
          slug: "tur-arhar",
          name: "Tur (Arhar)",
          category: "Pulses",
          season: "kharif",
          latest_msp: 8450,
          latest_crop_year: 2026,
          latest_marketing_season: "KMS 2026-27",
          history_years_count: 17
        }
      ],
      meta: {
        count: 5,
        filters: { category: "pulses", season: "all" }
      }
    }
  },
  {
    id: 'crops-slug',
    method: 'GET',
    path: '/v1/msp/crops/:slug',
    title: 'Crop History & Parity Timeseries',
    description: 'Retrieves the complete 17-year statutory price history (2010–2026/27) for a specific commodity, including CACP recommended prices, central bonuses, and variety notes.',
    params: [
      { name: 'slug', type: 'string (path)', required: true, desc: 'Standardized commodity identifier (e.g. wheat, gram, mustard, paddy-common)' }
    ],
    example: 'curl -s "https://msp-benchmarks-api.vercel.app/v1/msp/crops/wheat"',
    response: {
      success: true,
      data: {
        crop_slug: "wheat",
        crop_name: "Wheat",
        category: "Cereals",
        season: "rabi",
        latest_msp: 2610,
        total_historical_years: 17,
        history: [
          {
            crop_year: 2026,
            marketing_season: "RMS 2027-28",
            fixed_price: 2610,
            recommended_price: 2610,
            cost_a2_fl: 1264,
            margin_percent: 106.49
          },
          {
            crop_year: 2025,
            marketing_season: "RMS 2026-27",
            fixed_price: 2585,
            recommended_price: 2585
          }
        ]
      }
    }
  },
  {
    id: 'seasons',
    method: 'GET',
    path: '/v1/msp/seasons/:season',
    title: 'Commodities by Agricultural Season',
    description: 'Filters statutory crop records by marketing season: kharif (monsoon), rabi (winter), or commercial crops.',
    params: [
      { name: 'season', type: 'string (path)', required: true, desc: 'Target agricultural season: kharif, rabi, or commercial' }
    ],
    example: 'curl -s "https://msp-benchmarks-api.vercel.app/v1/msp/seasons/rabi"',
    response: {
      success: true,
      data: [
        {
          slug: "wheat",
          name: "Wheat",
          category: "Cereals",
          latest_msp: 2610,
          latest_marketing_season: "RMS 2027-28"
        }
      ],
      meta: {
        season: "rabi",
        count: 7
      }
    }
  },
  {
    id: 'compare',
    method: 'GET',
    path: '/v1/msp/compare',
    title: 'Production Cost (A2+FL) & Margin Analysis',
    description: 'Calculates the statutory return-over-cost guaranteed margin based on official CCEA A2+FL cost projections.',
    params: [
      { name: 'crop', type: 'string (query)', required: true, desc: 'Commodity slug to analyze (e.g. wheat, rapeseed-mustard)' },
      { name: 'year', type: 'integer (query)', required: false, desc: 'Target crop year (defaults to active 2026 year)' }
    ],
    example: 'curl -s "https://msp-benchmarks-api.vercel.app/v1/msp/compare?crop=rapeseed-mustard&year=2026"',
    response: {
      success: true,
      data: {
        crop_slug: "rapeseed-mustard",
        crop_name: "Rapeseed & Mustard",
        crop_year: 2026,
        marketing_season: "RMS 2027-28",
        fixed_price: 6200,
        cost_a2_fl: 3008,
        absolute_margin: 3192,
        margin_percent: 106.12,
        statutory_floor_guarantee: "Swaminathan 1.5x Principle Met"
      }
    }
  },
  {
    id: 'freshness',
    method: 'GET',
    path: '/v1/freshness',
    title: 'Dataset Freshness & Upstream Sync',
    description: 'Returns the exact synchronization timestamp, CACP upstream source hash, and latest gazetted release version.',
    params: [],
    example: 'curl -s "https://msp-benchmarks-api.vercel.app/v1/freshness"',
    response: {
      success: true,
      data: {
        dataset_version: "2026.1.0",
        last_snapshot_at: "2026-10-06T00:00:00.000Z",
        upstream_source: "Commission for Agricultural Costs & Prices (CACP)",
        latest_ccea_decision: "RMS 2027-28 (CCEA PIB ID 2060855)",
        total_records: 476,
        total_commodities: 28
      }
    }
  },
  {
    id: 'health',
    method: 'GET',
    path: '/health',
    title: 'Service Health & API Discovery',
    description: 'Returns system operational status, runtime info, and API discovery links for automated crawlers and health checkers.',
    params: [],
    example: 'curl -s "https://msp-benchmarks-api.vercel.app/health"',
    response: {
      status: "ok",
      service: "msp-benchmarks-api",
      version: "1.0.0",
      timestamp: "2026-10-06T12:00:00.000Z",
      endpoints: {
        current: "/v1/msp/current",
        crops: "/v1/msp/crops",
        seasons: "/v1/msp/seasons/:season",
        compare: "/v1/msp/compare",
        freshness: "/v1/freshness"
      }
    }
  }
];

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-enter">
      {/* Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          API Documentation & Reference
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '720px' }}>
          Complete REST endpoint specifications, request parameters, rate limits, and JSON schemas for statutory Indian agricultural MSP data.
        </p>
      </div>

      {/* Conventions and Headers Callout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            <IconBolt size={16} />
            <span>Zero-Auth & Open CORS</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            No API keys, tokens, or registration required. Standard <code>Access-Control-Allow-Origin: *</code> headers are sent on every response.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            <IconShieldCheck size={16} />
            <span>Rate Limiting & Caching</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Standard limit is 100 requests per 15 minutes per IP. Static responses are served from global Vercel Edge Serverless cache.
          </p>
        </div>
      </div>

      {/* Main Layout: Sidebar Navigation + Content */}
      <div className="docs-grid">
        {/* Sticky Sidebar */}
        <nav className="docs-sidebar" aria-label="Documentation Endpoints">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-dim)', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Available Endpoints
          </div>
          {ENDPOINTS.map((ep) => (
            <a key={ep.id} href={`#${ep.id}`} className="docs-nav-link">
              <span className="tabular-nums" style={{ color: 'var(--primary)', fontWeight: 700, marginRight: '0.35rem' }}>GET</span>
              <span>{ep.path}</span>
            </a>
          ))}
        </nav>

        {/* Endpoints Content */}
        <div>
          {ENDPOINTS.map((ep) => (
            <section key={ep.id} id={ep.id} className="doc-block">
              <div className="endpoint-badge-row">
                <span className="method-tag">{ep.method}</span>
                <span className="endpoint-path">{ep.path}</span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 750, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {ep.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                {ep.description}
              </p>

              {/* Parameters Table if any */}
              {ep.params.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Request Parameters
                  </h4>
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <table className="data-table" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Type</th>
                          <th>Requirement</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ep.params.map((p) => (
                          <tr key={p.name}>
                            <td><code>{p.name}</code></td>
                            <td><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.type}</span></td>
                            <td>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: p.required ? '#dc2626' : 'var(--text-dim)' }}>
                                {p.required ? 'Required' : 'Optional'}
                              </span>
                            </td>
                            <td><span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{p.desc}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* cURL Example */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                    Example Request:
                  </span>
                  <button
                    className={`copy-btn ${copiedId === `req-${ep.id}` ? 'copied' : ''}`}
                    onClick={() => handleCopy(`req-${ep.id}`, ep.example)}
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                  >
                    {copiedId === `req-${ep.id}` ? <IconCheck size={12} /> : <IconCopy size={12} />}
                    <span>{copiedId === `req-${ep.id}` ? 'Copied' : 'Copy cURL'}</span>
                  </button>
                </div>
                <div className="curl-box" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    <span className="curl-prefix"><IconTerminal size={14} /></span>
                    <code>{ep.example}</code>
                  </div>
                </div>
              </div>

              {/* Sample Response */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                    Sample 200 OK Response Envelope:
                  </span>
                  <button
                    className={`copy-btn ${copiedId === `res-${ep.id}` ? 'copied' : ''}`}
                    onClick={() => handleCopy(`res-${ep.id}`, JSON.stringify(ep.response, null, 2))}
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem' }}
                  >
                    {copiedId === `res-${ep.id}` ? <IconCheck size={12} /> : <IconCopy size={12} />}
                    <span>{copiedId === `res-${ep.id}` ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre
                  style={{
                    background: '#151816',
                    color: '#e2e6e3',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-mono)',
                    overflowX: 'auto',
                    border: '1px solid #282f2a',
                    maxHeight: '340px'
                  }}
                >
                  {JSON.stringify(ep.response, null, 2)}
                </pre>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
