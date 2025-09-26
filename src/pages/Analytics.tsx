import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WorkflowAnalytics } from '@/types/fleet';

// Mock analytics data
const mockAnalytics: WorkflowAnalytics[] = [
  {
    stage: 'CLEANING',
    averageDuration: 32,
    completionRate: 94,
    bottleneckScore: 2.1,
    totalCompleted: 156
  },
  {
    stage: 'KEY_HANDLING', 
    averageDuration: 8,
    completionRate: 98,
    bottleneckScore: 1.2,
    totalCompleted: 203
  },
  {
    stage: 'REFUEL',
    averageDuration: 12,
    completionRate: 89,
    bottleneckScore: 3.4,
    totalCompleted: 187
  },
  {
    stage: 'EV_CHARGING',
    averageDuration: 95,
    completionRate: 85,
    bottleneckScore: 4.2,
    totalCompleted: 45
  },
  {
    stage: 'LOCATION_MOVE',
    averageDuration: 28,
    completionRate: 92,
    bottleneckScore: 2.8,
    totalCompleted: 89
  }
];

const weeklyData = [
  { day: 'Mon', completed: 45, average: 42 },
  { day: 'Tue', completed: 52, average: 48 },
  { day: 'Wed', completed: 38, average: 41 },
  { day: 'Thu', completed: 61, average: 55 },
  { day: 'Fri', completed: 58, average: 52 },
  { day: 'Sat', completed: 32, average: 35 },
  { day: 'Sun', completed: 28, average: 30 }
];

export default function Analytics() {
  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'CLEANING': return 'Cleaning';
      case 'KEY_HANDLING': return 'Key Handling';
      case 'REFUEL': return 'Refuel';
      case 'EV_CHARGING': return 'EV Charging';
      case 'LOCATION_MOVE': return 'Location Move';
      default: return stage;
    }
  };

  const getBottleneckSeverity = (score: number) => {
    if (score >= 4) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  };

  const totalCompleted = mockAnalytics.reduce((sum, stage) => sum + stage.totalCompleted, 0);
  const averageCompletionRate = mockAnalytics.reduce((sum, stage) => sum + stage.completionRate, 0) / mockAnalytics.length;
  const averageTurnaroundTime = mockAnalytics.reduce((sum, stage) => sum + stage.averageDuration, 0);

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Workflow Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Performance insights and bottleneck analysis
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hover:bg-hertz-yellow hover:text-hertz-navy">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </Button>
            <Button className="bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Completed"
            value={totalCompleted}
            icon={CheckCircle}
            change={{ value: "+12% vs last month", trend: "up" }}
            variant="hertz"
          />
          
          <StatsCard
            title="Completion Rate"
            value={`${Math.round(averageCompletionRate)}%`}
            icon={Target}
            change={{ value: "+2.3% vs last month", trend: "up" }}
          />
          
          <StatsCard
            title="Total Turnaround"
            value={`${Math.round(averageTurnaroundTime)}min`}
            icon={Clock}
            change={{ value: "-8min improvement", trend: "up" }}
            variant="gradient"
          />
          
          <StatsCard
            title="Active Bottlenecks"
            value={mockAnalytics.filter(s => s.bottleneckScore >= 3).length}
            icon={AlertTriangle}
            change={{ value: "2 stages need attention", trend: "down" }}
          />
        </div>

        {/* Stage Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Stage Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockAnalytics.map((stage) => (
                <div key={stage.stage} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{getStageLabel(stage.stage)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stage.totalCompleted} completions • Avg: {stage.averageDuration}min
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="secondary" 
                        className={
                          getBottleneckSeverity(stage.bottleneckScore) === 'high' 
                            ? 'bg-status-error text-white'
                            : getBottleneckSeverity(stage.bottleneckScore) === 'medium'
                            ? 'bg-status-warning text-white'
                            : 'bg-status-completed text-white'
                        }
                      >
                        {getBottleneckSeverity(stage.bottleneckScore) === 'high' ? 'High Risk' :
                         getBottleneckSeverity(stage.bottleneckScore) === 'medium' ? 'Medium Risk' : 'Low Risk'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Completion Rate</span>
                        <span className="text-sm font-bold">{stage.completionRate}%</span>
                      </div>
                      <Progress value={stage.completionRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Efficiency Score</span>
                        <span className="text-sm font-bold">
                          {Math.round(100 - (stage.bottleneckScore * 10))}%
                        </span>
                      </div>
                      <Progress 
                        value={100 - (stage.bottleneckScore * 10)} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Volume</span>
                        <span className="text-sm font-bold">
                          {Math.round((stage.totalCompleted / totalCompleted) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(stage.totalCompleted / totalCompleted) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  
                  {stage.bottleneckScore >= 3 && (
                    <div className="bg-status-warning/10 border border-status-warning/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-status-warning" />
                        <span className="font-medium text-status-warning">Bottleneck Detected</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This stage is experiencing delays. Consider resource reallocation or process optimization.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Completion Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="text-center space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">{day.day}</div>
                  <div className="relative h-20 bg-muted rounded-lg flex flex-col justify-end p-2">
                    <div 
                      className="bg-hertz-yellow rounded-sm transition-all duration-300"
                      style={{ height: `${(day.completed / 70) * 100}%`, minHeight: '4px' }}
                    />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold">{day.completed}</div>
                    <div className="text-muted-foreground">vs {day.average} avg</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}