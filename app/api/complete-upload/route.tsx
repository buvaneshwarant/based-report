import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, filePath } = await req.json();

    if (!sessionId || !filePath) {
      return NextResponse.json({ error: "Missing sessionId or filePath" }, { status: 400 });
    }

    // 1. Mark upload as completed in DB
    const { error: updateError } = await supabase
      .from("uploads")
      .update({ status: "completed" })
      .eq("session_id", sessionId)
      .eq("file_path", filePath);

    if (updateError) {
      console.error("Failed to mark as completed", updateError);
      return NextResponse.json({ error: "Failed to mark as completed" }, { status: 500 });
    }

    // 2. Delete the file from storage
    const { error: deleteError } = await supabase
      .storage
      .from("uploads")
      .remove([filePath]);

    if (deleteError) {
      console.error("Failed to delete file", deleteError);
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error in complete-upload", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
