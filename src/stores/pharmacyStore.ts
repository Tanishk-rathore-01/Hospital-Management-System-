import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PharmacyOrder } from '../types';
import { pharmacyService } from '../services/pharmacyService';

interface PharmacyStore {
  orders: PharmacyOrder[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<PharmacyOrder, 'id'>) => Promise<void>;
  dispenseOrder: (id: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  updateOrder: (id: string, data: Partial<PharmacyOrder>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  setOrders: (orders: PharmacyOrder[]) => void;
  reset: () => void;
}

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const usePharmacyStore = create<PharmacyStore>()(
  persist(
    (set) => ({
      ...initialState,

      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const orders = await pharmacyService.getAll();
          set({ orders, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addOrder: async (order) => {
        try {
          const newOrder = await pharmacyService.create(order);
          set((state) => ({
            orders: [...state.orders, newOrder],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      dispenseOrder: async (id) => {
        try {
          const dispensed = await pharmacyService.dispenseOrder(id);
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === id ? dispensed : o
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      cancelOrder: async (id) => {
        try {
          const cancelled = await pharmacyService.cancelOrder(id);
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === id ? cancelled : o
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      updateOrder: async (id, data) => {
        try {
          const updated = await pharmacyService.update(id, data);
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === id ? updated : o
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      deleteOrder: async (id) => {
        try {
          await pharmacyService.delete(id);
          set((state) => ({
            orders: state.orders.filter((o) => o.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      setOrders: (orders) => set({ orders }),

      reset: () => set(initialState),
    }),
    {
      name: 'pharmacy-store',
      version: 1,
    }
  )
);
