import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle } from '@/types/fleet';
import { useFuelLocations, useLocations } from '@/hooks/use-locations';
import { useCurrentUser, useWorkforceUsers } from '@/hooks/use-workforce-users';
import { 
  MapPin, 
  FileText, 
  Fuel, 
  Calculator, 
  CheckCircle,
  Clock,
  Car,
  ArrowRight,
  ExternalLink,
  User,
  Upload
} from 'lucide-react';

interface RefuelStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  estimatedTime: number;
  completed: boolean;
  startTime?: Date;
  endTime?: Date;
  requiresInput?: boolean;
}

interface RefuelStepsProps {
  workflowId: string;
  vehicleVin: string;
  vehicle: Vehicle;
  onStepComplete: (stepId: string, data?: any) => void;
  onWorkflowComplete: () => void;
}

interface RefuelData {
  currentMileage: string;
  currentFuelLevel: string;
  fuelingType: 'internal' | 'external' | '';
  tripTicketId: string;
  selectedLocationId: string;
  assignedUserId: string;
  assignedUserName: string;
  fuelAmount: string;
  fuelCost: string;
  receiptUploaded: boolean;
  returnLocation: string;
}

const initialSteps: RefuelStep[] = [
  {
    id: 'refuel-request',
    title: 'Refuel Request Created',
    description: 'Capture vehicle details and select fueling type',
    icon: FileText,
    estimatedTime: 3,
    completed: false,
    requiresInput: true
  },
  {
    id: 'trip-ticket',
    title: 'Trip Ticket & User Assignment',
    description: 'Create trip ticket, assign user, and select location',
    icon: FileText,
    estimatedTime: 8,
    completed: false,
    requiresInput: true
  },
  {
    id: 'fueling-complete',
    title: 'Complete Fueling Process',
    description: 'Fill tank, record costs, and document return location',
    icon: CheckCircle,
    estimatedTime: 20,
    completed: false,
    requiresInput: true
  }
];

