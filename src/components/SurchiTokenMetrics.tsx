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

interface SurchiTokenMetricsProps {
  onPriceClick?: () => void;
  onMetricsFetched?: (metrics: TokenMetrics) => void;
  themeMode?: 'dark' | 'light';
}

export function SurchiTokenMetrics({ onPriceClick, onMetricsFetched, themeMode }: SurchiTokenMetricsProps = {}) {
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

          const loadedMetrics: TokenMetrics = {
            priceUsd: parseFloat(bestPair.priceUsd || '0'),
            marketCap: bestPair.marketCap || 0,
            volume24h: bestPair.volume?.h24 || 0,
            priceChange24h: bestPair.priceChange?.h24 || 0,
            isListed: true,
            pairAddress: bestPair.pairAddress || '',
            chainId: bestPair.chainId || 'solana',
            dexId: bestPair.dexId || 'raydium',
          };

          setMetrics(loadedMetrics);
          if (onMetricsFetched) {
            onMetricsFetched(loadedMetrics);
          }
        } else {
          // No active valid pairs matching SURCHI found
          const inactiveMetrics: TokenMetrics = {
            priceUsd: 0,
            marketCap: 0,
            volume24h: 0,
            priceChange24h: 0,
            isListed: false,
            pairAddress: '',
            chainId: '',
            dexId: '',
          };
          setMetrics(inactiveMetrics);
          if (onMetricsFetched) {
            onMetricsFetched(inactiveMetrics);
          }
        }
      } else {
        const inactiveMetrics: TokenMetrics = {
          priceUsd: 0,
          marketCap: 0,
          volume24h: 0,
          priceChange24h: 0,
          isListed: false,
          pairAddress: '',
          chainId: '',
          dexId: '',
        };
        setMetrics(inactiveMetrics);
        if (onMetricsFetched) {
          onMetricsFetched(inactiveMetrics);
        }
      }
    } catch (error) {
      console.error('Failed to retrieve $SURCHI metrics:', error);
      // Fail safely to inactive state - never fabricate fake parameters
      const faultMetrics: TokenMetrics = {
        priceUsd: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0,
        isListed: false,
        pairAddress: '',
        chainId: '',
        dexId: '',
      };
      setMetrics(faultMetrics);
      if (onMetricsFetched) {
        onMetricsFetched(faultMetrics);
      }
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
        onClick={onPriceClick}
        className={`relative group bg-cyber-card border ${pulseGlow ? 'border-cyber-cyan/90 shadow-[0_0_20px_rgba(0,229,255,0.25)]' : 'border-cyber-cyan/30 hover:border-cyber-cyan/50'} rounded-xl px-3 sm:px-4 py-2 backdrop-blur-md transition-all duration-300 hover:shadow-[0_4px_30px_rgba(0,229,255,0.12)] overflow-hidden ${onPriceClick ? 'cursor-pointer active:scale-[0.995]' : ''}`}
        title={onPriceClick ? "Activate Surchi Token Live Market analytics separate page" : undefined}
      >
        {/* Subtle Cyber Neon glow background accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-cyan/3 rounded-full blur-xl pointer-events-none group-hover:bg-cyber-cyan/5 transition-all duration-300"></div>

        <div className="flex flex-col gap-3 relative z-10 w-full text-left">
          
          {/* ROW 1: Price / Status on the left, Buy / Refresh on the right */}
          <div className="flex items-center justify-between gap-3 w-full">
            
            {/* Price & Status Container */}
            <div className="flex flex-col gap-0.5 shrink-0 text-left">
              <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold text-cyber-text-muted tracking-widest uppercase select-none">
                <span>$SURCHI PRICE</span>
                <Icons.TrendingUp className="w-2.5 h-2.5 text-emerald-600 dark:text-[#00ff88]" />
              </div>
              
              <div className="flex items-center gap-2">
                {loading ? (
                  <div className="h-5 w-16 bg-cyber-card-light/60 rounded animate-pulse"></div>
                ) : (
                  <span className="text-base sm:text-lg font-mono font-black tracking-tight text-cyber-text inline-block">
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
                    <span className={`text-[7.5px] font-mono font-black tracking-wider px-1.5 py-0.5 rounded leading-none ${metrics.isListed ? 'bg-cyber-green/12 text-cyber-green border border-cyber-green/20' : 'bg-slate-500/10 text-cyber-text-muted border border-slate-500/20'}`}>
                      {metrics.isListed ? 'LIVE' : 'NOT LISTED'}
                    </span>
                    {metrics.isListed && (
                      <span className={`text-[7.5px] font-mono font-bold ${metrics.priceChange24h >= 0 ? 'text-cyber-green' : 'text-rose-605'}`}>
                        {metrics.priceChange24h >= 0 ? '+' : ''}{metrics.priceChange24h.toFixed(2)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* upper right corner: Buy button & Quick refresh */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* BUY $SURCHI Transaction Portal Button */}
              <a
                href="https://raydium.io/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[8px] font-mono font-extrabold tracking-widest uppercase no-underline hover:scale-[1.03] active:scale-[0.97] transition-all cursor-pointer select-none border shrink-0 ${
                  themeMode === 'light'
                    ? 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-700 border-emerald-300 shadow-sm'
                    : 'text-cyber-neon hover:text-[#52ffb0] bg-[#051c11] hover:bg-[#09301d] border border-cyber-neon/45 hover:border-cyber-neon shadow-[0_0_8px_rgba(0,255,136,0.12)] hover:shadow-[0_0_12px_rgba(0,255,136,0.25)]'
                }`}
              >
                <Icons.Coins className={`w-3 h-3 shrink-0 ${themeMode === 'light' ? 'text-emerald-600' : 'text-[#00ff88]'}`} />
                <span>BUY $SURCHI</span>
                <Icons.ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
              </a>

              {/* Quick Refresh Icon */}
              <div className="flex items-center gap-1 shrink-0">
                {lastUpdated && (
                  <span className="text-[7px] font-mono text-cyber-text-muted hidden xl:inline tracking-wider select-none">
                    CALIBRATED: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); fetchSurchiMetrics(true); }}
                  disabled={loading || refreshing}
                  className={`p-1 rounded-md disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center shrink-0 border ${
                    themeMode === 'light'
                      ? 'bg-slate-50 hover:bg-slate-100 text-indigo-600 hover:text-indigo-800 border-slate-300'
                      : 'bg-cyber-card-light text-cyber-cyan hover:text-cyber-text border border-cyber-cyan/15 hover:border-cyber-cyan'
                  }`}
                  title="Synchronise on-chain telemetry tools"
                >
                  <Icons.RefreshCw className={`w-2.5 h-2.5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

          </div>

          {/* ROW 2: Market Cap on the Left, Volume on the Right (Opposite of Market Cap) */}
          <div className="flex items-center justify-between gap-3 w-full border-t border-cyber-cyan/15 pt-2">
            
            {/* Market Cap (MCAP) */}
            <div className="flex items-center gap-1.5 text-xs font-mono select-none font-bold">
              <span className="text-[8px] font-black text-cyber-text-muted tracking-widest uppercase">MCAP</span>
              <Icons.Layers className="w-2.5 h-2.5 text-cyber-cyan/85 shrink-0" />
              {loading ? (
                <div className="h-3.5 w-12 bg-cyber-card-light/40 rounded animate-pulse"></div>
              ) : (
                <span className="text-xs sm:text-sm font-black text-cyber-text tracking-tight leading-none">
                  {formatLargeNum(metrics.marketCap)}
                </span>
              )}
              {!loading && (
                <span className={`text-[6.5px] font-sans font-extrabold uppercase px-1 py-0.5 rounded leading-none ${metrics.isListed ? 'text-cyber-cyan/90 bg-cyber-cyan/8' : 'text-cyber-text-muted bg-slate-500/10'}`}>
                  {metrics.isListed ? 'FULLY DILUTED' : 'PENDING'}
                </span>
              )}
            </div>

            {/* Volume (VOL) - Mirrored opposite text flow and alignment */}
            <div className="flex items-center gap-1.5 text-xs font-mono select-none font-bold">
              {!loading && (
                <span className={`text-[6.5px] font-sans font-extrabold uppercase px-1 py-0.5 rounded leading-none ${metrics.isListed ? 'text-cyber-green/95 bg-cyber-green/8' : 'text-cyber-text-muted bg-slate-500/10'}`}>
                  {metrics.isListed ? '24H SWAPS' : 'INACTIVE'}
                </span>
              )}
              {loading ? (
                <div className="h-3.5 w-12 bg-cyber-card-light/40 rounded animate-pulse"></div>
              ) : (
                <span className="text-xs sm:text-sm font-black text-cyber-text tracking-tight leading-none">
                  {formatLargeNum(metrics.volume24h)}
                </span>
              )}
              <Icons.Activity className="w-2.5 h-2.5 text-cyber-green/85 shrink-0" />
              <span className="text-[8px] font-black text-cyber-text-muted tracking-widest uppercase">VOL</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
