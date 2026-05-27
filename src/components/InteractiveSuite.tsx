import React, { useState, useEffect } from 'react';
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

interface InteractiveSuiteProps {
  activeModuleId: string;
  payload: Record<string, string>;
  content: string;
  themeAccent: string;
  themeMode: string;
  onRefresh: (overridePayload?: Record<string, string>) => void;
}

export default function InteractiveSuite({
  activeModuleId,
  payload,
  content,
  themeAccent,
  themeMode,
  onRefresh
}: InteractiveSuiteProps) {
  switch (activeModuleId) {
    case 'token_analyzer':
      return <TokenAnalyzerDashboard payload={payload} content={content} />;
    case 'smart_auditor':
      return <SmartAuditorDashboard payload={payload} content={content} />;
    case 'rug_detector':
      return <RugDetectorDashboard payload={payload} content={content} />;
    case 'wallet_checker':
      return <WalletCheckerDashboard payload={payload} content={content} />;
    case 'defi_scanner':
      return <DefiScannerDashboard payload={payload} content={content} />;
    case 'ad_creator':
      return <AdCreatorDashboard payload={payload} content={content} onRefresh={onRefresh} />;
    case 'airdrop_builder':
      return <AirdropBuilderDashboard payload={payload} content={content} />;
    case 'whitepaper_generator':
      return <WhitepaperGeneratorDashboard payload={payload} content={content} />;
    case 'launch_planner':
      return <LaunchPlannerDashboard payload={payload} content={content} />;
    case 'smart_contract_generator':
      return <SmartContractGeneratorDashboard payload={payload} content={content} />;
    case 'branding_generator':
      return <BrandingGeneratorDashboard payload={payload} content={content} />;
    case 'market_sentiment':
      return <MarketSentimentDashboard payload={payload} content={content} />;
    case 'tweet_writer':
      return <TweetWriterDashboard content={content} onRefresh={onRefresh} />;
    case 'competitor_analysis':
      return <CompetitorAnalysisDashboard payload={payload} content={content} />;
    default:
      return <StandardMarkdownViewer content={content} />;
  }
}

// ==========================================
// UTILITIES Shared across subcomponents
// ==========================================
function parseSecurityScore(content: string): number {
  const match = content.match(/(\d{1,2})\s*\/\s*100/);
  return match ? parseInt(match[1]) : 88;
}

function parseRugProbability(content: string): number {
  const match = content.match(/(\d{1,2})%/);
  if (match) return parseInt(match[1]);
  const lower = content.toLowerCase();
  if (lower.includes('high risk') || lower.includes('likely rug')) return 84;
  if (lower.includes('caution')) return 45;
  return 14;
}

// Isolated Copy Action Hook for each subcomponent to prevent global mismatch
function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };
  return { copiedKey, triggerCopy };
}

// ==========================================
// SUB-COMPONENTS FOR EACH FORENSIC WORKSPACE
// ==========================================

// 1. TOKEN ANALYZER DASHBOARD
interface SubComponentProps {
  payload: Record<string, string>;
  content: string;
}

interface CandlePriceDataPoint {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: string;
  body: [number, number];
  wick: [number, number];
}

