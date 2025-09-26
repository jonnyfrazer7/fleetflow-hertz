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
import { Eye, Car, Calendar, MapPin } from 'lucide-react';
import { type Vehicle } from '@/types/fleet';

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export function VehicleTable({ vehicles }: VehicleTableProps) {
  const getStatusVariant = (status: Vehicle['operationStatus']) => {
    switch (status) {
      case 'ACTIVE': return 'active';
      case 'INACTIVE': return 'inactive';
      case 'MAINTENANCE': return 'maintenance';
      case 'HOLD': return 'hold';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Vehicle Fleet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VIN</TableHead>
                <TableHead>Make & Model</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.vin} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">
                    {vehicle.vin.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {vehicle.make} {vehicle.modelDescription}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {vehicle.year} • {vehicle.color}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {vehicle.licensePlate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3" />
                      {vehicle.locationCountry}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(vehicle.operationStatus) as any}>
                      {vehicle.operationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(vehicle.updatedAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      className="hover:bg-hertz-yellow hover:text-hertz-navy"
                    >
                      <Link to={`/vehicles/${vehicle.vin}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
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