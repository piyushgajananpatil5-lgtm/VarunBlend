# VARUN-Blend (SIH26081)
## Hybrid AI–NWP Multi-Model Adaptive Forecast Blending System

> **Smart India Hackathon (SIH26081) — Operational Meteorological Solution**  
> *Developed for India Meteorological Department (IMD) / Ministry of Earth Sciences (MoES)*

---

### 1. Architectural Highlights: MERN-Compatible & Vercel-Ready

- **MERN-compatible runtime**: React/Vite is the client, Express is available through `server/index.ts`, MongoDB persistence uses Mongoose, and the existing Vercel functions remain the serverless deployment adapter.
- **Optional MongoDB**: Live forecasts work without a database. Setting `MONGODB_URI` enables forecast snapshots and pipeline-run history in MongoDB Atlas.
- **Vercel Serverless Functions (`/api/*`)**: Every route is an isolated, stateless Vercel Serverless Function under `/api/`:
  - `GET /api/health` — Edge health probe
  - `GET /api/forecast/subdivisions` — Edge-cached 36 IMD subdivision geometries & centroids
  - `POST /api/forecast/blend` — Real-world Open-Meteo multi-model ingestion, dynamic inverse-variance / Bayesian blending, debiasing, and uncertainty quantification
  - `GET /api/forecast/verification` — Multi-season statistical verification benchmarks (CSI, RMSE, ROC)
  - `POST /api/pipeline/run` — 00Z/12Z operational batch pipeline execution simulator
  - `POST /api/bulletin/ai-brief` — Gemini free-tier synoptic bulletin synthesizer with instant rule-based fallback
- **100% Free APIs Only**:
  - **Open-Meteo API** (`https://open-meteo.com`): Requires **NO API key**, no credit card, and provides free multi-model access to **ECMWF IFS 0.25°**, **NOAA GFS**, and **DWD ICON**.
  - **Gemini Free-Tier API** (`gemini-2.5-flash`): Optional. Obtained freely at [Google AI Studio](https://aistudio.google.com/). If omitted or rate-limited, the system seamlessly falls back to the deterministic IMD Synoptic Rule Engine with 0% downtime.

---

### 2. One-Click Vercel Deployment Instructions

You can deploy this repository to Vercel with **zero extra configuration**:

#### Option A: Using the Vercel CLI
```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Login to your free Vercel account
vercel login

# 3. Deploy instantly from project root
vercel deploy

# 4. For production deployment
vercel --prod
```

#### Option B: Using GitHub + Vercel Dashboard
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Git Repository**.
3. Vercel automatically detects the Vite framework and configures:
   - **Framework Preset**: `Vite`
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
4. *(Optional)* Add `GEMINI_API_KEY` under **Environment Variables** if you want live Gemini AI bulletins (leave empty for automatic rule-based fallback).
5. Click **Deploy**. Your app is live with global CDN edge caching!

#### Local MERN mode
```bash
npm install
npm run build
npm run server:dev
```

The Express server runs at `http://localhost:4000`. Set `MONGODB_URI` in a local `.env` file to enable `/api/snapshots` and `/api/pipeline/runs`. The weather dashboard continues to use the free Open-Meteo API and its resilient fallback when MongoDB is unavailable.

---

### 3. Required Environment Variables

| Variable Name | Required? | Where to Obtain (100% Free) | Purpose |
| :--- | :---: | :--- | :--- |
| `GEMINI_API_KEY` | **Optional** | [Google AI Studio](https://aistudio.google.com/) (Free tier, no card required) | AI Chief Meteorologist Diagnostic Bulletin. If absent, the app automatically switches to the offline IMD Operational Rule Engine. |
| `VERCEL_URL` | *Automatic* | Injected by Vercel platform | Base URL routing |
| `MONGODB_URI` | Optional | MongoDB Atlas free cluster | Persists forecast snapshots and pipeline history in local Express mode |

---

### 4. Scientific Accuracy & Latency Tradeoffs

#### (a) Perceived Sub-Second Latency Strategy
- **Vercel Edge Caching**: Subdivisions and static benchmarks are cached via `Cache-Control: s-maxage=604800, stale-while-revalidate=2592000`.
- **NWP Forecast Edge Cache**: Each subdivision's multi-model blend is cached for 1 hour (`s-maxage=3600`), matching the physical update frequency of NWP runs (00Z/06Z/12Z/18Z).
- **Parallel Promise Execution**: All model streams and historical observation arrays are fetched concurrently using `Promise.all`.
- **Optimistic UI with Climatology Seeding**: The dashboard renders instantly on first paint without blocking the DOM on network round-trips.

#### (b) Maximizing Scientific Accuracy (No Fake Forecasts)
- **Error Decorrelation ($r \approx 0.42$)**: Physical NWP models (ECMWF, GFS, ICON) solve atmospheric Navier-Stokes thermodynamics, while AI models (GraphCast, Pangu-Weather, FourCastNet) optimize spatial tensor representations. Because their error structures are mathematically orthogonal, blending them cancels phase displacement errors.
- **Rolling Observational Debiasing**: Uses Open-Meteo's `past_days=3` observations to compute empirical model bias:
  $$\text{Bias}_m = \frac{1}{N}\sum_{t=-3}^{-1} (F_m^{(t)} - Obs^{(t)})$$
  Raw forecasts are debiased prior to weight allocation:
  $$F_m^{corr} = \max\left(0, \; F_m^{raw} - 0.75 \cdot \text{Bias}_m\right)$$
- **Uncertainty Bounds**: Rather than presenting an unrealistic single deterministic number, VARUN-Blend provides:
  - 10th to 90th percentile Confidence Intervals ($90\%\text{ CI}$)
  - Ensemble standard deviation spread ($\pm \sigma$)
  - Exceedance probabilities for IMD threshold criteria (>20mm, >64.5mm, >115.5mm, >204.5mm).

---

### 5. Local Development

For live Gemini bulletins locally, copy `.env.example` to `.env` and set `GEMINI_API_KEY` using a key from [Google AI Studio](https://aistudio.google.com/). Keep it server-side: do not name it `VITE_GEMINI_API_KEY`. Open-Meteo needs no key; MongoDB is optional and only needed for persistence.

```bash
# Install dependencies
npm install

# Run Vite development server on port 3000
npm run dev

# Lint code for TypeScript errors
npm run lint

# Build production bundle
npm run build
```

### 6. GitHub and Vercel Deployment

From the project root:

```bash
git init
git add .
git commit -m "Modernize VARUN-Blend with MERN-compatible runtime"
git branch -M main
git remote add origin https://github.com/piyushgajananpatil5-lgtm/VarunBlend.git
git push -u origin main
```

If `origin` already exists, use `git remote set-url origin https://github.com/piyushgajananpatil5-lgtm/VarunBlend.git` before pushing. In Vercel, import the GitHub repository, keep the Vite preset, use `npm run build` as the build command, `dist` as the output directory, and add `GEMINI_API_KEY` only if AI bulletins are desired. `MONGODB_URI` is only needed when deploying the separate Express server; Vercel's serverless forecast path does not require it.
