import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, editType, newPassword, isActive, apiSecret } = body;

    // Validate API secret
    if (apiSecret !== process.env.NEXT_PUBLIC_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!userId || !editType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate edit type
    if (!["status", "password"].includes(editType)) {
      return NextResponse.json({ error: "Invalid edit type" }, { status: 400 });
    }

    // Create service role client for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    if (editType === "password") {
      // Validate password
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      // Update password in Supabase Auth
      const { error: authError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: newPassword,
        });

      if (authError) {
        return NextResponse.json(
          { error: "Failed to update password" },
          { status: 500 }
        );
      }
    } else if (editType === "status") {
      // Update is_active status in profiles table using service role
      const { error: profileError } = await supabaseAdmin
        .from(process.env.NEXT_PUBLIC_PROFILES as string)
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        return NextResponse.json(
          { error: "Failed to update user status" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
