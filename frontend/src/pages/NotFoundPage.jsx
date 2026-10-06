import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Page Not Found
      </h2>
      <p style={{ maxWidth: '480px', margin: '0 auto 2rem auto', color: 'var(--text-muted)' }}>
        The documentation or explorer route you requested does not exist. If you are looking for API endpoints, explore the documentation below.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to="/" className="copy-btn" style={{ padding: '0.5rem 1.25rem' }}>
          Return Home
        </Link>
        <Link to="/docs" className="copy-btn" style={{ padding: '0.5rem 1.25rem', background: '#334155' }}>
          API Docs
        </Link>
      </div>
    </div>
  );
}
