import { Bill, BillStatus } from '../types';
import { bills as mockBills } from '../../data/mockData';
import { apiClient } from './api';

export const billService = {
  async getAll(): Promise<Bill[]> {
    return Promise.resolve([...mockBills]);
  },

  async getById(id: string): Promise<Bill | null> {
    const all = await this.getAll();
    return all.find(b => b.id === id) || null;
  },

  async getByPatientId(patientId: string): Promise<Bill[]> {
    const all = await this.getAll();
    return Promise.resolve(all.filter(b => b.patientId === patientId));
  },

  async markPaid(id: string): Promise<Bill> {
    const all = await this.getAll();
    const bill = all.find(b => b.id === id);
    if (!bill) throw new Error('Bill not found');
    const updated: Bill = { ...bill, status: 'Paid' as BillStatus, paid: bill.total };
    return Promise.resolve(updated);
  },

  async create(data: Omit<Bill, 'id'>): Promise<Bill> {
    const all = await this.getAll();
    const newBill: Bill = {
      ...data,
      id: `B${String(all.length + 1).padStart(3, '0')}`,
    };
    return Promise.resolve(newBill);
  },

  async update(id: string, data: Partial<Bill>): Promise<Bill> {
    const all = await this.getAll();
    const bill = all.find(b => b.id === id);
    if (!bill) throw new Error('Bill not found');
    return Promise.resolve({ ...bill, ...data });
  },

  async delete(id: string): Promise<void> {
    return Promise.resolve();
  },
};
