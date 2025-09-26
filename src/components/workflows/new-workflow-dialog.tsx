import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Car, Fuel, Zap, Sparkles, MapPin, Wrench } from 'lucide-react';
import type { WorkflowStage, WorkflowPriority } from '@/types/fleet';

const workflowStages = [
  { value: 'CLEANING', label: 'Car Cleaning', icon: Sparkles, description: 'Interior and exterior cleaning' },
  { value: 'KEY_HANDLING', label: 'Key Handling', icon: Wrench, description: 'Key pickup and storage' },
  { value: 'REFUEL', label: 'Refuel', icon: Fuel, description: 'Gas refueling' },
  { value: 'EV_CHARGING', label: 'EV Charging', icon: Zap, description: 'Electric vehicle charging' },
  { value: 'LOCATION_MOVE', label: 'Location Move', icon: MapPin, description: 'Move between locations' }
];

const priorities = [
  { value: 'LOW', label: 'Low', color: 'bg-status-completed' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-status-pending' },
  { value: 'HIGH', label: 'High', color: 'bg-status-warning' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-status-error' }
];

interface NewWorkflowDialogProps {
  trigger?: React.ReactNode;
  onWorkflowCreate?: (workflow: {
    vehicleVin: string;
    stage: WorkflowStage;
    priority: WorkflowPriority;
    estimatedDuration: number;
  }) => void;
}

export function NewWorkflowDialog({ trigger, onWorkflowCreate }: NewWorkflowDialogProps) {
  const [open, setOpen] = useState(false);
  const [vehicleVin, setVehicleVin] = useState('');
  const [stage, setStage] = useState<WorkflowStage | ''>('');
  const [priority, setPriority] = useState<WorkflowPriority | ''>('');
  const [estimatedDuration, setEstimatedDuration] = useState('30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vehicleVin && stage && priority) {
      onWorkflowCreate?.({
        vehicleVin,
        stage: stage as WorkflowStage,
        priority: priority as WorkflowPriority,
        estimatedDuration: parseInt(estimatedDuration)
      });
      
      // Reset form
      setVehicleVin('');
      setStage('');
      setPriority('');
      setEstimatedDuration('30');
      setOpen(false);
    }
  };

  const selectedStage = workflowStages.find(s => s.value === stage);
  const selectedPriority = priorities.find(p => p.value === priority);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-hertz-yellow" />
            Start New Turnaround Workflow
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin">Vehicle VIN</Label>
            <Input
              id="vin"
              placeholder="Enter VIN (e.g., 1HGBH41JXMN109186)"
              value={vehicleVin}
              onChange={(e) => setVehicleVin(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Workflow Stage</Label>
            <Select value={stage} onValueChange={(value: WorkflowStage) => setStage(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select workflow stage" />
              </SelectTrigger>
              <SelectContent>
                {workflowStages.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    <div className="flex items-center gap-2">
                      <stage.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{stage.label}</div>
                        <div className="text-xs text-muted-foreground">{stage.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: WorkflowPriority) => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                      {priority.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="480"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
            />
          </div>

          {selectedStage && selectedPriority && (
            <div className="p-3 bg-muted rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <selectedStage.icon className="w-4 h-4" />
                  <span className="font-medium">{selectedStage.label}</span>
                </div>
                <Badge variant="outline" className={`${selectedPriority.color} text-white border-none`}>
                  {selectedPriority.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedStage.description} • Est. {estimatedDuration}min
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold"
              disabled={!vehicleVin || !stage || !priority}
            >
              Start Workflow
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}