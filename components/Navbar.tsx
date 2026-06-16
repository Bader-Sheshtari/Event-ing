"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Browse Events" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-teal-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-white text-lg font-bold leading-none">E</span>
          </div>
          <span className="text-xl font-bold text-teal-900 tracking-tight">
            Event<span className="text-coral-400">·</span>ing
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === l.href
                  ? "bg-teal-500 text-white shadow-md"
                  : "text-teal-800 hover:bg-teal-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/events/new"
            className={`ml-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              pathname === "/events/new"
                ? "bg-coral-500 text-white shadow-md"
                : "bg-coral-400 text-white hover:bg-coral-500 shadow-sm"
            }`}
          >
            + Create Event
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-teal-50 px-4 pb-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === l.href
                  ? "bg-teal-500 text-white"
                  : "text-teal-800 hover:bg-teal-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/events/new"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-coral-400 text-white hover:bg-coral-500 transition-all text-center mt-1"
          >
            + Create Event
          </Link>
        </div>
      )}
    </nav>
  );
}
