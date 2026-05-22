import { Appointment, AppointmentStatus } from '../types';
import { appointments as mockAppointments } from '../../data/mockData';
import { apiClient } from './api';

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    // Mock: return mock data
    // Real: return await apiClient.get<Appointment[]>('/appointments');
    return Promise.resolve([...mockAppointments]);
  },

  async getById(id: string): Promise<Appointment | null> {
    const all = await this.getAll();
    return all.find(a => a.id === id) || null;
  },

  async create(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    const all = await this.getAll();
    const newAppointment: Appointment = {
      ...data,
      id: `A${String(all.length + 1).padStart(3, '0')}`,
    };
    // Mock: would be await apiClient.post<Appointment>('/appointments', newAppointment);
    return Promise.resolve(newAppointment);
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<void> {
    // Real: await apiClient.patch(`/appointments/${id}/status`, { status });
    return Promise.resolve();
  },

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const all = await this.getAll();
    const appointment = all.find(a => a.id === id);
    if (!appointment) throw new Error('Appointment not found');
    // Real: await apiClient.patch(`/appointments/${id}`, data);
    return Promise.resolve({ ...appointment, ...data });
  },

  async delete(id: string): Promise<void> {
    // Real: await apiClient.delete(`/appointments/${id}`);
    return Promise.resolve();
  },
};
