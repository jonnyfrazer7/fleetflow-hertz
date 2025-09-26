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
import { useCurrentUser, useWorkforceUsers } from '@/hooks/use-workforce-users';
import { 
  MapPin, 
  FileText, 
  Zap, 
  CheckCircle,
  Clock,
  ArrowRight,
  User
} from 'lucide-react';

interface ChargingStep {
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

interface ChargingStepsProps {
  workflowId: string;
  vehicleVin: string;
  vehicle: Vehicle;
  onStepComplete: (stepId: string, data?: any) => void;
  onWorkflowComplete: (nextAction: 'KEY_HANDLING' | 'REFUEL') => void;
}

interface ChargingData {
  currentBatteryLevel: string;
  targetBatteryLevel: string;
  chargingType: 'fast' | 'standard' | '';
  assignedUserId: string;
  assignedUserName: string;
  chargingTime: string;
  energyAdded: string;
  chargingCost: string;
}

const initialSteps: ChargingStep[] = [
  {
    id: 'charging-setup',
    title: 'Charging Setup',
    description: 'Connect vehicle to charging station and configure settings',
    icon: Zap,
    estimatedTime: 5,
    completed: false,
    requiresInput: true
  },
  {
    id: 'charging-process',
    title: 'Charging in Progress',
    description: 'Monitor charging progress and wait for completion',
    icon: Clock,
    estimatedTime: 45,
    completed: false,
    requiresInput: true
  },
  {
    id: 'charging-complete',
    title: 'Complete Charging Process',
    description: 'Disconnect vehicle and record charging details',
    icon: CheckCircle,
    estimatedTime: 5,
    completed: false,
    requiresInput: true
  }
];

export function ChargingSteps({ workflowId, vehicleVin, vehicle, onStepComplete, onWorkflowComplete }: ChargingStepsProps) {
  const [steps, setSteps] = useState<ChargingStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [showNextActionDialog, setShowNextActionDialog] = useState(false);
  const { data: currentUser } = useCurrentUser();
  const { data: workforceUsers = [] } = useWorkforceUsers();
  
  const [chargingData, setChargingData] = useState<ChargingData>({
    currentBatteryLevel: '',
    targetBatteryLevel: '100',
    chargingType: '',
    assignedUserId: '',
    assignedUserName: '',
    chargingTime: '',
    energyAdded: '',
    chargingCost: ''
  });

  // Auto-populate with current user when available
  React.useEffect(() => {
    if (currentUser && !chargingData.assignedUserId) {
      setChargingData(prev => ({
        ...prev,
        assignedUserId: currentUser.id,
        assignedUserName: currentUser.name
      }));
    }
  }, [currentUser, chargingData.assignedUserId]);

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
    onStepComplete(step.id, chargingData);
    setIsProcessingStep(false);

    if (stepIndex < totalSteps - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      setShowNextActionDialog(true);
    }
  };

