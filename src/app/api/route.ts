import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  const renderTrack = process.env.NEXT_PUBLIC_RENDER;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const fileName = searchParams.get("audio");
  const result = await fetch(`${renderTrack}/tracks/${fileName}`);
  return result;
}
