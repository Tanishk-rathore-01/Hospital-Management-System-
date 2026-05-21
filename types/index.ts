export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  dateOfBirth: string;
  registrationDate: string;
  status: 'Active' | 'Inactive' | 'Discharged';
  emergencyContact: string;
  insurance: string;
  allergies: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  experience: number;
  availability: string[];
  status: 'Available' | 'On Leave' | 'Busy';
  avatar: string;
  rating: number;
  patients: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery' | 'Checkup';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  notes: string;
  fee: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  prescriptions: Prescription[];
  labResults: LabResult[];
  notes: string;
  followUpDate: string;
  vitals: Vitals;
}

export interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  weight: number;
  height: number;
  oxygenSaturation: number;
}

export interface Prescription {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface LabResult {
  test: string;
  result: string;
  normalRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  date: string;
}

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paid: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partial';
  paymentMethod: string;
  insurance: string;
  insuranceCoverage: number;
}

export interface BillItem {
  description: string;
  category: 'Consultation' | 'Lab Test' | 'Medication' | 'Surgery' | 'Room' | 'Other';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  expiryDate: string;
  batchNumber: string;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired';
}

export interface PharmacyOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicines: OrderMedicine[];
  total: number;
  status: 'Pending' | 'Dispensed' | 'Cancelled';
}

export interface OrderMedicine {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  total: number;
}

export type NavItem = 
  | 'landing'
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'medical-records'
  | 'billing'
  | 'pharmacy'
  | 'reports';
