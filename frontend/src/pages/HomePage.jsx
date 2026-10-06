import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import commoditiesData from '../../../backend/data/commodities.json';
import mspRecords from '../../../backend/data/msp_records.json';
import {
  IconWheat,
  IconShieldCheck,
  IconBolt,
  IconCopy,
  IconCheck,
  IconSearch,
  IconArrowRight,
  IconTerminal
} from '../components/Icons';

export default function HomePage() {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCodeTab, setActiveCodeTab] = useState('curl');
  const [copied, setCopied] = useState(false);

  // Build a lookup map of latest crop-year record for each commodity
  const latestRecordsMap = useMemo(() => {
    const map = new Map();
    // Sort mspRecords descending by crop_year
    const sorted = [...mspRecords].sort((a, b) => b.crop_year - a.crop_year);
    for (const record of sorted) {
      if (!map.has(record.crop_slug)) {
        map.set(record.crop_slug, record);
      }
    }
    return map;
  }, []);

  const snippets = {
    curl: 'curl "https://msp-benchmarks-api.vercel.app/v1/msp/current"',
    fetch: 'const res = await fetch("https://msp-benchmarks-api.vercel.app/v1/msp/current");\nconst data = await res.json();',
    python: 'import requests\nres = requests.get("https://msp-benchmarks-api.vercel.app/v1/msp/current").json()'
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(snippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const seasonCounts = useMemo(() => {
    const counts = { all: commoditiesData.length, kharif: 0, rabi: 0, commercial: 0 };
    for (const crop of commoditiesData) {
      const s = crop.season?.toLowerCase();
      if (counts[s] !== undefined) counts[s]++;
    }
    return counts;
  }, []);

  const filteredCrops = useMemo(() => {
    return commoditiesData.filter((crop) => {
      const matchesSeason = selectedSeason === 'all' || crop.season?.toLowerCase() === selectedSeason.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        crop.name?.toLowerCase().includes(q) ||
        crop.category?.toLowerCase().includes(q) ||
        crop.slug?.toLowerCase().includes(q);
      return matchesSeason && matchesSearch;
    });
  }, [selectedSeason, searchQuery]);

  return (
    <div className="animate-enter">
      {/* Editorial Hero */}
      <section className="hero">
        <div className="hero-kicker">
          <span>Official Gazette Data</span>
          <span className="kicker-sep">•</span>
          <span>Ministry of Agriculture &amp; Farmers Welfare</span>
          <span className="kicker-sep">•</span>
          <span>Keyless Edge API</span>
        </div>

        <h1>
          Indian Minimum Support Price (MSP) Benchmark API
        </h1>
        <p>
          A high-availability, zero-auth public REST service providing statutory agricultural floor prices,
          CACP recommendations, and production cost (A2+FL) guaranteed return margins from 2010 through 2026/27.
        </p>

        {/* Tabbed Interactive Code Terminal */}
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
          <div className="code-tab-header" style={{ borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
            <button
              className={`code-tab-btn ${activeCodeTab === 'curl' ? 'active' : ''}`}
              onClick={() => setActiveCodeTab('curl')}
            >
              cURL
            </button>
            <button
              className={`code-tab-btn ${activeCodeTab === 'fetch' ? 'active' : ''}`}
              onClick={() => setActiveCodeTab('fetch')}
            >
              JavaScript (Fetch)
            </button>
            <button
              className={`code-tab-btn ${activeCodeTab === 'python' ? 'active' : ''}`}
              onClick={() => setActiveCodeTab('python')}
            >
              Python
            </button>
          </div>
          <div className="curl-box" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
              <span className="curl-prefix">
                <IconTerminal size={14} />
              </span>
              <code>{snippets[activeCodeTab]}</code>
            </div>
            <button
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              aria-label="Copy code snippet to clipboard"
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* High-level Economic & System Metrics */}
      <div className="stats-grid">
        <div className="stat-card delay-1 animate-enter">
          <span className="label">Mandated Commodities</span>
          <span className="value tabular-nums">28</span>
          <span className="desc">Cereals, Pulses, Oilseeds & Commercial staples</span>
        </div>
        <div className="stat-card delay-2 animate-enter">
          <span className="label">Historical Timeseries</span>
          <span className="value tabular-nums">17 Years</span>
          <span className="desc">Continuous series from crop-year 2010 to 2026/27</span>
        </div>
        <div className="stat-card delay-3 animate-enter">
          <span className="label">Active Benchmarks</span>
          <span className="value" style={{ fontSize: '1.4rem' }}>RMS 27-28 & KMS 26-27</span>
          <span className="desc">Approved by CCEA including statutory A2+FL cost margins</span>
        </div>
        <div className="stat-card delay-4 animate-enter">
          <span className="label">Public Access Architecture</span>
          <span className="value" style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>100% Free / Keyless</span>
          <span className="desc">Zero API keys, unrestricted CORS, 100 req/15m limit</span>
        </div>
      </div>

      {/* Live Mandated Rates Table */}
      <div className="table-container">
        <div className="table-header">
          <div>
            <h2>Mandated Agricultural Floor Prices (MSP)</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Showing {filteredCrops.length} of {commoditiesData.length} statutory commodities with CCEA cost benchmarks
            </p>
          </div>

          <div className="table-toolbar">
            {/* Live Search Input */}
            <div className="search-input-wrapper">
              <span className="search-icon">
                <IconSearch size={14} />
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Search crop or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search crop or category"
              />
            </div>

            {/* Season Filter Pills */}
            <div className="season-tabs" role="tablist" aria-label="Filter crops by agricultural season">
              <button
                className={`season-tab-btn ${selectedSeason === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedSeason('all')}
                role="tab"
                aria-selected={selectedSeason === 'all'}
              >
                All ({seasonCounts.all})
              </button>
              <button
                className={`season-tab-btn ${selectedSeason === 'kharif' ? 'active' : ''}`}
                onClick={() => setSelectedSeason('kharif')}
                role="tab"
                aria-selected={selectedSeason === 'kharif'}
              >
                Kharif ({seasonCounts.kharif})
              </button>
              <button
                className={`season-tab-btn ${selectedSeason === 'rabi' ? 'active' : ''}`}
                onClick={() => setSelectedSeason('rabi')}
                role="tab"
                aria-selected={selectedSeason === 'rabi'}
              >
                Rabi ({seasonCounts.rabi})
              </button>
              <button
                className={`season-tab-btn ${selectedSeason === 'commercial' ? 'active' : ''}`}
                onClick={() => setSelectedSeason('commercial')}
                role="tab"
                aria-selected={selectedSeason === 'commercial'}
              >
                Commercial ({seasonCounts.commercial})
              </button>
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Commodity Name</th>
                <th>Category</th>
                <th>Season</th>
                <th>Marketing Season</th>
                <th>Latest MSP (₹/qtl)</th>
                <th>Cost (A2+FL) & Margin</th>
                <th>Explorer</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrops.map((crop) => {
                const latestRecord = latestRecordsMap.get(crop.slug);
                const hasCost = latestRecord?.cost_a2_fl != null;
                const margin = latestRecord?.margin_percent;

                return (
                  <tr key={crop.slug}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{crop.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {crop.slug}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{crop.category}</span>
                    </td>
                    <td>
                      <span className={`tag tag-${crop.season}`}>
                        {crop.season?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {crop.latest_marketing_season || '—'}
                    </td>
                    <td>
                      <span className="price-val">
                        {crop.latest_msp ? `₹${crop.latest_msp.toLocaleString('en-IN')}` : '—'}
                      </span>
                    </td>
                    <td>
                      {hasCost ? (
                        <div className="margin-container">
                          <div className="margin-info">
                            <span style={{ color: 'var(--text-muted)' }}>Cost: ₹{latestRecord.cost_a2_fl.toLocaleString('en-IN')}</span>
                            <span className="margin-pill">+{margin?.toFixed(1)}%</span>
                          </div>
                          <div className="margin-bar-bg" title={`${margin?.toFixed(1)}% return over A2+FL production cost`}>
                            <div
                              className="margin-bar-fill"
                              style={{ width: `${Math.min(Math.max((margin || 50) * 0.75, 20), 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Pending CCEA Gazette</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/playground?crop=${crop.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--primary)'
                        }}
                      >
                        <span>Inspect</span>
                        <IconArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredCrops.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    No commodities match your filter query "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Docs Bridge Banner */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Build with Verified Agricultural Economic Benchmarks
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 1.5rem auto', fontSize: '0.9375rem' }}>
          Integrate 17 years of statutory floor prices, CACP recommended levels, and official cost-of-production metrics into your agritech dashboards, research tools, and commodity procurement pipelines.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/docs"
            className="copy-btn"
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.85rem',
              background: 'var(--primary)',
              borderColor: 'var(--primary-dark)',
              color: '#ffffff'
            }}
          >
            Explore API Documentation
          </Link>
          <Link
            to="/playground"
            className="copy-btn"
            style={{
              padding: '0.6rem 1.25rem',
              fontSize: '0.85rem'
            }}
          >
            Launch Interactive Playground
          </Link>
        </div>
      </div>
    </div>
  );
}
