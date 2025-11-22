export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  total_volume: number;
  market_cap: number;
}

export function computeTrendScore(coin: CoinMarket): number {
  const oneH = coin.price_change_percentage_1h_in_currency ?? 0;
  const day = coin.price_change_percentage_24h_in_currency ?? 0;
  const vol = coin.total_volume;
  const mc = coin.market_cap || 1;

  const momentum = oneH * 1.5 + day * 0.6;
  const volRatio = Math.min(vol / mc, 2); // cap
  const scoreRaw = momentum * 0.4 + volRatio * 35;

  return Math.round(Math.max(Math.min(scoreRaw, 100), -100));
}

export function trendLabel(score: number): string {
  if (score >= 70) return "Exploding momentum";
  if (score >= 40) return "Strong uptrend";
  if (score >= 15) return "Mild bullish bias";
  if (score > -15) return "Sideways / indecisive";
  if (score > -40) return "Mild selling pressure";
  if (score > -70) return "Strong downtrend";
  return "Capitulation / blow-off";
}

export function momentumReason(coin: CoinMarket): string {
  const oneH = coin.price_change_percentage_1h_in_currency ?? 0;
  const day = coin.price_change_percentage_24h_in_currency ?? 0;
  const vol = coin.total_volume;
  const mc = coin.market_cap || 1;
  const volRatio = vol / mc;

  const pieces: string[] = [];

  if (oneH > 3) pieces.push("sharp 1h momentum");
  else if (oneH > 0.5) pieces.push("steady 1h bid");
  else if (oneH < -3) pieces.push("heavy 1h sell-off");
  else if (oneH < -0.5) pieces.push("soft intraday selling");

  if (day > 8) pieces.push("strong 24h trend");
  else if (day > 3) pieces.push("constructive 24h move");
  else if (day < -8) pieces.push("deep daily drawdown");
  else if (day < -3) pieces.push("persistent daily weakness");

  if (volRatio > 0.25) pieces.push("unusually high volume vs. market cap");
  else if (volRatio > 0.12) pieces.push("healthy liquidity rotation");
  else if (volRatio < 0.03) pieces.push("thin liquidity");

  if (!pieces.length) return "Quiet session with balanced flows.";
  return pieces.join(", ") + ".";
}

export function isNewAndExploding(coin: CoinMarket): boolean {
  const day = coin.price_change_percentage_24h_in_currency ?? 0;
  const volRatio = coin.total_volume / (coin.market_cap || 1);

  const mc = coin.market_cap;
  const isLowMidCap = mc > 5_000_000 && mc < 400_000_000;

  return isLowMidCap && volRatio > 0.18 && day > 12;
}

export function sectorHeatScore(avgChange24h: number, volRatio: number): number {
  const scoreRaw = avgChange24h * 1.2 + volRatio * 25;
  return Math.round(Math.max(Math.min(scoreRaw, 100), -100));
}
