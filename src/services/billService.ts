import { Bill, BillStatus } from '../types';
import { bills as mockBills } from '../../data/mockData';

let bills = [...mockBills];

export const billService = {
  async getAll(): Promise<Bill[]> {
    return Promise.resolve([...bills]);
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
    bills = bills.map(b => b.id === id ? updated : b);
    return Promise.resolve(updated);
  },

  async create(data: Omit<Bill, 'id'>): Promise<Bill> {
    const newBill: Bill = {
      ...data,
      id: `B${String(bills.length + 1).padStart(3, '0')}`,
    };
    bills = [newBill, ...bills];
    return Promise.resolve(newBill);
  },

  async update(id: string, data: Partial<Bill>): Promise<Bill> {
    const all = await this.getAll();
    const bill = all.find(b => b.id === id);
    if (!bill) throw new Error('Bill not found');
    const updated = { ...bill, ...data };
    bills = bills.map(b => b.id === id ? updated : b);
    return Promise.resolve(updated);
  },

  async delete(id: string): Promise<void> {
    bills = bills.filter(b => b.id !== id);
    return Promise.resolve();
  },
};
