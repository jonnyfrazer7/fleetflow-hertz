import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { DashboardStatsGrid } from '@/components/dashboard/dashboard-stats';
import { VehicleTable } from '@/components/vehicles/vehicle-table';
import { WorkflowList } from '@/components/workflows/workflow-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVehicles } from '@/hooks/use-vehicles';
import { useWorkflows } from '@/hooks/use-workflows';
import { 
  MapPin, 
  AlertCircle,
  TrendingUp,
  Clock,
  Plus
} from 'lucide-react';

// Mock data - will be replaced with real API calls
const mockStats = {
  totalVehicles: 1247,
  readyForRent: 1089,
  inTurnaround: 158,
  averageTurnaroundTime: 45,
  activeWorkflows: 342,
  completedToday: 87
};

const mockVehicles = [
  {
    vin: '1HGBH41JXMN109186',
    make: 'Honda',
    year: 2023,
    carGroup: 'Compact',
    modelGroup: 'Civic',
    color: 'Silver',
    installationDate: '2023-01-15',
    owningCountry: 'USA',
    locationCountry: 'USA',
    licensePlate: 'ABC-1234',
    ownAreaUnitNo: 'LAX001',
    modelCode: 'CIV23',
    holdFlag: false,
    operationStatus: 'ACTIVE' as const,
    lastMileage: 15240,
    modelDescription: 'Civic LX',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    vin: '2T1BURHE6JC123456',
    make: 'Toyota',
    year: 2024,
    carGroup: 'Mid-Size',
    modelGroup: 'Camry',
    color: 'Blue',
    installationDate: '2024-01-01',
    owningCountry: 'USA',
    locationCountry: 'USA', 
    licensePlate: 'XYZ-5678',
    ownAreaUnitNo: 'LAX002',
    modelCode: 'CAM24',
    holdFlag: false,
    operationStatus: 'MAINTENANCE' as const,
    lastMileage: 8500,
    modelDescription: 'Camry LE',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-20T16:15:00Z'
  }
];

const mockWorkflows = [
  {
    id: 'wf-001',
    vehicleVin: '1HGBH41JXMN109186',
    stage: 'CLEANING' as const,
    status: 'IN_PROGRESS' as const,
    assignedUserGroup: 'CAR_CLEANER' as const,
    priority: 'HIGH' as const,
    startTime: '2024-01-20T14:00:00Z',
    estimatedDuration: 30,
    actualDuration: 25,
    createdAt: '2024-01-20T13:45:00Z',
    updatedAt: '2024-01-20T14:25:00Z'
  },
  {
    id: 'wf-002', 
    vehicleVin: '2T1BURHE6JC123456',
    stage: 'REFUEL' as const,
    status: 'PENDING' as const,
    assignedUserGroup: 'OPERATIONS_USER' as const,
    priority: 'MEDIUM' as const,
    estimatedDuration: 15,
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z'
  }
];

export default function Dashboard() {
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const { data: workflows = [], isLoading: workflowsLoading } = useWorkflows();

  // Calculate stats from real data
  const stats = {
    totalVehicles: vehicles.length,
    readyForRent: vehicles.filter(v => v.operationStatus === 'ACTIVE' && !v.holdFlag).length,
    inTurnaround: workflows.filter(w => w.status === 'IN_PROGRESS').length,
    averageTurnaroundTime: 45, // This would need more complex calculation
    activeWorkflows: workflows.filter(w => w.status !== 'COMPLETED').length,
    completedToday: workflows.filter(w => {
      if (!w.endTime) return false;
      const today = new Date().toDateString();
      return new Date(w.endTime).toDateString() === today && w.status === 'COMPLETED';
    }).length
  };

  if (vehiclesLoading || workflowsLoading) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Navbar />
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Fleet Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              LAX Location • Real-time overview
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="flex items-center gap-1 bg-status-completed text-white hover:bg-status-completed border-transparent">
              <MapPin className="w-3 h-3" />
              LAX Active
            </Badge>
            <Button className="bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStatsGrid stats={stats} />

        {/* Alerts & Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-status-warning bg-status-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-status-warning">
                <AlertCircle className="w-5 h-5" />
                Urgent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-warning">
                {workflows.filter(w => w.priority === 'URGENT' && w.status === 'PENDING').length}
              </div>
              <p className="text-sm text-muted-foreground">Overdue workflows</p>
            </CardContent>
          </Card>

          <Card className="border-status-progress bg-status-progress/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-status-progress">
                <TrendingUp className="w-5 h-5" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-progress">87%</div>
              <p className="text-sm text-muted-foreground">On-time completion</p>
            </CardContent>
          </Card>

          <Card className="border-hertz-gold bg-hertz-yellow/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-hertz-gold">
                <Clock className="w-5 h-5" />
                Avg Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hertz-gold">45m</div>
              <p className="text-sm text-muted-foreground">Turnaround time</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Workflows */}
        <WorkflowList workflows={workflows.slice(0, 5)} />

        {/* Recent Vehicles */}
        <VehicleTable vehicles={vehicles.slice(0, 10)} />
      </main>
    </div>
  );
}