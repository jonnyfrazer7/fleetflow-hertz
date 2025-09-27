import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Vehicle } from '@/types/fleet';

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          locations(id, name, address, type)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(vehicle => ({
        vin: vehicle.vin,
        make: vehicle.make,
        year: vehicle.year,
        carGroup: vehicle.car_group,
        modelGroup: vehicle.model_group,
        color: vehicle.color,
        installationDate: vehicle.installation_date,
        owningCountry: vehicle.owning_country,
        locationId: vehicle.location_id,
        licensePlate: vehicle.license_plate || undefined,
        ownAreaUnitNo: vehicle.own_area_unit_no || undefined,
        modelCode: vehicle.model_code || undefined,
        holdFlag: vehicle.hold_flag,
        operationStatus: vehicle.operation_status as Vehicle['operationStatus'],
        lastMileage: vehicle.last_mileage || undefined,
        modelDescription: vehicle.model_description || undefined,
        fuelType: vehicle.fuel_type as Vehicle['fuelType'],
        createdAt: vehicle.created_at,
        updatedAt: vehicle.updated_at,
        location: vehicle.locations ? {
          id: vehicle.locations.id,
          name: vehicle.locations.name,
          address: vehicle.locations.address,
          type: vehicle.locations.type
        } : undefined
      })) as Vehicle[];
    },
  });
}

export function useVehicle(vin: string) {
  return useQuery({
    queryKey: ['vehicles', vin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          locations(id, name, address, type)
        `)
        .eq('vin', vin)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        vin: data.vin,
        make: data.make,
        year: data.year,
        carGroup: data.car_group,
        modelGroup: data.model_group,
        color: data.color,
        installationDate: data.installation_date,
        owningCountry: data.owning_country,
        locationId: data.location_id,
        licensePlate: data.license_plate || undefined,
        ownAreaUnitNo: data.own_area_unit_no || undefined,
        modelCode: data.model_code || undefined,
        holdFlag: data.hold_flag,
        operationStatus: data.operation_status as Vehicle['operationStatus'],
        lastMileage: data.last_mileage || undefined,
        modelDescription: data.model_description || undefined,
        fuelType: data.fuel_type as Vehicle['fuelType'],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        location: data.locations ? {
          id: data.locations.id,
          name: data.locations.name,
          address: data.locations.address,
          type: data.locations.type
        } : undefined
      } as Vehicle;
    },
    enabled: !!vin,
  });
}