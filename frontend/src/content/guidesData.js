export const MSP_GUIDES = [
  {
    id: "how-indian-msp-is-calculated",
    title: "How Indian MSP is Calculated: The Swaminathan Commission A2+FL vs C2 Formula",
    summary: "Technical analysis of how CACP benchmarks Indian crop floor prices at 1.5x cost of production across A2, A2+FL, and C2 formula metrics.",
    readTime: "6 min read",
    category: "Policy & Economics",
    date: "October 2026",
    author: "Agricultural Economics Research Desk",
    keywords: [
      "how is msp calculated in india",
      "swaminathan commission msp formula",
      "cacp cost of production a2 fl c2",
      "minimum support price 1.5 times formula",
      "union budget 2018-19 msp policy"
    ],
    sections: [
      {
        heading: "The Statutory Mandate: The 1.5x Principle",
        content: "In the Union Budget 2018-19, the Government of India established the statutory principle that the Minimum Support Price (MSP) for all mandated kharif and rabi crops must be pegged at a minimum of 1.5 times (50% margin over) their weighted average cost of production.\n\nHowever, in agricultural policy and litigation, the core technical debate centers on which cost definition is used as the statutory base: A2, A2+FL, or C2."
      },
      {
        heading: "Deconstructing the Cost Concepts (A2, A2+FL, and C2)",
        content: "The Commission for Agricultural Costs & Prices (CACP) uses three distinct cost accounting metrics:\n\n• Cost A2: Covers all direct out-of-pocket expenses incurred by the farmer. This includes cash and in-kind expenses on seeds, fertilizers, pesticides, hired human labour, bullock and tractor power, irrigation charges, diesel/electricity, and depreciation on farm implements.\n\n• Cost A2+FL: Extends Cost A2 by adding an imputed economic value for Unpaid Family Labour (FL). The imputed value reflects the market wage rate for agricultural workers multiplied by the family person-hours invested in soil prep, planting, weeding, and harvesting.\n\n• Cost C2 (Comprehensive Cost): Represents the total economic cost. It builds upon A2+FL by incorporating the rental value of owned land (net of land revenue) plus interest on the value of owned fixed agricultural capital assets.\n\nThe official statutory benchmark guaranteed by CCEA is 1.5x of A2+FL, while farmer unions and the National Commission on Farmers (chaired by Prof. M.S. Swaminathan) advocated for 1.5x of C2."
      },
      {
        heading: "Real Case Study: RMS 2027-28 Wheat Benchmark",
        content: "For the Rabi Marketing Season (RMS 2027-28), announced via CCEA Notification PIB ID 2060855 on 30 September 2026:\n\n• Projected National A2+FL Cost: ₹1,264 per quintal\n• Statutory Floor Price Fixed: ₹2,610 per quintal\n• Absolute Net Return: ₹1,346 per quintal\n• Net Profit Margin over A2+FL: 106.49%\n\nBecause ₹2,610 exceeds ₹1,896 (which is 1.5 × ₹1,264), the statutory Swaminathan guarantee is satisfied with a 106.5% return margin."
      },
      {
        heading: "Querying Return Margins via API",
        content: "You can query statutory cost margins programmatically for any crop and crop year using the `/v1/msp/compare` endpoint:",
        code: `curl -s "https://msp-benchmarks-api.vercel.app/v1/msp/compare?crop=wheat&year=2026"`
      }
    ]
  },
  {
    id: "historical-msp-trends-analysis-2010-2026",
    title: "17-Year Historical MSP Trends (2010–2026): Growth Patterns in Cereals, Pulses & Oilseeds",
    summary: "Analysis of 17 years of statutory crop floor price revisions gazetted by CCEA, detailing compound annual growth rates across 28 commodities.",
    readTime: "7 min read",
    category: "Historical Timeseries",
    date: "October 2026",
    author: "Commodity Data Team",
    keywords: [
      "msp rate history 2010 to 2026",
      "historical wheat msp trends india",
      "paddy msp growth rate india",
      "ccea agricultural price history",
      "pulse oilseed msp compound growth"
    ],
    sections: [
      {
        heading: "Longitudinal Trajectory of Primary Commodities",
        content: "Across the 17-year continuous series (2010 to 2026/27) maintained in this registry, statutory crop prices reflect three distinct macro policy eras: the high-inflation adjustment period (2010–2013), the structural consolidation period (2014–2017), and the formulaic 1.5x statutory floor guarantee era (2018–2026)."
      },
      {
        heading: "Commodity Growth Comparisons (2010 vs 2026)",
        content: "• Wheat (Rabi Staple):\n  - 2010 Fixed MSP: ₹1,120 / quintal\n  - 2026 Fixed MSP: ₹2,610 / quintal\n  - Cumulative Absolute Increase: +₹1,490 (+133.0%)\n  - Compound Annual Growth Rate (CAGR): ~5.44%\n\n• Paddy Common (Kharif Staple):\n  - 2010 Fixed MSP: ₹1,000 / quintal\n  - 2026 Fixed MSP: ₹2,369 / quintal\n  - Cumulative Absolute Increase: +₹1,369 (+136.9%)\n  - CAGR: ~5.55%\n\n• Gram / Chana (Key Pulse Crop):\n  - 2010 Fixed MSP: ₹1,760 / quintal\n  - 2026 Fixed MSP: ₹5,650 / quintal\n  - Cumulative Absolute Increase: +₹3,890 (+221.0%)\n  - CAGR: ~7.56%\n\n• Rapeseed & Mustard (Key Oilseed):\n  - 2010 Fixed MSP: ₹1,850 / quintal\n  - 2026 Fixed MSP: ₹6,200 / quintal\n  - Cumulative Absolute Increase: +₹4,350 (+235.1%)\n  - CAGR: ~7.85%"
      },
      {
        heading: "Policy Pivot: Pulses and Oilseeds Incentivization",
        content: "The data demonstrates an intentional statutory shift toward domestic edible oil and protein self-sufficiency. Pulses (Gram, Tur, Lentil) and Oilseeds (Mustard, Groundnut, Soybean) have outpaced cereal MSP growth by over 200 basis points annually since 2016, driving increased acreage in arid and rain-fed farming regions."
      },
      {
        heading: "Fetching Historical Series via API",
        content: "To inspect the full 17-year historical trajectory of any commodity with CACP recommendations:",
        code: `const res = await fetch("https://msp-benchmarks-api.vercel.app/v1/msp/crops/wheat");
const { data } = await res.json();
console.log(\`\${data.crop_name} records: \${data.total_historical_years} years\`);
data.history.forEach(h => console.log(\`\${h.marketing_season}: ₹\${h.fixed_price}\`));`
      }
    ]
  },
  {
    id: "integrating-msp-benchmarks-api",
    title: "Integrating Indian MSP Benchmarks in Python, Node.js & AgTech Applications",
    summary: "Production guide on consuming the keyless India MSP REST API for commodity trading, farm accounting, credit underwriting, and procurement.",
    readTime: "5 min read",
    category: "Developer Integration",
    date: "October 2026",
    author: "Developer Relations & Platform Engineering",
    keywords: [
      "india msp api integration python nodejs",
      "free indian agricultural api",
      "crop floor price api client",
      "agtech mandi price integration",
      "rest api for indian agriculture"
    ],
    sections: [
      {
        heading: "Why AgTech Systems Need Programmatic MSP Data",
        content: "Statutory Minimum Support Prices function as the sovereign benchmark for agricultural valuations in India. AgTech platforms, agri-fintech lenders, warehouse receipt financers, and commodity hedging systems require reliable, machine-readable MSP rates for:\n\n1. Farm Credit Underwriting: Calculating expected farmer gross revenue based on cropped acreage and official statutory floor prices.\n2. Mandi Price Arbitration: Flagging when spot APMC mandi prices drop below statutory floors to trigger procurement alerts.\n3. Collateral Valuation: Estimating loan-to-value (LTV) ratios against stored agricultural commodities in accredited warehouses."
      },
      {
        heading: "Zero-Auth & CORS Architecture",
        content: "The API is hosted on Vercel Serverless Edge network. It is entirely open and keyless:\n\n• Base URL: https://msp-benchmarks-api.vercel.app\n• CORS: Access-Control-Allow-Origin: * sent on all endpoints\n• Rate Limits: 100 requests per 15-minute sliding window per IP\n• Cache Headers: RFC 7234 standard s-maxage=86400 (24-hour Edge CDN caching)"
      },
      {
        heading: "Python Integration Example",
        content: "A robust Python function utilizing requests and type hints to fetch current rates and find statutory floors by commodity:",
        code: `import requests
from typing import Dict, Any, Optional

BASE_URL = "https://msp-benchmarks-api.vercel.app"

def get_current_msp(crop_slug: Optional[str] = None) -> Dict[str, Any]:
    url = f"{BASE_URL}/v1/msp/current"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    data = response.json().get("data", [])
    
    if crop_slug:
        match = next((c for c in data if c["crop_slug"] == crop_slug), None)
        if not match:
            raise ValueError(f"Crop '{crop_slug}' not found in current gazette.")
        return match
    return data

# Example usage
wheat = get_current_msp("wheat")
print(f"Statutory MSP for {wheat['crop_name']}: ₹{wheat['fixed_price']}/qtl (Margin: {wheat['margin_percent']}%)")`
      },
      {
        heading: "Node.js / TypeScript Integration Example",
        content: "Using standard native fetch with error boundaries:",
        code: `async function fetchCropMargin(cropSlug, year = 2026) {
  const url = \`https://msp-benchmarks-api.vercel.app/v1/msp/compare?crop=\${cropSlug}&year=\${year}\`;
  const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
  
  if (!response.ok) {
    throw new Error(\`Failed to fetch margin: \${response.statusText}\`);
  }
  
  const { data } = await response.json();
  return {
    crop: data.crop_name,
    fixedPrice: data.fixed_price,
    costA2FL: data.cost_a2_fl,
    marginPct: data.margin_percent,
    guaranteeMet: data.statutory_floor_guarantee
  };
}`
      }
    ]
  }
];
