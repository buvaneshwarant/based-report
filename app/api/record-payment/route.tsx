import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { sessionId, email, status } = await req.json();

  if (!sessionId || !email || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("payments")
    .insert([{ session_id: sessionId, email, status }]);

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
