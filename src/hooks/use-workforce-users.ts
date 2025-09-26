import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WorkforceUser {
  id: string;
  name: string;
  role: 'car_cleaner' | 'operations_user' | 'manager';
  phone?: string;
  locationCode?: string;
  isActive: boolean;
  isCurrentUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useWorkforceUsers() {
  return useQuery({
    queryKey: ['workforce_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workforce_users')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      
      return data.map(user => ({
        id: user.id,
        name: user.name,
        role: user.role as 'car_cleaner' | 'operations_user' | 'manager',
        phone: user.phone || undefined,
        locationCode: user.location_code || undefined,
        isActive: user.is_active,
        isCurrentUser: user.is_current_user,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      })) as WorkforceUser[];
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['workforce_users', 'current'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workforce_users')
        .select('*')
        .eq('is_current_user', true)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        role: data.role as 'car_cleaner' | 'operations_user' | 'manager',
        phone: data.phone || undefined,
        locationCode: data.location_code || undefined,
        isActive: data.is_active,
        isCurrentUser: data.is_current_user,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as WorkforceUser;
    },
  });
}