import { Medicine, MedicineStatus } from '../types';
import { supabase } from '../lib/supabase';
import { getNextPrefixedId, throwIfSupabaseError, toNumber } from './supabaseServiceHelpers';

function determineMedicineStatus(medicine: Pick<Medicine, 'expiryDate' | 'stock' | 'minStock'>): MedicineStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
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

const mapDbToMedicine = (row: any): Medicine => enrichMedicine({
  id: String(row.id),
  name: row.name || '',
  genericName: row.generic_name || '',
  category: row.category || '',
  manufacturer: row.manufacturer || '',
  stock: toNumber(row.stock),
  minStock: toNumber(row.min_stock),
  unit: row.unit || '',
  price: toNumber(row.price),
  expiryDate: row.expiry_date || '',
  batchNumber: row.batch_number || '',
  location: row.location || '',
  status: row.status || 'In Stock',
});

const mapMedicineToDb = (medicine: Partial<Medicine>) => {
  const row: Record<string, unknown> = {};
  if (medicine.id !== undefined) row.id = medicine.id;
  if (medicine.name !== undefined) row.name = medicine.name;
  if (medicine.genericName !== undefined) row.generic_name = medicine.genericName;
  if (medicine.category !== undefined) row.category = medicine.category;
  if (medicine.manufacturer !== undefined) row.manufacturer = medicine.manufacturer;
  if (medicine.stock !== undefined) row.stock = medicine.stock;
  if (medicine.minStock !== undefined) row.min_stock = medicine.minStock;
  if (medicine.unit !== undefined) row.unit = medicine.unit;
  if (medicine.price !== undefined) row.price = medicine.price;
  if (medicine.expiryDate !== undefined) row.expiry_date = medicine.expiryDate;
  if (medicine.batchNumber !== undefined) row.batch_number = medicine.batchNumber;
  if (medicine.location !== undefined) row.location = medicine.location;
  if (medicine.status !== undefined) row.status = medicine.status;
  return row;
};

export const medicineService = {
  _determineMedicineStatus: determineMedicineStatus,
  _enrichMedicine: enrichMedicine,

  async getAll(): Promise<Medicine[]> {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name', { ascending: true });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToMedicine);
  },

  async getById(id: string): Promise<Medicine | null> {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    throwIfSupabaseError(error);
    return data ? mapDbToMedicine(data) : null;
  },

  async getByStatus(status: MedicineStatus): Promise<Medicine[]> {
    const all = await this.getAll();
    return all.filter(m => m.status === status);
  },

  async getLowStockAlerts(): Promise<Medicine[]> {
    const all = await this.getAll();
    return all.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock' || m.status === 'Expired');
  },

  async create(data: Omit<Medicine, 'id'>): Promise<Medicine> {
    const id = await getNextPrefixedId('medicines', 'M');
    const enriched = enrichMedicine({ ...data, id });
    const { data: created, error } = await supabase
      .from('medicines')
      .insert([mapMedicineToDb(enriched)])
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToMedicine(created);
  },

  async update(id: string, data: Partial<Medicine>): Promise<Medicine> {
    const current = await this.getById(id);
    if (!current) throw new Error('Medicine not found');
    const enriched = enrichMedicine({ ...current, ...data });
    const { data: updated, error } = await supabase
      .from('medicines')
      .update(mapMedicineToDb(enriched))
      .eq('id', id)
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToMedicine(updated);
  },

  async updateStock(id: string, quantity: number): Promise<Medicine> {
    const medicine = await this.getById(id);
    if (!medicine) throw new Error('Medicine not found');
    return this.update(id, { stock: Math.max(0, medicine.stock + quantity) });
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    throwIfSupabaseError(error);
  },

  async search(query: string): Promise<Medicine[]> {
    const lower = query.toLowerCase();
    const all = await this.getAll();
    return all.filter(m =>
      m.name.toLowerCase().includes(lower) ||
      m.genericName.toLowerCase().includes(lower) ||
      m.category.toLowerCase().includes(lower)
    );
  },
};
