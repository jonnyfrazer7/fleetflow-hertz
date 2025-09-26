import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WorkflowUpdateData {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  endTime?: string;
  actualDuration?: number;
  notes?: string;
}

export interface VehicleStatusUpdate {
  operationStatus: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'HOLD';
  lastMileage?: number;
}

export function useWorkflowUpdates() {
  
  const updateWorkflowStatus = async (workflowId: string, updates: WorkflowUpdateData) => {
    try {
      const { error } = await supabase
        .from('workflows')
        .update({
          status: updates.status,
          end_time: updates.endTime,
          actual_duration: updates.actualDuration,
          notes: updates.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', workflowId);

      if (error) throw error;
      
      console.log(`Workflow ${workflowId} updated to ${updates.status}`);
      return true;
    } catch (error) {
      console.error('Error updating workflow:', error);
      toast({
        title: "Error",
        description: "Failed to update workflow status",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateVehicleStatus = async (vehicleVin: string, updates: VehicleStatusUpdate) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          operation_status: updates.operationStatus,
          last_mileage: updates.lastMileage,
          updated_at: new Date().toISOString()
        })
        .eq('vin', vehicleVin);

      if (error) throw error;
      
      console.log(`Vehicle ${vehicleVin} status updated to ${updates.operationStatus}`);
      return true;
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      toast({
        title: "Error", 
        description: "Failed to update vehicle status",
        variant: "destructive"
      });
      return false;
    }
  };

  const createWorkflow = async (data: {
    vehicleVin: string;
    stage: string;
    assignedUserGroup: string;
    priority?: string;
    estimatedDuration?: number;
    assignedUserId?: string;
    notes?: string;
  }) => {
    try {
      const { data: newWorkflow, error } = await supabase
        .from('workflows')
        .insert({
          vehicle_vin: data.vehicleVin,
          stage: data.stage.toUpperCase(),
          status: 'PENDING',
          assigned_user_group: data.assignedUserGroup,
          priority: data.priority || 'MEDIUM',
          estimated_duration: data.estimatedDuration || 30,
          assigned_user_id: data.assignedUserId,
          notes: data.notes
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('New workflow created:', newWorkflow.id);
      return newWorkflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Error",
        description: "Failed to create workflow",
        variant: "destructive"
      });
      return null;
    }
  };

  const completeWorkflowAndTransition = async (
    currentWorkflowId: string | null,
    vehicleVin: string,
    nextStage: string | null,
    startTime?: string,
    currentMileage?: number
  ) => {
    try {
      // Complete current workflow if it exists
      if (currentWorkflowId && currentWorkflowId !== 'new') {
        const actualDuration = startTime ? 
          Math.round((new Date().getTime() - new Date(startTime).getTime()) / 60000) : 
          undefined;

        await updateWorkflowStatus(currentWorkflowId, {
          status: 'COMPLETED',
          endTime: new Date().toISOString(),
          actualDuration
        });
      }

      // Update vehicle status based on completion
      if (nextStage) {
        // More workflows to go - keep in maintenance/turnaround
        await updateVehicleStatus(vehicleVin, {
          operationStatus: 'MAINTENANCE',
          lastMileage: currentMileage
        });

        // Create next workflow
        const nextWorkflow = await createWorkflow({
          vehicleVin,
          stage: nextStage,
          assignedUserGroup: getAssignedUserGroup(nextStage),
          priority: 'MEDIUM',
          estimatedDuration: getEstimatedDuration(nextStage)
        });

        return nextWorkflow;
      } else {
        // All workflows complete - vehicle ready for rent
        await updateVehicleStatus(vehicleVin, {
          operationStatus: 'ACTIVE',
          lastMileage: currentMileage
        });
        return null;
      }
    } catch (error) {
      console.error('Error in workflow transition:', error);
      return null;
    }
  };

  const markWorkflowInProgress = async (workflowId: string | null, startTime?: string) => {
    if (!workflowId || workflowId === 'new') return;
    
    await updateWorkflowStatus(workflowId, {
      status: 'IN_PROGRESS'
    });
  };

  return {
    updateWorkflowStatus,
    updateVehicleStatus,
    createWorkflow,
    completeWorkflowAndTransition,
    markWorkflowInProgress
  };
}

// Helper functions
function getAssignedUserGroup(stage: string): string {
  switch (stage.toUpperCase()) {
    case 'CLEANING':
      return 'CAR_CLEANER';
    case 'REFUEL':
    case 'EV_CHARGING':
    case 'KEY_HANDLING':
      return 'OPERATIONS_USER';
    default:
      return 'OPERATIONS_USER';
  }
}

function getEstimatedDuration(stage: string): number {
  switch (stage.toUpperCase()) {
    case 'CLEANING':
      return 45;
    case 'REFUEL':
      return 15;
    case 'EV_CHARGING':
      return 60;
    case 'KEY_HANDLING':
      return 10;
    default:
      return 30;
  }
}
