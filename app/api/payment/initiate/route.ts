import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MF_BASE_URL = "https://apitest.myfatoorah.com";
const MF_TOKEN    = "SK_KWT_vVZlnnAqu8jRByOWaRPNId4ShzEDNt256dvnjebuyzo52dXjAfRx2ixW5umjWSUx";
const APP_URL     = process.env.NEXT_PUBLIC_APP_URL ?? "https://event-ing.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const { event_id, attendee_name, attendee_email, message } = await req.json();

    if (!event_id || !attendee_name || !attendee_email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Fetch price and title from DB — never trust the client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("price, is_free, title, status")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    if (event.status !== "active") {
      return NextResponse.json({ error: "Event is not active." }, { status: 400 });
    }

    if (event.is_free) {
      return NextResponse.json({ error: "This event is free — no payment required." }, { status: 400 });
    }

    const price = Number(event.price);

    const attendeePayload = Buffer.from(
      JSON.stringify({ event_id, attendee_name, attendee_email, message: message ?? "" })
    ).toString("base64url");

    const callbackBase = `${APP_URL}/events/${event_id}/booking`;

    const body = {
      PaymentMethodId:   2,
      CustomerName:      attendee_name,
      CustomerEmail:     attendee_email,
      InvoiceValue:      price,
      CallBackUrl:       `${callbackBase}/success?d=${attendeePayload}`,
      ErrorUrl:          `${callbackBase}/error?d=${attendeePayload}`,
      Language:          "en",
      CustomerReference: event_id,
      UserDefinedField:  event.title.slice(0, 500),
      InvoiceItems: [
        {
          ItemName:  event.title.slice(0, 100),
          Quantity:  1,
          UnitPrice: price,
        },
      ],
    };

    const mfRes = await fetch(`${MF_BASE_URL}/v2/ExecutePayment`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${MF_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const mfData = await mfRes.json();

    if (!mfData.IsSuccess) {
      console.error("MyFatoorah error:", JSON.stringify(mfData));
      return NextResponse.json(
        { error: mfData.Message ?? "Payment initiation failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({ paymentUrl: mfData.Data.PaymentURL });
  } catch (err) {
    console.error("Payment initiate error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
