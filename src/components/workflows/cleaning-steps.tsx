import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Vehicle } from '@/types/fleet';
import { useCurrentUser } from '@/hooks/use-workforce-users';
import { 
  MapPin, 
  Sparkles, 
  CarFront, 
  Droplets, 
  ArrowRight,
  CheckCircle,
  Clock,
  Fuel,
  Car,
  User
} from 'lucide-react';

interface CleaningStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  estimatedTime: number;
  completed: boolean;
  startTime?: Date;
  endTime?: Date;
}

interface CleaningStepsProps {
  workflowId: string;
  vehicleVin: string;
  vehicle: Vehicle;
  onStepComplete: (stepId: string, notes?: string) => void;
  onWorkflowComplete: (nextAction: 'REFUEL' | 'RENTABLE') => void;
  onUserAssigned?: (userId: string, userName: string) => void;
}

const initialSteps: CleaningStep[] = [
  {
    id: 'move-to-location',
    title: 'Move to Cleaning Location',
    description: 'Drive vehicle to designated cleaning bay A-12',
    icon: MapPin,
    estimatedTime: 5,
    completed: false
  },
  {
    id: 'clean-interior',
    title: 'Clean Interior',
    description: 'Vacuum seats, dashboard, clean windows from inside',
    icon: CarFront,
    estimatedTime: 15,
    completed: false
  },
  {
    id: 'clean-exterior',
    title: 'Clean Exterior',
    description: 'Wash, rinse and clean all exterior surfaces',
    icon: Sparkles,
    estimatedTime: 20,
    completed: false
  },
  {
    id: 'dry-vehicle',
    title: 'Dry Vehicle',
    description: 'Dry all surfaces and ensure no water spots',
    icon: Droplets,
    estimatedTime: 10,
    completed: false
  }
];

export function CleaningSteps({ workflowId, vehicleVin, vehicle, onStepComplete, onWorkflowComplete, onUserAssigned }: CleaningStepsProps) {
  const [steps, setSteps] = useState<CleaningStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepNotes, setStepNotes] = useState('');
  const [isProcessingStep, setIsProcessingStep] = useState(false);
  const [showNextActionDialog, setShowNextActionDialog] = useState(false);
  const [assignedUser, setAssignedUser] = useState<string>('');
  const { data: currentUser } = useCurrentUser();

  // Auto-assign current user when starting workflow
  React.useEffect(() => {
    if (currentUser && !assignedUser) {
      setAssignedUser(currentUser.name);
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
    onStepComplete(step.id, stepNotes);
    setStepNotes('');
    setIsProcessingStep(false);

    // Move to next step or show completion
    if (stepIndex < totalSteps - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      setShowNextActionDialog(true);
    }
  };

  const handleNextAction = (action: 'REFUEL' | 'RENTABLE') => {
    onWorkflowComplete(action);
  };

  if (showNextActionDialog) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-workflow-step-completed">
            <CheckCircle className="w-6 h-6" />
            Cleaning Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg mb-4">Vehicle {vehicleVin.substring(0, 8)}... has been cleaned successfully.</p>
            <p className="text-muted-foreground mb-6">What should happen next with this vehicle?</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Show fuel/charging options based on vehicle fuel type */}
            {(vehicle.fuelType === 'PETROL' || vehicle.fuelType === 'DIESEL' || vehicle.fuelType === 'HYBRID') && (
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleNextAction('REFUEL')}>
                <CardContent className="p-6 text-center">
                  <Fuel className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                  <h3 className="font-semibold mb-2">Needs Refueling</h3>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.fuelType} vehicle needs fuel before becoming rentable
                  </p>
                  <Button className="mt-4 w-full bg-orange-500 hover:bg-orange-600">
                    Send to Refuel Queue
                  </Button>
                </CardContent>
              </Card>
            )}

            {(vehicle.fuelType === 'EV' || vehicle.fuelType === 'HYBRID') && (
              <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleNextAction('REFUEL')}>
                <CardContent className="p-6 text-center">
                  <Fuel className="w-8 h-8 mx-auto mb-3 text-workflow-step-progress" />
                  <h3 className="font-semibold mb-2">Needs Charging</h3>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.fuelType} vehicle needs charging before becoming rentable
                  </p>
                  <Button className="mt-4 w-full bg-workflow-step-progress hover:bg-workflow-step-progress/80">
                    Send to Charging Queue
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => handleNextAction('RENTABLE')}>
              <CardContent className="p-6 text-center">
                <Car className="w-8 h-8 mx-auto mb-3 text-green-500" />
                <h3 className="font-semibold mb-2">Ready to Rent</h3>
                <p className="text-sm text-muted-foreground">
                  Vehicle is clean and ready for customers
                </p>
                <Button className="mt-4 w-full bg-green-500 hover:bg-green-600">
                  Make Rentable
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
              <Sparkles className="w-5 h-5 text-workflow-step-progress" />
              Vehicle Cleaning Workflow
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

          return (
            <Card key={step.id} className={`
              ${isActive ? 'ring-2 ring-hertz-yellow' : ''}
              ${isCompleted ? 'bg-workflow-step-completed-bg' : ''}
              transition-all
            `}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-workflow-step-completed text-white' : 
                        isActive ? 'bg-hertz-yellow text-hertz-navy' : 
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
                        className="bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold"
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
                    <div>
                      <Label htmlFor="step-notes">Notes (optional)</Label>
                      <Textarea
                        id="step-notes"
                        placeholder="Add any notes about this step..."
                        value={stepNotes}
                        onChange={(e) => setStepNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleCompleteStep(index)}
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