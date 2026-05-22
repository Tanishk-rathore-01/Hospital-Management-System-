import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Patient } from '../types';
import { patientService } from '../services/patientService';

interface PatientStore {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id' | 'registrationDate'>) => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  setPatients: (patients: Patient[]) => void;
  reset: () => void;
}

const initialState = {
  patients: [],
  isLoading: false,
  error: null,
};

export const usePatientStore = create<PatientStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchPatients: async () => {
        set({ isLoading: true, error: null });
        try {
          const patients = await patientService.getAll();
          set({ patients, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addPatient: async (patient) => {
        try {
          const newPatient = await patientService.create(patient);
          set((state) => ({
            patients: [...state.patients, newPatient],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      updatePatient: async (id, data) => {
        try {
          const updated = await patientService.update(id, data);
          set((state) => ({
            patients: state.patients.map((p) =>
              p.id === id ? updated : p
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      deletePatient: async (id) => {
        try {
          await patientService.delete(id);
          set((state) => ({
            patients: state.patients.filter((p) => p.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      setPatients: (patients) => set({ patients }),

      reset: () => set(initialState),
    }),
    {
      name: 'patient-store',
      version: 1,
    }
  )
);
