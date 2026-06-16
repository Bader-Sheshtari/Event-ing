import { getEvents } from "@/lib/events";
import EventsClient from "./EventsClient";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents().catch(() => []);
  return <EventsClient initialEvents={events} />;
}
