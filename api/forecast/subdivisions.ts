import { SUBDIVISIONS } from '../../src/data/subdivisions.ts';

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  // Cache subdivisions aggressively at Vercel Edge for 7 days (static geographical data)
  res.setHeader('Cache-Control', 's-maxage=604800, stale-while-revalidate=2592000');
  
  return res.status(200).json({
    subdivisions: SUBDIVISIONS,
    total: SUBDIVISIONS.length
  });
}
