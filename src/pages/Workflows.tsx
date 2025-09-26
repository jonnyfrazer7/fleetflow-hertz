import React, { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { WorkflowList } from '@/components/workflows/workflow-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewWorkflowDialog } from '@/components/workflows/new-workflow-dialog';
import { 
  ClipboardList,
  Plus,
  Filter,
  Download,
  Sparkles,
  Wrench,
  Fuel,
  Zap,
  MapPin
} from 'lucide-react';
import type { Workflow, WorkflowStage, UserRole } from '@/types/fleet';

// Mock data - will be replaced with API calls
const mockWorkflows: Workflow[] = [
  {
    id: 'wf-001',
    vehicleVin: '1HGBH41JXMN109186',
    stage: 'CLEANING',
    status: 'IN_PROGRESS',
    assignedUserGroup: 'CAR_CLEANER',
    priority: 'HIGH',
    startTime: '2024-01-20T14:00:00Z',
    estimatedDuration: 30,
    actualDuration: 25,
    createdAt: '2024-01-20T13:45:00Z',
    updatedAt: '2024-01-20T14:25:00Z'
  },
  {
    id: 'wf-002',
    vehicleVin: '2T1BURHE6JC123456',
    stage: 'REFUEL',
    status: 'PENDING',
    assignedUserGroup: 'OPERATIONS_USER',
    priority: 'MEDIUM',
    estimatedDuration: 15,
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z'
  },
  {
    id: 'wf-003',
    vehicleVin: '3FAHP0HA1CR123789',
    stage: 'KEY_HANDLING',
    status: 'COMPLETED',
    assignedUserGroup: 'OPERATIONS_USER',
    priority: 'LOW',
    startTime: '2024-01-20T12:00:00Z',
    endTime: '2024-01-20T12:10:00Z',
    estimatedDuration: 10,
    actualDuration: 10,
    createdAt: '2024-01-20T11:50:00Z',
    updatedAt: '2024-01-20T12:10:00Z'
  },
  {
    id: 'wf-004',
    vehicleVin: '5NPE34AF6KH123456',
    stage: 'EV_CHARGING',
    status: 'IN_PROGRESS',
    assignedUserGroup: 'OPERATIONS_USER',
    priority: 'URGENT',
    startTime: '2024-01-20T13:30:00Z',
    estimatedDuration: 120,
    createdAt: '2024-01-20T13:25:00Z',
    updatedAt: '2024-01-20T13:30:00Z'
  },
  {
    id: 'wf-005',
    vehicleVin: '1FTFW1ET5DFC12345',
    stage: 'LOCATION_MOVE',
    status: 'PENDING',
    assignedUserGroup: 'OPERATIONS_USER',
    priority: 'HIGH',
    estimatedDuration: 45,
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z'
  }
];

const workflowStages: { stage: WorkflowStage; label: string; icon: React.ElementType; color: string }[] = [
  { stage: 'CLEANING', label: 'Cleaning', icon: Sparkles, color: 'bg-blue-500' },
  { stage: 'KEY_HANDLING', label: 'Key Handling', icon: Wrench, color: 'bg-green-500' },
  { stage: 'REFUEL', label: 'Refuel', icon: Fuel, color: 'bg-orange-500' },
  { stage: 'EV_CHARGING', label: 'EV Charging', icon: Zap, color: 'bg-yellow-500' },
  { stage: 'LOCATION_MOVE', label: 'Location Move', icon: MapPin, color: 'bg-purple-500' }
];

export default function Workflows() {
  const [activeTab, setActiveTab] = useState('all');

  const getWorkflowsByStage = (stage: WorkflowStage) => {
    return mockWorkflows.filter(w => w.stage === stage);
  };

  const getWorkflowsByRole = (role: UserRole) => {
    return mockWorkflows.filter(w => w.assignedUserGroup === role);
  };

  const getStageStats = () => {
    return workflowStages.map(stage => ({
      ...stage,
      total: getWorkflowsByStage(stage.stage).length,
      pending: getWorkflowsByStage(stage.stage).filter(w => w.status === 'PENDING').length,
      inProgress: getWorkflowsByStage(stage.stage).filter(w => w.status === 'IN_PROGRESS').length,
      completed: getWorkflowsByStage(stage.stage).filter(w => w.status === 'COMPLETED').length
    }));
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Workflow Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage vehicle turnaround processes
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hover:bg-hertz-yellow hover:text-hertz-navy">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="hover:bg-hertz-yellow hover:text-hertz-navy">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <NewWorkflowDialog />
          </div>
        </div>

        {/* Stage Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {getStageStats().map((stage) => (
            <Card key={stage.stage} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  {stage.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stage.total}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="bg-status-pending text-white text-xs">
                    {stage.pending} pending
                  </Badge>
                  <Badge variant="secondary" className="bg-status-progress text-white text-xs">
                    {stage.inProgress} active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Workflows</TabsTrigger>
            <TabsTrigger value="cleaning">Car Cleaning</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="manager">Manager View</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <WorkflowList workflows={mockWorkflows} />
          </TabsContent>

          <TabsContent value="cleaning" className="space-y-4">
            <WorkflowList 
              workflows={getWorkflowsByRole('CAR_CLEANER')} 
              userRole="CAR_CLEANER"
            />
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <WorkflowList 
              workflows={getWorkflowsByRole('OPERATIONS_USER')} 
              userRole="OPERATIONS_USER"
            />
          </TabsContent>

          <TabsContent value="manager" className="space-y-4">
            <div className="grid gap-6">
              {workflowStages.map((stage) => {
                const stageWorkflows = getWorkflowsByStage(stage.stage);
                if (stageWorkflows.length === 0) return null;
                
                return (
                  <Card key={stage.stage}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <stage.icon className="w-5 h-5" />
                        {stage.label} ({stageWorkflows.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WorkflowList workflows={stageWorkflows} showVehicleInfo={true} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}