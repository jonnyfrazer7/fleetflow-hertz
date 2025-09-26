import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'rental' | 'fuel';
  createdAt: string;
  updatedAt: string;
}

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data.map(location => ({
        id: location.id,
        name: location.name,
        address: location.address,
        type: location.type as 'rental' | 'fuel',
        createdAt: location.created_at,
        updatedAt: location.updated_at
      })) as Location[];
    },
  });
}

export function useFuelLocations() {
  return useQuery({
    queryKey: ['locations', 'fuel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('type', 'fuel')
        .order('name');
      
      if (error) throw error;
      
      return data.map(location => ({
        id: location.id,
        name: location.name,
        address: location.address,
        type: location.type as 'fuel',
        createdAt: location.created_at,
        updatedAt: location.updated_at
      })) as Location[];
    },
  });
}