import React from 'react';
import * as Icons from 'lucide-react';

interface SurchiIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SurchiIntroModal({ isOpen, onClose }: SurchiIntroModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#020207]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-[100] animate-fade-in select-none">
      <div className="bg-[#04040d]/98 border border-cyber-purple/35 w-full max-w-2xl rounded-2xl flex flex-col shadow-[0_0_60px_rgba(110,68,255,0.18)] relative max-h-[90vh] overflow-hidden">
        
        {/* Header Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b from-cyber-purple/15 to-transparent pointer-events-none rounded-full blur-2xl"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#08081a] border-b border-cyber-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded bg-cyber-purple/15 border border-cyber-purple/30 text-cyber-purple">
              <Icons.Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <span className="text-[9px] font-mono text-cyber-cyan tracking-widest uppercase font-black block">SYSTEM OVERVIEW</span>
              <h3 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-tight">Mission & Utility Document</h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 bg-cyber-card hover:bg-rose-950/40 text-slate-400 hover:text-red-400 border border-cyber-border rounded-lg cursor-pointer transition-all"
            title="Deactivate core documentation overlay"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto font-sans text-xs leading-relaxed text-slate-300 md:text-sm">
          
          {/* Main Statement */}
          <div className="p-4 rounded-xl border border-cyber-purple/20 bg-cyber-purple/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 font-mono text-[7px] text-cyber-purple/40 font-bold">CORE-METRIC-01</div>
            <p className="font-medium text-white leading-relaxed select-text">
              <strong>SURCHI</strong> is an AI-powered DeFi ecosystem built on Solana, created to simplify the crypto experience through intelligent tools, AI-driven analytics, automation, and smart blockchain insights.
            </p>
          </div>

          <div className="space-y-4 select-text">
            {/* Paragraph 2 & 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4.5 rounded-xl border border-cyber-border bg-[#070715]/50 space-y-2">
                <div className="flex items-center gap-1.5 text-cyber-cyan font-mono font-bold text-[10px] uppercase">
                  <Icons.BrainCircuit className="w-3.5 h-3.5" />
                  Smarter DeFi Layer
                </div>
                <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                  The core idea behind SURCHI is to make decentralized finance smarter, easier, and more accessible for everyone by combining artificial intelligence with blockchain technology.
                </p>
              </div>

              <div className="p-4.5 rounded-xl border border-cyber-border bg-[#070715]/50 space-y-2">
                <div className="flex items-center gap-1.5 text-cyber-neon font-mono font-bold text-[10px] uppercase">
                  <Icons.Activity className="w-3.5 h-3.5" />
                  Genuine Utility Focus
                </div>
                <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                  Unlike many projects in the market today, SURCHI is not being built as just another hype-driven crypto token with no real purpose. SURCHI is focused on utility, ecosystem development, and long-term value creation.
                </p>
              </div>
            </div>

            {/* Paragraph 4: Token Use Cases */}
            <div className="p-4.5 rounded-xl border border-cyber-border bg-[#050510]/80 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-cyber-border pb-1.5">
                <Icons.Coins className="w-4 h-4 text-amber-400" />
                Token Core Mechanics & Use Cases
              </h4>
              <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                The SURCHI token is designed to have real use cases within the ecosystem, including:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple shrink-0"></span>
                  Premium AI Tools
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple shrink-0"></span>
                  Intelligent Analytics
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple shrink-0"></span>
                  Ecosystem Utilities
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple shrink-0"></span>
                  Platform Participation
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple shrink-0"></span>
                  Community Rewards
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple shrink-0"></span>
                  Future Integrations
                </div>
              </div>
            </div>

            {/* Paragraph 5: AI Layer */}
            <div className="p-4.5 rounded-xl border border-cyber-border bg-[#070715]/50 space-y-2">
              <div className="flex items-center gap-1.5 text-cyber-cyan font-mono font-bold text-[10px] uppercase">
                <Icons.Eye className="w-3.5 h-3.5" />
                Intelligent Defi Navigation
              </div>
              <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans">
                SURCHI aims to build an intelligent layer for DeFi — helping users better understand markets, track opportunities, monitor wallets, manage risks, analyze trends, and navigate the crypto ecosystem with greater confidence and efficiency.
              </p>
            </div>

            {/* Paragraph 6: The Vision */}
            <div className="p-4 rounded-xl border border-cyber-neon/20 bg-gradient-to-r from-cyber-card via-[#061811] to-cyber-card flex items-start gap-3">
              <span className="p-1.5 rounded bg-cyber-neon/15 border border-cyber-neon/30 text-cyber-neon shrink-0 animate-pulse">
                <Icons.Globe className="w-4 h-4" />
              </span>
              <div className="space-y-0.5">
                <strong className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyber-neon block">
                  THE LONG-TERM VISION SUMMARY
                </strong>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  The vision is simple: build a real AI ecosystem with real functionality, real tools, and real long-term utility within Web3 and decentralized finance.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#050510] border-t border-cyber-border flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0">
          <span>SURCHI PROTOCOL REV-A2</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-cyber-purple/10 hover:bg-cyber-purple/25 border border-cyber-purple/35 text-cyber-purple hover:text-white rounded-lg cursor-pointer transition-all uppercase tracking-wider font-bold select-none text-[10px]"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
