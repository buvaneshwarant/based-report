// app/api/record-upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must use service role for insert
);

export async function POST(req: NextRequest) {
  try {
    const { sessionId, email, filePath, status } = await req.json();

    if (!sessionId || !email || !filePath || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase.from("uploads").insert({
      session_id: sessionId,
      email,
      file_path: filePath,
      status
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Record upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
