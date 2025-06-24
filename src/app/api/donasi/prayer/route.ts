import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { donasi_id, name, email, photo_url, prayer } = await req.json();
  const { error } = await supabase
    .from(process.env.NEXT_PUBLIC_PRAYER_DONATIONS as string)
    .insert([{ donasi_id, name, email, photo_url, prayer }]);
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
    return NextResponse.json({ prayers: [] });
  }
  const { data, error } = await supabase
    .from(process.env.NEXT_PUBLIC_PRAYER_DONATIONS as string)
    .select("*")
    .eq("donasi_id", donasi_id)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ prayers: [] });
  }
  return NextResponse.json({ prayers: data });
}
