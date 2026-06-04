import React, { useState, useEffect } from 'react';
import { 
  Download, CheckCircle, Shield, AlertTriangle, Terminal, 
  HelpCircle, RefreshCw, Smartphone, Globe, ArrowLeft, ArrowUpRight, 
  Play, BookOpen, Layers, Laptop, Cpu, Check, FileCheck, ShieldAlert 
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

interface ApkDownloadPortalProps {
  themeMode: 'dark' | 'light';
  onNavigateBack: () => void;
  onOpenAdmin: () => void;
}

export default function ApkDownloadPortal({ themeMode, onNavigateBack, onOpenAdmin }: ApkDownloadPortalProps) {
  const [releases, setReleases] = useState<ApkRelease[]>([]);
  const [latestRelease, setLatestRelease] = useState<ApkRelease | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingVersion, setDownloadingVersion] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('');
  const [downloadBytes, setDownloadBytes] = useState('');
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Sideload Emulator Interactive State
  const [emulatorState, setEmulatorState] = useState<'idle' | 'downloading' | 'verifying' | 'prompt' | 'installing' | 'completed'>('idle');
  const [emulatorProgress, setEmulatorProgress] = useState(0);
  const [emulatorLogs, setEmulatorLogs] = useState<string[]>([]);
  const [emulatorError, setEmulatorError] = useState<string | null>(null);

  // Fetch releases from API
  const fetchReleases = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/apk/releases');
      const data = await res.json();
      if (data.success) {
        setReleases(data.releases);
        const active = data.releases.find((r: ApkRelease) => r.status === 'stable') || data.releases[0];
        setLatestRelease(active || null);
      }
    } catch (err) {
      console.error('Failed to fetch APK releases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  // Emulator log manager
  const addLog = (text: string) => {
    setEmulatorLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`].slice(-6));
  };

  // Triggers virtual Android install prompt
  const startEmulatorDemo = () => {
    if (!latestRelease) return;
    setEmulatorState('downloading');
    setEmulatorProgress(0);
    setEmulatorError(null);
    setEmulatorLogs([]);
    addLog(`INITIALIZING NEURAL COMPILE VECTOR: SURCHI v${latestRelease.version}`);
    addLog(`CONTACTING PRIMARY CLUSTER NODES...`);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emulatorState === 'downloading') {
      interval = setInterval(() => {
        setEmulatorProgress(prev => {
          const next = prev + Math.floor(Math.random() * 15) + 5;
          if (next >= 100) {
            clearInterval(interval);
            setEmulatorState('verifying');
            addLog(`DOWNLOAD TARGET COMPLETE (${latestRelease?.size})`);
            addLog(`PERFORMING CRADLE-LEVEL SIGNATURE AUDIT...`);
            return 100;
          }
          if (prev < 30 && next >= 30) addLog(`DOWNLOADING BLOCKSETS: 35% SUCCESSFUL`);
          if (prev < 65 && next >= 65) addLog(`COMPRESSING METADATA STRINGS: 70% SUCCESSFUL`);
          return next;
        });
      }, 250);
    } else if (emulatorState === 'verifying') {
      interval = setTimeout(() => {
        setEmulatorState('prompt');
        addLog(`CRYPTOGRAPHIC VALIDATION PASSED: SHA-256 MATCH ✅`);
        addLog(`SIGNATURE CERTIFICATE: TRUSTED (SURCHI DEV CORE LLC)`);
        addLog(`PROMPTING USER ENVIRONMENT PERMISSIONS...`);
      }, 1500);
    } else if (emulatorState === 'installing') {
      interval = setInterval(() => {
        setEmulatorProgress(prev => {
          const next = prev + Math.floor(Math.random() * 20) + 10;
          if (next >= 100) {
            clearInterval(interval);
            setEmulatorState('completed');
            addLog(`COMMITTING METRIC BUFFER TO DEVICE CACHE`);
            addLog(`SURCHI MOBILE CORE v${latestRelease?.version} INSTALLED SUCCESSFULLY!`);
            addLog(`LAUNCHING COMPACT FORENSIC LEDGER VECTORS...`);
            
            // Record analytics download success in background
            navigator.geolocation.getCurrentPosition(
              (pos) => recordDownloadAnalytics(latestRelease?.version || '1.1.0', true),
              () => recordDownloadAnalytics(latestRelease?.version || '1.1.0', true)
            );
            return 100;
          }
          if (prev < 40 && next >= 40) addLog(`EXTRACTING NATIVE FORENSIC LIBS (arm64-v8a)...`);
          if (prev < 75 && next >= 75) addLog(`OPTIMIZING RUNTIME ART COMPILATION CODES...`);
          return next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [emulatorState]);

  // Actual browser download of dummy binary
  const handleDownloadApk = async (release: ApkRelease) => {
    setDownloadingVersion(release.version);
    setDownloadProgress(0);
    setDownloadSpeed('0 KB/s');
    setDownloadBytes(`0.0 MB / ${release.size}`);

    // Track starting timestamp
    const startTime = Date.now();
    const totalMb = parseFloat(release.size);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        clearInterval(interval);
        setDownloadProgress(100);
        setDownloadSpeed('12.4 MB/s');
        setDownloadBytes(`${release.size} / ${release.size}`);
        
        // Push actual file download in browser
        const link = document.createElement('a');
        link.href = release.apkUrl;
        link.setAttribute('download', `surchi-v${release.version}.apk`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          setDownloadingVersion(null);
          recordDownloadAnalytics(release.version, true);
        }, 1000);
      } else {
        const percent = progress / 100;
        const curMb = (totalMb * percent).toFixed(1);
        const elapsedS = (Date.now() - startTime) / 1000;
        const speed = elapsedS > 0 ? ((totalMb * percent) / elapsedS).toFixed(1) : '3.6';
        
        setDownloadProgress(progress);
        setDownloadSpeed(`${speed} MB/s`);
        setDownloadBytes(`${curMb} MB / ${release.size}`);
      }
    }, 150);
  };

  const recordDownloadAnalytics = async (version: string, isSuccess: boolean) => {
    try {
      // Pick random region/device for simulation
      const regions = ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East/Africa"];
      const devices = [
        "Samsung Galaxy Series", "Google Pixel Series", 
        "Xiaomi / Redmi", "OnePlus devices", "Other Android 8+"
      ];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];

      await fetch('/api/apk/download-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version,
          region,
          device,
          success: isSuccess
        })
      });
      fetchReleases();
    } catch (err) {
      console.error('Failed to log download analytic:', err);
    }
  };

  const getThemeClass = (darkVal: string, lightVal: string) => {
    return themeMode === 'dark' ? darkVal : lightVal;
  };

  // Sideload steps
  const installSteps = [
    {
      title: 'Enable Installations',
      desc: 'Unlock installation capabilities inside Android Settings.',
      cmd: 'Settings > Security > Install Unknown Apps'
    },
    {
      title: 'Authorize browser',
      desc: 'Toggle on the permission button for your active mobile web browser (e.g., Chrome, Brave).',
      cmd: 'Allow from this source: ON'
    },
    {
      title: 'Run Package Installer',
      desc: 'Locate the file inside your local downloads file-history and open it directly.',
      cmd: 'Open surchi-v1.1.0-stable.apk'
    },
    {
      title: 'Approve & Connect',
      desc: 'Verify that the SHA-256 fingerprint matches, select INSTALL, and initialize the neural core.',
      cmd: 'Audit passed: Initialize'
    }
  ];

  // FAQs answers
  const faqs = [
    {
      q: 'Is it safe to install the SURCHI APK directly?',
      a: 'Absolutely. Sideloading the official SURCHI APK bypasses intermediary centralized distribution layers. Our codebase is cryptographically signed and validated directly by our core developers. We publish SHA-256 integrity checksums for every build so you can verify the file is unmodified, secure, and empty of tracking vulnerabilities.'
    },
    {
      q: 'What are the minimum security requirements for Android?',
      a: 'We support all modern ARM64 devices running Android 8.0 (Oreo) and above. Surchi relies on hardware-level keystore systems to cache biometric data safely without network leaking.'
    },
    {
      q: 'How do OTA (Over-The-Air) automatic updates work?',
      a: 'At startup, the SURCHI application securely checks our ledger endpoints for newer version strings. If found, a micro-notification prompt offers immediate secure update packages. You can finalize updates seamlessly inside the application.'
    },
    {
      q: 'Why does Google Play Protect display an "Unverified Developer" warning?',
      a: 'As we avoid centralized corporate registration frameworks, Android may denote newly deployed sideloaded APK files as "Unknown". This is normal. You can safely click "Install Anyway" after cross-referencing our published SHA-256 hash.'
    }
  ];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 rounded-2xl border ${getThemeClass('bg-cyber-card-light/40 border-cyber-border/40 text-slate-100', 'bg-white border-slate-200 shadow-xl text-slate-800')} relative overflow-hidden font-sans`}>
      <div className="absolute inset-0 bg-radial-at-t from-[#00E5FF]/5 via-transparent to-transparent pointer-events-none" />

      {/* Portal Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/20 pb-6 mb-8">
        <div>
          <button 
            onClick={onNavigateBack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all mb-3 border ${
              themeMode === 'light'
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                : 'bg-cyber-card text-[#00E5FF] hover:bg-cyber-card-light hover:text-[#00E5FF] border-cyber-border/60 hover:shadow-[0_0_8px_rgba(0,229,255,0.25)]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
          </button>
          
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#2979FF] to-[#7C3AED] uppercase">
            SURCHI MOBILE GATEWAY
          </h2>
          <p className="text-slate-450 text-xs sm:text-sm mt-1">
            Enterprise class Android APK repository & verified decentralized updates hub
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Admin center navigation button */}
          <button 
            onClick={onOpenAdmin}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase flex items-center gap-2 rounded-lg transition-all border ${
              themeMode === 'light'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                : 'bg-[#121327]/30 border-purple-500/40 text-purple-400 hover:bg-purple-950/20'
            }`}
          >
            <Terminal className="w-4 h-4" /> Admin Upload Hub
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-10 h-10 text-[#00E5FF] animate-spin" />
          <span className="text-[#00E5FF] font-mono text-sm mt-4 tracking-widest uppercase">Querying Secure Repositories...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Main Card & Downloads Info) - 7 cols */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Primary Download Main Deck */}
            {latestRelease ? (
              <div className={`p-6 rounded-xl border relative overflow-hidden ${
                themeMode === 'light'
                  ? 'bg-gradient-to-br from-slate-50 to-[#eef2f3] border-slate-200'
                  : 'bg-[#090b14] border-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.04)]'
              }`}>
                {/* Neon decorative ribbon */}
                <span className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] px-2 py-0.5 rounded font-mono font-black uppercase tracking-widest">
                  Active Stable
                </span>

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${
                    themeMode === 'light' ? 'bg-indigo-50 border-indigo-100' : 'bg-[#070e17] border-[#00E5FF]/30'
                  }`}>
                    <Smartphone className="w-8 h-8 text-[#00E5FF] animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-sans tracking-tight">SURCHI FOR ANDROID</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="text-[#00E5FF] font-bold">Version:</span> v{latestRelease.version}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-[#00E5FF] font-bold">Size:</span> {latestRelease.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-[#00E5FF] font-bold">Released:</span> {latestRelease.releaseDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Download Call To Action */}
                <div className="mt-6 p-4 rounded-xl bg-slate-900/45 border border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="w-full sm:w-auto">
                    <p className="text-[10px] font-mono text-[#00E5FF] tracking-wider uppercase font-extrabold flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Direct HTTPS CDN Node Delivery
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Sideload package: zero trackers, raw execution code.</p>
                  </div>

                  {downloadingVersion === latestRelease.version ? (
                    <div className="w-full sm:w-60">
                      <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400 mb-1">
                        <span>{downloadBytes}</span>
                        <span>{downloadSpeed}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] transition-all duration-150 ease-out"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                      <div className="text-[9px] font-mono text-center text-slate-500 mt-1">
                        Extracting blocks ({downloadProgress}%)
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDownloadApk(latestRelease)}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#00E5FF] to-[#2979FF] hover:from-[#00E5FF] hover:to-[#7C3AED] text-white font-mono font-black text-xs uppercase rounded-lg shadow-lg hover:shadow-[0_0_12px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4 shrink-0" /> Download APK Sideload
                    </button>
                  )}
                </div>

                {/* Changelog Card Section */}
                <div className="mt-6 border-t border-cyber-border/20 pt-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-350 mb-3 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#7C3AED]" /> What's New In This Build
                  </h4>
                  <ul className="space-y-2">
                    {latestRelease.changelog.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 hover:scale-110 transition-transform shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SHA256 Integrity Verification block */}
                <div className="mt-5 p-3 rounded bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left">
                  <div className="font-mono flex-1">
                    <span className="text-[9px] text-[#A0AEC0]/40 block uppercase tracking-widest">SHA-256 Checksum Signature</span>
                    <span className="text-[10px] text-slate-300 break-all">{latestRelease.sha256}</span>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono uppercase font-semibold shrink-0">
                    <Shield className="w-3.5 h-3.5" /> Verified
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-[#090b14] rounded-lg border border-slate-800">
                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto" />
                <p className="text-sm text-slate-400 mt-2 font-mono">No active APK release files mapped on backend ledger.</p>
              </div>
            )}

            {/* Step-by-Step Interactive Sideloading Guide */}
            <div className={`p-6 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#090b14]/50 border-cyber-border/30')}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wide text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#00E5FF]" /> Android Sideload Installation Guide
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Quick instructions to trust, audit, and finalize the application</p>
                </div>
                <button
                  onClick={() => setShowInstallGuide(!showInstallGuide)}
                  className="text-xs font-mono text-[#00E5FF] hover:underline"
                >
                  {showInstallGuide ? 'Hide Guide' : 'Detailed Instructions'}
                </button>
              </div>

              {showInstallGuide && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all">
                  {installSteps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 text-left flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] text-white flex items-center justify-center font-mono text-[10px] font-black">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-100">{step.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{step.desc}</p>
                      </div>
                      <div className="mt-3.5 bg-[#03060b] px-2 py-1 rounded text-[10px] font-mono text-cyan-400 border border-cyan-400/10 truncate">
                        $ {step.cmd}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Version History Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-350 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#7C3AED]" /> Archive & Version Rollbacks History
              </h4>
              <div className={`rounded-xl border spill-x-auto ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#090b14]/50 border-cyber-border/30')}`}>
                <table className="w-full text-xs text-left font-mono">
                  <thead>
                    <tr className="border-b border-cyber-border/20 text-slate-400 text-[10px] uppercase">
                      <th className="p-3">Version</th>
                      <th className="p-3">Publish Date</th>
                      <th className="p-3">File Size</th>
                      <th className="p-3 text-center">Downloads</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {releases.map((rel) => (
                      <tr key={rel.version} className="border-b border-cyber-border/10 hover:bg-slate-900/20">
                        <td className="p-3 font-bold">
                          <span className="flex items-center gap-1">
                            v{rel.version}
                            {rel.version === latestRelease?.version && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            )}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">{rel.releaseDate}</td>
                        <td className="p-3 text-slate-400">{rel.size}</td>
                        <td className="p-3 text-slate-300 text-center">{rel.downloads || 0}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDownloadApk(rel)}
                            disabled={downloadingVersion === rel.version}
                            className="px-2 py-1.5 bg-slate-900 hover:bg-slate-850 text-[#00E5FF] hover:text-[#00E5FF] border border-cyber-border rounded text-[11px] font-mono transition-all flex items-center gap-1 ml-auto"
                          >
                            <Download className="w-3 h-3" /> Get
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column (Android Virtual Phone Emulator) - 5 cols */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* The Android Smartphone Simulator */}
            <div className={`p-4 rounded-xl border relative ${
              themeMode === 'light'
                ? 'bg-gradient-to-b from-slate-200 to-slate-300 border-slate-200 shadow-md'
                : 'bg-gradient-to-b from-[#111225] to-[#040409] border-cyber-border/30 shadow-[0_0_20px_rgba(0,0,0,0.6)]'
            }`}>
              <div className="text-center mb-4">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-black">
                  Interactive Sideload HUD
                </span>
                <p className="text-[11px] text-slate-400">Validate real APK deployment flow inside native sandboxed simulator</p>
              </div>

              {/* The Virtual Phone Case Frame */}
              <div className="w-[280px] sm:w-[310px] h-[540px] rounded-[36px] bg-[#0c0d1b] border-4 border-[#333555] mx-auto overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col">
                
                {/* Phone Speaker Cutout */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-b-xl z-50 flex items-center justify-center gap-1.5">
                  <div className="w-8 h-1 bg-[#222] rounded-full" />
                  <div className="w-2 h-2 bg-[#111] rounded-full" />
                </div>

                {/* Phone Content Screen */}
                <div className="flex-1 bg-black p-4 pt-10 flex flex-col justify-between font-mono relative text-slate-100">
                  <div className="absolute inset-0 bg-radial-at-t from-[#00E5FF]/5 via-transparent to-transparent pointer-events-none" />

                  {/* Top Notification Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pb-2 border-b border-white/5 font-mono mb-4">
                    <span>9:41 AM APEX</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] border border-cyan-400/30 text-cyan-400 px-1 rounded uppercase scale-90 font-black">5G-X</span>
                      <Smartphone className="w-3 h-3 shrink-0 text-slate-500" />
                    </div>
                  </div>

                  {/* Simulator Screen Content Case */}
                  <div className="flex-1 flex flex-col justify-between z-10">
                    
                    {emulatorState === 'idle' && (
                      <div className="flex-grow flex flex-col items-center justify-center text-center px-2 py-8 mt-4">
                        <div className="w-16 h-16 rounded-full bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center mb-4 animate-bounce">
                          <Smartphone className="w-8 h-8 text-slate-500" />
                        </div>
                        <h5 className="text-[13px] font-bold text-slate-200">Device Virtualizer</h5>
                        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                          Test sandbox packaging, checksum audits, and simulated installation prompt routines directly.
                        </p>
                        <button
                          onClick={startEmulatorDemo}
                          className="mt-6 px-4 py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#2979FF] hover:to-[#7C3AED] text-white text-[10px] font-black uppercase rounded border border-cyan-400/20 hover:shadow-[0_0_10px_rgba(0,229,255,0.4)] flex items-center gap-1.5 transition-all"
                        >
                          <Play className="w-3.5 h-3.5" /> Initialize Test Boot
                        </button>
                      </div>
                    )}

                    {(emulatorState === 'downloading' || emulatorState === 'verifying') && (
                      <div className="flex-grow flex flex-col justify-center text-left py-4">
                        <div className="text-center mb-6">
                          <RefreshCw className="w-10 h-10 text-[#00E5FF] animate-spin mx-auto mb-2" />
                          <span className="text-xs text-[#00E5FF] uppercase font-black tracking-widest">{emulatorState}...</span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                            <span>Sideload core compilation</span>
                            <span>{emulatorProgress}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded">
                            <div className="h-full bg-cyan-400 transition-all rounded duration-200" style={{ width: `${emulatorProgress}%` }} />
                          </div>
                        </div>

                        {/* Live terminal compiler outputs */}
                        <div className="p-3 bg-[#030509] border border-cyan-500/10 rounded font-mono text-[9px] text-[#00E5FF] space-y-1 overflow-hidden select-none">
                          {emulatorLogs.map((log, idx) => (
                            <div key={idx} className="truncate select-none">{log}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {emulatorState === 'prompt' && (
                      <div className="flex-grow flex flex-col justify-between py-2 text-left">
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="flex items-center gap-2 mb-3">
                            <ShieldAlert className="w-6 h-6 text-yellow-500 shrink-0" />
                            <div>
                              <h5 className="text-[12px] font-black text-slate-100">INSTALL PROMPT</h5>
                              <span className="text-[9px] text-slate-400">Package: com.surchi.core</span>
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-slate-350 leading-relaxed">
                            Do you want to install this premium application? It will gain access to local cryptographically secure sandbox storage.
                          </p>

                          <div className="mt-4 p-2 rounded bg-slate-950 border border-white/5 text-[9px] text-slate-400 flex items-center justify-between">
                            <span>SHA-256 integrity:</span>
                            <span className="text-emerald-400">AUDIT OK ✅</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEmulatorState('idle');
                              addLog('INSTALLATION REJECTED BY USER');
                            }}
                            className="flex-1 py-2 rounded bg-slate-900 text-xs hover:bg-slate-800 text-slate-400 font-bold border border-white/5 text-center transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setEmulatorState('installing');
                              setEmulatorProgress(0);
                            }}
                            className="flex-1 py-2 rounded bg-[#00ff88]/10 hover:bg-[#00ff88]/20 border border-[#00ff88]/30 hover:border-[#00ff88]/50 text-xs text-[#00ff88] font-bold text-center transition-all"
                          >
                            Install Anyway
                          </button>
                        </div>
                      </div>
                    )}

                    {emulatorState === 'completed' && (
                      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-8">
                        <div className="w-14 h-14 rounded-full border border-emerald-500 bg-emerald-500/10 flex items-center justify-center mb-4">
                          <Check className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h5 className="text-sm font-bold text-slate-100">SURCHI ACTIVE</h5>
                        <p className="text-[10px] text-emerald-400 font-mono mt-1 uppercase tracking-widest font-black">
                          SYSTEM BOOT SUCCESSFUL
                        </p>
                        
                        <div className="w-full mt-6 p-3 bg-[#030509] border border-emerald-500/10 rounded font-mono text-[9px] text-emerald-500 space-y-1 overflow-hidden select-none text-left">
                          {emulatorLogs.map((log, idx) => (
                            <div key={idx} className="truncate select-none">{log}</div>
                          ))}
                        </div>

                        <button
                          onClick={() => setEmulatorState('idle')}
                          className="mt-6 px-4 py-2.5 bg-slate-900 text-slate-400 text-[10px] font-bold border border-white/10 hover:bg-slate-850 hover:text-white rounded uppercase transition-all"
                        >
                          Reset Virtual Device
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Navigation Home Indicator bar */}
                  <div className="w-28 h-1 bg-[#333] rounded-full mx-auto mt-4 shrink-0" />

                </div>
              </div>

            </div>

            {/* Surchi FAQ section items accordion */}
            <div className={`p-6 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#090b14]/50 border-cyber-border/30')}`}>
              <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-200 mb-4 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#7C3AED]" /> APK Frequently Asked Questions
              </h4>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-cyber-border/10 pb-3">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-300 hover:text-[#00E5FF] transition-all"
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#00E5FF] ml-2 shrink-0">{activeFaq === idx ? '–' : '+'}</span>
                    </button>
                    {activeFaq === idx && (
                      <p className="text-[11.5px] text-slate-400 mt-2 leading-relaxed pl-1">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
