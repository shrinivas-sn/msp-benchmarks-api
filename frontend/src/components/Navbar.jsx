import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar({ isOnline = true }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/images/logo.svg" alt="India MSP Logo" />
          <span>India MSP Benchmarks</span>
        </Link>

        <nav>
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
              <NavLink to="/status" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Status
              </NavLink>
            </li>
            <li>
              <div className="status-badge" title={isOnline ? "API is operational" : "Checking API..."}>
                <span className="dot"></span>
                <span>{isOnline ? "API Online" : "Checking"}</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
