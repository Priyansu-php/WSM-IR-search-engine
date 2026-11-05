import React from 'react';
import { Sparkles, BookOpen, Layers, Quote, Award, Terminal, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function ZeroState({ onSelectQuery }) {
  const capabilities = [
    {
      title: "Okapi BM25 Lexical",
      tag: "Robertson-Sparck Jones",
      desc: "Saturation-bounded scoring with dynamic length normalization (k1=1.5, b=0.75).",
      icon: BookOpen,
      example: "inverted index positional",
      color: "bg-sky-50 text-sky-600",
    },
    {
      title: "Dense Vector Embeddings",
      tag: "FAISS HNSW / Cosine",
      desc: "Deep semantic embeddings capturing synonymy and conceptual relevance.",
      icon: Layers,
      example: "neural language models",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Reciprocal Rank Fusion",
      tag: "Cormack RRF (k=60)",
      desc: "Consensus rank fusion combining sparse lexical precision with dense semantics.",
      icon: Sparkles,
      example: "hyperlink structure web graph",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Exact Phrase Search",
      tag: "Positional Postings",
      desc: "Verifies contiguous token offset alignment inside positional inverted index.",
      icon: Quote,
      example: "stanford university",
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 text-center">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <div
              key={i}
              onClick={() => onSelectQuery(cap.example)}
              className="bg-white rounded-2xl shadow-card-clean border border-black/[0.04] hover:shadow-card-hover hover:border-black/[0.08] p-5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl ${cap.color} flex items-center justify-center font-bold`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                      {cap.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                    {cap.tag}
                  </span>
                </div>

                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  {cap.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>Query: <strong className="text-gray-800">"{cap.example}"</strong></span>
                <span className="text-indigo-600 font-bold flex items-center gap-0.5 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  Search <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Shortcuts / Status Bar */}
      <div className="mt-8 inline-flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-black/[0.04] shadow-sm text-xs font-mono text-gray-500">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-gray-400" />
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-bold">⌘K</kbd> to search</span>
        </span>
        <span className="text-gray-300">•</span>
        <span>Local Backend: <strong className="text-emerald-600">127.0.0.1:8000</strong></span>
      </div>
    </div>
  );
}
