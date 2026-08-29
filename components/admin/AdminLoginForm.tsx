'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm({ from }: { from?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;
    setIsPending(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, from: from ?? '' }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        redirectTo?: string;
        error?: string;
      };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? `Sign in failed (${response.status})`);
        return;
      }
      router.replace(payload.redirectTo ?? '/admin');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-saffron/20 text-3xl">
          🌱
        </span>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-white">
          Punyaarth Seva
        </h1>
        <p className="mt-1 text-sm text-cream/70">Admin Panel</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="hidden" name="from" value={from ?? ''} />

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-cream"
            >
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.org"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 font-sans text-text placeholder:text-cream/40 focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/40"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-cream"
            >
              Admin Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 pr-16 font-sans text-text placeholder:text-cream/40 focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-xs font-medium uppercase tracking-wide text-cream/60 hover:text-cream cursor-pointer"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-400/30 bg-red-500/15 px-4 py-2.5 text-sm text-red-200"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-saffron py-3 font-sans font-medium text-white shadow-md transition-all duration-300 hover:bg-saffron-light hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

       
      </div>

      <p className="mt-6 text-center text-sm text-cream/60">
        <Link href="/" className="underline underline-offset-4 hover:text-cream">
          ← Back to website
        </Link>
      </p>
    </div>
  );
}
