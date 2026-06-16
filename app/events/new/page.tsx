"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { CATEGORY_LABELS, CATEGORY_ICONS, EventCategory } from "@/lib/data";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[];

const EMPTY_FORM = {
  title:           "",
  description:     "",
  event_date:      "",
  event_time:      "",
  location:        "",
  category:        "" as EventCategory | "",
  organizer_name:  "",
  price:           "",
  is_free:         true,
  available_spots: "",
  contact_details: "",
};

export default function NewEventPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form,       setForm]       = useState(EMPTY_FORM);
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function handleImagePick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.category) { setError("Please select a category."); return; }
    if (!form.event_date || !form.event_time) { setError("Please set a date and time."); return; }

    setUploading(true);
    try {
      const supabase = getSupabase();
      let image_url  = "";

      // 1. Upload image if provided
      if (imageFile) {
        const ext      = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(fileName, imageFile, { upsert: false });

        if (uploadError) throw new Error(uploadError.message);

        image_url = supabase.storage
          .from("event-images")
          .getPublicUrl(fileName).data.publicUrl;
      }

      // 2. Insert event row
      const price   = form.is_free ? 0 : parseFloat(form.price) || 0;
      const is_free = form.is_free || price === 0;

      const { data, error: insertError } = await supabase
        .from("events")
        .insert({
          title:           form.title.trim(),
          description:     form.description.trim(),
          event_date:      form.event_date,
          event_time:      form.event_time,
          location:        form.location.trim(),
          category:        form.category,
          organizer_name:  form.organizer_name.trim(),
          image_url,
          price,
          is_free,
          available_spots: form.available_spots ? parseInt(form.available_spots) : null,
          contact_details: form.contact_details.trim(),
          status:          "active",
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);
      router.push(`/events/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-coral-400 font-semibold text-sm uppercase tracking-wider mb-1">Share with the community</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-900">Create an Event</h1>
        <p className="text-gray-500 mt-2">Fill in the details and your event goes live instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-teal-900 mb-2">Event Image</label>
          {previewUrl ? (
            <div className="relative h-56 rounded-2xl overflow-hidden bg-teal-50 group">
              <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-600 hover:text-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-44 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50 hover:bg-teal-100 hover:border-teal-400 transition-all flex flex-col items-center justify-center gap-2 text-teal-500"
            >
              <svg className="w-10 h-10 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-sm">Click to upload an image</span>
              <span className="text-xs text-teal-400">JPEG, PNG, WebP — max 5MB</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImagePick}
            className="hidden"
          />
        </div>

        {/* Title */}
        <Field label="Event Title" required>
          <input
            name="title" value={form.title} onChange={handleChange} required
            placeholder="e.g. Summer Jazz Night"
            className={inputClass}
          />
        </Field>

        {/* Description */}
        <Field label="Description" required>
          <textarea
            name="description" value={form.description} onChange={handleChange} required
            rows={4} placeholder="What's this event about?"
            className={inputClass + " resize-none"}
          />
        </Field>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" required>
            <input
              type="date" name="event_date" value={form.event_date} onChange={handleChange} required
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </Field>
          <Field label="Time" required>
            <input
              type="time" name="event_time" value={form.event_time} onChange={handleChange} required
              className={inputClass}
            />
          </Field>
        </div>

        {/* Location */}
        <Field label="Location" required>
          <input
            name="location" value={form.location} onChange={handleChange} required
            placeholder="e.g. Dubai World Trade Centre"
            className={inputClass}
          />
        </Field>

        {/* Category */}
        <Field label="Category" required>
          <select
            name="category" value={form.category} onChange={handleChange} required
            className={inputClass}
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_ICONS[c]} {CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </Field>

        {/* Organiser */}
        <Field label="Organiser Name" required>
          <input
            name="organizer_name" value={form.organizer_name} onChange={handleChange} required
            placeholder="e.g. Dubai Jazz Society"
            className={inputClass}
          />
        </Field>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-teal-900 mb-3">Pricing</label>
          <div className="flex items-center gap-4 mb-3">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, is_free: true, price: "" }))}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                form.is_free
                  ? "bg-teal-500 text-white border-teal-500 shadow-md"
                  : "bg-white text-teal-700 border-teal-200 hover:border-teal-400"
              }`}
            >
              ✨ Free
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, is_free: false }))}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                !form.is_free
                  ? "bg-coral-400 text-white border-coral-400 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              Paid
            </button>
          </div>
          {!form.is_free && (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">AED</span>
              <input
                type="number" name="price" value={form.price} onChange={handleChange}
                min="0.01" step="0.01" required={!form.is_free}
                placeholder="0.00"
                className={inputClass + " pl-14"}
              />
            </div>
          )}
        </div>

        {/* Available spots */}
        <Field label="Available Spots" hint="Leave blank for unlimited">
          <input
            type="number" name="available_spots" value={form.available_spots} onChange={handleChange}
            min="1" placeholder="e.g. 200"
            className={inputClass}
          />
        </Field>

        {/* Contact */}
        <Field label="Contact Details" hint="Email, phone, or website">
          <input
            name="contact_details" value={form.contact_details} onChange={handleChange}
            placeholder="e.g. info@example.com | +971 50 123 4567"
            className={inputClass}
          />
        </Field>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all text-base flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Publishing…
            </>
          ) : (
            "Publish Event →"
          )}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border-2 border-teal-100 bg-white text-teal-900 placeholder-gray-400 focus:outline-none focus:border-teal-400 transition-colors text-sm";

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-teal-900 mb-2">
        {label} {required && <span className="text-coral-400">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
