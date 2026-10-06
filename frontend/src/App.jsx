import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DocsPage from './pages/DocsPage';
import PlaygroundPage from './pages/PlaygroundPage';
import StatusPage from './pages/StatusPage';
import NotFoundPage from './pages/NotFoundPage';

export function AppContent() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    fetch('/health')
      .then((res) => setIsOnline(res.ok))
      .catch(() => setIsOnline(false));
  }, []);

  return (
    <div className="app-container">
      <Navbar isOnline={isOnline} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
