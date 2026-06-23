"use client";

import { useState, FormEvent } from "react";

interface Props {
  eventId:    string;
  eventTitle: string;
  isFree:     boolean;
  price:      number;
  status:     string;
}

interface ConfirmationResult {
  booking_id:   string;
  confirmation: string;
  event_title:  string;
  event_date:   string;
  event_time:   string;
  location:     string;
}

const EDGE_URL = "https://vuzfbiwdhyynlachjnjf.supabase.co/functions/v1/confirm-booking";

export default function BookingForm({ eventId, eventTitle, isFree, price, status }: Props) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [result,  setResult]  = useState<ConfirmationResult | null>(null);

  if (status !== "active") {
    return (
      <div className={`text-center py-3 rounded-2xl text-sm font-semibold ${
        status === "cancelled" ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500"
      }`}>
        {status === "cancelled" ? "Event Cancelled" : "Event Completed"}
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
          <span className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
          Booking Confirmed!
        </div>
        <p className="text-sm text-teal-800 leading-relaxed italic">
          &ldquo;{result.confirmation}&rdquo;
        </p>
        <div className="text-xs text-teal-600 border-t border-teal-100 pt-3 flex flex-col gap-1">
          <span>📋 Booking ID: <span className="font-mono">{result.booking_id.slice(0, 8)}…</span></span>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isFree) {
        // Free event — call edge function directly
        const res = await fetch(EDGE_URL, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id:       eventId,
            attendee_name:  name.trim(),
            attendee_email: email.trim(),
            message:        message.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Booking failed.");
        setResult(data);
      } else {
        // Paid event — go through MyFatoorah
        const res = await fetch("/api/payment/initiate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_id:       eventId,
            attendee_name:  name.trim(),
            attendee_email: email.trim(),
            message:        message.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not initiate payment.");
        // Redirect to MyFatoorah hosted payment page
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-teal-100 bg-white text-teal-900 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
      />
      <textarea
        placeholder="Message to organiser (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        className={inputClass + " resize-none"}
      />

      {!isFree && (
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2 text-xs text-teal-700">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure payment via <strong className="ml-1">MyFatoorah</strong>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {isFree ? "Confirming your spot…" : "Redirecting to payment…"}
          </>
        ) : (
          isFree ? "Register — It's Free!" : `Pay KWD ${price} via MyFatoorah →`
        )}
      </button>
    </form>
  );
}
