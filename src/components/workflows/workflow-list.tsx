import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusIndicator, StageIndicator, PriorityIndicator } from '@/components/ui/status-indicator';
import { 
  ClipboardList, 
  Clock, 
  Car,
  Play,
  CheckCircle
} from 'lucide-react';
import { type Workflow, type UserRole } from '@/types/fleet';

interface WorkflowListProps {
  workflows: Workflow[];
  userRole?: UserRole;
  showVehicleInfo?: boolean;
}

export function WorkflowList({ workflows, userRole, showVehicleInfo = true }: WorkflowListProps) {
  const filteredWorkflows = userRole 
    ? workflows.filter(w => w.assignedUserGroup === userRole)
    : workflows;

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getActionButton = (workflow: Workflow) => {
    switch (workflow.status) {
      case 'PENDING':
        return (
          <Button size="sm" variant="outline" className="hover:bg-hertz-yellow hover:text-hertz-navy">
            <Play className="w-3 h-3 mr-1" />
            Start
          </Button>
        );
      case 'IN_PROGRESS':
        return (
          <Button size="sm" variant="outline" className="hover:bg-status-completed hover:text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Complete
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          {userRole ? `${userRole.replace('_', ' ')} Tasks` : 'All Workflows'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {showVehicleInfo && <TableHead>Vehicle</TableHead>}
                <TableHead>Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkflows.map((workflow) => (
                <TableRow key={workflow.id} className="hover:bg-muted/50">
                  {showVehicleInfo && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-muted-foreground" />
                        <Link 
                          to={`/vehicles/${workflow.vehicleVin}`}
                          className="font-mono text-sm hover:underline"
                        >
                          {workflow.vehicleVin.substring(0, 8)}...
                        </Link>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <StageIndicator stage={workflow.stage} />
                  </TableCell>
                  <TableCell>
                    <StatusIndicator status={workflow.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityIndicator priority={workflow.priority} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-3 h-3" />
                      {workflow.actualDuration 
                        ? formatDuration(workflow.actualDuration)
                        : `~${formatDuration(workflow.estimatedDuration)}`
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getActionButton(workflow)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}