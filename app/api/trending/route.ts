import { NextResponse } from "next/server";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export const revalidate = 60;

export async function GET() {
  try {
    const res = await fetch(`${COINGECKO_BASE}/search/trending`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
