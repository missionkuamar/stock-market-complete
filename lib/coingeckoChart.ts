// lib/coingeckoChart.ts
export async function fetchChartData(coinId: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=1`
  );
  return res.json();
}