import { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

export default function TokenomicsDashboard() {
  const TOTAL_SUPPLY = 19897905;

  const sections = [
    {
      id: 'presale',
      label: 'Presale',
      shortLabel: 'Presale',
      percentage: 64,
      tokens: 12734659,
      color: '#00ff88', // Cyber Neon Green
      glow: 'shadow-[0_0_15px_rgba(0,255,136,0.3)]',
      gradient: 'from-[#00ff88] to-[#10b981]',
      description: 'Allocated for the upcoming decentralized launchpad event. Ensuring a widespread distribution of voting and premium access capabilities.',
      status: 'Upcoming Event',
      badgeColor: 'border-[#00ff88]/30 bg-[#00ff88]/10 text-[#00ff88]'
    },
    {
      id: 'liquidity',
      label: 'Liquidity',
      shortLabel: 'Liquidity',
      percentage: 30,
      tokens: 5969372,
      color: '#00e5ff', // Laser Cyan / Light Blue
      glow: 'shadow-[0_0_15px_rgba(0,229,255,0.3)]',
      gradient: 'from-[#00e5ff] to-[#3b82f6]',
      description: 'Locked 100% in automated pool protocols, shielding liquidity health and creating a permanent secure trading depth under strict time lock.',
      status: 'Locked & Verified',
      badgeColor: 'border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff]'
    },
    {
      id: 'dev_dex_marketing',
      label: 'Development/Dex listing/marketing& partnership',
      shortLabel: 'Dev/List/Mktg',
      percentage: 6,
      tokens: 1193874,
      color: '#ff4b82', // Hot Pink / Coral Red
      glow: 'shadow-[0_0_15px_rgba(255,75,130,0.3)]',
      gradient: 'from-[#ff4b82] to-[#ec4899]',
      description: 'Reserved exclusively for platform improvements, exchange integrations, technical audits, key developer bounties, and strategic ecosystem alliances.',
      status: 'Subject to linear vesting',
      badgeColor: 'border-[#ff4b82]/30 bg-[#ff4b82]/10 text-[#ff4b82]'
    }
  ];

  const [activeId, setActiveId] = useState<string | null>(null);

  // SVG calculations for Radius = 70. Circumference is 2 * pi * 70 = 439.8229715
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82

  // Calculating segment strokes
  let accumulatedLength = 0;

  const chartSegments = sections.map((sec) => {
    const strokeLength = (sec.percentage / 100) * circumference;
    const strokeOffset = -accumulatedLength;
    accumulatedLength += strokeLength;

    return {
      ...sec,
      strokeLength,
      strokeOffset,
    };
  });

  const activeSection = sections.find(s => s.id === activeId) || sections[0];

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      <div className="space-y-1">
        <h3 className="text-base font-black text-cyber-text font-display border-b border-cyber-border/40 pb-1.5 uppercase flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Icons.PieChart className="w-4 h-4 text-cyber-neon" />
            $SURCHI Official Tokenomics & Distribution
          </span>
          <span className="text-[10px] bg-cyber-card-light px-2.5 py-0.5 rounded font-mono border border-cyber-border normal-case text-cyber-text-muted">
            Audit Status: <span className="text-cyber-neon font-bold">100% SECURE</span>
          </span>
        </h3>
      </div>

      {/* QUICK PRE-CONGRESS METRICS STATS BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-cyber-card-light/55 border border-cyber-border/80 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">TOTAL SUPPLY PROTOCOL</div>
          <div className="text-base font-bold text-cyber-text tracking-wider">
            {TOTAL_SUPPLY.toLocaleString()} <span className="text-cyber-cyan font-mono text-xs">$SURCHI</span>
          </div>
        </div>
        <div className="p-4 bg-cyber-card-light/55 border border-cyber-border/80 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">CIRCULATING ALLOCATION</div>
          <div className="text-base font-bold text-cyber-neon tracking-wider">
            {(TOTAL_SUPPLY * 0.94).toLocaleString()}{' '}
            <span className="text-slate-400 font-mono text-[10px] normal-case">(94% Presale & LP)</span>
          </div>
        </div>
        <div className="p-4 bg-cyber-card-light/55 border border-cyber-border/80 rounded-xl space-y-1 flex flex-col justify-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">LP STABILITY HEALTH</div>
          <div className="text-sm font-black text-cyber-cyan tracking-wider flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse" />
            <span>100% TIME-LOCKED</span>
          </div>
        </div>
      </div>

      {/* CORE TOKENOMICS DIVISION CHART CHASSIS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 items-center">
        {/* INTERACTIVE DONUT VISUALIZER CONTAINER */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-cyber-card-light/35 border border-cyber-border rounded-xl min-h-[300px] relative">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3 select-none">
            Interactive telemetry diagram
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 170 170">
              {/* Backing structural track ring */}
              <circle
                cx="85"
                cy="85"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                className="stroke-cyber-border/40"
                strokeWidth="11"
              />

              {/* Dynamic segmented slices */}
              {chartSegments.map((seg, idx) => {
                const isActive = activeId === seg.id || (!activeId && idx === 0);
                return (
                  <circle
                    key={seg.id}
                    cx="85"
                    cy="85"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isActive ? "14" : "10"}
                    strokeDasharray={`${seg.strokeLength} ${circumference}`}
                    strokeDashoffset={seg.strokeOffset}
                    strokeLinecap="round"
                    className="transition-all duration-300 cursor-pointer hover:opacity-100"
                    style={{
                      opacity: activeId ? (isActive ? 1 : 0.4) : 0.9,
                    }}
                    onMouseEnter={() => setActiveId(seg.id)}
                    onMouseLeave={() => setActiveId(null)}
                  />
                );
              })}
            </svg>

            {/* HOLE INFOTIP MODULE */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-4 text-center">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">
                {(activeSection as any).shortLabel || activeSection.label}
              </span>
              <span className="text-xl font-black text-cyber-text font-display tracking-tight leading-none">
                {activeSection.percentage}%
              </span>
              <span className="text-[10px] font-mono text-cyber-cyan mt-1 border-t border-cyber-border/40 pt-1">
                {activeSection.tokens.toLocaleString()} $SURCHI
              </span>
            </div>
          </div>

          <div className="text-[9px] font-mono text-slate-500 mt-4 text-center select-none">
            ⚡ Hover over or click segments & legends below to unpack.
          </div>
        </div>

        {/* DETAILS DECK DIVISION */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex flex-col gap-3">
            {sections.map((sec) => {
              const isActive = activeId === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveId(activeId === sec.id ? null : sec.id)}
                  onMouseEnter={() => setActiveId(sec.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className={`p-4 border rounded-xl transition-all duration-300 cursor-pointer select-none space-y-2 ${
                    isActive 
                      ? 'border-cyber-cyan bg-cyber-card-light translate-x-1 shadow-[0_0_15px_rgba(0,229,255,0.05)]' 
                      : 'border-cyber-border/40 bg-cyber-card/30 hover:border-cyber-border hover:bg-cyber-card-light/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: sec.color,
                          boxShadow: `0 0 8px ${sec.color}`,
                        }}
                      />
                      <span className="text-xs font-bold text-cyber-text font-display">{sec.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-black border ${sec.badgeColor}`}
                      >
                        {sec.status}
                      </span>
                      <span className="text-xs font-black text-cyber-text-muted font-mono tracking-wide">
                        {sec.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* VESTING AND TOKENS COLLAPSIBLE CARD DETAIL */}
                  <div className="text-[11px] font-mono text-cyber-text-muted space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 py-0.5 border-b border-cyber-border/20">
                      <span>Exact Token Allotment:</span>
                      <strong className="text-cyber-text">{sec.tokens.toLocaleString()} $SURCHI</strong>
                    </div>
                    <p className="text-[10px] text-cyber-text-muted leading-relaxed font-sans pt-1">
                      {sec.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CORE PROTOCOL UTILITY SUMMARY DECK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-[11px]">
        <div className="p-4 bg-cyber-card-light/40 border border-cyber-border/60 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-[#00ff88]">
            <Icons.Key className="w-4 h-4" />
            <strong className="font-mono text-[10px] uppercase tracking-wider text-cyber-text">Access Privilege</strong>
          </div>
          <p className="text-cyber-text-muted leading-relaxed font-sans">
            Holders of $SURCHI unlock full decentralized access tiers on premium, hyper-intelligent blockchain network analysis and secure trading bots.
          </p>
        </div>
        <div className="p-4 bg-cyber-card-light/40 border border-cyber-border/60 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-cyber-cyan">
            <Icons.Activity className="w-4 h-4" />
            <strong className="font-mono text-[10px] uppercase tracking-wider text-cyber-text">Staking & Nodes</strong>
          </div>
          <p className="text-cyber-text-muted leading-relaxed font-sans">
            Stake tokens to provision computational edge nodes, yielding performance fees and driving high stress resistance validation across the network.
          </p>
        </div>
        <div className="p-4 bg-cyber-card-light/40 border border-cyber-border/60 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-[#ff4b82]">
            <Icons.Settings className="w-4 h-4" />
            <strong className="font-mono text-[10px] uppercase tracking-wider text-cyber-text">Governance voting</strong>
          </div>
          <p className="text-cyber-text-muted leading-relaxed font-sans">
            100% community-driven evolution. Presale participants form the primary decentralized consensus body to direct model upgrade sequences.
          </p>
        </div>
      </div>
    </div>
  );
}
