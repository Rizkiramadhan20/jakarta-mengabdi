import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // gunakan service role key untuk akses penuh
);

export async function POST(req: NextRequest) {
  try {
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

    // Validate required fields
    if (!kaka_saku_id || !name || !email || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: kaka_saku_id, name, email, amount" },
        { status: 400 }
      );
    }

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
      // Ambil current_amount, kakaksaku, dan message_template
      const { data: kakaSaku, error: getError } = await supabase
        .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
        .select("current_amount, kakaksaku, message_template, title")
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

      // Ambil nomor WhatsApp user dari tabel profiles
      let phone = null;
      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("phone")
          .eq("email", email)
          .single();
        if (!profileError && profile && profile.phone) {
          phone = profile.phone;
        }
      } catch (err) {
        console.error("Gagal mengambil nomor WhatsApp user:", err);
      }

      // Format nomor ke internasional (Indonesia)
      if (phone && phone.startsWith("0")) {
        phone = "62" + phone.slice(1);
      }

      // Kirim WhatsApp notification hanya jika nomor ditemukan
      if (phone) {
        try {
          let message = null;
          if (kakaSaku && kakaSaku.message_template) {
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

            message = kakaSaku.message_template
              .replace(/\{name\}/g, name)
              .replace(/\{title\}/g, kakaSaku.title || "KakaSaku")
              .replace(/\{amount\}/g, formattedAmount)
              .replace(/\{status\}/g, "berhasil")
              .replace(/\{transaction_time\}/g, formattedTime);
          }
          if (message) {
            await fetch(
              "https://bdg.wablas.com/api/send-message?phone=" +
                phone +
                "&message=" +
                message,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "MIcuCLWmJYSgD9tIqcrL1W9CICbDkQf68MPgKzmwH7fnEEJiGsuEa49",
                },
                body: JSON.stringify({ phone, message }),
              }
            );
          }
        } catch (err) {
          console.error("Gagal mengirim WhatsApp notification:", err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error in POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
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

    // Delete the transaction using service role key
    const { error: deleteError } = await supabase
      .from(process.env.NEXT_PUBLIC_KAKASAKU_TRANSACTION as string)
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting transaction:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

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
