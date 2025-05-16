import { NextRequest, NextResponse } from "next/server";

const TOKEN = "sk-60a68cd1e74a2a6e79db20eb3611c895";

export async function POST(req: NextRequest) {
  const { prompt, sessionId } = await req.json();
  try {
    const options = {
      method: "POST",
      headers: {
        "anchor-api-key": TOKEN,
        "Content-Type": "application/json",
      },
      body: `{"prompt":"${prompt}"}`,
    };

    const response = await fetch(
      `https://api.anchorbrowser.io/v1/tools/perform-web-task?sessionId=${sessionId}`,
      options
    );
    if (!response.ok) {
      throw new Error("Failed to create a session");
    }

    const data = await response.json();
    return NextResponse.json({ response: data.data.result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