  const updateChargingData = (field: keyof ChargingData, value: string) => {
    setChargingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextAction = (action: 'KEY_HANDLING' | 'REFUEL') => {
    onWorkflowComplete(action);
  };

  const renderStepInput = (step: ChargingStep, stepIndex: number) => {
    if (!step.requiresInput || !isProcessingStep || stepIndex !== currentStep) {
      return null;
    }

    switch (step.id) {
      case 'charging-setup':
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="currentBatteryLevel">Current Battery Level (%)</Label>
                <Input
                  id="currentBatteryLevel"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="25"
                  value={chargingData.currentBatteryLevel}
                  onChange={(e) => updateChargingData('currentBatteryLevel', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="targetBatteryLevel">Target Battery Level (%)</Label>
                <Input
                  id="targetBatteryLevel"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="100"
                  value={chargingData.targetBatteryLevel}
                  onChange={(e) => updateChargingData('targetBatteryLevel', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="chargingType">Charging Type</Label>
              <Select value={chargingData.chargingType} onValueChange={(value) => updateChargingData('chargingType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select charging type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast Charging (DC)</SelectItem>
                  <SelectItem value="standard">Standard Charging (AC)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignedUser">Assign User</Label>
              <Select 
                value={chargingData.assignedUserId} 
                onValueChange={(value) => {
                  const user = workforceUsers.find(u => u.id === value);
                  updateChargingData('assignedUserId', value);
                  updateChargingData('assignedUserName', user?.name || '');
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
          </div>
        );

      case 'charging-process':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <Zap className="w-4 h-4 inline mr-1" />
                Charging in Progress
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Current level: {chargingData.currentBatteryLevel}%</li>
                <li>• Target level: {chargingData.targetBatteryLevel}%</li>
                <li>• Charging type: {chargingData.chargingType}</li>
                <li>• Assigned user: {chargingData.assignedUserName}</li>
              </ul>
            </div>
            
            <div>
              <Label htmlFor="chargingTime">Charging Duration (minutes)</Label>
              <Input
                id="chargingTime"
                type="number"
                placeholder="45"
                value={chargingData.chargingTime}
                onChange={(e) => updateChargingData('chargingTime', e.target.value)}
              />
            </div>
          </div>
        );

      case 'charging-complete':
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="energyAdded">Energy Added (kWh)</Label>
                <Input
                  id="energyAdded"
                  type="number"
                  step="0.1"
                  placeholder="35.5"
                  value={chargingData.energyAdded}
                  onChange={(e) => updateChargingData('energyAdded', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="chargingCost">Total Cost</Label>
                <Input
                  id="chargingCost"
                  type="number"
                  step="0.01"
                  placeholder="12.50"
                  value={chargingData.chargingCost}
                  onChange={(e) => updateChargingData('chargingCost', e.target.value)}
                />
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Charging Process Summary:
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Charging type: {chargingData.chargingType}</li>
                <li>• Assigned user: {chargingData.assignedUserName}</li>
                {chargingData.energyAdded && <li>• Energy added: {chargingData.energyAdded} kWh</li>}
                {chargingData.chargingCost && <li>• Total cost: ${chargingData.chargingCost}</li>}
                {chargingData.chargingTime && <li>• Duration: {chargingData.chargingTime} minutes</li>}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canCompleteStep = (step: ChargingStep, stepIndex: number) => {
    if (!step.requiresInput) return true;
    
    switch (step.id) {
      case 'charging-setup':
        return chargingData.currentBatteryLevel && chargingData.targetBatteryLevel && 
               chargingData.chargingType && chargingData.assignedUserId;
      case 'charging-process':
        return chargingData.chargingTime;
      case 'charging-complete':
        return chargingData.energyAdded && chargingData.chargingCost;
      default:
        return true;
    }
  };

  if (showNextActionDialog) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-workflow-step-completed">
            <CheckCircle className="w-6 h-6" />
            Charging Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg mb-4">Vehicle {vehicleVin.substring(0, 8)}... has been charged successfully.</p>
            <p className="text-muted-foreground mb-6">What should happen next with this vehicle?</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* For hybrid vehicles, show refuel option if we just charged */}
            {vehicle.fuelType === 'HYBRID' && (
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleNextAction('REFUEL')}>
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                  <h3 className="font-semibold mb-2">Needs Refueling</h3>
                  <p className="text-sm text-muted-foreground">
                    Hybrid vehicle also needs fuel
                  </p>
                  <Button className="mt-4 w-full bg-orange-500 hover:bg-orange-600">
                    Send to Refuel Queue
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleNextAction('KEY_HANDLING')}>
              <CardContent className="p-6 text-center">
                <ArrowRight className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold mb-2">Go to Key Handling</h3>
                <p className="text-sm text-muted-foreground">
                  Vehicle is ready for key handling workflow
                </p>
                <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600">
                  Go to Key Handling
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-workflow-step-progress" />
              Vehicle Charging Workflow
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

          return (
            <Card key={step.id} className={`
              ${isActive ? 'ring-2 ring-workflow-step-progress' : ''}
              ${isCompleted ? 'bg-workflow-step-completed-bg' : ''}
              transition-all
            `}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-workflow-step-completed text-white' : 
                        isActive ? 'bg-workflow-step-progress text-white' : 
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
                      <Badge className="bg-workflow-step-completed text-white">Completed</Badge>
                    ) : isActive && !isProcessingStep ? (
                      <Button 
                        size="sm"
                        onClick={() => handleStartStep(index)}
                        className="bg-workflow-step-progress hover:bg-workflow-step-progress/80"
                      >
                        Start Step
                      </Button>
                    ) : isActive && isProcessingStep ? (
                      <Badge variant="outline" className="text-workflow-step-progress border-workflow-step-progress">
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
                        className="bg-workflow-step-completed hover:bg-workflow-step-completed/80"
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