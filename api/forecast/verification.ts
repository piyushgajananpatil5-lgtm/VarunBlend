import { getVerificationSkillData } from '../../src/utils/blendingEngine';
import type { ForecastVariable } from '../../src/types/weather';

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  // Cache verification metrics at edge for 24 hours
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');

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
}
