import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MOCK_EVENTS, CATEGORY_LABELS, CATEGORY_ICONS, formatDate, formatTime } from "@/lib/data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MOCK_EVENTS.map((e) => ({ id: e.id }));
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = MOCK_EVENTS.find((e) => e.id === id);
  if (!event) notFound();

  const related = MOCK_EVENTS
    .filter((e) => e.id !== event.id && e.category === event.category)
    .slice(0, 3);

  const spotsLeft = event.available_spots;
  const lowSpots  = spotsLeft <= 20;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/events" className="hover:text-teal-600 transition-colors">Events</Link>
        <span>/</span>
        <span className="text-teal-700 font-medium truncate">{event.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main content */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Hero image */}
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-md bg-teal-50">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {/* Status overlay */}
            {event.status !== "active" && (
              <div className={`absolute inset-0 flex items-center justify-center ${
                event.status === "cancelled" ? "bg-red-900/60" : "bg-gray-900/50"
              }`}>
                <span className="text-white text-2xl font-extrabold uppercase tracking-widest">
                  {event.status}
                </span>
              </div>
            )}
          </div>

          {/* Category & price */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 bg-teal-100 text-teal-700 text-sm font-medium px-3 py-1.5 rounded-full">
              <span>{CATEGORY_ICONS[event.category]}</span>
              {CATEGORY_LABELS[event.category]}
            </span>
            <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
              event.is_free
                ? "bg-teal-500 text-white"
                : "bg-white border-2 border-teal-200 text-teal-700"
            }`}>
              {event.is_free ? "✨ FREE" : `AED ${event.price}`}
            </span>
            {event.status === "active" && lowSpots && (
              <span className="text-sm font-semibold bg-coral-50 text-coral-500 border border-coral-200 px-3 py-1.5 rounded-full animate-pulse">
                🔥 Only {spotsLeft} spots left!
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-900 leading-tight">
            {event.title}
          </h1>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-teal-50 shadow-sm">
            <h2 className="font-bold text-teal-900 mb-3 text-lg">About this event</h2>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Related events */}
          {related.length > 0 && (
            <div>
              <h2 className="font-bold text-teal-900 text-xl mb-4">
                More {CATEGORY_LABELS[event.category]} Events
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/events/${r.id}`}
                    className="group flex gap-3 bg-white rounded-2xl p-3 border border-teal-50 hover:border-teal-200 shadow-sm transition-all card-hover"
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-teal-50">
                      <Image src={r.image_url} alt={r.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-semibold text-teal-900 text-sm line-clamp-2 group-hover:text-teal-600 transition-colors">{r.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(r.event_date)}</p>
                      <p className={`text-xs font-bold mt-1 ${r.is_free ? "text-teal-500" : "text-gray-600"}`}>
                        {r.is_free ? "FREE" : `AED ${r.price}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">

          {/* Event details card */}
          <div className="bg-white rounded-3xl border border-teal-100 shadow-sm p-6 flex flex-col gap-5 sticky top-24">

            <div className="flex flex-col gap-4">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Date & Time</p>
                  <p className="text-sm font-semibold text-teal-900">{formatDate(event.event_date)}</p>
                  <p className="text-sm text-gray-500">{formatTime(event.event_time)}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Location</p>
                  <p className="text-sm font-semibold text-teal-900">{event.location}</p>
                </div>
              </div>

              {/* Organiser */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Organiser</p>
                  <p className="text-sm font-semibold text-teal-900">{event.organizer_name}</p>
                </div>
              </div>

              {/* Spots */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Available Spots</p>
                  <p className={`text-sm font-semibold ${lowSpots ? "text-coral-500" : "text-teal-900"}`}>
                    {spotsLeft} {lowSpots ? "— almost full!" : "spots remaining"}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Contact</p>
                  <p className="text-sm text-teal-900">{event.contact_details}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-teal-50 pt-4">
              {event.status === "active" ? (
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg text-sm">
                  {event.is_free ? "Register — It's Free!" : `Get Tickets — AED ${event.price}`}
                </button>
              ) : (
                <div className={`text-center py-3 rounded-2xl text-sm font-semibold ${
                  event.status === "cancelled"
                    ? "bg-red-50 text-red-500"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {event.status === "cancelled" ? "Event Cancelled" : "Event Completed"}
                </div>
              )}
            </div>

            <Link
              href="/events"
              className="flex items-center justify-center gap-2 text-sm text-teal-500 font-medium hover:text-teal-700 transition-colors"
            >
              ← Back to all events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
