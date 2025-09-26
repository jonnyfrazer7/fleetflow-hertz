import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Car, Clock, Calendar, User } from 'lucide-react';
import { CleaningSteps } from '@/components/workflows/cleaning-steps';
import { RefuelSteps } from '@/components/workflows/refuel-steps';
import { KeyHandlingSteps } from '@/components/workflows/key-handling-steps';
import { useWorkflows } from '@/hooks/use-workflows';
import { useVehicles } from '@/hooks/use-vehicles';
import { toast } from '@/hooks/use-toast';

export default function WorkflowExecute() {
  const { stage, workflowId } = useParams<{ stage: string; workflowId: string }>();
  const navigate = useNavigate();
  const { data: workflows = [], isLoading: workflowsLoading } = useWorkflows();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();

  if (!workflowId || !stage) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Invalid Workflow</h1>
            <Link to="/workflows">
              <Button className="mt-4">Back to Workflows</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (workflowsLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">Loading workflow...</div>
        </main>
      </div>
    );
  }

  const workflow = workflows.find(w => w.id === workflowId);
  const vehicle = workflow ? vehicles.find(v => v.vin === workflow.vehicleVin) : null;

  if (!workflow || !vehicle) {
    return (
      <div className="min-h-screen bg-dashboard-bg">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Workflow Not Found</h1>
            <Link to={`/workflows/${stage}`}>
              <Button className="mt-4">Back to {stage} Workflows</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleStepComplete = (stepId: string, notes?: string) => {
    toast({
      title: 'Step Completed',
      description: `${stepId.replace('-', ' ')} has been marked as complete.`,
    });
  };

  const handleWorkflowComplete = (nextAction?: 'REFUEL' | 'RENTABLE') => {
    if (nextAction) {
      toast({
        title: 'Cleaning Workflow Complete',
        description: `Vehicle will be moved to ${nextAction === 'REFUEL' ? 'refuel queue' : 'rentable inventory'}.`,
      });
    } else {
      toast({
        title: 'Refuel Workflow Complete',
        description: 'Vehicle has been refueled and is ready for the next stage.',
      });
    }
    
    // Navigate back to workflows after a short delay
    setTimeout(() => {
      navigate('/workflows');
    }, 2000);
  };

  const handleRefuelComplete = () => {
    toast({
      title: 'Refuel Workflow Complete',
      description: 'Moving to Key Handling workflow next.',
    });
    
    // Navigate to key handling workflow after a short delay
    setTimeout(() => {
      navigate('/workflows/key_handling');
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/workflows/${stage}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {stage} Queue
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                {stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase()} Workflow
              </h1>
              <p className="text-muted-foreground">
                Work Order: WO-{workflow.id.substring(0, 8)}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle & Workflow Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle & Work Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Vehicle</p>
                <p className="font-mono text-sm">{vehicle.vin.substring(0, 12)}...</p>
                <p className="text-sm">{vehicle.make} {vehicle.modelDescription}</p>
                <p className="text-xs text-muted-foreground">{vehicle.year} • {vehicle.color}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                <Badge className={getPriorityColor(workflow.priority)}>
                  {workflow.priority}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Estimated Duration</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{workflow.estimatedDuration} minutes</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        {stage?.toUpperCase() === 'CLEANING' && (
          <CleaningSteps
            workflowId={workflow.id}
            vehicleVin={vehicle.vin}
            vehicle={vehicle}
            onStepComplete={handleStepComplete}
            onWorkflowComplete={handleWorkflowComplete}
            onUserAssigned={(userId, userName) => {
              console.log('User assigned:', userName);
            }}
          />
        )}
        
        {stage?.toUpperCase() === 'REFUEL' && (
          <RefuelSteps
            workflowId={workflow.id}
            vehicleVin={vehicle.vin}
            vehicle={vehicle}
            onStepComplete={handleStepComplete}
            onWorkflowComplete={handleRefuelComplete}
          />
        )}
        
        {stage?.toUpperCase() === 'KEY_HANDLING' && (
          <KeyHandlingSteps
            workflowId={workflow.id}
            vehicleVin={vehicle.vin}
            vehicle={vehicle}
            onStepComplete={handleStepComplete}
            onWorkflowComplete={() => {
              toast({
                title: 'Turnaround Process Complete!',
                description: 'Vehicle is now available for rent.',
              });
              setTimeout(() => {
                navigate('/workflows');
              }, 2000);
            }}
            onUserAssigned={(userId, userName) => {
              console.log('User assigned:', userName);
            }}
          />
        )}
      </main>
    </div>
  );
}