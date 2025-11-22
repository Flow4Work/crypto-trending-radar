import { NextResponse } from "next/server";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export const revalidate = 45;

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&category=${encodeURIComponent(
    id
  )}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 45 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch sector" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
