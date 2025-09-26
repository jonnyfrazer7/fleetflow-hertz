-- Add some test vehicles with different fuel types
INSERT INTO vehicles (
  vin, make, model_description, year, car_group, model_group, color,
  installation_date, owning_country, location_country, license_plate,
  operation_status, fuel_type, created_at, updated_at
) VALUES 
-- Tesla Model 3 (EV)
('5YJ3E1EA5KF123456', 'Tesla', 'Model 3 Standard', 2023, 'LUXURY', 'SEDAN', 'White',
 '2023-01-15', 'USA', 'USA', 'TSL-001', 'ACTIVE', 'EV', NOW(), NOW()),

-- Toyota Prius (Hybrid)
('JTDKB20U123456789', 'Toyota', 'Prius LE Hybrid', 2023, 'ECONOMY', 'SEDAN', 'Silver',
 '2023-02-10', 'USA', 'USA', 'HYB-001', 'ACTIVE', 'HYBRID', NOW(), NOW()),

-- BMW X5 (Diesel)
('5UXCR6C05LL123456', 'BMW', 'X5 xDrive35d', 2023, 'LUXURY', 'SUV', 'Black',
 '2023-03-05', 'USA', 'USA', 'DSL-001', 'ACTIVE', 'DIESEL', NOW(), NOW()),

-- Audi e-tron (EV)
('WA1LAAGE5LB123456', 'Audi', 'e-tron Premium', 2023, 'LUXURY', 'SUV', 'Blue',
 '2023-04-01', 'USA', 'USA', 'AUD-001', 'ACTIVE', 'EV', NOW(), NOW()),

-- Honda CR-V Hybrid
('7FARW2H85ME123456', 'Honda', 'CR-V Hybrid EX', 2023, 'MIDSIZE', 'SUV', 'Red',
 '2023-05-15', 'USA', 'USA', 'CRV-001', 'ACTIVE', 'HYBRID', NOW(), NOW());