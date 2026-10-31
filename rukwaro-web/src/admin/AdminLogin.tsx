import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ADMIN_SESSION_KEY } from './adminTypes';

interface AdminLoginProps {
  onLogin: () => void;
}

const DEMO_EMAIL = 'demo@rukwaro.co.ke';
const DEMO_PASSWORD = 'rukwaro2026';

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isEmailValid = email.trim().toLowerCase() === DEMO_EMAIL;
    const isPasswordValid = password === DEMO_PASSWORD;

    if (!isEmailValid || !isPasswordValid) {
      setError('Invalid email or password. Use the demo credentials below.');
      return;
    }

    setError('');
    try {
      window.localStorage.setItem(ADMIN_SESSION_KEY, '1');
    } catch {
      // Private mode / quota — the in-memory session still works for this visit.
    }
    onLogin();
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-offwhite px-4 py-10 font-sans text-brand-charcoal">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(225,29,35,0.08),transparent_34%),radial-gradient(circle_at_88%_85%,rgba(8,8,13,0.06),transparent_38%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
      />

      <div className="relative w-full max-w-[430px]">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white p-2 shadow-card">
            <img
              src="/logo-mark.png"
              alt="Rukwaro Autospares"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-brand-red">
            <span className="h-px w-5 bg-brand-red" />
            Staff Portal
            <span className="h-px w-5 bg-brand-red" />
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-brand-charcoal sm:text-3xl">
            Rukwaro <span className="text-brand-red">Autospares</span>
          </h1>
          <p className="mt-1.5 text-xs font-medium text-gray-500">
            Inventory, orders and branch operations
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-elevated">
          <div className="h-1 w-full bg-brand-red" />
          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-brand-charcoal">
                  Sign in to admin
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your staff credentials to continue.
                </p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-charcoal text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError('');
                    }}
                    placeholder="you@rukwaro.co.ke"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm font-semibold text-brand-charcoal placeholder:font-medium placeholder:text-gray-400 focus:border-brand-red focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="block text-[10px] font-bold uppercase tracking-wider text-gray-500"
                  >
                    Password
                  </label>
                  <span className="text-[10px] font-medium text-gray-400">
                    Staff access only
                  </span>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-10 text-sm font-semibold text-brand-charcoal placeholder:font-medium placeholder:text-gray-400 focus:border-brand-red focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red/30"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-brand-redDark"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-3 text-sm font-extrabold text-white shadow-brand transition-colors hover:bg-brand-redHover focus:outline-none focus:ring-2 focus:ring-brand-red/40 focus:ring-offset-2"
              >
                <LockKeyhole className="h-4 w-4" />
                Sign in to dashboard
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-brand-offwhite p-3.5">
              <div className="mb-2 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-red" />
                <p className="text-[10px] font-black uppercase tracking-wider text-brand-charcoal">
                  Demo access
                </p>
              </div>
              <div className="space-y-1 text-[11px] text-gray-600">
                <p className="flex items-center justify-between gap-3">
                  <span className="text-gray-400">Email</span>
                  <span className="font-mono font-bold text-brand-charcoal">
                    {DEMO_EMAIL}
                  </span>
                </p>
                <p className="flex items-center justify-between gap-3">
                  <span className="text-gray-400">Password</span>
                  <span className="font-mono font-bold text-brand-charcoal">
                    {DEMO_PASSWORD}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-3 w-full rounded-lg border border-gray-200 bg-white py-2 text-[11px] font-bold text-brand-charcoal transition-colors hover:border-brand-red/40 hover:text-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              >
                Autofill demo credentials
              </button>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] font-medium text-gray-400">
          © 2026 Rukwaro Autospares · Kirinyaga Rd, Nairobi · Internal use only
        </p>
      </div>
    </div>
  );
};
