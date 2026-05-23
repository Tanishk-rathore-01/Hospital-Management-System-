import { MedicalRecord } from '../types';
import { supabase } from '../lib/supabase';
import { getNextPrefixedId, throwIfSupabaseError, toNumber } from './supabaseServiceHelpers';

const mapDbToMedicalRecord = (row: any): MedicalRecord => ({
  id: String(row.id),
  patientId: String(row.patient_id),
  patientName: row.patient_name || '',
  doctorId: String(row.doctor_id),
  doctorName: row.doctor_name || '',
  date: row.date || '',
  diagnosis: row.diagnosis || '',
  symptoms: row.symptoms || [],
  treatment: row.treatment || '',
  prescriptions: row.prescriptions || [],
  labResults: row.lab_results || [],
  notes: row.notes || '',
  followUpDate: row.follow_up_date || '',
  vitals: {
    bloodPressure: row.blood_pressure || '',
    heartRate: toNumber(row.heart_rate),
    temperature: toNumber(row.temperature),
    weight: toNumber(row.weight),
    height: toNumber(row.height),
    oxygenSaturation: toNumber(row.oxygen_saturation),
  },
});

const mapMedicalRecordToDb = (record: Partial<MedicalRecord>) => {
  const row: Record<string, unknown> = {};
  if (record.id !== undefined) row.id = record.id;
  if (record.patientId !== undefined) row.patient_id = record.patientId;
  if (record.patientName !== undefined) row.patient_name = record.patientName;
  if (record.doctorId !== undefined) row.doctor_id = record.doctorId;
  if (record.doctorName !== undefined) row.doctor_name = record.doctorName;
  if (record.date !== undefined) row.date = record.date;
  if (record.diagnosis !== undefined) row.diagnosis = record.diagnosis;
  if (record.symptoms !== undefined) row.symptoms = record.symptoms;
  if (record.treatment !== undefined) row.treatment = record.treatment;
  if (record.prescriptions !== undefined) row.prescriptions = record.prescriptions;
  if (record.labResults !== undefined) row.lab_results = record.labResults;
  if (record.notes !== undefined) row.notes = record.notes;
  if (record.followUpDate !== undefined) row.follow_up_date = record.followUpDate;
  if (record.vitals !== undefined) {
    row.blood_pressure = record.vitals.bloodPressure;
    row.heart_rate = record.vitals.heartRate;
    row.temperature = record.vitals.temperature;
    row.weight = record.vitals.weight;
    row.height = record.vitals.height;
    row.oxygen_saturation = record.vitals.oxygenSaturation;
  }
  return row;
};

export const medicalRecordService = {
  async getAll(): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToMedicalRecord);
  },

  async getById(id: string): Promise<MedicalRecord | null> {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    throwIfSupabaseError(error);
    return data ? mapDbToMedicalRecord(data) : null;
  },

  async getByPatientId(patientId: string): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToMedicalRecord);
  },

  async getByDoctorId(doctorId: string): Promise<MedicalRecord[]> {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('date', { ascending: false });

    throwIfSupabaseError(error);
    return (data || []).map(mapDbToMedicalRecord);
  },

  async create(data: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
    const id = await getNextPrefixedId('medical_records', 'MR');
    const { data: created, error } = await supabase
      .from('medical_records')
      .insert([mapMedicalRecordToDb({ ...data, id })])
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToMedicalRecord(created);
  },

  async update(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const { data: updated, error } = await supabase
      .from('medical_records')
      .update(mapMedicalRecordToDb(data))
      .eq('id', id)
      .select()
      .single();

    throwIfSupabaseError(error);
    return mapDbToMedicalRecord(updated);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('medical_records')
      .delete()
      .eq('id', id);

    throwIfSupabaseError(error);
  },

  async search(query: string): Promise<MedicalRecord[]> {
    const lower = query.toLowerCase();
    const all = await this.getAll();
    return all.filter(r =>
      r.patientName.toLowerCase().includes(lower) ||
      r.diagnosis.toLowerCase().includes(lower) ||
      r.doctorName.toLowerCase().includes(lower)
    );
  },
};
