import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bill } from '../types';
import { billService } from '../services/billService';

interface BillStore {
  bills: Bill[];
  isLoading: boolean;
  error: string | null;
  fetchBills: () => Promise<void>;
  addBill: (bill: Omit<Bill, 'id'>) => Promise<void>;
  updateBill: (id: string, data: Partial<Bill>) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  setBills: (bills: Bill[]) => void;
  reset: () => void;
}

const initialState = {
  bills: [],
  isLoading: false,
  error: null,
};

export const useBillStore = create<BillStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchBills: async () => {
        set({ isLoading: true, error: null });
        try {
          const bills = await billService.getAll();
          set({ bills, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addBill: async (bill) => {
        try {
          const newBill = await billService.create(bill);
          set((state) => ({
            bills: [...state.bills, newBill],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      updateBill: async (id, data) => {
        try {
          const updated = await billService.update(id, data);
          set((state) => ({
            bills: state.bills.map((b) =>
              b.id === id ? updated : b
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      markPaid: async (id) => {
        try {
          const paid = await billService.markPaid(id);
          set((state) => ({
            bills: state.bills.map((b) =>
              b.id === id ? paid : b
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      deleteBill: async (id) => {
        try {
          await billService.delete(id);
          set((state) => ({
            bills: state.bills.filter((b) => b.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      setBills: (bills) => set({ bills }),

      reset: () => set(initialState),
    }),
    {
      name: 'bill-store',
      version: 1,
    }
  )
);
