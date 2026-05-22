import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/patientService';
import { Patient } from '../types';

export const PATIENTS_QUERY_KEY = ['patients'];

export function usePatients() {
  return useQuery({
    queryKey: PATIENTS_QUERY_KEY,
    queryFn: patientService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePatientById(id: string) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, id],
    queryFn: () => patientService.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Patient, 'id' | 'registrationDate'>) =>
      patientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) =>
      patientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    },
  });
}

export function useSearchPatients(query: string) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, 'search', query],
    queryFn: () => patientService.search(query),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}
