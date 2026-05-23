import { FormEvent, useState } from 'react';
import { Activity, ArrowRight, HeartPulse, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/auth/AuthContext';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('Tanishk Rathore');
  const [email, setEmail] = useState('admin@apexhealth.in');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const returnTo = (location.state as LocationState | null)?.from?.pathname || '/dashboard';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signup') {
        await signUp(email, password, fullName);
        setMessage('Account created. If your Supabase project requires email confirmation, confirm the email before signing in.');
        setMode('signin');
      } else {
        await signIn(email, password);
        navigate(returnTo, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071214] text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between px-6 py-8 lg:px-10">
          <Link to="/" className="flex w-fit items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-[#041012]">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-slate-50">Apex Health Care</span>
              <span className="block text-xs text-slate-500">Secure hospital workspace</span>
            </span>
          </Link>

          <div className="max-w-xl py-14">
            <p className="mb-4 inline-flex rounded-md border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-200">
              Supabase Auth
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-50 sm:text-5xl">
              Calm access for the people running care.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
              Sign in to manage patients, appointments, billing, medicines, and records from a protected admin workspace.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
            {[
              { label: 'Protected Routes', icon: ShieldCheck },
              { label: 'Live Supabase Data', icon: Activity },
              { label: 'Real Logout', icon: ArrowRight },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="rounded-lg border border-slate-700/70 bg-[#101d21] p-4">
                <Icon className="mb-3 h-4 w-4 text-teal-300" />
                <p className="font-semibold text-slate-200">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center px-6 py-8 lg:px-10">
          <form onSubmit={handleSubmit} className="w-full rounded-lg border border-slate-700/70 bg-[#101d21] p-6 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-50">
                {mode === 'signin' ? 'Sign in' : 'Create admin account'}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {mode === 'signin'
                  ? 'Use your Supabase admin account to enter the dashboard.'
                  : 'Create the first admin account for this Supabase project.'}
              </p>
            </div>

            <div className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-400">Full name</label>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                  />
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-400">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/30"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-400">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-teal-500/30"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error && <p className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
            {message && <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-3 text-sm font-bold text-[#041012] shadow-lg shadow-teal-500/20 transition-colors hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign in to workspace' : 'Create account'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
                setMessage('');
              }}
              className="mt-4 w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
            >
              {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
