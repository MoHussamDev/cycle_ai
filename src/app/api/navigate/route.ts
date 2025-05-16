import { NextRequest, NextResponse } from "next/server";

const TOKEN = "sk-3accc8303a05ed4f9b0e412f5c43758a";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  try {
    const options = {
      method: "POST",
      headers: {
        "anchor-api-key": TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: {
          recording: { active: false },
          proxy: { type: "anchor_residential", active: false },
          timeout: { max_duration: 10, idle_timeout: 3 },
          live_view: { read_only: false },
        },
        browser: {
          profile: {
            name: "my-profile",
            persist: true,
            store_cache: true,
          },
          adblock: { active: false },
          popup_blocker: { active: false },
          captcha_solver: { active: false },
          headless: { active: false },
          viewport: { width: 1440, height: 900 },
        },
      }),
    };

    const response = await fetch(
      "https://api.anchorbrowser.io/v1/sessions",
      options
    );
    console.log("Response:", response);
    if (!response.ok) {
      throw new Error("Failed to create a session");
    }

    const data = await response.json();

    const optionsgoto = {
      method: "POST",
      headers: {
        "anchor-api-key": TOKEN,
        "Content-Type": "application/json",
      },
      body: `{"url": "${url}"}`,
    };
    const sessionId = data.data.id;
    const sessionGoto = await fetch(
      `https://api.anchorbrowser.io/v1/sessions/${sessionId}/goto`,
      optionsgoto
    );
    return NextResponse.json({
      liveUrl: data.data.live_view_url,
      sessionId: sessionId,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
