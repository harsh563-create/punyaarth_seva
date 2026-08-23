import Home from '@/components/pages/Home';
import { getImpactStats } from '@/lib/data';

export default async function HomeRoute() {
  const impactStats = await getImpactStats();
  return <Home impactStats={impactStats} />;
}
