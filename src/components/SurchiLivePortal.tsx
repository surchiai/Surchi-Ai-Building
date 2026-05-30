import { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Bar,
  Cell
} from 'recharts';

interface SurchiLivePortalProps {
  onClose: () => void;
  isTokenLive: boolean; // From SurchiTokenMetrics
  tokenPrice: number;
  marketCap: number;
  volume24h: number;
  themeMode?: 'dark' | 'light';
}

interface Transaction {
  id: string;
  signature: string;
  time: string;
  type: 'BUY' | 'SELL';
  amountSurchi: number;
  amountUsd: number;
  price: number;
}

export default function SurchiLivePortal({
  onClose,
  isTokenLive: initialIsLive,
  tokenPrice: initialPrice,
  marketCap: initialMcap,
  volume24h: initialVolume,
  themeMode = 'dark',
}: SurchiLivePortalProps) {
  // Config states
  const [isLiveMode, setIsLiveMode] = useState(initialIsLive);
  const [simulateLive, setSimulateLive] = useState(false); // Standby by default if not live on mainnet, perfectly matching the price panel

  // Price tracking states
  const [livePrice, setLivePrice] = useState(initialPrice > 0 ? initialPrice : 0.0425);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [chartView, setChartView] = useState<'candles' | 'line'>('candles');

  // Synchronize state dynamically if parent props modify or load
  useEffect(() => {
    setIsLiveMode(initialIsLive);
    if (initialIsLive) {
      if (initialPrice > 0) {
        setLivePrice(initialPrice);
      }
    }
  }, [initialIsLive, initialPrice]);

  const isEcosystemLive = isLiveMode || simulateLive;

  // Stats derived from price
  const baseMcap = initialMcap > 0 ? initialMcap : 42500000;
  const currentMcap = isLiveMode && initialMcap > 0 
    ? (livePrice / (initialPrice || 1)) * initialMcap 
    : (livePrice / 0.0425) * baseMcap;
  const currentVolume = isLiveMode && initialVolume > 0 
    ? initialVolume 
    : (simulateLive ? 2410500 : 0);

  // Transactions ledger list state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const transactionIdRef = useRef(1);

  // Solscan verification state tab
  const [contractTab, setContractTab] = useState<'code' | 'read' | 'events'>('code');

  // Generate initial price history for the chart
  useEffect(() => {
    if (!isEcosystemLive) return;

    const points = [];
    let startVal = livePrice * 0.85;
    for (let i = 0; i < 15; i++) {
      const step = i / 14;
      const noise = Math.sin(step * Math.PI * 3) * (livePrice * 0.05) + (Math.random() - 0.45) * (livePrice * 0.02);
      const closeVal = startVal + (livePrice - startVal) * step + noise;
      const openVal = i === 0 ? startVal * 0.98 : points[i - 1].close;
      const highVal = Math.max(openVal, closeVal) * (1 + Math.random() * 0.015);
      const lowVal = Math.min(openVal, closeVal) * (1 - Math.random() * 0.015);
      
      points.push({
        label: `${15 - i}h ago`,
        open: openVal,
        close: closeVal,
        high: highVal,
        low: lowVal,
        price: closeVal,
        body: [Math.min(openVal, closeVal), Math.max(openVal, closeVal)],
        wick: [lowVal, highVal],
      });
    }
    setPriceHistory(points);

    // Initial rolling buys and sells transactions
    const initialTx: Transaction[] = [];
    for (let i = 0; i < 8; i++) {
      const isBuy = Math.random() > 0.4;
      const amountUsd = Math.floor(250 + Math.random() * 4500);
      const amountSurchi = amountUsd / livePrice;
      const sig = generateMockSig();
      initialTx.push({
        id: `tx-${transactionIdRef.current++}`,
        signature: sig,
        time: `${Math.floor(i * 1.5 + 1)}m ago`,
        type: isBuy ? 'BUY' : 'SELL',
        amountSurchi,
        amountUsd,
        price: livePrice * (1 + (Math.random() - 0.5) * 0.01),
      });
    }
    setTransactions(initialTx);
  }, [isEcosystemLive, initialPrice]);

  // Helper mock signature generator
  const generateMockSig = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    let sig = '';
    for (let i = 0; i < 8; i++) {
      sig += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${sig}...${chars.charAt(Math.floor(Math.random() * chars.length))}${chars.charAt(Math.floor(Math.random() * chars.length))}`;
  };

  // Live ticker fluctuation simulator
  useEffect(() => {
    if (!simulateLive && !isLiveMode) return;

    const interval = setInterval(() => {
      // Walk float fluctuation (-0.35% to +0.42%)
      const percentage = (Math.random() - 0.45) * 0.008;
      const change = livePrice * percentage;
      const nextPrice = livePrice + change;

      setPriceFlash(percentage >= 0 ? 'up' : 'down');
      setLivePrice(nextPrice);

      // Add a buy/sell transaction
      const isBuyAction = Math.random() > 0.42;
      const usdSize = Math.floor(100 + Math.random() * 6500);
      const surchiAmount = usdSize / nextPrice;
      const signature = generateMockSig();

      setTransactions((prev) => [
        {
          id: `tx-${transactionIdRef.current++}`,
          signature,
          time: 'Just Now',
          type: isBuyAction ? 'BUY' : 'SELL',
          amountSurchi: surchiAmount,
          amountUsd: usdSize,
          price: nextPrice,
        },
        ...prev.map((t) => {
          if (t.time === 'Just Now') return { ...t, time: '3s ago' };
          if (t.time === '3s ago') return { ...t, time: '12s ago' };
          if (t.time === '12s ago') return { ...t, time: '28s ago' };
          if (t.time === '28s ago') return { ...t, time: '1m ago' };
          if (t.time.endsWith('m ago')) {
            const mins = parseInt(t.time) || 1;
            return { ...t, time: `${mins + 1}m ago` };
          }
          return t;
        }),
      ].slice(0, 10));

      // Append chart node
      setPriceHistory((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0) {
          const activeNode = { ...updated[lastIndex] };
          activeNode.close = nextPrice;
          activeNode.high = Math.max(activeNode.high, nextPrice);
          activeNode.low = Math.min(activeNode.low, nextPrice);
          activeNode.body = [Math.min(activeNode.open, nextPrice), Math.max(activeNode.open, nextPrice)];
          activeNode.wick = [activeNode.low, activeNode.high];
          updated[lastIndex] = activeNode;
        }
        return updated;
      });

      // Clear flash glow
      const flashTimeout = setTimeout(() => {
        setPriceFlash(null);
      }, 900);

      return () => clearTimeout(flashTimeout);
    }, 4000);

    return () => clearInterval(interval);
  }, [livePrice, simulateLive, isLiveMode]);

  const maxChartPrice = Math.max(...priceHistory.map((h) => h.high || h.price)) * 1.01;
  const minChartPrice = Math.min(...priceHistory.map((h) => h.low || h.price)) * 0.99;

  // Format Helper
  const formatCompactUSD = (val: number) => {
    if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const formatPrice = (p: number) => {
    if (p === 0) return '$0.000';
    if (p < 0.0001) return `$${p.toFixed(8)}`;
    if (p < 0.01) return `$${p.toFixed(6)}`;
    return `$${p.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  };

  return (
    <div id="surchi-live-separate-page" className="w-full text-left space-y-6 pb-20 animate-fade-in select-none">
      
      {/* HEADER SECTION WITH NAVIGATION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyber-cyan/15 pb-4">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyber-cyan/8 border border-cyber-cyan/25 text-cyber-cyan text-[9px] font-mono font-bold uppercase tracking-wider">
            <span className="relative flex h-1.5 w-1.5">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75 ${isEcosystemLive ? 'animate-ping' : ''}`}></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-cyan"></span>
            </span>
            <span>$SURCHI ECOLOGICAL TELEMETRY FEED</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-cyber-text uppercase tracking-tight flex items-center gap-2">
            <Icons.MonitorUp className="w-7 h-7 text-cyber-cyan animate-pulse" />
            Live Market Portal
          </h1>
        </div>

        {/* Back navigation button and Simulation control */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Simulation Toggle Switch */}
          {!initialIsLive && (
            <div className="flex items-center gap-2 bg-cyber-card-light border border-cyber-border px-3 py-1.5 rounded-xl font-mono">
              <span className="text-[10px] text-cyber-text-muted font-bold uppercase tracking-wider">Testnet Simulation:</span>
              <button
                onClick={() => setSimulateLive(!simulateLive)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${simulateLive ? 'bg-cyber-cyan' : 'bg-slate-300 dark:bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white dark:bg-black transition-transform ${simulateLive ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-[9px] font-black ${simulateLive ? 'text-cyber-cyan' : 'text-cyber-text-muted'}`}>
                {simulateLive ? 'RUNNING' : 'STANDBY'}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyber-card border border-cyber-cyan/30 hover:border-cyber-cyan text-cyber-cyan hover:text-white hover:bg-cyber-card-light rounded-xl text-xs font-mono font-black tracking-widest uppercase transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.05)] cursor-pointer"
          >
            <Icons.ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Terminal</span>
          </button>
        </div>
      </div>

      {!isEcosystemLive ? (
        /* TOKEN NOT LISTED / PENDING LAUNCH INTERFACE SCREEN */
        <div className="border border-cyber-cyan/15 bg-cyber-card rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyber-cyan/5 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="p-4 bg-cyber-card-light/40 border border-cyber-cyan/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-cyber-cyan">
            <Icons.Layers className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-display font-black text-cyber-text uppercase tracking-wider">
              $SURCHI Awaiting DEX Listing
            </h3>
            <p className="text-cyber-text-muted font-sans text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              The token is currently pending smart contract mainnet deployment and Raydium pool initialization. This telemetry screen will automatically populate live charts, buyers, and liquidity pegs as soon as the launch block is written.
            </p>
          </div>

          {/* Glowing timeline highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="border border-cyber-cyan/10 bg-cyber-card-light p-3 rounded-xl space-y-1">
              <span className="text-[8px] font-mono text-cyber-text-muted block uppercase">Step 1</span>
              <span className="text-[10px] font-mono font-black text-cyber-cyan block uppercase">Audit Complete</span>
              <span className="text-[8.5px] font-sans text-cyber-text-muted block p-0.5 leading-none bg-emerald-500/10 text-emerald-400 dark:text-emerald-400 rounded-sm">100% SECURE</span>
            </div>
            <div className="border border-cyber-cyan/10 bg-cyber-card-light p-3 rounded-xl space-y-1">
              <span className="text-[8px] font-mono text-cyber-text-muted block uppercase">Step 2</span>
              <span className="text-[10px] font-mono font-black text-cyber-cyan block uppercase">Presale Phase</span>
              <span className="text-[8.5px] font-sans text-cyber-text-muted block p-0.5 leading-none bg-cyber-cyan/10 text-cyber-cyan rounded-sm">ACTIVE CAP</span>
            </div>
            <div className="border border-cyber-cyan/10 bg-cyber-card-light p-3 rounded-xl space-y-1">
              <span className="text-[8px] font-mono text-cyber-text-muted block uppercase">Step 3</span>
              <span className="text-[10px] font-mono font-black text-cyber-cyan block uppercase">Raydium Launch</span>
              <span className="text-[8.5px] font-sans text-cyber-text-muted block p-0.5 leading-none bg-cyber-card text-cyber-text-muted rounded-sm">PENDING POOL</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setSimulateLive(true)}
              className="px-6 py-2.5 bg-cyber-cyan text-black hover:bg-white font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              Simulate Live Portal (Sandbox Mode)
            </button>
          </div>
        </div>
      ) : (
        /* MASTER FULLY INTERACTIVE LIVE TRADING ENVIRONMENT PAGE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: LIVE TICKER CARDS, MAIN GRAPH, TRADER HISTORY LEDGER (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">

            {/* LIVE PRICE BANNER CARD WITH GLOW FLASHLIGHTS */}
            <div className={`border rounded-2xl p-4 lg:p-5 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 ${
              priceFlash === 'up'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : priceFlash === 'down'
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-cyber-card border-cyber-cyan/20'
            }`}>
              <div className="space-y-1.5 text-left">
                <span className="text-[8px] font-mono font-black text-cyber-text-muted uppercase tracking-widest block leading-none select-none">
                  $SURCHI SPOT RATE
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className={`text-2xl sm:text-3xl font-mono font-black tracking-tight leading-none transition-all ${
                    priceFlash === 'up' ? 'text-emerald-550 dark:text-emerald-400 scale-[1.01]' : priceFlash === 'down' ? 'text-rose-600 dark:text-rose-450 scale-[0.995]' : 'text-cyber-text'
                  }`}>
                    {formatPrice(livePrice)}
                  </span>
                  <span className={`text-xs font-mono font-black tracking-wider flex items-center gap-0.5 ${
                    priceFlash === 'up' ? 'text-emerald-600 dark:text-emerald-400 animate-bounce' : 'text-rose-600 dark:text-rose-450'
                  }`}>
                    {priceFlash === 'up' ? '▲' : '▼'}{' '}
                    {((livePrice - 0.0425) / 0.0425 * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* DYNAMIC VALUE AND PEGGED STATS GRID */}
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                {/* LP Value Pegged */}
                <div className="space-y-1 text-left">
                  <span className="text-[7.5px] font-mono font-bold text-cyber-text-muted uppercase tracking-wider block leading-none">
                    PEGGED RESERVES
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Icons.Link2 className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-cyber-text">
                      {(livePrice / 108.5).toFixed(6)} SOL
                    </span>
                  </div>
                </div>

                {/* 24h Trading Volume */}
                <div className="space-y-1 text-left font-mono">
                  <span className="text-[7.5px] font-mono font-bold text-cyber-text-muted uppercase tracking-wider block leading-none">
                    24H TRADE VOLUME
                  </span>
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-[#00ff88]">
                    {formatCompactUSD(currentVolume)}
                  </div>
                </div>

                {/* Simulated LP Pool Address */}
                <div className="space-y-1 text-left font-mono">
                  <span className="text-[7.5px] font-mono font-bold text-cyber-text-muted uppercase tracking-wider block leading-none">
                    LIQUIDITY PAIR
                  </span>
                  <div className="px-2 py-0.5 bg-cyber-card-light border border-cyber-cyan/15 rounded text-[9.5px] text-cyber-cyan font-semibold block uppercase">
                    Raydium SOL/SRCH LP
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CHART PANEL CANVASES */}
            <div className="bg-cyber-card border border-cyber-cyan/15 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyber-cyan/10 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Icons.BarChart2 className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-xs font-mono font-black uppercase text-cyber-text tracking-wider">
                    RESONANCE GRID ANALYTICS (15H PERIODS)
                  </span>
                </div>

                {/* View togglers */}
                <div className="flex gap-1 bg-cyber-card-light p-0.5 border border-cyber-cyan/10 rounded-lg">
                  <button
                    onClick={() => setChartView('candles')}
                    className={`px-2.5 py-1 text-[9.5px] font-mono font-black tracking-wider uppercase rounded-md cursor-pointer ${
                      chartView === 'candles' ? 'bg-cyber-cyan text-black' : 'text-cyber-text-muted hover:text-cyber-text'
                    }`}
                  >
                    Candlesticks
                  </button>
                  <button
                    onClick={() => setChartView('line')}
                    className={`px-2.5 py-1 text-[9.5px] font-mono font-black tracking-wider uppercase rounded-md cursor-pointer ${
                      chartView === 'line' ? 'bg-cyber-purple text-white' : 'text-cyber-text-muted hover:text-cyber-text'
                    }`}
                  >
                    Direct Line
                  </button>
                </div>
              </div>

              {/* Core responsive graph canvas */}
              <div className="h-56 relative w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === 'candles' ? (
                    <ComposedChart data={priceHistory} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.08)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fill: 'var(--color-cyber-text-muted)', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                      <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--color-cyber-text-muted)', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const point = payload[0].payload;
                            return (
                              <div className="bg-cyber-card border border-cyber-cyan/35 p-2 rounded text-[10px] font-mono text-left space-y-1 shadow-2xl">
                                <span className="text-cyber-text-muted font-bold block uppercase">{point.label}</span>
                                <div className="grid grid-cols-2 gap-x-2 text-cyber-text">
                                  <div>OPEN: <span className="font-bold text-cyber-text-muted">${point.open.toFixed(4)}</span></div>
                                  <div>CLOSE: <span className="font-bold text-cyber-cyan">${point.close.toFixed(4)}</span></div>
                                  <div>HIGH: <span className="font-bold text-emerald-550 dark:text-[#00ff88]">${point.high.toFixed(4)}</span></div>
                                  <div>LOW: <span className="font-bold text-rose-600 dark:text-[#ff4b82]">${point.low.toFixed(4)}</span></div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="wick" barSize={1.2}>
                        {priceHistory.map((entry, index) => (
                          <Cell key={`wick-${index}`} fill={entry.close >= entry.open ? (themeMode === 'light' ? '#16a34a' : '#00ff88') : (themeMode === 'light' ? '#dc2626' : '#ff4b82')} />
                        ))}
                      </Bar>
                      <Bar dataKey="body" barSize={11}>
                        {priceHistory.map((entry, index) => (
                          <Cell key={`body-${index}`} fill={entry.close >= entry.open ? (themeMode === 'light' ? '#16a34a' : '#00ff88') : (themeMode === 'light' ? '#dc2626' : '#ff4b82')} />
                        ))}
                      </Bar>
                    </ComposedChart>
                  ) : (
                    <AreaChart data={priceHistory} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="liveAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 229, 255, 0.05)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fill: 'var(--color-cyber-text-muted)', fontSize: 9, fontFamily: 'monospace' }} />
                      <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--color-cyber-text-muted)', fontSize: 9, fontFamily: 'monospace' }} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-cyber-card border border-cyber-cyan/30 p-2 rounded text-[10px] text-cyber-text font-mono">
                                <div>Price: <span className="text-cyber-cyan font-bold">${payload[0].value.toFixed(4)}</span></div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="price" stroke="#00e5ff" strokeWidth={2.5} fill="url(#liveAreaGrad)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Chart Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-cyber-card-light p-2.5 border border-cyber-cyan/10 rounded-lg text-center font-mono text-[10px]">
                <div className="space-y-0.5">
                  <span className="text-cyber-text-muted block uppercase">RESONANCE PEAK</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">${maxChartPrice.toFixed(4)}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-cyber-text-muted block uppercase">RESONANCE BASE</span>
                  <span className="text-rose-600 dark:text-rose-450 font-extrabold">${minChartPrice.toFixed(4)}</span>
                </div>
                <div className="space-y-0.5 col-span-2 sm:col-span-2 text-right flex items-center justify-end px-2 text-cyber-cyan text-[8.5px] uppercase font-bold tracking-wider gap-1.5">
                  <Icons.Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>RAYDIUM LIQUIDITY DATASTREAM ACTIVE</span>
                </div>
              </div>
            </div>

            {/* LIVE BUYERS AND SELLERS TRANSACTION LEDGER LIST */}
            <div className="bg-cyber-card border border-cyber-cyan/15 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl text-left">
              <div className="flex items-center justify-between border-b border-cyber-cyan/10 pb-2.5 flex-wrap gap-2">
                <div className="flex items-center gap-1.5 font-mono">
                  <Icons.Workflow className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-xs font-black uppercase text-cyber-text tracking-wider">
                    On-Chain Realtime Trading Ledger (Buyers & Sellers)
                  </span>
                </div>
                <span className="text-[8.5px] font-mono text-cyber-text-muted uppercase tracking-widest animate-pulse">
                  Streaming blocks in sandbox node
                </span>
              </div>

              {/* Transaction elements table list */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-cyber-cyan/10 text-cyber-text-muted uppercase text-[9px]">
                      <th className="pb-2">Time</th>
                      <th className="pb-2 text-left">Tx hash</th>
                      <th className="pb-2 text-center">Type</th>
                      <th className="pb-2 text-right">Price</th>
                      <th className="pb-2 text-right">Amount ($SRCH)</th>
                      <th className="pb-2 text-right">Size (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-cyan/5">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-cyber-cyan/3 transition-colors">
                        <td className="py-2.5 text-cyber-text-muted">{tx.time}</td>
                        <td className="py-2.5 font-semibold text-cyber-cyan/80">{tx.signature}</td>
                        <td className="py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-black tracking-wide leading-none select-none ${
                            tx.type === 'BUY'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/20'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-semibold text-cyber-text">
                          ${tx.price.toFixed(4)}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-cyber-text-muted">
                          {Math.floor(tx.amountSurchi).toLocaleString()}
                        </td>
                        <td className="py-2.5 text-right font-extrabold text-[#00ff88]">
                          ${tx.amountUsd.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: VALUE CARD, HOLDERS CAP, SUPPLY SLIDERS, CONTRACT VERIFIER (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">

            {/* TOTAL AND CIRCULATORY SUPPLY DATA */}
            <div className="bg-cyber-card border border-cyber-cyan/15 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-cyber-cyan/10 pb-2">
                <Icons.Layers className="w-4 h-4 text-cyber-purple" />
                <span className="text-xs font-mono font-black uppercase text-cyber-text tracking-wider">
                  Supply distribution & locks
                </span>
              </div>

              <div className="space-y-4">
                {/* Total Supply Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyber-text-muted">Total minted supply</span>
                    <span className="text-cyber-text font-bold">1,000,000,000 SRCH</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-900 rounded overflow-hidden">
                    <div className="h-full bg-cyber-purple w-full"></div>
                  </div>
                </div>

                {/* Burns / Circulating progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyber-text-muted">Ecosystem lock ratio</span>
                    <span className="text-emerald-600 dark:text-[#00ff88] font-bold">40.0% Burned</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-900 rounded overflow-hidden">
                    <div className="h-full bg-emerald-500 dark:bg-[#00ff88]" style={{ width: '40%' }}></div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyber-cyan/5 py-1">
                    <span className="text-cyber-text-muted">Circulating supply:</span>
                    <span className="text-cyber-text font-bold">600,000,000 SRCH</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyber-cyan/5 py-1">
                    <span className="text-cyber-text-muted">Raydium liquidity pool allocation:</span>
                    <span className="text-cyber-text font-bold">400,000,000 SRCH</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono border-b border-cyber-cyan/5 py-1">
                    <span className="text-cyber-text-muted">Staking pool vestings:</span>
                    <span className="text-cyber-text font-bold">150,000,000 SRCH</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono py-1">
                    <span className="text-cyber-text-muted">Total Burned allocation:</span>
                    <span className="text-[#ff4b82] font-semibold">400,000,000 ($SRCH)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECURE HOLDERS DATA LEDGER */}
            <div className="bg-cyber-card border border-cyber-cyan/15 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl">
              <div className="flex items-center gap-1.5 border-b border-cyber-cyan/10 pb-2">
                <Icons.Users className="w-4 h-4 text-cyber-cyan" />
                <span className="text-xs font-mono font-black uppercase text-cyber-text tracking-wider">
                  Top token holder registry
                </span>
              </div>

              {/* Holder registry display rows */}
              <div className="space-y-2 font-mono text-xs">
                
                <div className="p-2 bg-cyber-card-light border border-cyber-cyan/10 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <div className="text-[10.5px] font-bold text-cyber-text flex items-center gap-1 flex-wrap">
                      <span>🥞 Raydium LP Genesis</span>
                      <span className="text-[7px] bg-emerald-555/10 dark:bg-[#00ff88]/10 text-emerald-600 dark:text-[#00ff88] px-1 rounded uppercase font-black">Contract LP</span>
                    </div>
                    <span className="text-[8.5px] text-cyber-text-muted uppercase">surchi...lp4a8e</span>
                  </div>
                  <span className="text-right text-emerald-600 dark:text-[#00ff88] font-bold">40.0%</span>
                </div>

                <div className="p-2 bg-cyber-card-light border border-cyber-cyan/10 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <div className="text-[10.5px] font-bold text-cyber-text flex items-center gap-1 flex-wrap">
                      <span>👤 Developer Multi-sig</span>
                      <span className="text-[7px] bg-cyber-purple/10 text-cyber-purple px-1 rounded uppercase font-black">Vested Lock</span>
                    </div>
                    <span className="text-[8.5px] text-cyber-text-muted uppercase">surchi...dv0a11</span>
                  </div>
                  <span className="text-right text-cyber-cyan font-bold">15.0%</span>
                </div>

                <div className="p-2 bg-cyber-card-light border border-cyber-cyan/10 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <div className="text-[10.5px] font-bold text-cyber-text flex items-center gap-1 flex-wrap">
                      <span>🏦 Staking validation reserve</span>
                      <span className="text-[7px] bg-cyber-cyan/10 text-cyber-cyan px-1 rounded uppercase font-black">Ecosystem</span>
                    </div>
                    <span className="text-[8.5px] text-cyber-text-muted uppercase">surchi...st7722</span>
                  </div>
                  <span className="text-right text-cyber-text font-black">15.0%</span>
                </div>

                <div className="p-2 bg-cyber-card-light border border-cyber-cyan/10 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <div className="text-[10.5px] font-bold text-cyber-text flex items-center gap-1 flex-wrap">
                      <span>🐳 verified passive holder</span>
                      <span className="text-[7px] bg-cyber-card text-cyber-text-muted px-1 rounded uppercase font-bold">Whale</span>
                    </div>
                    <span className="text-[8.5px] text-cyber-text-muted uppercase">7g9Xj...K9s2a1</span>
                  </div>
                  <span className="text-right text-cyber-text-muted">2.41%</span>
                </div>

                <div className="p-2 bg-cyber-card-light border border-cyber-cyan/10 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <div className="text-[10.5px] font-bold text-cyber-text flex items-center gap-1 flex-wrap">
                      <span>🐳 verified passive holder</span>
                      <span className="text-[7px] bg-cyber-card text-cyber-text-muted px-1 rounded uppercase font-bold">Whale</span>
                    </div>
                    <span className="text-[8.5px] text-cyber-text-muted uppercase">D8aHj...9bX2j8</span>
                  </div>
                  <span className="text-right text-cyber-text-muted">1.82%</span>
                </div>

              </div>
            </div>

            {/* TOKEN CONTRACT BYTE EXPLORER */}
            <div className="bg-cyber-card border border-cyber-cyan/15 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-cyber-cyan/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <Icons.Cpu className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-xs font-mono font-black uppercase text-cyber-text tracking-wider">
                    Contract explorer audit
                  </span>
                </div>
                {/* Secured badge */}
                <div className="flex items-center gap-1">
                  <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00ff88]" />
                  <span className="text-[8px] font-mono text-emerald-600 dark:text-[#00ff88] font-black uppercase">Verified</span>
                </div>
              </div>

              {/* Sub tabs inside Explorer info */}
              <div className="flex gap-1 border-b border-cyber-cyan/5 pb-2">
                <button
                  onClick={() => setContractTab('code')}
                  className={`flex-1 py-1 text-[9.5px] font-mono uppercase tracking-wider font-extrabold rounded cursor-pointer ${
                    contractTab === 'code' ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20' : 'text-cyber-text-muted'
                  }`}
                >
                  bytecode
                </button>
                <button
                  onClick={() => setContractTab('read')}
                  className={`flex-1 py-1 text-[9.5px] font-mono uppercase tracking-wider font-extrabold rounded cursor-pointer ${
                    contractTab === 'read' ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20' : 'text-cyber-text-muted'
                  }`}
                >
                  read functions
                </button>
                <button
                  onClick={() => setContractTab('events')}
                  className={`flex-1 py-1 text-[9.5px] font-mono uppercase tracking-wider font-extrabold rounded cursor-pointer ${
                    contractTab === 'events' ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20' : 'text-cyber-text-muted'
                  }`}
                >
                  provenance logs
                </button>
              </div>

              {/* Code viewer display block */}
              {contractTab === 'code' && (
                <div className="space-y-3">
                  <div className="p-2.5 bg-cyber-card-light rounded-lg border border-cyber-border text-[9.5px] font-mono text-cyber-text-muted font-bold max-h-40 overflow-y-auto space-y-2">
                    <p className="text-emerald-600 dark:text-[#00ff88]">// @surchi-verified solidity code</p>
                    <p>contract SurchiToken is ERC20, Ownable {"{"}</p>
                    <p className="pl-3 text-cyber-cyan">uint255 public constant MAX_SUPPLY = 1000000000 * 10**18;</p>
                    <p className="pl-3">constructor() ERC20("Surchi Token", "SRCH") {"{"}</p>
                    <p className="pl-6 text-[#9a4bfe]">_mint(msg.sender, MAX_SUPPLY);</p>
                    <p className="pl-6 text-cyber-text-muted">_renounceOwnership();</p>
                    <p className="pl-3">{"}"}</p>
                    <p>{"}"}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="https://solscan.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 bg-cyber-card-light hover:bg-cyber-card border border-cyber-cyan/20 rounded-md text-center text-[9px] font-mono font-black text-cyber-cyan uppercase tracking-wider block"
                    >
                      Inspect via Solscan
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('8BNoVqYr63pG9vpaCnVt3Br5DHNX8qEf4tf33TqNhrmN');
                        alert('Address successfully saved to secure clipboard.');
                      }}
                      className="px-3 bg-cyber-card-light hover:bg-cyber-card border border-cyber-cyan/15 rounded-md text-cyber-text-muted font-mono text-[9px] uppercase tracking-wider cursor-pointer"
                    >
                      Copy Address
                    </button>
                  </div>
                </div>
              )}

              {/* Read functions display tabs */}
              {contractTab === 'read' && (
                <div className="space-y-2 font-mono text-[10.5px]">
                  <div className="flex items-center justify-between border-b border-cyber-cyan/5 py-1 text-cyber-text-muted">
                    <span>1. decimals()</span>
                    <span className="text-cyber-text font-bold">18</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-cyber-cyan/5 py-1 text-cyber-text-muted">
                    <span>2. name()</span>
                    <span className="text-cyber-text font-bold">Surchi Token</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-cyber-cyan/5 py-1 text-cyber-text-muted">
                    <span>3. symbol()</span>
                    <span className="text-cyber-text font-bold">SURCHI</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-cyber-cyan/5 py-1 text-cyber-text-muted">
                    <span>4. owner()</span>
                    <span className="text-rose-600 dark:text-rose-450 font-black">0x000...000 (Renounced)</span>
                  </div>
                </div>
              )}

              {/* Logs */}
              {contractTab === 'events' && (
                <div className="space-y-2 font-mono text-[9.5px] max-h-36 overflow-y-auto">
                  <div className="border border-cyber-border/40 p-1.5 rounded bg-cyber-card-light space-y-0.5">
                    <span className="text-[7.5px] text-cyber-text-muted block">BLOCK #245100a</span>
                    <span className="text-emerald-600 dark:text-[#00ff88] font-bold block">🔥 LP GENESIS BURN VERIFIED</span>
                    <span className="text-cyber-text-muted block p-0.5 bg-emerald-500/10 rounded-sm leading-tight text-[8px]">
                      400,000,000 $SRCH transfer executed to null contract addresses.
                    </span>
                  </div>
                  <div className="border border-cyber-border/40 p-1.5 rounded bg-cyber-card-light space-y-0.5">
                    <span className="text-[7.5px] text-cyber-text-muted block">BLOCK #245099b</span>
                    <span className="text-cyber-cyan font-bold block">🚀 VESTED CLIFF ALLOCATION INC</span>
                    <span className="text-cyber-text-muted block p-0.5 bg-cyber-cyan/10 rounded-sm leading-tight text-[8px]">
                      150,000,000 $SRCH locked securely inside cold multisig lock boxes.
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
