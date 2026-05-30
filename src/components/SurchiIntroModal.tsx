import React from 'react';
import * as Icons from 'lucide-react';

interface SurchiIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: 'dark' | 'light';
}

export default function SurchiIntroModal({ isOpen, onClose, themeMode = 'dark' }: SurchiIntroModalProps) {
  if (!isOpen) return null;

  const isLight = themeMode === 'light';

  return (
    <div className={`fixed inset-0 ${isLight ? 'bg-slate-900/60' : 'bg-[#020207]/90'} backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-[100] animate-fade-in select-none`}>
      <div className={`w-full max-w-2xl rounded-2xl flex flex-col relative max-h-[90vh] overflow-hidden ${
        isLight 
          ? 'bg-white border border-slate-200 shadow-[0_10px_50px_rgba(15,23,42,0.15)] text-slate-800' 
          : 'bg-[#04040d]/98 border border-cyber-purple/35 shadow-[0_0_60px_rgba(110,68,255,0.18)] text-white'
      }`}>
        
        {/* Header Ambient Glow */}
        {!isLight && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-gradient-to-b from-cyber-purple/15 to-transparent pointer-events-none rounded-full blur-2xl"></div>
        )}

        {/* Modal Header */}
        <div className={`p-4 sm:p-5 flex items-center justify-between shrink-0 ${
          isLight ? 'bg-slate-50 border-b border-slate-200' : 'bg-[#08081a] border-b border-cyber-border'
        }`}>
          <div className="flex items-center gap-2.5 text-left">
            <span className={`p-1.5 rounded border ${
              isLight ? 'bg-purple-50 border-purple-200 text-[#a855f7]' : 'bg-cyber-purple/15 border-cyber-purple/30 text-cyber-purple'
            }`}>
              <Icons.Cpu className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <span className={`text-[9px] font-mono tracking-widest uppercase font-black block ${
                isLight ? 'text-indigo-600' : 'text-cyber-cyan'
              }`}>SYSTEM OVERVIEW</span>
              <h3 className={`text-sm sm:text-base font-black font-display uppercase tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>Mission & Utility Document</h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-lg cursor-pointer transition-all ${
              isLight 
                ? 'bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200' 
                : 'bg-cyber-card hover:bg-rose-950/40 text-slate-400 hover:text-red-400 border border-cyber-border'
            }`}
            title="Deactivate core documentation overlay"
          >
            <Icons.X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className={`p-5 sm:p-6 space-y-5 overflow-y-auto font-sans text-xs leading-relaxed md:text-sm ${
          isLight ? 'text-slate-700' : 'text-slate-300'
        }`}>
          
          {/* Main Statement */}
          <div className={`p-4 rounded-xl border relative overflow-hidden ${
            isLight ? 'border-purple-200 bg-purple-50/50 text-slate-800' : 'border-cyber-purple/20 bg-cyber-purple/5'
          }`}>
            <div className={`absolute top-0 right-0 p-1 font-mono text-[7px] font-bold ${
              isLight ? 'text-purple-400' : 'text-cyber-purple/40'
            }`}>CORE-METRIC-01</div>
            <p className="font-medium leading-relaxed select-text text-left">
              <strong className={isLight ? 'text-slate-900' : 'text-white'}>SURCHI</strong> is an AI-powered DeFi ecosystem built on Solana, created to simplify the crypto experience through intelligent tools, AI-driven analytics, automation, and smart blockchain insights.
            </p>
          </div>

          <div className="space-y-4 select-text">
            {/* Paragraph 2 & 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className={`p-4.5 rounded-xl border space-y-2 ${
                isLight ? 'border-slate-150 bg-slate-50/50' : 'border-cyber-border bg-[#070715]/50'
              }`}>
                <div className={`flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase ${
                  isLight ? 'text-indigo-600' : 'text-cyber-cyan'
                }`}>
                  <Icons.BrainCircuit className="w-3.5 h-3.5" />
                  Smarter DeFi Layer
                </div>
                <p className={`text-[11.5px] leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  The core idea behind SURCHI is to make decentralized finance smarter, easier, and more accessible for everyone by combining artificial intelligence with blockchain technology.
                </p>
              </div>

              <div className={`p-4.5 rounded-xl border space-y-2 ${
                isLight ? 'border-slate-150 bg-slate-50/50' : 'border-cyber-border bg-[#070715]/50'
              }`}>
                <div className={`flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase ${
                  isLight ? 'text-emerald-600' : 'text-cyber-neon'
                }`}>
                  <Icons.Activity className="w-3.5 h-3.5" />
                  Genuine Utility Focus
                </div>
                <p className={`text-[11.5px] leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Unlike many projects in the market today, SURCHI is not being built as just another hype-driven crypto token with no real purpose. SURCHI is focused on utility, ecosystem development, and long-term value creation.
                </p>
              </div>
            </div>

            {/* Paragraph 4: Token Use Cases */}
            <div className={`p-4.5 rounded-xl border space-y-3 text-left ${
              isLight ? 'border-slate-200 bg-[#faf9fe]' : 'border-cyber-border bg-[#050510]/80'
            }`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5 border-b pb-1.5 ${
                isLight ? 'text-slate-800 border-slate-200' : 'text-white border-cyber-border'
              }`}>
                <Icons.Coins className="w-4 h-4 text-amber-500" />
                Token Core Mechanics & Use Cases
              </h4>
              <p className={`text-[11.5px] leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                The SURCHI token is designed to have real use cases within the ecosystem, including:
              </p>
              <div className={`grid grid-cols-2 gap-2 text-[10.5px] font-mono ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? 'bg-purple-500' : 'bg-cyber-purple'}`}></span>
                  Premium AI Tools
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? 'bg-purple-500' : 'bg-cyber-purple'}`}></span>
                  Intelligent Analytics
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? 'bg-purple-500' : 'bg-cyber-purple'}`}></span>
                  Ecosystem Utilities
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? 'bg-purple-500' : 'bg-cyber-purple'}`}></span>
                  Platform Participation
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? 'bg-purple-500' : 'bg-cyber-purple'}`}></span>
                  Community Rewards
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLight ? 'bg-purple-500' : 'bg-cyber-purple'}`}></span>
                  Future Integrations
                </div>
              </div>
            </div>

            {/* Paragraph 5: AI Layer */}
            <div className={`p-4.5 rounded-xl border space-y-2 text-left ${
              isLight ? 'border-slate-150 bg-slate-50/50' : 'border-cyber-border bg-[#070715]/50'
            }`}>
              <div className={`flex items-center gap-1.5 font-mono font-bold text-[10px] uppercase ${
                isLight ? 'text-indigo-600' : 'text-cyber-cyan'
              }`}>
                <Icons.Eye className="w-3.5 h-3.5" />
                Intelligent Defi Navigation
              </div>
              <p className={`text-[11.5px] leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                SURCHI aims to build an intelligent layer for DeFi — helping users better understand markets, track opportunities, monitor wallets, manage risks, analyze trends, and navigate the crypto ecosystem with greater confidence and efficiency.
              </p>
            </div>

            {/* Paragraph 6: The Vision */}
            <div className={`p-4 rounded-xl flex items-start gap-3 text-left ${
              isLight ? 'border-emerald-200 bg-emerald-50/50' : 'border-cyber-neon/20 bg-gradient-to-r from-cyber-card via-[#061811] to-cyber-card'
            }`}>
              <span className={`p-1.5 rounded shrink-0 ${
                isLight ? 'bg-emerald-100 border border-emerald-200 text-emerald-600' : 'bg-cyber-neon/15 border border-cyber-neon/30 text-cyber-neon shrink-0 animate-pulse'
              }`}>
                <Icons.Globe className="w-4 h-4" />
              </span>
              <div className="space-y-0.5">
                <strong className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                  isLight ? 'text-emerald-700' : 'text-cyber-neon'
                }`}>
                  THE LONG-TERM VISION SUMMARY
                </strong>
                <p className={`text-[11px] font-sans leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  The vision is simple: build a real AI ecosystem with real functionality, real tools, and real long-term utility within Web3 and decentralized finance.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className={`p-4 flex items-center justify-between text-[10px] font-mono shrink-0 ${
          isLight ? 'bg-slate-50 border-t border-slate-200 text-slate-400' : 'bg-[#050510] border-t border-cyber-border text-slate-500'
        }`}>
          <span>SURCHI PROTOCOL REV-A2</span>
          <button 
            onClick={onClose}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-all uppercase tracking-wider font-bold select-none text-[10px] ${
              isLight 
                ? 'bg-purple-100 hover:bg-purple-200 border border-purple-200 text-[#a855f7] hover:text-purple-800' 
                : 'bg-cyber-purple/10 hover:bg-cyber-purple/25 border border-cyber-purple/35 text-cyber-purple hover:text-white'
            }`}
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
}
