import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: { Accept: "text/calendar" },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Calendar feed request failed (${response.status})` },
        { status: response.status },
      );
    }

    const text = await response.text();
    return new NextResponse(text, {
      headers: { "Content-Type": "text/calendar; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Calendar feed request failed" }, { status: 502 });
  }
}
