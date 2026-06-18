export type EventCategory =
  | "music"
  | "sports"
  | "arts"
  | "food_drink"
  | "technology"
  | "business"
  | "health_wellness"
  | "education"
  | "community"
  | "other";

export type EventStatus = "active" | "cancelled" | "completed";

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;   // ISO date string
  event_time: string;   // HH:MM
  location: string;
  category: EventCategory;
  organizer_name: string;
  image_url: string;
  price: number;
  is_free: boolean;
  available_spots: number;
  contact_details: string;
  status: EventStatus;
  created_at: string;
  user_id?: string | null;
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  music:          "Music",
  sports:         "Sports",
  arts:           "Arts",
  food_drink:     "Food & Drink",
  technology:     "Technology",
  business:       "Business",
  health_wellness:"Health & Wellness",
  education:      "Education",
  community:      "Community",
  other:          "Other",
};

export const CATEGORY_ICONS: Record<EventCategory, string> = {
  music:           "🎵",
  sports:          "⚽",
  arts:            "🎨",
  food_drink:      "🍽️",
  technology:      "💻",
  business:        "💼",
  health_wellness: "🌿",
  education:       "📚",
  community:       "🤝",
  other:           "✨",
};

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Summer Jazz Night",
    description: "An enchanting evening of live jazz under the stars. Join us for a night filled with smooth melodies, great food, and wonderful company. Featuring local and international jazz artists.",
    event_date: "2026-07-15",
    event_time: "19:00",
    location: "Riverside Amphitheatre, Dubai",
    category: "music",
    organizer_name: "Dubai Jazz Society",
    image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    price: 0,
    is_free: true,
    available_spots: 200,
    contact_details: "jazz@dubai.ae | +971 50 123 4567",
    status: "active",
    created_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Tech Founders Summit 2026",
    description: "Connect with the region's top startup founders, investors, and innovators. Three days of talks, workshops, and networking sessions designed to spark your next big idea.",
    event_date: "2026-08-20",
    event_time: "09:00",
    location: "Dubai World Trade Centre",
    category: "technology",
    organizer_name: "Gulf Tech Hub",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    price: 299,
    is_free: false,
    available_spots: 500,
    contact_details: "hello@gulftechhub.com",
    status: "active",
    created_at: "2026-06-02T10:00:00Z",
  },
  {
    id: "3",
    title: "Community Farmers Market",
    description: "Shop fresh local produce, artisan goods, and homemade treats from over 50 local vendors. Live music, kids' activities, and free tastings throughout the day.",
    event_date: "2026-07-05",
    event_time: "08:00",
    location: "Jumeirah Beach Park, Dubai",
    category: "community",
    organizer_name: "Green Roots Community",
    image_url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80",
    price: 0,
    is_free: true,
    available_spots: 1000,
    contact_details: "market@greenroots.ae",
    status: "active",
    created_at: "2026-06-03T10:00:00Z",
  },
  {
    id: "4",
    title: "Watercolour Workshop for Beginners",
    description: "Discover the joy of watercolour painting in this hands-on beginner workshop. All materials provided. Leave with your own finished artwork and new creative skills.",
    event_date: "2026-07-22",
    event_time: "14:00",
    location: "The Arts District, Abu Dhabi",
    category: "arts",
    organizer_name: "Studio Palette",
    image_url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    price: 85,
    is_free: false,
    available_spots: 20,
    contact_details: "studio@palette.ae | +971 2 456 7890",
    status: "active",
    created_at: "2026-06-04T10:00:00Z",
  },
  {
    id: "5",
    title: "5K Morning Run — Sunrise Edition",
    description: "Start your weekend with an energising 5K run along the beautiful corniche. All fitness levels welcome. Free breakfast and refreshments at the finish line!",
    event_date: "2026-07-12",
    event_time: "06:00",
    location: "Abu Dhabi Corniche",
    category: "sports",
    organizer_name: "Active UAE",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    price: 0,
    is_free: true,
    available_spots: 300,
    contact_details: "run@activeuae.com",
    status: "active",
    created_at: "2026-06-05T10:00:00Z",
  },
  {
    id: "6",
    title: "Street Food Festival",
    description: "A mouth-watering celebration of global street food. 80+ food stalls, cooking demos by celebrity chefs, and live entertainment across three stages.",
    event_date: "2026-08-08",
    event_time: "16:00",
    location: "Expo City Dubai",
    category: "food_drink",
    organizer_name: "Taste of the World",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    price: 25,
    is_free: false,
    available_spots: 2000,
    contact_details: "info@tasteoftheworld.ae",
    status: "active",
    created_at: "2026-06-06T10:00:00Z",
  },
  {
    id: "7",
    title: "Mindfulness & Yoga Retreat",
    description: "A full-day wellness retreat blending yoga, breathwork, meditation, and nourishing plant-based meals. Reset your mind and body in a serene desert setting.",
    event_date: "2026-09-01",
    event_time: "07:00",
    location: "Al Maha Desert Resort, Dubai",
    category: "health_wellness",
    organizer_name: "Soul Space UAE",
    image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    price: 195,
    is_free: false,
    available_spots: 40,
    contact_details: "retreat@soulspace.ae",
    status: "active",
    created_at: "2026-06-07T10:00:00Z",
  },
  {
    id: "8",
    title: "Arabic Calligraphy Masterclass",
    description: "Learn the ancient art of Arabic calligraphy from master artist Hassan Al-Rashid. Beginner-friendly session covering three classic scripts with take-home tools.",
    event_date: "2026-07-30",
    event_time: "11:00",
    location: "Alserkal Avenue, Dubai",
    category: "education",
    organizer_name: "Heritage Arts Foundation",
    image_url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    price: 120,
    is_free: false,
    available_spots: 15,
    contact_details: "classes@heritageartsae.com",
    status: "active",
    created_at: "2026-06-08T10:00:00Z",
  },
];

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" });
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}
