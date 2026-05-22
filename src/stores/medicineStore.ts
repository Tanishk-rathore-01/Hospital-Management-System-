import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Medicine } from '../types';
import { medicineService } from '../services/medicineService';

interface MedicineStore {
  medicines: Medicine[];
  isLoading: boolean;
  error: string | null;
  fetchMedicines: () => Promise<void>;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Promise<void>;
  updateMedicine: (id: string, data: Partial<Medicine>) => Promise<void>;
  updateMedicineStock: (id: string, quantity: number) => Promise<void>;
  deleteMedicine: (id: string) => Promise<void>;
  setMedicines: (medicines: Medicine[]) => void;
  reset: () => void;
}

const initialState = {
  medicines: [],
  isLoading: false,
  error: null,
};

export const useMedicineStore = create<MedicineStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchMedicines: async () => {
        set({ isLoading: true, error: null });
        try {
          const medicines = await medicineService.getAll();
          set({ medicines, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addMedicine: async (medicine) => {
        try {
          const newMedicine = await medicineService.create(medicine);
          set((state) => ({
            medicines: [...state.medicines, newMedicine],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      updateMedicine: async (id, data) => {
        try {
          const updated = await medicineService.update(id, data);
          set((state) => ({
            medicines: state.medicines.map((m) =>
              m.id === id ? updated : m
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      updateMedicineStock: async (id, quantity) => {
        try {
          const updated = await medicineService.updateStock(id, quantity);
          set((state) => ({
            medicines: state.medicines.map((m) =>
              m.id === id ? updated : m
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      deleteMedicine: async (id) => {
        try {
          await medicineService.delete(id);
          set((state) => ({
            medicines: state.medicines.filter((m) => m.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      setMedicines: (medicines) => set({ medicines }),

      reset: () => set(initialState),
    }),
    {
      name: 'medicine-store',
      version: 1,
    }
  )
);
