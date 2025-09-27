-- Add location_id column to vehicles table
ALTER TABLE public.vehicles ADD COLUMN location_id UUID;

-- Add foreign key constraint to locations table
ALTER TABLE public.vehicles ADD CONSTRAINT fk_vehicles_location 
  FOREIGN KEY (location_id) REFERENCES public.locations(id);

-- Populate vehicles with random rental location IDs
WITH random_locations AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY RANDOM()) as rn 
  FROM public.locations 
  WHERE type = 'rental'
),
vehicles_with_row_numbers AS (
  SELECT vin, ROW_NUMBER() OVER (ORDER BY RANDOM()) as rn 
  FROM public.vehicles
)
UPDATE public.vehicles 
SET location_id = random_locations.id
FROM random_locations, vehicles_with_row_numbers
WHERE vehicles_with_row_numbers.vin = vehicles.vin 
  AND random_locations.rn = ((vehicles_with_row_numbers.rn - 1) % 30) + 1;