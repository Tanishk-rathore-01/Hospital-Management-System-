import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types';

export const APPOINTMENTS_QUERY_KEY = ['appointments'];

export function useAppointments() {
  return useQuery({
    queryKey: APPOINTMENTS_QUERY_KEY,
    queryFn: appointmentService.getAll,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAppointmentById(id: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, id],
    queryFn: () => appointmentService.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Appointment, 'id'>) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
      appointmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}
