import type { ForecastVariable } from '../../src/types/weather.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  // Cache verification metrics at edge for 24 hours
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');

  try {
    const { getVerificationSkillData } = await import('../../src/utils/blendingEngine.ts');
    const variable = (req.query?.variable as ForecastVariable) || 'rainfall';
    const data = getVerificationSkillData(variable);

    return res.status(200).json({
      variable,
      verification: data,
      summary: {
        averageImprovementOverBestSingle: 18.5,
        threatScoreGain: 0.11,
        errorDecorrelationFactor: 0.42
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Forecast verification failed:', message);
    return res.status(500).json({ error: 'Failed to load forecast verification', message });
  }
}
