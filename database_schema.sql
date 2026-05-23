-- Apex Health Care Supabase schema
-- Designed for the current frontend id format: P001, A001, B001, M001, PO001, MR001.
-- For an existing prototype database that used UUID ids, create a fresh project or migrate
-- the id columns before applying this schema.

create extension if not exists pgcrypto;

create table if not exists public.doctors (
  id text primary key,
  name text not null,
  specialization text not null,
  department text not null,
  phone text not null,
  email text not null,
  experience integer not null default 0,
  availability text[] not null default '{}',
  status text not null default 'Available' check (status in ('Available', 'On Leave', 'Busy')),
  avatar text,
  rating numeric(3, 2) not null default 0,
  patients integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.patients (
  id text primary key,
  name text not null,
  age integer not null check (age >= 0 and age <= 120),
  gender text not null check (gender in ('Male', 'Female', 'Other')),
  phone text not null,
  email text not null default '',
  address text not null,
  blood_group text not null,
  date_of_birth date not null,
  registration_date date not null default current_date,
  status text not null default 'Active' check (status in ('Active', 'Inactive', 'Discharged')),
  emergency_contact text not null,
  insurance text not null default '',
  allergies text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  doctor_id text not null references public.doctors(id),
  doctor_name text not null,
  department text not null,
  date date not null,
  time text not null,
  type text not null check (type in ('Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Checkup')),
  status text not null default 'Scheduled' check (status in ('Scheduled', 'Completed', 'Cancelled', 'In Progress')),
  notes text not null default '',
  fee numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bills (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  date date not null,
  due_date date not null,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12, 2) not null default 0,
  tax numeric(12, 2) not null default 0,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  paid numeric(12, 2) not null default 0,
  status text not null default 'Pending' check (status in ('Paid', 'Pending', 'Overdue', 'Partial')),
  payment_method text not null default '',
  insurance text not null default '',
  insurance_coverage numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medicines (
  id text primary key,
  name text not null,
  generic_name text not null,
  category text not null,
  manufacturer text not null,
  stock integer not null default 0,
  min_stock integer not null default 10,
  unit text not null,
  price numeric(12, 2) not null default 0,
  expiry_date date not null,
  batch_number text not null,
  location text not null default '',
  status text not null default 'In Stock' check (status in ('In Stock', 'Low Stock', 'Out of Stock', 'Expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pharmacy_orders (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  doctor_id text not null references public.doctors(id),
  doctor_name text not null,
  date date not null,
  medicines jsonb not null default '[]'::jsonb,
  total numeric(12, 2) not null default 0,
  status text not null default 'Pending' check (status in ('Pending', 'Dispensed', 'Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medical_records (
  id text primary key,
  patient_id text not null references public.patients(id) on delete cascade,
  patient_name text not null,
  doctor_id text not null references public.doctors(id),
  doctor_name text not null,
  date date not null,
  diagnosis text not null,
  symptoms text[] not null default '{}',
  treatment text not null,
  prescriptions jsonb not null default '[]'::jsonb,
  lab_results jsonb not null default '[]'::jsonb,
  notes text not null default '',
  follow_up_date date,
  blood_pressure text not null default '',
  heart_rate integer not null default 0,
  temperature numeric(5, 2) not null default 0,
  weight numeric(6, 2) not null default 0,
  height numeric(6, 2) not null default 0,
  oxygen_saturation numeric(5, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_patients_name on public.patients(name);
create index if not exists idx_appointments_patient_id on public.appointments(patient_id);
create index if not exists idx_appointments_date on public.appointments(date);
create index if not exists idx_bills_patient_id on public.bills(patient_id);
create index if not exists idx_bills_status on public.bills(status);
create index if not exists idx_medicines_status on public.medicines(status);
create index if not exists idx_pharmacy_orders_patient_id on public.pharmacy_orders(patient_id);
create index if not exists idx_medical_records_patient_id on public.medical_records(patient_id);

insert into public.doctors (id, name, specialization, department, phone, email, experience, availability, status, avatar, rating, patients)
values
  ('D001', 'Dr. Amit Sharma', 'Cardiologist', 'Cardiology', '+91-98765-1001', 'amit.sharma@apexhealthcare.com', 15, array['Monday', 'Wednesday', 'Friday'], 'Available', 'AS', 4.8, 248),
  ('D002', 'Dr. Priya Iyer', 'Neurologist', 'Neurology', '+91-98765-1002', 'priya.iyer@apexhealthcare.com', 12, array['Tuesday', 'Thursday'], 'Busy', 'PI', 4.7, 198),
  ('D003', 'Dr. Rahul Verma', 'Orthopaedic Surgeon', 'Orthopaedics', '+91-98765-1003', 'rahul.verma@apexhealthcare.com', 8, array['Monday', 'Tuesday', 'Saturday'], 'Available', 'RV', 4.6, 172),
  ('D004', 'Dr. Arjun Mehta', 'General Surgeon', 'Surgery', '+91-98765-1004', 'arjun.mehta@apexhealthcare.com', 20, array['Wednesday', 'Friday'], 'On Leave', 'AM', 4.9, 315),
  ('D005', 'Dr. Neha Kapoor', 'Paediatrician', 'Paediatrics', '+91-98765-1005', 'neha.kapoor@apexhealthcare.com', 10, array['Monday', 'Thursday', 'Saturday'], 'Available', 'NK', 4.8, 224),
  ('D006', 'Dr. Sunita Rao', 'Dermatologist', 'Dermatology', '+91-98765-1006', 'sunita.rao@apexhealthcare.com', 18, array['Tuesday', 'Friday'], 'Available', 'SR', 4.7, 206)
on conflict (id) do update set
  name = excluded.name,
  specialization = excluded.specialization,
  department = excluded.department,
  phone = excluded.phone,
  email = excluded.email,
  experience = excluded.experience,
  availability = excluded.availability,
  status = excluded.status,
  avatar = excluded.avatar,
  rating = excluded.rating,
  patients = excluded.patients,
  updated_at = now();

alter table public.doctors enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.bills enable row level security;
alter table public.medicines enable row level security;
alter table public.pharmacy_orders enable row level security;
alter table public.medical_records enable row level security;

drop policy if exists "authenticated doctors access" on public.doctors;
drop policy if exists "authenticated patients access" on public.patients;
drop policy if exists "authenticated appointments access" on public.appointments;
drop policy if exists "authenticated bills access" on public.bills;
drop policy if exists "authenticated medicines access" on public.medicines;
drop policy if exists "authenticated pharmacy orders access" on public.pharmacy_orders;
drop policy if exists "authenticated medical records access" on public.medical_records;

create policy "authenticated doctors access" on public.doctors for all to authenticated using (true) with check (true);
create policy "authenticated patients access" on public.patients for all to authenticated using (true) with check (true);
create policy "authenticated appointments access" on public.appointments for all to authenticated using (true) with check (true);
create policy "authenticated bills access" on public.bills for all to authenticated using (true) with check (true);
create policy "authenticated medicines access" on public.medicines for all to authenticated using (true) with check (true);
create policy "authenticated pharmacy orders access" on public.pharmacy_orders for all to authenticated using (true) with check (true);
create policy "authenticated medical records access" on public.medical_records for all to authenticated using (true) with check (true);
