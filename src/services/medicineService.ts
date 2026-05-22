import { Medicine, MedicineStatus } from '../types';
import { medicines as mockMedicines, todayIso } from '../../data/mockData';
import { apiClient } from './api';

export const medicineService = {
  // Derive status at runtime based on expiry date and stock
  _determineMedicineStatus(medicine: Medicine): MedicineStatus {
    const today = new Date(todayIso);
    const expiry = new Date(medicine.expiryDate);

    if (expiry < today) return 'Expired';
    if (medicine.stock === 0) return 'Out of Stock';
    if (medicine.stock < medicine.minStock) return 'Low Stock';
    return 'In Stock';
  },

  _enrichMedicine(medicine: Medicine): Medicine {
    return {
      ...medicine,
      status: this._determineMedicineStatus(medicine),
    };
  },

  async getAll(): Promise<Medicine[]> {
    return Promise.resolve(mockMedicines.map(m => this._enrichMedicine(m)));
  },

  async getById(id: string): Promise<Medicine | null> {
    const all = await this.getAll();
    return all.find(m => m.id === id) || null;
  },

  async getByStatus(status: MedicineStatus): Promise<Medicine[]> {
    const all = await this.getAll();
    return Promise.resolve(all.filter(m => m.status === status));
  },

  async getLowStockAlerts(): Promise<Medicine[]> {
    const all = await this.getAll();
    return Promise.resolve(
      all.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock' || m.status === 'Expired')
    );
  },

  async create(data: Omit<Medicine, 'id'>): Promise<Medicine> {
    const all = await this.getAll();
    const newMedicine: Medicine = {
      ...data,
      id: `M${String(all.length + 1).padStart(3, '0')}`,
    };
    return Promise.resolve(this._enrichMedicine(newMedicine));
  },

  async update(id: string, data: Partial<Medicine>): Promise<Medicine> {
    const all = await this.getAll();
    const medicine = all.find(m => m.id === id);
    if (!medicine) throw new Error('Medicine not found');
    const updated = { ...medicine, ...data };
    return Promise.resolve(this._enrichMedicine(updated));
  },

  async updateStock(id: string, quantity: number): Promise<Medicine> {
    const medicine = await this.getById(id);
    if (!medicine) throw new Error('Medicine not found');
    return this.update(id, { stock: Math.max(0, medicine.stock + quantity) });
  },

  async delete(id: string): Promise<void> {
    return Promise.resolve();
  },

  async search(query: string): Promise<Medicine[]> {
    const all = await this.getAll();
    const lower = query.toLowerCase();
    return Promise.resolve(
      all.filter(m =>
        m.name.toLowerCase().includes(lower) ||
        m.genericName.toLowerCase().includes(lower) ||
        m.category.toLowerCase().includes(lower)
      )
    );
  },
};
