import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pharmacyService } from '../services/pharmacyService';
import { PharmacyOrder } from '../types';

export const PHARMACY_ORDERS_QUERY_KEY = ['pharmacy-orders'];

export function usePharmacyOrders() {
  return useQuery({
    queryKey: PHARMACY_ORDERS_QUERY_KEY,
    queryFn: pharmacyService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePharmacyOrderById(id: string) {
  return useQuery({
    queryKey: [...PHARMACY_ORDERS_QUERY_KEY, id],
    queryFn: () => pharmacyService.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePharmacyOrdersByPatient(patientId: string) {
  return useQuery({
    queryKey: [...PHARMACY_ORDERS_QUERY_KEY, 'patient', patientId],
    queryFn: () => pharmacyService.getByPatientId(patientId),
    staleTime: 5 * 60 * 1000,
    enabled: !!patientId,
  });
}

export function usePharmacyOrdersByStatus(status: 'Pending' | 'Dispensed' | 'Cancelled') {
  return useQuery({
    queryKey: [...PHARMACY_ORDERS_QUERY_KEY, 'status', status],
    queryFn: () => pharmacyService.getByStatus(status),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePharmacyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PharmacyOrder, 'id'>) => pharmacyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHARMACY_ORDERS_QUERY_KEY });
    },
  });
}

export function useDispensePharmacyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pharmacyService.dispenseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHARMACY_ORDERS_QUERY_KEY });
    },
  });
}

export function useCancelPharmacyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pharmacyService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHARMACY_ORDERS_QUERY_KEY });
    },
  });
}

export function useUpdatePharmacyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PharmacyOrder> }) =>
      pharmacyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHARMACY_ORDERS_QUERY_KEY });
    },
  });
}

export function useDeletePharmacyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pharmacyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHARMACY_ORDERS_QUERY_KEY });
    },
  });
}
