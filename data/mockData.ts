import { Patient, Doctor, Appointment, MedicalRecord, Bill, Medicine, PharmacyOrder } from '../types';

const indiaDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const todayIso = indiaDateFormatter.format(new Date());

export const patients: Patient[] = [
  {
    id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'Male', phone: '+91-98765-0101',
    email: 'rajesh.kumar@apexhealthcare.com', address: '12 M.G. Road, Mumbai, Maharashtra 400001',
    bloodGroup: 'O+', dateOfBirth: '1979-03-15', registrationDate: '2024-01-10',
    status: 'Active', emergencyContact: '+91-98765-0102', insurance: 'Apollo Munich',
    allergies: ['Penicillin', 'Sulfa']
  },
  {
    id: 'P002', name: 'Priya Sharma', age: 32, gender: 'Female', phone: '+91-98765-0103',
    email: 'priya.sharma@apexhealthcare.com', address: '34 Residency Road, Bengaluru, Karnataka 560025',
    bloodGroup: 'A+', dateOfBirth: '1992-07-22', registrationDate: '2024-01-15',
    status: 'Active', emergencyContact: '+91-98765-0104', insurance: 'Max Bupa',
    allergies: ['Latex']
  },
  {
    id: 'P003', name: 'Rohit Singh', age: 58, gender: 'Male', phone: '+91-98765-0105',
    email: 'rohit.singh@apexhealthcare.com', address: '7 Park Lane, New Delhi, Delhi 110001',
    bloodGroup: 'B-', dateOfBirth: '1966-11-08', registrationDate: '2024-02-01',
    status: 'Active', emergencyContact: '+91-98765-0106', insurance: 'ICICI Lombard',
    allergies: []
  },
  {
    id: 'P004', name: 'Ananya Gupta', age: 28, gender: 'Female', phone: '+91-98765-0107',
    email: 'ananya.gupta@apexhealthcare.com', address: '22 Nehru Street, Chennai, Tamil Nadu 600001',
    bloodGroup: 'AB+', dateOfBirth: '1996-05-30', registrationDate: '2024-02-10',
    status: 'Active', emergencyContact: '+91-98765-0108', insurance: 'Star Health',
    allergies: ['Aspirin']
  },
  {
    id: 'P005', name: 'Vikram Patel', age: 67, gender: 'Male', phone: '+91-98765-0109',
    email: 'vikram.patel@apexhealthcare.com', address: '89 Marine Drive, Mumbai, Maharashtra 400002',
    bloodGroup: 'O-', dateOfBirth: '1957-09-14', registrationDate: '2024-02-20',
    status: 'Discharged', emergencyContact: '+91-98765-0110', insurance: 'Bajaj Allianz',
    allergies: ['Ibuprofen', 'Codeine']
  },
  {
    id: 'P006', name: 'Neha Rao', age: 41, gender: 'Female', phone: '+91-98765-0111',
    email: 'neha.rao@apexhealthcare.com', address: '50 Banjara Hills, Hyderabad, Telangana 500034',
    bloodGroup: 'A-', dateOfBirth: '1983-01-25', registrationDate: '2024-03-01',
    status: 'Active', emergencyContact: '+91-98765-0112', insurance: 'HDFC Ergo',
    allergies: []
  },
  {
    id: 'P007', name: 'Suresh Iyer', age: 52, gender: 'Male', phone: '+91-98765-0113',
    email: 'suresh.iyer@apexhealthcare.com', address: '11 Park Street, Kolkata, West Bengal 700016',
    bloodGroup: 'B+', dateOfBirth: '1972-06-18', registrationDate: '2024-03-05',
    status: 'Active', emergencyContact: '+91-98765-0114', insurance: 'New India Assurance',
    allergies: ['Morphine']
  },
  {
    id: 'P008', name: 'Kavita Menon', age: 35, gender: 'Female', phone: '+91-98765-0115',
    email: 'kavita.menon@apexhealthcare.com', address: '5 Church Road, Pune, Maharashtra 411001',
    bloodGroup: 'O+', dateOfBirth: '1989-12-03', registrationDate: '2024-03-12',
    status: 'Active', emergencyContact: '+91-98765-0116', insurance: 'SBI General',
    allergies: []
  },
];

