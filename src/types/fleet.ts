// Fleet Management Types

export interface Vehicle {
  vin: string; // Primary key
  make: string;
  year: number;
  carGroup: string;
  modelGroup: string;
  color: string;
  installationDate: string;
  owningCountry: string;
  locationCountry: string;
  licensePlate: string;
  ownAreaUnitNo: string;
  modelCode: string;
  holdFlag: boolean;
  holdDate?: string;
  operationStatus: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'HOLD';
  lastMileage: number;
  modelDescription: string;
  statusChangeReason?: string;
  fuelType: 'PETROL' | 'DIESEL' | 'HYBRID' | 'EV';
  createdAt: string;
  updatedAt: string;
}

export type WorkflowStage = 
  | 'CLEANING' 
  | 'KEY_HANDLING' 
  | 'REFUEL' 
  | 'EV_CHARGING' 
  | 'LOCATION_MOVE';

export type WorkflowStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type WorkflowPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type UserRole = 'CAR_CLEANER' | 'OPERATIONS_USER' | 'MANAGER';

export interface Workflow {
  id: string;
  vehicleVin: string;
  stage: WorkflowStage;
  status: WorkflowStatus;
  assignedUserGroup: UserRole;
  assignedWorkforceUserId?: string;
  startTime?: string;
  endTime?: string;
  priority: WorkflowPriority;
  notes?: string;
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  assignedUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalVehicles: number;
  readyForRent: number;
  inTurnaround: number;
  averageTurnaroundTime: number;
  activeWorkflows: number;
  completedToday: number;
}

export interface WorkflowAnalytics {
  stage: WorkflowStage;
  averageDuration: number;
  completionRate: number;
  bottleneckScore: number;
  totalCompleted: number;
}