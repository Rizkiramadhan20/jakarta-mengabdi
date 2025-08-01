import { NextResponse } from "next/server";

import { supabase } from "@/utils/supabase/supabase";

export const revalidate = 5; // validasi ulang setiap 5 detik

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from(process.env.NEXT_PUBLIC_KAKA_SAKU as string)
      .select(
        "id,title,slug,image_url,target_amount,current_amount,status,deadline"
      )
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json(data || [], {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch kaka saku" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
