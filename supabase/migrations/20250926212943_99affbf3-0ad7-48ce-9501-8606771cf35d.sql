-- Create locations table for fuel stations and rental locations
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rental', 'fuel')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policies for locations (readable by authenticated users)
CREATE POLICY "Authenticated users can view locations" 
ON public.locations 
FOR SELECT 
USING (true);

CREATE POLICY "Operations and admins can manage locations" 
ON public.locations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'operations_user'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Insert mock location data
INSERT INTO public.locations (name, address, type) VALUES
('Shell Fuel Station Downtown', '123 Main Street, Downtown, City', 'fuel'),
('BP Service Center North', '456 Oak Avenue, North District, City', 'fuel'),
('Company Fuel Depot', '789 Industrial Blvd, Company Premises', 'fuel'),
('Airport Rental Hub', '100 Airport Drive, Terminal 1, City', 'rental'),
('Downtown Rental Center', '200 Business District, Suite 5, City', 'rental'),
('Mall Pickup Location', '300 Shopping Center Way, East Mall, City', 'rental');

-- Add trigger for automatic timestamp updates on locations
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create workforce_users table for assignment functionality (independent of auth.users)
CREATE TABLE public.workforce_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('car_cleaner', 'operations_user', 'manager')),
  phone TEXT,
  location_code TEXT,
  is_active BOOLEAN DEFAULT true,
  is_current_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workforce_users ENABLE ROW LEVEL SECURITY;

-- Create policies for workforce_users
CREATE POLICY "Authenticated users can view workforce users" 
ON public.workforce_users 
FOR SELECT 
USING (true);

CREATE POLICY "Operations and admins can manage workforce users" 
ON public.workforce_users 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'operations_user'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Insert mock workforce user data
INSERT INTO public.workforce_users (name, role, phone, location_code, is_active, is_current_user) VALUES
('John Smith', 'car_cleaner', '+1-555-0101', 'NYC', true, false),
('Sarah Johnson', 'operations_user', '+1-555-0102', 'NYC', true, false),
('Mike Chen', 'car_cleaner', '+1-555-0103', 'NYC', true, false),
('Lisa Rodriguez', 'operations_user', '+1-555-0104', 'NYC', true, false),
('Current User', 'manager', '+1-555-0105', 'NYC', true, true);

-- Add trigger for automatic timestamp updates on workforce_users
CREATE TRIGGER update_workforce_users_updated_at
BEFORE UPDATE ON public.workforce_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add assigned_workforce_user_id to workflows table
ALTER TABLE public.workflows ADD COLUMN assigned_workforce_user_id UUID REFERENCES public.workforce_users(id);