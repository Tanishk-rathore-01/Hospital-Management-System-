# Apex Health Care

Apex Health Care is a full-stack hospital management dashboard built with React, TypeScript, Vite, Supabase, and Tailwind CSS. The product is designed for Indian hospital operations: dark clinical UI, INR-first billing, Indian patient data patterns, protected admin access, and connected modules for day-to-day care coordination.

## What This Project Does

- Protects operational routes with Supabase Authentication.
- Uses Supabase tables for patients, appointments, bills, medicines, pharmacy orders, and medical records.
- Supports patient registration/edit/delete with React Hook Form and Zod validation.
- Tracks appointment queues, appointment status changes, billing collection, pharmacy stock, pharmacy dispensing, and medical record views.
- Formats money in INR and uses India-oriented labels, phone formats, addresses, and hospital workflow language.
- Includes focused unit tests for money formatting and service logic.
- Deploys as a Vite SPA on Vercel.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Supabase Auth and Database
- React Hook Form
- Zod
- Recharts
- Vitest

## Project Structure

```text
components/          Shared app shell, header/sidebar, modals
data/                Static reference data such as doctors and chart samples
pages/               Route-level screens
src/auth/            Supabase auth provider and route protection
src/hooks/           TanStack Query hooks
src/lib/             Supabase and query client setup
src/services/        Supabase-backed data services
types/               Shared TypeScript entity types
utils/               Formatting and utility helpers
database_schema.sql  Supabase schema for this project
vercel.json          SPA rewrite config for Vercel
```

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `database_schema.sql`.
4. In Authentication settings, either confirm the admin email after sign-up or disable email confirmation for local demo use.
5. Add the environment variables below.

The schema uses app-friendly text ids such as `P001`, `A001`, `B001`, `M001`, `PO001`, and `MR001`. If an older prototype database already has UUID ids, use a fresh Supabase project or migrate those id columns before running the current schema.

## Environment Variables

Create `.env.local` for local development:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Apex Health Care
VITE_ENVIRONMENT=development
```

Never commit `.env`, `.env.local`, or production secrets.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run type checks:

```bash
npm exec tsc -- --noEmit
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

## Authentication

The dashboard routes are protected. Unauthenticated users are redirected to `/login`.

The login page supports:

- Supabase email/password sign in
- Admin account sign up
- Real Supabase sign out from the header/sidebar
- Header/sidebar user details from `supabase.auth.getUser()`

Default local demo credentials shown in the UI are:

```text
admin@apexhealth.in
password
```

Those credentials only work after the account exists in your Supabase project and the email is confirmed if confirmation is enabled.

## Deployment On Vercel

1. Push the repository to GitHub.
2. Import the GitHub repository into Vercel.
3. Use the Vite framework preset.
4. Configure:
   - Install command: `npm install` or `npm ci`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add these Vercel environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_NAME`
   - `VITE_ENVIRONMENT`

`vercel.json` rewrites all routes to `index.html`, so direct visits to `/dashboard`, `/patients`, and other SPA routes work correctly.

## Current Limits

- Doctors are still static reference data in the frontend, while the schema seeds matching doctor ids for relational records.
- Fine-grained hospital roles are not implemented yet.
- Clinical audit logs, server-side authorization, and compliance workflows are outside the current scope.
- Email confirmation behavior depends on the Supabase project settings.

## Verification Status

The current codebase is expected to pass:

```bash
npm exec tsc -- --noEmit
npm test
npm run build
```

Browser verification includes route protection and login/sign-up flow. Full authenticated module testing requires a confirmed Supabase user and the latest schema applied to the target Supabase project.
