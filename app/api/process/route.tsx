// app/api/process/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { sessionId, email, filePath } = await req.json();

  if (!sessionId || !email || !filePath) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Step 1: Download file from Supabase
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('uploads')
      .download(filePath);

    if (downloadError || !fileData) {
      throw new Error('Failed to download uploaded file.');
    }

    const fileText = await fileData.text();

    // Step 2: Process with LLM (e.g. OpenAI)
    const aiResponse = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a savage group chat analyst. Be brutally honest and funny. Write a 200-word based report.'
        },
        {
          role: 'user',
          content: fileText
        }
      ],
      model: 'gpt-4'
    });

    const report = aiResponse.choices[0].message.content;

    // Step 3: Email the result to the user
    const sendResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '🔥 Your Based Report is Ready',
      html: `<div style="font-family: sans-serif; line-height: 1.5">
        <h1>🎤 Based Report Delivered</h1>
        <p>Thanks for the upload. Here's your personalized roast:</p>
        <pre style="background:#f4f4f4;padding:10px;border-radius:8px">${report}</pre>
        <p style="margin-top:2em">Stay based, <br/>Team Based Report</p>
      </div>`
    });

    console.log('email ', email)
    console.log('Email sent:', sendResult);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PROCESS ERROR]', err);
    return NextResponse.json({ error: 'Failed to generate or send report' }, { status: 500 });
  }
}
