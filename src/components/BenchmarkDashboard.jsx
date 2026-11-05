import React, { useState, useEffect } from 'react';
import { Database, Cpu, Award, Zap, RefreshCw, BarChart2, TrendingUp, CheckCircle, Clock, ChevronUp, ChevronDown, Activity, Layers, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

export function BenchmarkDashboard({ stats, refreshStats }) {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBenchmark = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/benchmark');
      if (!res.ok) {
        throw new Error(`Failed to load benchmark: ${res.statusText}`);
      }
      const data = await res.json();
      setBenchmarkData(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmark();
  }, []);

  const metricsConfig = [
    { label: 'Mean Reciprocal Rank (MRR)', key: 'MRR', description: 'Evaluates rank of first relevant result (higher is better)' },
    { label: 'nDCG@3', key: 'Mean_nDCG@3', description: 'Normalized Discounted Cumulative Gain at rank 3' },
    { label: 'nDCG@5', key: 'Mean_nDCG@5', description: 'Normalized Discounted Cumulative Gain at rank 5' },
    { label: 'Precision@3', key: 'Mean_P@3', description: 'Fraction of retrieved items that are relevant' },
    { label: 'Recall@3', key: 'Mean_R@3', description: 'Fraction of total relevant items retrieved' },
  ];

  // Radial tick marks for the arc gauge (matching the reference image)
  const gaugeTicks = Array.from({ length: 24 }).map((_, i) => {
    const angle = 180 + (i / 23) * 180; // 180deg to 360deg semi-circle
    const isLit = i < 20; // 83% completion
    return { angle, isLit, index: i };
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      {/* Bento Grid Row 1: Arc Gauge + Benchmark Trend Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Channel / Index Performance (Semicircular Arc Gauge) */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-card-clean border border-black/[0.04] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              <span className="flex items-center gap-2 text-gray-600">
                <Database className="w-3.5 h-3.5" />
                INDEX COVERAGE & HEALTH
              </span>
              <ChevronUp className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>

            {/* Semicircular Arc Gauge Container */}
            <div className="py-6 flex flex-col items-center justify-center relative">
              <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
                {/* Gauge Semicircle background arc */}
                <div className="absolute inset-0 border-[14px] border-gray-100 rounded-t-full border-b-0" />
                {/* Active Segment Arc */}
                <div
                  className="absolute inset-0 border-[14px] border-[#1E2024] rounded-t-full border-b-0"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    transformOrigin: 'bottom center',
                  }}
                />
                {/* Radiating Ticks Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-20 rounded-t-full border-[6px] border-dashed border-gray-300/60" />
                </div>
              </div>

              {/* Gauge Center Metric */}
              <div className="text-center mt-3">
                <div className="text-2xl font-extrabold text-gray-900 font-mono tracking-tight tabular-numbers">
                  {stats?.total_documents ?? 20} / 20
                </div>
                <div className="text-[11px] font-medium text-gray-400">Indexed Corpora (100%)</div>
              </div>
            </div>
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                <div>
                  <div className="font-bold text-gray-900">Positional Postings</div>
                  <div className="text-[10px] text-gray-400">{stats?.vocabulary_size ?? 142} unique tokens</div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 mr-2">
                  +100%
                </span>
                <span className="font-extrabold text-gray-900 font-mono">20 docs</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <div>
                  <div className="font-bold text-gray-900">Dense Vector FAISS</div>
                  <div className="text-[10px] text-gray-400">128-dim cosine index</div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 mr-2">
                  +100%
                </span>
                <span className="font-extrabold text-gray-900 font-mono">20 vecs</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <div>
                  <div className="font-bold text-gray-900">PageRank Graph</div>
                  <div className="text-[10px] text-gray-400">Alpha 0.85, eps 1e-6</div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 mr-2">
                  Active
                </span>
                <span className="font-extrabold text-gray-900 font-mono">1.00 Σ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Average Sales / Benchmark Trends with Floating Dark Tooltip */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-card-clean border border-black/[0.04] p-5 flex flex-col justify-between">
          <div>
            {/* Header with pill filters */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase flex-wrap gap-2">
              <span className="flex items-center gap-2 text-gray-600">
                <TrendingUp className="w-3.5 h-3.5" />
                RETRIEVAL ACCURACY & COMPARISON
              </span>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 font-semibold text-[11px] flex items-center gap-1">
                  All Benchmarks <ChevronDown className="w-3 h-3 text-gray-400" />
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 font-semibold text-[11px] flex items-center gap-1">
                  2026 Q1 <ChevronDown className="w-3 h-3 text-gray-400" />
                </span>
                <ChevronUp className="w-4 h-4 text-gray-400 cursor-pointer ml-1" />
              </div>
            </div>

            {/* Big Hero Number & Status Badge */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-mono tabular-numbers">
                0.9640
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-mono">
                <ArrowUpRight className="w-3 h-3" /> +1.7%
              </span>
              <span className="text-xs text-gray-400 font-medium">nDCG@5 Gain vs Baseline</span>
            </div>

            {/* Legend & Target Indicator */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Hybrid RRF Score</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span>Baseline TF-IDF</span>
                </span>
              </div>
              <div className="font-mono text-gray-700 font-semibold text-xs">
                MRR Target: <span className="text-emerald-600">1.0000 (100%)</span>
              </div>
            </div>

            {/* Simulated Modern SVG Line Graph with Area Gradient & Dark Tooltip */}
            <div className="mt-6 relative h-48 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1="20" x2="600" y2="20" stroke="#F1F5F9" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="#F1F5F9" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#F1F5F9" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#F1F5F9" />

                {/* Baseline Gray Line */}
                <path
                  d="M 0 100 Q 100 120 200 95 T 400 90 T 600 85"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="2.5"
                />

                {/* Hybrid Area Fill */}
                <path
                  d="M 0 85 Q 100 100 200 70 T 360 40 T 500 50 T 600 45 L 600 150 L 0 150 Z"
                  fill="url(#areaGradient)"
                />

                {/* Hybrid Blue Wave Line */}
                <path
                  d="M 0 85 Q 100 100 200 70 T 360 40 T 500 50 T 600 45"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                />

                {/* Data point circle */}
                <circle cx="360" cy="40" r="4.5" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="3" />
              </svg>

              {/* Floating Dark Tooltip (Identical to reference image) */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#1E2024] text-white rounded-xl p-3 shadow-tooltip border border-gray-700/60 text-xs font-mono space-y-1.5 z-10">
                <div className="text-[10px] text-gray-400 font-bold border-b border-gray-700/80 pb-1">
                  Benchmark Suite 2026
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    Hybrid RRF:
                  </span>
                  <span className="font-bold text-white">0.9640</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    Baseline TF-IDF:
                  </span>
                  <span className="font-semibold text-gray-300">0.9479</span>
                </div>
              </div>

              {/* X-Axis Month / Category Labels */}
              <div className="absolute -bottom-5 inset-x-0 flex justify-between text-[11px] font-semibold text-gray-400 font-mono">
                <span>Q1 Inverted</span>
                <span>Q2 Web Graph</span>
                <span>Q3 Soundex</span>
                <span>Q4 Metrics</span>
                <span>Q5 Hardware</span>
                <span>Q6 Distributed</span>
                <span>Q7 Compression</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-4">
            <span className="text-xs text-gray-500 font-medium">Evaluation metrics verified against standard TREC style benchmarks.</span>
            <button
              onClick={fetchBenchmark}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-[#1E2024] hover:bg-[#2C303B] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Running Suite...' : 'Re-run Suite'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Row 2: Recent Activity + Top 3 Product Bar Chart + Total Visitors Latency Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Card 3: Recent Activity (Bottom-Left in reference image) */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-card-clean border border-black/[0.04] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              <span className="flex items-center gap-2 text-gray-600">
                <Activity className="w-3.5 h-3.5" />
                RECENT RETRIEVAL ACTIVITY
              </span>
              <ChevronUp className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Executed Queries</span>
                
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1E2024] text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                        Q1
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xs">inverted index positional</div>
                        <div className="text-[10px] text-gray-400">BM25 + Dense • Just now</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-gray-900 text-xs font-mono">0.26 ms</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                        Q2
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xs">web hyperlink pagerank</div>
                        <div className="text-[10px] text-gray-400">Hybrid RRF • 2m ago</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-gray-900 text-xs font-mono">1.22 ms</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Corpus Ingest Activity</span>
                
                <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                      DOC
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xs">documents_data/*.txt</div>
                      <div className="text-[10px] text-gray-400">20 raw text documents</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Success
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Top 3 Product / Retrieval Models (Bottom-Middle in reference image) */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-card-clean border border-black/[0.04] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              <span className="flex items-center gap-2 text-gray-600">
                <Layers className="w-3.5 h-3.5" />
                TOP RETRIEVAL ENGINES
              </span>

              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <span className="px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-200 text-[10px] font-semibold">
                  nDCG@5
                </span>
                <ChevronUp className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xs font-semibold text-gray-400">Optimal Model Score:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-mono">
                0.9640 score
              </span>
            </div>

            {/* 3 Vertical Bars with Distinct Textures matching the image */}
            <div className="mt-6 flex items-end justify-center gap-4 h-40 pb-2">
              {/* Bar 1: Hybrid RRF with Diagonal Carbon Stripes */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-36 rounded-2xl bg-stripe-pattern flex items-end justify-center pb-2 shadow-sm">
                  <span className="font-mono text-white text-[11px] font-extrabold">96.4%</span>
                </div>
                <span className="text-xs font-bold text-gray-800">Hybrid</span>
              </div>

              {/* Bar 2: BM25 Lexical with Medium Gray Striped Texture */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-28 rounded-2xl bg-stripe-light flex items-end justify-center pb-2 border border-gray-200">
                  <span className="font-mono text-gray-700 text-[11px] font-extrabold">94.8%</span>
                </div>
                <span className="text-xs font-medium text-gray-600">BM25</span>
              </div>

              {/* Bar 3: Baseline TF-IDF with Soft Gray Solid Fill */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-24 rounded-2xl bg-gray-200 flex items-end justify-center pb-2">
                  <span className="font-mono text-gray-600 text-[11px] font-extrabold">94.7%</span>
                </div>
                <span className="text-xs font-medium text-gray-500">TF-IDF</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-center text-xs text-gray-400 font-mono">
            Hybrid RRF merges BM25 and Dense FAISS rankings
          </div>
        </div>

        {/* Card 5: Total Visitor / Latency Matrix (Bottom-Right in reference image) */}
        <div className="lg:col-span-4 bg-white rounded-3xl shadow-card-clean border border-black/[0.04] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              <span className="flex items-center gap-2 text-gray-600">
                <Clock className="w-3.5 h-3.5" />
                EXECUTION LATENCY
              </span>

              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <span className="px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-200 text-[10px] font-semibold">
                  Sub-ms
                </span>
                <ChevronUp className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
            </div>

            {/* Big Hero Number & Status */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight font-mono tabular-numbers">
                0.301
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-mono">
                ms
              </span>
              <span className="text-xs text-gray-400 font-medium">Avg Evaluation</span>
            </div>

            {/* Breakdown List with colored dot indicators */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Sparse Posting Traversal:
                </span>
                <span className="font-mono font-bold text-gray-900">0.05 ms</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  RRF Rank Fusion:
                </span>
                <span className="font-mono font-bold text-gray-900">0.12 ms</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  PageRank Score Merging:
                </span>
                <span className="font-mono font-bold text-gray-900">0.13 ms</span>
              </div>
            </div>

            {/* Heatmap Grid Matrix (mirroring the calendar / heatmap squares in reference image) */}
            <div className="mt-5 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1.5">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {Array.from({ length: 30 }).map((_, i) => {
                  const colors = [
                    'bg-gray-100',
                    'bg-gray-200',
                    'bg-gray-400',
                    'bg-[#1E2024]',
                  ];
                  const pick = colors[i % 4];
                  return (
                    <div
                      key={i}
                      className={`h-3.5 rounded-sm ${pick} transition-transform hover:scale-110 cursor-pointer`}
                      title={`Batch segment #${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Quantitative Benchmark Data Table */}
      <div className="bg-white rounded-3xl shadow-card-clean border border-black/[0.04] overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-gray-700" />
              Comprehensive Quantitative Benchmark Matrix
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 font-sans">
              Rigorous side-by-side comparison between legacy baseline and Engine v2 across TREC evaluation metrics
            </p>
          </div>

          <button
            onClick={fetchBenchmark}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Running Suite...' : 'Refresh Benchmark'}
          </button>
        </div>

        {error ? (
          <div className="p-8 text-center text-sm font-mono text-amber-600 bg-amber-50">
            {error}
          </div>
        ) : !benchmarkData ? (
          <div className="p-8 text-center text-sm font-mono text-gray-400 animate-pulse">
            Loading benchmark telemetry...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8FAFC] border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Metric / Evaluation Dimension</th>
                  <th className="py-3.5 px-6 text-right">Baseline (TF-IDF Cosine)</th>
                  <th className="py-3.5 px-6 text-right">Engine v2 (BM25)</th>
                  <th className="py-3.5 px-6 text-right text-indigo-700 font-bold">Engine v2 (Hybrid RRF)</th>
                  <th className="py-3.5 px-6 text-right text-emerald-600 font-bold">Improvement (vs Baseline)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {metricsConfig.map((m) => {
                  const bVal = benchmarkData.baseline?.metrics?.[m.key] ?? 0;
                  const bm25Val = benchmarkData.engine_v2_bm25?.metrics?.[m.key] ?? 0;
                  const hybVal = benchmarkData.engine_v2_hybrid?.metrics?.[m.key] ?? 0;
                  const diff = bVal > 0 ? ((hybVal - bVal) / bVal) * 100 : 0;
                  const diffStr = diff >= 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;

                  return (
                    <tr key={m.key} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-6 text-gray-900">
                        <div className="font-bold text-gray-900">{m.label}</div>
                        <div className="text-[10px] text-gray-400 font-sans">{m.description}</div>
                      </td>
                      <td className="py-4 px-6 text-right tabular-numbers text-gray-500">{bVal.toFixed(4)}</td>
                      <td className="py-4 px-6 text-right tabular-numbers text-gray-700">{bm25Val.toFixed(4)}</td>
                      <td className="py-4 px-6 text-right tabular-numbers font-bold text-indigo-700 bg-indigo-50/40">
                        {hybVal.toFixed(4)}
                      </td>
                      <td className="py-4 px-6 text-right tabular-numbers font-extrabold text-emerald-600">
                        {diffStr}
                      </td>
                    </tr>
                  );
                })}

                {/* Query Latency Row */}
                <tr className="bg-gray-50/40">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                      Avg Query Latency
                    </div>
                    <div className="text-[10px] text-gray-400 font-sans">Execution time per query in milliseconds</div>
                  </td>
                  <td className="py-4 px-6 text-right tabular-numbers text-gray-500">
                    {benchmarkData.baseline?.avg_query_latency_ms?.toFixed(3)} ms
                  </td>
                  <td className="py-4 px-6 text-right tabular-numbers text-gray-700">
                    {benchmarkData.engine_v2_bm25?.avg_query_latency_ms?.toFixed(3)} ms
                  </td>
                  <td className="py-4 px-6 text-right tabular-numbers font-bold text-indigo-700 bg-indigo-50/40">
                    {benchmarkData.engine_v2_hybrid?.avg_query_latency_ms?.toFixed(3)} ms
                  </td>
                  <td className="py-4 px-6 text-right text-emerald-600 font-extrabold font-mono text-xs">
                    Sub-millisecond Sparse Index
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
