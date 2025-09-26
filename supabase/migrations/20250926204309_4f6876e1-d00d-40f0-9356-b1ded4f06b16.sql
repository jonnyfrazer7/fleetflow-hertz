-- Clear existing data and populate with 50 vehicles
DELETE FROM public.workflows;
DELETE FROM public.vehicles;

-- Insert 50 vehicles with realistic data
INSERT INTO public.vehicles (vin, make, year, car_group, model_group, color, installation_date, owning_country, location_country, license_plate, own_area_unit_no, model_code, operation_status, last_mileage, model_description) VALUES
-- Compact Cars
('1HGCM82633A123456', 'Honda', 2023, 'Compact', 'Civic', 'White', '2023-01-15', 'USA', 'USA', 'LAX1001', 'LAX001', 'CIV23', 'ACTIVE', 12450, 'Civic LX'),
('2HGES16535H234567', 'Honda', 2024, 'Compact', 'Accord', 'Silver', '2024-02-20', 'USA', 'USA', 'LAX1002', 'LAX001', 'ACC24', 'ACTIVE', 8200, 'Accord Sport'),
('3VWCB7AJ5EM345678', 'Volkswagen', 2023, 'Compact', 'Jetta', 'Black', '2023-03-10', 'USA', 'USA', 'LAX1003', 'LAX001', 'JET23', 'ACTIVE', 15600, 'Jetta S'),
('KM8J3CA26JU456789', 'Hyundai', 2024, 'Compact', 'Elantra', 'Blue', '2024-01-05', 'USA', 'USA', 'LAX1004', 'LAX001', 'ELA24', 'MAINTENANCE', 5400, 'Elantra SEL'),
('1N4AL3AP8JC567890', 'Nissan', 2024, 'Compact', 'Sentra', 'Red', '2024-02-15', 'USA', 'USA', 'LAX1005', 'LAX001', 'SEN24', 'ACTIVE', 7800, 'Sentra SV'),

-- Mid-Size Cars  
('4T1B11HK1KU678901', 'Toyota', 2023, 'Mid-Size', 'Camry', 'Gray', '2023-04-20', 'USA', 'USA', 'LAX2001', 'LAX002', 'CAM23', 'ACTIVE', 18900, 'Camry LE'),
('1G1BE5SM4J7789012', 'Chevrolet', 2024, 'Mid-Size', 'Malibu', 'White', '2024-01-30', 'USA', 'USA', 'LAX2002', 'LAX002', 'MAL24', 'ACTIVE', 6700, 'Malibu LT'),
('3FA6P0H75JR890123', 'Ford', 2023, 'Mid-Size', 'Fusion', 'Blue', '2023-05-15', 'USA', 'USA', 'LAX2003', 'LAX002', 'FUS23', 'ACTIVE', 22100, 'Fusion SE'),
('1HGCR2F30KA901234', 'Honda', 2024, 'Mid-Size', 'Accord', 'Black', '2024-03-01', 'USA', 'USA', 'LAX2004', 'LAX002', 'ACC24', 'ACTIVE', 4500, 'Accord EX'),
('KNAJU2A26K5012345', 'Kia', 2024, 'Mid-Size', 'Optima', 'Silver', '2024-01-20', 'USA', 'USA', 'LAX2005', 'LAX002', 'OPT24', 'MAINTENANCE', 9200, 'Optima LX'),

-- Full-Size Cars
('2GNFLGEK8J6123456', 'Chevrolet', 2023, 'Full-Size', 'Impala', 'White', '2023-06-10', 'USA', 'USA', 'LAX3001', 'LAX003', 'IMP23', 'ACTIVE', 28400, 'Impala LT'),
('1G6AS5S36K0234567', 'Cadillac', 2024, 'Full-Size', 'CT4', 'Black', '2024-02-25', 'USA', 'USA', 'LAX3002', 'LAX003', 'CT424', 'ACTIVE', 3200, 'CT4 Luxury'),
('5NPF34AF1KH345678', 'Hyundai', 2023, 'Full-Size', 'Azera', 'Gray', '2023-07-15', 'USA', 'USA', 'LAX3003', 'LAX003', 'AZE23', 'ACTIVE', 19800, 'Azera Limited'),
('1N4AL4BV0KC456789', 'Nissan', 2024, 'Full-Size', 'Altima', 'Red', '2024-03-05', 'USA', 'USA', 'LAX3004', 'LAX003', 'ALT24', 'ACTIVE', 5900, 'Altima SR'),
('JTHCE1BL8K5567890', 'Lexus', 2024, 'Full-Size', 'ES', 'White', '2024-01-15', 'USA', 'USA', 'LAX3005', 'LAX003', 'ES24', 'ACTIVE', 7100, 'ES 350'),