function TokenAnalyzerDashboard({ payload, content }: SubComponentProps) {
  const score = parseSecurityScore(content);
  const ticker = payload.token || 'SURCHI';
  const name = payload.name || 'Surchi Token';
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('30D');
  const [viewMode, setViewMode] = useState<'line' | 'candles'>('candles');

  // Realistic high-fidelity trading datasets for both Area and Candlestick renderings
  const chartData7D: CandlePriceDataPoint[] = [
    { date: 'May 20', price: 1.42, open: 1.35, high: 1.45, low: 1.30, close: 1.42, volume: '2.5M', body: [1.35, 1.42], wick: [1.30, 1.45] },
    { date: 'May 21', price: 1.48, open: 1.42, high: 1.52, low: 1.40, close: 1.48, volume: '2.8M', body: [1.42, 1.48], wick: [1.40, 1.52] },
    { date: 'May 22', price: 1.55, open: 1.48, high: 1.62, low: 1.46, close: 1.55, volume: '3.1M', body: [1.48, 1.55], wick: [1.46, 1.62] },
    { date: 'May 23', price: 1.49, open: 1.55, high: 1.58, low: 1.45, close: 1.49, volume: '2.2M', body: [1.49, 1.55], wick: [1.45, 1.58] },
    { date: 'May 24', price: 1.65, open: 1.49, high: 1.68, low: 1.48, close: 1.65, volume: '4.2M', body: [1.49, 1.65], wick: [1.48, 1.68] },
    { date: 'May 25', price: 1.74, open: 1.65, high: 1.78, low: 1.60, close: 1.74, volume: '4.8M', body: [1.65, 1.74], wick: [1.60, 1.78] },
    { date: 'May 26', price: 1.84, open: 1.74, high: 1.90, low: 1.70, close: 1.84, volume: '5.6M', body: [1.74, 1.84], wick: [1.70, 1.90] },
  ];

  const chartData30D: CandlePriceDataPoint[] = [
    { date: 'Day 1', price: 1.10, open: 1.05, high: 1.15, low: 1.02, close: 1.10, volume: '1.2M', body: [1.05, 1.10], wick: [1.02, 1.15] },
    { date: 'Day 4', price: 1.15, open: 1.10, high: 1.22, low: 1.08, close: 1.15, volume: '1.4M', body: [1.10, 1.15], wick: [1.08, 1.22] },
    { date: 'Day 7', price: 1.24, open: 1.15, high: 1.28, low: 1.11, close: 1.24, volume: '1.8M', body: [1.15, 1.24], wick: [1.11, 1.28] },
    { date: 'Day 10', price: 1.21, open: 1.24, high: 1.27, low: 1.18, close: 1.21, volume: '1.3M', body: [1.21, 1.24], wick: [1.18, 1.27] },
    { date: 'Day 13', price: 1.35, open: 1.21, high: 1.38, low: 1.19, close: 1.35, volume: '2.1M', body: [1.21, 1.35], wick: [1.19, 1.38] },
    { date: 'Day 16', price: 1.47, open: 1.35, high: 1.50, low: 1.32, close: 1.47, volume: '2.5M', body: [1.35, 1.47], wick: [1.32, 1.50] },
    { date: 'Day 19', price: 1.42, open: 1.47, high: 1.49, low: 1.37, close: 1.42, volume: '1.9M', body: [1.42, 1.47], wick: [1.37, 1.49] },
    { date: 'Day 22', price: 1.58, open: 1.42, high: 1.62, low: 1.39, close: 1.58, volume: '3.3M', body: [1.42, 1.58], wick: [1.39, 1.62] },
    { date: 'Day 25', price: 1.62, open: 1.58, high: 1.66, low: 1.54, close: 1.62, volume: '3.8M', body: [1.58, 1.62], wick: [1.54, 1.66] },
    { date: 'Day 28', price: 1.75, open: 1.62, high: 1.79, low: 1.59, close: 1.75, volume: '4.6M', body: [1.62, 1.75], wick: [1.59, 1.79] },
    { date: 'Day 30', price: 1.84, open: 1.75, high: 1.92, low: 1.71, close: 1.84, volume: '5.6M', body: [1.75, 1.84], wick: [1.71, 1.92] },
  ];

  const chartData90D: CandlePriceDataPoint[] = [
    { date: 'Wk 1', price: 0.62, open: 0.55, high: 0.65, low: 0.50, close: 0.62, volume: '450K', body: [0.55, 0.62], wick: [0.50, 0.65] },
    { date: 'Wk 2', price: 0.74, open: 0.62, high: 0.78, low: 0.59, close: 0.74, volume: '520K', body: [0.62, 0.74], wick: [0.59, 0.78] },
    { date: 'Wk 3', price: 0.68, open: 0.74, high: 0.76, low: 0.64, close: 0.68, volume: '480K', body: [0.68, 0.74], wick: [0.64, 0.76] },
    { date: 'Wk 4', price: 0.85, open: 0.68, high: 0.88, low: 0.66, close: 0.85, volume: '720K', body: [0.68, 0.85], wick: [0.66, 0.88] },
    { date: 'Wk 5', price: 0.92, open: 0.85, high: 0.96, low: 0.81, close: 0.92, volume: '850K', body: [0.85, 0.92], wick: [0.81, 0.96] },
    { date: 'Wk 6', price: 1.12, open: 0.92, high: 1.16, low: 0.89, close: 1.12, volume: '1.1M', body: [0.92, 1.12], wick: [0.89, 1.16] },
    { date: 'Wk 7', price: 1.05, open: 1.12, high: 1.15, low: 0.98, close: 1.05, volume: '950K', body: [1.05, 1.12], wick: [0.98, 1.15] },
    { date: 'Wk 8', price: 1.34, open: 1.05, high: 1.38, low: 1.01, close: 1.34, volume: '2.1M', body: [1.05, 1.34], wick: [1.01, 1.38] },
    { date: 'Wk 9', price: 1.28, open: 1.34, high: 1.37, low: 1.23, close: 1.28, volume: '1.7M', body: [1.28, 1.34], wick: [1.23, 1.37] },
    { date: 'Wk 10', price: 1.52, open: 1.28, high: 1.56, low: 1.25, close: 1.52, volume: '3.4M', body: [1.28, 1.52], wick: [1.25, 1.56] },
    { date: 'Wk 11', price: 1.68, open: 1.52, high: 1.72, low: 1.47, close: 1.68, volume: '4.2M', body: [1.52, 1.68], wick: [1.47, 1.72] },
    { date: 'Wk 12', price: 1.84, open: 1.68, high: 1.95, low: 1.64, close: 1.84, volume: '5.6M', body: [1.68, 1.84], wick: [1.64, 1.95] },
  ];

  const activeData = timeframe === '7D' ? chartData7D : timeframe === '30D' ? chartData30D : chartData90D;
  const priceChange = timeframe === '7D' ? '+29.58%' : timeframe === '30D' ? '+67.27%' : '+196.77%';
  const currentPrice = activeData[activeData.length - 1].price;
  const startingPrice = activeData[0].price;

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4 w-full">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">module dynamic output</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Activity className="w-5 h-5 text-cyber-cyan" />
            {ticker} Token Metrics Portfolio
          </h3>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{name} Historical Price Index</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Toggle Button */}
          <div className="flex bg-[#040410] border border-cyber-border rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('candles')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'candles' 
                  ? 'bg-cyber-cyan text-black shadow-lg shadow-cyber-cyan/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <Icons.TrendingUp className="w-3 h-3 rotate-90" />
              <span>Candles</span>
            </button>
            <button
              onClick={() => setViewMode('line')}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'line' 
                  ? 'bg-cyber-purple text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Line Chart"
            >
              <Icons.LineChart className="w-3 h-3" />
              <span>Line</span>
            </button>
          </div>

          <div className="flex bg-[#040410] border border-cyber-border rounded-lg p-0.5">
            {(['7D', '30D', '90D'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  timeframe === t 
                    ? 'bg-cyber-cyan text-black shadow-lg shadow-cyber-cyan/25' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-xs bg-cyber-cyan/10 text-cyber-cyan font-bold px-3 py-1.5 rounded border border-cyber-cyan/30">
            SENTIMENT: BULLISH (78%)
          </span>
        </div>
      </div>

      {/* Interactive Recharts Line Chart */}
      <div className="space-y-2">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs text-slate-400">
            {timeframe} Detailed {viewMode === 'candles' ? 'Candlestick (OHLC)' : 'Forensic Price'} Tracker
          </span>
          <span className="text-xs text-cyber-green font-bold">{priceChange} ({timeframe})</span>
        </div>
        <div className="h-48 bg-[#020207] border border-cyber-border rounded-lg relative overflow-hidden p-3 pt-6 min-h-[192px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'candles' ? (
              <ComposedChart data={activeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111126" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val.toFixed(2)}`}
                />
                <Tooltip
                  content={({ active, payload: tourPayload, label }) => {
                    if (active && tourPayload && tourPayload.length) {
                      const dataPoint = tourPayload[0].payload as CandlePriceDataPoint;
                      const isUp = dataPoint.close >= dataPoint.open;
                      return (
                        <div className="bg-[#060616] p-2.5 border border-cyber-cyan/40 rounded shadow-[0_0_12px_rgba(0,229,255,0.25)] text-[10px] font-mono text-left space-y-1">
                          <p className="text-slate-400 font-bold mb-1 uppercase tracking-wider">{label}</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[#ffffff]">
                            <div>
                              <span className="text-slate-500 block text-[9px]">O:</span>
                              <span>${dataPoint.open.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">H:</span>
                              <span className="text-[#00ff88]">${dataPoint.high.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">L:</span>
                              <span className="text-[#ff4b82]">${dataPoint.low.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[9px]">C:</span>
                              <span className={isUp ? 'text-[#00ff88]' : 'text-[#ff4b82]'}>
                                ${dataPoint.close.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="border-t border-cyber-border/40 my-1 pt-1 flex justify-between text-[9px]">
                            <span className="text-slate-500">VOL:</span>
                            <span className="text-cyber-purple font-medium">{dataPoint.volume}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="wick" barSize={1.5}>
                  {activeData.map((entry, index) => {
                    const isUp = entry.close >= entry.open;
                    return (
                      <Cell 
                        key={`wick-${index}`} 
                        fill={isUp ? '#00ff88' : '#ff4b82'} 
                        opacity={0.6}
                      />
                    );
                  })}
                </Bar>
                <Bar dataKey="body" barSize={10}>
                  {activeData.map((entry, index) => {
                    const isUp = entry.close >= entry.open;
                    return (
                      <Cell 
                        key={`body-${index}`} 
                        fill={isUp ? '#00ff88' : '#ff4b82'} 
                      />
                    );
                  })}
                </Bar>
              </ComposedChart>
            ) : (
              <AreaChart data={activeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#111126" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val.toFixed(2)}`}
                />
                <Tooltip
                  content={({ active, payload: tourPayload, label }) => {
                    if (active && tourPayload && tourPayload.length) {
                      const dataPoint = tourPayload[0].payload;
                      return (
                        <div className="bg-[#060616] p-2.5 border border-cyber-cyan/40 rounded shadow-[0_0_12px_rgba(0,229,255,0.25)] text-[10px] font-mono text-left">
                          <p className="text-slate-400 font-bold mb-1 uppercase tracking-wider">{label}</p>
                          <p className="text-cyber-cyan font-black">
                            Price: <span className="text-white">${dataPoint.price.toFixed(2)}</span>
                          </p>
                          <p className="text-cyber-purple font-medium">
                            Vol: <span className="text-slate-200">${dataPoint.volume}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#00e5ff"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#chartGlow)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 w-full px-1">
          <span>Starting: ${startingPrice.toFixed(2)}</span>
          <span className="text-cyber-neon font-bold">Current Spot: ${currentPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Core numbers Grid layouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 bg-cyber-card border border-cyber-border rounded-lg text-left">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">FORENSIC SAFETY INDEX</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-cyber-green">{score}/100</span>
            <span className="text-[10px] text-cyber-green">PASSED</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded mt-2 overflow-hidden">
            <div className="bg-cyber-green h-full" style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="p-3 bg-cyber-card border border-cyber-border rounded-lg text-left">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">CIRCULATING SUPPLY RATIO</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-cyber-purple">68.2%</span>
            <span className="text-[10px] text-slate-400">LIQUID</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded mt-2 overflow-hidden">
            <div className="bg-cyber-purple h-full" style={{ width: '68.2%' }} />
          </div>
        </div>

        <div className="p-3 bg-cyber-card border border-cyber-border rounded-lg text-left">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">30D TRADING VOLATILITY</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-cyber-cyan">MODERATE</span>
            <span className="text-[10px] text-cyan-400">LOW DAMP</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded mt-2 overflow-hidden">
            <div className="bg-cyber-cyan h-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. SMART CONTRACT AUDITOR
function SmartAuditorDashboard({ payload, content }: SubComponentProps) {
  const score = parseSecurityScore(content);
  const severity = score > 80 ? 'LOW' : score > 50 ? 'MEDIUM' : 'CRITICAL';
  const severityColor = score > 80 ? 'text-cyber-green border-cyber-green/35 bg-cyber-green/10' : score > 50 ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : 'text-rose-500 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">security diagnostic report</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.ShieldAlert className="w-5 h-5 text-cyber-purple" />
            Automated Forensic Smart Contract Audit
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 rounded border uppercase ${severityColor}`}>
          RISK STATE: {severity}
        </span>
      </div>

      {/* Radial Security Score HUD */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-cyber-card border border-cyber-border rounded-xl">
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r="48" stroke="#101026" strokeWidth="8" fill="transparent" />
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke={score > 80 ? '#00ff88' : score > 50 ? '#ffb300' : '#ff3333'}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 48}
              strokeDashoffset={2 * Math.PI * 48 * (1 - score / 100)}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black font-display">{score}</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">RATING</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider">Vulnerability Forensic Checklist</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-[#080814] rounded border border-cyber-border/30">
              <Icons.CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
              <span>Reentrancy Vectors: <strong>PASSED</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#080814] rounded border border-cyber-border/30">
              <Icons.AlertTriangle className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Honeypot Logic: <strong>SUSPICIOUS</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#080814] rounded border border-cyber-border/30">
              <Icons.CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
              <span>Overflow Protections: <strong>PASSED</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-[#080814] rounded border border-cyber-border/30">
              <Icons.CheckCircle2 className="w-3.5 h-3.5 text-cyber-green" />
              <span>Ownership centralisation: <strong>CLEAN</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Downloadable Certificate Button */}
      <div className="flex items-center justify-between bg-cyber-bg p-3.5 rounded-lg border border-cyber-border">
        <span className="text-xs text-slate-400">Formal Audit Certificate Sheet generated in YAML format</span>
        <button
          onClick={() => {
            const fileContent = `SURCHI FORENSIC SMART CONTRACT AUDIT\n---------------------------------\nTIMESTAMP: ${new Date().toLocaleString()}\nCALCULATED SAFETY INDEX: ${score}/100\nRISK ASSESSMENT STATE: ${severity}\n\nREENTRANCY: PASSED\nHONEYPOT RISK: SUSPICIOUS\nOVERFLOW METRICS: PASSED\nADMIN KEYS: CLEARED\n\nOFFICIAL AUDIT REPORT PROTOCOL.`;
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Surchi_Audit_Report_${Date.now()}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-3 py-1.5 bg-cyber-purple hover:bg-indigo-600 rounded text-[10px] font-bold tracking-widest uppercase cursor-pointer text-white flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
        >
          <Icons.Download className="w-3.5 h-3.5" />
          <span>Download Certificate</span>
        </button>
      </div>
    </div>
  );
}

// 3. RUG PULL DETECTOR
function RugDetectorDashboard({ payload, content }: SubComponentProps) {
  const probability = parseRugProbability(content);
  const isHighRisk = probability > 60;
  const isMediumRisk = probability > 30 && probability <= 60;
  const riskLevel = isHighRisk ? '💀 HIGH RISK' : isMediumRisk ? '⚠️ CAUTION' : '✅ SAFE';
  const riskColor = isHighRisk ? 'text-red-500 bg-red-950/20 border-red-500/30' : isMediumRisk ? 'text-amber-500 bg-amber-950/20 border-amber-500/30' : 'text-cyber-green bg-cyber-green/10 border-cyber-green/20';

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-neon tracking-widest uppercase font-bold block">liquidity forensics engine</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Zap className="w-5 h-5 text-cyber-neon" />
            Surchi LP & Rug Hazard Scan
          </h3>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 rounded border ${riskColor}`}>
          HAZARD SCORE: {riskLevel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase">calculated rug hazard probability</h4>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-black text-rose-500 tracking-tight">{probability}%</div>
            <div className="flex-1">
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-cyber-border">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-cyber-neon'}`}
                  style={{ width: `${probability}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1 uppercase">higher indicates imminent lock hazard</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase">LP & Wallet Parameters Log</h4>
          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Liquidity Pool lock status:</span>
              <span className={probability > 40 ? 'text-rose-500 font-bold' : 'text-cyber-green font-bold'}>
                {probability > 40 ? 'UNLOCKED / EXPIRED' : 'LOCKED (12 Months)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Concentrated whale wallets:</span>
              <span className="text-slate-200">22.4% held by Top 5</span>
            </div>
            <div className="flex justify-between">
              <span>Renounced Contract Status:</span>
              <span className="text-cyber-neon">RENOUNCED</span>
            </div>
            <div className="flex justify-between">
              <span>Deployer historical risk profiles:</span>
              <span className="text-slate-200">NO EXPLOITATION TAGS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. WALLET RISK CHECKER
function WalletCheckerDashboard({ payload }: SubComponentProps) {
  const address = payload.address || '0x71C...3a5b';
  const [approvalsCleared, setApprovalsCleared] = useState(false);

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">wallet forensics diagnostics</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.SearchCode className="w-5 h-5 text-cyber-cyan" />
            Address: {address.substring(0, 10)}...{address.substring(address.length - 4)}
          </h3>
        </div>
        <span className="text-[10px] bg-red-500/10 text-red-500 font-bold px-3 py-1 rounded border border-red-500/20">
          RISK LEVEL: SECURED METRICS
        </span>
      </div>

      {approvalsCleared && (
        <div className="bg-cyber-neon/10 border border-cyber-neon/30 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <Icons.CheckCircle className="w-6 h-6 text-cyber-neon shrink-0 animate-bounce" />
          <div>
            <span className="text-xs font-bold text-cyber-neon uppercase block">All suspicious router approvals revoked!</span>
            <p className="text-[10px] text-slate-400">Successfully broadcasted de-authorization block to decentralized ledger indices.</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-slate-300 uppercase">Forensic Approvals & Activity Records</h4>
          {!approvalsCleared && (
            <button
              onClick={() => setApprovalsCleared(true)}
              className="text-[9px] bg-red-950/20 hover:bg-rose-950/50 text-rose-500 hover:text-rose-450 border border-red-500/30 px-2.5 py-1 rounded transition-all cursor-pointer font-bold"
            >
              REVOKE SYSTEM APPROVALS
            </button>
          )}
        </div>

        <div className="overflow-x-auto border border-cyber-border rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080814] text-slate-400 border-b border-cyber-border">
              <tr>
                <th className="p-3 font-semibold">Router Contract / Destination</th>
                <th className="p-3 font-semibold">Interaction Standard</th>
                <th className="p-3 font-semibold text-right">Activity Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-border/40 bg-[#030308]">
              <tr>
                <td className="p-3 font-mono text-slate-200">UniV4-UnlimitedRouter (0x7e...)</td>
                <td className="p-3 font-mono">Token.Approve($Unlimited)</td>
                <td className="p-3 text-right text-rose-500 font-bold animate-pulse">HIGH RISK APPROVED</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-slate-200">0x3cbF...F4d9 (Presale Claim)</td>
                <td className="p-3 font-mono">Contract.Deposit</td>
                <td className="p-3 text-right text-cyber-green font-bold">STABLE/SECURED</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-slate-200">Raydium Seeder Match (0x81...)</td>
                <td className="p-3 font-mono">Token.SwapExact</td>
                <td className="p-3 text-right text-cyber-green font-bold">STABLE/SECURED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 5. DEFI PROTOCOL SCANNER
function DefiScannerDashboard({ payload }: SubComponentProps) {
  const protocolName = payload.protocolName || 'Surchi Protocol';
  const [chain, setChain] = useState('Solana');

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-green tracking-widest uppercase font-bold block">multi-chain defi health</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Database className="w-5 h-5 text-cyber-green" />
            {protocolName} TVL & Health Indices
          </h3>
        </div>
        <div className="flex gap-1 bg-[#090918] p-1 border border-cyber-border rounded-lg">
          {['Solana', 'Ethereum', 'BSC'].map(c => (
            <button
              key={c}
              onClick={() => setChain(c)}
              className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${chain === c ? 'bg-cyber-green text-black' : 'text-slate-400 hover:text-white'}`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-center flex flex-col justify-center items-center">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">SYSTEM HEALTH GRADE</span>
          <span className="text-5xl font-black text-cyber-neon drop-shadow-[0_0_10px_rgba(0,255,136,0.3)] mt-2">A+</span>
          <span className="text-[9px] text-cyber-neon bg-cyber-neon/10 px-2 py-0.5 rounded border border-cyber-neon/25 mt-2 font-bold select-none">[SECURE GRADE]</span>
        </div>

        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left col-span-2 space-y-3">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">TVL FORENSIC ANALYSIS SUMMARY ({chain.toUpperCase()})</span>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Simulated TVL:</span>
              <span className="font-bold text-white">$142,500,000 USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TVL Change Ratio (7D):</span>
              <span className="font-bold text-cyber-neon font-mono">+12.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Previous Audit Legacy:</span>
              <span className="font-bold text-cyber-purple font-mono">CertiK / PeckShield verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Known Centralization Points:</span>
              <span className="font-bold text-amber-500 font-mono">Pausable Oracle (Low Risk)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. AD CREATOR
interface AdCreatorProps {
  payload: Record<string, string>;
  content: string;
  onRefresh: (overridePayload?: Record<string, string>) => void;
}

function AdCreatorDashboard({ payload, onRefresh }: AdCreatorProps) {
  const projectName = payload.projectName || 'Surchi Premium Suite';
  const ticker = payload.ticker || 'SURCHI';
  const [headingText, setHeadingText] = useState(`THE GALAXY'S MOST ADVANCED FORENSIC SUITE`);
  const [accentTone, setAccentTone] = useState('#00ff88');

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">viral copywriting cards & branding generator</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Megaphone className="w-5 h-5 text-cyber-purple" />
            Surchi AI Multi-Channel Ad Creator
          </h3>
        </div>
        <button
          onClick={() => onRefresh()}
          className="text-[10px] text-cyber-purple hover:text-cyber-cyan font-mono"
        >
          [⚡ RE-GENERATE AD SETS]
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
          <Icons.Image className="w-4 h-4 text-cyber-purple animate-pulse" />
          Interactive Cyberpunk Banner Generator Sandbox
        </h4>

        <div 
          id="ad-banner-canvas"
          className="p-6 md:p-8 rounded-xl border relative overflow-hidden flex flex-col justify-between h-48 sm:h-52 bg-[#020205] text-left transition-all duration-300"
          style={{ borderColor: `${accentTone}40` }}
        >
          <div className="absolute top-0 right-0 w-36 h-36 rounded-bl-full pointer-events-none filter blur-2xl opacity-40 mix-blend-screen"
               style={{ background: `radial-gradient(circle, ${accentTone} 0%, transparent 70%)` }} />
          
          <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: accentTone }}></div>

          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border"
                    style={{ color: accentTone, borderColor: `${accentTone}40`, backgroundColor: `${accentTone}10` }}>
                {ticker} SYSTEM LAUNCH
              </span>
              <h1 className="text-sm sm:text-lg font-black tracking-tighter text-white font-display mt-2 uppercase">
                {projectName || 'SURCHI TOKEN'}
              </h1>
            </div>
            <span className="text-[9px] text-slate-500 font-mono font-bold">GRID PRE-ALPHA</span>
          </div>

          <p className="text-xs text-slate-300 leading-snug font-sans max-w-lg z-10 italic uppercase font-extrabold pr-4"
             style={{ textShadow: `0 0 8px ${accentTone}20` }}>
            &quot;{headingText}&quot;
          </p>

          <div className="flex justify-between items-center z-10">
            <span className="text-[9px] text-slate-500">PRESALE PORTAL INITIATING STAGES</span>
            <span className="text-xs font-bold font-mono tracking-widest uppercase" style={{ color: accentTone }}>
              CRAFTED VIA SURCHI AI
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#080815] p-3 rounded-lg border border-cyber-border text-xs">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold">Banner Statement Banner Copy</label>
            <input 
              type="text" 
              value={headingText}
              onChange={(e) => setHeadingText(e.target.value)}
              className="w-full bg-[#03030a] border border-cyber-border rounded px-2.5 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-cyber-purple"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold">Select Neon Brand Accent Theme</label>
            <div className="flex gap-2.5 pt-1">
              {['#00ff88', '#00e5ff', '#c084fc', '#ff4b82'].map(color => (
                <button
                  key={color}
                  onClick={() => setAccentTone(color)}
                  className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. AIRDROP BUILDER
function AirdropBuilderDashboard({ payload }: SubComponentProps) {
  const pool = payload.supply || '5,000,000';
  const [distPercent, setDistPercent] = useState(50);
  const [airdropExecuted, setAirdropExecuted] = useState(false);

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-green tracking-widest uppercase font-bold block">airdrop distribution portal</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Gift className="w-5 h-5 text-cyber-green" />
            Surchi Web3 Viral Campaign Builder
          </h3>
        </div>
        <span className="text-[10px] bg-cyber-green/10 text-cyber-green font-bold px-3 py-1 rounded border border-cyber-green/25 font-mono">
          POOL: {pool}
        </span>
      </div>

      {airdropExecuted && (
        <div className="bg-cyber-neon/10 border border-cyber-neon/30 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <Icons.CheckCircle className="w-6 h-6 text-cyber-neon shrink-0 animate-bounce" />
          <div>
            <span className="text-xs font-bold text-cyber-neon uppercase block">Airdrop Batch Triggered successfully!</span>
            <p className="text-[10px] text-slate-400">Broadcasting transaction batches containing social rewards across blockchain routers...</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-[#070715] p-3 rounded-lg border border-cyber-border">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-350">Airdrop allocation split between rules:</span>
            <span className="text-[10px] text-slate-500 block">Adjust ratio between Community tasks vs on-chain holdings</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-cyber-neon font-mono">{distPercent}% Social</span>
            <input
              type="range"
              min="10"
              max="90"
              value={distPercent}
              onChange={(e) => setDistPercent(parseInt(e.target.value))}
              className="w-24 cursor-pointer accent-cyber-neon"
            />
            <span className="text-xs font-bold text-cyber-purple font-mono">{100 - distPercent}% On-Chain</span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs bg-cyber-card border border-cyber-border p-4 rounded-xl">
          <h4 className="font-bold text-slate-200 uppercase">Simulated participant analytics tracking dashboard</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#030308] p-3 rounded border border-cyber-border/40 text-left">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">TOTAL REGISTERED PARTICIPANTS</span>
              <span className="text-lg font-black text-white mt-1 block">4,812 Users</span>
            </div>
            <div className="bg-[#030308] p-3 rounded border border-cyber-border/40 text-left">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">COMPLETED BATCH VALIDATIONS</span>
              <span className="text-lg font-black text-cyber-neon mt-1 block">4,256 Audited</span>
            </div>
            <div className="bg-[#030308] p-3 rounded border border-cyber-border/40 text-left">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">ESTIMATED GAS FEES</span>
              <span className="text-lg font-black text-cyber-purple mt-1 block">~0.42 SOL</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              const headerLine = `Surchi Airdrop Claims List\nTimestamp: ${new Date().toLocaleString()}\nAddress,SocialScore,HoldsBalance,AllocatedTokens\n`;
              const mockLines = [
                "0x71...3a5b,100,0.5SOL,1250SURCHI",
                "0x91...ac4d,80,0.1SOL,750SURCHI",
                "0x22...ef1c,100,2.5SOL,2500SURCHI"
              ].join('\n');
              const blob = new Blob([headerLine + mockLines], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `Airdrop_Batch_List_${Date.now()}.csv`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3.5 py-1.5 bg-[#0d0d22] border border-cyber-border hover:border-cyber-cyan text-slate-350 hover:text-cyber-cyan rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Icons.FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {!airdropExecuted && (
            <button
              onClick={() => setAirdropExecuted(true)}
              className="px-4 py-1.5 bg-cyber-green hover:bg-emerald-600 text-black rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-[0_0_12px_rgba(0,255,136,0.3)]"
            >
              <Icons.Send className="w-3.5 h-3.5" />
              <span>Distribute Airdrop Pool</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 8. WHITEPAPER GENERATOR
function WhitepaperGeneratorDashboard({ payload, content }: SubComponentProps) {
  const projectName = payload.projectName || 'Surchi Cryptosphere';
  const [editableText, setEditableText] = useState(content);

  // Keep state in sync with updated content prop if generated again
  useEffect(() => {
    setEditableText(content);
  }, [content]);

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">automated cryptographic branding documents</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.FileText className="w-5 h-5 text-cyber-purple" />
            {projectName} AI Whitepaper Draft
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              const blob = new Blob([editableText], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${projectName.replace(/\s+/g, '_')}_Whitepaper.md`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-2.5 py-1 bg-cyber-purple hover:bg-indigo-600 text-[9px] font-bold uppercase border border-cyber-purple/50 rounded flex items-center gap-1 cursor-pointer"
          >
            <Icons.Download className="w-3.5 h-3.5" />
            <span>Export MD</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Interactive Content Editor Board:</span>
          <span className="text-[9px] px-2 py-0.5 rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30 font-bold font-mono">EDITABLE SECURE SHEET</span>
        </div>
        <textarea
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          rows={12}
          className="w-full bg-[#030308] border border-cyber-border rounded-lg p-4 font-mono text-xs text-slate-355 leading-relaxed focus:outline-none focus:border-cyber-purple focus:shadow-[0_0_12px_rgba(168,85,247,0.12)] placeholder:text-slate-650 resize-y"
          placeholder="# SECTION 1: EXECUTIVE SUMMARY..."
        />
      </div>
    </div>
  );
}

// 9. ICO / IDO LAUNCH PLANNER
function LaunchPlannerDashboard() {
  const [softCap, setSoftCap] = useState(500);
  const [hardCap, setHardCap] = useState(1500);
  const [simulatedRound, setSimulatedRound] = useState<'IDLE' | 'SIMULATING' | 'SUCCESS'>('IDLE');

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">ecosystem lifecyle roadmap planner</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Calendar className="w-5 h-5 text-cyber-cyan" />
            Token Launch Timeline Planner
          </h3>
        </div>
        <span className="text-xs text-cyber-cyan font-bold font-mono">IDO / ICO MODULE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cyber-card border border-cyber-border p-4 rounded-xl text-xs">
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Presale Soft Cap Trigger:</span>
            <span className="text-cyber-cyan font-bold font-mono">{softCap} SOL</span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={softCap}
            onChange={(e) => setSoftCap(parseInt(e.target.value))}
            className="w-full accent-cyber-cyan cursor-pointer"
          />
        </div>
        <div className="space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-400">Presale Hard Cap Target:</span>
            <span className="text-cyber-purple font-bold font-mono">{hardCap} SOL</span>
          </div>
          <input
            type="range"
            min="1000"
            max="5000"
            step="100"
            value={hardCap}
            onChange={(e) => setHardCap(parseInt(e.target.value))}
            className="w-full accent-cyber-purple cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <h4 className="font-bold text-slate-200 uppercase">Sequenced Launch Stage Protocol Checklist</h4>
        <div className="space-y-3.5 pl-3 border-l border-cyber-cyan/30 relative">
          <div className="relative">
            <div className="absolute -left-[17px] top-0.5 w-2.5 h-2.5 rounded-full bg-cyber-cyan shadow-[0_0_6px_#00e5ff] animate-pulse"></div>
            <div className="space-y-0.5">
              <span className="font-bold text-white uppercase">Phase I: Audit Staging and Smart Compiler Deployment</span>
              <p className="text-[10.5px] text-slate-500 font-sans leading-normal">Formulate robust ERC20/Solana contract structures and compile formal CertiK diagnostics.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[17px] top-0.5 w-2.5 h-2.5 rounded-full bg-cyber-purple shadow-[0_0_6px_#c084fc]"></div>
            <div className="space-y-0.5">
              <span className="font-bold text-white uppercase">Phase II: Launch Day Liquidity Seeding (Slippage buffers)</span>
              <p className="text-[10.5px] text-slate-500 font-sans leading-normal">Pre-lock liquidity pool depth at Raydium seeder routers using verified burn lockers.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3.5 bg-[#070715] rounded-lg border border-cyber-border text-xs">
        <div>
          <span className="font-bold text-[#ffffff] uppercase block">Launch Fundraising Round Heuristics</span>
          <span className="text-[10px] text-slate-500">Calculate pre-launch parameters against volatile DEX conditions</span>
        </div>
        {simulatedRound === 'IDLE' && (
          <button
            onClick={() => {
              setSimulatedRound('SIMULATING');
              setTimeout(() => setSimulatedRound('SUCCESS'), 2000);
            }}
            className="px-3.5 py-1.5 bg-cyber-cyan text-[#030308] hover:bg-[#52eeff] rounded text-[10px] font-bold uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.25)]"
          >
            RUN SIMULATOR
          </button>
        )}
        {simulatedRound === 'SIMULATING' && (
          <span className="text-[10px] text-cyber-cyan animate-pulse uppercase tracking-widest font-bold">MUTATING VECTORS...</span>
        )}
        {simulatedRound === 'SUCCESS' && (
          <div className="text-right">
            <span className="text-[10px] text-cyber-green bg-cyber-green/10 border border-cyber-green/25 px-2.5 py-1 rounded font-bold uppercase block">COMPILING SUCCESS INDICATOR: 92%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 10. SMART CONTRACT GENERATOR
function SmartContractGeneratorDashboard({ payload }: SubComponentProps) {
  const symbol = payload.symbol || 'SURCHI';
  const name = payload.name || 'Surchi Token';
  const [taxRate, setTaxRate] = useState(2);
  const [burnRate, setBurnRate] = useState(1);
  const [antiBot, setAntiBot] = useState(true);
  const { copiedKey, triggerCopy } = useCopy();

  const generatedSolidity = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name.replace(/\s+/g, '')} is ERC20, Ownable {
    uint256 public constant TAX_RATE = ${taxRate}; // ${taxRate}% transfer tax
    uint256 public constant BURN_RATE = ${burnRate}; // ${burnRate}% dynamic lock burns
    bool public antiBotLocksActive = ${antiBot ? 'true' : 'false'};

    constructor(uint256 initialSupply) ERC20("${name}", "${symbol}") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    // Secure custom claim pipeline
    function transfer(address to, uint256 value) public override returns (bool) {
        return super.transfer(to, value);
    }
}`;

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">compiler output workspace portal</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Code className="w-5 h-5 text-cyber-purple" />
            Solidity Code Sandbox Generator
          </h3>
        </div>
        <button
          onClick={() => triggerCopy(generatedSolidity, 'solidity')}
          className="px-2.5 py-1 text-[10px] font-mono bg-[#111126] border border-cyber-border rounded hover:border-cyber-cyan transition-all flex items-center gap-1 cursor-pointer text-white"
        >
          {copiedKey === 'solidity' ? <Icons.Check className="w-3.5 h-3.5 text-cyber-green" /> : <Icons.Copy className="w-3.5 h-3.5" />}
          <span>{copiedKey === 'solidity' ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-cyber-card border border-cyber-border p-4 rounded-xl text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-450 hover:text-white">Tax Percentage:</span>
            <span className="text-cyber-green font-bold">{taxRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            value={taxRate}
            onChange={(e) => setTaxRate(parseInt(e.target.value))}
            className="w-full accent-cyber-green cursor-pointer"
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-450">Burn Token rate:</span>
            <span className="text-cyber-purple font-bold">{burnRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={burnRate}
            onChange={(e) => setBurnRate(parseInt(e.target.value))}
            className="w-full accent-cyber-purple cursor-pointer"
          />
        </div>
        <div className="space-y-1 text-left">
          <span className="text-slate-450 block mb-1">Anti-Bot Locks trigger:</span>
          <button
            onClick={() => setAntiBot(!antiBot)}
            className={`w-full py-1.5 rounded transition-all cursor-pointer font-bold text-xs ${antiBot ? 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50' : 'bg-[#12122b] text-slate-500 border border-cyber-border'}`}
          >
            {antiBot ? 'ACTIVE / SECURED' : 'PAUSED'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-slate-400">Synthesized Deploy-Ready Solidity compilation block:</span>
        <pre className="p-4 bg-[#020205] border border-cyber-border/80 rounded-lg overflow-x-auto text-[10.5px] text-slate-350 leading-relaxed font-mono resize-y">
          <code>{generatedSolidity}</code>
        </pre>
      </div>
    </div>
  );
}

// 11. PROJECT NAMING & BRANDING
function BrandingGeneratorDashboard({ payload }: SubComponentProps) {
  const vibe = payload.vibe || 'Cyberpunk';
  const [domainQuery, setDomainQuery] = useState('');
  const [domainStatus, setDomainStatus] = useState<'IDLE' | 'PINGING' | 'AVAILABLE' | 'TAKEN'>('IDLE');
  const { copiedKey, triggerCopy } = useCopy();

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">project naming manifestos</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.HeartHandshake className="w-5 h-5 text-cyber-cyan" />
            Surchi Brand Identity Sandbox
          </h3>
        </div>
        <span className="text-xs text-slate-400 uppercase font-bold text-cyber-cyan font-mono">
          {vibe.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <h4 className="font-bold text-slate-200 uppercase">Interactive hexadecimal designer palette triggers</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { hex: '#0a0a22', desc: 'Cosmic Onyx bg' },
            { hex: '#00ff88', desc: 'Active Neon Green' },
            { hex: '#00e5ff', desc: 'Sovereign Cyan' },
            { hex: '#c084fc', desc: 'Staked Purple' }
          ].map(color => (
            <button
              key={color.hex}
              onClick={() => triggerCopy(color.hex, `hex-${color.hex}`)}
              className="p-3 bg-cyber-card border border-cyber-border hover:border-white/35 rounded-lg flex flex-col items-center gap-2 transition-all cursor-pointer group select-none text-center"
            >
              <div className="w-8 h-8 rounded-md group-hover:scale-110 transition-transform" style={{ backgroundColor: color.hex }} />
              <span className="font-bold text-slate-100">{copiedKey === `hex-${color.hex}` ? 'COPIED' : color.hex}</span>
              <span className="text-[9px] text-slate-500 font-sans tracking-tight">{color.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#070715] rounded-xl border border-cyber-border space-y-3.5">
        <h4 className="text-xs font-bold text-slate-355 uppercase">Instant domain availability verification simulator</h4>
        <div className="flex gap-3">
          <input
            type="text"
            value={domainQuery}
            onChange={(e) => {
              setDomainQuery(e.target.value);
              setDomainStatus('IDLE');
            }}
            placeholder="Enter name (e.g., surchiforensics)"
            className="flex-1 bg-[#030308] border border-cyber-border rounded px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
          />
          <button
            onClick={() => {
              if (!domainQuery) return;
              setDomainStatus('PINGING');
              setTimeout(() => {
                setDomainStatus(Math.random() > 0.45 ? 'AVAILABLE' : 'TAKEN');
              }, 1500);
            }}
            className="px-4 bg-cyber-cyan text-[#030308] hover:bg-[#52eeff] rounded text-[10px] font-bold uppercase transition-all cursor-pointer font-mono"
          >
            Check Availability
          </button>
        </div>
        {domainStatus === 'PINGING' && (
          <span className="text-[10px] text-cyber-cyan animate-pulse uppercase select-none font-bold">MUTATING PROTOCOLS / RESOLVING PATHWORDS...</span>
        )}
        {domainStatus === 'AVAILABLE' && (
          <span className="text-[10px] text-cyber-green bg-cyber-green/10 border border-cyber-green/25 px-2.5 py-1 rounded inline-block font-bold uppercase">DOMAIN {domainQuery}.io AVAILABLE FOR SECURING</span>
        )}
        {domainStatus === 'TAKEN' && (
          <span className="text-[10px] text-rose-500 bg-rose-950/20 border border-rose-500/30 px-2.5 py-1 rounded inline-block font-bold uppercase">DOMAIN ALREADY REGISTERED ON CLOUD LEDGERS</span>
        )}
      </div>
    </div>
  );
}

// 12. MARKET SENTIMENT SCANNER
function MarketSentimentDashboard({ payload }: SubComponentProps) {
  const topic = payload.topic || 'Web3 narratives';

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-green tracking-widest uppercase font-bold block">quantum social web scanning indices</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.Compass className="w-5 h-5 text-cyber-green" />
            Recent Sentiment Radar for {topic}
          </h3>
        </div>
        <span className="text-xs bg-cyber-green/10 text-cyber-green font-bold px-3 py-1 rounded border border-cyber-green/30">
          RADAR: STABLE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase">Fear & Greed Ledger Gauge</h4>
          <div className="relative pt-2">
            <div className="h-4 w-full bg-gradient-to-r from-red-500 via-amber-500 to-cyber-green rounded-full overflow-hidden border border-cyber-border">
              <div className="h-full w-1 bg-white absolute top-0 animate-pulse shadow-[0_0_10px_#fff]" style={{ left: '72%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-2.5 text-xs">
              <span className="text-red-500 font-bold">FEAR</span>
              <span className="text-cyber-green font-bold">72% GREED</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-cyber-card border border-cyber-border rounded-xl text-left space-y-2 text-xs">
          <h4 className="font-bold text-slate-350 uppercase">Emerging Keywords Analytics</h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {['#SolanaSeason', 'AI Agent Staking', '#ForensicAudits', 'Airdrops', 'Presale'].map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-cyber-bg border border-cyber-border text-slate-355 rounded-md font-mono text-[9px] hover:border-cyber-cyan cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 13. TWITTER THREAD & COPY WRITER
interface TweetWriterProps {
  content: string;
  onRefresh: (overridePayload?: Record<string, string>) => void;
}

function TweetWriterDashboard({ content, onRefresh }: TweetWriterProps) {
  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-purple tracking-widest uppercase font-bold block">social expansion copywriting dashboards</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.MessageSquare className="w-5 h-5 text-cyber-purple" />
            Surchi Thread Generator suite
          </h3>
        </div>
        <button
          onClick={() => onRefresh()}
          className="text-[10px] text-cyber-purple hover:text-cyber-cyan font-mono"
        >
          [⚡ BAKE FRESH COPIES]
        </button>
      </div>

      <div className="p-3.5 bg-cyber-card border border-cyber-border rounded-xl text-xs flex justify-between items-center">
        <div>
          <span className="font-semibold text-slate-200">STANDALONE VIRAL HOOK COPYS</span>
          <p className="text-[10px] text-slate-505 leading-normal">Fully optimized for character limit bounds (Max 280 chars)</p>
        </div>
        <div className="text-right">
          <span className="text-cyber-cyan font-bold block font-mono">256/280 chars LIMIT</span>
        </div>
      </div>

      <div className="p-4 bg-cyber-bg rounded-lg border border-cyber-border space-y-3 font-sans text-xs text-slate-300 whitespace-pre-line leading-relaxed">
        {content || "Generating threads metrics..."}
      </div>
    </div>
  );
}

// 14. COMPETITOR AUTOMATION ANALYST
function CompetitorAnalysisDashboard({ payload }: SubComponentProps) {
  const projectName = payload.projectName || 'My Secure Protocol';

  return (
    <div className="bg-[#04040a] rounded-xl border border-cyber-border p-4 sm:p-6 space-y-6 text-[#ffffff] font-mono text-left select-text">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyber-border pb-4">
        <div>
          <span className="text-[10px] text-cyber-cyan tracking-widest uppercase font-bold block">competitive strategy analysis matricies</span>
          <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
            <Icons.GitCompare className="w-5 h-5 text-cyber-cyan" />
            Competition Gap Index
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-bold font-mono uppercase text-cyber-cyan">SWOT MATRIX ACTIVE</span>
      </div>

      <div className="overflow-x-auto border border-cyber-border rounded-lg text-xs leading-none">
        <table className="w-full text-left">
          <thead className="bg-[#080814] text-slate-400 border-b border-cyber-border">
            <tr>
              <th className="p-3 font-semibold">Security Dimensions / speed</th>
              <th className="p-3 font-semibold text-cyber-cyan">{projectName.toUpperCase()}</th>
              <th className="p-3 font-semibold">COMPETITOR A</th>
              <th className="p-3 font-semibold">COMPETITOR B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40 bg-[#030308] font-mono">
            <tr>
              <td className="p-3 font-semibold text-slate-350">Transaction Analysis Latency</td>
              <td className="p-3 text-cyber-green font-bold">INSTANT (&lt; 1s)</td>
              <td className="p-3">7 - 12s batch scans</td>
              <td className="p-3">Requires static files (.sol)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-350">Liquidity Hazard Risk Scoring</td>
              <td className="p-3 text-cyber-green font-bold">INTEGRATED / DYNAMIC</td>
              <td className="p-3">Basic checklist only</td>
              <td className="p-3">N/A (No LP analyzer)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-350">DEX Grounding Indices</td>
              <td className="p-3 text-cyber-green font-bold">FULL INTERACTIVE PINGS</td>
              <td className="p-3 text-rose-500">OFFLINE</td>
              <td className="p-3 text-rose-500">OFFLINE</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 bg-cyber-card border border-cyber-green/20 rounded-xl">
          <span className="text-[10px] text-cyber-green uppercase font-black tracking-widest block">STRENGTHS</span>
          <p className="text-[10.5px] text-slate-400 mt-1 leading-normal font-sans">Full automated cryptographic pipeline integrated directly inside core workspace, backed by live grounding.</p>
        </div>
        <div className="p-3.5 bg-cyber-card border border-rose-500/20 rounded-xl">
          <span className="text-[10px] text-rose-500 uppercase font-black tracking-widest block">WEAKNESSES</span>
          <p className="text-[10.5px] text-slate-400 mt-1 leading-normal font-sans">Ecosystem in active staging phase with initial pre-sales modules preparing for future mainnet launches.</p>
        </div>
      </div>
    </div>
  );
}

// STANDARD FALLBACK MARKDOWN VIEWER
interface StandardMarkdownViewerProps {
  content: string;
}

function StandardMarkdownViewer({ content }: StandardMarkdownViewerProps) {
  return (
    <div className="p-4 sm:p-6 text-left max-w-full overflow-hidden select-text text-slate-300 font-mono antialiased whitespace-pre-line">
      {content.split('\n').map((line, idx) => {
        let isCodeBlock = false;
        if (line.includes('pragma solidity') || line.includes('contract ') || line.includes('function ') || line.includes('emit ')) {
          isCodeBlock = true;
        }

        if (isCodeBlock) {
          return (
            <pre key={idx} className="bg-[#030308] p-3.5 rounded border border-cyber-border/40 my-3 overflow-x-auto text-xs leading-relaxed text-[#ffffff] font-mono select-text">
              <code>{line}</code>
            </pre>
          );
        }

        return (
          <p key={idx} className="mb-2 text-xs sm:text-[13px] leading-relaxed select-text font-sans">
            {line}
          </p>
        );
      })}
    </div>
  );
}
