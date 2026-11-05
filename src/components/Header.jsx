import React from 'react';
import { Search, BarChart3, Database, Cpu, CheckCircle2, Sliders, ChevronDown } from 'lucide-react';

export function Header({ activeTab, setActiveTab, stats, isOnline }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-black/[0.04] sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1E2024] flex items-center justify-center text-white shadow-sm">
            <span className="font-extrabold text-sm tracking-tight">IR</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 tracking-tight text-sm sm:text-base">IR Engine</span>
              <span className="text-[10px] font-bold font-mono tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 uppercase">
                v2.0 Active
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">Minimalist Information Retrieval & Intelligence</p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center bg-[#F3F4F6] p-1 rounded-xl border border-black/[0.03]">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'benchmark'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Telemetry & Benchmarks</span>
          </button>
        </div>

        {/* Live Corpus Telemetry Badges */}
        <div className="flex items-center gap-3">
          {stats && (
            <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-white border border-black/[0.04] rounded-xl shadow-sm text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900 tabular-numbers">{stats.total_documents}</span> docs
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-gray-900 tabular-numbers">{stats.vocabulary_size}</span> vocab
              </span>
            </div>
          )}

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                : 'bg-amber-50 text-amber-700 border-amber-200/70'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isOnline ? 'Online (8000)' : 'Connecting...'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
