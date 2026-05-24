import React from 'react';
import * as Icons from 'lucide-react';

interface PartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnershipModal({ isOpen, onClose }: PartnershipModalProps) {
  if (!isOpen) return null;

  const currentPartners = [
    {
      name: 'PinkSale.finance',
      url: 'https://www.pinksale.finance',
      description: 'The premium protocol launchpad hosting decentralized token distribution and verified liquidity locks.',
      badge: 'Launchpad Host',
      iconTheme: '#ff4b82',
      logo: (
        <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#14020a" stroke="#ff4b82" strokeWidth="2" />
          <path d="M35 70L50 25L65 70H57L50 45L43 70H35Z" fill="#ff4b82" />
          <circle cx="50" cy="38" r="4" fill="#ffffff" />
          <path d="M47 52H53V65H47V52Z" fill="#ff4b82" />
          <path d="M30 50C30 38.9543 38.9543 30 50 30" stroke="#ff4b82" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'dexview.com',
      url: 'https://www.dexview.com',
      description: 'Ultra-fast decentralized market charting, live security statistics, and transaction ledger stream telemetry.',
      badge: 'Data Oracle',
      iconTheme: '#00e5ff',
      logo: (
        <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#020d14" stroke="#00e5ff" strokeWidth="2" />
          <path d="M30 65L45 40L55 52L70 30" stroke="#00e5ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="70" cy="30" r="4" fill="#00ff88" />
          <circle cx="45" cy="40" r="3" fill="#00e5ff" />
          <circle cx="55" cy="52" r="3" fill="#00e5ff" />
          <path d="M25 75H75" stroke="#1d3b4a" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      name: 'Raydium.io',
      url: 'https://raydium.io',
      description: 'The supreme decentralized automated market maker providing infinite trading depths and liquidity pool tools.',
      badge: 'Primary DEX Pool',
      iconTheme: '#00ff88',
      logo: (
        <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#02140a" stroke="#00ff88" strokeWidth="2" />
          <path d="M35 30L65 50L35 70V30Z" fill="#00ff88" opacity="0.8" />
          <path d="M45 40L65 50L45 60V40Z" fill="#ffffff" />
          <circle cx="65" cy="50" r="5" fill="#00ff88" className="animate-pulse" />
          <path d="M35 30H45M35 70H45" stroke="#00ff88" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: 'cryptopanic.com',
      url: 'https://cryptopanic.com',
      description: 'The supreme crypto news aggregator offering immediate sentiment signals, breaking alerts, and deep market impact tracking.',
      badge: 'News Aggregator',
      iconTheme: '#ec4899',
      logo: (
        <svg className="w-10 h-10 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#140210" stroke="#ec4899" strokeWidth="2" />
          <path d="M50 25V55" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="70" r="5" fill="#ec4899" />
          <path d="M32 65C37 55 44 53 50 53C56 53 63 55 68 65" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>
      )
    }
  ];

  const futurePartners = [
    {
      name: 'Binance',
      url: 'https://www.binance.com?utm_source=chatgpt.com',
      note: 'Targeted listing for Tier-1 global liquidity matching.',
      logo: (
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 20L32 38L50 56L68 38L50 20Z" fill="#F3BA2F" />
          <path d="M50 56L32 38L18 52L50 84L82 52L68 38L50 56Z" fill="#F3BA2F" opacity="0.6" />
          <path d="M18 52L32 38L14 20L0 34L18 52Z" fill="#F3BA2F" />
          <path d="M82 52L68 38L86 20L100 34L82 52Z" fill="#F3BA2F" />
        </svg>
      )
    },
    {
      name: 'Bybit',
      url: 'https://www.bybit.com?utm_source=chatgpt.com',
      note: 'Derivatives protocol matching security parameters.',
      logo: (
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="#12161E" />
          <path d="M25 40C25 31.7157 31.7157 25 40 25H45L35 45L45 65H40C31.7157 65 25 58.2843 25 50V40Z" fill="#F1A824" />
          <path d="M75 60C75 68.2843 68.2843 75 60 75H55L65 55L55 35H60C68.2843 35 75 41.7157 75 50V60Z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      name: 'Bitget',
      url: 'https://www.bitget.com?utm_source=chatgpt.com',
      note: 'Smart copy trading integration candidate.',
      logo: (
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#142B30" stroke="#00F0FF" strokeWidth="2" />
          <path d="M30 35H45L60 55L45 75H30L45 55L30 35Z" fill="#00F0FF" />
          <path d="M70 35H55L40 55L55 75H70L55 55L70 35Z" fill="#ffffff" opacity="0.6" />
        </svg>
      )
    },
    {
      name: 'Gate.io',
      url: 'https://www.gate.io?utm_source=chatgpt.com',
      note: 'Gateway listing review under preparation.',
      logo: (
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#0B132B" stroke="#2D60FF" strokeWidth="2" />
          <path d="M25 50C25 36.1929 36.1929 25 50 25V35C41.7157 35 35 41.7157 35 50C35 58.2843 41.7157 65 50 65V75C36.1929 75 25 63.8071 25 50Z" fill="#2D60FF" />
          <path d="M50 25C63.8071 25 75 36.1929 75 50H65C65 41.7157 58.2843 35 50 35V25Z" fill="#00E5FF" />
          <circle cx="65" cy="60" r="6" fill="#00FF88" />
        </svg>
      )
    },
    {
      name: 'MEXC',
      url: 'https://www.mexc.com?utm_source=chatgpt.com',
      note: 'Pre-listing compliance and liquidity review.',
      logo: (
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#0C2520" stroke="#16B97A" strokeWidth="2" />
          <path d="M25 70V30H38L50 50L62 30H75V70H63V45L50 62L37 45V70H25Z" fill="#16B97A" />
        </svg>
      )
    },
    {
      name: 'Blank',
      url: 'https://blank.com?utm_source=chatgpt.com',
      note: 'Privacy-oriented ecosystem smart-wallet support.',
      logo: (
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#0C0D11" stroke="#374151" strokeWidth="2" />
          <circle cx="50" cy="50" r="22" stroke="#6B7280" strokeWidth="4" strokeDasharray="10 6" />
          <circle cx="50" cy="50" r="8" fill="#ffffff" />
        </svg>
      )
    },
    {
      name: 'KuCoin',
      url: 'https://www.kucoin.com?utm_source=chatgpt.com',
      note: 'Consensus builder listing pipeline review.',
      logo: (
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#021C14" stroke="#00E676" strokeWidth="2" />
          <path d="M32 32H48V48H32V32Z" fill="#00E676" />
          <path d="M52 32H68V48H52V32Z" fill="#ffffff" opacity="0.6" />
          <path d="M32 52H48V68H32V52Z" fill="#ffffff" opacity="0.6" />
          <path d="M52 52L68 35V68H52V52Z" fill="#00E676" />
        </svg>
      )
    },
    {
      name: 'XT.com',
      url: 'https://www.xt.com?utm_source=chatgpt.com',
      note: 'Global strategic index exposure protocol.',
      logo: (
        <svg className="w-8 h-8 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#201502" stroke="#FF9800" strokeWidth="2" />
          <path d="M30 30H45L55 50L65 30H80L62 55L80 70H65L55 52L45 70H30L48 55L30 30Z" fill="#FF9800" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-[#020207]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-[100] animate-fade-in select-none">
      <div className="bg-[#080814]/98 border border-cyber-cyan/35 w-full max-w-4xl rounded-2xl flex flex-col shadow-[0_0_60px_rgba(0,229,255,0.18)] relative max-h-[92vh] overflow-y-auto">
        
        {/* Header decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyber-cyan/10 to-transparent pointer-events-none rounded-bl-full animate-pulse-safe"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyber-neon/5 to-transparent pointer-events-none rounded-tr-full"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0d0d22] border-b border-cyber-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded overflow-hidden border border-cyber-neon flex items-center justify-center bg-cyber-card shrink-0 animate-pulse-safe">
              <img
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=120&auto=format&fit=crop"
                alt="Surchi Catalyst Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[9px] font-mono text-cyber-neon tracking-widest uppercase font-black block">GLOBAL ALLIANCE PANEL</span>
              <h3 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-tight">$SURCHI Ecosystem Partnerships</h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 bg-cyber-card hover:bg-rose-950/40 text-slate-400 hover:text-red-400 border border-cyber-border rounded-lg cursor-pointer transition-all"
            title="Deactivate and close modal overlay"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Section 1: Strategic Partnerships */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-cyber-border pb-1.5">
              <Icons.Award className="w-4.5 h-4.5 text-cyber-neon" />
              <h4 className="text-xs font-bold text-cyber-text font-display uppercase tracking-wider">
                Strategic Partnerships & Core Integrations
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentPartners.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-cyber-border hover:border-cyber-cyan/50 bg-[#0d0d22]/45 hover:bg-[#12122e]/60 transition-all group flex flex-col justify-between h-auto text-left relative no-underline cursor-pointer"
                  style={{ boxShadow: `0 4px 15px rgba(0, 0, 0, 0.25)` }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {item.logo}
                      <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase border"
                            style={{ borderColor: `${item.iconTheme}40`, backgroundColor: `${item.iconTheme}10`, color: item.iconTheme }}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h5 className="text-xs font-black text-white font-display tracking-tight group-hover:text-cyber-neon transition-colors select-text">
                        {item.name}
                      </h5>
                      <p className="text-[10.5px] text-cyber-text-muted leading-relaxed font-sans select-text">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3.5 mt-2.5 border-t border-cyber-border/25 flex items-center justify-between text-[8px] font-mono font-bold text-cyber-text-muted">
                    <span className="group-hover:text-white transition-colors">DECENTRALIZED ACTIVE</span>
                    <Icons.ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Section 2: Future Partnerships Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-cyber-border pb-1.5">
              <Icons.FastForward className="w-4.5 h-4.5 text-cyber-cyan animate-pulse" />
              <h4 className="text-xs font-bold text-cyber-text font-display uppercase tracking-wider">
                Future Exchange Listings & Ecosystem Prospects
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {futurePartners.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-cyber-border/60 hover:border-cyber-cyan bg-[#04040a]/40 hover:bg-[#070719]/65 transition-all flex flex-col justify-between text-left h-24 no-underline group"
                >
                  <div className="flex items-center gap-2">
                    {item.logo}
                    <span className="text-[11px] font-bold text-white font-mono group-hover:text-cyber-cyan transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-[8px] leading-tight font-sans text-slate-500 group-hover:text-slate-400 select-text line-clamp-2">
                    {item.note}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Section 3: Little Short note & things to know */}
          <div className="p-4 bg-gradient-to-r from-[#03150d] via-[#050c18] to-[#04040a] border border-cyber-neon/20 rounded-xl flex items-start gap-3 text-left">
            <span className="p-2 rounded bg-cyber-neon/15 border border-cyber-neon/30 text-cyber-neon shrink-0 animate-pulse">
              <Icons.Info className="w-4 h-4" />
            </span>
            <div className="space-y-1">
              <strong className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#00ff88]">
                IMPORTANT ADVISORY: FUTURE LIQUIDITY PIPELINE DETAILS
              </strong>
              <p className="text-[10px] text-cyber-text-muted leading-relaxed font-sans max-w-3xl select-text">
                Future launchpad alignment and exchange listings noted above represent prospective integration roadmap benchmarks. All pipeline proposals go through strict audit assessments, collateral guarantees, and direct community vote consensus before smart contract initialization. Users should verify accurate URL domains securely before engaging in liquidity provision actions.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#050510] border-t border-cyber-border flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>SECURE CORE NETWORK SEC-801</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-cyber-neon/10 hover:bg-cyber-neon/20 border border-cyber-neon/30 text-cyber-neon hover:text-white rounded-lg cursor-pointer transition-all uppercase tracking-wider font-bold select-none"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
}
