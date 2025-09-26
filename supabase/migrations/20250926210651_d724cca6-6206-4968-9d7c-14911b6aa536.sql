-- Add fuel_type column to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN fuel_type text NOT NULL DEFAULT 'PETROL' 
CHECK (fuel_type IN ('PETROL', 'DIESEL', 'HYBRID', 'EV'));

-- Add an index for better performance on fuel_type queries
CREATE INDEX idx_vehicles_fuel_type ON public.vehicles(fuel_type);