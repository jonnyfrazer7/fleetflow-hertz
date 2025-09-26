import React from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Car, Clock, Calendar, User } from 'lucide-react';
import { CleaningSteps } from '@/components/workflows/cleaning-steps';
import { RefuelSteps } from '@/components/workflows/refuel-steps';
import { ChargingSteps } from '@/components/workflows/charging-steps';
import { KeyHandlingSteps } from '@/components/workflows/key-handling-steps';
import { useWorkflows } from '@/hooks/use-workflows';
import { useVehicles } from '@/hooks/use-vehicles';
import { toast } from '@/hooks/use-toast';
import { useWorkflowUpdates } from '@/hooks/use-workflow-updates';

export default function WorkflowExecute() {
  const { stage, workflowId } = useParams<{ stage: string; workflowId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: workflows = [], isLoading: workflowsLoading } = useWorkflows();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const { completeWorkflowAndTransition, markWorkflowInProgress } = useWorkflowUpdates();

  // Handle new workflow from rental return
  const vehicleVin = searchParams.get('vehicleVin');
  const returnDataParam = searchParams.get('returnData');
  const isNewWorkflow = workflowId === 'new';
  
  let rentalReturnData = null;
  if (returnDataParam) {
    try {
      rentalReturnData = JSON.parse(decodeURIComponent(returnDataParam));
    } catch (e) {
      console.error('Failed to parse return data:', e);
    }
  }

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

  const workflow = workflowId !== 'new' ? workflows.find(w => w.id === workflowId) : null;
  
  // For new workflows, find vehicle by VIN from URL params
  const vehicle = isNewWorkflow ? 
    vehicles.find(v => v.vin === vehicleVin) : 
    (workflow ? vehicles.find(v => v.vin === workflow.vehicleVin) : null);

  if ((!workflow && !isNewWorkflow) || !vehicle) {
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

  const handleWorkflowComplete = async (nextAction: 'REFUEL' | 'CHARGE' | 'KEY_HANDLING') => {
    const currentMileage = rentalReturnData?.mileage ? parseInt(rentalReturnData.mileage) : undefined;
    
    if (nextAction === 'REFUEL') {
      await completeWorkflowAndTransition(
        workflowId !== 'new' ? workflowId : null,
        vehicle.vin, 
        'REFUEL', 
        workflow?.startTime,
        currentMileage
      );
      
      toast({
        title: 'Moving to Refuel Workflow',
        description: 'Vehicle will be sent to refuel queue.',
      });
      setTimeout(() => {
        navigate(`/workflows/refuel/execute/new?vehicleVin=${vehicle.vin}&returnData=${returnDataParam}`);
      }, 1500);
    } else if (nextAction === 'CHARGE') {
      await completeWorkflowAndTransition(
        workflowId !== 'new' ? workflowId : null,
        vehicle.vin, 
        'EV_CHARGING', 
        workflow?.startTime,
        currentMileage
      );
      
      toast({
        title: 'Moving to Charging Workflow', 
        description: 'Vehicle will be sent to charging queue.',
      });
      setTimeout(() => {
        navigate(`/workflows/ev_charging/execute/new?vehicleVin=${vehicle.vin}&returnData=${returnDataParam}`);
      }, 1500);
    } else if (nextAction === 'KEY_HANDLING') {
      await completeWorkflowAndTransition(
        workflowId !== 'new' ? workflowId : null,
        vehicle.vin, 
        'KEY_HANDLING', 
        workflow?.startTime,
        currentMileage
      );
      
      toast({
        title: 'Moving to Key Handling Workflow',
        description: 'Vehicle will be sent to key handling queue.',
      });
      setTimeout(() => {
        navigate(`/workflows/key_handling/execute/new?vehicleVin=${vehicle.vin}&returnData=${returnDataParam}`);
      }, 1500);
    }
  };

  const handleRefuelComplete = async (nextAction: 'KEY_HANDLING' | 'CHARGE') => {
    const currentMileage = rentalReturnData?.mileage ? parseInt(rentalReturnData.mileage) : undefined;
    
    if (nextAction === 'CHARGE') {
      await completeWorkflowAndTransition(
        workflowId !== 'new' ? workflowId : null,
        vehicle.vin, 
        'EV_CHARGING', 
        workflow?.startTime,
        currentMileage
      );
      
      toast({
        title: 'Moving to Charging Workflow',
        description: 'Hybrid vehicle needs charging next.',
      });
      setTimeout(() => {
        navigate(`/workflows/ev_charging/execute/new?vehicleVin=${vehicle.vin}&returnData=${returnDataParam}`);
      }, 1500);
    } else {
      await completeWorkflowAndTransition(
        workflowId !== 'new' ? workflowId : null,
        vehicle.vin, 
        'KEY_HANDLING', 
        workflow?.startTime,
        currentMileage
      );
      
      toast({
        title: 'Moving to Key Handling Workflow',
        description: 'Vehicle is ready for key handling.',
      });
      setTimeout(() => {
        navigate(`/workflows/key_handling/execute/new?vehicleVin=${vehicle.vin}&returnData=${returnDataParam}`);
      }, 1500);
    }
  };

  const handleChargingComplete = async (nextAction: 'KEY_HANDLING' | 'REFUEL') => {
    const currentMileage = rentalReturnData?.mileage ? parseInt(rentalReturnData.mileage) : undefined;
    
    if (nextAction === 'REFUEL') {
      await completeWorkflowAndTransition(
        workflowId !== 'new' ? workflowId : null,
        vehicle.vin, 
        'REFUEL', 
        workflow?.startTime,
        currentMileage
      );
      
      toast({
        title: 'Moving to Refuel Workflow',
        description: 'Hybrid vehicle needs fuel next.',
      });
      setTimeout(() => {
        navigate(`/workflows/refuel/execute/new?vehicleVin=${vehicle.vin}&returnData=${returnDataParam}`);
      }, 1500);
    } else {
      await completeWorkflowAndTransition(
        workflowId !== 'new' ? workflowId : null,
        vehicle.vin, 
        'KEY_HANDLING', 
        workflow?.startTime,
        currentMileage
      );
      
      toast({
        title: 'Moving to Key Handling Workflow',
        description: 'Vehicle is ready for key handling.',
      });
      setTimeout(() => {
        navigate(`/workflows/key_handling/execute/new?vehicleVin=${vehicle.vin}&returnData=${returnDataParam}`);
      }, 1500);
    }
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
                {isNewWorkflow 
                  ? `Rental Return - ${rentalReturnData?.rentalAgreementNumber || 'New Workflow'}` 
                  : `Work Order: WO-${workflow.id.substring(0, 8)}`
                }
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
              
              {!isNewWorkflow && workflow && (
                <>
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
                </>
              )}

              {isNewWorkflow && rentalReturnData && (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Rental Agreement</p>
                    <p className="font-mono text-sm">{rentalReturnData.rentalAgreementNumber}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Current Mileage</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{rentalReturnData.mileage} miles</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Assigned User</p>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{rentalReturnData.assignedUserName}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Steps */}
        {stage?.toUpperCase() === 'CLEANING' && (
          <CleaningSteps
            workflowId={isNewWorkflow ? 'new' : workflow.id}
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
            workflowId={isNewWorkflow ? 'new' : workflow.id}
            vehicleVin={vehicle.vin}
            vehicle={vehicle}
            onStepComplete={handleStepComplete}
            onWorkflowComplete={handleRefuelComplete}
          />
        )}
        
        {stage?.toUpperCase() === 'EV_CHARGING' && (
          <ChargingSteps
            workflowId={isNewWorkflow ? 'new' : workflow.id}
            vehicleVin={vehicle.vin}
            vehicle={vehicle}
            onStepComplete={handleStepComplete}
            onWorkflowComplete={handleChargingComplete}
          />
        )}
        
        {stage?.toUpperCase() === 'KEY_HANDLING' && (
          <KeyHandlingSteps
            workflowId={isNewWorkflow ? 'new' : workflow.id}
            vehicleVin={vehicle.vin}
            vehicle={vehicle}
            onStepComplete={handleStepComplete}
            onWorkflowComplete={async () => {
              const currentMileage = rentalReturnData?.mileage ? parseInt(rentalReturnData.mileage) : undefined;
              
              // Complete final workflow - no next stage
              await completeWorkflowAndTransition(
                workflowId !== 'new' ? workflowId : null,
                vehicle.vin, 
                null, // No next stage - process complete
                workflow?.startTime,
                currentMileage
              );
              
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