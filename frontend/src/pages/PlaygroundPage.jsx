import React, { useState, useEffect, useMemo } from 'react';
import commoditiesData from '../../../backend/data/commodities.json';
import {
  IconPlay,
  IconCopy,
  IconCheck,
  IconTerminal,
  IconBolt,
  IconRefresh
} from '../components/Icons';

export default function PlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/v1/msp/current');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [selectedSeason, setSelectedSeason] = useState('rabi');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [activeCodeTab, setActiveCodeTab] = useState('curl');
  const [responseJson, setResponseJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState(null);
  const [httpStatus, setHttpStatus] = useState(200);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Read query params from URL if passed (e.g. from table link ?crop=wheat)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cropParam = params.get('crop');
      if (cropParam) {
        setSelectedCrop(cropParam);
        setSelectedEndpoint('/v1/msp/crops/:slug');
      }
    }
  }, []);

  const getComputedPath = () => {
    if (selectedEndpoint === '/v1/msp/current') return '/v1/msp/current';
    if (selectedEndpoint === '/v1/msp/crops') return `/v1/msp/crops?season=${selectedSeason}`;
    if (selectedEndpoint === '/v1/msp/crops/:slug') return `/v1/msp/crops/${selectedCrop}`;
    if (selectedEndpoint === '/v1/msp/seasons/:season') return `/v1/msp/seasons/${selectedSeason}`;
    if (selectedEndpoint === '/v1/msp/compare') return `/v1/msp/compare?crop=${selectedCrop}&year=${selectedYear}`;
    if (selectedEndpoint === '/v1/freshness') return '/v1/freshness';
    return '/health';
  };

  const fullUrl = `https://msp-benchmarks-api.vercel.app${getComputedPath()}`;

  const executeQuery = () => {
    setLoading(true);
    const start = performance.now();
    const path = getComputedPath();

    fetch(path)
      .then(async (res) => {
        const time = Math.round(performance.now() - start);
        setLatencyMs(time);
        setHttpStatus(res.status);
        const data = await res.json();
        setResponseJson(data);
        setLoading(false);
      })
      .catch((err) => {
        const time = Math.round(performance.now() - start);
        setLatencyMs(time);
        setHttpStatus(500);
        setResponseJson({
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: err.message || 'Network request failed'
          }
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    executeQuery();
  }, [selectedEndpoint, selectedCrop, selectedSeason, selectedYear]);

  const handleCopyResponse = () => {
    if (!responseJson) return;
    navigator.clipboard?.writeText(JSON.stringify(responseJson, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const getSnippet = () => {
    if (activeCodeTab === 'curl') {
      return `curl -s "${fullUrl}"`;
    }
    if (activeCodeTab === 'fetch') {
      return `const res = await fetch("${fullUrl}");\nconst data = await res.json();\nconsole.log(data);`;
    }
    if (activeCodeTab === 'python') {
      return `import requests\n\nres = requests.get("${fullUrl}")\ndata = res.json()\nprint(data)`;
    }
    return '';
  };

  const handleCopySnippet = () => {
    navigator.clipboard?.writeText(getSnippet());
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  // Syntax highlighting for JSON display
  const highlightedJson = useMemo(() => {
    if (!responseJson) return '';
    const str = JSON.stringify(responseJson, null, 2);
    // Escape HTML characters
    const escaped = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-num';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-str';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-bool';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }, [responseJson]);

  const responseSizeKb = useMemo(() => {
    if (!responseJson) return 0;
    return (JSON.stringify(responseJson).length / 1024).toFixed(1);
  }, [responseJson]);

  return (
    <div className="animate-enter">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Interactive API Playground
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Test Indian Minimum Support Price queries live, simulate statutory cost margins, and generate code snippets in real-time.
        </p>
      </div>

      {/* Preset Queries */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
          Quick Preset Queries:
        </span>
        <div className="presets-group">
          <button
            className="preset-chip"
            onClick={() => {
              setSelectedEndpoint('/v1/msp/current');
            }}
          >
            🌾 All Active Current Rates
          </button>
          <button
            className="preset-chip"
            onClick={() => {
              setSelectedCrop('wheat');
              setSelectedEndpoint('/v1/msp/crops/:slug');
            }}
          >
            🌾 Wheat 17-Year History
          </button>
          <button
            className="preset-chip"
            onClick={() => {
              setSelectedCrop('rapeseed-mustard');
              setSelectedYear('2026');
              setSelectedEndpoint('/v1/msp/compare');
            }}
          >
            📈 Mustard Margin (+106%)
          </button>
          <button
            className="preset-chip"
            onClick={() => {
              setSelectedCrop('paddy-common');
              setSelectedEndpoint('/v1/msp/crops/:slug');
            }}
          >
            🌿 Paddy (Common) KMS Series
          </button>
          <button
            className="preset-chip"
            onClick={() => {
              setSelectedSeason('kharif');
              setSelectedEndpoint('/v1/msp/seasons/:season');
            }}
          >
            ☀️ All Kharif Commodities
          </button>
          <button
            className="preset-chip"
            onClick={() => {
              setSelectedEndpoint('/v1/freshness');
            }}
          >
            ⚡ Dataset Freshness Snapshot
          </button>
        </div>
      </div>

      {/* Main Grid: Controls vs Output Console */}
      <div className="playground-grid">
        {/* Controls Column */}
        <div className="table-container" style={{ padding: '1.5rem', marginBottom: 0 }}>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconTerminal size={16} />
            <span>Request Builder</span>
          </h3>

          {/* Endpoint Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Target Endpoint
            </label>
            <select
              className="filter-select"
              style={{ width: '100%' }}
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              aria-label="Select API endpoint"
            >
              <option value="/v1/msp/current">GET /v1/msp/current (All Active Rates)</option>
              <option value="/v1/msp/crops/:slug">GET /v1/msp/crops/:slug (Historical Timeseries)</option>
              <option value="/v1/msp/compare">GET /v1/msp/compare (Cost & Return Margins)</option>
              <option value="/v1/msp/crops">GET /v1/msp/crops (Commodity Catalog)</option>
              <option value="/v1/msp/seasons/:season">GET /v1/msp/seasons/:season (Filter by Season)</option>
              <option value="/v1/freshness">GET /v1/freshness (Data Snapshot Metadata)</option>
              <option value="/health">GET /health (Discovery & System Health)</option>
            </select>
          </div>

          {/* Dynamic Crop Selector */}
          {(selectedEndpoint === '/v1/msp/crops/:slug' || selectedEndpoint === '/v1/msp/compare') && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Commodity Slug (:slug)
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
                    {c.name} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dynamic Season Selector */}
          {(selectedEndpoint === '/v1/msp/seasons/:season' || selectedEndpoint === '/v1/msp/crops') && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Season Parameter
              </label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                aria-label="Select agricultural season"
              >
                <option value="kharif">Kharif (Monsoon)</option>
                <option value="rabi">Rabi (Winter)</option>
                <option value="commercial">Commercial Crops</option>
              </select>
            </div>
          )}

          {/* Dynamic Year Selector */}
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
                <option value="2026">2026 (RMS 2027-28 & KMS 2026-27 - Latest Gazette)</option>
                <option value="2025">2025 (RMS 2026-27 & KMS 2025-26)</option>
                <option value="2024">2024 (Historical Series)</option>
                <option value="2020">2020 (Historical Series)</option>
              </select>
            </div>
          )}

          {/* Execute Button */}
          <button
            className="copy-btn"
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              justifyContent: 'center',
              background: 'var(--primary)',
              borderColor: 'var(--primary-dark)',
              color: '#ffffff',
              fontSize: '0.875rem'
            }}
            onClick={executeQuery}
            disabled={loading}
          >
            {loading ? <IconRefresh size={14} className="spin" /> : <IconPlay size={14} />}
            <span>{loading ? 'Executing Query...' : 'Send Live Request'}</span>
          </button>

          {/* Code Snippets Section */}
          <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                Code Integration:
              </span>
              <button
                className={`copy-btn ${copiedSnippet ? 'copied' : ''}`}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                onClick={handleCopySnippet}
                title="Copy code snippet"
              >
                {copiedSnippet ? <IconCheck size={12} /> : <IconCopy size={12} />}
                <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="season-tabs" style={{ marginBottom: '0.65rem' }}>
              <button
                className={`season-tab-btn ${activeCodeTab === 'curl' ? 'active' : ''}`}
                onClick={() => setActiveCodeTab('curl')}
              >
                cURL
              </button>
              <button
                className={`season-tab-btn ${activeCodeTab === 'fetch' ? 'active' : ''}`}
                onClick={() => setActiveCodeTab('fetch')}
              >
                Fetch
              </button>
              <button
                className={`season-tab-btn ${activeCodeTab === 'python' ? 'active' : ''}`}
                onClick={() => setActiveCodeTab('python')}
              >
                Python
              </button>
            </div>

            <pre
              style={{
                background: '#151816',
                color: '#e2e6e3',
                border: '1px solid #282f2a',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}
            >
              {getSnippet()}
            </pre>
          </div>
        </div>

        {/* Terminal Response Console */}
        <div className="terminal-console">
          <div className="terminal-header">
            <div className="terminal-meta">
              <span className={`http-badge ${httpStatus === 200 ? 'http-200' : 'http-error'}`}>
                {httpStatus} {httpStatus === 200 ? 'OK' : 'ERROR'}
              </span>
              {latencyMs != null && (
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  {latencyMs} ms
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                {responseSizeKb} KB
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className={`copy-btn ${copiedResponse ? 'copied' : ''}`}
                onClick={handleCopyResponse}
                title="Copy formatted JSON response"
              >
                {copiedResponse ? <IconCheck size={14} /> : <IconCopy size={14} />}
                <span>{copiedResponse ? 'Copied JSON' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          <div className="terminal-body">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <IconRefresh size={20} className="spin" style={{ display: 'inline-block', marginBottom: '0.5rem' }} />
                <div>Fetching statutory benchmark data...</div>
              </div>
            ) : (
              <pre
                style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}
                dangerouslySetInnerHTML={{ __html: highlightedJson }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
