import { NextRequest, NextResponse } from "next/server";

const MF_BASE_URL = "https://apitest.myfatoorah.com";
const MF_TOKEN    = "SK_KWT_vVZlnnAqu8jRByOWaRPNId4ShzEDNt256dvnjebuyzo52dXjAfRx2ixW5umjWSUx";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://event-ing.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const { event_id, attendee_name, attendee_email, message, price, event_title } =
      await req.json();

    if (!event_id || !attendee_name || !attendee_email || !price) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Encode attendee info so we can recover it on the callback page
    const attendeePayload = Buffer.from(
      JSON.stringify({ event_id, attendee_name, attendee_email, message: message ?? "" })
    ).toString("base64url");

    const callbackBase = `${APP_URL}/events/${event_id}/booking`;

    const body = {
      PaymentMethodId: 0,           // 0 = show all available methods
      CustomerName:    attendee_name,
      DisplayCurrencyIso: "KWD",    // test env is KWD
      MobileCountryCode: "+965",
      CustomerMobile:  "00000000",  // optional placeholder
      CustomerEmail:   attendee_email,
      InvoiceValue:    price,
      CallBackUrl:     `${callbackBase}/success?d=${attendeePayload}`,
      ErrorUrl:        `${callbackBase}/error?d=${attendeePayload}`,
      Language:        "en",
      CustomerReference: event_id,
      UserDefinedField: event_title ?? "",
      ExpireDate:      "",
      CustomerAddress: {},
      InvoiceItems: [
        {
          ItemName:  event_title ?? "Event Ticket",
          Quantity:  1,
          UnitPrice: price,
        },
      ],
    };

    const mfRes = await fetch(`${MF_BASE_URL}/v2/ExecutePayment`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        Authorization:   `Bearer ${MF_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const mfData = await mfRes.json();

    if (!mfData.IsSuccess) {
      return NextResponse.json(
        { error: mfData.Message ?? "MyFatoorah payment initiation failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({ paymentUrl: mfData.Data.PaymentURL });
  } catch (err) {
    console.error("Payment initiate error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
