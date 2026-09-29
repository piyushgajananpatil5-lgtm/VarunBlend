import { SUBDIVISIONS } from '../../src/data/subdivisions';
import {
  calculateBlendedForecast,
  evaluateExtremeWeather
} from '../../src/utils/blendingEngine';
import { fetchRealMultiModelForecast } from '../../src/utils/openMeteoService';
import { Season, WeatherRegime, BlendingAlgorithm } from '../../src/types/weather';

export default async function handler(req: any, res: any) {
  // Set CORS and Vercel Edge caching headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || req.query || {});
    const subdivisionId = body.subdivisionId || 'sub-15'; // Default Konkan & Goa
    const season = (body.season as Season) || 'monsoon';
    const regime = (body.regime as WeatherRegime) || 'monsoon_active';
    const leadDay = parseInt(String(body.leadDay || '2'), 10);
    const algorithm = (body.algorithm as BlendingAlgorithm) || 'inverse_variance';

    const subdivision = SUBDIVISIONS.find(s => s.id === subdivisionId || s.code === subdivisionId) || SUBDIVISIONS[14];

    // Fetch real multi-model data from Open-Meteo API (ECMWF, GFS, ICON)
    const realData = await fetchRealMultiModelForecast(subdivision);

    // Compute blended forecasts with real rolling bias correction
    const rainfall = calculateBlendedForecast(subdivision, season, regime, leadDay, algorithm, 'rainfall', realData);
    const maxTemp = calculateBlendedForecast(subdivision, season, regime, leadDay, algorithm, 'max_temp', realData);
    const minTemp = calculateBlendedForecast(subdivision, season, regime, leadDay, algorithm, 'min_temp', realData);
    const windSpeed = calculateBlendedForecast(subdivision, season, regime, leadDay, algorithm, 'wind_speed', realData);

    // Assess extreme weather guidance signals
    const extremeAlert = evaluateExtremeWeather(subdivision, rainfall, maxTemp, windSpeed, regime);

    return res.status(200).json({
      subdivision,
      metadata: {
        season,
        regime,
        leadDay,
        algorithm,
        dataSource: realData.source,
        generatedAt: new Date().toISOString()
      },
      forecasts: {
        rainfall,
        maxTemp,
        minTemp,
        windSpeed
      },
      extremeAlert
    });
  } catch (error: any) {
    console.error('Forecast blend execution error:', error);
    return res.status(500).json({
      error: 'Failed to compute blended forecast',
      message: error?.message || 'Internal server error'
    });
  }
}
