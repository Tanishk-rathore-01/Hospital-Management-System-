import { Appointment, AppointmentStatus } from '../types';
import { appointments as mockAppointments } from '../../data/mockData';

let appointments = [...mockAppointments];

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    return Promise.resolve([...appointments]);
  },

  async getById(id: string): Promise<Appointment | null> {
    const all = await this.getAll();
    return all.find(a => a.id === id) || null;
  },

  async create(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...data,
      id: `A${String(appointments.length + 1).padStart(3, '0')}`,
    };
    appointments = [newAppointment, ...appointments];
    return Promise.resolve(newAppointment);
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const updated = appointments.find(a => a.id === id);
    if (!updated) throw new Error('Appointment not found');
    const appointment = { ...updated, status };
    appointments = appointments.map(a => a.id === id ? appointment : a);
    return Promise.resolve(appointment);
  },

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const all = await this.getAll();
    const appointment = all.find(a => a.id === id);
    if (!appointment) throw new Error('Appointment not found');
    const updated = { ...appointment, ...data };
    appointments = appointments.map(a => a.id === id ? updated : a);
    return Promise.resolve(updated);
  },

  async delete(id: string): Promise<void> {
    appointments = appointments.filter(a => a.id !== id);
    return Promise.resolve();
  },
};
