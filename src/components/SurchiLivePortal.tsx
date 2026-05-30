import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Bar
} from 'recharts';

interface SurchiLivePortalProps {
  onClose: () => void;
  isTokenLive: boolean;
  tokenPrice: number;
  marketCap: number;
  volume24h: number;
  themeMode?: 'dark' | 'light';
}

interface CandlePoint {
  label: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  body: [number, number];
  wick: [number, number];
}

// Replicate High-Quality Interactive Chart for unlaunched unlisted tokens
function InteractiveMarketChart({ themeMode }: { themeMode?: 'dark' | 'light' }) {
  const isLight = themeMode === 'light';
  const hours = ['24h ago', '18h ago', '12h ago', '8h ago', '4h ago', '2h ago', '1h ago', 'Live Now'];
  const dataPoints: CandlePoint[] = hours.map((hour) => ({
    label: hour,
    price: 0,
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    body: [0, 0],
    wick: [0, 0],
  }));

  const formatPriceLabel = (val: number) => {
    return `$${val.toFixed(3)}`;
  };

  const graphContainer = isLight
    ? "bg-slate-50 border border-slate-200 rounded-xl p-4 lg:p-5 text-left flex flex-col justify-between h-full space-y-3"
    : "bg-[#050512] border border-cyber-cyan/15 rounded-xl p-4 lg:p-5 text-left flex flex-col justify-between h-full space-y-3 shadow-inner";

  const graphHeaderTxt = isLight ? "text-slate-600 font-bold" : "text-slate-400";

  const graphInner = isLight
    ? "h-44 relative bg-white border border-slate-200 rounded-lg p-3 pt-6 w-full"
    : "h-44 relative bg-[#010105] border border-cyber-border/40 rounded-lg p-3 pt-6 w-full";

  const tickColor = isLight ? "#64748b" : "var(--color-cyber-text-muted)";
  const gridColor = isLight ? "#cbd5e1" : "var(--color-cyber-border)";
  const gridOpacity = isLight ? 0.6 : 0.4;
  const barColor = isLight ? "#94a3b8" : "#64748b";

  return (
    <div id="dynamic-market-graph" className={graphContainer}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icons.LineChart className={`w-4 h-4 ${isLight ? 'text-indigo-550' : 'text-slate-550'}`} />
          <span className={`text-xs font-mono font-black uppercase ${graphHeaderTxt} tracking-wider`}>
            OHLC Candlestick Feed (Not Live)
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">TOKEN LAUNCH PENDING</span>
        </div>
      </div>

      <div className={graphInner}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dataPoints} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} opacity={gridOpacity} />
            <XAxis 
              dataKey="label" 
              tick={{ fill: tickColor, fontSize: 9, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={[0, 1]}
              tick={{ fill: tickColor, fontSize: 9, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatPriceLabel(val)}
            />
            <Tooltip
              content={() => (
                <div className={isLight ? "bg-white border border-slate-200 p-2.5 rounded shadow-md text-[9.5px] font-mono text-left space-y-1 text-slate-800" : "bg-[#060616] border border-cyber-cyan/40 p-2.5 rounded shadow-xl text-[9.5px] font-mono text-left space-y-1 text-white"}>
                  <p className="text-slate-500 uppercase tracking-wider">Pre-Launch pricing</p>
                  <p className={isLight ? "text-slate-900 font-bold" : "text-white font-bold"}>Price: $0.000</p>
                </div>
              )}
            />
            <Bar dataKey="body" barSize={12} fill={barColor} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function SurchiLivePortal({
  onClose,
  themeMode = 'dark',
}: SurchiLivePortalProps) {
  const [shareCopied, setShareCopied] = useState(false);
  const isLight = themeMode === 'light';

  // State-driven theme blending variables
  const containerClasses = isLight 
    ? "bg-white border border-slate-200 text-slate-800 shadow-[0_4px_20px_rgba(15,23,42,0.05)]"
    : "bg-[#0e0e24] border border-cyber-cyan/30 text-white shadow-[0_0_20px_rgba(0,229,255,0.07)]";

  const headerBorderClass = isLight ? "border-slate-200" : "border-cyber-border/40";
  const portalLabelColor = isLight ? "text-indigo-600 font-bold" : "text-[#00e5ff]";
  const portalLabelDot = isLight ? "bg-indigo-600" : "bg-[#00e5ff]";

  const shareBtnClasses = isLight
    ? "bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-600 font-bold"
    : "bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/35 text-[#00e5ff] hover:text-white";

  const exportBtnClasses = isLight
    ? "bg-[#faf5ff] hover:bg-[#f3e8ff] border border-purple-200 text-purple-650 font-bold"
    : "bg-cyber-purple/15 hover:bg-cyber-purple/35 border border-cyber-purple/40 text-[#c084fc] hover:text-white";

  const closeBtnClasses = isLight
    ? "bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-850"
    : "bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 hover:border-rose-500 text-rose-450 hover:text-white";

  const titleColor = isLight ? "text-slate-900" : "text-white";
  const badgeClasses = isLight
    ? "bg-purple-100 text-purple-700 border border-purple-200/80"
    : "bg-[#9333ea]/15 text-[#c084fc] border border-purple-500/30";

  const statusBadgeClasses = isLight
    ? "border border-slate-300 bg-slate-100/50 text-slate-600"
    : "border border-slate-500/30 bg-transparent text-slate-500";

  const gridItemBg = isLight ? "bg-slate-50 border border-slate-200/80" : "bg-[#08081a] border border-cyber-border/40";
  const gridItemBorder30 = isLight ? "bg-slate-50 border border-slate-200/70" : "bg-[#08081a] border border-cyber-border/30";
  const gridItemBorder20 = isLight ? "bg-slate-50 border border-slate-200/60" : "bg-[#08081a] border border-cyber-border/20";

  const valCyanColor = isLight ? "text-cyan-600" : "text-cyber-cyan";
  const valAmberColor = isLight ? "text-amber-600" : "text-amber-400";
  const valNormalColor = isLight ? "text-slate-700" : "text-slate-500";
  const itemLabelColor = isLight ? "text-slate-500 block text-[8px] uppercase tracking-wider" : "text-slate-500 uppercase tracking-wider block text-[8px]";

  const safetyPanelBg = isLight ? "bg-slate-50 border border-slate-200" : "bg-[#050512] border border-cyber-cyan/15";
  const safetyPanelHeaderTxt = isLight ? "text-slate-755 font-bold" : "text-slate-200";
  const borderDivider = isLight ? "border-slate-200" : "border-cyber-border/30";

  const gaugeContainer = isLight ? "bg-white border border-slate-200 text-slate-700" : "bg-[#0d0e27]/40 border border-cyber-border/30";
  const badgeNotListed = isLight ? "bg-slate-100 border border-slate-200 text-slate-600" : "bg-[#1b1c3b] border border-[#334155]/60 text-slate-450";
  const svgCircleTrack = isLight ? "#f1f5f9" : "#141530";
  const svgCircleHighlight = isLight ? "#cbd5e1" : "#1e293b";

  const rugPullCard = isLight ? "bg-white border border-slate-200 text-slate-700 font-sans" : "bg-[#0d0e27]/20 border border-cyber-border/30 text-slate-400";
  const rugPullIconBg = isLight ? "bg-slate-100 text-slate-500" : "bg-[#0b0c1e] text-slate-400";

  // Handle Share functionality
  const handleShare = () => {
    const shareUrl = `${window.location.origin}?token=8BNoVqYr63pG9vpaCnVt3Br5DHNX8qEf4tf33TqNhrmN`;
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  // Handle Export report fallback download
  const handleExportTextReport = () => {
    const reportText = `SURCHI — SECURITY FORENSIC INTELLIGENCE\n` + 
      `==================================================\n` +
      `TOKEN: Surchi Token ($SURCHI)\n` +
      `CHAIN: SOLANA\n` +
      `SAFETY SCORE: -/100\n` +
      `CURRENT PRICE: $0.000\n` +
      `TOTAL SUPPLY: 19,897,905 SURCHI\n` +
      `==================================================\n` +
      `Disclaimer: Auto-generated by SURCHI Cryptographic Intelligence Audit.`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Surchi-Security-Report-SURCHI.txt`;
    link.click();
  };

  return (
    <div id="live-ledger-card" className={`${containerClasses} rounded-xl p-4 sm:p-5 text-left space-y-4 relative overflow-hidden animate-fade-in font-sans`}>
      
      {/* Dynamic Link Copied Notification Bubble */}
      {shareCopied && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-[#00ff88]/95 text-slate-900 border border-[#00ff88] text-[9px] font-mono font-black py-1 px-4 rounded-full shadow-[0_0_15px_rgba(0,255,136,0.35)] flex items-center gap-1 animate-bounce">
          <Icons.Check className="w-3 h-3 stroke-[3]" />
          <span>SHARE LINK COPIED!</span>
        </div>
      )}

      {/* Action Buttons Hub Header row (Download PDF, Share, and Close) */}
      <div className={`flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b ${headerBorderClass}`}>
        <div className={`flex items-center gap-1.5 font-mono text-[8px] font-bold uppercase tracking-widest ${portalLabelColor} animate-pulse`}>
          <span className={`w-1.5 h-1.5 rounded-full ${portalLabelDot}`}></span>
          <span>LIVE FORENSIC LEDGER ANALYSIS</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Share Button */}
          <button 
            onClick={handleShare}
            className={`flex items-center gap-1 px-2.5 py-1 ${shareBtnClasses} rounded text-[9px] font-mono transition-all cursor-pointer leading-none`}
            title="Share contract analysis link to clipboard"
          >
            <Icons.Share2 className="w-3.5 h-3.5" />
            <span>SHARE</span>
          </button>

          {/* Export Report */}
          <button 
            onClick={handleExportTextReport}
            className={`flex items-center gap-1 px-2.5 py-1 ${exportBtnClasses} rounded text-[9px] font-mono transition-all cursor-pointer leading-none`}
            title="Download visual security analysis report"
          >
            <Icons.FileDown className="w-3.5 h-3.5" />
            <span>EXPORT CERTIFICATE</span>
          </button>

          {/* Close Panel Button */}
          {onClose && (
            <button 
              onClick={onClose}
              className={`flex items-center justify-center p-1 ${closeBtnClasses} rounded transition-all cursor-pointer`}
              title="Close market portal"
            >
              <Icons.X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Token Identify metadata */}
        <div className="flex items-center gap-3.5">
          <img 
            src="https://raw.githubusercontent.com/surchiai/surchiai.github.io/refs/heads/main/SURCHI%20logo.jpg" 
            alt="Surchi Token" 
            referrerPolicy="no-referrer"
            className={`w-12 h-12 rounded-full border-2 ${isLight ? 'border-purple-300 bg-slate-50' : 'border-cyber-cyan/40 bg-[#040409] shadow-[0_0_10px_rgba(0,229,255,0.2)]'} object-cover shrink-0`} 
          />

          <div className="flex flex-col text-left space-y-1">
            <h2 className="flex flex-col text-left gap-1">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                SURCHI COIN
              </span>
              <span className={`text-xl font-display font-black leading-none ${titleColor}`}>
                $SURCHI
              </span>
              <span className="text-[10px] font-mono tracking-wide text-slate-500 lowercase">
                solana / raydium
              </span>
            </h2>
          </div>
        </div>

        {/* Core Quick status badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className={`px-2.5 py-0.5 rounded-full border ${statusBadgeClasses} text-[8.5px] font-mono uppercase tracking-wider font-extrabold flex items-center gap-1.5`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-slate-400' : 'bg-slate-500'} animate-pulse`}></span>
            <span>NOT LIVE YET</span>
          </div>
        </div>
      </div>

      {/* Grid of 10-column dynamic market metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1 text-left font-mono">
        
        {/* Col 1: Price */}
        <div className={`p-2.5 ${gridItemBg} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>Current Price</span>
          <strong className={`text-xs sm:text-sm block leading-none font-sans font-black ${valCyanColor}`}>
            $0.000
          </strong>
          <span className={`text-[9px] font-bold block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            PING: -
          </span>
        </div>

        {/* Col 2: Liquidity Depth */}
        <div className={`p-2.5 ${gridItemBg} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>Liquidity Depth</span>
          <strong className={`${valNormalColor} text-xs sm:text-sm block leading-none font-sans font-black`}>
            -
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8px] block uppercase truncate`}>-</span>
        </div>

        {/* Col 3: Total Token Supply */}
        <div className={`p-2.5 ${gridItemBorder30} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>Total Supply</span>
          <strong className="text-amber-500 text-xs sm:text-sm block leading-none font-sans font-black">
            19,897,905
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8px] block uppercase truncate`}>Circulating Cap</span>
        </div>

        {/* Col 4: Amount remaining in Liquidity Pool */}
        <div className={`p-2.5 ${gridItemBg} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>LP Pool Balance</span>
          <strong className={`${valNormalColor} text-xs sm:text-sm block leading-none font-sans font-black`}>
            -
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8px] font-semibold block truncate`}>
            -
          </span>
        </div>

        {/* Col 5: Buyers (24H) */}
        <div className={`p-2.5 ${gridItemBorder20} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>Buyers (24H)</span>
          <strong className={`${valNormalColor} text-xs sm:text-sm block leading-none font-sans font-black`}>
            -
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8.5px] block uppercase truncate font-semibold`}>-</span>
        </div>

        {/* Col 6: Sellers (24H) */}
        <div className={`p-2.5 ${gridItemBorder20} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>Sellers (24H)</span>
          <strong className={`${valNormalColor} text-xs sm:text-sm block leading-none font-sans font-black`}>
            -
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8.5px] block uppercase truncate font-semibold`}>-</span>
        </div>

        {/* Col 7: LP Lock Status */}
        <div className={`p-2.5 ${gridItemBg} rounded-lg space-y-1 relative group`}>
          <div className="flex items-center justify-between">
            <span className={itemLabelColor}>LP Lock Status</span>
            <Icons.Lock className={`w-3 h-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <strong className={`${valNormalColor} text-[9.5px] block leading-tight font-sans font-bold pt-0.5 uppercase tracking-tight truncate`}>
            🔒 -
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8px] block uppercase truncate`}>-</span>
        </div>

        {/* Col 8: Lock Duration / Recovery Period */}
        <div className={`p-2.5 ${gridItemBg} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>Lock Duration</span>
          <strong className={`${valNormalColor} text-xs sm:text-sm block leading-none font-sans font-black truncate`}>
            -
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8px] block uppercase truncate`}>-</span>
        </div>

        {/* Col 9: Volume */}
        <div className={`p-2.5 ${gridItemBg} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>24H Volume</span>
          <strong className={`${valNormalColor} text-xs sm:text-sm block leading-none font-sans font-black`}>
            -
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8px] block uppercase truncate`}>-</span>
        </div>

        {/* Col 10: Holders */}
        <div className={`p-2.5 ${gridItemBg} rounded-lg space-y-1`}>
          <span className={itemLabelColor}>Active Holders</span>
          <strong className={`${valNormalColor} text-xs sm:text-sm block leading-none font-sans font-black`}>
            -
          </strong>
          <span className={`${isLight ? 'text-slate-400' : 'text-slate-500'} text-[8px] block uppercase truncate`}>-</span>
        </div>

      </div>

      {/* Grid Layout containing Interactive Graph and Rug pull indicators / Safety Score */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t ${borderDivider}`}>
        
        {/* Dynamic Market Chart Component */}
        <div className="w-full">
          <InteractiveMarketChart themeMode={themeMode} />
        </div>

        {/* Safety Score Meter and Rug pull detections panel */}
        <div className={`${safetyPanelBg} rounded-xl p-4 lg:p-5 flex flex-col justify-between space-y-4`}>
          
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono font-black uppercase ${safetyPanelHeaderTxt} tracking-wider`}>CONTRACT SECURITY METEOROLOGY</span>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">FORENSIC EVALUATION</span>
          </div>

          {/* Safety Gauge Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            
            {/* Visual Gauge */}
            <div className={`flex flex-col items-center justify-center p-3 ${gaugeContainer} rounded-lg text-center relative col-span-1`}>
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold block">Safety Score</span>
              
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="transparent"
                    stroke={svgCircleTrack}
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="transparent"
                    stroke={svgCircleHighlight}
                    strokeWidth="6"
                    strokeDasharray={213.6}
                    strokeDashoffset={213.6}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-xl font-display font-black leading-none ${isLight ? 'text-slate-400' : 'text-slate-500'} font-bold`}>
                    -
                  </span>
                  <span className="text-[7px] font-mono text-slate-500 uppercase tracking-wider">/100</span>
                </div>
              </div>

              <div className={`mt-2.5 px-2 py-0.5 rounded-full ${badgeNotListed} text-center`}>
                <span className="text-[7px] font-mono font-bold uppercase tracking-tight">
                  NOT LISTED
                </span>
              </div>
            </div>

            {/* Triple Rug pull indicators layout */}
            <div className="col-span-2 space-y-2.5 font-mono text-[10px]">
              
              {/* Option 1: Mintable */}
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${rugPullCard}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${rugPullIconBg}`}>
                    <Icons.Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-500 uppercase font-extrabold leading-none mb-0.5 text-left font-sans">Asset Inflation</span>
                    <strong className="text-[10px] uppercase font-bold tracking-tight block text-left">Mintable Status</strong>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-500 text-[9px]">-</span>
                </div>
              </div>

              {/* Option 2: Blacklistable */}
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${rugPullCard}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${rugPullIconBg}`}>
                    <Icons.ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-500 uppercase font-extrabold leading-none mb-0.5 text-left font-sans">Wallet Suspension</span>
                    <strong className="text-[10px] uppercase font-bold tracking-tight block text-left">Blacklist Vector</strong>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-500 text-[9px]">-</span>
                </div>
              </div>

              {/* Option 3: Can Pause */}
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${rugPullCard}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded ${rugPullIconBg}`}>
                    <Icons.PowerOff className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-500 uppercase font-extrabold leading-none mb-0.5 text-left font-sans">Emergency Freeze</span>
                    <strong className="text-[10px] uppercase font-bold tracking-tight block text-left">Halt / Pause action</strong>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-slate-500 text-[9px]">-</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
