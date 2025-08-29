import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, role, photo_url, phone, password, apiSecret } =
      body;

    // Validate API secret

    if (apiSecret !== process.env.NEXT_PUBLIC_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!full_name || !email || !role || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create auth user (service role)
    const createAuthRes = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, phone, role },
    });

    if (createAuthRes.error || !createAuthRes.data.user) {
      return NextResponse.json(
        { error: createAuthRes.error?.message || "Failed to create auth user" },
        { status: 400 }
      );
    }

    const authUserId = createAuthRes.data.user.id;

    // Prepare profile payload
    const now = new Date().toISOString();
    const newProfile = {
      id: authUserId,
      full_name,
      email,
      role,
      photo_url: photo_url || null,
      phone,
      is_verified: true,
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    // Check if profile already exists (some projects auto-create profile via trigger)
    const { data: existingProfile, error: findErr } = await supabaseAdmin
      .from(process.env.NEXT_PUBLIC_PROFILES as string)
      .select("id")
      .eq("id", authUserId)
      .maybeSingle();

    if (findErr) {
      return NextResponse.json(
        { error: `Failed to check profile: ${findErr.message}` },
        { status: 500 }
      );
    }

    let data;
    let error;
    if (existingProfile) {
      // Update to ensure role is admin and fields are synced
      const updatePayload = {
        full_name,
        email,
        role, // ensure admin
        photo_url: photo_url || null,
        phone,
        is_verified: true,
        is_active: true,
        updated_at: now,
      };

      const updateRes = await supabaseAdmin
        .from(process.env.NEXT_PUBLIC_PROFILES as string)
        .update(updatePayload)
        .eq("id", authUserId)
        .select()
        .single();

      data = updateRes.data as any;
      error = updateRes.error as any;
    } else {
      // Insert profile referencing auth user id
      const insertRes = await supabaseAdmin
        .from(process.env.NEXT_PUBLIC_PROFILES as string)
        .insert([newProfile])
        .select()
        .single();
      data = insertRes.data as any;
      error = insertRes.error as any;
    }

    if (error) {
      return NextResponse.json(
        { error: `Failed to create profile: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Admin profile created successfully",
        profile: data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
