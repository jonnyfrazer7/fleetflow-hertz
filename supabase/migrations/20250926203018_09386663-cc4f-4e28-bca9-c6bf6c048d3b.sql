-- Create user roles enum for fleet management system
CREATE TYPE public.app_role AS ENUM ('admin', 'car_cleaner', 'operations_user', 'manager');

-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  location_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  location_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  vin TEXT NOT NULL PRIMARY KEY,
  make TEXT NOT NULL,
  year INTEGER NOT NULL,
  car_group TEXT NOT NULL,
  model_group TEXT NOT NULL,
  color TEXT NOT NULL,
  installation_date DATE NOT NULL,
  owning_country TEXT NOT NULL,
  location_country TEXT NOT NULL,
  license_plate TEXT,
  own_area_unit_no TEXT,
  model_code TEXT,
  hold_flag BOOLEAN NOT NULL DEFAULT FALSE,
  operation_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (operation_status IN ('ACTIVE', 'MAINTENANCE', 'RETIRED')),
  last_mileage INTEGER,
  model_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create workflows table
CREATE TABLE public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_vin TEXT NOT NULL REFERENCES public.vehicles(vin) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('CLEANING', 'KEY_HANDLING', 'REFUEL', 'EV_CHARGING', 'LOCATION_MOVE')),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  assigned_user_group TEXT NOT NULL CHECK (assigned_user_group IN ('CAR_CLEANER', 'OPERATIONS_USER')),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER NOT NULL DEFAULT 30,
  actual_duration INTEGER,
  assigned_user_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create RLS policies for vehicles
CREATE POLICY "Authenticated users can view vehicles"
ON public.vehicles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Operations and admins can manage vehicles"
ON public.vehicles
FOR ALL
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'operations_user') OR
  public.has_role(auth.uid(), 'manager')
);

-- Create RLS policies for workflows
CREATE POLICY "Users can view relevant workflows"
ON public.workflows
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager') OR
  (assigned_user_group = 'CAR_CLEANER' AND public.has_role(auth.uid(), 'car_cleaner')) OR
  (assigned_user_group = 'OPERATIONS_USER' AND public.has_role(auth.uid(), 'operations_user')) OR
  assigned_user_id = auth.uid()
);

CREATE POLICY "Users can create workflows in their domain"
ON public.workflows
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager') OR
  public.has_role(auth.uid(), 'operations_user')
);

CREATE POLICY "Users can update workflows they're assigned to"
ON public.workflows
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager') OR
  assigned_user_id = auth.uid() OR
  (assigned_user_group = 'CAR_CLEANER' AND public.has_role(auth.uid(), 'car_cleaner')) OR
  (assigned_user_group = 'OPERATIONS_USER' AND public.has_role(auth.uid(), 'operations_user'))
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.vehicles (vin, make, year, car_group, model_group, color, installation_date, owning_country, location_country, license_plate, own_area_unit_no, model_code, model_description, last_mileage) VALUES
('1HGBH41JXMN109186', 'Honda', 2023, 'Compact', 'Civic', 'Silver', '2023-01-15', 'USA', 'USA', 'ABC-1234', 'LAX001', 'CIV23', 'Civic LX', 15240),
('2T1BURHE6JC123456', 'Toyota', 2024, 'Mid-Size', 'Camry', 'Blue', '2024-01-01', 'USA', 'USA', 'XYZ-5678', 'LAX002', 'CAM24', 'Camry LE', 8500),
('3FAHP0HA1CR123789', 'Ford', 2023, 'Full-Size', 'Fusion', 'White', '2023-06-15', 'USA', 'USA', 'DEF-9012', 'LAX003', 'FUS23', 'Fusion SE', 22100),
('5NPE34AF6KH123456', 'Hyundai', 2024, 'Electric', 'Ioniq 5', 'Black', '2024-02-01', 'USA', 'USA', 'GHI-3456', 'LAX004', 'ION24', 'Ioniq 5 SEL', 5200),
('1FTFW1ET5DFC12345', 'Ford', 2023, 'Truck', 'F-150', 'Red', '2023-03-20', 'USA', 'USA', 'JKL-7890', 'LAX005', 'F15023', 'F-150 XLT', 18900);