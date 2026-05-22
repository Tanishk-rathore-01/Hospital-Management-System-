import { ArrowRight, CalendarDays, HeartPulse, ReceiptIndianRupee, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type LandingProps = {
  onGetStarted?: () => void;
};

const careHeroSrc = `${import.meta.env.BASE_URL}care-hero.png`;

export default function Landing({ onGetStarted }: LandingProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#071214] p-4 sm:p-6">
      <section className="relative min-h-[calc(100vh-7rem)] overflow-hidden rounded-lg border border-slate-700/70 bg-[#0b171b] shadow-2xl">
        <img
          src={careHeroSrc}
          alt="Nurse supporting an elderly patient with family in an Indian hospital"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071214] via-[#071214]/84 to-[#071214]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071214] via-transparent to-transparent" />

        <div className="relative flex min-h-[calc(100vh-7rem)] max-w-7xl flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-400 text-[#061012]">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-50">Apex Health Care</p>
              <p className="text-xs text-slate-400">Hospital Management System</p>
            </div>
          </div>

          <div className="max-w-3xl py-12">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
              Care that stays close, even when the day is full.
            </h1>
            <div className="mt-5 h-0.5 w-24 rounded-full bg-teal-400" />
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Apex Health Care brings appointments, records, billing, pharmacy, and analytics into one calm workspace for Indian hospitals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-bold text-[#041012] shadow-lg shadow-teal-500/20 hover:bg-teal-400"
                aria-label="Enter the Apex Health Care dashboard"
              >
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="mailto:care@apexhealth.in"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                aria-label="Request a demo by email"
              >
                Request a Demo
              </a>
            </div>
          </div>

          <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Secure clinical records', copy: 'Clear access for care teams' },
              { icon: ReceiptIndianRupee, title: 'INR billing and insurance', copy: 'GST-ready payment views' },
              { icon: CalendarDays, title: 'Appointments and pharmacy', copy: 'One queue across departments' },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-lg border border-slate-700/70 bg-[#071214]/72 p-4 backdrop-blur">
                <Icon className="mb-3 h-5 w-5 text-teal-300" />
                <p className="font-semibold text-slate-100">{title}</p>
                <p className="mt-1 text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
