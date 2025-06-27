import { NextResponse } from "next/server";

import { supabase } from "@/utils/supabase/supabase";

export const revalidate = 5; // validasi ulang setiap 5 detik

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from(process.env.NEXT_PUBLIC_DONATIONS as string)
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || null);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch donasi" },
      { status: 500 }
    );
  }
}
