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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Clock, CheckCircle, Car, MapPin, Calendar } from 'lucide-react';
import type { Workflow } from '@/types/fleet';

interface CleaningWorkOrderTableProps {
  workflows: Workflow[];
}

export function CleaningWorkOrderTable({ workflows }: CleaningWorkOrderTableProps) {
  const getStatusIcon = (status: Workflow['status']) => {
    switch (status) {
      case 'PENDING': return Clock;
      case 'IN_PROGRESS': return Play;
      case 'COMPLETED': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-status-pending';
      case 'IN_PROGRESS': return 'bg-status-progress';
      case 'COMPLETED': return 'bg-status-completed';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Workflow['priority']) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Cleaning Work Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => {
                const StatusIcon = getStatusIcon(workflow.status);
                return (
                  <TableRow key={workflow.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">
                      WO-{workflow.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {workflow.vehicleVin.substring(0, 8)}...
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          Location A-12
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`${getPriorityColor(workflow.priority)} border-0`}
                      >
                        {workflow.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" />
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(workflow.status)} text-white`}
                        >
                          {workflow.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-col">
                        <span>Est: {workflow.estimatedDuration}min</span>
                        {workflow.actualDuration && (
                          <span className="text-muted-foreground">
                            Actual: {workflow.actualDuration}min
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(workflow.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {workflow.status === 'PENDING' ? (
                        <Button 
                          size="sm" 
                          asChild
                          className="bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold"
                        >
                          <Link to={`/workflows/cleaning/execute/${workflow.id}`}>
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Link>
                        </Button>
                      ) : workflow.status === 'IN_PROGRESS' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="hover:bg-hertz-yellow hover:text-hertz-navy"
                        >
                          <Link to={`/workflows/cleaning/execute/${workflow.id}`}>
                            Continue
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          asChild
                          className="text-muted-foreground"
                        >
                          <Link to={`/workflows/cleaning/execute/${workflow.id}`}>
                            View
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {workflows.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No cleaning work orders</h3>
            <p className="text-muted-foreground">
              All vehicles are clean or in other workflow stages.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}