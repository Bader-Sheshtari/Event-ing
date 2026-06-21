import { NextRequest, NextResponse } from "next/server";

const MF_BASE_URL = "https://apitest.myfatoorah.com";
const MF_TOKEN    = "rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqhg2IDIDMoKLgsBs3Dxzh";

export async function POST(req: NextRequest) {
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

    return NextResponse.json({ paid, invoiceStatus: invoice.InvoiceStatus, invoice });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
