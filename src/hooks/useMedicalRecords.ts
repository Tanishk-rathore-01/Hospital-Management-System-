import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalRecordService } from '../services/medicalRecordService';
import { MedicalRecord } from '../types';

export const MEDICAL_RECORDS_QUERY_KEY = ['medical-records'];

export function useMedicalRecords() {
  return useQuery({
    queryKey: MEDICAL_RECORDS_QUERY_KEY,
    queryFn: medicalRecordService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMedicalRecordById(id: string) {
  return useQuery({
    queryKey: [...MEDICAL_RECORDS_QUERY_KEY, id],
    queryFn: () => medicalRecordService.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMedicalRecordsByPatient(patientId: string) {
  return useQuery({
    queryKey: [...MEDICAL_RECORDS_QUERY_KEY, 'patient', patientId],
    queryFn: () => medicalRecordService.getByPatientId(patientId),
    staleTime: 5 * 60 * 1000,
    enabled: !!patientId,
  });
}

export function useMedicalRecordsByDoctor(doctorId: string) {
  return useQuery({
    queryKey: [...MEDICAL_RECORDS_QUERY_KEY, 'doctor', doctorId],
    queryFn: () => medicalRecordService.getByDoctorId(doctorId),
    staleTime: 5 * 60 * 1000,
    enabled: !!doctorId,
  });
}

export function useCreateMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<MedicalRecord, 'id'>) => medicalRecordService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORDS_QUERY_KEY });
    },
  });
}

export function useUpdateMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MedicalRecord> }) =>
      medicalRecordService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORDS_QUERY_KEY });
    },
  });
}

export function useDeleteMedicalRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicalRecordService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDICAL_RECORDS_QUERY_KEY });
    },
  });
}

export function useSearchMedicalRecords(query: string) {
  return useQuery({
    queryKey: [...MEDICAL_RECORDS_QUERY_KEY, 'search', query],
    queryFn: () => medicalRecordService.search(query),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 0,
  });
}
