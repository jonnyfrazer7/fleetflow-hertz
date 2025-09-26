import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Vehicle } from '@/types/fleet';
import { useCurrentUser } from '@/hooks/use-workforce-users';
import { 
  Key, 
  CheckCircle,
  Clock,
  Car,
  User,
  Lock
} from 'lucide-react';

interface KeyHandlingStep {
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

interface KeyHandlingStepsProps {
  workflowId: string;
  vehicleVin: string;
  vehicle: Vehicle;
  onStepComplete: (stepId: string, data?: any) => void;
  onWorkflowComplete: () => void;
  onUserAssigned?: (userId: string, userName: string) => void;
}

interface KeyHandlingData {
  keyBoxNumber: string;
  assignedUserId: string;
  assignedUserName: string;
  markAsAvailable: boolean;
}

const initialSteps: KeyHandlingStep[] = [
  {
    id: 'key-storage',
    title: 'Store Vehicle Keys',
    description: 'Place keys in designated key box and record box number',
    icon: Key,
    estimatedTime: 3,
    completed: false,
    requiresInput: true
  },
  {
    id: 'availability-confirmation',
    title: 'Mark Vehicle Available',
    description: 'Confirm vehicle is ready for rental',
    icon: CheckCircle,
    estimatedTime: 1,
    completed: false,
    requiresInput: true
  }
];

export function KeyHandlingSteps({ workflowId, vehicleVin, vehicle, onStepComplete, onWorkflowComplete, onUserAssigned }: KeyHandlingStepsProps) {
  const [steps, setSteps] = useState<KeyHandlingStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [assignedUser, setAssignedUser] = useState<string>('');
  const { data: currentUser } = useCurrentUser();

  const [keyHandlingData, setKeyHandlingData] = useState<KeyHandlingData>({
    keyBoxNumber: '',
    assignedUserId: '',
    assignedUserName: '',
    markAsAvailable: false
  });

  // Auto-assign current user when starting workflow
  React.useEffect(() => {
    if (currentUser && !assignedUser) {
      setAssignedUser(currentUser.name);
      setKeyHandlingData(prev => ({
        ...prev,
        assignedUserId: currentUser.id,
        assignedUserName: currentUser.name
      }));
      onUserAssigned?.(currentUser.id, currentUser.name);
    }
  }, [currentUser, assignedUser, onUserAssigned]);

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
    onStepComplete(step.id, keyHandlingData);
    setIsProcessingStep(false);

    // Move to next step or complete workflow
    if (stepIndex < totalSteps - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      onWorkflowComplete();
    }
  };

  const updateKeyHandlingData = (field: keyof KeyHandlingData, value: string | boolean) => {
    setKeyHandlingData(prev => ({ ...prev, [field]: value }));
  };

  const renderStepInput = (step: KeyHandlingStep, stepIndex: number) => {
    if (!step.requiresInput || !isProcessingStep || stepIndex !== currentStep) {
      return null;
    }

    switch (step.id) {
      case 'key-storage':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="keyBoxNumber">Key Box Number</Label>
              <Input
                id="keyBoxNumber"
                type="number"
                placeholder="Box number (e.g., 42)"
                value={keyHandlingData.keyBoxNumber}
                onChange={(e) => updateKeyHandlingData('keyBoxNumber', e.target.value)}
              />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <Lock className="w-4 h-4 inline mr-1" />
                Ensure keys are securely locked in the designated key box
              </p>
            </div>
          </div>
        );

      case 'availability-confirmation':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Turnaround Process Complete!
              </p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Vehicle has been cleaned</li>
                <li>• Fuel tank is full / EV is charged</li>
                <li>• Keys stored in box #{keyHandlingData.keyBoxNumber}</li>
                <li>• Assigned to: {keyHandlingData.assignedUserName}</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                <Car className="w-4 h-4 inline mr-1" />
                Mark this vehicle as available for rent?
              </p>
              <p className="text-xs text-yellow-700">This will make the vehicle bookable by customers.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canCompleteStep = (step: KeyHandlingStep, stepIndex: number) => {
    if (!step.requiresInput) return true;
    
    switch (step.id) {
      case 'key-storage':
        return keyHandlingData.keyBoxNumber.trim() !== '';
      case 'availability-confirmation':
        return true; // Always allow completion for availability confirmation
      default:
        return true;
    }
  };

  const handleAvailabilityConfirmation = () => {
    updateKeyHandlingData('markAsAvailable', true);
    handleCompleteStep(currentStep);
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-green-500" />
              Key Handling Workflow
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {completedSteps} of {totalSteps} complete
            </Badge>
          </div>
          
          {assignedUser && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Assigned to: {assignedUser}</span>
            </div>
          )}
          
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
              ${isActive ? 'ring-2 ring-green-400' : ''}
              ${isCompleted ? 'bg-green-50' : ''}
              transition-all
            `}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-green-500 text-white' : 
                        isActive ? 'bg-green-500 text-white' : 
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
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Start Step
                      </Button>
                    ) : isActive && isProcessingStep ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
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
                      {step.id === 'availability-confirmation' ? (
                        <Button 
                          onClick={handleAvailabilityConfirmation}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Yes, Mark Available for Rent
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleCompleteStep(index)}
                          disabled={!canComplete}
                          className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Step
                        </Button>
                      )}
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