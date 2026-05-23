import { PharmacyOrder } from '../types';
import { supabase } from '../lib/supabase';
import { getNextPrefixedId, throwIfSupabaseError, toNumber } from './supabaseServiceHelpers';

const mapDbToPharmacyOrder = (row: any): PharmacyOrder => ({
  id: String(row.id),
  patientId: String(row.patient_id),
  patientName: row.patient_name || '',
  doctorId: String(row.doctor_id),
  doctorName: row.doctor_name || '',
  date: row.date || '',
  medicines: row.medicines || [],
  total: toNumber(row.total),
  status: row.status || 'Pending',
});

const mapPharmacyOrderToDb = (order: Partial<PharmacyOrder>) => {
  const row: Record<string, unknown> = {};
  if (order.id !== undefined) row.id = order.id;
  if (order.patientId !== undefined) row.patient_id = order.patientId;
  if (order.patientName !== undefined) row.patient_name = order.patientName;
  if (order.doctorId !== undefined) row.doctor_id = order.doctorId;
  if (order.doctorName !== undefined) row.doctor_name = order.doctorName;
  if (order.date !== undefined) row.date = order.date;
  if (order.medicines !== undefined) row.medicines = order.medicines;
  if (order.total !== undefined) row.total = order.total;
  if (order.status !== undefined) row.status = order.status;
  return row;
};

export const pharmacyService = {
  async getAll(): Promise<PharmacyOrder[]> {
    const { data, error } = await supabase
      .from('pharmacy_orders')
      .select('*')
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToPharmacyOrder);
  },

  async getById(id: string): Promise<PharmacyOrder | null> {
    const { data, error } = await supabase
      .from('pharmacy_orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    throwIfSupabaseError(error);
    return data ? mapDbToPharmacyOrder(data) : null;
  },

  async getByPatientId(patientId: string): Promise<PharmacyOrder[]> {
    const { data, error } = await supabase
      .from('pharmacy_orders')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToPharmacyOrder);
  },

  async getByStatus(status: 'Pending' | 'Dispensed' | 'Cancelled'): Promise<PharmacyOrder[]> {
    const { data, error } = await supabase
      .from('pharmacy_orders')
      .select('*')
      .eq('status', status)
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToPharmacyOrder);
  },

  async create(data: Omit<PharmacyOrder, 'id'>): Promise<PharmacyOrder> {
    const id = await getNextPrefixedId('pharmacy_orders', 'PO');
    const { data: created, error } = await supabase
      .from('pharmacy_orders')
      .insert([mapPharmacyOrderToDb({ ...data, id })])
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToPharmacyOrder(created);
  },

  async dispenseOrder(id: string): Promise<PharmacyOrder> {
    return this.update(id, { status: 'Dispensed' });
  },

  async cancelOrder(id: string): Promise<PharmacyOrder> {
    return this.update(id, { status: 'Cancelled' });
  },

  async update(id: string, data: Partial<PharmacyOrder>): Promise<PharmacyOrder> {
    const { data: updated, error } = await supabase
      .from('pharmacy_orders')
      .update(mapPharmacyOrderToDb(data))
      .eq('id', id)
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToPharmacyOrder(updated);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('pharmacy_orders')
      .delete()
      .eq('id', id);

    throwIfSupabaseError(error);
  },
};
