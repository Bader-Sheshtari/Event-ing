import Link from "next/link";
import EventCard from "@/components/EventCard";
import { MOCK_EVENTS, CATEGORY_LABELS, CATEGORY_ICONS, EventCategory } from "@/lib/data";

const FEATURED_CATEGORIES: { key: EventCategory; color: string }[] = [
  { key: "music",           color: "bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-400" },
  { key: "technology",      color: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400" },
  { key: "food_drink",      color: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400" },
  { key: "arts",            color: "bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400" },
  { key: "sports",          color: "bg-green-50 text-green-700 border-green-200 hover:border-green-400" },
  { key: "health_wellness", color: "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400" },
  { key: "community",       color: "bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400" },
  { key: "education",       color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400" },
];

const STATS = [
  { value: "120+", label: "Events This Month" },
  { value: "8",    label: "Cities" },
  { value: "50K+", label: "Happy Attendees" },
  { value: "Free", label: "To Browse & Share" },
];

export default function HomePage() {
  const freeEvents     = MOCK_EVENTS.filter((e) => e.is_free && e.status === "active").slice(0, 3);
  const featuredEvents = MOCK_EVENTS.filter((e) => e.status === "active").slice(0, 6);

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-teal-400 to-teal-600 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-300/20 rounded-full blur-2xl" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                width:  `${12 + i * 8}px`,
                height: `${12 + i * 8}px`,
                top:    `${15 + i * 12}%`,
                left:   `${5 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-coral-400 animate-pulse" />
            Discover events happening near you
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5 animate-fade-up animate-delay-100">
            Life&apos;s too short to<br />
            <span className="text-coral-300">miss great events</span>
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 max-w-xl mx-auto mb-8 animate-fade-up animate-delay-200">
            Browse local music nights, tech summits, wellness retreats, food festivals and more — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animate-delay-300">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:bg-teal-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse All Events
            </Link>
            <Link
              href="/events?filter=free"
              className="inline-flex items-center justify-center gap-2 bg-coral-400 text-white font-bold px-7 py-3.5 rounded-2xl shadow-md hover:bg-coral-500 transition-all"
            >
              ✨ Free Events Only
            </Link>
          </div>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 1440 60" className="w-full -mb-1 fill-[#fdf8f5]" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-teal-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-500">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-coral-400 font-semibold text-sm uppercase tracking-wider mb-1">Explore by type</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-900">What are you into?</h2>
          </div>
          <Link href="/events" className="text-sm text-teal-500 font-semibold hover:text-teal-700 transition-colors hidden sm:block">
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FEATURED_CATEGORIES.map(({ key, color }) => {
            const count = MOCK_EVENTS.filter((e) => e.category === key).length;
            return (
              <Link
                key={key}
                href={`/events?category=${key}`}
                className={`card-hover group flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 text-center ${color} transition-all`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{CATEGORY_ICONS[key]}</span>
                <span className="font-semibold text-sm">{CATEGORY_LABELS[key]}</span>
                <span className="text-xs opacity-50">{count} event{count !== 1 ? "s" : ""}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured Events ── */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-coral-400 font-semibold text-sm uppercase tracking-wider mb-1">Happening soon</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-900">Featured Events</h2>
            </div>
            <Link href="/events" className="text-sm text-teal-500 font-semibold hover:text-teal-700 transition-colors hidden sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="inline-block bg-teal-500 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-teal-600 transition-colors">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* ── Free Events ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="bg-gradient-to-br from-teal-50 to-[#fdf8f5] rounded-3xl p-8 sm:p-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              ✨ 100% FREE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-900">Free to Attend</h2>
            <p className="text-gray-500 mt-1">Great experiences don&apos;t have to cost a thing.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {freeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/events?filter=free"
              className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-800 transition-colors"
            >
              Browse all free events
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-coral-400 text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">Ready to explore?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Hundreds of events are waiting. Find your next adventure today.
          </p>
          <Link
            href="/events"
            className="inline-block bg-white text-coral-500 font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all text-lg"
          >
            Discover Events →
          </Link>
        </div>
      </section>
    </div>
  );
}
