import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    // Check if required environment variables are available
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { userId, apiSecret } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify API secret
    if (!apiSecret || apiSecret !== process.env.NEXT_PUBLIC_API_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const tableName = process.env.NEXT_PUBLIC_PROFILES || "profiles";

    // First, check if user exists using admin client
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from(tableName)
      .select("id, full_name, email")
      .eq("id", userId)
      .single();

    if (checkError) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user from the profiles table using admin client
    const { error: profileError } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq("id", userId);

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to delete user profile" },
        { status: 500 }
      );
    }

    // Also delete the user from auth.users using admin client
    try {
      await supabaseAdmin.auth.admin.deleteUser(userId);
    } catch (authError) {
      // Continue even if auth deletion fails, as profile is already deleted
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
