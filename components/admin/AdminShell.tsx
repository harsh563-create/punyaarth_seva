'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import {
  CalendarIcon,
  ChartIcon,
  CloseIcon,
  DashboardIcon,
  DocIcon,
  ExternalLinkIcon,
  HeartHandshakeIcon,
  ImageIcon,
  LeafIcon,
  LogoutIcon,
  MenuIcon,
  RupeeIcon,
  UsersIcon,
} from './icons';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { href: '/admin/donations', label: 'Donations', icon: RupeeIcon },
  { href: '/admin/events', label: 'Events', icon: CalendarIcon },
  { href: '/admin/activities', label: 'Activities', icon: HeartHandshakeIcon },
  { href: '/admin/seva', label: 'Seva Categories', icon: LeafIcon },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/impact', label: 'Impact Stats', icon: ChartIcon },
  { href: '/admin/team', label: 'Team', icon: UsersIcon },
  { href: '/admin/about', label: 'About Page', icon: DocIcon },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== '/admin' && pathname.startsWith(href));
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace('/admin/login');
      router.refresh();
    }
  }

  const nav = (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium transition-colors cursor-pointer ${
            isActive(pathname, href)
              ? 'bg-saffron text-white shadow-md'
              : 'text-cream/70 hover:bg-white/10 hover:text-cream'
          }`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );

  const brandAndActions = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-saffron/20 text-lg">
          🌱
        </span>
        <div className="leading-tight">
          <p className="font-serif text-base font-semibold text-cream">
            Punyaarth Seva
          </p>
          <p className="text-xs text-cream/50">Admin Panel</p>
        </div>
      </div>
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-1 flex items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium text-cream/70 transition-colors hover:bg-white/10 hover:text-cream"
        >
          <ExternalLinkIcon className="h-5 w-5 shrink-0" />
          View website
        </Link>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 font-sans text-sm font-medium text-red-300 transition-colors hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          <LogoutIcon className="h-5 w-5 shrink-0" />
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-forest-dark lg:flex">
        {brandAndActions}
        {nav}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-forest-dark shadow-2xl">
            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-cream/70 hover:bg-white/10 hover:text-cream cursor-pointer"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            {brandAndActions}
            {nav}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-beige-dark bg-cream/90 px-4 backdrop-blur lg:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-forest hover:bg-forest-muted cursor-pointer"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <span className="font-serif font-semibold text-forest">
            Punyaarth Seva Admin
          </span>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
