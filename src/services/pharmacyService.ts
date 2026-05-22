import { PharmacyOrder } from '../types';
import { pharmacyOrders as mockOrders } from '../../data/mockData';

let orders = [...mockOrders];

export const pharmacyService = {
  async getAll(): Promise<PharmacyOrder[]> {
    return Promise.resolve([...orders]);
  },

  async getById(id: string): Promise<PharmacyOrder | null> {
    const all = await this.getAll();
    return all.find(o => o.id === id) || null;
  },

  async getByPatientId(patientId: string): Promise<PharmacyOrder[]> {
    const all = await this.getAll();
    return Promise.resolve(all.filter(o => o.patientId === patientId));
  },

  async getByStatus(status: 'Pending' | 'Dispensed' | 'Cancelled'): Promise<PharmacyOrder[]> {
    const all = await this.getAll();
    return Promise.resolve(all.filter(o => o.status === status));
  },

  async create(data: Omit<PharmacyOrder, 'id'>): Promise<PharmacyOrder> {
    const newOrder: PharmacyOrder = {
      ...data,
      id: `PO${String(orders.length + 1).padStart(3, '0')}`,
    };
    orders = [newOrder, ...orders];
    return Promise.resolve(newOrder);
  },

  async dispenseOrder(id: string): Promise<PharmacyOrder> {
    const order = await this.getById(id);
    if (!order) throw new Error('Order not found');
    const updated: PharmacyOrder = { ...order, status: 'Dispensed' };
    orders = orders.map(o => o.id === id ? updated : o);
    return Promise.resolve(updated);
  },

  async cancelOrder(id: string): Promise<PharmacyOrder> {
    const order = await this.getById(id);
    if (!order) throw new Error('Order not found');
    const updated: PharmacyOrder = { ...order, status: 'Cancelled' };
    orders = orders.map(o => o.id === id ? updated : o);
    return Promise.resolve(updated);
  },

  async update(id: string, data: Partial<PharmacyOrder>): Promise<PharmacyOrder> {
    const order = await this.getById(id);
    if (!order) throw new Error('Order not found');
    const updated = { ...order, ...data };
    orders = orders.map(o => o.id === id ? updated : o);
    return Promise.resolve(updated);
  },

  async delete(id: string): Promise<void> {
    orders = orders.filter(o => o.id !== id);
    return Promise.resolve();
  },
};
