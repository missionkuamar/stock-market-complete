import { fetcher } from '@/lib/coingecko.action';
import React from 'react'
import Image from "next/image";


import { fetchChartData } from '@/lib/coingeckoChart';
import CandlestickChart from '../CandlestickChart';



const CoinOverview = async ({ coin }: { coin: any }) => {

  const chartData = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coin.slug}/ohlc?vs_currency=usd&days=1`
  ).then(res => res.json());
console.log(coin.slug)
  return (
    <div id='coin-overview'>

      <CandlestickChart
        data={chartData}
        coinId={coin.slug}
      >
        <div className='flex items-center gap-3'>
          <Image
            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
            alt={coin.name}
            width={56}
            height={56}
          />

          <div>
            <p>{coin.name} / {coin.symbol}</p>
            <h1>${coin.quote.USD.price.toFixed(2)}</h1>
          </div>
        </div>

      </CandlestickChart>

    </div>
  );
};
export default CoinOverview
