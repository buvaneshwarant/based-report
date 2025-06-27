import { NextResponse } from "next/server";
import OpenAI from "openai";
import { hasReachedUploadLimit } from "@/utils/hasReachedUploadLimit";
//import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export async function POST(request: Request) {

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })


  console.log(request);
  console.log(request.body);
  const body = await request.json();
  const fileContents = body.file; // Assuming fileContents is passed in the request body


  try {

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // Use "gpt-3.5-turbo" if you don't have access to GPT-4
      messages: [
        { role: "system", content: "Find something funny about this text and tell me." },
        { role: "user", content: fileContents },
      ],
      max_tokens: 150,
    });

    const messageContent = response.choices[0].message.content;
    if (!messageContent) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 });
    }

    return NextResponse.json({ result: messageContent }, { status: 200 });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);

    const errorMessage = (error as Error)?.message || "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}