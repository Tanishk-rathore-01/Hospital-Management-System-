import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineService } from '../services/medicineService';
import { Medicine, MedicineStatus } from '../types';

export const MEDICINES_QUERY_KEY = ['medicines'];

export function useMedicines() {
  return useQuery({
    queryKey: MEDICINES_QUERY_KEY,
    queryFn: medicineService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMedicineById(id: string) {
  return useQuery({
    queryKey: [...MEDICINES_QUERY_KEY, id],
    queryFn: () => medicineService.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMedicinesByStatus(status: MedicineStatus) {
  return useQuery({
    queryKey: [...MEDICINES_QUERY_KEY, 'status', status],
    queryFn: () => medicineService.getByStatus(status),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMedicineLowStockAlerts() {
  return useQuery({
    queryKey: [...MEDICINES_QUERY_KEY, 'alerts'],
    queryFn: medicineService.getLowStockAlerts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Medicine, 'id'>) => medicineService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICINES_QUERY_KEY });
    },
  });
}

export function useUpdateMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Medicine> }) =>
      medicineService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICINES_QUERY_KEY });
    },
  });
}

export function useUpdateMedicineStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      medicineService.updateStock(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICINES_QUERY_KEY });
    },
  });
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicineService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICINES_QUERY_KEY });
    },
  });
}

export function useSearchMedicines(query: string) {
  return useQuery({
    queryKey: [...MEDICINES_QUERY_KEY, 'search', query],
    queryFn: () => medicineService.search(query),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}
