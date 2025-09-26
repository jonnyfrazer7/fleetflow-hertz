import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type WorkflowStatus, type WorkflowStage, type UserRole } from '@/types/fleet';

interface StatusIndicatorProps {
  status: WorkflowStatus;
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const getVariant = (status: WorkflowStatus) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'IN_PROGRESS':
        return 'default';
      case 'COMPLETED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: WorkflowStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-status-pending text-white';
      case 'IN_PROGRESS':
        return 'bg-status-progress text-white';
      case 'COMPLETED':
        return 'bg-status-completed text-white';
      default:
        return '';
    }
  };

  return (
    <Badge variant={getVariant(status)} className={cn(getStatusColor(status), className)}>
      {status.replace('_', ' ')}
    </Badge>
  );
}

interface StageIndicatorProps {
  stage: WorkflowStage;
  className?: string;
}

export function StageIndicator({ stage, className }: StageIndicatorProps) {
  const getStageLabel = (stage: WorkflowStage) => {
    switch (stage) {
      case 'CLEANING':
        return 'Cleaning';
      case 'KEY_HANDLING':
        return 'Key Handling';
      case 'REFUEL':
        return 'Refuel';
      case 'EV_CHARGING':
        return 'EV Charging';
      case 'LOCATION_MOVE':
        return 'Location Move';
      default:
        return stage;
    }
  };

  return (
    <Badge variant="outline" className={className}>
      {getStageLabel(stage)}
    </Badge>
  );
}

interface PriorityIndicatorProps {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  className?: string;
}

export function PriorityIndicator({ priority, className }: PriorityIndicatorProps) {
  const getVariant = () => 'secondary' as const;
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-muted text-muted-foreground';
      case 'MEDIUM':
        return 'bg-status-pending text-white';
      case 'HIGH':
        return 'bg-status-progress text-white';
      case 'URGENT':
        return 'bg-status-error text-white animate-pulse';
      default:
        return '';
    }
  };

  return (
    <Badge variant={getVariant()} className={cn(getPriorityColor(priority), className)}>
      {priority}
    </Badge>
  );
}

interface RoleIndicatorProps {
  role: UserRole;
  className?: string;
}

export function RoleIndicator({ role, className }: RoleIndicatorProps) {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'CAR_CLEANER':
        return 'Car Cleaner';
      case 'OPERATIONS_USER':
        return 'Operations';
      case 'MANAGER':
        return 'Manager';
      default:
        return role;
    }
  };

  return (
    <Badge variant="secondary" className={className}>
      {getRoleLabel(role)}
    </Badge>
  );
}