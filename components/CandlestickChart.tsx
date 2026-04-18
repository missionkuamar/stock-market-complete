'use client';

import { CandlestickSeries } from 'lightweight-charts';
import {
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/app/constants';

import { convertOHLCData } from '@/lib/utils';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { fetcher } from '@/lib/coingecko.action';

type CandlestickChartProps = {
  children?: React.ReactNode;
  data: OHLCData[];
  coinId: string;
  height?: number;
  initialPeriod?: Period;
  liveInterval?: any;
  setLiveInterval?: any;
};


const CandlestickChart = ({
  children,
  data,
  coinId,
  height = 360,
  initialPeriod = 'daily',
}: CandlestickChartProps) => {

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const [isPending, startTransition] = useTransition();
  const [period, setPeriod] = useState(initialPeriod);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);

  // ✅ FETCH DATA (CoinGecko)
  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days } = PERIOD_CONFIG[selectedPeriod];

      const newData = await fetcher<OHLCData[]>(
        `coins/${coinId}/ohlc`,
        {
          vs_currency: 'usd',
          days,
        }
      );

      setOhlcData(newData ?? []);
    } catch (error) {
      console.log('Error fetching OHLC data:', error);
    }
  };

  // ✅ PERIOD CHANGE
  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return;

    startTransition(async () => {
      setPeriod(newPeriod);
      await fetchOHLCData(newPeriod);
    });
  };

  // ✅ CREATE CHART
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      ...getChartConfig(height, true),
      width: container.clientWidth,
    });

    // ✅ CORRECT METHOD

const series = chart.addSeries(CandlestickSeries, {
  upColor: '#22c55e',
  downColor: '#ef4444',
  borderVisible: false,
  wickUpColor: '#22c55e',
  wickDownColor: '#ef4444',
});

    chartRef.current = chart;
    candleSeriesRef.current = series;

    // ✅ RESIZE FIX
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]?.contentRect) return;

      chart.applyOptions({
        width: entries[0].contentRect.width,
      });
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [height]);

  // ✅ UPDATE DATA
  useEffect(() => {
    if (!candleSeriesRef.current) return;
const validData = ohlcData.filter(
  (item) => Array.isArray(item) && item.length === 5
);



    const formatted = validData.map((item) => ({
  time: Math.floor(item[0] / 1000), // seconds
  open: item[1],
  high: item[2],
  low: item[3],
  close: item[4],
}));

    candleSeriesRef.current.setData(formatted);
    chartRef.current?.timeScale().fitContent();
  }, [ohlcData, period]);

  return (
    <div id="candlestick-chart">

      {/* HEADER */}
      <div className="chart-header flex justify-between items-center mb-2">

        <div>{children}</div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Period:</span>

          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handlePeriodChange(value)}
              className={
                period === value
                  ? 'bg-purple-600 text-white px-2 py-1 rounded'
                  : 'bg-gray-800 text-gray-400 px-2 py-1 rounded'
              }
            >
              {label}
            </button>
          ))}
        </div>

      </div>

      {/* CHART */}
      <div ref={chartContainerRef} style={{ height }} />

    </div>
  );
};

export default CandlestickChart;