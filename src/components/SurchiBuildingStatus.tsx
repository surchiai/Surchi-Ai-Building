import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

export default function SurchiBuildingStatus() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: 'RPC CONNECT', desc: 'Bootstrapping Solana high-speed node channels' },
    { label: 'SEED VAULT', desc: 'Secure Handshake with Seeker Secure Enclave' },
    { label: 'ALPHA CORE', desc: 'Tuning sentiment intelligence NLP models' },
    { label: 'LIQUIDITY MAP', desc: 'Syncing pool surveillance radar matrices' },
    { label: 'EXECUTION AGENT', desc: 'Routing Jupiter swap transaction endpoints' },
    { label: 'NLI CONTROLLER', desc: 'Initializing Plain-English strategy compiler' },
    { label: 'REVENUE BURN', desc: 'Activating auto-buyback deflationary triggers' },
    { label: 'ORACLE STATUS', desc: 'SURCHI Cognitive Layer fully online ⚡' }
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          // Slow reload loop to keep UI dynamic
          return 0;
        }
      });
    }, 2800);

    return () => clearInterval(stepInterval);
  }, [steps.length]);

  // Smoother layout progress ticks
  useEffect(() => {
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 4;
        return prev;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [activeStep]);

  return (
    <div className="w-full max-w-xl mx-auto p-4.5 bg-cyber-card border border-cyber-border hover:border-[#a855f7]/45 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.08)] space-y-4 relative overflow-hidden select-none animate-fade-in">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#a855f7]/5 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Loading telemetry banner */}
      <div className="flex items-center justify-between text-[10px] font-mono border-b border-cyber-border pb-2">
        <div className="flex items-center gap-1.5 font-bold text-cyber-cyan">
          <Icons.Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>BUILDING SYSTEM PROTOCOLS</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 font-bold">
          <span className="animate-pulse">STEP {activeStep + 1}/8</span>
          <span>&bull;</span>
          <span className="text-[#a855f7]">{Math.floor(((activeStep) / steps.length) * 100)}%</span>
        </div>
      </div>

      {/* Checklist list containing progressive states */}
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;
          const isPending = idx > activeStep;

          return (
            <div 
              key={idx} 
              className={`flex items-start justify-between gap-3 p-2 rounded-lg border transition-all text-left ${
                isActive 
                  ? 'bg-cyber-purple/10 border-[#a855f7]/40 shadow-[0_0_12px_rgba(168,85,247,0.06)] scale-[1.01]' 
                  : isCompleted
                  ? 'bg-transparent border-cyber-border/40 opacity-75'
                  : 'bg-transparent border-transparent opacity-35'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Checking Indicators */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <span className="flex items-center justify-center w-4 h-4 rounded bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] text-[9px] font-mono font-black">
                      <Icons.Check className="w-2.5 h-2.5 text-[#00ff88]" />
                    </span>
                  ) : isActive ? (
                    <span className="flex items-center justify-center w-4 h-4 rounded bg-[#a855f7]/15 border border-[#a855f7]/40 text-[#a855f7] text-[9px] font-mono font-black animate-pulse">
                      <Icons.Loader2 className="w-2.5 h-2.5 text-[#a855f7] animate-spin" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-4 h-4 rounded bg-[#0e0e24] border border-cyber-border text-slate-600 text-[9px] font-mono font-bold">
                      {idx + 1}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <span className={`text-[10px] font-mono font-bold tracking-wider block uppercase ${
                    isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </span>
                  <span className={`text-[9.5px] font-sans block leading-none ${
                    isActive ? 'text-[#c084fc]' : isCompleted ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {step.desc}
                  </span>
                </div>
              </div>

              {/* Status Signal Badge */}
              <div className="shrink-0 text-right">
                {isCompleted ? (
                  <span className="text-[8px] font-mono font-black text-[#00ff88] bg-[#00ff88]/10 px-1.5 py-0.5 rounded border border-[#00ff88]/25 uppercase tracking-wider">
                    SUCCESS
                  </span>
                ) : isActive ? (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[8px] font-mono font-black text-[#a855f7] bg-[#a855f7]/10 px-1.5 py-0.5 rounded border border-[#a855f7]/25 uppercase tracking-wider animate-pulse">
                      ACTIVE
                    </span>
                    {/* Live tiny smooth indicator bar */}
                    <div className="w-12 h-1 bg-cyber-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan transition-all duration-100" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-[8px] font-mono font-bold text-slate-600 bg-transparent px-1.5 py-0.5 rounded uppercase tracking-wider">
                    PENDING
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active telemetry info text block */}
      <div className="p-2 bg-[#08081a] border border-cyber-border rounded-lg text-center font-sans">
        <span className="font-mono text-[9px] text-slate-400 leading-none">
          {activeStep === steps.length - 1 ? (
            <span className="text-[#00ff88] font-black animate-pulse uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping"></span>
              ALL SYSTEMS AUTHENTICATED & READY
            </span>
          ) : (
            <span className="text-slate-400 uppercase tracking-widest animate-pulse">
              SYSTEM COMPILING STATUS: ACTIVE
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
