type LandingProps = {
  onGetStarted?: () => void;
};

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="text-sm font-semibold text-slate-500">Apex Health Care</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Compassionate care, managed with clarity.</h1>
          <p className="text-lg text-slate-600 max-w-xl">Apex Health Care — a secure, India-focused hospital platform that unifies patient records, billing, pharmacy and analytics so clinicians spend more time with patients and less on paperwork.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onGetStarted ? onGetStarted() : window.location.assign('/dashboard')}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-lg shadow-md text-sm font-semibold transition"
              aria-label="Get started with Apex Health Care"
            >
              Get Started
            </button>
            <a
              href="mailto:sales@apexhealthcare.com"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition"
              aria-label="Request a demo"
            >
              Request a Demo
            </a>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Secure clinical records</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span>Clear billing & insurance</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              <span>Pharmacy & inventory sync</span>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1586773860416-65f4a2f8a2f9?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=0a3e7d9a2ed4c3f5f2a1b887f6e6f3a0"
              alt="Apex Health Care team in a hospital reception"
              className="w-full h-72 object-cover"
            />
            <div className="p-4 bg-white">
              <p className="text-sm text-slate-600">Trusted by clinicians across India • Secure, compliant, and easy to deploy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
