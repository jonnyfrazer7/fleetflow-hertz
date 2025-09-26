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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, Play, Clock, Car, MapPin, ExternalLink } from 'lucide-react';
import { Workflow, Vehicle } from '@/types/fleet';

interface RefuelWorkOrderTableProps {
  workflows: Workflow[];
  vehicles: Vehicle[];
}

export function RefuelWorkOrderTable({ workflows, vehicles }: RefuelWorkOrderTableProps) {
  const refuelWorkflows = workflows.filter(w => w.stage === 'REFUEL');

  const getVehicleDetails = (vin: string) => {
    return vehicles.find(v => v.vin === vin);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-destructive text-white';
      case 'HIGH': return 'bg-priority-high text-white';
      case 'MEDIUM': return 'bg-priority-medium text-black';
      case 'LOW': return 'bg-priority-low text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-status-pending/10 text-status-pending border-status-pending/20';
      case 'IN_PROGRESS': return 'bg-status-progress/10 text-status-progress border-status-progress/20';
      case 'COMPLETED': return 'bg-status-completed/10 text-status-completed border-status-completed/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFuelTypeIcon = (fuelType: string) => {
    switch (fuelType) {
      case 'EV': return '🔌';
      case 'HYBRID': return '⚡';
      case 'DIESEL': return '⛽';
      case 'PETROL': return '⛽';
      default: return '⛽';
    }
  };

  if (refuelWorkflows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-orange-500" />
            Refuel Work Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Fuel className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No refuel work orders</h3>
            <p className="mt-1 text-sm text-gray-500">
              No vehicles currently need refueling or charging.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-orange-500" />
          Refuel Work Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Work Order</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {refuelWorkflows.map((workflow) => {
              const vehicle = getVehicleDetails(workflow.vehicleVin);
              
              return (
                <TableRow key={workflow.id}>
                  <TableCell className="font-mono text-sm">
                    WO-{workflow.id.substring(0, 8)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-sm">
                          {vehicle?.make} {vehicle?.modelDescription}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {workflow.vehicleVin.substring(0, 12)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getFuelTypeIcon(vehicle?.fuelType || '')}</span>
                      <span className="text-sm font-medium">{vehicle?.fuelType}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getPriorityColor(workflow.priority)}>
                      {workflow.priority}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(workflow.status)}>
                      {workflow.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {workflow.estimatedDuration}m
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(workflow.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {workflow.status === 'PENDING' && (
                        <Link to={`/workflows/refuel/execute/${workflow.id}`}>
                          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        </Link>
                      )}
                      
                      {workflow.status === 'IN_PROGRESS' && (
                        <Link to={`/workflows/refuel/execute/${workflow.id}`}>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Continue
                          </Button>
                        </Link>
                      )}
                      
                      {workflow.status === 'COMPLETED' && (
                        <Badge className="bg-workflow-step-completed text-white">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}