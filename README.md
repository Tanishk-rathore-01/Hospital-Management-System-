# Hospital Management System

A modern, responsive Hospital Management System dashboard built with **React, TypeScript, Vite, and Tailwind CSS**.  
The project provides a clean hospital admin interface for managing patients, appointments, medical records, billing, pharmacy inventory, and analytical reports.

> This project is designed as a frontend-focused hospital management dashboard using structured mock data and reusable React components.

---

## Preview


```md

Features
Dashboard Overview
Hospital performance summary
OPD visits, appointment count, IPD occupancy, and revenue insights
Revenue vs expenses visualization
Patient flow chart
Appointment trend analysis
Billing and pharmacy snapshot
Patient Management
Add, view, edit, and delete patient records
Search patients by name, ID, or email
Filter patients by status
Store patient details such as:
Age
Gender
Blood group
Contact details
Emergency contact
Insurance provider
Allergies
Appointment Management
Schedule new appointments
View doctor availability
Search and filter appointments
Appointment status workflow:
Scheduled
In Progress
Completed
Cancelled
Appointment fee tracking
Medical Records
View patient medical history
Store diagnosis, symptoms, treatment plans, and doctor notes
View prescriptions
View lab results
Track patient vitals such as:
Blood pressure
Heart rate
Temperature
Weight
Height
Oxygen saturation
Billing Management
View hospital invoices
Track paid, pending, partial, and overdue bills
Display subtotal, tax, discount, insurance coverage, and balance due
Mark bills as paid
Indian Rupee currency formatting
Pharmacy Management
Manage medicine inventory
Track medicine stock, expiry, category, manufacturer, and location
Low stock, out-of-stock, and expired medicine alerts
Pharmacy order management
Dispense pending pharmacy orders
Reports & Analytics
Revenue and expense analysis
Net profit and profit margin tracking
Patient growth charts
Department-wise patient distribution
Weekly appointment analysis
Patient satisfaction visualization
Monthly performance summary
Tech Stack
Technology	Purpose
React	Frontend UI
TypeScript	Type-safe development
Vite	Fast development and build tool
Tailwind CSS	Styling and responsive UI
React Router DOM	Client-side routing
TanStack React Query	Data fetching and server-state style management
Recharts	Charts and analytics
Zustand	Lightweight state management
Lucide React	Icons
Date-fns	Date utilities
Project Structure
Hospital-Management-System-
├── components/
│   ├── AppErrorBoundary.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
│
├── data/
│   └── mockData.ts
│
├── pages/
│   ├── Appointments.tsx
│   ├── Billing.tsx
│   ├── Dashboard.tsx
│   ├── Landing.tsx
│   ├── MedicalRecords.tsx
│   ├── Patients.tsx
│   ├── Pharmacy.tsx
│   └── Reports.tsx
│
├── public/
│
├── src/
│   └── hooks/
│
├── types/
│
├── utils/
│   ├── cn.ts
│   └── money.ts
│
├── App.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
Getting Started

Follow these steps to run the project locally.

Prerequisites

Make sure you have installed:

Node.js
npm

Check installation:

node -v
npm -v
Installation

Clone the repository:

git clone https://github.com/Tanishk-rathore-01/Hospital-Management-System-.git

Move into the project folder:

cd Hospital-Management-System-

Install dependencies:

npm install

Start the development server:

npm run dev

Open the local development URL shown in your terminal.

Available Scripts
npm run dev

Runs the app in development mode.

npm run build

Builds the app for production.

npm run preview

Previews the production build locally.

Current Project Scope

This project currently focuses on the frontend interface and dashboard experience of a hospital management system.

It includes:

Frontend routing
Responsive dashboard UI
Patient, appointment, billing, pharmacy, and report modules
Mock hospital data
Charts and analytics
UI state handling

It does not currently include:

Real backend API
Database integration
Authentication
Role-based access control
Real-time hospital operations
Production-level security handling
Future Improvements

Planned improvements can include:

Backend integration with Node.js, Express, or Next.js API routes
Database support using MongoDB, PostgreSQL, or Firebase
Authentication and authorization
Admin, doctor, receptionist, pharmacist, and accountant roles
Real patient data storage
Appointment reminders
PDF invoice generation
Prescription download feature
Advanced search and filters
Dark mode
Unit and integration testing
Deployment on Vercel or Netlify
What I Learned

Through this project, I practiced:

Building a multi-page React application
Structuring reusable components
Managing frontend state
Using TypeScript for safer code
Creating dashboards with charts
Designing responsive admin panels
Handling mock data in a real-world project structure
Building healthcare-related UI workflows
Author

Tanishk Rathore

GitHub: Tanishk-rathore-01
