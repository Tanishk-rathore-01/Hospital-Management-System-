import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MedicalRecord } from '../types';
import { medicalRecordService } from '../services/medicalRecordService';

interface MedicalRecordStore {
  records: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  addRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<void>;
  updateRecord: (id: string, data: Partial<MedicalRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  setRecords: (records: MedicalRecord[]) => void;
  reset: () => void;
}

const initialState = {
  records: [],
  isLoading: false,
  error: null,
};

export const useMedicalRecordStore = create<MedicalRecordStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchRecords: async () => {
        set({ isLoading: true, error: null });
        try {
          const records = await medicalRecordService.getAll();
          set({ records, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addRecord: async (record) => {
        try {
          const newRecord = await medicalRecordService.create(record);
          set((state) => ({
            records: [...state.records, newRecord],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      updateRecord: async (id, data) => {
        try {
          const updated = await medicalRecordService.update(id, data);
          set((state) => ({
            records: state.records.map((r) =>
              r.id === id ? updated : r
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      deleteRecord: async (id) => {
        try {
          await medicalRecordService.delete(id);
          set((state) => ({
            records: state.records.filter((r) => r.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      setRecords: (records) => set({ records }),

      reset: () => set(initialState),
    }),
    {
      name: 'medical-record-store',
      version: 1,
    }
  )
);
