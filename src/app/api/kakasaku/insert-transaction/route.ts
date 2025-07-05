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
    photo_url,
    image_url,
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
        photo_url,
        image_url,
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

export async function GET(req: NextRequest) {
  const kaka_saku_id = req.nextUrl.searchParams.get("kaka_saku_id");
  if (!kaka_saku_id) {
    return NextResponse.json({ transactions: [] });
  }
  const { data, error } = await supabase
    .from(process.env.NEXT_PUBLIC_KAKASAKU_TRANSACTION as string)
    .select("*")
    .eq("kaka_saku_id", kaka_saku_id)
    .order("transaction_time", { ascending: false });

  if (error) {
    return NextResponse.json({ transactions: [] });
  }
  return NextResponse.json({ transactions: data });
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    console.log("Attempting to delete transaction with ID:", id);

    // Delete the transaction using service role key
    const { error: deleteError } = await supabase
      .from(process.env.NEXT_PUBLIC_KAKASAKU_TRANSACTION as string)
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting transaction:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    console.log("Transaction deleted successfully");
    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
