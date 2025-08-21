import { NextRequest, NextResponse } from "next/server";

import { snap } from "@/utils/midtrans/Midtrans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, gross_amount, name, email } = body;

    if (!order_id || !gross_amount || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      customer_details: {
        first_name: name,
        email,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
