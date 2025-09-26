import React from 'react';
import { StatsCard } from '@/components/ui/stats-card';
import { 
  Car, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Activity,
  Target
} from 'lucide-react';
import { type DashboardStats } from '@/types/fleet';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Vehicles"
        value={stats.totalVehicles}
        icon={Car}
        change={{ value: "+12 this month", trend: "up" }}
      />
      
      <StatsCard
        title="Ready for Rent"
        value={stats.readyForRent}
        icon={CheckCircle}
        change={{ 
          value: `${Math.round((stats.readyForRent / stats.totalVehicles) * 100)}%`, 
          trend: "up" 
        }}
        variant="hertz"
      />
      
      <StatsCard
        title="In Turnaround"
        value={stats.inTurnaround}
        icon={Clock}
        change={{ value: "-5 from yesterday", trend: "down" }}
      />
      
      <StatsCard
        title="Avg Turnaround"
        value={`${Math.round(stats.averageTurnaroundTime)}min`}
        icon={TrendingUp}
        change={{ value: "-15min improvement", trend: "up" }}
        variant="gradient"
      />
      
      <StatsCard
        title="Active Workflows"
        value={stats.activeWorkflows}
        icon={Activity}
        change={{ value: "Real-time", trend: "neutral" }}
      />
      
      <StatsCard
        title="Completed Today"
        value={stats.completedToday}
        icon={Target}
        change={{ value: "+8 vs yesterday", trend: "up" }}
      />
    </div>
  );
}