export const doctors: Doctor[] = [
  {
    id: 'D001', name: 'Dr. Amit Sharma', specialization: 'Cardiologist', department: 'Cardiology',
    phone: '+91-98765-1001', email: 'amit.sharma@apexhealthcare.com', experience: 15,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], status: 'Available',
    avatar: 'AS', rating: 4.9, patients: 342
  },
  {
    id: 'D002', name: 'Dr. Priya Iyer', specialization: 'Neurologist', department: 'Neurology',
    phone: '+91-98765-1002', email: 'priya.iyer@apexhealthcare.com', experience: 12,
    availability: ['Mon', 'Wed', 'Fri'], status: 'Busy',
    avatar: 'PI', rating: 4.8, patients: 287
  },
  {
    id: 'D003', name: 'Dr. Rahul Verma', specialization: 'Pediatrician', department: 'Pediatrics',
    phone: '+91-98765-1003', email: 'rahul.verma@apexhealthcare.com', experience: 8,
    availability: ['Mon', 'Tue', 'Thu', 'Fri'], status: 'Available',
    avatar: 'RV', rating: 4.9, patients: 412
  },
  {
    id: 'D004', name: 'Dr. Arjun Mehta', specialization: 'Orthopedic Surgeon', department: 'Orthopedics',
    phone: '+91-98765-1004', email: 'arjun.mehta@apexhealthcare.com', experience: 20,
    availability: ['Tue', 'Wed', 'Thu'], status: 'Available',
    avatar: 'AM', rating: 4.7, patients: 198
  },
  {
    id: 'D005', name: 'Dr. Neha Kapoor', specialization: 'Dermatologist', department: 'Dermatology',
    phone: '+91-98765-1005', email: 'neha.kapoor@apexhealthcare.com', experience: 10,
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], status: 'On Leave',
    avatar: 'NK', rating: 4.6, patients: 156
  },
  {
    id: 'D006', name: 'Dr. Sunita Rao', specialization: 'Oncologist', department: 'Oncology',
    phone: '+91-98765-1006', email: 'sunita.rao@apexhealthcare.com', experience: 18,
    availability: ['Mon', 'Wed', 'Fri'], status: 'Available',
    avatar: 'SR', rating: 4.8, patients: 124
  },
];

export const appointments: Appointment[] = [
  {
    id: 'A001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001',
    doctorName: 'Dr. Amit Sharma', department: 'Cardiology', date: todayIso,
    time: '09:00 AM', type: 'Consultation', status: 'Scheduled', notes: 'Regular heart checkup', fee: 1200
  },
  {
    id: 'A002', patientId: 'P002', patientName: 'Priya Sharma', doctorId: 'D003',
    doctorName: 'Dr. Rahul Verma', department: 'Pediatrics', date: todayIso,
    time: '10:30 AM', type: 'Follow-up', status: 'In Progress', notes: 'Follow up on flu treatment', fee: 800
  },
  {
    id: 'A003', patientId: 'P003', patientName: 'Rohit Singh', doctorId: 'D002',
    doctorName: 'Dr. Priya Iyer', department: 'Neurology', date: '2026-05-20',
    time: '02:00 PM', type: 'Checkup', status: 'Completed', notes: 'Migraine assessment', fee: 1500
  },
  {
    id: 'A004', patientId: 'P004', patientName: 'Ananya Gupta', doctorId: 'D005',
    doctorName: 'Dr. Neha Kapoor', department: 'Dermatology', date: '2026-05-22',
    time: '11:00 AM', type: 'Consultation', status: 'Scheduled', notes: 'Skin rash examination', fee: 900
  },
  {
    id: 'A005', patientId: 'P005', patientName: 'Vikram Patel', doctorId: 'D004',
    doctorName: 'Dr. Arjun Mehta', department: 'Orthopedics', date: '2026-05-18',
    time: '03:30 PM', type: 'Surgery', status: 'Completed', notes: 'Knee replacement surgery', fee: 185000
  },
  {
    id: 'A006', patientId: 'P006', patientName: 'Neha Rao', doctorId: 'D001',
    doctorName: 'Dr. Amit Sharma', department: 'Cardiology', date: '2026-05-23',
    time: '09:30 AM', type: 'Emergency', status: 'Scheduled', notes: 'Chest pain complaint', fee: 2500
  },
  {
    id: 'A007', patientId: 'P007', patientName: 'Suresh Iyer', doctorId: 'D006',
    doctorName: 'Dr. Sunita Rao', department: 'Oncology', date: todayIso,
    time: '01:00 PM', type: 'Follow-up', status: 'Scheduled', notes: 'Chemotherapy follow-up', fee: 1800
  },
  {
    id: 'A008', patientId: 'P008', patientName: 'Kavita Menon', doctorId: 'D003',
    doctorName: 'Dr. Rahul Verma', department: 'Pediatrics', date: '2026-05-20',
    time: '04:00 PM', type: 'Consultation', status: 'Cancelled', notes: 'Child vaccination', fee: 600
  },
];

