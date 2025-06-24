import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // gunakan service role key untuk akses penuh
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    order_id,
    kaka_saku_id,
    name,
    email,
    amount,
    status,
    payment_type,
    transaction_time,
    midtrans_response,
  } = body;

  // Gunakan waktu sekarang jika transaction_time tidak ada
  const trxTime = transaction_time ? new Date(transaction_time) : new Date();

  const { error } = await supabase
    .from(process.env.NEXT_PUBLIC_KAKASAKU_TRANSACTION as string)
    .insert([
      {
        order_id,
        kaka_saku_id,
        name,
        email,
        amount,
        status,
        payment_type,
        transaction_time: trxTime,
        midtrans_response,
      },
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Jika status settlement, update current_amount dan kakaksaku pada tabel kakasaku
  if (status === "settlement") {
    // Ambil current_amount dan kakaksaku lama
    const { data: kakaSaku, error: getError } = await supabase
      .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
      .select("current_amount, kakaksaku")
      .eq("id", kaka_saku_id)
      .single();

    if (!getError && kakaSaku) {
      const newAmount = Number(kakaSaku.current_amount) + Number(amount);
      const newKakaksaku = Number(kakaSaku.kakaksaku || 0) + 1;
      await supabase
        .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
        .update({ current_amount: newAmount, kakaksaku: newKakaksaku })
        .eq("id", kaka_saku_id);
    }
  }

  return NextResponse.json({ success: true });
}
