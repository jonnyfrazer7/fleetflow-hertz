import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { VehicleTable } from '@/components/vehicles/vehicle-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  Filter,
  Plus,
  Download,
  Car
} from 'lucide-react';

const mockVehicles = [
  {
    vin: '1HGBH41JXMN109186',
    make: 'Honda',
    year: 2023,
    carGroup: 'Compact',
    modelGroup: 'Civic',
    color: 'Silver',
    installationDate: '2023-01-15',
    owningCountry: 'USA',
    locationCountry: 'USA',
    licensePlate: 'ABC-1234',
    ownAreaUnitNo: 'LAX001',
    modelCode: 'CIV23',
    holdFlag: false,
    operationStatus: 'ACTIVE' as const,
    lastMileage: 15240,
    modelDescription: 'Civic LX',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    vin: '2T1BURHE6JC123456',
    make: 'Toyota',
    year: 2024,
    carGroup: 'Mid-Size',
    modelGroup: 'Camry',
    color: 'Blue',
    installationDate: '2024-01-01',
    owningCountry: 'USA',
    locationCountry: 'USA', 
    licensePlate: 'XYZ-5678',
    ownAreaUnitNo: 'LAX002',
    modelCode: 'CAM24',
    holdFlag: false,
    operationStatus: 'MAINTENANCE' as const,
    lastMileage: 8500,
    modelDescription: 'Camry LE',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-20T16:15:00Z'
  }
];

export default function Vehicles() {
  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Vehicle Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your fleet vehicles and their details
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hover:bg-hertz-yellow hover:text-hertz-navy">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold">
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Search by VIN, License Plate, or Make..." 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-status-completed text-white">
                  <Car className="w-3 h-3 mr-1" />
                  Active: {mockVehicles.filter(v => v.operationStatus === 'ACTIVE').length}
                </Badge>
                <Badge variant="secondary" className="bg-status-warning text-white">
                  <Car className="w-3 h-3 mr-1" />
                  Maintenance: {mockVehicles.filter(v => v.operationStatus === 'MAINTENANCE').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Table */}
        <VehicleTable vehicles={mockVehicles} />
      </main>
    </div>
  );
}