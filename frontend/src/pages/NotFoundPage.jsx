import React from 'react';
import { Link } from 'react-router-dom';
import { IconWheat, IconArrowRight } from '../components/Icons';

export default function NotFoundPage() {
  return (
    <div className="animate-enter" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          marginBottom: '1.5rem',
          border: '1px solid var(--primary-border)'
        }}
      >
        <IconWheat size={32} />
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '0.75rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
        Route Not Found
      </h2>
      <p style={{ maxWidth: '480px', margin: '0 auto 2rem auto', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
        The documentation or explorer route you requested does not exist on this edge node. Use the navigation links below to explore active endpoints.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link
          to="/"
          className="copy-btn"
          style={{
            padding: '0.6rem 1.25rem',
            background: 'var(--primary)',
            borderColor: 'var(--primary-dark)',
            color: '#ffffff',
            fontSize: '0.875rem'
          }}
        >
          <span>Return Home</span>
          <IconArrowRight size={14} />
        </Link>
        <Link
          to="/docs"
          className="copy-btn"
          style={{
            padding: '0.6rem 1.25rem',
            fontSize: '0.875rem'
          }}
        >
          <span>View API Documentation</span>
        </Link>
      </div>
    </div>
  );
}
