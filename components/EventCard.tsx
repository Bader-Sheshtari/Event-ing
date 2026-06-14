import Link from "next/link";
import Image from "next/image";
import { Event, CATEGORY_LABELS, CATEGORY_ICONS, formatDate, formatTime } from "@/lib/data";

interface Props {
  event: Event;
}

const statusColors = {
  active:    "bg-teal-100 text-teal-700",
  cancelled: "bg-coral-100 text-coral-600",
  completed: "bg-gray-100 text-gray-500",
};

export default function EventCard({ event }: Props) {
  const spotsLeft = event.available_spots;
  const lowSpots = spotsLeft <= 20 && spotsLeft > 0;

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <div className="card-hover bg-white rounded-2xl overflow-hidden border border-teal-50 shadow-sm h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-teal-50">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Price badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
            event.is_free
              ? "bg-teal-500 text-white"
              : "bg-white text-teal-700"
          }`}>
            {event.is_free ? "FREE" : `AED ${event.price}`}
          </div>
          {/* Category badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-teal-800 flex items-center gap-1">
            <span>{CATEGORY_ICONS[event.category]}</span>
            <span>{CATEGORY_LABELS[event.category]}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Status */}
          {event.status !== "active" && (
            <span className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[event.status]}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          )}

          <h3 className="font-bold text-teal-900 text-base leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>

          <div className="mt-auto pt-3 flex flex-col gap-1.5 border-t border-teal-50">
            {/* Date & time */}
            <div className="flex items-center gap-2 text-xs text-teal-700">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(event.event_date)} · {formatTime(event.event_time)}</span>
            </div>
            {/* Location */}
            <div className="flex items-center gap-2 text-xs text-teal-700">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{event.location}</span>
            </div>
            {/* Spots */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-teal-700">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={lowSpots ? "text-coral-500 font-semibold" : ""}>
                  {lowSpots ? `Only ${spotsLeft} spots left!` : `${spotsLeft} spots available`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
