-- Update vehicle operation_status to include TURNAROUND
-- First, add TURNAROUND as a valid status
ALTER TABLE vehicles 
DROP CONSTRAINT IF EXISTS vehicles_operation_status_check;

ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_operation_status_check 
CHECK (operation_status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'HOLD', 'TURNAROUND'));