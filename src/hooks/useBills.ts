import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billService } from '../services/billService';
import { Bill } from '../types';

export const BILLS_QUERY_KEY = ['bills'];

export function useBills() {
  return useQuery({
    queryKey: BILLS_QUERY_KEY,
    queryFn: billService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBillById(id: string) {
  return useQuery({
    queryKey: [...BILLS_QUERY_KEY, id],
    queryFn: () => billService.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBillsByPatientId(patientId: string) {
  return useQuery({
    queryKey: [...BILLS_QUERY_KEY, 'patient', patientId],
    queryFn: () => billService.getByPatientId(patientId),
    staleTime: 5 * 60 * 1000,
    enabled: !!patientId,
  });
}

export function useCreateBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Bill, 'id'>) => billService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
    },
  });
}

export function useMarkBillPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billService.markPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
    },
  });
}

export function useUpdateBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bill> }) =>
      billService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
    },
  });
}

export function useDeleteBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLS_QUERY_KEY });
    },
  });
}
