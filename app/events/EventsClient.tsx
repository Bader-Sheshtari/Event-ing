"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EventCard from "@/components/EventCard";
import {
  Event,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  EventCategory,
  EventStatus,
} from "@/lib/data";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[];
const ALL_STATUSES: EventStatus[] = ["active", "cancelled", "completed"];

function EventsContent({ initialEvents }: { initialEvents: Event[] }) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [search,      setSearch]      = useState(searchParams.get("q") ?? "");
  const [category,    setCategory]    = useState<EventCategory | "">((searchParams.get("category") as EventCategory) ?? "");
  const [status,      setStatus]      = useState<EventStatus | "">((searchParams.get("status") as EventStatus) ?? "");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">(
    searchParams.get("filter") === "free" ? "free" : "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "price_asc" | "price_desc">("date");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search)               params.set("q", search);
    if (category)             params.set("category", category);
    if (status)               params.set("status", status);
    if (priceFilter !== "all") params.set("filter", priceFilter);
    router.replace(`/events${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }, [search, category, status, priceFilter, router]);

  const filtered = useMemo(() => {
    let list = [...initialEvents];
    if (search)   list = list.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.organizer_name.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    );
    if (category)             list = list.filter((e) => e.category === category);
    if (status)               list = list.filter((e) => e.status === status);
    if (priceFilter === "free") list = list.filter((e) => e.is_free);
    if (priceFilter === "paid") list = list.filter((e) => !e.is_free);

    if (sortBy === "date")        list.sort((a, b) => a.event_date.localeCompare(b.event_date));
    if (sortBy === "price_asc")   list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc")  list.sort((a, b) => b.price - a.price);
    return list;
  }, [initialEvents, search, category, status, priceFilter, sortBy]);

  const clearAll = () => {
    setSearch(""); setCategory(""); setStatus(""); setPriceFilter("all"); setSortBy("date");
  };

  const hasFilters = search || category || status || priceFilter !== "all";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p className="text-coral-400 font-semibold text-sm uppercase tracking-wider mb-1">All events</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-900">Browse Events</h1>
        <p className="text-gray-500 mt-2">Find something to do — from free community nights to premium summits.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by title, location, or organiser…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-teal-100 bg-white text-teal-900 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors shadow-sm text-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={category} onChange={(e) => setCategory(e.target.value as EventCategory | "")}
          className="px-4 py-2.5 rounded-xl border-2 border-teal-100 bg-white text-sm text-teal-800 focus:outline-none focus:border-teal-400 transition-colors">
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}</option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value as EventStatus | "")}
          className="px-4 py-2.5 rounded-xl border-2 border-teal-100 bg-white text-sm text-teal-800 focus:outline-none focus:border-teal-400 transition-colors">
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 bg-teal-50 rounded-xl p-1">
          {(["all", "free", "paid"] as const).map((f) => (
            <button key={f} onClick={() => setPriceFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                priceFilter === f ? "bg-teal-500 text-white shadow-sm" : "text-teal-700 hover:bg-teal-100"
              }`}>
              {f === "all" ? "All Prices" : f === "free" ? "✨ Free" : "Paid"}
            </button>
          ))}
        </div>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 rounded-xl border-2 border-teal-100 bg-white text-sm text-teal-800 focus:outline-none focus:border-teal-400 transition-colors ml-auto">
          <option value="date">Sort: Date</option>
          <option value="price_asc">Sort: Price Low→High</option>
          <option value="price_desc">Sort: Price High→Low</option>
        </select>
      </div>

      {/* Active filter tags */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-gray-400 font-medium">Active filters:</span>
          {category && (
            <span className="flex items-center gap-1 bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full font-medium">
              {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
              <button onClick={() => setCategory("")} className="ml-1 hover:text-teal-900">✕</button>
            </span>
          )}
          {status && (
            <span className="flex items-center gap-1 bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full font-medium">
              Status: {status}
              <button onClick={() => setStatus("")} className="ml-1 hover:text-teal-900">✕</button>
            </span>
          )}
          {priceFilter !== "all" && (
            <span className="flex items-center gap-1 bg-teal-100 text-teal-700 text-xs px-3 py-1 rounded-full font-medium">
              {priceFilter === "free" ? "✨ Free only" : "Paid only"}
              <button onClick={() => setPriceFilter("all")} className="ml-1 hover:text-teal-900">✕</button>
            </span>
          )}
          <button onClick={clearAll} className="text-xs text-coral-500 font-semibold hover:text-coral-700 transition-colors">
            Clear all
          </button>
        </div>
      )}

      <p className="text-sm text-gray-400 mb-5">
        {filtered.length === 0 ? "No events found" : `${filtered.length} event${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-teal-900 mb-2">No events found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
          <button onClick={clearAll}
            className="bg-teal-500 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-teal-600 transition-colors">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function EventsClient({ initialEvents }: { initialEvents: Event[] }) {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-teal-100 rounded-xl w-48" />
          <div className="h-12 bg-teal-50 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-teal-50 rounded-2xl" />)}
          </div>
        </div>
      </div>
    }>
      <EventsContent initialEvents={initialEvents} />
    </Suspense>
  );
}
