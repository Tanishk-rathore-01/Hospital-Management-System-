import { PharmacyOrder } from '../types';
import { pharmacyOrders as mockOrders } from '../../data/mockData';
import { apiClient } from './api';

export const pharmacyService = {
  async getAll(): Promise<PharmacyOrder[]> {
    return Promise.resolve([...mockOrders]);
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
    const all = await this.getAll();
    const newOrder: PharmacyOrder = {
      ...data,
      id: `PO${String(all.length + 1).padStart(3, '0')}`,
    };
    return Promise.resolve(newOrder);
  },

  async dispenseOrder(id: string): Promise<PharmacyOrder> {
    const order = await this.getById(id);
    if (!order) throw new Error('Order not found');
    return Promise.resolve({ ...order, status: 'Dispensed' });
  },

  async cancelOrder(id: string): Promise<PharmacyOrder> {
    const order = await this.getById(id);
    if (!order) throw new Error('Order not found');
    return Promise.resolve({ ...order, status: 'Cancelled' });
  },

  async update(id: string, data: Partial<PharmacyOrder>): Promise<PharmacyOrder> {
    const order = await this.getById(id);
    if (!order) throw new Error('Order not found');
    return Promise.resolve({ ...order, ...data });
  },

  async delete(id: string): Promise<void> {
    return Promise.resolve();
  },
};
