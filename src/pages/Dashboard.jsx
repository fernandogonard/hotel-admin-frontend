import QuickActions from '../components/QuickActions';
import FilterPanel from '../components/FilterPanel';
import OccupancyChart from '../components/Charts/OccupancyChart';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <QuickActions />
      <FilterPanel />
      <OccupancyChart />
    </div>
  );
}
