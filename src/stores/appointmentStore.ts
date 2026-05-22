import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment, AppointmentStatus } from '../types';
import { appointmentService } from '../services/appointmentService';

interface AppointmentStore {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  setAppointments: (appointments: Appointment[]) => void;
  reset: () => void;
}

const initialState = {
  appointments: [],
  isLoading: false,
  error: null,
};

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchAppointments: async () => {
        set({ isLoading: true, error: null });
        try {
          const appointments = await appointmentService.getAll();
          set({ appointments, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addAppointment: async (appointment) => {
        try {
          const newAppointment = await appointmentService.create(appointment);
          set((state) => ({
            appointments: [newAppointment, ...state.appointments],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      updateAppointmentStatus: async (id, status) => {
        try {
          await appointmentService.updateStatus(id, status);
          set((state) => ({
            appointments: state.appointments.map((a) =>
              a.id === id ? { ...a, status } : a
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      updateAppointment: async (id, data) => {
        try {
          const updated = await appointmentService.update(id, data);
          set((state) => ({
            appointments: state.appointments.map((a) =>
              a.id === id ? updated : a
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      deleteAppointment: async (id) => {
        try {
          await appointmentService.delete(id);
          set((state) => ({
            appointments: state.appointments.filter((a) => a.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      setAppointments: (appointments) => set({ appointments }),

      reset: () => set(initialState),
    }),
    {
      name: 'appointment-store',
      version: 1,
    }
  )
);
