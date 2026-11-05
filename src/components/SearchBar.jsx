import React, { useRef, useEffect } from 'react';
import { Search, Sparkles, BookOpen, Layers, Quote, X, Zap, ChevronDown, Compass } from 'lucide-react';

export const MODES = [
  { id: 'hybrid', label: 'Hybrid (RRF)', icon: Sparkles, desc: 'Reciprocal Rank Fusion of BM25 + Dense' },
  { id: 'bm25', label: 'BM25 Lexical', icon: BookOpen, desc: 'Okapi BM25 with length normalization' },
  { id: 'dense', label: 'Dense Vector', icon: Layers, desc: 'FAISS / Cosine semantic embeddings' },
  { id: 'phrase', label: 'Exact Phrase', icon: Quote, desc: 'Positional index contiguous phrase matching' },
];

export function SearchBar({
  query,
  setQuery,
  onSearch,
  mode,
  setMode,
  topK,
  setTopK,
  latency,
  totalHits,
  isLoading,
}) {
  const inputRef = useRef(null);

  // Keyboard shortcut: '/' or 'Cmd+K' focuses search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  const sampleQueries = [
    "inverted index positional",
    "web hyperlink graph pagerank",
    "stanford university research",
    "disk seek latency ram transfer",
    "evaluation metrics precision recall",
  ];

  return (
    <div className="w-full max-w-5xl mx-auto pt-6 pb-2 px-4">
      {/* Main Elevated Search Card */}
      <div className="bg-white rounded-2xl shadow-card-clean border border-black/[0.04] p-4 sm:p-5 transition-shadow hover:shadow-card-hover">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 text-xs text-gray-400 font-semibold tracking-wider uppercase">
          <div className="flex items-center gap-2 text-gray-500">
            <Compass className="w-4 h-4 text-gray-400" />
            <span>GLOBAL RETRIEVAL QUERY</span>
          </div>

          <div className="flex items-center gap-2">
            {latency !== null && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {latency.toFixed(2)} ms
                {totalHits !== undefined && <span className="text-emerald-700 ml-0.5">({totalHits} hits)</span>}
              </span>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-3 bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-4 py-3 focus-within:border-gray-900 focus-within:bg-white focus-within:shadow-sm transition-all">
          <Search className={`w-5 h-5 shrink-0 transition-colors ${isLoading ? 'text-indigo-600 animate-pulse' : 'text-gray-400'}`} />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documents, terms, or exact phrases (e.g., 'inverted index', 'pagerank')..."
            className="w-full bg-transparent border-none text-gray-900 placeholder-gray-400 font-medium text-sm sm:text-base focus:outline-none focus:ring-0"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-gray-200 text-gray-400 text-xs font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 shadow-sm text-[11px] text-gray-600 font-semibold">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Controls Bar: Mode Pills & Top-K Dropdown */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Mode Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F3F4F6] p-1 rounded-xl border border-black/[0.03]">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    if (query) onSearch(query, m.id, topK);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#1E2024] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                  title={m.desc}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Top-K Selector & Action */}
          <div className="flex items-center gap-2">
            <div className="relative inline-flex items-center bg-[#F3F4F6] hover:bg-[#ECEEF2] border border-black/[0.04] rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors cursor-pointer">
              <span className="text-gray-400 mr-1.5 font-normal">Top-K:</span>
              <select
                value={topK}
                onChange={(e) => {
                  const newK = Number(e.target.value);
                  setTopK(newK);
                  if (query) onSearch(query, mode, newK);
                }}
                className="bg-transparent border-none text-gray-900 font-bold focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                <option value="5">5 results</option>
                <option value="10">10 results</option>
                <option value="25">25 results</option>
                <option value="50">50 results</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
            </div>

            <button
              onClick={() => onSearch(query)}
              className="px-4 py-1.5 rounded-xl bg-[#1E2024] hover:bg-[#2C303B] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Query Suggestions Pills */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-gray-400 font-medium text-[11px] shrink-0">Popular:</span>
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(sample);
                onSearch(sample);
              }}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-gray-200/70 text-gray-600 hover:text-gray-900 text-[11px] font-medium transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
