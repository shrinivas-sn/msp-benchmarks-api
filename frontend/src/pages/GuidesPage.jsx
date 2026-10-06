import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MSP_GUIDES } from '../content/guidesData';
import { IconCopy, IconCheck, IconTerminal, IconShieldCheck, IconArrowRight, IconBolt } from '../components/Icons';

export default function GuidesPage() {
  const { id } = useParams();
  const matchedGuide = id ? MSP_GUIDES.find((g) => g.id === id) : null;
  const [selectedGuideState, setSelectedGuideState] = useState(MSP_GUIDES[0]);
  const selectedGuide = matchedGuide || selectedGuideState;
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);

  const filteredGuides = MSP_GUIDES.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopy = (snippetId, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedSnippetId(snippetId);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="animate-enter" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          Technical Guides & Economic Analysis
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '780px' }}>
          Authoritative analysis of Indian Minimum Support Price calculation methodologies, statutory Swaminathan cost formulas (A2+FL vs C2), and developer integration patterns.
        </p>
      </div>

      {/* Main Grid: Directory Sidebar + Article Reader */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Navigation Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="search-input-wrapper">
            <input
              type="search"
              className="search-input"
              style={{ paddingLeft: '0.85rem' }}
              placeholder="Search guides & keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search guides"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filteredGuides.map((guide) => {
              const isSelected = selectedGuide?.id === guide.id;
              return (
                <Link
                  key={guide.id}
                  to={`/guides/${guide.id}`}
                  onClick={() => setSelectedGuideState(guide)}
                  style={{
                    display: 'block',
                    padding: '0.9rem 1rem',
                    borderRadius: '6px',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--bg-card)' : 'var(--bg-card-subtle)',
                    transition: 'border-color var(--duration-fast) ease, background-color var(--duration-fast) ease',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <span className="tag tag-rabi" style={{ fontSize: '0.65rem' }}>{guide.category}</span>
                    <span>{guide.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: isSelected ? 700 : 600, margin: 0, lineHeight: 1.4, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                    {guide.title}
                  </h3>
                </Link>
              );
            })}
          </div>

          <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              <IconShieldCheck size={14} className="text-primary" />
              <span>Statutory Data Integrity</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              All benchmarks verified against primary CCEA Cabinet releases and CACP Price Policy reports (2010–2026/27).
            </p>
          </div>
        </aside>

        {/* Article Reader */}
        {selectedGuide && (
          <article
            className="table-container"
            style={{
              padding: '1.75rem 2rem',
              marginBottom: 0
            }}
          >
            {/* Metadata Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              <span className="tag tag-kharif">{selectedGuide.category}</span>
              <span>• {selectedGuide.readTime}</span>
              <span>• Published {selectedGuide.date}</span>
              <span>• By {selectedGuide.author}</span>
            </div>

            {/* Headline */}
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              {selectedGuide.title}
            </h2>

            {/* Summary Block */}
            <div
              style={{
                fontSize: '0.9375rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '1.75rem',
                borderLeft: '3px solid var(--primary)',
                paddingLeft: '1rem',
                background: 'var(--bg-card-subtle)',
                padding: '0.75rem 1rem',
                borderRadius: '0 6px 6px 0'
              }}
            >
              {selectedGuide.summary}
            </div>

            {/* Content Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {selectedGuide.sections.map((sec, idx) => (
                <section key={idx}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 750, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {sec.heading}
                  </h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                    {sec.content}
                  </div>
                  {sec.code && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.35rem' }}>
                        <button
                          className={`copy-btn ${copiedSnippetId === `sec-${idx}` ? 'copied' : ''}`}
                          style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                          onClick={() => handleCopy(`sec-${idx}`, sec.code)}
                        >
                          {copiedSnippetId === `sec-${idx}` ? <IconCheck size={12} /> : <IconCopy size={12} />}
                          <span>{copiedSnippetId === `sec-${idx}` ? 'Copied' : 'Copy Code'}</span>
                        </button>
                      </div>
                      <pre
                        style={{
                          background: '#151816',
                          color: '#e2e6e3',
                          border: '1px solid #282f2a',
                          padding: '0.85rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-mono)',
                          overflowX: 'auto',
                          lineHeight: 1.5
                        }}
                      >
                        <code>{sec.code}</code>
                      </pre>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Interactive Footer Call to Action */}
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  Test these benchmarks live
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Simulate statutory return margins and inspect timeseries payloads in real-time.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to="/playground"
                  className="copy-btn"
                  style={{
                    background: 'var(--primary)',
                    borderColor: 'var(--primary-dark)',
                    color: '#ffffff',
                    padding: '0.45rem 0.9rem'
                  }}
                >
                  <IconTerminal size={14} />
                  <span>Open Playground</span>
                </Link>
                <Link
                  to="/docs"
                  className="copy-btn"
                  style={{
                    padding: '0.45rem 0.9rem'
                  }}
                >
                  <span>REST Endpoints</span>
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
