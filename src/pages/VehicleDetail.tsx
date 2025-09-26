import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WorkflowList } from '@/components/workflows/workflow-list';
import { 
  ArrowLeft,
  Car,
  MapPin,
  Calendar,
  Gauge,
  Settings,
  Flag,
  Hash,
  FileText,
  Clock,
  Edit
} from 'lucide-react';
import type { Vehicle, Workflow } from '@/types/fleet';

// Mock data - will be replaced with API calls
const mockVehicle: Vehicle = {
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
  operationStatus: 'ACTIVE',
  lastMileage: 15240,
  modelDescription: 'Civic LX',
  statusChangeReason: 'Routine maintenance completed',
  fuelType: 'PETROL',
  createdAt: '2023-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z'
};

const mockWorkflows: Workflow[] = [
  {
    id: 'wf-001',
    vehicleVin: '1HGBH41JXMN109186',
    stage: 'CLEANING',
    status: 'COMPLETED',
    assignedUserGroup: 'CAR_CLEANER',
    priority: 'HIGH',
    startTime: '2024-01-20T14:00:00Z',
    endTime: '2024-01-20T14:25:00Z',
    estimatedDuration: 30,
    actualDuration: 25,
    notes: 'Deep clean completed. Interior and exterior detailed.',
    createdAt: '2024-01-20T13:45:00Z',
    updatedAt: '2024-01-20T14:25:00Z'
  },
  {
    id: 'wf-002',
    vehicleVin: '1HGBH41JXMN109186',
    stage: 'REFUEL',
    status: 'IN_PROGRESS',
    assignedUserGroup: 'OPERATIONS_USER',
    priority: 'MEDIUM',
    startTime: '2024-01-20T15:00:00Z',
    estimatedDuration: 15,
    notes: 'Fuel tank at 15%, filling to 100%',
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:05:00Z'
  }
];

export default function VehicleDetail() {
  const { vin } = useParams<{ vin: string }>();

  const getStatusVariant = (status: Vehicle['operationStatus']) => {
    switch (status) {
      case 'ACTIVE': return 'secondary';
      case 'INACTIVE': return 'secondary'; 
      case 'MAINTENANCE': return 'secondary';
      case 'HOLD': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: Vehicle['operationStatus']) => {
    switch (status) {
      case 'ACTIVE': return 'bg-status-completed text-white';
      case 'INACTIVE': return 'bg-muted text-muted-foreground';
      case 'MAINTENANCE': return 'bg-status-warning text-white';
      case 'HOLD': return 'bg-status-error text-white';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/vehicles" className="hover:bg-hertz-yellow hover:text-hertz-navy">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vehicles
            </Link>
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-heading font-bold text-foreground">
              {mockVehicle.make} {mockVehicle.modelDescription}
            </h1>
            <p className="text-muted-foreground mt-1">
              VIN: {mockVehicle.vin} • License: {mockVehicle.licensePlate}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary"
              className={getStatusColor(mockVehicle.operationStatus)}
            >
              {mockVehicle.operationStatus}
            </Badge>
            <Button className="bg-hertz-yellow text-hertz-navy hover:bg-hertz-gold">
              <Edit className="w-4 h-4 mr-2" />
              Edit Vehicle
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Vehicle Information */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Make</label>
                    <p className="font-semibold">{mockVehicle.make}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Model</label>
                    <p className="font-semibold">{mockVehicle.modelDescription}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Year</label>
                    <p className="font-semibold">{mockVehicle.year}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Color</label>
                    <p className="font-semibold">{mockVehicle.color}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Car Group</label>
                    <p className="font-semibold">{mockVehicle.carGroup}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Model Group</label>
                    <p className="font-semibold">{mockVehicle.modelGroup}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Technical Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      VIN Number
                    </label>
                    <p className="font-mono text-sm bg-muted p-2 rounded">{mockVehicle.vin}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Model Code</label>
                      <p className="font-semibold">{mockVehicle.modelCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Gauge className="w-3 h-3" />
                        Last Mileage
                      </label>
                      <p className="font-semibold">{mockVehicle.lastMileage.toLocaleString()} miles</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Own Area Unit No.</label>
                    <p className="font-semibold">{mockVehicle.ownAreaUnitNo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Owning Country</label>
                    <p className="font-semibold">{mockVehicle.owningCountry}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location Country</label>
                    <p className="font-semibold">{mockVehicle.locationCountry}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Installation Date
                    </label>
                    <p className="font-semibold">
                      {new Date(mockVehicle.installationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last Updated
                    </label>
                    <p className="font-semibold">
                      {new Date(mockVehicle.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {mockVehicle.holdFlag && (
                  <div className="border-l-4 border-status-warning pl-4 bg-status-warning/5 p-3 rounded-r">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-status-warning" />
                      <span className="font-medium text-status-warning">Vehicle on Hold</span>
                    </div>
                    {mockVehicle.holdDate && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Hold Date: {new Date(mockVehicle.holdDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                
                {mockVehicle.statusChangeReason && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Status Change Reason
                    </label>
                    <p className="text-sm bg-muted p-2 rounded">{mockVehicle.statusChangeReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Workflow History */}
          <div className="space-y-6">
            <WorkflowList workflows={mockWorkflows} showVehicleInfo={false} />
          </div>
        </div>
      </main>
    </div>
  );
}