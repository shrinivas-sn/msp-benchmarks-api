import React from 'react';

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/v1/msp/current',
    title: 'Current Mandated MSP Across All Crops',
    description: 'Returns the active gazetted Minimum Support Price across all 28 commodities with year-over-year increase calculations, A2+FL cost benchmarks, and season tags.',
    query: [],
    example: 'curl "https://msp-benchmarks-api.vercel.app/v1/msp/current"',
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
    method: 'GET',
    path: '/v1/msp/crops',
    title: 'List All Commodities Catalog',
    description: 'Returns the complete master catalog of all 28 agricultural commodities with their crop categories, seasons, and available history counts.',
    query: [
      { name: 'category', type: 'string', desc: 'Filter by commodity group: cereals, pulses, oilseeds, or commercial' },
      { name: 'season', type: 'string', desc: 'Filter by crop season: kharif, rabi, or commercial' }
    ],
    example: 'curl "https://msp-benchmarks-api.vercel.app/v1/msp/crops?category=pulses"',
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
    method: 'GET',
    path: '/v1/msp/crops/:slug',
    title: 'Crop History & Parity Series',
    description: 'Retrieves the complete 16-year statutory price history (2010–2026/27) for a specific commodity, including CACP recommended prices, central bonuses, and variety notes.',
    query: [
      { name: 'slug', type: 'string (path)', required: true, desc: 'Crop identifier, e.g. wheat, paddy-common, gram, mustard' }
    ],
    example: 'curl "https://msp-benchmarks-api.vercel.app/v1/msp/crops/wheat"',
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
      },
      meta: { crop_slug: "wheat", history_count: 17 }
    }
  },
  {
    method: 'GET',
    path: '/v1/msp/compare',
    title: 'Cost of Production & Guaranteed Margin Evaluation',
    description: 'Evaluates the statutory floor price (MSP) against the CACP all-India weighted average Cost of Production (A2+FL) to benchmark return margins against the mandatory 50% policy threshold.',
    query: [
      { name: 'crop', type: 'string', required: true, desc: 'Target crop slug, e.g. wheat, paddy-common, bajra, gram' },
      { name: 'year', type: 'integer', desc: 'Crop year (e.g. 2026). Defaults to latest year with available cost data.' }
    ],
    example: 'curl "https://msp-benchmarks-api.vercel.app/v1/msp/compare?crop=wheat&year=2026"',
    response: {
      success: true,
      data: {
        crop_slug: "wheat",
        crop_name: "Wheat",
        crop_year: 2026,
        marketing_season: "RMS 2027-28",
        fixed_msp: 2610,
        cost_of_production_a2_fl: 1264,
        return_over_cost: 1346,
        margin_percent: 106.49,
        policy_formula: "MSP >= 1.5x All-India weighted average Cost of Production (A2+FL)",
        meets_50_percent_margin: true,
        unit: "INR per quintal"
      },
      meta: {
        queried_crop: "wheat",
        queried_year: "2026",
        benchmark_standard: "CACP A2+FL Production Cost Formula (Union Budget 2018-19 Directive)"
      }
    }
  },
  {
    method: 'GET',
    path: '/v1/msp/seasons/:season',
    title: 'Filter Crops by Season',
    description: 'Filters commodities and their latest MSP by agricultural season: kharif, rabi, or commercial.',
    query: [
      { name: 'season', type: 'string (path)', required: true, desc: 'kharif, rabi, or commercial' }
    ],
    example: 'curl "https://msp-benchmarks-api.vercel.app/v1/msp/seasons/rabi"',
    response: {
      success: true,
      data: [
        { slug: "wheat", name: "Wheat", latest_msp: 2610, season: "rabi" },
        { slug: "barley", name: "Barley", latest_msp: 2286, season: "rabi" },
        { slug: "gram", name: "Gram", latest_msp: 5958, season: "rabi" },
        { slug: "lentil-masur", name: "Lentil (Masur)", latest_msp: 7390, season: "rabi" },
        { slug: "rapeseed-mustard", name: "Rapeseed & Mustard", latest_msp: 6613, season: "rabi" },
        { slug: "safflower", name: "Safflower", latest_msp: 7215, season: "rabi" }
      ],
      meta: { season: "rabi", count: 6 }
    }
  },
  {
    method: 'GET',
    path: '/v1/freshness',
    title: 'Data Snapshot & Freshness Metadata',
    description: 'Returns snapshot timestamp, source gazette citations, versioning, and commodity record totals.',
    query: [],
    example: 'curl "https://msp-benchmarks-api.vercel.app/v1/freshness"',
    response: {
      success: true,
      data: {
        version: "1.0.0",
        commodities_count: 28,
        records_count: 476,
        start_year: 2010,
        latest_year: 2026,
        sources: {
          primary: "Commission for Agricultural Costs and Prices (CACP), Department of Agriculture and Farmers Welfare",
          secondary: "Cabinet Committee on Economic Affairs (CCEA), Press Information Bureau (PIB)"
        },
        last_snapshot: "2026-10-06T06:04:10Z"
      }
    }
  }
];

export default function DocsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          API Documentation & Reference
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Standard REST endpoints for retrieving statutory floor prices, CACP pricing histories, and agricultural cost benchmarks.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {ENDPOINTS.map((endpoint) => (
          <div key={endpoint.path} className="table-container" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="endpoint-badge" style={{ background: '#0f172a', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                {endpoint.method}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.125rem' }}>
                {endpoint.path}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0' }}>
              {endpoint.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {endpoint.description}
            </p>

            {endpoint.query.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  Parameters
                </h4>
                <ul style={{ listStyle: 'none', fontSize: '0.875rem' }}>
                  {endpoint.query.map((q) => (
                    <li key={q.name} style={{ marginBottom: '0.35rem' }}>
                      <code style={{ background: 'var(--bg-canvas)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 600 }}>
                        {q.name}
                      </code>{' '}
                      <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>({q.type})</span>
                      {q.required && <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.75rem', marginLeft: '0.3rem' }}>required</span>}
                      {' — '}{q.desc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                Example Request
              </h4>
              <div className="code-block" style={{ marginBottom: '1rem' }}>
                <code>{endpoint.example}</code>
              </div>

              <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                Response (JSON)
              </h4>
              <div className="code-block">
                <pre>{JSON.stringify(endpoint.response, null, 2)}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