-- Premium Cars
('WBA3B1C50KF678901', 'BMW', 2023, 'Premium', '3 Series', 'Black', '2023-08-20', 'USA', 'USA', 'LAX4001', 'LAX004', 'BMW23', 'ACTIVE', 15200, '330i'),
('WDD2120421A789012', 'Mercedes', 2024, 'Premium', 'C-Class', 'Silver', '2024-02-10', 'USA', 'USA', 'LAX4002', 'LAX004', 'MBC24', 'ACTIVE', 4800, 'C300'),
('WP0AA2A85KS890123', 'Porsche', 2024, 'Premium', 'Macan', 'Red', '2024-03-15', 'USA', 'USA', 'LAX4003', 'LAX004', 'MAC24', 'MAINTENANCE', 2400, 'Macan'),
('4JGBB8GB5KA901234', 'Mercedes', 2023, 'Premium', 'GLA', 'Blue', '2023-09-05', 'USA', 'USA', 'LAX4004', 'LAX004', 'GLA23', 'ACTIVE', 12800, 'GLA 250'),
('5UXCR6C04K0012345', 'BMW', 2024, 'Premium', 'X3', 'White', '2024-01-25', 'USA', 'USA', 'LAX4005', 'LAX004', 'X324', 'ACTIVE', 6400, 'X3 sDrive30i'),

-- Electric Vehicles
('5YJ3E1EA8KF123456', 'Tesla', 2023, 'Electric', 'Model 3', 'White', '2023-10-15', 'USA', 'USA', 'LAX5001', 'LAX005', 'TM323', 'ACTIVE', 18500, 'Model 3 Standard'),
('1G1FW6S06K4234567', 'Chevrolet', 2024, 'Electric', 'Bolt EV', 'Blue', '2024-02-20', 'USA', 'USA', 'LAX5002', 'LAX005', 'BOL24', 'ACTIVE', 5200, 'Bolt EV LT'),
('KMHL14JA4KA345678', 'Hyundai', 2024, 'Electric', 'Ioniq 5', 'Gray', '2024-03-10', 'USA', 'USA', 'LAX5003', 'LAX005', 'ION24', 'ACTIVE', 3800, 'Ioniq 5 SEL'),
('WBY8P2C06K7456789', 'BMW', 2024, 'Electric', 'iX3', 'Black', '2024-01-30', 'USA', 'USA', 'LAX5004', 'LAX005', 'IX324', 'MAINTENANCE', 4100, 'iX3 xDrive30i'),
('5YJ3E1EB2KF567890', 'Tesla', 2024, 'Electric', 'Model Y', 'Red', '2024-02-15', 'USA', 'USA', 'LAX5005', 'LAX005', 'TMY24', 'ACTIVE', 6700, 'Model Y Long Range'),

-- SUVs
('1FMCU9HD2KUC678901', 'Ford', 2023, 'SUV', 'Escape', 'Silver', '2023-11-20', 'USA', 'USA', 'LAX6001', 'LAX006', 'ESC23', 'ACTIVE', 21400, 'Escape SE'),
('2T2BZMCA8KC789012', 'Toyota', 2024, 'SUV', 'RAV4', 'White', '2024-03-25', 'USA', 'USA', 'LAX6002', 'LAX006', 'RAV24', 'ACTIVE', 4200, 'RAV4 LE'),
('1GKS2CKJ8KR890123', 'GMC', 2023, 'SUV', 'Acadia', 'Black', '2023-12-10', 'USA', 'USA', 'LAX6003', 'LAX006', 'ACA23', 'ACTIVE', 16800, 'Acadia SLE'),
('5N1AT2MT0KC901234', 'Nissan', 2024, 'SUV', 'Rogue', 'Blue', '2024-02-05', 'USA', 'USA', 'LAX6004', 'LAX006', 'ROG24', 'MAINTENANCE', 7600, 'Rogue SV'),
('KNDJP3A59K7012345', 'Kia', 2024, 'SUV', 'Sorento', 'Gray', '2024-01-10', 'USA', 'USA', 'LAX6005', 'LAX006', 'SOR24', 'ACTIVE', 8900, 'Sorento LX'),

