import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Workflow, WorkflowStage, WorkflowPriority } from '@/types/fleet';

export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(workflow => ({
        id: workflow.id,
        vehicleVin: workflow.vehicle_vin,
        stage: workflow.stage as WorkflowStage,
        status: workflow.status as Workflow['status'],
        assignedUserGroup: workflow.assigned_user_group as Workflow['assignedUserGroup'],
        priority: workflow.priority as WorkflowPriority,
        startTime: workflow.start_time || undefined,
        endTime: workflow.end_time || undefined,
        estimatedDuration: workflow.estimated_duration,
        actualDuration: workflow.actual_duration || undefined,
        assignedUserId: workflow.assigned_user_id || undefined,
        notes: workflow.notes || undefined,
        createdAt: workflow.created_at,
        updatedAt: workflow.updated_at
      })) as Workflow[];
    },
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workflow: {
      vehicleVin: string;
      stage: WorkflowStage;
      priority: WorkflowPriority;
      estimatedDuration: number;
    }) => {
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          vehicle_vin: workflow.vehicleVin,
          stage: workflow.stage,
          priority: workflow.priority,
          estimated_duration: workflow.estimatedDuration,
          assigned_user_group: workflow.stage === 'CLEANING' ? 'CAR_CLEANER' : 'OPERATIONS_USER'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast({
        title: 'Workflow Created',
        description: 'New turnaround workflow has been started successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create workflow. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to create workflow:', error);
    },
  });
}