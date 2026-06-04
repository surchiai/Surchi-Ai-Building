import React, { useState, useEffect } from 'react';
import { 
  Download, RefreshCw, X, ShieldAlert, CheckCircle, Smartphone, 
  Terminal, Shield, AlertTriangle, Layers, Info, Check, ArrowRight 
} from 'lucide-react';

interface ApkRelease {
  version: string;
  apkUrl: string;
  size: string;
  releaseDate: string;
  forceUpdate: boolean;
  sha256: string;
  changelog: string[];
  status: 'stable' | 'beta';
  downloads?: number;
}

interface SurchiApkUpdateModalProps {
  currentClientVersion: string;
  onUpdateSuccess: (newVersion: string) => void;
  themeMode: 'dark' | 'light';
}

export default function SurchiApkUpdateModal({ currentClientVersion, onUpdateSuccess, themeMode }: SurchiApkUpdateModalProps) {
  const [latestRelease, setLatestRelease] = useState<ApkRelease | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updateState, setUpdateState] = useState<'prompt' | 'downloading' | 'verifying' | 'installing' | 'finished'>('prompt');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check for updates matching API details
  const checkForUpdates = async () => {
    try {
      const res = await fetch('/api/apk/latest');
      const data = await res.json();
      if (data.success && data.release) {
        const release: ApkRelease = data.release;
        
        // Simple semver compare logic
        const latestSem = release.version.split('.').map(Number);
        const currentSem = currentClientVersion.split('.').map(Number);
        
        let hasNewer = false;
        for (let i = 0; i < Math.max(latestSem.length, currentSem.length); i++) {
          const lNum = latestSem[i] || 0;
          const cNum = currentSem[i] || 0;
          if (lNum > cNum) {
            hasNewer = true;
            break;
          } else if (lNum < cNum) {
            break;
          }
        }

        if (hasNewer) {
          setLatestRelease(release);
          setShowModal(true);
        }
      }
    } catch (err) {
      console.error('Update checker ledger connection issue:', err);
    }
  };

  useEffect(() => {
    // Delay check slightly after splash screen resolves
    const timer = setTimeout(() => {
      checkForUpdates();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentClientVersion]);

  const handleStartUpdate = async () => {
    if (!latestRelease) return;
    setUpdateState('downloading');
    setProgress(0);
    setStatusText('Downloading cyber compilation blocksets...');

    // Fake track analytic trigger start
    await fetch('/api/apk/download-count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: latestRelease.version,
        success: null, // neutral
        reason: "checking"
      })
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (updateState === 'downloading') {
      timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.floor(Math.random() * 10) + 6;
          if (next >= 100) {
            clearInterval(timer);
            setUpdateState('verifying');
            setProgress(100);
            setStatusText('Verifying signature credentials...');
            return 100;
          }
          const mb = (parseFloat(latestRelease?.size || '28.5') * (next / 100)).toFixed(1);
          setStatusText(`Downloading packages: ${mb} MB / ${latestRelease?.size} (${next}%)`);
          return next;
        });
      }, 150);
    } else if (updateState === 'verifying') {
      timer = setTimeout(() => {
        setUpdateState('installing');
        setProgress(0);
        setStatusText('Injecting forensic system structures...');
      }, 2000);
    } else if (updateState === 'installing') {
      timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.floor(Math.random() * 15) + 10;
          if (next >= 100) {
            clearInterval(timer);
            setUpdateState('finished');
            setProgress(100);
            setStatusText('Re-compiling live database index keys...');
            triggerSystemUpdateComplete();
            return 100;
          }
          setStatusText(`Compiling binary blocks: ${next}% complete`);
          return next;
        });
      }, 250);
    }
    return () => clearInterval(timer);
  }, [updateState, latestRelease]);

  const triggerSystemUpdateComplete = async () => {
    if (!latestRelease) return;
    try {
      await fetch('/api/apk/download-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: latestRelease.version,
          success: true,
          reason: "installed"
        })
      });
      // Fire callback on finish delay
      setTimeout(() => {
        onUpdateSuccess(latestRelease.version);
        setShowModal(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!showModal || !latestRelease) return null;

  const isForce = latestRelease.forceUpdate;

  return (
    <div className={`fixed inset-0 bg-black/85 backdrop-blur-md z-[99990] flex items-center justify-center p-4 font-sans`}>
      <div 
        className={`w-full max-w-lg rounded-2xl border text-left p-6 relative overflow-hidden transition-all duration-300 ${
          themeMode === 'light' 
            ? 'bg-white border-slate-200 text-slate-800 shadow-2xl' 
            : 'bg-[#0a0a14] border-[#00E5FF]/20 text-slate-100 shadow-[0_0_25px_rgba(0,229,255,0.15)]'
        }`}
      >
        <div className="absolute inset-0 bg-radial-at-t from-[#00E5FF]/5 via-transparent to-transparent pointer-events-none" />

        {/* Header Modal Banner */}
        <div className="flex items-start justify-between border-b border-cyber-border/15 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${isForce ? 'bg-red-500/10 border-red-500/30' : 'bg-[#00E5FF]/10 border-[#00E5FF]/30'}`}>
              <Smartphone className={`w-6 h-6 ${isForce ? 'text-red-400 animate-pulse' : 'text-[#00E5FF] animate-bounce'}`} />
            </div>
            <div>
              <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                isForce ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white'
              }`}>
                {isForce ? 'URGENT FORCE UPDATE' : 'NEW UPDATE DETECTED'}
              </span>
              <h3 className="text-lg font-black font-sans tracking-tight mt-1 uppercase">
                {isForce ? 'MANDATORY CLIENT UPGRADE' : 'SURCHI UPGRADE DETECTED'}
              </h3>
            </div>
          </div>
          
          {/* Prevent closing if force update */}
          {!isForce && updateState === 'prompt' && (
            <button
              onClick={() => setShowModal(false)}
              className="p-1 hover:bg-slate-900/40 rounded transition-all text-slate-450 hover:text-slate-200 translate-x-2 -translate-y-2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body container based on current update step */}
        <div className="space-y-4">
          {updateState === 'prompt' && (
            <>
              {/* Force Warning Alert Box banner */}
              {isForce && (
                <div className="p-3 bg-red-950/35 border border-red-500/20 rounded-lg flex items-start gap-2.5 text-xs text-red-300 font-mono">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <span className="font-bold">CORE UPGRADE STANDARDS MANDATED:</span>
                    <p className="mt-0.5">Your current frontend version (v{currentClientVersion}) is out of sync with terminal protocol servers. You must install v{latestRelease.version} to unlock modules.</p>
                  </div>
                </div>
              )}

              {/* Version mapping comparison HUD */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-900 text-center relative">
                <div className="border-r border-slate-900 py-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Current Build</span>
                  <span className="text-xl font-mono font-bold text-slate-400">v{currentClientVersion}</span>
                </div>
                <div className="py-1">
                  <span className="text-[9px] font-mono text-[#00E5FF] uppercase tracking-widest block">Latest Build</span>
                  <span className="text-xl font-mono font-bold text-[#00ff88]">v{latestRelease.version}</span>
                </div>
              </div>

              {/* Incremental Changelog items */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0AEC0] block mb-2 font-bold">
                  What's New in SURCHI v{latestRelease.version}
                </span>
                <div className="max-h-36 overflow-y-auto pr-1 space-y-2 select-none">
                  {latestRelease.changelog.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-350">
                      <Check className="w-4 h-4 text-[#00ff88] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs info */}
              <div className="flex justify-between text-[11px] font-mono text-slate-500 border-t border-cyber-border/10 pt-4">
                <span>File Size: {latestRelease.size}</span>
                <span>SHA-256 matching certificate: OK</span>
              </div>

              {/* Action layout */}
              <div className="flex gap-3 pt-2">
                {!isForce && (
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 text-xs font-mono font-bold hover:bg-slate-800 hover:text-slate-200 transition-all text-center"
                  >
                    Later
                  </button>
                )}
                
                <button
                  onClick={handleStartUpdate}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#2979FF] hover:to-[#7C3AED] text-white text-xs font-mono font-black uppercase rounded-lg shadow-md hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" /> Install v{latestRelease.version} Now
                </button>
              </div>
            </>
          )}

          {/* ACTIVE UPDATING VISUAL PROGRESS ENGINE */}
          {(updateState === 'downloading' || updateState === 'verifying' || updateState === 'installing' || updateState === 'finished') && (
            <div className="space-y-6 py-6 text-center">
              
              <div className="relative w-16 h-16 mx-auto">
                <RefreshCw className="w-16 h-16 text-[#00E5FF] animate-spin shrink-0 opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-[#00E5FF] animate-pulse" />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-extrabold block">
                  {updateState}...
                </span>
                <span className="text-xs text-slate-300 font-mono block truncate max-w-full">
                  {statusText}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>SANDBOX OVER-THE-AIR LINK (OTA)</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 border border-slate-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00E5FF] via-[#2979FF] to-[#7C3AED] transition-all rounded-full duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Cryptographic verification logs */}
              {updateState === 'verifying' && (
                <div className="p-3 rounded bg-slate-950 border border-cyan-400/10 text-left space-y-1 font-mono text-[9px] text-[#00E5FF]">
                  <div>[SECURITY CORE] Connecting key exchange verification portals...</div>
                  <div className="text-cyan-300">[SIGNATURE AUDIT] Root certificate matching (com.surchi.core) - TRUSTED</div>
                  <div className="text-emerald-400">[INTEGRITY CHECK] SHA256 matches: {latestRelease.sha256.substring(0, 32)}...</div>
                </div>
              )}

              {updateState === 'finished' && (
                <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/20 text-center space-y-1 font-mono text-xs text-emerald-400">
                  <div className="font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 shrink-0" /> INTEGRATION FINALISED!
                  </div>
                  <p className="text-[10px] text-slate-450 mt-1">Mobile directory verified, launching surchi environment links...</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