-- Trucks
('1FTFW1E85KFC123456', 'Ford', 2023, 'Truck', 'F-150', 'Red', '2023-03-20', 'USA', 'USA', 'LAX7001', 'LAX007', 'F15023', 'ACTIVE', 18900, 'F-150 XLT'),
('1GCUYDED0KZ234567', 'Chevrolet', 2024, 'Truck', 'Silverado', 'White', '2024-01-15', 'USA', 'USA', 'LAX7002', 'LAX007', 'SIL24', 'ACTIVE', 12200, 'Silverado 1500'),
('3C6RR7KT4KG345678', 'Ram', 2023, 'Truck', '1500', 'Black', '2023-04-25', 'USA', 'USA', 'LAX7003', 'LAX007', 'RAM23', 'MAINTENANCE', 25400, 'Ram 1500 Big Horn'),
('1GTU9EED2KZ456789', 'GMC', 2024, 'Truck', 'Sierra', 'Blue', '2024-02-28', 'USA', 'USA', 'LAX7004', 'LAX007', 'SIE24', 'ACTIVE', 6800, 'Sierra 1500'),
('5TFAY5F16KX567890', 'Toyota', 2024, 'Truck', 'Tacoma', 'Silver', '2024-03-12', 'USA', 'USA', 'LAX7005', 'LAX007', 'TAC24', 'ACTIVE', 5400, 'Tacoma SR5'),

-- Luxury SUVs
('WDD2462421A678901', 'Mercedes', 2023, 'Luxury', 'GLE', 'Black', '2023-05-30', 'USA', 'USA', 'LAX8001', 'LAX008', 'GLE23', 'ACTIVE', 19600, 'GLE 350'),
('5UXCR6C08K0789012', 'BMW', 2024, 'Luxury', 'X5', 'White', '2024-02-18', 'USA', 'USA', 'LAX8002', 'LAX008', 'X524', 'ACTIVE', 7200, 'X5 xDrive40i'),
('WA1BNAFY8K2890123', 'Audi', 2023, 'Luxury', 'Q5', 'Gray', '2023-06-15', 'USA', 'USA', 'LAX8003', 'LAX008', 'Q523', 'MAINTENANCE', 22800, 'Q5 Premium Plus'),
('JM1CX1HL0K0901234', 'Mazda', 2024, 'Luxury', 'CX-5', 'Red', '2024-03-20', 'USA', 'USA', 'LAX8004', 'LAX008', 'CX524', 'ACTIVE', 4900, 'CX-5 Grand Touring'),
('JTHBP1D28K5012345', 'Lexus', 2024, 'Luxury', 'NX', 'Blue', '2024-01-22', 'USA', 'USA', 'LAX8005', 'LAX008', 'NX24', 'ACTIVE', 6100, 'NX 300'),

-- Convertibles  
('WBA8E1C50KG123456', 'BMW', 2023, 'Convertible', '4 Series', 'Red', '2023-07-10', 'USA', 'USA', 'LAX9001', 'LAX009', 'BMW423', 'ACTIVE', 14200, '430i Convertible'),
('1FA6P8CF0K5234567', 'Ford', 2024, 'Convertible', 'Mustang', 'Yellow', '2024-02-14', 'USA', 'USA', 'LAX9002', 'LAX009', 'MUS24', 'ACTIVE', 3500, 'Mustang EcoBoost'),
('WDD1J7HA0KA345678', 'Mercedes', 2024, 'Convertible', 'SLK', 'Silver', '2024-03-08', 'USA', 'USA', 'LAX9003', 'LAX009', 'SLK24', 'MAINTENANCE', 2800, 'SLK 300'),
('JN1CV6EK8KM456789', 'Infiniti', 2023, 'Convertible', 'Q60', 'White', '2023-08-25', 'USA', 'USA', 'LAX9004', 'LAX009', 'Q6023', 'ACTIVE', 16800, 'Q60 Luxe'),
('1G6AR5SX0K0567890', 'Cadillac', 2024, 'Convertible', 'CT5', 'Black', '2024-01-28', 'USA', 'USA', 'LAX9005', 'LAX009', 'CT524', 'ACTIVE', 5700, 'CT5 Premium Luxury'),

