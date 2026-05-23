import { Bill, BillStatus } from '../types';
import { supabase } from '../lib/supabase';
import { getNextPrefixedId, throwIfSupabaseError, toNumber } from './supabaseServiceHelpers';

const mapDbToBill = (row: any): Bill => ({
  id: String(row.id),
  patientId: String(row.patient_id),
  patientName: row.patient_name || '',
  date: row.date || '',
  dueDate: row.due_date || '',
  items: row.items || [],
  subtotal: toNumber(row.subtotal),
  tax: toNumber(row.tax),
  discount: toNumber(row.discount),
  total: toNumber(row.total),
  paid: toNumber(row.paid),
  status: row.status || 'Pending',
  paymentMethod: row.payment_method || '',
  insurance: row.insurance || '',
  insuranceCoverage: toNumber(row.insurance_coverage),
});

const mapBillToDb = (bill: Partial<Bill>) => {
  const row: Record<string, unknown> = {};
  if (bill.id !== undefined) row.id = bill.id;
  if (bill.patientId !== undefined) row.patient_id = bill.patientId;
  if (bill.patientName !== undefined) row.patient_name = bill.patientName;
  if (bill.date !== undefined) row.date = bill.date;
  if (bill.dueDate !== undefined) row.due_date = bill.dueDate;
  if (bill.items !== undefined) row.items = bill.items;
  if (bill.subtotal !== undefined) row.subtotal = bill.subtotal;
  if (bill.tax !== undefined) row.tax = bill.tax;
  if (bill.discount !== undefined) row.discount = bill.discount;
  if (bill.total !== undefined) row.total = bill.total;
  if (bill.paid !== undefined) row.paid = bill.paid;
  if (bill.status !== undefined) row.status = bill.status;
  if (bill.paymentMethod !== undefined) row.payment_method = bill.paymentMethod;
  if (bill.insurance !== undefined) row.insurance = bill.insurance;
  if (bill.insuranceCoverage !== undefined) row.insurance_coverage = bill.insuranceCoverage;
  return row;
};

export const billService = {
  async getAll(): Promise<Bill[]> {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToBill);
  },

  async getById(id: string): Promise<Bill | null> {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    throwIfSupabaseError(error);
    return data ? mapDbToBill(data) : null;
  },

  async getByPatientId(patientId: string): Promise<Bill[]> {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToBill);
  },

  async markPaid(id: string): Promise<Bill> {
    const bill = await this.getById(id);
    if (!bill) throw new Error('Bill not found');
    return this.update(id, { status: 'Paid' as BillStatus, paid: bill.total });
  },

  async create(data: Omit<Bill, 'id'>): Promise<Bill> {
    const id = await getNextPrefixedId('bills', 'B');
    const { data: created, error } = await supabase
      .from('bills')
      .insert([mapBillToDb({ ...data, id })])
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToBill(created);
  },

  async update(id: string, data: Partial<Bill>): Promise<Bill> {
    const { data: updated, error } = await supabase
      .from('bills')
      .update(mapBillToDb(data))
      .eq('id', id)
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToBill(updated);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id);

    throwIfSupabaseError(error);
  },
};
