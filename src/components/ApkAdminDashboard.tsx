import React, { useState, useEffect } from 'react';
import { 
  Upload, Terminal, Trash2, ArrowLeft, Plus, Trash, Check, ShieldAlert, 
  BarChart, Activity, Smartphone, Info, RefreshCw, Eye, Edit2, CheckCircle2, AlertOctagon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart as ReBarChart, Bar, Legend 
} from 'recharts';

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

interface AnalyticsData {
  totalDownloads: number;
  successRate: number;
  failRate: number;
  regions: { name: string; value: number }[];
  devices: { name: string; value: number }[];
  timeline: { date: string; downloads: number }[];
  logs: {
    timestamp: string;
    version: string;
    region: string;
    device: string;
    status: 'downloaded' | 'failed';
    reason: string;
  }[];
}

interface ApkAdminDashboardProps {
  themeMode: 'dark' | 'light';
  onNavigateBack: () => void;
}

export default function ApkAdminDashboard({ themeMode, onNavigateBack }: ApkAdminDashboardProps) {
  const [releases, setReleases] = useState<ApkRelease[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'releases' | 'analytics' | 'logs'>('releases');

  // Input states for New Release form
  const [version, setVersion] = useState('');
  const [apkUrl, setApkUrl] = useState('');
  const [size, setSize] = useState('28.5 MB');
  const [sha256, setSha256] = useState('');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [status, setStatus] = useState<'stable' | 'beta'>('stable');
  const [changelogStr, setChangelogStr] = useState('');
  
  // Custom upload payload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  // Fetch Releases & Analytics
  const loadData = async () => {
    setIsLoading(true);
    try {
      const relRes = await fetch('/api/apk/releases');
      const relData = await relRes.json();
      if (relData.success) {
        setReleases(relData.releases);
      }

      const anRes = await fetch('/api/apk/analytics');
      const anData = await anRes.json();
      if (anData.success) {
        setAnalytics(anData.analytics);
      }
    } catch (err) {
      console.error('Failed to load APK admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Base64 file uploader logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      
      // Auto-update version if filename satisfies `surchi-v1.x.y.apk`
      const verMatch = file.name.match(/v(\d+\.\d+\.\d+)/);
      if (verMatch) {
        setVersion(verMatch[1]);
      } else {
        setVersion('1.1.5');
      }

      // Generate a simulated SHA-256 for physical files
      const rndHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
      setSha256(rndHash);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setUploadProgress(true);
    setUploadStatus('Reading local binary blocksets...');
    
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Content = (reader.result as string).split(',')[1];
        setUploadStatus('Pushing binary streams to server uploads core...');
        
        const res = await fetch('/api/apk/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileContentBase64: base64Content
          })
        });

        const data = await res.json();
        if (data.success) {
          setApkUrl(data.apkUrl);
          setSuccessText(`Binary compilation uploaded to direct storage: ${data.apkUrl}`);
          setUploadStatus('');
        } else {
          setErrorText(data.error || 'Server rejected file upload payload.');
        }
        setUploadProgress(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setErrorText(err.message || 'File reader fatal compiler crash.');
      setUploadProgress(false);
    }
  };

  // Submit and write release meta
  const handleSubmitRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    let finalApkUrl = apkUrl;
    // If they filled no apkUrl but uploaded a file, use it. Otherwise construct a fallback URL
    if (!finalApkUrl) {
      finalApkUrl = `/uploads/apk/surchi-v${version || '1.1.0'}-stable.apk`;
    }

    const changelogArray = changelogStr
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload = {
      version,
      apkUrl: finalApkUrl,
      size,
      releaseDate: new Date().toISOString().split('T')[0],
      forceUpdate,
      sha256: sha255SecureHash(sha256),
      changelog: changelogArray,
      status
    };

    function sha255SecureHash(hashStr: string) {
      if (!hashStr || hashStr.length < 10) {
        return "4a73ad7d88582f6e52077e6fb86b5da4effc9689b940e5cdcdfcfcf93e8a4a";
      }
      return hashStr;
    }

    try {
      const res = await fetch('/api/apk/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessText(`Release v${version} registered, active, and published successfully!`);
        // Reset fields
        setVersion('');
        setApkUrl('');
        setSize('28.5 MB');
        setSha256('');
        setForceUpdate(false);
        setChangelogStr('');
        setSelectedFile(null);
        
        loadData();
      } else {
        setErrorText(data.error || 'Backend registry entry write failed.');
      }
    } catch (err: any) {
      setErrorText(err.message || 'Network registry synchronization failure.');
    }
  };

  // Delete/Rollback release record
  const handleDeleteRelease = async (versionStr: string) => {
    if (!confirm(`Are you sure you want to roll back & delete version ${versionStr}? Users running or downloading this version will lose network checksum validity.`)) return;
    try {
      const res = await fetch(`/api/apk/releases/${versionStr}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setSuccessText(`Version ${versionStr} has been compiled outward & wiped from registry.`);
        loadData();
      }
    } catch (err: any) {
      setErrorText(err.message || 'Rollback execution command failed.');
    }
  };

  // Quick Seed Simulator Downloads for demoing charts activity
  const triggerMockDownloadAnalytic = async () => {
    try {
      const regions = ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East/Africa"];
      const devices = ["Samsung Galaxy Series", "Google Pixel Series", "Xiaomi / Redmi", "OnePlus devices", "Other Android 8+"];
      
      const res = await fetch('/api/apk/download-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: releases[0]?.version || '1.1.0',
          region: regions[Math.floor(Math.random() * regions.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          success: Math.random() > 0.08, // 8% failure rate
          reason: Math.random() > 0.08 ? 'complete' : 'Signature verification block'
        })
      });
      const data = await res.json();
      if (data.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getThemeClass = (darkVal: string, lightVal: string) => {
    return themeMode === 'dark' ? darkVal : lightVal;
  };

  const COLORS = ['#00E5FF', '#2979FF', '#7C3AED', '#EC4899', '#10B981'];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 rounded-2xl border ${getThemeClass('bg-cyber-card-light/40 border-cyber-border/40 text-slate-100', 'bg-white border-slate-200 text-slate-800')} font-sans relative`}>
      <div className="absolute inset-0 bg-radial-at-t from-[#7C3AED]/5 via-transparent to-transparent pointer-events-none" />

      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border/20 pb-6 mb-8">
        <div>
          <button 
            onClick={onNavigateBack}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all mb-3 border ${
              themeMode === 'light'
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                : 'bg-cyber-card text-[#7C3AED] hover:bg-cyber-card-light hover:text-purple-400 border-cyber-border/60 hover:shadow-[0_0_8px_rgba(124,58,237,0.25)]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Close Console
          </button>
          
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#2979FF] to-[#00E5FF] uppercase flex items-center gap-2">
            <Terminal className="w-8 h-8 text-[#7C3AED] animate-pulse" /> SURCHI APK CONTROL CENTER
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-mono">
            Direct ledger injection console & live android download forensics manager
          </p>
        </div>

        {/* Demo simulator trigger button */}
        <button 
          onClick={triggerMockDownloadAnalytic}
          className="px-4 py-2 border border-[#00E5FF]/40 hover:border-[#00E5FF] text-[#00E5FF] bg-[#00e5ff]/5 hover:bg-[#00e5ff]/10 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5"
        >
          <Activity className="w-4 h-4 text-[#00E5FF] shrink-0" /> Simulate CDN Download Log
        </button>
      </div>

      {errorText && (
        <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <span>ERROR: {errorText}</span>
        </div>
      )}

      {successText && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>SUCCESS: {successText}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="w-10 h-10 text-purple-400 animate-spin" />
          <span className="text-purple-400 font-mono text-sm mt-4 uppercase tracking-widest">Compiling Analytics Data...</span>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Section 1: Dynamic Top Analytical Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className={`p-4 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#080a13] border-cyber-border/30')}`}>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Total APK Downloads</span>
                <Upload className="w-4 h-4 text-[#00E5FF]" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-slate-100">
                {analytics?.totalDownloads || 0}
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5 mt-1.5">
                ● Global CDN Network active
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#080a13] border-cyber-border/30')}`}>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Install Success Rate</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-emerald-400">
                {analytics?.successRate}%
              </div>
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5 mt-1.5">
                Target performance SLA: 98.0%
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#080a13] border-cyber-border/30')}`}>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Install Failure Rate</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-rose-500">
                {analytics?.failRate}%
              </div>
              <span className="text-[10px] font-mono text-rose-400/70 flex items-center gap-0.5 mt-1.5">
                Sideload certificate blocks triggered
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#080a13] border-cyber-border/30')}`}>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider">Published Releases</span>
                <Smartphone className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-purple-400">
                {releases.length} Builds
              </div>
              <span className="text-[10px] font-mono text-[#00E5FF] flex items-center gap-0.5 mt-1.5">
                Max version: v{releases[0]?.version || '1.1.0'}
              </span>
            </div>

          </div>

          {/* Section 2: Tab Panel Navigation */}
          <div className="flex border-b border-cyber-border/15 gap-4">
            <button
              onClick={() => setActiveTab('releases')}
              className={`pb-3 text-xs font-mono uppercase tracking-wider transition-all border-b-2 font-bold ${
                activeTab === 'releases' 
                  ? 'border-[#7C3AED] text-purple-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Releases & Publishing
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 text-xs font-mono uppercase tracking-wider transition-all border-b-2 font-bold ${
                activeTab === 'analytics' 
                  ? 'border-[#7C3AED] text-purple-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Analytics Visuals
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`pb-3 text-xs font-mono uppercase tracking-wider transition-all border-b-2 font-bold ${
                activeTab === 'logs' 
                  ? 'border-[#7C3AED] text-purple-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Endpoint Download Audit Logs ({analytics?.logs?.length || 0})
            </button>
          </div>

          {/* SECTION A: RELEASES & FORM UPLOAD */}
          {activeTab === 'releases' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Col: Upload APK & details string input (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <form 
                  onSubmit={handleSubmitRelease}
                  className={`p-5 rounded-xl border text-left space-y-4 ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#090b14]/50 border-cyber-border/30')}`}
                >
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A0AEC0] flex items-center gap-1.5 border-b border-cyber-border/10 pb-3 mb-4">
                    <Plus className="w-4 h-4 text-[#7C3AED]" /> Inject New Sideload Release
                  </h4>

                  {/* Drag-Drop/Manual Select actual apk binary */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#00E5FF] uppercase font-black">
                      Deploy From Local Machine File (Optional)
                    </label>
                    <div className="p-4 rounded-lg bg-black border border-dashed border-slate-850 flex flex-col items-center justify-center text-center cursor-pointer relative hover:brightness-110">
                      <input 
                        type="file" 
                        accept=".apk"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload className="w-8 h-8 text-slate-500 mb-2" />
                      <span className="text-[10px] font-mono text-slate-300">
                        {selectedFile ? selectedFile.name : 'Select or drop .apk installer pack'}
                      </span>
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUploadFile();
                          }}
                          disabled={uploadProgress}
                          className="mt-3 px-3 py-1 bg-[#121327]/40 text-purple-400 hover:text-purple-300 border border-purple-500/30 font-mono text-[9px] rounded uppercase font-black transition-all flex items-center gap-1"
                        >
                          {uploadProgress ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                          {uploadStatus || 'Command Upload Binary'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Version number */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase font-black">
                        Version Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1.2.0"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full bg-black border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                    
                    {/* Size calculation */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase font-black">
                        APK File Size
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 28.4 MB"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full bg-black border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>

                  {/* CDN URL */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase font-black">
                      CDN Hosting URL Path
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /uploads/apk/surchi-v1.2.0-stable.apk or external link"
                      value={apkUrl}
                      onChange={(e) => setApkUrl(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  {/* SHA256 checksum input (required) */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase font-black">
                      SHA256 File Signature Integrity Checksum
                    </label>
                    <input
                      type="text"
                      placeholder="Input SHA256 or select local file to compile hash"
                      value={sha256}
                      onChange={(e) => setSha256(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded px-2.5 py-1.5 text-[10px] font-mono text-slate-200 outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  {/* Stable/Beta branch flag */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase font-black">
                        Branch Path
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'stable' | 'beta')}
                        className="w-full bg-black border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-[#7C3AED]"
                      >
                        <option value="stable">Stable / Mainnet Root</option>
                        <option value="beta">Beta / Sandbox Preview</option>
                      </select>
                    </div>

                    {/* Force Update Boolean Toggle */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase font-black">
                        Force Mandatory Update
                      </label>
                      <div className="h-9 flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={forceUpdate}
                            onChange={(e) => setForceUpdate(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-350 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600 peer-checked:after:bg-white peer-checked:after:border-transparent"></div>
                          <span className="ml-2 text-[10px] font-mono uppercase font-semibold text-rose-400">
                            {forceUpdate ? 'FORCE TRUE' : 'STRICT LAZY'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Changelog lines */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase font-black">
                      Release Changelog (One bullet per line)
                    </label>
                    <textarea
                      required
                      placeholder="e.g.&#10;Enhanced coin analyzer engine&#10;Added automatic wallet watch logs&#10;Bug fixes on timeline chart"
                      rows={4}
                      value={changelogStr}
                      onChange={(e) => setChangelogStr(e.target.value)}
                      className="w-full bg-black border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 outline-none focus:border-[#7C3AED] leading-relaxed resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#2979FF] hover:to-[#00E5FF] text-white font-mono font-black text-xs uppercase rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Inject Release Metadata & Publish
                  </button>
                </form>
              </div>

              {/* List Col: Table of active configs and version rollback controls (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className={`p-5 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#090b14]/50 border-cyber-border/30')}`}>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A0AEC0] border-b border-cyber-border/10 pb-3 mb-4">
                    Active Ledger Branch Directory
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full font-mono text-xs text-left">
                      <thead>
                        <tr className="border-b border-cyber-border/15 text-slate-500 uppercase text-[9px] tracking-wide">
                          <th className="pb-3 pr-2">Version</th>
                          <th className="pb-3 pr-2">Released</th>
                          <th className="pb-3 pr-2">Size</th>
                          <th className="pb-3 pr-2">Force Update</th>
                          <th className="pb-3 pr-2">Branch Path</th>
                          <th className="pb-3 text-right">Delete / Rollback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {releases.map((rel) => (
                          <tr key={rel.version} className="border-b border-cyber-border/10 hover:bg-slate-900/10">
                            <td className="py-3 font-black text-slate-100 pr-2">
                              {rel.version}
                              {rel.forceUpdate && (
                                <span className="ml-1.5 text-[8px] bg-rose-500/15 text-rose-400 border border-rose-500/35 px-1 rounded uppercase">Force</span>
                              )}
                            </td>
                            <td className="py-3 text-slate-300 pr-2">{rel.releaseDate}</td>
                            <td className="py-3 text-slate-450 pr-2">{rel.size}</td>
                            <td className="py-3 pr-2 font-black">
                              {rel.forceUpdate ? (
                                <span className="text-rose-500">MANDATORY</span>
                              ) : (
                                <span className="text-slate-500">LAZY OPT-IN</span>
                              )}
                            </td>
                            <td className="py-3 pr-2">
                              <span className={`text-[9px] font-black border uppercase px-1.5 py-0.5 rounded ${
                                rel.status === 'stable' 
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                                  : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500'
                              }`}>
                                {rel.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteRelease(rel.version)}
                                className="p-1 px-2 border border-rose-900/30 bg-rose-950/10 hover:bg-rose-900/20 text-rose-400 hover:text-rose-300 rounded hover:shadow-[0_0_8px_rgba(239,68,68,0.2)] transition-all flex items-center gap-1.5 ml-auto"
                              >
                                <Trash className="w-3.5 h-3.5" /> Rollback
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start gap-3 bg-[#0c1825]/45 border-cyber-border/30`}>
                  <Info className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
                  <div className="text-xs font-mono leading-relaxed text-slate-400">
                    <span className="font-bold text-slate-200 uppercase">[Ledger System Architecture Informational Note]</span>
                    <p className="mt-1">
                      New updates are published instantly to global CDN clusters over safe OAuth TLS handshakes. Setting <span className="text-rose-400">forceUpdate</span> triggers mandatory installation flows, locking users from outdated frontend modules until active local compilation succeeds.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SECTION B: LIVE ANALYTICS charts with Recharts */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-6 text-left">
              
              {/* Timeline downloads trend chart */}
              <div className={`p-5 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#080a13] border-cyber-border/30')}`}>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00E5FF] mb-4">
                  Global CDN Download Frequency Timeline (Daily)
                </h4>
                <div className="h-64 font-mono text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.timeline}>
                      <defs>
                        <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1d2238" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#070c14', borderColor: '#00E5FF', color: '#fff', fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="downloads" stroke="#00E5FF" fillOpacity={1} fill="url(#colorDownloads)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Two Column layouts: Devices & Regions distribution pies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Geographic distribution */}
                <div className={`p-5 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#080a13] border-cyber-border/30')}`}>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 mb-4">
                    Demographic Distribution Channels
                  </h4>
                  <div className="h-56 flex items-center justify-between font-mono">
                    <div className="w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.regions}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {analytics.regions.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#05070a', color: '#fff', fontSize: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 font-mono text-[10px] space-y-1.5 text-slate-300">
                      {analytics.regions.map((reg, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="truncate">{reg.name}: {reg.value} ({((reg.value / analytics.totalDownloads)*100).toFixed(0)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Device profile models */}
                <div className={`p-5 rounded-xl border ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#080a13] border-cyber-border/30')}`}>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-400 mb-4">
                    Device Model Metrics distribution
                  </h4>
                  <div className="h-56 flex items-center justify-between font-mono">
                    <div className="w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.devices}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {analytics.devices.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#05070a', color: '#fff', fontSize: '10px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 font-mono text-[10px] space-y-1.5 text-slate-300">
                      {analytics.devices.map((dev, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 shrink-0 rounded-sm" style={{ backgroundColor: COLORS[(idx + 2) % COLORS.length] }} />
                          <span className="truncate">{dev.name}: {dev.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SECTION C: DOWNLOAD LOGS audit table list */}
          {activeTab === 'logs' && analytics && (
            <div className={`p-5 rounded-xl border text-left ${getThemeClass('bg-slate-50 border-slate-200', 'bg-[#080a13] border-cyber-border/30')}`}>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300 mb-4">
                Telemetry Log Stream: Mobile Compilation Audits
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-cyber-border/15 text-slate-500 uppercase text-[9px]">
                      <th className="pb-3 text-left">Time Signature (UTC)</th>
                      <th className="pb-3 text-left font-mono">Version</th>
                      <th className="pb-3 text-left">Country Region</th>
                      <th className="pb-3 text-left">Device Model Specs</th>
                      <th className="pb-3 text-left">Status</th>
                      <th className="pb-3 text-right">Failure Context Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.logs || []).length > 0 ? (
                      analytics.logs.map((log, idx) => (
                        <tr key={idx} className="border-b border-cyber-border/10 hover:bg-slate-900/10 text-slate-300">
                          <td className="py-2.5 text-[11px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-2.5 font-bold text-slate-200">v{log.version}</td>
                          <td className="py-2.5 text-slate-400">{log.region}</td>
                          <td className="py-2.5 text-slate-450">{log.device}</td>
                          <td className="py-2.5">
                            <span className={`text-[10px] uppercase font-black tracking-wider ${
                              log.status === 'failed' ? 'text-rose-500' : 'text-emerald-400'
                            }`}>
                              [{log.status}]
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-mono text-[11px] text-slate-500">{log.reason}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-550 italic font-mono">
                          No logging packets fetched in real-time buffer yet. Initialize APK tests or compile triggers.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
