import { Appointment, AppointmentStatus } from '../types';
import { supabase } from '../lib/supabase';
import { getNextPrefixedId, throwIfSupabaseError, toNumber } from './supabaseServiceHelpers';

const mapDbToAppointment = (row: any): Appointment => ({
  id: String(row.id),
  patientId: String(row.patient_id),
  patientName: row.patient_name || '',
  doctorId: String(row.doctor_id),
  doctorName: row.doctor_name || '',
  department: row.department || '',
  date: row.date || '',
  time: row.time || '',
  type: row.type || 'Consultation',
  status: row.status || 'Scheduled',
  notes: row.notes || '',
  fee: toNumber(row.fee),
});

const mapAppointmentToDb = (appointment: Partial<Appointment>) => {
  const row: Record<string, unknown> = {};
  if (appointment.id !== undefined) row.id = appointment.id;
  if (appointment.patientId !== undefined) row.patient_id = appointment.patientId;
  if (appointment.patientName !== undefined) row.patient_name = appointment.patientName;
  if (appointment.doctorId !== undefined) row.doctor_id = appointment.doctorId;
  if (appointment.doctorName !== undefined) row.doctor_name = appointment.doctorName;
  if (appointment.department !== undefined) row.department = appointment.department;
  if (appointment.date !== undefined) row.date = appointment.date;
  if (appointment.time !== undefined) row.time = appointment.time;
  if (appointment.type !== undefined) row.type = appointment.type;
  if (appointment.status !== undefined) row.status = appointment.status;
  if (appointment.notes !== undefined) row.notes = appointment.notes;
  if (appointment.fee !== undefined) row.fee = appointment.fee;
  return row;
};

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToAppointment);
  },

  async getById(id: string): Promise<Appointment | null> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    throwIfSupabaseError(error);
    return data ? mapDbToAppointment(data) : null;
  },

  async create(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    const id = await getNextPrefixedId('appointments', 'A');
    const { data: created, error } = await supabase
      .from('appointments')
      .insert([mapAppointmentToDb({ ...data, id })])
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToAppointment(created);
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return this.update(id, { status });
  },

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const { data: updated, error } = await supabase
      .from('appointments')
      .update(mapAppointmentToDb(data))
      .eq('id', id)
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToAppointment(updated);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    throwIfSupabaseError(error);
  },
};
