import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const body = await request.json();
  const { fileContents } = body;

  if (!fileContents) {
    return NextResponse.json({ error: "File contents are required" }, { status: 400 });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4", // Use "gpt-3.5-turbo" if you don't have access to GPT-4
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