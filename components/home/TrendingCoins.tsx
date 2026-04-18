import React from 'react'
import DataTable from '@/components/DataTable'
import Link from 'next/link';
import Image from "next/image";
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: 'Name',
    cell: (coin) => {
      const item = coin.item;
      return (
        <Link href={`/coins/${item.id}`} className="flex items-center gap-2">
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      );
    },
  },
  {
    header: "24h Change",
    cell: (coin) => {
      const item = coin.item;
      const isUp = item.data.price_change_percentage_24h.usd > 0;

      return (
        <div className={cn(
          'flex items-center gap-1',
          isUp ? 'text-green-500' : 'text-red-500'
        )}>
          {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{item.data.price_change_percentage_24h.usd}%</span>
        </div>
      );
    },
  },
  {
    header: "Price",
    cell: (coin) => coin.item.data.price,
  },
];

const TrendingCoins = ({ coins }: { coins: any[] }) => {

  const data = coins.map((coin) => ({
    item: {
      id: coin.id.toString(),
      name: coin.name,
      large: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      data: {
        price: `$${coin.quote.USD.price.toFixed(2)}`,
        price_change_percentage_24h: {
          usd: coin.quote.USD.percent_change_24h,
        },
      },
    },
  }));

  return (
    <>
      <div className='trending-coins'>
        <h4 className=''>Trending Coins</h4>

      <DataTable
        data={data}
        columns={columns}
        rowKey={(row) => row.item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
      </div>
    </>
  );
};

export default TrendingCoins
