import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { IconWheat } from './Icons';

export default function Navbar({ isOnline = true }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <IconWheat size={19} className="navbar-brand-icon" />
          <span>India MSP Benchmarks</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation">
          <ul className="navbar-nav">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Documentation
              </NavLink>
            </li>
            <li>
              <NavLink to="/playground" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Playground
              </NavLink>
            </li>
            <li>
              <NavLink to="/guides" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Guides
              </NavLink>
            </li>
            <li>
              <NavLink to="/status" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Status
              </NavLink>
            </li>
            <li>
              <div className="status-badge" title={isOnline ? "Vercel Edge API is fully operational" : "Checking API health..."}>
                <span className="dot" aria-hidden="true"></span>
                <span>{isOnline ? "API Online" : "Checking"}</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