-- Sports Cars
('1G1YB2D70G5100001', 'Chevrolet', 2023, 'Sports', 'Corvette', 'Red', '2023-08-15', 'USA', 'USA', 'LAX1001S', 'LAX010', 'COR23', 'ACTIVE', 8900, 'Corvette Stingray'),
('WP0AB2A85KS100002', 'Porsche', 2024, 'Sports', '911', 'White', '2024-01-20', 'USA', 'USA', 'LAX1002S', 'LAX010', '91124', 'ACTIVE', 2400, '911 Carrera'),
('WVWZZZ6RZK4100003', 'Audi', 2023, 'Sports', 'R8', 'Black', '2023-09-10', 'USA', 'USA', 'LAX1003S', 'LAX010', 'R823', 'MAINTENANCE', 5200, 'R8 V10'),
('WBA3V1C05K5100004', 'BMW', 2024, 'Sports', 'M4', 'Blue', '2024-02-28', 'USA', 'USA', 'LAX1004S', 'LAX010', 'M424', 'ACTIVE', 3100, 'M4 Competition'),
('WDDEJ7KB5KA100005', 'Mercedes', 2023, 'Sports', 'AMG GT', 'Silver', '2023-11-05', 'USA', 'USA', 'LAX1005S', 'LAX010', 'AMG23', 'ACTIVE', 4800, 'AMG GT C');

-- Insert diverse workflows 
INSERT INTO public.workflows (vehicle_vin, stage, status, assigned_user_group, priority, start_time, end_time, estimated_duration, actual_duration, notes) VALUES

-- Completed workflows
('1HGCM82633A123456', 'CLEANING', 'COMPLETED', 'CAR_CLEANER', 'MEDIUM', '2024-09-26 08:00:00+00', '2024-09-26 08:25:00+00', 30, 25, 'Interior and exterior cleaning completed'),
('2HGES16535H234567', 'KEY_HANDLING', 'COMPLETED', 'OPERATIONS_USER', 'LOW', '2024-09-26 09:00:00+00', '2024-09-26 09:08:00+00', 10, 8, 'Keys retrieved and stored'),
('4T1B11HK1KU678901', 'REFUEL', 'COMPLETED', 'OPERATIONS_USER', 'HIGH', '2024-09-26 10:00:00+00', '2024-09-26 10:12:00+00', 15, 12, 'Refueled to full tank'),
('1FTFW1E85KFC123456', 'KEY_HANDLING', 'COMPLETED', 'OPERATIONS_USER', 'LOW', '2024-09-26 07:30:00+00', '2024-09-26 07:38:00+00', 10, 8, 'Keys processed for pickup'),
('5NPF34AF1KH345678', 'CLEANING', 'COMPLETED', 'CAR_CLEANER', 'MEDIUM', '2024-09-26 06:00:00+00', '2024-09-26 06:30:00+00', 30, 30, 'Morning cleaning shift completed'),
('WBY8P2C06K7456789', 'EV_CHARGING', 'COMPLETED', 'OPERATIONS_USER', 'HIGH', '2024-09-26 05:00:00+00', '2024-09-26 07:30:00+00', 150, 150, 'Overnight charging completed'),
('3C6RR7KT4KG345678', 'LOCATION_MOVE', 'COMPLETED', 'OPERATIONS_USER', 'MEDIUM', '2024-09-26 11:30:00+00', '2024-09-26 11:50:00+00', 25, 20, 'Moved to pickup zone ahead of schedule'),

