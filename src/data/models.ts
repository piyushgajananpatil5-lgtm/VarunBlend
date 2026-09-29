import type { ModelMeta } from '../types/weather.ts';

export const FORECAST_MODELS: ModelMeta[] = [
  {
    id: 'ecmwf',
    name: 'ECMWF IFS',
    provider: 'European Centre for Medium-Range Weather Forecasts',
    type: 'NWP_PHYSICAL',
    resolution: '9 km (HRES) / 51-member ensemble',
    updateCycle: '00Z, 12Z (6-8h latency)',
    color: '#3b82f6', // blue
    description: 'Gold standard global numerical weather prediction model based on primitive hydrostatic atmospheric equations with 4D-Var data assimilation.',
    strengths: [
      'Superb large-scale synoptic flow representation',
      'Consistent mid-latitude and tropical wave dynamics',
      'Lowest root-mean-square geopotential error beyond Day 4'
    ],
    weaknesses: [
      'Subgrid orographic rainfall underestimation along Western Ghats',
      'Computationally heavy (requires multi-petaflop supercomputers)'
    ]
  },
  {
    id: 'gfs',
    name: 'NOAA GFS',
    provider: 'National Oceanic and Atmospheric Administration (NCEP)',
    type: 'NWP_PHYSICAL',
    resolution: '13 km FV3 Dynamical Core',
    updateCycle: '00Z, 06Z, 12Z, 18Z (4-5h latency)',
    color: '#06b6d4', // cyan
    description: 'Open-access global spectral finite-volume model with GSI hybrid 4D-EnVar assimilation, run four times daily.',
    strengths: [
      'Rapid dissemination and high update cadence (4x daily)',
      'Aggressive convective parameterization capturing early thunderstorm cues',
      'Good boundary layer representation over continental Indo-Gangetic plains'
    ],
    weaknesses: [
      'Occasional wet bias over peninsula and over-intensification of monsoon lows',
      'Phase error in rapid subtropical jet shifts'
    ]
  },
  {
    id: 'ncum',
    name: 'IMD-NCMRWF NCUM',
    provider: 'National Centre for Medium Range Weather Forecasting (India)',
    type: 'REGIONAL_NWP',
    resolution: '12 km Subcontinent-tuned Unified Model',
    updateCycle: '00Z, 12Z (5h latency)',
    color: '#10b981', // emerald
    description: 'Subcontinent-specialized NWP system customized by NCMRWF/IMD with direct Indian Doppler radar and INSAT-3D/3DR satellite radiance assimilation.',
    strengths: [
      'Optimized Indian land-surface schemes (soil moisture and Himalayan topography)',
      'Direct assimilation of Indian coastal radars and AWS mesonets',
      'High skill for Monsoon Trough positioning and onset dates'
    ],
    weaknesses: [
      'Limited global domain feedback compared to full global ensembles',
      'Can lag in fast mid-latitude westerly wave interactions'
    ]
  },
  {
    id: 'graphcast',
    name: 'DeepMind GraphCast',
    provider: 'Google DeepMind',
    type: 'AI_DATA_DRIVEN',
    resolution: '0.25° (~28 km) on icosahedral multi-mesh',
    updateCycle: 'Sub-minute inference once initial conditions ingested',
    color: '#8b5cf6', // violet
    description: 'Autoregressive graph neural network using encoder-process-decoder message passing on a multi-mesh sphere, trained on 40 years of ERA5 reanalysis.',
    strengths: [
      'Superior 500hPa geopotential & temperature skill on Day 1 to Day 5',
      'Unmatched cyclone track prediction accuracy (20-30% tighter track error)',
      'Blazing fast inference (<60 seconds per 10-day global trajectory)'
    ],
    weaknesses: [
      'Smoothing effect on localized flash flood / localized extreme precip bursts',
      'No explicit mass/energy conservation enforcement in deep convective updrafts'
    ]
  },
  {
    id: 'pangu',
    name: 'Pangu-Weather',
    provider: 'Huawei Cloud',
    type: 'AI_DATA_DRIVEN',
    resolution: '0.25° (~28 km) 3D Earth Transformer',
    updateCycle: 'Instantaneous (<10s GPU forward pass)',
    color: '#f59e0b', // amber
    description: '3D hierarchical vision transformer trained with 3D Earth-specific inductive biases across 5 pressure levels and surface variables.',
    strengths: [
      'Exceptional maximum and minimum 2m temperature skill',
      'Sharp surface wind vectors and sea-level pressure gradient capture',
      'Minimal accumulated dispersion error across multiscale hourly steps'
    ],
    weaknesses: [
      'Tends to under-report heavy convective precipitation tails (>150mm)',
      'Sensitive to satellite initial condition discrepancies in tropical zones'
    ]
  },
  {
    id: 'fourcastnet',
    name: 'FourCastNet v2',
    provider: 'NVIDIA / Caltech / Lawrence Berkeley',
    type: 'AI_DATA_DRIVEN',
    resolution: '0.25° Adaptive Fourier Neural Operator',
    updateCycle: 'Instantaneous GPU inference',
    color: '#ec4899', // pink
    description: 'Spectral operator learning model using Fourier domain token mixing, excelling at high-wavenumber atmospheric turbulence and wind patterns.',
    strengths: [
      'Excellent 10m wind gust and sea-surface atmospheric drag representation',
      'High physical fidelity for gale wind corridors over Arabian Sea & Bay of Bengal',
      'Ultra-efficient ensemble generation capability (1000 members in minutes)'
    ],
    weaknesses: [
      'Precipitation calibration requires aggressive bias correction',
      'Slight cold bias over arid northwestern India during peak summer'
    ]
  }
];
