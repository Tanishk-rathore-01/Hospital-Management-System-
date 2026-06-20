-- Apex Health Care Supabase schema
-- Designed for the current frontend id format: P001, A001, B001, M001, PO001, MR001.
-- For an existing prototype database that used UUID ids, create a fresh project or migrate
-- the id columns before applying this schema.

create extension if not exists pgcrypto;

-- User roles table for hierarchical RBAC
-- Hierarchy levels: owner=1, admin=2, doctor=3, nurse=4, receptionist=5, pharmacist=5, billing_staff=5
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'billing_staff')),
  hierarchy_level integer not null check (hierarchy_level >= 1 and hierarchy_level <= 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Postgres sequences for atomic ID generation
create sequence if not exists public.patient_id_seq start 1;
create sequence if not exists public.appointment_id_seq start 1;
create sequence if not exists public.bill_id_seq start 1;
create sequence if not exists public.medicine_id_seq start 1;
create sequence if not exists public.pharmacy_order_id_seq start 1;
create sequence if not exists public.medical_record_id_seq start 1;

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
  -- Vitals stored as JSONB to match TypeScript camelCase structure
  vitals jsonb not null default '{"bloodPressure":"","heartRate":0,"temperature":0,"weight":0,"height":0,"oxygenSaturation":0}'::jsonb,
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

-- Helper function to get user role
create or replace function public.get_user_role(user_id uuid)
returns text as $$
  select role from public.user_roles where user_roles.user_id = get_user_role.user_id;
$$ language sql stable;

-- Helper function to get user hierarchy level
create or replace function public.get_user_hierarchy_level(user_id uuid)
returns integer as $$
  select hierarchy_level from public.user_roles where user_roles.user_id = get_user_hierarchy_level.user_id;
$$ language sql stable;

-- Helper function to check if user has sufficient hierarchy level
create or replace function public.has_sufficient_hierarchy(required_level integer)
returns boolean as $$
  select exists (
    select 1 from public.user_roles 
    where user_id = auth.uid() 
    and hierarchy_level <= required_level
  );
$$ language sql stable;

-- Enable RLS on all tables
alter table public.user_roles enable row level security;
alter table public.doctors enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.bills enable row level security;
alter table public.medicines enable row level security;
alter table public.pharmacy_orders enable row level security;
alter table public.medical_records enable row level security;

-- Drop existing policies
drop policy if exists "authenticated doctors access" on public.doctors;
drop policy if exists "authenticated patients access" on public.patients;
drop policy if exists "authenticated appointments access" on public.appointments;
drop policy if exists "authenticated bills access" on public.bills;
drop policy if exists "authenticated medicines access" on public.medicines;
drop policy if exists "authenticated pharmacy orders access" on public.pharmacy_orders;
drop policy if exists "authenticated medical records access" on public.medical_records;

-- User roles policies (only owners can manage roles)
create policy "users can view own role" on public.user_roles for select
  to authenticated using (user_id = auth.uid());

create policy "owners can manage all roles" on public.user_roles for all
  to authenticated using (public.get_user_role(auth.uid()) = 'owner');

-- Doctors table policies
create policy "doctors read all" on public.doctors for select
  to authenticated using (true);

create policy "doctors manage by hierarchy" on public.doctors for all
  to authenticated using (public.has_sufficient_hierarchy(2));

-- Patients table policies
create policy "patients read all" on public.patients for select
  to authenticated using (true);

create policy "patients create by receptionist+" on public.patients for insert
  to authenticated using (public.has_sufficient_hierarchy(5));

create policy "patients update by doctor+" on public.patients for update
  to authenticated using (public.has_sufficient_hierarchy(3));

create policy "patients delete by admin+" on public.patients for delete
  to authenticated using (public.has_sufficient_hierarchy(2));

-- Appointments table policies
create policy "appointments read all" on public.appointments for select
  to authenticated using (true);

create policy "appointments create by receptionist+" on public.appointments for insert
  to authenticated using (public.has_sufficient_hierarchy(5));

create policy "appointments update by doctor+" on public.appointments for update
  to authenticated using (public.has_sufficient_hierarchy(3));

create policy "appointments delete by admin+" on public.appointments for delete
  to authenticated using (public.has_sufficient_hierarchy(2));

-- Bills table policies
create policy "bills read all" on public.bills for select
  to authenticated using (true);

create policy "bills create by receptionist+" on public.bills for insert
  to authenticated using (public.has_sufficient_hierarchy(5));

create policy "bills update by billing+" on public.bills for update
  to authenticated using (
    public.get_user_role(auth.uid()) in ('owner', 'admin', 'billing_staff')
  );

create policy "bills delete by admin+" on public.bills for delete
  to authenticated using (public.has_sufficient_hierarchy(2));

-- Medicines table policies
create policy "medicines read all" on public.medicines for select
  to authenticated using (true);

create policy "medicines manage by pharmacist+" on public.medicines for all
  to authenticated using (
    public.get_user_role(auth.uid()) in ('owner', 'admin', 'pharmacist')
  );

-- Pharmacy orders table policies
create policy "pharmacy orders read all" on public.pharmacy_orders for select
  to authenticated using (true);

create policy "pharmacy orders create by doctor+" on public.pharmacy_orders for insert
  to authenticated using (public.has_sufficient_hierarchy(3));

create policy "pharmacy orders update by pharmacist+" on public.pharmacy_orders for update
  to authenticated using (
    public.get_user_role(auth.uid()) in ('owner', 'admin', 'pharmacist')
  );

create policy "pharmacy orders delete by admin+" on public.pharmacy_orders for delete
  to authenticated using (public.has_sufficient_hierarchy(2));

-- Medical records table policies
create policy "medical records read by doctor+" on public.medical_records for select
  to authenticated using (public.has_sufficient_hierarchy(3));

create policy "medical records create by doctor+" on public.medical_records for insert
  to authenticated using (public.has_sufficient_hierarchy(3));

create policy "medical records update by doctor+" on public.medical_records for update
  to authenticated using (public.has_sufficient_hierarchy(3));

create policy "medical records update vitals by nurse" on public.medical_records for update
  to authenticated using (public.get_user_role(auth.uid()) = 'nurse')
  with check (
    -- Nurses can only update vitals field
    (select jsonb_object_keys(new) = 'vitals')
  );

create policy "medical records delete by admin+" on public.medical_records for delete
  to authenticated using (public.has_sufficient_hierarchy(2));
