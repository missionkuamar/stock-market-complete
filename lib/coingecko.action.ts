'use server';

import qs from 'query-string';

const BASE_URL = process.env.COINMARKETCAP_BASE_URL!;
const API_KEY = process.env.COINMARKETCAP_API_KEY!;

export async function fetcher<T>(
  endpoint: string,
  params?: Record<string, any>,
  revalidate = 60
): Promise<T> {

  const cleanEndpoint = endpoint.replace(/^\/+/, '');

  const url = qs.stringifyUrl({
    url: `${BASE_URL}/${cleanEndpoint}`,
    query: params,
  });

  const response = await fetch(url, {
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY, // 🔥 IMPORTANT (uppercase works best)
      'Accept': 'application/json',
    },
    next: { revalidate },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('CMC ERROR:', errorText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}