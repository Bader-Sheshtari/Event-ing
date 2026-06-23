import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const MF_BASE_URL = "https://apitest.myfatoorah.com";
const MF_TOKEN    = process.env.MYFATOORAH_API_KEY!;

export async function POST(req: NextRequest) {
  // 10 verifications per IP per 10 minutes
  const ip      = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const allowed = rateLimit(`verify:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId." }, { status: 400 });
    }

    const mfRes = await fetch(`${MF_BASE_URL}/v2/GetPaymentStatus`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${MF_TOKEN}`,
      },
      body: JSON.stringify({ Key: paymentId, KeyType: "PaymentId" }),
    });

    const mfData = await mfRes.json();

    if (!mfData.IsSuccess) {
      return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    }

    const invoice = mfData.Data;
    const paid    = invoice.InvoiceStatus === "Paid";

    // Only return what the client needs — never expose full invoice object
    return NextResponse.json({ paid, invoiceStatus: invoice.InvoiceStatus });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
