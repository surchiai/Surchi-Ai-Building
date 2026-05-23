import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Newspaper, 
  Zap, 
  RefreshCw, 
  TrendingUp, 
  ExternalLink, 
  Flame, 
  TrendingDown, 
  Clock, 
  Sliders, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Share2,
  Volume2
} from 'lucide-react';

interface NewsPost {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  publishedAt: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  imageUrl: string;
  summary: string;
}

const CATEGORIES = [
  { id: 'breaking', label: '📰 Breaking' },
  { id: 'bitcoin', label: '₿ Bitcoin' },
  { id: 'solana', label: '◎ Solana' },
  { id: 'ethereum', label: 'Ξ Ethereum' },
  { id: 'meme_coins', label: '🐕 Meme Coins' },
  { id: 'ai_tokens', label: '🧬 AI Tokens' },
  { id: 'defi', label: '🌊 DeFi' }
];

export default function LiveCryptoNews() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [category, setCategory] = useState<string>('breaking');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [voiceActiveId, setVoiceActiveId] = useState<string | null>(null);

  // Search debounce ref
  const debounceTimer = useRef<any>(null);

  // Swipe / pull down refresh state simulations
  const [startY, setStartY] = useState<number>(0);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [pullProgress, setPullProgress] = useState<number>(0);

  // Refs for infinite scroll (optional secondary)
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch News from Backend Proxy
  const fetchNews = async (catId: string, searchVal: string, pageNum: number, append = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setErrorMessage('');

    try {
      const url = `/api/crypto-news?category=${catId}&search=${encodeURIComponent(searchVal)}&page=${pageNum}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Proxy interface returned code: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        if (append) {
          setPosts(prev => {
            const combined = [...prev, ...data.posts];
            // Filter duplicates by unique ID
            return combined.filter((val, idx, self) => self.findIndex(t => t.id === val.id) === idx);
          });
        } else {
          setPosts(data.posts);
        }
        setIsSimulated(!!data.isSimulated);
      } else {
        throw new Error("Invalid posts schema received from the secure proxy");
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Quantum telemetry connection timeout');
      // If full catastrophic front-to-back offline grid failure, load client fallback procedurally
      if (!append) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Poll for live news updates every 30 seconds
  useEffect(() => {
    fetchNews(category, search, 1, false);
    setPage(1);
    setCountdown(30);
  }, [category, search]);

  // Handle countdown interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Trigger automatic silent update
          fetchNews(category, search, 1, false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [category, search]);

  // Carousel auto rotate interval (6 seconds)
  useEffect(() => {
    if (posts.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % Math.min(posts.length, 4));
    }, 6000);
    return () => clearInterval(interval);
  }, [posts]);

  // Handle Manual Refresh click
  const handleManualRefresh = () => {
    setCountdown(30);
    fetchNews(category, search, 1, false);
    setPage(1);
  };

  // Handle Load More
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(category, search, nextPage, true);
  };

  // Search Input Handler (Debounced to protect rate limits)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      // Input state is bound, triggering category reload
      setPage(1);
    }, 500);
  };

  // Touch handlers for mobile swipe-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    if (diff > 0) {
      // Only drag down
      const progress = Math.min(diff / 150, 1.0); // full at 150px drag
      setPullProgress(progress);
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    setIsPulling(false);
    if (pullProgress >= 0.8) {
      handleManualRefresh();
    }
    setPullProgress(0);
  };

  // Text-To-Speech (Voice reading) Feature
  const handleVoiceRead = (post: NewsPost) => {
    if ('speechSynthesis' in window) {
      if (voiceActiveId === post.id) {
        window.speechSynthesis.cancel();
        setVoiceActiveId(null);
        return;
      }
      window.speechSynthesis.cancel(); // Stop playing anything else
      
      const utterance = new SpeechSynthesisUtterance(`${post.title}. Analysis summary: ${post.summary}`);
      utterance.onend = () => {
        setVoiceActiveId(null);
      };
      utterance.onerror = () => {
        setVoiceActiveId(null);
      };
      setVoiceActiveId(post.id);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech option not fully supported in this browser version.");
    }
  };

  // Calculate Time Ago helper
  const formatTimeAgo = (isoString: string) => {
    const now = new Date("2026-05-22T23:20:46Z"); // Base anchor time
    const past = new Date(isoString);
    const msDiff = now.getTime() - past.getTime();
    const mins = Math.floor(msDiff / 60000);
    const hours = Math.floor(mins / 60);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Helper styles for sentiments
  const getSentimentStyles = (sent: string) => {
    if (sent === 'bullish') return { text: 'text-[#00ff88]', bg: 'bg-[#00ff88]/10', border: 'border-[#00ff88]/20', label: '🟢 BULLISH IMPACT' };
    if (sent === 'bearish') return { text: 'text-[#ff4b82]', bg: 'bg-[#ff4b82]/10', border: 'border-[#ff4b82]/20', label: '🔴 BEARISH IMPACT' };
    return { text: 'text-[#00e5ff]', bg: 'bg-[#00e5ff]/10', border: 'border-[#00e5ff]/20', label: '🔵 NEUTRAL SIGNAL' };
  };

  // Top trending carousel subset from current posts
  const trendingPosts = posts.filter(p => p.sentiment === 'bullish' || p.sentiment === 'neutral').slice(0, 4);

  return (
    <div 
      id="live-crypto-news-module"
      className="w-full max-w-7xl mx-auto mt-8 font-sans transition-all select-none space-y-6 animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Inline styles container for continuous marquee loop */}
      <style>{`
        @keyframes ticker-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker-marquee {
          display: inline-flex;
          animation: ticker-marquee 32s linear infinite;
        }
        .animate-ticker-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Touch refresh pull-bar simulator indicator */}
      {pullProgress > 0 && (
        <div 
          className="flex items-center justify-center p-2 text-cyber-cyan text-xs font-mono transition-transform"
          style={{ transform: `scale(${pullProgress})` }}
        >
          <RefreshCw className={`w-4 h-4 mr-2 text-cyber-cyan ${pullProgress >= 0.8 ? 'animate-spin' : ''}`} />
          <span>{pullProgress >= 0.8 ? 'Release to Refresh Oracle news Feed...' : 'Pull down to re-sync news matrix'}</span>
        </div>
      )}

      {/* MAIN BANNER CONTAINER HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-[#090a21] border border-cyber-cyan/30 rounded-xl shadow-[0_0_25px_rgba(0,229,255,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-pink/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyber-cyan/5 blur-3xl rounded-full"></div>
        
        {/* News logo and live telemetry status line */}
        <div className="flex items-center gap-3.5 text-left relative z-10">
          <div className="p-3 bg-gradient-to-br from-cyber-cyan to-cyber-purple text-[#050510] rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.25)] animate-pulse">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff88]"></span>
              </span>
              <h2 className="text-[#ffffff] font-display font-black text-lg sm:text-2xl uppercase tracking-widest">
                Live Crypto News
              </h2>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide uppercase mt-0.5">
              Secure Proxy Core &bull; Secure API Tunnel Syncing &bull; 30s Clock
            </p>
          </div>
        </div>

        {/* Live Refresh Counter & Network Switch */}
        <div className="flex items-center gap-3 relative z-10 md:self-end">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0e0e29] border border-cyber-border rounded-lg font-mono text-[10px]">
            <span className="text-slate-400 font-bold uppercase">NEXT MATRIX CYCLE:</span>
            <span className="text-cyber-cyan font-black animate-pulse">{countdown}s</span>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="p-2 sm:px-4 bg-[#141535] hover:bg-cyber-purple/25 text-cyber-cyan hover:text-cyber-neon border border-cyber-cyan/35 rounded-lg cursor-pointer transition-all flex items-center gap-2 text-[10px] font-mono select-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyber-cyan ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">REFRESH SYSTEM</span>
          </button>
        </div>
      </div>

      {/* CONTINUOUS BREAKING NEWS TRACK TICKER */}
      {posts.length > 0 && (
        <div className="bg-[#10070c] border border-rose-500/20 py-2.5 px-4 rounded-xl flex items-center gap-3 overflow-hidden text-xs relative select-none">
          <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ff4b82] text-[9px] font-black uppercase text-[#050510] tracking-widest animate-pulse font-mono shadow-[0_0_8px_rgba(255,75,130,0.3)]">
            <Flame className="w-3.5 h-3.5 text-[#050510]" />
            BREAKING NEWS
          </span>
          <div className="relative flex-1 overflow-hidden h-4">
            <div className="animate-ticker-marquee flex gap-12 text-[11px] font-mono text-rose-300">
              {/* Duplicate headlines to create a beautiful gapless infinite scroll in standard ticker */}
              <div className="flex gap-12 whitespace-nowrap">
                {posts.map(p => (
                  <span key={p.id} className="cursor-pointer hover:underline hover:text-[#ff4b82]" onClick={() => window.open(p.url, '_blank')}>
                    &bull; {p.title.toUpperCase()} — {p.sourceName.toUpperCase()}
                  </span>
                ))}
              </div>
              <div className="flex gap-12 whitespace-nowrap">
                {posts.map(p => (
                  <span key={`${p.id}-dup`} className="cursor-pointer hover:underline hover:text-[#ff4b82]" onClick={() => window.open(p.url, '_blank')}>
                    &bull; {p.title.toUpperCase()} — {p.sourceName.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRENDING CAROUSEL SLIDER (Top feature) */}
      {!loading && trendingPosts.length > 0 && (
        <div className="bg-gradient-to-r from-[#010103] via-[#050512] to-[#010103] border border-cyber-purple/20 rounded-xl p-5 relative overflow-hidden text-left shadow-lg">
          <div className="absolute top-0 right-0 py-1 px-3 bg-cyber-purple/15 text-cyber-purple border-b border-l border-cyber-purple/30 text-[8px] font-mono font-black uppercase tracking-wider rounded-bl animate-pulse">
            👑 Premium Trending Signal
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-5">
            {/* Slide Graphic */}
            <div className="w-full lg:w-1/3 h-40 max-h-40 relative rounded-lg overflow-hidden border border-cyber-border-light shadow-md shrink-0">
              <img 
                src={trendingPosts[carouselIndex].imageUrl} 
                alt="Trending cover thumbnail"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700 select-none brightness-90 saturate-120"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-[8px] font-mono font-extrabold ${getSentimentStyles(trendingPosts[carouselIndex].sentiment).bg} ${getSentimentStyles(trendingPosts[carouselIndex].sentiment).text} border ${getSentimentStyles(trendingPosts[carouselIndex].sentiment).border} uppercase tracking-wider`}>
                {trendingPosts[carouselIndex].sentiment}
              </span>
            </div>

            {/* Slide Metadata text */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2.5 text-[9px] font-mono text-slate-500 font-semibold uppercase">
                <span>{trendingPosts[carouselIndex].sourceName}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {formatTimeAgo(trendingPosts[carouselIndex].publishedAt)}
                </span>
                <span>&bull;</span>
                <span className="text-cyber-purple">TRENDING MATRICES</span>
              </div>
              <h3 
                className="text-white hover:text-cyber-cyan text-sm sm:text-lg font-display font-bold tracking-tight leading-snug cursor-pointer transition-colors"
                onClick={() => window.open(trendingPosts[carouselIndex].url, '_blank')}
              >
                {trendingPosts[carouselIndex].title}
              </h3>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                {trendingPosts[carouselIndex].summary}
              </p>

              {/* Slider Actions row */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <a
                    href={trendingPosts[carouselIndex].url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-mono font-black text-cyber-cyan hover:text-cyber-neon tracking-wide uppercase transition-colors"
                  >
                    <span>EXPLORE INTEL SHEETS</span>
                    <ExternalLink className="w-3 h-3 text-cyber-cyan shrink-0" />
                  </a>
                  <button
                    onClick={() => handleVoiceRead(trendingPosts[carouselIndex])}
                    className={`p-1.5 rounded bg-[#101030]/50 border border-cyber-purple/20 ${voiceActiveId === trendingPosts[carouselIndex].id ? 'text-cyber-neon border-cyber-purple' : 'text-slate-400 hover:text-cyber-purple'} transition-colors ml-1`}
                    title="Read article aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                </div>
                {/* Carousel Manual select controls */}
                <div className="flex items-center gap-1.5">
                  {trendingPosts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-350 bg-cyber-purple ${idx === carouselIndex ? 'w-5 opacity-100 bg-cyber-neon' : 'w-1.5 opacity-35 bg-purple-700'}`}
                      aria-label={`Slide target #${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED MULTI-OPTIONS CONTROLLERS PANEL */}
      <div className="space-y-4">
        {/* News Filters / Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Navigation Category Select tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:pb-0 scrollbar-none max-w-full">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 text-xs font-mono font-black uppercase tracking-wider border rounded-lg cursor-pointer transition-all select-none shrink-0 ${
                  category === cat.id
                    ? 'bg-cyber-purple border-cyber-purple text-white shadow-[0_0_12px_rgba(124,58,237,0.3)]'
                    : 'bg-[#09091b] border-cyber-border text-slate-400 hover:text-[#ffffff] hover:border-cyber-cyan/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Keyword and tokens Search Field Input */}
          <div className="relative w-full md:max-w-xs shrink-0 bg-[#060611] rounded-lg border border-cyber-border focus-within:border-cyber-cyan/50 focus-within:shadow-[0_0_8px_rgba(0,229,255,0.1)] transition-all">
            <span className="absolute left-3.5 top-2.5 text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search news signals, keywords..."
              className="w-full bg-transparent pl-10 pr-4 py-2 text-xs font-mono text-[#ffffff] focus:outline-none placeholder:text-slate-600"
            />
            {search && (
              <button 
                onClick={() => { setSearch(''); setPage(1); }} 
                className="absolute right-3.5 top-2 text-slate-500 hover:text-white"
              >
                <span className="text-xs">&times;</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* FEED RESULTS LEDGER PANEL CONTAINER */}
      <div className="space-y-4">
        
        {/* Loading Matrix indicator state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div 
                key={idx} 
                className="bg-[#0b0c22] border border-cyber-border rounded-xl p-4 space-y-4 animate-pulse h-80 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-full h-36 bg-[#161730] rounded-lg"></div>
                  <div className="h-2.5 w-1/3 bg-[#161730] rounded"></div>
                  <div className="h-4 w-full bg-[#161730] rounded"></div>
                  <div className="h-3.5 w-5/6 bg-[#161730] rounded"></div>
                </div>
                <div className="h-3 w-1/2 bg-[#161730] rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Failed fetch matrix fallbacks alert */}
        {!loading && errorMessage && posts.length === 0 && (
          <div className="p-6 bg-rose-950/15 border border-rose-500/25 rounded-xl text-center space-y-3 max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-[#ff4b82] mx-auto animate-bounce" />
            <h4 className="text-sm font-bold uppercase text-white font-mono">DEX News Grid Offline</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              We encountered a slight quantum latency sync issue ({errorMessage}). Attempting core matrix recovery protocols.
            </p>
            <button 
              onClick={handleManualRefresh}
              className="px-4 py-2 bg-[#ff4b82]/10 border border-[#ff4b82]/35 text-[#ff4b82] hover:bg-[#ff4b82]/20 rounded-lg text-xs font-mono transition-colors"
            >
              RETREAD COGNITIVE TUNNEL
            </button>
          </div>
        )}

        {/* Empty Search / Empty news results */}
        {!loading && posts.length === 0 && !errorMessage && (
          <div className="p-12 text-center bg-[#070719] border border-cyber-border/60 rounded-xl space-y-4 max-w-md mx-auto flex flex-col items-center">
            <HelpCircle className="w-10 h-10 text-slate-600 animate-pulse" />
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-white font-mono uppercase">Unresolved News Coordinates</h4>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                No active matching articles found in category or search results. Alter filter indices to proceed.
              </p>
            </div>
            {search && (
              <button 
                onClick={() => { setSearch(''); }}
                className="px-4 py-1.5 bg-[#1a1b38] border border-cyber-border rounded-lg text-xs text-cyber-cyan font-mono"
              >
                REFRESH FILTER MATRIX
              </button>
            )}
          </div>
        )}

        {/* Main interactive items cards lists grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-left">
            {posts.map((post) => {
              const semStyle = getSentimentStyles(post.sentiment);
              return (
                <article 
                  key={post.id}
                  className="bg-[#0b0c22]/95 border border-cyber-cyan/15 hover:border-cyber-cyan/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,191,255,0.08)] hover:-translate-y-1 group flex flex-col justify-between h-auto"
                >
                  <div className="space-y-3">
                    {/* Splash card element overlay */}
                    <div className="h-36 max-h-36 w-full relative overflow-hidden bg-slate-900 border-b border-cyber-border-light select-none">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-500 brightness-90 saturate-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                      
                      {/* Sentiment floating badge */}
                      <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[8.5px] font-mono font-black ${semStyle.bg} ${semStyle.text} border ${semStyle.border} uppercase shadow-lg select-none`}>
                        {semStyle.label}
                      </span>

                      {/* Floating dynamic Voice Read trigger */}
                      <button
                        onClick={() => handleVoiceRead(post)}
                        className={`absolute bottom-2.5 right-2.5 p-1.5 rounded-full ${voiceActiveId === post.id ? 'bg-[#ff4b82] text-[#050510]' : 'bg-black/60 text-slate-350 hover:bg-black/90 hover:text-white'} transition-all`}
                        title="Read news details"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata indicators header */}
                    <div className="px-4.5 space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span className="font-bold uppercase tracking-wider">{post.sourceName}</span>
                        <span className="flex items-center gap-1 uppercase">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {formatTimeAgo(post.publishedAt)}
                        </span>
                      </div>

                      {/* Header link and text title */}
                      <h3 
                        onClick={() => window.open(post.url, '_blank')}
                        className="text-white group-hover:text-cyber-cyan text-sm sm:text-sm font-display font-bold leading-snug cursor-pointer line-clamp-2 select-text transition-colors"
                      >
                        {post.title}
                      </h3>

                      {/* AI Brief analysis text */}
                      <p className="text-slate-400 text-xs font-sans leading-relaxed line-clamp-3 select-text bg-[#030310]/50 p-2.5 rounded border border-cyber-border-light">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  {/* Absolute actions row footer */}
                  <div className="px-4.5 pb-4 mt-3 pt-3 border-t border-cyber-border/40 flex items-center justify-between text-[11px] font-mono">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-bold text-cyber-cyan hover:text-cyber-neon"
                    >
                      <span>EXPLORE INSIGHT</span>
                      <ExternalLink className="w-3 h-3 text-cyber-cyan" />
                    </a>
                    {isSimulated && (
                      <span className="text-[7.5px] font-black text-slate-600 bg-[#16172f]/40 px-1 py-0.25 rounded uppercase border border-cyber-border select-none" title="Synthesized locally based on global tickers">
                        ⚡ AI SIM SYSTEM
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Load More Matrix activation trigger */}
        {!loading && posts.length > 0 && (
          <div className="pt-6 text-center select-none pb-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-[#0d0d1e] hover:bg-[#131435] border border-cyber-cyan/30 hover:border-cyber-cyan shadow-md text-cyber-cyan hover:text-white rounded-lg text-xs font-bold font-mono tracking-widest cursor-pointer transition-all disabled:opacity-50 select-none inline-flex items-center gap-2 uppercase"
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="w-4 h-4 text-cyber-cyan animate-spin" />
                  <span>SYNCING NEXT DATASETS...</span>
                </>
              ) : (
                <>
                  <span>LOAD NEXT SIGNAL MATRIX</span>
                  <ChevronRight className="w-4 h-4 text-cyber-cyan" />
                </>
              )}
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
