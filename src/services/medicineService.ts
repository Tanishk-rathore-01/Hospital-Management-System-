import { Medicine, MedicineStatus } from '../types';
import { medicines as mockMedicines, todayIso } from '../../data/mockData';

let medicines = [...mockMedicines];

function determineMedicineStatus(medicine: Medicine): MedicineStatus {
  const today = new Date(todayIso);
  const expiry = new Date(medicine.expiryDate);

  if (expiry < today) return 'Expired';
  if (medicine.stock === 0) return 'Out of Stock';
  if (medicine.stock < medicine.minStock) return 'Low Stock';
  return 'In Stock';
}

function enrichMedicine(medicine: Medicine): Medicine {
  return {
    ...medicine,
    status: determineMedicineStatus(medicine),
  };
}

function getEnrichedMedicines(): Medicine[] {
  return medicines.map((medicine) => enrichMedicine(medicine));
}

export const medicineService = {
  // Derive status at runtime based on expiry date and stock
  _determineMedicineStatus: determineMedicineStatus,

  _enrichMedicine: enrichMedicine,

  async getAll(): Promise<Medicine[]> {
    return Promise.resolve(getEnrichedMedicines());
  },

  async getById(id: string): Promise<Medicine | null> {
    const all = getEnrichedMedicines();
    return all.find(m => m.id === id) || null;
  },

  async getByStatus(status: MedicineStatus): Promise<Medicine[]> {
    const all = getEnrichedMedicines();
    return Promise.resolve(all.filter(m => m.status === status));
  },

  async getLowStockAlerts(): Promise<Medicine[]> {
    const all = getEnrichedMedicines();
    return Promise.resolve(
      all.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock' || m.status === 'Expired')
    );
  },

  async create(data: Omit<Medicine, 'id'>): Promise<Medicine> {
    const newMedicine: Medicine = {
      ...data,
      id: `M${String(medicines.length + 1).padStart(3, '0')}`,
    };
    const enriched = enrichMedicine(newMedicine);
    medicines = [...medicines, enriched];
    return Promise.resolve(enriched);
  },

  async update(id: string, data: Partial<Medicine>): Promise<Medicine> {
    const all = getEnrichedMedicines();
    const medicine = all.find(m => m.id === id);
    if (!medicine) throw new Error('Medicine not found');
    const updated = enrichMedicine({ ...medicine, ...data });
    medicines = medicines.map(m => m.id === id ? updated : m);
    return Promise.resolve(updated);
  },

  async updateStock(id: string, quantity: number): Promise<Medicine> {
    const medicine = getEnrichedMedicines().find(m => m.id === id);
    if (!medicine) throw new Error('Medicine not found');
    return medicineService.update(id, { stock: Math.max(0, medicine.stock + quantity) });
  },

  async delete(id: string): Promise<void> {
    medicines = medicines.filter(m => m.id !== id);
    return Promise.resolve();
  },

  async search(query: string): Promise<Medicine[]> {
    const all = getEnrichedMedicines();
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
