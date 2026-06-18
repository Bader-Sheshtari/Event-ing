"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  eventId: string;
  ownerId: string | null;
}

export default function OwnerControls({ eventId, ownerId }: Props) {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hasBookings,   setHasBookings]   = useState<boolean | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [requestType,   setRequestType]   = useState<"edit" | "delete" | null>(null);
  const [reason,        setReason]        = useState("");
  const [done,          setDone]          = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!currentUserId || currentUserId !== ownerId) return;
    const supabase = createClient();
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .then(({ count }) => setHasBookings((count ?? 0) > 0));
  }, [currentUserId, ownerId, eventId]);

  // Not the owner — render nothing
  if (!currentUserId || currentUserId !== ownerId) return null;
  if (hasBookings === null) return null;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/events");
    router.refresh();
  }

  async function submitRequest(type: "edit" | "delete") {
    if (!reason.trim()) { setError("Please provide a reason."); return; }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("event_change_requests").insert({
      event_id: eventId,
      user_id:  user!.id,
      type,
      reason:   reason.trim(),
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
    setRequestType(null);
    setReason("");
  }

  if (done) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-3 text-sm text-teal-700 font-medium">
        ✓ Your request has been submitted and is pending review.
      </div>
    );
  }

  return (
    <div className="border border-teal-100 rounded-2xl p-4 bg-white flex flex-col gap-3">
      <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">Owner Controls</p>

      {!hasBookings ? (
        // No bookings — allow direct edit / delete
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/events/${eventId}/edit`)}
            className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-teal-200"
          >
            ✏️ Edit Event
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-red-200 disabled:opacity-50"
          >
            🗑 Delete Event
          </button>
        </div>
      ) : (
        // Has bookings — only allow change requests
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500">
            This event has registrations. You can request an edit or deletion — it will be reviewed before applying.
          </p>
          {!requestType ? (
            <div className="flex gap-2">
              <button
                onClick={() => setRequestType("edit")}
                className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-teal-200"
              >
                ✏️ Request Edit
              </button>
              <button
                onClick={() => setRequestType("delete")}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 font-semibold text-sm py-2.5 rounded-xl transition-colors border border-red-200"
              >
                🗑 Request Deletion
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-teal-900">
                Reason for {requestType === "edit" ? "editing" : "deleting"}:
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Explain why you need to make this change…"
                className="w-full px-3 py-2 rounded-xl border-2 border-teal-100 text-sm text-teal-900 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors resize-none"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => submitRequest(requestType)}
                  disabled={loading}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "Submit Request"}
                </button>
                <button
                  onClick={() => { setRequestType(null); setReason(""); setError(null); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && !requestType && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
