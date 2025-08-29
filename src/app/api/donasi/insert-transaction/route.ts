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
    donasi_id,
    name,
    email,
    amount,
    status,
    payment_type,
    transaction_time,
    midtrans_response,
    photo_url,
    image_url,
  } = body;

  const trxTime = transaction_time ? new Date(transaction_time) : new Date();

  const { error } = await supabase
    .from(process.env.NEXT_PUBLIC_DONASI_TRANSACTION as string)
    .insert([
      {
        order_id,
        donasi_id,
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

  // Jika status settlement, update current_amount dan donations pada tabel donasi
  if (status === "settlement") {
    const { data: donasi, error: getError } = await supabase
      .from(process.env.NEXT_PUBLIC_DONATIONS as string)
      .select("current_amount, donations, message_template, title")
      .eq("id", donasi_id)
      .single();

    if (!getError && donasi) {
      const newAmount = Number(donasi.current_amount) + Number(amount);
      const newDonations = Number(donasi.donations || 0) + 1;
      await supabase
        .from(process.env.NEXT_PUBLIC_DONATIONS as string)
        .update({ current_amount: newAmount, donations: newDonations })
        .eq("id", donasi_id);
    }

    // Ambil nomor WhatsApp user dari tabel profiles
    let phone = null;
    try {
      const { data: profile, error: profileError } = await supabase
        .from(process.env.NEXT_PUBLIC_PROFILES as string)
        .select("phone")
        .eq("email", email)
        .single();
      if (!profileError && profile && profile.phone) {
        phone = profile.phone;
      }
    } catch (err) {}

    // Format nomor ke internasional (Indonesia)
    if (phone && phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }

    // Kirim WhatsApp notification hanya jika nomor dan template ditemukan
    if (phone && donasi && donasi.message_template) {
      try {
        // Format transaction time untuk display
        const formattedTime = trxTime.toLocaleString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        // Format amount dengan pemisah ribuan
        const formattedAmount = Number(amount).toLocaleString("id-ID");

        let message = donasi.message_template
          .replace(/\{name\}/g, name)
          .replace(/\{amount\}/g, formattedAmount)
          .replace(/\{title\}/g, donasi.title || "Donasi")
          .replace(/\{status\}/g, "berhasil")
          .replace(/\{transaction_time\}/g, formattedTime);
        await fetch(
          `${process.env.WA_NOTIFICATION_URL}?phone=${phone}&message=${message}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.WA_TOKEN}.${process.env.WA_SECRET}`,
            },
            body: JSON.stringify({ phone, message }),
          }
        );
      } catch (err) {}
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from(process.env.NEXT_PUBLIC_DONASI_TRANSACTION as string)
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const donasi_id = searchParams.get("donasi_id");
  if (!donasi_id) {
    return NextResponse.json({ donors: [] });
  }
  const { data, error } = await supabase
    .from(process.env.NEXT_PUBLIC_DONASI_TRANSACTION as string)
    .select("name, amount, photo_url, image_url")
    .eq("donasi_id", donasi_id)
    .order("transaction_time", { ascending: false })
    .limit(5);
  if (error) {
    return NextResponse.json({ donors: [] });
  }
  return NextResponse.json({ donors: data });
}
