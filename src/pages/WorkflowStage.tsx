import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Wrench, Fuel, Zap, MapPin } from 'lucide-react';
import { CleaningWorkOrderTable } from '@/components/workflows/cleaning-work-order-table';
import { RefuelWorkOrderTable } from '@/components/workflows/refuel-work-order-table';
import { useWorkflows } from '@/hooks/use-workflows';
import { useVehicles } from '@/hooks/use-vehicles';
import type { WorkflowStage } from '@/types/fleet';

const stageConfig = {
  CLEANING: { label: 'Cleaning', icon: Sparkles, color: 'bg-blue-500' },
  KEY_HANDLING: { label: 'Key Handling', icon: Wrench, color: 'bg-green-500' },
  REFUEL: { label: 'Refuel', icon: Fuel, color: 'bg-orange-500' },
  EV_CHARGING: { label: 'EV Charging', icon: Zap, color: 'bg-yellow-500' },
  LOCATION_MOVE: { label: 'Location Move', icon: MapPin, color: 'bg-purple-500' }
};

export default function WorkflowStagePage() {
  const { stage } = useParams<{ stage: string }>();
  const { data: workflows = [], isLoading } = useWorkflows();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();

  if (!stage || !(stage.toUpperCase() in stageConfig)) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Invalid Stage</h1>
            <Link to="/workflows">
              <Button className="mt-4">Back to Workflows</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const stageName = stage.toUpperCase() as WorkflowStage;
  const config = stageConfig[stageName];
  const Icon = config.icon;

  if (isLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">Loading stage details...</div>
        </main>
      </div>
    );
  }

  // Get workflows for this stage
  const stageWorkflows = workflows.filter(w => w.stage === stageName);

  // Calculate statistics
  const pendingCount = stageWorkflows.filter(w => w.status === 'PENDING').length;
  const inProgressCount = stageWorkflows.filter(w => w.status === 'IN_PROGRESS').length;
  const completedCount = stageWorkflows.filter(w => w.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/workflows">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workflows
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full ${config.color}`} />
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  {config.label} Work Orders
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage and execute {config.label.toLowerCase()} work orders for vehicles
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4" />
                Total Workflows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stageWorkflows.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-pending">{pendingCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-progress">{inProgressCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-status-completed">{completedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Work Orders for this stage */}
        {stageName === 'CLEANING' && (
          <CleaningWorkOrderTable workflows={stageWorkflows} vehicles={vehicles} />
        )}
        
        {stageName === 'REFUEL' && (
          <RefuelWorkOrderTable workflows={stageWorkflows} vehicles={vehicles} />
        )}
      </main>
    </div>
  );
}