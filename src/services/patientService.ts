import { Patient } from '../types';
import { supabase } from '../lib/supabase';
import { throwIfSupabaseError, toNumber } from './supabaseServiceHelpers';

// Helper function to map database snake_case to TypeScript camelCase
const mapDbToPatient = (dbPatient: any): Patient => ({
  id: String(dbPatient.id),
  name: dbPatient.name || '',
  age: toNumber(dbPatient.age),
  gender: dbPatient.gender || 'Other',
  phone: dbPatient.phone || '',
  email: dbPatient.email || '',
  address: dbPatient.address || '',
  bloodGroup: dbPatient.blood_group || 'O+',
  dateOfBirth: dbPatient.date_of_birth || '',
  registrationDate: dbPatient.registration_date || '',
  status: dbPatient.status || 'Active',
  emergencyContact: dbPatient.emergency_contact || '',
  insurance: dbPatient.insurance || '',
  allergies: dbPatient.allergies || [],
});

// Helper function to map TypeScript camelCase to database snake_case
const mapPatientToDb = (patient: Partial<Patient>) => {
  const row: Record<string, unknown> = {};
  if (patient.id !== undefined) row.id = patient.id;
  if (patient.name !== undefined) row.name = patient.name;
  if (patient.age !== undefined) row.age = patient.age;
  if (patient.gender !== undefined) row.gender = patient.gender;
  if (patient.phone !== undefined) row.phone = patient.phone;
  if (patient.email !== undefined) row.email = patient.email;
  if (patient.address !== undefined) row.address = patient.address;
  if (patient.bloodGroup !== undefined) row.blood_group = patient.bloodGroup;
  if (patient.dateOfBirth !== undefined) row.date_of_birth = patient.dateOfBirth;
  if (patient.registrationDate !== undefined) row.registration_date = patient.registrationDate;
  if (patient.status !== undefined) row.status = patient.status;
  if (patient.emergencyContact !== undefined) row.emergency_contact = patient.emergencyContact;
  if (patient.insurance !== undefined) row.insurance = patient.insurance;
  if (patient.allergies !== undefined) row.allergies = patient.allergies;
  return row;
};

export const patientService = {
  async getAll(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    throwIfSupabaseError(error);
    return (data || []).map(mapDbToPatient);
  },

  async getById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throwIfSupabaseError(error);
    return data ? mapDbToPatient(data) : null;
  },

  async create(data: Omit<Patient, 'id' | 'registrationDate'>): Promise<Patient> {
    const dbData = mapPatientToDb({
      ...data,
      registrationDate: new Date().toISOString().slice(0, 10),
      status: data.status || 'Active',
    });
    const { data: created, error } = await supabase
      .from('patients')
      .insert([dbData])
      .select()
      .single();
    
    throwIfSupabaseError(error);
    return mapDbToPatient(created);
  },

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    const dbData = mapPatientToDb(data);
    const { data: updated, error } = await supabase
      .from('patients')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();
    
    throwIfSupabaseError(error);
    return mapDbToPatient(updated);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    throwIfSupabaseError(error);
  },

  async search(query: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);
    
    throwIfSupabaseError(error);
    return (data || []).map(mapDbToPatient);
  },
};
