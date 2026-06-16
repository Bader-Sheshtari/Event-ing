import { getSupabase } from "./supabase";
import { Event, EventCategory, EventStatus } from "./data";

export async function getEvents(filters?: {
  category?: EventCategory;
  status?: EventStatus;
  is_free?: boolean;
  search?: string;
}): Promise<Event[]> {
  const supabase = getSupabase();
  let query = supabase.from("events").select("*");

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.status)   query = query.eq("status", filters.status);
  if (filters?.is_free !== undefined) query = query.eq("is_free", filters.is_free);
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%,organizer_name.ilike.%${filters.search}%`
    );
  }

  query = query.order("event_date", { ascending: true });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Event[];
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Event;
}
