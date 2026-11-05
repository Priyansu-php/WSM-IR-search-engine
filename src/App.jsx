import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ZeroState } from './components/ZeroState';
import { BenchmarkDashboard } from './components/BenchmarkDashboard';
import { AlertCircle, RefreshCw, Terminal, Layers } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export function App() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'benchmark'
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('hybrid');
  const [topK, setTopK] = useState(10);
  const [results, setResults] = useState([]);
  const [totalHits, setTotalHits] = useState(undefined);
  const [latency, setLatency] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [stats, setStats] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // Poll system stats & health probe
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Search execution handler
  const handleSearch = useCallback(
    async (searchQuery = query, searchMode = mode, searchK = topK) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) {
        setResults([]);
        setLatency(null);
        setTotalHits(undefined);
        return;
      }

      setIsLoading(true);
      setSearchError(null);
      const t0 = performance.now();

      try {
        const params = new URLSearchParams({
          q: trimmed,
          mode: searchMode,
          top_k: searchK.toString(),
          phrase: searchMode === 'phrase' ? 'true' : 'false',
        });

        const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Server returned status ${res.status}`);
        }

        const data = await res.json();
        const clientRoundtripMs = performance.now() - t0;

        setResults(data.hits || []);
        setTotalHits(data.total_hits);
        setLatency(data.latency_ms || clientRoundtripMs);
        setIsOnline(true);
      } catch (err) {
        console.error('Search query failed:', err);
        setSearchError(err.message || 'Failed to connect to search engine.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [query, mode, topK]
  );

  return (
    <div className="min-h-screen bg-[#EAEEF3] text-gray-900 flex flex-col font-sans">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        isOnline={isOnline}
      />

      {/* Backend Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs font-mono text-amber-800 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            IR Engine backend is offline on <code className="bg-amber-100/80 px-1 py-0.5 rounded font-bold">http://127.0.0.1:8000</code>.
            Run in terminal: <code className="bg-white border border-amber-200 px-1.5 py-0.5 rounded text-gray-900 font-bold">python main.py --serve --port 8000</code>
          </span>
          <button
            onClick={fetchStats}
            className="ml-2 underline font-semibold text-amber-900 hover:text-black flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'benchmark' ? (
          <BenchmarkDashboard stats={stats} refreshStats={fetchStats} />
        ) : (
          <div className="space-y-6">
            {/* Search Header Controls */}
            <SearchBar
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              mode={mode}
              setMode={setMode}
              topK={topK}
              setTopK={setTopK}
              latency={latency}
              totalHits={totalHits}
              isLoading={isLoading}
            />

            {/* Content Area */}
            {isLoading ? (
              <LoadingSkeleton count={topK > 5 ? 5 : topK} />
            ) : searchError ? (
              <div className="w-full max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-2xl p-6 text-center shadow-card-clean border border-red-100">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h3 className="text-gray-900 font-bold text-sm">Query Execution Failed</h3>
                  <p className="text-xs font-mono text-red-600 mt-1">{searchError}</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="w-full max-w-5xl mx-auto px-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
                  <span>
                    Showing <strong className="text-gray-900">{results.length}</strong> ranked documents
                  </span>
                  <span>Active Model: <strong className="text-indigo-600 uppercase font-bold">{mode}</strong></span>
                </div>

                {results.map((hit) => (
                  <ResultCard key={hit.doc_id} hit={hit} mode={mode} />
                ))}
              </div>
            ) : query.trim() ? (
              <div className="w-full max-w-5xl mx-auto px-4 py-16 text-center bg-white rounded-3xl shadow-card-clean border border-black/[0.04]">
                <p className="text-gray-700 font-medium text-sm">
                  No documents matched your query <span className="font-mono font-bold text-indigo-600">"{query}"</span> in <strong className="uppercase">{mode}</strong> mode.
                </p>
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  Try switching to <button onClick={() => { setMode('hybrid'); handleSearch(query, 'hybrid', topK); }} className="text-indigo-600 underline font-bold">Hybrid (RRF)</button> or broadening terms.
                </p>
              </div>
            ) : (
              <ZeroState
                onSelectQuery={(sampleQuery) => {
                  setQuery(sampleQuery);
                  handleSearch(sampleQuery);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Minimalist Studio Footer */}
      <footer className="border-t border-black/[0.04] bg-white/60 py-4 text-center text-xs font-mono text-gray-500">
        <p>IR Engine v2 • Minimalist Precision Retrieval • Plus Jakarta Sans & Modern Bento UI</p>
      </footer>
    </div>
  );
}

export default App;
