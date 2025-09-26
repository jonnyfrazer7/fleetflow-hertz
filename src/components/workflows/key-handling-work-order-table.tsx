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
import { Key, Play, Clock, Car, ExternalLink } from 'lucide-react';
import { Workflow, Vehicle } from '@/types/fleet';

interface KeyHandlingWorkOrderTableProps {
  workflows: Workflow[];
  vehicles: Vehicle[];
}

export function KeyHandlingWorkOrderTable({ workflows, vehicles }: KeyHandlingWorkOrderTableProps) {
  const keyHandlingWorkflows = workflows.filter(w => w.stage === 'KEY_HANDLING');

  const getVehicleDetails = (vin: string) => {
    return vehicles.find(v => v.vin === vin);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (keyHandlingWorkflows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-green-500" />
            Key Handling Work Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Key className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No key handling work orders</h3>
            <p className="mt-1 text-sm text-gray-500">
              No vehicles currently need key handling.
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
          <Key className="w-5 h-5 text-green-500" />
          Key Handling Work Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Work Order</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keyHandlingWorkflows.map((workflow) => {
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
                        <Link to={`/workflows/key_handling/execute/${workflow.id}`}>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        </Link>
                      )}
                      
                      {workflow.status === 'IN_PROGRESS' && (
                        <Link to={`/workflows/key_handling/execute/${workflow.id}`}>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Continue
                          </Button>
                        </Link>
                      )}
                      
                      {workflow.status === 'COMPLETED' && (
                        <Badge className="bg-green-500 text-white">
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