import { Patient } from '../types';
import { patients as mockPatients } from '../../data/mockData';
import { apiClient } from './api';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    return Promise.resolve([...mockPatients]);
  },

  async getById(id: string): Promise<Patient | null> {
    const all = await this.getAll();
    return all.find(p => p.id === id) || null;
  },

  async create(data: Omit<Patient, 'id' | 'registrationDate'>): Promise<Patient> {
    const all = await this.getAll();
    const newPatient: Patient = {
      ...data,
      id: `P${String(all.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    return Promise.resolve(newPatient);
  },

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    const all = await this.getAll();
    const patient = all.find(p => p.id === id);
    if (!patient) throw new Error('Patient not found');
    return Promise.resolve({ ...patient, ...data });
  },

  async delete(id: string): Promise<void> {
    return Promise.resolve();
  },

  async search(query: string): Promise<Patient[]> {
    const all = await this.getAll();
    const lower = query.toLowerCase();
    return Promise.resolve(
      all.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.id.toLowerCase().includes(lower) ||
        p.email.toLowerCase().includes(lower)
      )
    );
  },
};