export const medicalRecords: MedicalRecord[] = [
  {
    id: 'MR001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001',
    doctorName: 'Dr. Amit Sharma', date: '2026-05-14',
    diagnosis: 'Hypertension Stage 2', symptoms: ['Headache', 'Dizziness', 'Chest tightness'],
    treatment: 'Prescribed antihypertensive medications and lifestyle modifications',
    prescriptions: [
      { medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning with water' },
      { medication: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Can be taken with or without food' }
    ],
    labResults: [
      { test: 'Blood Pressure', result: '158/98 mmHg', normalRange: '120/80 mmHg', status: 'Abnormal', date: '2026-05-14' },
      { test: 'Cholesterol', result: '245 mg/dL', normalRange: '<200 mg/dL', status: 'Abnormal', date: '2026-05-14' },
      { test: 'Blood Glucose', result: '102 mg/dL', normalRange: '70-100 mg/dL', status: 'Normal', date: '2026-05-14' },
    ],
    notes: 'Patient advised to reduce sodium intake and increase physical activity. Follow up in 4 weeks.',
    followUpDate: '2026-06-14',
    vitals: { bloodPressure: '158/98', heartRate: 88, temperature: 37.0, weight: 84, height: 183, oxygenSaturation: 97 }
  },
  {
    id: 'MR002', patientId: 'P002', patientName: 'Priya Sharma', doctorId: 'D003',
    doctorName: 'Dr. Rahul Verma', date: '2026-05-10',
    diagnosis: 'Acute Upper Respiratory Infection', symptoms: ['Fever', 'Cough', 'Sore throat', 'Runny nose'],
    treatment: 'Symptomatic treatment with rest and hydration',
    prescriptions: [
      { medication: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days', instructions: 'Complete full course' },
      { medication: 'Paracetamol', dosage: '500mg', frequency: 'As needed (max 4 times/day)', duration: '5 days', instructions: 'Take when fever exceeds 101°F' }
    ],
    labResults: [
      { test: 'Complete Blood Count', result: 'WBC: 11,200/μL', normalRange: '4,500-11,000/μL', status: 'Abnormal', date: '2026-05-10' },
      { test: 'Throat Culture', result: 'Streptococcus positive', normalRange: 'Negative', status: 'Critical', date: '2026-05-10' },
    ],
    notes: 'Strep throat confirmed. Started antibiotic therapy.',
    followUpDate: '2026-06-04',
    vitals: { bloodPressure: '118/76', heartRate: 96, temperature: 38.4, weight: 61, height: 165, oxygenSaturation: 99 }
  },
  {
    id: 'MR003', patientId: 'P003', patientName: 'Rohit Singh', doctorId: 'D002',
    doctorName: 'Dr. Priya Iyer', date: '2026-05-20',
    diagnosis: 'Chronic Migraine with Aura', symptoms: ['Severe headache', 'Visual disturbances', 'Nausea', 'Light sensitivity'],
    treatment: 'Prescribed triptan medications and preventive therapy',
    prescriptions: [
      { medication: 'Sumatriptan', dosage: '50mg', frequency: 'As needed at onset', duration: '30 days', instructions: 'Take at first sign of migraine' },
      { medication: 'Propranolol', dosage: '40mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Preventive therapy - do not stop abruptly' }
    ],
    labResults: [
      { test: 'MRI Brain', result: 'No structural abnormalities', normalRange: 'Normal', status: 'Normal', date: '2026-05-18' },
      { test: 'EEG', result: 'Normal brain activity', normalRange: 'Normal', status: 'Normal', date: '2026-05-18' },
    ],
    notes: 'Patient reports 3-4 episodes per month. Trigger diary recommended.',
    followUpDate: '2026-06-18',
    vitals: { bloodPressure: '122/80', heartRate: 72, temperature: 36.9, weight: 76, height: 178, oxygenSaturation: 98 }
  },
];

export const bills: Bill[] = [
  {
    id: 'B001', patientId: 'P001', patientName: 'Rajesh Kumar', date: '2026-05-14',
    dueDate: '2026-05-29', items: [
      { description: 'Cardiology Consultation', category: 'Consultation', quantity: 1, unitPrice: 1200, total: 1200 },
      { description: 'ECG Test', category: 'Lab Test', quantity: 1, unitPrice: 900, total: 900 },
      { description: 'Blood Panel', category: 'Lab Test', quantity: 1, unitPrice: 1600, total: 1600 },
      { description: 'Lisinopril 10mg (30 tabs)', category: 'Medication', quantity: 1, unitPrice: 1300, total: 1300 },
    ],
    subtotal: 5000, tax: 250, discount: 500, total: 4750, paid: 4750,
    status: 'Paid', paymentMethod: 'Insurance + UPI', insurance: 'Apollo Munich', insuranceCoverage: 3500
  },
  {
    id: 'B002', patientId: 'P005', patientName: 'Vikram Patel', date: '2026-05-18',
    dueDate: '2026-06-02', items: [
      { description: 'Knee Replacement Surgery', category: 'Surgery', quantity: 1, unitPrice: 185000, total: 185000 },
      { description: 'Anesthesia', category: 'Other', quantity: 1, unitPrice: 22000, total: 22000 },
      { description: 'Hospital Room (3 days)', category: 'Room', quantity: 3, unitPrice: 4500, total: 13500 },
      { description: 'Post-op Medications', category: 'Medication', quantity: 1, unitPrice: 5800, total: 5800 },
      { description: 'X-Ray & Imaging', category: 'Lab Test', quantity: 2, unitPrice: 1800, total: 3600 },
    ],
    subtotal: 229900, tax: 11495, discount: 10000, total: 231395, paid: 120000,
    status: 'Partial', paymentMethod: 'Insurance + UPI', insurance: 'Bajaj Allianz', insuranceCoverage: 150000
  },
  {
    id: 'B003', patientId: 'P002', patientName: 'Priya Sharma', date: '2026-05-10',
    dueDate: '2026-05-25', items: [
      { description: 'Pediatric Consultation', category: 'Consultation', quantity: 1, unitPrice: 800, total: 800 },
      { description: 'Throat Culture Test', category: 'Lab Test', quantity: 1, unitPrice: 950, total: 950 },
      { description: 'Amoxicillin 500mg (21 tabs)', category: 'Medication', quantity: 1, unitPrice: 680, total: 680 },
    ],
    subtotal: 2430, tax: 122, discount: 0, total: 2552, paid: 2552,
    status: 'Paid', paymentMethod: 'Card / UPI', insurance: 'Niva Bupa', insuranceCoverage: 0
  },
  {
    id: 'B004', patientId: 'P007', patientName: 'Suresh Iyer', date: '2026-05-01',
    dueDate: '2026-05-16', items: [
      { description: 'Oncology Consultation', category: 'Consultation', quantity: 1, unitPrice: 1800, total: 1800 },
      { description: 'Chemotherapy Session', category: 'Other', quantity: 3, unitPrice: 18500, total: 55500 },
      { description: 'Lab Work', category: 'Lab Test', quantity: 1, unitPrice: 2450, total: 2450 },
    ],
    subtotal: 59750, tax: 2988, discount: 2000, total: 60738, paid: 0,
    status: 'Overdue', paymentMethod: 'Pending', insurance: 'New India Assurance', insuranceCoverage: 30000
  },
  {
    id: 'B005', patientId: 'P006', patientName: 'Neha Rao', date: '2026-05-23',
    dueDate: '2026-06-07', items: [
      { description: 'Emergency Consultation', category: 'Consultation', quantity: 1, unitPrice: 2500, total: 2500 },
      { description: 'Cardiac Monitoring', category: 'Other', quantity: 1, unitPrice: 3200, total: 3200 },
      { description: 'Emergency Lab Panel', category: 'Lab Test', quantity: 1, unitPrice: 1950, total: 1950 },
    ],
    subtotal: 7650, tax: 383, discount: 0, total: 8033, paid: 0,
    status: 'Pending', paymentMethod: 'Pending', insurance: 'HDFC Ergo', insuranceCoverage: 5000
  },
];

export const medicines: Medicine[] = [
  {
    id: 'M001', name: 'Lisinopril', genericName: 'Lisinopril', category: 'Antihypertensive',
    manufacturer: 'Lupin Pharma', stock: 450, minStock: 100, unit: 'Tablets', price: 4.50,
    expiryDate: '2026-08-30', batchNumber: 'LP2024001', location: 'Shelf A-1', status: 'In Stock'
  },
  {
    id: 'M002', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'Antibiotic',
    manufacturer: 'Sun Pharma', stock: 85, minStock: 100, unit: 'Capsules', price: 12,
    expiryDate: '2026-12-15', batchNumber: 'SP2024045', location: 'Shelf B-3', status: 'Low Stock'
  },
  {
    id: 'M003', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic',
    manufacturer: 'GSK', stock: 1200, minStock: 200, unit: 'Tablets', price: 2,
    expiryDate: '2026-06-20', batchNumber: 'GSK2024089', location: 'Shelf A-2', status: 'In Stock'
  },
  {
    id: 'M004', name: 'Metformin 850mg', genericName: 'Metformin HCl', category: 'Antidiabetic',
    manufacturer: 'Cipla', stock: 320, minStock: 80, unit: 'Tablets', price: 5.50,
    expiryDate: '2026-03-10', batchNumber: 'CP2024112', location: 'Shelf C-1', status: 'In Stock'
  },
  {
    id: 'M005', name: 'Atorvastatin 40mg', genericName: 'Atorvastatin', category: 'Statin',
    manufacturer: 'Pfizer', stock: 0, minStock: 60, unit: 'Tablets', price: 18,
    expiryDate: '2026-01-25', batchNumber: 'PF2024078', location: 'Shelf D-2', status: 'Out of Stock'
  },
  {
    id: 'M006', name: 'Amlodipine 5mg', genericName: 'Amlodipine Besylate', category: 'Calcium Channel Blocker',
    manufacturer: 'Lupin Pharma', stock: 280, minStock: 75, unit: 'Tablets', price: 4,
    expiryDate: '2026-09-30', batchNumber: 'LP2024056', location: 'Shelf A-3', status: 'In Stock'
  },
  {
    id: 'M007', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'PPI',
    manufacturer: 'AstraZeneca', stock: 42, minStock: 100, unit: 'Capsules', price: 15,
    expiryDate: '2024-12-01', batchNumber: 'AZ2023199', location: 'Shelf B-1', status: 'Expired'
  },
  {
    id: 'M008', name: 'Sumatriptan 50mg', genericName: 'Sumatriptan Succinate', category: 'Antimigraine',
    manufacturer: 'Novartis', stock: 145, minStock: 40, unit: 'Tablets', price: 95,
    expiryDate: '2026-05-15', batchNumber: 'NV2024034', location: 'Shelf E-1', status: 'In Stock'
  },
  {
    id: 'M009', name: 'Insulin Glargine', genericName: 'Insulin Glargine', category: 'Insulin',
    manufacturer: 'Sanofi', stock: 65, minStock: 50, unit: 'Vials', price: 760,
    expiryDate: '2026-11-20', batchNumber: 'SA2024067', location: 'Refrigerator R-1', status: 'In Stock'
  },
  {
    id: 'M010', name: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin HCl', category: 'Antibiotic',
    manufacturer: 'Bayer', stock: 58, minStock: 80, unit: 'Tablets', price: 22,
    expiryDate: '2026-02-28', batchNumber: 'BY2024091', location: 'Shelf B-4', status: 'Low Stock'
  },
];

export const pharmacyOrders: PharmacyOrder[] = [
  {
    id: 'PO001', patientId: 'P001', patientName: 'Rajesh Kumar', doctorId: 'D001',
    doctorName: 'Dr. Amit Sharma', date: '2026-05-14',
    medicines: [
      { medicineId: 'M001', medicineName: 'Lisinopril', quantity: 30, price: 4.50, total: 135 },
      { medicineId: 'M006', medicineName: 'Amlodipine 5mg', quantity: 30, price: 4, total: 120 }
    ],
    total: 255, status: 'Dispensed'
  },
  {
    id: 'PO002', patientId: 'P002', patientName: 'Priya Sharma', doctorId: 'D003',
    doctorName: 'Dr. Rahul Verma', date: '2026-05-10',
    medicines: [
      { medicineId: 'M002', medicineName: 'Amoxicillin 500mg', quantity: 21, price: 12, total: 252 },
      { medicineId: 'M003', medicineName: 'Paracetamol 500mg', quantity: 20, price: 2, total: 40 }
    ],
    total: 292, status: 'Dispensed'
  },
  {
    id: 'PO003', patientId: 'P003', patientName: 'Rohit Singh', doctorId: 'D002',
    doctorName: 'Dr. Priya Iyer', date: '2026-05-20',
    medicines: [
      { medicineId: 'M008', medicineName: 'Sumatriptan 50mg', quantity: 9, price: 95, total: 855 }
    ],
    total: 855, status: 'Pending'
  },
  {
    id: 'PO004', patientId: 'P004', patientName: 'Ananya Gupta', doctorId: 'D005',
    doctorName: 'Dr. Neha Kapoor', date: '2026-05-22',
    medicines: [
      { medicineId: 'M003', medicineName: 'Paracetamol 500mg', quantity: 30, price: 2, total: 60 }
    ],
    total: 60, status: 'Pending'
  },
];

export const revenueData = [
  { month: 'Jan', revenue: 4850000, expenses: 3200000, patients: 124 },
  { month: 'Feb', revenue: 5230000, expenses: 3450000, patients: 138 },
  { month: 'Mar', revenue: 6120000, expenses: 3800000, patients: 156 },
  { month: 'Apr', revenue: 5580000, expenses: 3520000, patients: 142 },
  { month: 'May', revenue: 6740000, expenses: 4100000, patients: 168 },
  { month: 'Jun', revenue: 7210000, expenses: 4350000, patients: 185 },
  { month: 'Jul', revenue: 6980000, expenses: 4200000, patients: 178 },
];

export const departmentData = [
  { name: 'Cardiology', value: 28, color: '#3b82f6' },
  { name: 'Neurology', value: 18, color: '#8b5cf6' },
  { name: 'Orthopedics', value: 22, color: '#06b6d4' },
  { name: 'Pediatrics', value: 15, color: '#10b981' },
  { name: 'Oncology', value: 10, color: '#f59e0b' },
  { name: 'Dermatology', value: 7, color: '#ef4444' },
];

export const appointmentTrendData = [
  { day: 'Mon', appointments: 32, completed: 28, cancelled: 4 },
  { day: 'Tue', appointments: 45, completed: 40, cancelled: 5 },
  { day: 'Wed', appointments: 38, completed: 35, cancelled: 3 },
  { day: 'Thu', appointments: 52, completed: 47, cancelled: 5 },
  { day: 'Fri', appointments: 48, completed: 44, cancelled: 4 },
  { day: 'Sat', appointments: 25, completed: 23, cancelled: 2 },
  { day: 'Sun', appointments: 12, completed: 11, cancelled: 1 },
];
