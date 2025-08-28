import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    order_id,
    transaction_status,
    payment_type,
    gross_amount,
    transaction_time,
  } = body;

  const kaka_saku_id = parseInt(order_id.split("-")[1], 10);

  const { error } = await supabase
    .from(process.env.NEXT_PUBLIC_KAKASAKU_TRANSACTION as string)
    .insert([
      {
        order_id,
        kaka_saku_id,
        name: body.name,
        email: body.email,
        amount: gross_amount,
        status: transaction_status,
        payment_type,
        transaction_time: transaction_time
          ? new Date(transaction_time)
          : new Date(),
        midtrans_response: body,
      },
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
