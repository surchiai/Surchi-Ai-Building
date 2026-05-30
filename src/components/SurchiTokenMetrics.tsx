import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

interface TokenMetrics {
  priceUsd: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  isListed: boolean;
  pairAddress: string;
  chainId: string;
  dexId: string;
}

export function SurchiTokenMetrics() {
  const [metrics, setMetrics] = useState<TokenMetrics>({
    priceUsd: 0,
    marketCap: 0,
    volume24h: 0,
    priceChange24h: 0,
    isListed: false,
    pairAddress: '',
    chainId: '',
    dexId: '',
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [pulseGlow, setPulseGlow] = useState(false);

  const fetchSurchiMetrics = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setPulseGlow(true);

    try {
      // Search DexScreener for SURCHI tokens
      const response = await fetch('https://api.dexscreener.com/latest/dex/search?q=SURCHI');
      if (!response.ok) {
        throw new Error('Network response got interrupted');
      }
      const data = await response.json();

      if (data && data.pairs && data.pairs.length > 0) {
        // Find Raydium/Solana pairs or any pair with largest liquidity matching symbol SURCHI
        const surchiPairs = data.pairs.filter((p: any) => {
          const symbolMatch = p.baseToken?.symbol?.toUpperCase() === 'SURCHI';
          return symbolMatch;
        });

        if (surchiPairs.length > 0) {
          // Sort by highest liquidity
          surchiPairs.sort((a: any, b: any) => {
            const liqA = a.liquidity?.usd || 0;
            const liqB = b.liquidity?.usd || 0;
            return liqB - liqA;
          });

          const bestPair = surchiPairs[0];

          setMetrics({
            priceUsd: parseFloat(bestPair.priceUsd || '0'),
            marketCap: bestPair.marketCap || 0,
            volume24h: bestPair.volume?.h24 || 0,
            priceChange24h: bestPair.priceChange?.h24 || 0,
            isListed: true,
            pairAddress: bestPair.pairAddress || '',
            chainId: bestPair.chainId || 'solana',
            dexId: bestPair.dexId || 'raydium',
          });
        } else {
          // No active valid pairs matching SURCHI found
          setMetrics({
            priceUsd: 0,
            marketCap: 0,
            volume24h: 0,
            priceChange24h: 0,
            isListed: false,
            pairAddress: '',
            chainId: '',
            dexId: '',
          });
        }
      } else {
        setMetrics({
          priceUsd: 0,
          marketCap: 0,
          volume24h: 0,
          priceChange24h: 0,
          isListed: false,
          pairAddress: '',
          chainId: '',
          dexId: '',
        });
      }
    } catch (error) {
      console.error('Failed to retrieve $SURCHI metrics:', error);
      // Fail safely to inactive state - never fabricate fake parameters
      setMetrics({
        priceUsd: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0,
        isListed: false,
        pairAddress: '',
        chainId: '',
        dexId: '',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
      setTimeout(() => setPulseGlow(false), 800);
    }
  };

  useEffect(() => {
    fetchSurchiMetrics();

    // Auto update metrics every 60 seconds
    const interval = setInterval(() => {
      fetchSurchiMetrics();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0) return '$0.000';
    if (price < 0.0001) return `$${price.toFixed(8)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  };

  const formatLargeNum = (num: number) => {
    if (num === 0) return '$0.000';
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(3)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(3)}M`;
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  };

  return (
    <div className="w-full relative font-sans text-left">
      {/* Unified Single-Row Dashboard Card */}
      <div 
        className={`relative group bg-gradient-to-r from-[#040921] via-[#020514] to-[#01020a] border ${pulseGlow ? 'border-cyber-cyan/90 shadow-[0_0_20px_rgba(0,229,255,0.25)]' : 'border-cyber-cyan/30 hover:border-cyber-cyan/50'} rounded-xl px-3 sm:px-4 py-2 backdrop-blur-md transition-all duration-300 hover:shadow-[0_4px_30px_rgba(0,229,255,0.12)] overflow-hidden`}
      >
        {/* Subtle Cyber Neon glow background accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-cyan/3 rounded-full blur-xl pointer-events-none group-hover:bg-cyber-cyan/5 transition-all duration-300"></div>

        <div className="flex flex-row flex-wrap items-center justify-between gap-3 relative z-10">
          
          {/* LEFT SIDE: Price & Status, with MCAP underneath */}
          <div className="flex flex-col gap-2 py-0.5 shrink-0">
            {/* SURCHI Price & Status Container */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold text-slate-400 tracking-widest uppercase select-none">
                <span>$SURCHI PRICE</span>
                <Icons.TrendingUp className="w-2.5 h-2.5 text-[#00ff88]" />
              </div>
              
              <div className="flex items-center gap-2">
                {loading ? (
                  <div className="h-5 w-16 bg-slate-800/60 rounded animate-pulse"></div>
                ) : (
                  <span className="text-base sm:text-lg font-mono font-black tracking-tight text-white inline-block">
                    {formatPrice(metrics.priceUsd)}
                  </span>
                )}

                {/* Status Badge IMMEDIATELY beside the price */}
                {!loading && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`absolute inline-flex h-full w-full rounded-full ${metrics.isListed ? 'bg-cyber-green' : 'bg-slate-500'} opacity-75 ${metrics.isListed ? 'animate-ping' : ''}`}></span>
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${metrics.isListed ? 'bg-cyber-green' : 'bg-slate-500'}`}></span>
                    </span>
                    <span className={`text-[7.5px] font-mono font-black tracking-wider px-1.5 py-0.5 rounded leading-none ${metrics.isListed ? 'bg-cyber-green/12 text-cyber-green border border-cyber-green/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                      {metrics.isListed ? 'LIVE' : 'NOT LISTED'}
                    </span>
                    {metrics.isListed && (
                      <span className={`text-[7.5px] font-mono font-bold ${metrics.priceChange24h >= 0 ? 'text-cyber-green' : 'text-rose-450'}`}>
                        {metrics.priceChange24h >= 0 ? '+' : ''}{metrics.priceChange24h.toFixed(2)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Market Cap - Aligned perfectly on a single line matching the premium terminal design */}
            <div className="flex items-center gap-2 text-xs font-mono select-none">
              <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase">MCAP</span>
              <Icons.Layers className="w-2.5 h-2.5 text-cyber-cyan/85 shrink-0" />
              {loading ? (
                <div className="h-3.5 w-12 bg-slate-800/40 rounded animate-pulse"></div>
              ) : (
                <span className="text-xs sm:text-sm font-black text-white tracking-tight leading-none">
                  {formatLargeNum(metrics.marketCap)}
                </span>
              )}
              {!loading && (
                <span className={`text-[6.5px] font-sans font-extrabold uppercase px-1 py-0.5 rounded leading-none ${metrics.isListed ? 'text-cyber-cyan/90 bg-cyber-cyan/8' : 'text-slate-405 bg-slate-500/10'}`}>
                  {metrics.isListed ? 'FULLY DILUTED' : 'PENDING'}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT/FAR-RIGHT SIDE: 24H Volume with minimal spacing inside unified card */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            
            {/* 24H Volume Compact Indicator Widget */}
            <div className="px-2.5 py-1 bg-[#070f22]/70 border border-cyber-cyan/15 rounded-lg flex items-center gap-2">
              <div className="p-0.5 rounded bg-[#051710] border border-cyber-green/10 shrink-0">
                <Icons.Activity className="w-3 h-3 text-cyber-green" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[7.5px] font-mono font-bold text-slate-400 tracking-widest uppercase block leading-none select-none">
                  VOLUME
                </span>
                {loading ? (
                  <div className="h-3 w-10 bg-slate-800/40 rounded animate-pulse"></div>
                ) : (
                  <div>
                    <div className="text-xs font-mono font-black text-white tracking-tight leading-none">
                      {formatLargeNum(metrics.volume24h)}
                    </div>
                    <span className="text-[6.5px] font-sans text-slate-500 uppercase block font-semibold leading-none mt-0.5 select-none text-left">
                      {metrics.isListed ? '24H SWAPS' : 'Inactive'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Refresh Icon with dynamic status */}
            <div className="flex items-center gap-1.5 pl-0.5 shrink-0">
              {lastUpdated && (
                <span className="text-[7px] font-mono text-slate-500 hidden xl:inline tracking-wider select-none">
                  CALIBRATED: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={() => fetchSurchiMetrics(true)}
                disabled={loading || refreshing}
                className="p-1 rounded-lg bg-[#0a1226]/80 text-cyber-cyan hover:text-white border border-cyber-cyan/15 hover:border-cyber-cyan disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center shrink-0"
                title="Synchronise on-chain telemetry tools"
              >
                <Icons.RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
