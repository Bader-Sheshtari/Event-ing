"use client";

import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

export default function BookingErrorPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const eventId      = params.id as string;
  const reason       = searchParams.get("reason");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl">😕</div>
      <div>
        <h1 className="text-2xl font-extrabold text-red-700 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 max-w-sm">
          {reason ?? "Your payment was not completed. No charge was made."}
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href={`/events/${eventId}`}
          className="px-6 py-3 rounded-2xl border-2 border-teal-200 text-teal-700 font-semibold text-sm hover:bg-teal-50 transition-all"
        >
          ← Try Again
        </Link>
        <Link
          href="/events"
          className="px-6 py-3 rounded-2xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition-all"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}
