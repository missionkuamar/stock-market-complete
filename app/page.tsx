

import React, { Suspense } from 'react'

import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetcher } from '@/lib/coingecko.action';

import TrendingCoins from '@/components/home/TrendingCoins';
import { CategoriesFallback, CoinOverviewFallback, TrendingCoinsFallback } from '@/components/home/fallback';
import CoinOverview from '@/components/home/CoinOverview';


const coinNames = [
  'Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'XRP',
  'Polkadot', 'Litecoin', 'Chainlink', 'Dogecoin', 'Avalanche'
];




const Page = async  () => {

 const res = await fetcher<any>(
    'cryptocurrency/listings/latest',
    { limit: 50 }
  );

  const coins = res.data;


console.log(coins)

  return (
    <main className='main-container'>
      <section className='home-grid '>
  
  <div className="lg:col-span-2">
    <Suspense fallback={<CoinOverviewFallback />}>
      <CoinOverview coin={coins[0]} />
    </Suspense>
  </div>

  <div>
    <Suspense fallback={<TrendingCoinsFallback />}>
      <TrendingCoins coins={coins} />
    </Suspense>
  </div>

</section>
      <section className='w-full mt-7 space-y-4'>
       <Suspense fallback={<CategoriesFallback />}>
         <p>Category</p>
        </Suspense>
      </section>
    </main>
  );
};

export default Page;


