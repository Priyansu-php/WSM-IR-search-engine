import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Award, Layers, BookOpen, Copy, Check, Hash, Sparkles } from 'lucide-react';

export function ResultCard({ hit, mode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const copyDocId = () => {
    navigator.clipboard.writeText(hit.doc_id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  // Parses bold syntax **token** from backend into crisp minimalist highlight tags
  const renderSnippet = (snippetText) => {
    if (!snippetText) return null;
    const parts = snippetText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span
            key={index}
            className="bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md border border-indigo-200/50 font-mono text-[11px] inline-block my-0.5 mx-0.5"
          >
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-card-clean border border-black/[0.04] hover:shadow-card-hover transition-all duration-200 p-5 group">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          <div className="w-8 h-8 rounded-xl bg-[#1E2024] text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
            #{hit.rank}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                {hit.doc_id}
              </span>
              <button
                onClick={copyDocId}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 transition-opacity p-0.5"
                title="Copy Document ID"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {hit.title && (
              <h3 className="text-xs text-gray-500 mt-0.5 font-medium">{hit.title}</h3>
            )}
          </div>
        </div>

        {/* Relevance Score & Model Ranks */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F8FAFC] border border-gray-200/70 text-xs font-mono">
            <span className="text-gray-400 text-[11px] font-sans">Score:</span>
            <span className="text-gray-900 font-extrabold tabular-numbers">
              {typeof hit.score === 'number' ? hit.score.toFixed(4) : hit.score}
            </span>
          </div>

          {/* Constituent Ranks (BM25 & Dense) if Hybrid */}
          {mode === 'hybrid' && (hit.bm25_rank || hit.dense_rank) && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
              {hit.bm25_rank && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-sky-500" />
                  <span>BM25:</span>
                  <span className="font-bold text-gray-800">#{hit.bm25_rank}</span>
                </span>
              )}
              {hit.bm25_rank && hit.dense_rank && <span className="text-gray-300">•</span>}
              {hit.dense_rank && (
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-purple-500" />
                  <span>Dense:</span>
                  <span className="font-bold text-gray-800">#{hit.dense_rank}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Snippet Container */}
      <div className="mt-3.5 p-3.5 rounded-xl bg-[#F8FAFC] border border-gray-200/60 text-gray-700 text-xs sm:text-sm leading-relaxed font-sans">
        <p className="line-clamp-3">{renderSnippet(hit.snippet)}</p>
      </div>

      {/* Footer Row */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-gray-500 font-mono text-[11px]">
          {hit.metadata?.source && (
            <span className="truncate max-w-[200px] text-gray-400" title={hit.metadata.source}>
              {hit.metadata.source.split('/').pop()}
            </span>
          )}
          {hit.pagerank_score !== undefined && hit.pagerank_score !== null && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold text-[10px]">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>PageRank:</span>
              <span className="tabular-numbers">{(hit.pagerank_score * 100).toFixed(2)}%</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200/70 text-gray-700 font-semibold text-xs transition-colors"
        >
          <span>{isExpanded ? 'Hide Details' : 'View Full Document'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Document Drawer */}
      {isExpanded && (
        <div className="mt-3 p-4 bg-[#1E2024] rounded-xl text-gray-200 font-mono text-xs space-y-3 shadow-inner animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-gray-700 text-gray-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <FileText className="w-3.5 h-3.5" />
              Raw Document Record
            </span>
            <span>{hit.content ? `${hit.content.split(/\s+/).length} words` : 'Full Content'}</span>
          </div>

          <pre className="whitespace-pre-wrap font-mono text-xs text-gray-100 leading-relaxed max-h-60 overflow-y-auto pr-2">
            {hit.content || hit.snippet}
          </pre>

          {hit.metadata && Object.keys(hit.metadata).length > 0 && (
            <div className="pt-2 border-t border-gray-700 flex flex-wrap gap-2 text-[11px]">
              <span className="text-gray-400">Metadata:</span>
              {Object.entries(hit.metadata).map(([k, v]) => (
                <span key={k} className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">
                  {k}: <span className="text-indigo-300">{String(v)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
