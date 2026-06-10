import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { formatAbbreviatedPrice } from '../utils/priceFormatter';

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
  hideSocials?: boolean;
}

export function SurchiTokenMetrics({ onPriceClick, onMetricsFetched, themeMode, hideSocials = false }: SurchiTokenMetricsProps = {}) {
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

  const fetchSurchiMetrics = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Search DexScreener for SURCHI tokens via cached backend proxy, fallback to direct public endpoint on static hosting
      let response;
      let data;
      try {
        response = await fetch('/api/proxy/dexscreener/search?q=SURCHI');
        const contentType = response?.headers.get("content-type") || "";
        if (!response.ok || !contentType.includes("application/json")) {
          throw new Error('Not a valid json response (proxy offline/redirected)');
        }
        data = await response.json();
      } catch (err) {
        console.info('SurchiTokenMetrics backend proxy offline, falling back directly to public DexScreener API:', err);
        response = await fetch('https://api.dexscreener.com/latest/dex/search?q=SURCHI');
        if (!response.ok) {
          throw new Error('Direct query returned error');
        }
        data = await response.json();
      }

      if (data && data.pairs && data.pairs.length > 0) {
        const surchiPairs = data.pairs.filter((p: any) => {
          return p.baseToken?.symbol?.toUpperCase() === 'SURCHI';
        });

        if (surchiPairs.length > 0) {
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
          // No active valid pairs matching SURCHI found - fallback to beautiful baseline metrics
          const baselineMetrics: TokenMetrics = {
            priceUsd: 0,
            marketCap: 0,
            volume24h: 0,
            priceChange24h: 0,
            isListed: false,
            pairAddress: "9u9surchi_ecosystem_token_placeholder",
            chainId: "solana",
            dexId: "raydium",
          };
          setMetrics(baselineMetrics);
          if (onMetricsFetched) {
            onMetricsFetched(baselineMetrics);
          }
        }
      } else {
        const baselineMetrics: TokenMetrics = {
          priceUsd: 0,
          marketCap: 0,
          volume24h: 0,
          priceChange24h: 0,
          isListed: false,
          pairAddress: "9u9surchi_ecosystem_token_placeholder",
          chainId: "solana",
          dexId: "raydium",
        };
        setMetrics(baselineMetrics);
        if (onMetricsFetched) {
          onMetricsFetched(baselineMetrics);
        }
      }
    } catch (error) {
      console.warn('Handling $SURCHI metrics baseline integration gracefully:', error);
      const baselineMetrics: TokenMetrics = {
        priceUsd: 0,
        marketCap: 0,
        volume24h: 0,
        priceChange24h: 0,
        isListed: false,
        pairAddress: "9u9surchi_ecosystem_token_placeholder",
        chainId: "solana",
        dexId: "raydium",
      };
      setMetrics(baselineMetrics);
      if (onMetricsFetched) {
        onMetricsFetched(baselineMetrics);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchSurchiMetrics();
    const interval = setInterval(() => {
      fetchSurchiMetrics();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0) return '$0.000';
    return `$${formatAbbreviatedPrice(price)}`;
  };

  const formatLargeNum = (num: number) => {
    if (num === 0) return '$0.000';
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(3)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(3)}M`;
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  };

  return (
    <div 
      onClick={onPriceClick}
      className={`w-full max-w-[380px] sm:max-w-lg md:max-w-2xl mx-auto rounded-[20px] border select-none transition-all duration-300 relative group overflow-hidden ${
        onPriceClick ? 'cursor-pointer hover:shadow-xl hover:scale-[1.002] active:scale-[0.998]' : ''
      } ${
        themeMode === 'light'
          ? 'bg-white border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)]'
          : 'bg-[#06070d] border-[#8b5cf6]/10 shadow-[0_8px_30px_rgba(139,92,246,0.015)]'
      }`}
    >
      {/* 3-Dots Action Menu top right - compact */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center justify-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onPriceClick) onPriceClick();
          }}
          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
            themeMode === 'light'
              ? 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              : 'bg-purple-500/5 border-purple-500/10 text-slate-400 hover:text-white hover:bg-purple-500/15'
          }`}
          title="Open Ecosystem Terminal"
        >
          <Icons.MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        
        {/* HEADER BLOCK - Highly compact & closely arranged */}
        <div className="flex items-center justify-between gap-2 pr-6">
          
          {/* Real Surchi Logo & Identity info */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-purple-500/15 shadow-[0_2px_8px_rgba(139,92,246,0.15)] shrink-0 bg-black">
              <img
                src="https://raw.githubusercontent.com/surchiai/surchiai.github.io/refs/heads/main/SURCHI%20logo.jpg"
                alt="SURCHI Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex flex-col text-left justify-center min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className={`text-sm sm:text-base font-black tracking-tight leading-none uppercase truncate ${
                  themeMode === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  SURCHI
                </h3>
                <Icons.CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              </div>
              <p className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 leading-none mt-1">
                $SURCHI
              </p>
            </div>
          </div>

          {/* Price status right: compact, balanced and matching height of the logo block */}
          <div className="h-11 flex flex-col justify-between items-end text-right">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Price
            </span>
            <div className={`text-lg sm:text-xl font-black tracking-tight font-sans leading-none ${
              themeMode === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              $0.000
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/15 text-[8px] sm:text-[9px] font-extrabold tracking-wider text-[#8b5cf6] dark:text-purple-400 uppercase leading-none">
              PRE-LAUNCH
            </span>
          </div>
        </div>

        {/* METRICS THREE-COL GRID - Ultra Compact and highly structured */}
        <div className={`p-3 rounded-xl border ${
          themeMode === 'light'
            ? 'bg-slate-50/40 border-slate-100 text-slate-800'
            : 'bg-[#030408] border-[#8b5cf6]/5 text-white'
        }`}>
          <div className="grid grid-cols-3 gap-1 divide-x divide-slate-100 dark:divide-purple-500/5">
            
            {/* Market Cap */}
            <div className="flex flex-col items-center justify-center text-center px-1">
              <span className="text-[8px] sm:text-[10px] font-medium text-slate-400 tracking-wide uppercase leading-none">
                Mkt Cap
              </span>
              <strong className={`text-[11px] sm:text-sm md:text-base font-black font-sans mt-1 leading-none ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                $0.000
              </strong>
            </div>
            
            {/* 24H Volume */}
            <div className="flex flex-col items-center justify-center text-center px-1">
              <span className="text-[8px] sm:text-[10px] font-medium text-slate-400 tracking-wide uppercase leading-none">
                24H Vol
              </span>
              <strong className={`text-[11px] sm:text-sm md:text-base font-black font-sans mt-1 leading-none ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                $0.000
              </strong>
            </div>

            {/* Liquidity */}
            <div className="flex flex-col items-center justify-center text-center px-1">
              <span className="text-[8px] sm:text-[10px] font-medium text-slate-400 tracking-wide uppercase leading-none">
                Liquidity
              </span>
              <strong className={`text-[11px] sm:text-sm md:text-base font-black font-sans mt-1 leading-none ${
                themeMode === 'light' ? 'text-slate-900' : 'text-white'
              }`}>
                $0.000
              </strong>
            </div>
          </div>
        </div>

        {/* CHART GRID GRAPHICS SECTION - Streamlined height */}
        <div className={`rounded-lg border p-3 relative h-20 flex flex-col justify-center items-center overflow-hidden ${
          themeMode === 'light'
            ? 'bg-[#fafafc] border-slate-100'
            : 'bg-[#020306] border-[#8b5cf6]/5'
        }`}>
          {/* Subtle Grid overlay lines */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="w-full h-full grid grid-cols-8 grid-rows-4">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="border-t border-l border-slate-400"></div>
              ))}
            </div>
          </div>

          {/* Dotted curves in violet */}
          <div className="absolute inset-x-0 bottom-0 top-8 select-none opacity-80 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="photoWaveGradCompact" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,70 C15,60 25,75 40,78 C55,80 70,45 85,52 C92,54 96,30 100,32 L100,100 L0,100 Z"
                fill="url(#photoWaveGradCompact)"
              />
              <path
                d="M0,70 C15,60 25,75 40,78 C55,80 70,45 85,52 C92,54 96,30 100,32"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.2"
                strokeDasharray="3 2"
                strokeLinecap="round"
              />
              <circle cx="100" cy="32" r="2" fill="#a855f7" />
              <circle cx="100" cy="32" r="4" fill="#a855f7" fillOpacity="0.2" className="animate-ping" />
            </svg>
          </div>

          {/* Text block */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-0.5">
            <div className="p-1 rounded-full bg-purple-500/10 border border-purple-500/10 flex items-center justify-center">
              <Icons.TrendingUp className="w-3 h-3 text-purple-500" />
            </div>
            <span className="text-[10px] font-extrabold tracking-wide text-purple-600 dark:text-purple-400 block font-sans">
              Awaiting Exchange Listing
            </span>
          </div>
        </div>

        {/* BOTTOM FOOTER STATUS & SOCIALS */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/50 dark:border-purple-500/5">
          
          {/* Calendar status left - tiny */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Icons.Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span className="text-[9px] font-bold text-slate-400 truncate text-left">
              Launch: <span className="text-purple-500 font-extrabold">TBA</span>
            </span>
          </div>

          {/* Perfect compact social icon directory */}
          {!hideSocials && (
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-1">
                {/* Website */}
                <a 
                  href="https://www.surchi.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-5.5 h-5.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                  title="Website Directory"
                >
                  <Icons.Globe className="w-3 h-3" />
                </a>

                {/* Twitter */}
                <a 
                  href="https://x.com/surchicoin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-5.5 h-5.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                  title="Twitter Profile"
                >
                  <Icons.Twitter className="w-3 h-3" />
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/surchiai?igsh=YXlhY2VkZ2lxam9w" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-5.5 h-5.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                  title="Instagram Channel"
                >
                  <Icons.Instagram className="w-3 h-3" />
                </a>

                {/* Discord */}
                <a 
                  href="https://discord.gg/DtFYCzCUk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-5.5 h-5.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                  title="Discord Server"
                >
                  <Icons.MessageSquare className="w-3 h-3" />
                </a>

                {/* Github */}
                <a 
                  href="https://github.com/surchiai" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-5.5 h-5.5 rounded-full bg-purple-500/10 hover:bg-[#8B5CF6] text-purple-500 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm"
                  title="Github Repository"
                >
                  <Icons.Github className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
