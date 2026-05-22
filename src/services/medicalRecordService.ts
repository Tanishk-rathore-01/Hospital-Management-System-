import { MedicalRecord } from '../types';
import { medicalRecords as mockRecords } from '../../data/mockData';
import { apiClient } from './api';

export const medicalRecordService = {
  async getAll(): Promise<MedicalRecord[]> {
    return Promise.resolve([...mockRecords]);
  },

  async getById(id: string): Promise<MedicalRecord | null> {
    const all = await this.getAll();
    return all.find(r => r.id === id) || null;
  },

  async getByPatientId(patientId: string): Promise<MedicalRecord[]> {
    const all = await this.getAll();
    return Promise.resolve(all.filter(r => r.patientId === patientId));
  },

  async getByDoctorId(doctorId: string): Promise<MedicalRecord[]> {
    const all = await this.getAll();
    return Promise.resolve(all.filter(r => r.doctorId === doctorId));
  },

  async create(data: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
    const all = await this.getAll();
    const newRecord: MedicalRecord = {
      ...data,
      id: `MR${String(all.length + 1).padStart(3, '0')}`,
    };
    return Promise.resolve(newRecord);
  },

  async update(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const all = await this.getAll();
    const record = all.find(r => r.id === id);
    if (!record) throw new Error('Medical record not found');
    return Promise.resolve({ ...record, ...data });
  },

  async delete(id: string): Promise<void> {
    return Promise.resolve();
  },

  async search(query: string): Promise<MedicalRecord[]> {
    const all = await this.getAll();
    const lower = query.toLowerCase();
    return Promise.resolve(
      all.filter(r =>
        r.patientName.toLowerCase().includes(lower) ||
        r.diagnosis.toLowerCase().includes(lower) ||
        r.doctorName.toLowerCase().includes(lower)
      )
    );
  },
};
