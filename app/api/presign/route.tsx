import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { filename, sessionId } = await req.json();

  if (!filename || !sessionId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const path = `uploads/${sessionId}/${filename}`;
  const { data } = await supabase
    .storage
    .from('uploads')
    .createSignedUploadUrl(path);

//     console.log('🔗 Supabase signedUploadUrl:', data);

//   console.log('✅ Supabase signedUploadUrl:', data?.signedUrl);

  return NextResponse.json({ url: data?.signedUrl }, { status: 200 });
}
