"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const EDGE_URL = "https://vuzfbiwdhyynlachjnjf.supabase.co/functions/v1/confirm-booking";

interface ConfirmationResult {
  booking_id:   string;
  confirmation: string;
  event_title:  string;
  event_date:   string;
  event_time:   string;
  location:     string;
}

type Stage = "verifying" | "confirmed" | "error";

export default function BookingSuccessPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const eventId      = params.id as string;

  const [stage,   setStage]   = useState<Stage>("verifying");
  const [result,  setResult]  = useState<ConfirmationResult | null>(null);
  const [message, setMessage] = useState("Verifying your payment…");

  useEffect(() => {
    async function run() {
      try {
        // 1. Get paymentId from URL (?paymentId=xxx)
        const paymentId = searchParams.get("paymentId");
        const encoded   = searchParams.get("d");

        if (!paymentId || !encoded) {
          setMessage("Missing payment information in the URL.");
          setStage("error");
          return;
        }

        // 2. Decode attendee info (base64url → base64 → JSON)
        let attendee: { event_id: string; attendee_name: string; attendee_email: string; message: string };
        try {
          const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
          attendee = JSON.parse(atob(base64));
        } catch {
          setMessage("Could not decode payment data.");
          setStage("error");
          return;
        }

        // 3. Verify payment with MyFatoorah
        setMessage("Verifying payment with MyFatoorah…");
        const verifyRes = await fetch("/api/payment/verify", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ paymentId }),
        });
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || !verifyData.paid) {
          setMessage(verifyData.error ?? "Payment could not be verified. Please contact support.");
          setStage("error");
          return;
        }

        // 4. Save booking + get AI confirmation
        setMessage("Confirming your booking…");
        const bookingRes = await fetch(EDGE_URL, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id:       attendee.event_id,
            attendee_name:  attendee.attendee_name,
            attendee_email: attendee.attendee_email,
            message:        attendee.message || undefined,
            payment_id:     paymentId,
          }),
        });

        const bookingData = await bookingRes.json();
        if (!bookingRes.ok) {
          setMessage(bookingData.error ?? "Booking save failed.");
          setStage("error");
          return;
        }

        setResult(bookingData);
        setStage("confirmed");
      } catch (err) {
        console.error(err);
        setMessage("An unexpected error occurred.");
        setStage("error");
      }
    }

    run();
  }, [searchParams]);

  if (stage === "verifying") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-14 h-14 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-teal-700 font-semibold text-center">{message}</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl">❌</div>
        <div>
          <h1 className="text-2xl font-extrabold text-red-700 mb-2">Payment Issue</h1>
          <p className="text-gray-500 max-w-sm">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl border-2 border-teal-200 text-teal-700 font-semibold text-sm hover:bg-teal-50 transition-all"
          >
            ← Try Again
          </button>
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

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-4xl animate-bounce">
        🎉
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-teal-900 mb-1">You&rsquo;re In!</h1>
        <p className="text-gray-500 text-sm">Booking confirmed and payment received.</p>
      </div>

      {result && (
        <div className="max-w-md w-full bg-teal-50 border border-teal-200 rounded-3xl p-6 flex flex-col gap-4 text-left">
          <p className="text-sm text-teal-800 leading-relaxed italic">
            &ldquo;{result.confirmation}&rdquo;
          </p>
          <div className="border-t border-teal-100 pt-4 flex flex-col gap-1 text-xs text-teal-600">
            <span>📋 Booking ID: <span className="font-mono">{result.booking_id.slice(0, 8)}…</span></span>
            {result.event_title && <span>🎟 {result.event_title}</span>}
            {result.event_date  && <span>📅 {result.event_date}</span>}
            {result.location    && <span>📍 {result.location}</span>}
          </div>
        </div>
      )}

      <Link
        href={`/events/${eventId}`}
        className="px-8 py-3 rounded-2xl bg-teal-500 text-white font-bold text-sm hover:bg-teal-600 transition-all shadow-md"
      >
        Back to Event
      </Link>
    </div>
  );
}