export function RefuelSteps({ workflowId, vehicleVin, vehicle, onStepComplete, onWorkflowComplete }: RefuelStepsProps) {
  const [steps, setSteps] = useState<RefuelStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const { data: fuelLocations = [] } = useFuelLocations();
  const { data: allLocations = [] } = useLocations();
  const { data: currentUser } = useCurrentUser();
  const { data: workforceUsers = [] } = useWorkforceUsers();
  
  const rentalLocations = allLocations.filter(location => location.type === 'rental');
  
  const [refuelData, setRefuelData] = useState<RefuelData>({
    currentMileage: '',
    currentFuelLevel: '',
    fuelingType: '',
    tripTicketId: '',
    selectedLocationId: '',
    assignedUserId: '',
    assignedUserName: '',
    fuelAmount: '',
    fuelCost: '',
    receiptUploaded: false,
    returnLocation: ''
  });

  // Auto-populate with current user when available
  React.useEffect(() => {
    if (currentUser && !refuelData.assignedUserId) {
      setRefuelData(prev => ({
        ...prev,
        assignedUserId: currentUser.id,
        assignedUserName: currentUser.name
      }));
    }
  }, [currentUser, refuelData.assignedUserId]);

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  const handleStartStep = (stepIndex: number) => {
    if (stepIndex !== currentStep) return;
    
    setIsProcessingStep(true);
    const updatedSteps = [...steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      startTime: new Date()
    };
    setSteps(updatedSteps);
  };

  const handleCompleteStep = (stepIndex: number) => {
    const step = steps[stepIndex];
    const updatedSteps = [...steps];
    
    updatedSteps[stepIndex] = {
      ...step,
      completed: true,
      endTime: new Date()
    };
    
    setSteps(updatedSteps);
    onStepComplete(step.id, refuelData);
    setIsProcessingStep(false);

    // Handle workflow branching based on fueling type
    if (step.id === 'refuel-request' && refuelData.fuelingType === 'internal') {
      // Skip trip ticket for internal fueling, go directly to fueling-complete
      const nextStepIndex = steps.findIndex(s => s.id === 'fueling-complete');
      setCurrentStep(nextStepIndex);
    } else if (stepIndex < totalSteps - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      onWorkflowComplete();
    }
  };

  const updateRefuelData = (field: keyof RefuelData, value: string | boolean) => {
    setRefuelData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepInput = (step: RefuelStep, stepIndex: number) => {
    if (!step.requiresInput || !isProcessingStep || stepIndex !== currentStep) {
      return null;
    }

    switch (step.id) {
      case 'refuel-request':
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="currentMileage">Current Mileage</Label>
                <Input
                  id="currentMileage"
                  type="number"
                  placeholder="12,500"
                  value={refuelData.currentMileage}
                  onChange={(e) => updateRefuelData('currentMileage', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentFuelLevel">Current Fuel Level (%)</Label>
                <Input
                  id="currentFuelLevel"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="25"
                  value={refuelData.currentFuelLevel}
                  onChange={(e) => updateRefuelData('currentFuelLevel', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="fuelingType">Fueling Type</Label>
              <Select value={refuelData.fuelingType} onValueChange={(value) => updateRefuelData('fuelingType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fueling type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal (Company Station)</SelectItem>
                  <SelectItem value="external">External (Third-party Station)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'trip-ticket':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="assignedUser">Assign User</Label>
              <Select 
                value={refuelData.assignedUserId} 
                onValueChange={(value) => {
                  const user = workforceUsers.find(u => u.id === value);
                  updateRefuelData('assignedUserId', value);
                  updateRefuelData('assignedUserName', user?.name || '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user to assign" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {workforceUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.role} • {user.phone}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tripTicketId">Trip Ticket ID</Label>
              <Input
                id="tripTicketId"
                placeholder="TT-2024-001234"
                value={refuelData.tripTicketId}
                onChange={(e) => updateRefuelData('tripTicketId', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="selectedLocation">Fuel Station</Label>
              <Select value={refuelData.selectedLocationId} onValueChange={(value) => updateRefuelData('selectedLocationId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel station" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {fuelLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-xs text-muted-foreground">{location.address}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {refuelData.assignedUserName && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <User className="w-4 h-4 inline mr-1" />
                  {refuelData.assignedUserName} will handle this refueling task
                </p>
              </div>
            )}
          </div>
        );

      case 'fueling-complete':
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fuelAmount">Fuel Amount Added ({vehicle.fuelType === 'EV' ? 'kWh' : 'Liters'})</Label>
                <Input
                  id="fuelAmount"
                  type="number"
                  step="0.1"
                  placeholder={vehicle.fuelType === 'EV' ? '45.5' : '35.2'}
                  value={refuelData.fuelAmount}
                  onChange={(e) => updateRefuelData('fuelAmount', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="fuelCost">Total Cost</Label>
                <Input
                  id="fuelCost"
                  type="number"
                  step="0.01"
                  placeholder="45.67"
                  value={refuelData.fuelCost}
                  onChange={(e) => updateRefuelData('fuelCost', e.target.value)}
                />
              </div>
            </div>
            
            {refuelData.fuelingType === 'external' && (
              <div className="space-y-2">
                <Label>Receipt Upload (Required for External)</Label>
                <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Upload receipt image</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => updateRefuelData('receiptUploaded', true)}
                  >
                    Simulate Upload
                  </Button>
                </div>
                {refuelData.receiptUploaded && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Receipt uploaded successfully</span>
                  </div>
                )}
              </div>
            )}
            
            {refuelData.fuelingType === 'external' && (
              <div>
                <Label htmlFor="returnLocation">Return Location</Label>
                <Select value={refuelData.returnLocation} onValueChange={(value) => updateRefuelData('returnLocation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select return location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {rentalLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-xs text-muted-foreground">{location.address}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Refueling Process Summary:
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• {vehicle.fuelType === 'EV' ? 'Charging' : 'Fueling'} type: {refuelData.fuelingType}</li>
                <li>• Assigned user: {refuelData.assignedUserName}</li>
                {refuelData.fuelAmount && (
                  <li>• Fuel added: {refuelData.fuelAmount} {vehicle.fuelType === 'EV' ? 'kWh' : 'liters'}</li>
                )}
                {refuelData.fuelCost && <li>• Total cost: ${refuelData.fuelCost}</li>}
                {refuelData.fuelingType === 'external' && refuelData.tripTicketId && (
                  <li>• Trip ticket: {refuelData.tripTicketId}</li>
                )}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canCompleteStep = (step: RefuelStep, stepIndex: number) => {
    if (!step.requiresInput) return true;
    
    switch (step.id) {
      case 'refuel-request':
        return refuelData.currentMileage && refuelData.currentFuelLevel && refuelData.fuelingType;
      case 'trip-ticket':
        return refuelData.assignedUserId && refuelData.tripTicketId && refuelData.selectedLocationId;
      case 'fueling-complete':
        return refuelData.fuelAmount && refuelData.fuelCost && (
          refuelData.fuelingType === 'internal' || 
          (refuelData.fuelingType === 'external' && refuelData.receiptUploaded && refuelData.returnLocation)
        );
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Fuel className="w-5 h-5 text-orange-500" />
              Vehicle {vehicle.fuelType === 'EV' ? 'Charging' : 'Refueling'} Workflow
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {completedSteps} of {totalSteps} complete
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = step.completed;
          const canStart = index === currentStep && !isProcessingStep;
          const canComplete = canCompleteStep(step, index);
          
          // Skip trip ticket step for internal fueling
          const shouldSkipTripTicket = step.id === 'trip-ticket' && refuelData.fuelingType === 'internal' && !isCompleted;
          
          if (shouldSkipTripTicket) {
            return null;
          }

          return (
            <Card key={step.id} className={`
              ${isActive ? 'ring-2 ring-orange-400' : ''}
              ${isCompleted ? 'bg-green-50' : ''}
              transition-all
            `}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-green-500 text-white' : 
                        isActive ? 'bg-orange-500 text-white' : 
                        'bg-gray-200 text-gray-400'}
                    `}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {step.estimatedTime} min
                    </div>
                    
                    {isCompleted ? (
                      <Badge className="bg-green-500">Completed</Badge>
                    ) : isActive && !isProcessingStep ? (
                      <Button 
                        size="sm"
                        onClick={() => handleStartStep(index)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Start Step
                      </Button>
                    ) : isActive && isProcessingStep ? (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        In Progress
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </CardHeader>

              {isActive && isProcessingStep && (
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="space-y-4">
                    {renderStepInput(step, index)}
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleCompleteStep(index)}
                        disabled={!canComplete}
                        className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Step
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}