-- In Progress workflows  
('3VWCB7AJ5EM345678', 'CLEANING', 'IN_PROGRESS', 'CAR_CLEANER', 'HIGH', '2024-09-26 14:30:00+00', NULL, 35, NULL, 'Deep cleaning in progress - heavy soiling'),
('5YJ3E1EA8KF123456', 'EV_CHARGING', 'IN_PROGRESS', 'OPERATIONS_USER', 'MEDIUM', '2024-09-26 13:00:00+00', NULL, 120, NULL, 'Charging from 20% to 80%'),
('1FMCU9HD2KUC678901', 'LOCATION_MOVE', 'IN_PROGRESS', 'OPERATIONS_USER', 'LOW', '2024-09-26 15:00:00+00', NULL, 45, NULL, 'Moving from Lot A to Terminal pickup'),
('2T2BZMCA8KC789012', 'REFUEL', 'IN_PROGRESS', 'OPERATIONS_USER', 'MEDIUM', '2024-09-26 16:15:00+00', NULL, 15, NULL, 'Currently refueling'),
('WDD2462421A678901', 'CLEANING', 'IN_PROGRESS', 'CAR_CLEANER', 'HIGH', '2024-09-26 14:00:00+00', NULL, 50, NULL, 'Luxury vehicle cleaning in progress'),
('1G1YB2D70G5100001', 'CLEANING', 'IN_PROGRESS', 'CAR_CLEANER', 'URGENT', '2024-09-26 16:30:00+00', NULL, 60, NULL, 'Premium sports car detailing'),

-- Pending workflows - High Priority
('KM8J3CA26JU456789', 'CLEANING', 'PENDING', 'CAR_CLEANER', 'URGENT', NULL, NULL, 40, NULL, 'Priority cleaning needed after maintenance'),
('1N4AL3AP8JC567890', 'REFUEL', 'PENDING', 'OPERATIONS_USER', 'HIGH', NULL, NULL, 15, NULL, 'Low fuel - needs immediate attention'),
('1G1FW6S06K4234567', 'EV_CHARGING', 'PENDING', 'OPERATIONS_USER', 'HIGH', NULL, NULL, 90, NULL, 'Battery at 15% - urgent charging needed'),
('5UXCR6C04K0012345', 'LOCATION_MOVE', 'PENDING', 'OPERATIONS_USER', 'URGENT', NULL, NULL, 20, NULL, 'Customer waiting - immediate move needed'),
('1GKS2CKJ8KR890123', 'KEY_HANDLING', 'PENDING', 'OPERATIONS_USER', 'HIGH', NULL, NULL, 12, NULL, 'VIP customer - priority key service'),

-- Pending workflows - Medium Priority
('1G1BE5SM4J7789012', 'KEY_HANDLING', 'PENDING', 'OPERATIONS_USER', 'MEDIUM', NULL, NULL, 10, NULL, 'Customer return - keys need processing'),
('WBA3B1C50KF678901', 'CLEANING', 'PENDING', 'CAR_CLEANER', 'MEDIUM', NULL, NULL, 45, NULL, 'Premium vehicle - detailed cleaning required'),
('1HGCR2F30KA901234', 'EV_CHARGING', 'PENDING', 'OPERATIONS_USER', 'MEDIUM', NULL, NULL, 100, NULL, 'Scheduled for evening charging'),
('KMHL14JA4KA345678', 'REFUEL', 'PENDING', 'OPERATIONS_USER', 'MEDIUM', NULL, NULL, 15, NULL, 'Standard refuel needed'),
('WP0AB2A85KS100002', 'CLEANING', 'PENDING', 'CAR_CLEANER', 'MEDIUM', NULL, NULL, 90, NULL, 'Luxury sports car requires special care'),

-- Pending workflows - Low Priority  
('3FA6P0H75JR890123', 'LOCATION_MOVE', 'PENDING', 'OPERATIONS_USER', 'LOW', NULL, NULL, 30, NULL, 'Move to different lot for storage'),
('1G6AS5S36K0234567', 'CLEANING', 'PENDING', 'CAR_CLEANER', 'LOW', NULL, NULL, 35, NULL, 'Routine cleaning scheduled'),
('JTHCE1BL8K5567890', 'KEY_HANDLING', 'PENDING', 'OPERATIONS_USER', 'LOW', NULL, NULL, 8, NULL, 'Standard key processing'),
('2GNFLGEK8J6123456', 'REFUEL', 'PENDING', 'OPERATIONS_USER', 'LOW', NULL, NULL, 15, NULL, 'Routine refueling'),
('WA1BNAFY8K2890123', 'CLEANING', 'PENDING', 'CAR_CLEANER', 'LOW', NULL, NULL, 40, NULL, 'Maintenance vehicle needs cleaning after service');