import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser, useWorkforceUsers } from '@/hooks/use-workforce-users';
import { Vehicle } from '@/types/fleet';
import { 
  Car, 
  User, 
  Hash,
  Gauge,
  Fuel,
  Battery,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RentalReturnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle;
}

interface RentalReturnData {
  assignedUserId: string;
  assignedUserName: string;
  rentalAgreementNumber: string;
  mileage: string;
  fuelLevel?: string; // For petrol/diesel
  chargeLevel?: string; // For EV
  hybridFuelLevel?: string; // For hybrid fuel
  hybridChargeLevel?: string; // For hybrid charge
}

export function RentalReturnDialog({ open, onOpenChange, vehicle }: RentalReturnDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: currentUser } = useCurrentUser();
  const { data: workforceUsers = [] } = useWorkforceUsers();
  const [step, setStep] = useState<'capture' | 'confirm'>('capture');

  // Debug vehicle info
  console.log('Vehicle in dialog:', vehicle);

  const [returnData, setReturnData] = useState<RentalReturnData>({
    assignedUserId: '',
    assignedUserName: '',
    rentalAgreementNumber: '',
    mileage: '',
    fuelLevel: '',
    chargeLevel: '',
    hybridFuelLevel: '',
    hybridChargeLevel: ''
  });

  // Auto-assign current user when dialog opens
  React.useEffect(() => {
    if (currentUser && open && !returnData.assignedUserId) {
      setReturnData(prev => ({
        ...prev,
        assignedUserId: currentUser.id,
        assignedUserName: currentUser.name
      }));
    }
  }, [currentUser, open, returnData.assignedUserId]);

  // Debug logging
  React.useEffect(() => {
    console.log('Continue button state:', { 
      canProceed: canProceed(), 
      returnData, 
      vehicleFuelType: vehicle.fuelType,
      step 
    });
  }, [returnData, vehicle.fuelType, step]);

  const updateReturnData = (field: keyof RentalReturnData, value: string) => {
    setReturnData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    const baseValid = returnData.assignedUserId && 
                     returnData.rentalAgreementNumber.trim() && 
                     returnData.mileage.trim();

    if (!baseValid) return false;

    // Check fuel/charge requirements based on vehicle type
    switch (vehicle.fuelType) {
      case 'EV':
        const chargeValid = returnData.chargeLevel && returnData.chargeLevel.trim() !== '';
        console.log('EV validation:', { chargeLevel: returnData.chargeLevel, chargeValid });
        return chargeValid;
      case 'PETROL':
      case 'DIESEL':
        const fuelValid = returnData.fuelLevel && returnData.fuelLevel.trim() !== '';
        console.log('Fuel validation:', { fuelLevel: returnData.fuelLevel, fuelValid });
        return fuelValid;
      case 'HYBRID':
        const hybridFuelValid = returnData.hybridFuelLevel && returnData.hybridFuelLevel.trim() !== '';
        const hybridChargeValid = returnData.hybridChargeLevel && returnData.hybridChargeLevel.trim() !== '';
        console.log('Hybrid validation:', { 
          hybridFuelLevel: returnData.hybridFuelLevel, 
          hybridChargeLevel: returnData.hybridChargeLevel, 
          hybridFuelValid, 
          hybridChargeValid 
        });
        return hybridFuelValid && hybridChargeValid;
      default:
        return true;
    }
  };

  const handleContinue = () => {
    if (step === 'capture') {
      setStep('confirm');
    }
  };

  const handleInitiateCleaning = () => {
    // Create a workflow entry for cleaning
    toast({
      title: "Rental Return Initiated",
      description: `Starting cleaning workflow for ${vehicle.make} ${vehicle.modelDescription}`,
    });
    
    onOpenChange(false);
    // Navigate to cleaning workflow with the vehicle and return data
    navigate(`/workflows/cleaning/execute/new?vehicleVin=${vehicle.vin}&returnData=${encodeURIComponent(JSON.stringify(returnData))}`);
  };

  const handleSkipCleaning = () => {
    toast({
      title: "Rental Return Completed", 
      description: `Vehicle ${vehicle.make} ${vehicle.modelDescription} return processed without cleaning`,
    });
    onOpenChange(false);
    // Could navigate to other workflows or vehicle detail page
    navigate(`/vehicles/${vehicle.vin}`);
  };

  const resetDialog = () => {
    setStep('capture');
    setReturnData({
      assignedUserId: currentUser?.id || '',
      assignedUserName: currentUser?.name || '',
      rentalAgreementNumber: '',
      mileage: '',
      fuelLevel: '',
      chargeLevel: '',
      hybridFuelLevel: '',
      hybridChargeLevel: ''
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog();
    }
    onOpenChange(newOpen);
  };

  const renderFuelChargeInputs = () => {
    switch (vehicle.fuelType) {
      case 'EV':
        return (
          <div>
            <Label>Battery Charge Level (%)</Label>
            <div className="relative">
              <Battery className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="e.g., 25"
                min="0"
                max="100"
                className="pl-10"
                value={returnData.chargeLevel}
                onChange={(e) => updateReturnData('chargeLevel', e.target.value)}
              />
            </div>
          </div>
        );

      case 'PETROL':
      case 'DIESEL':
        return (
          <div>
            <Label>Fuel Level (%)</Label>
            <div className="relative">
              <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="e.g., 15"
                min="0"
                max="100"
                className="pl-10"
                value={returnData.fuelLevel}
                onChange={(e) => updateReturnData('fuelLevel', e.target.value)}
              />
            </div>
          </div>
        );

      case 'HYBRID':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fuel Level (%)</Label>
              <div className="relative">
                <Fuel className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="e.g., 15"
                  min="0"
                  max="100"
                  className="pl-10"
                  value={returnData.hybridFuelLevel}
                  onChange={(e) => updateReturnData('hybridFuelLevel', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Battery Charge (%)</Label>
              <div className="relative">
                <Battery className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="e.g., 25"
                  min="0"
                  max="100"
                  className="pl-10"
                  value={returnData.hybridChargeLevel}
                  onChange={(e) => updateReturnData('hybridChargeLevel', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-hertz-yellow" />
            {step === 'capture' ? 'Initiate Rental Return' : 'Confirm Turnaround Process'}
          </DialogTitle>
          <DialogDescription>
            {step === 'capture' 
              ? `Process the return for ${vehicle.make} ${vehicle.modelDescription} (${vehicle.licensePlate})`
              : 'Review return details and start the turnaround workflow'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'capture' ? (
          <div className="space-y-6">
            {/* Vehicle Info */}
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">VIN:</span> {vehicle.vin}
                  </div>
                  <div>
                    <span className="font-medium">License:</span> {vehicle.licensePlate}
                  </div>
                  <div>
                    <span className="font-medium">Fuel Type:</span> {vehicle.fuelType}
                  </div>
                  <div>
                    <span className="font-medium">Last Mileage:</span> {vehicle.lastMileage?.toLocaleString() || 'N/A'} miles
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Return Information Form */}
            <div className="space-y-4">
              <div>
                <Label>Assigned User</Label>
                <Select 
                  value={returnData.assignedUserId} 
                  onValueChange={(value) => {
                    const user = workforceUsers.find(u => u.id === value);
                    updateReturnData('assignedUserId', value);
                    updateReturnData('assignedUserName', user?.name || '');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user processing return" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {workforceUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.role}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rental Agreement Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g., RA-2024-001234"
                    className="pl-10"
                    value={returnData.rentalAgreementNumber}
                    onChange={(e) => updateReturnData('rentalAgreementNumber', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Current Mileage</Label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="e.g., 15750"
                    className="pl-10"
                    value={returnData.mileage}
                    onChange={(e) => updateReturnData('mileage', e.target.value)}
                  />
                </div>
              </div>

              {renderFuelChargeInputs()}
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => handleOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleContinue}
                disabled={!canProceed()}
                className="flex-1 bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Return Summary */}
            <Card className="bg-info-bg border-info-border">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-info-text mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Return Information Captured
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div><span className="font-medium">Vehicle:</span> {vehicle.make} {vehicle.modelDescription} ({vehicle.licensePlate})</div>
                  <div><span className="font-medium">Processed by:</span> {returnData.assignedUserName}</div>
                  <div><span className="font-medium">Agreement:</span> {returnData.rentalAgreementNumber}</div>
                  <div><span className="font-medium">Mileage:</span> {returnData.mileage} miles</div>
                  {vehicle.fuelType === 'EV' && (
                    <div><span className="font-medium">Battery Charge:</span> {returnData.chargeLevel}%</div>
                  )}
                  {(vehicle.fuelType === 'PETROL' || vehicle.fuelType === 'DIESEL') && (
                    <div><span className="font-medium">Fuel Level:</span> {returnData.fuelLevel}%</div>
                  )}
                  {vehicle.fuelType === 'HYBRID' && (
                    <>
                      <div><span className="font-medium">Fuel Level:</span> {returnData.hybridFuelLevel}%</div>
                      <div><span className="font-medium">Battery Charge:</span> {returnData.hybridChargeLevel}%</div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Ready to Start Turnaround Process</h3>
              <p className="text-muted-foreground">
                Do you want to clean this vehicle as part of the turnaround process?
              </p>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleSkipCleaning}
                  className="flex-1"
                >
                  Skip Cleaning
                </Button>
                <Button 
                  onClick={handleInitiateCleaning}
                  className="flex-1 bg-workflow-step-completed hover:bg-workflow-step-completed/80 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Yes, Start Cleaning
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}