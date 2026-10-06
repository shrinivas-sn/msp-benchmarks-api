import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer, loadEnv } from 'vite';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectDir, 'dist');
const fileEnv = loadEnv('production', projectDir, '');
const productionHost = process.env.SITE_URL || fileEnv.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) || 'https://msp-benchmarks-api.vercel.app';
const siteUrl = new URL(productionHost);

const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
const vite = await createServer({ root: projectDir, server: { middlewareMode: true }, appType: 'custom', mode: 'production' });

try {
  const { AppContent } = await vite.ssrLoadModule('/src/App.jsx');

  const mainPages = [
    {
      route: '/',
      file: path.join(distDir, 'index.html'),
      title: 'India Minimum Support Price API — Free Crop MSP Benchmarks',
      description: 'Free keyless REST API for Indian Minimum Support Prices (MSP) and CACP cost of production benchmarks across 28 crops from 2010 to 2026/27.'
    },
    {
      route: '/docs',
      file: path.join(distDir, 'docs', 'index.html'),
      title: 'API Documentation & Endpoints — India MSP API',
      description: 'Complete REST endpoint specifications, request parameters, and response schemas for Indian agricultural MSP data.'
    },
    {
      route: '/playground',
      file: path.join(distDir, 'playground', 'index.html'),
      title: 'API Interactive Playground — India MSP API',
      description: 'Test Indian Minimum Support Price queries live in browser across crops, years, and CACP cost of production benchmarks.'
    },
    {
      route: '/status',
      file: path.join(distDir, 'status', 'index.html'),
      title: 'Service Status & Uptime — India MSP API',
      description: 'Operational uptime, upstream CACP source parity, and latest dataset snapshot synchronization metrics.'
    }
  ];

  for (const page of mainPages) {
    const body = renderToString(React.createElement(MemoryRouter, { initialEntries: [page.route] }, React.createElement(AppContent)));
    const canonical = new URL(page.route, siteUrl).href;
    const html = template
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeXml(page.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeXml(page.description)}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeXml(canonical)}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeXml(canonical)}" />`);

    await fs.mkdir(path.dirname(page.file), { recursive: true });
    await fs.writeFile(page.file, html);
  }

  // 404.html: Vercel serves it with status 404 for any path no file or rewrite matches.
  // noindex, no canonical, and kept out of mainPages so it never reaches the sitemap.
  const notFoundBody = renderToString(React.createElement(MemoryRouter, { initialEntries: ['/__not-found__'] }, React.createElement(AppContent)));
  const notFoundHtml = template
    .replace('<div id="root"></div>', `<div id="root">${notFoundBody}</div>`)
    .replace(/<title>[^<]*<\/title>/, '<title>Page Not Found — India MSP Benchmarks API</title>')
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, '<meta name="description" content="The requested documentation or explorer page does not exist." />')
    .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>/, '')
    .replace(/\s*<meta property="og:url" content="[^"]*"\s*\/?>/, '')
    .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>');
  await fs.writeFile(path.join(distDir, '404.html'), notFoundHtml);

  // Generate sitemap.xml with all canonical pages
  const sitemapEntries = mainPages.map((page) => {
    const loc = new URL(page.route, siteUrl).href;
    const priority = page.route === '/' ? '1.0' : '0.8';
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>2026-10-06</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }).join('\n');

  await fs.writeFile(
    path.join(distDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`
  );

  // Generate robots.txt
  await fs.writeFile(
    path.join(distDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl.href}sitemap.xml\n`
  );

  console.log(`[prerender] Rendered ${mainPages.length} static pages, 404.html, sitemap.xml & robots.txt.`);
} finally {
  await vite.close();
}
