import React from 'react';

export function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 w-full max-w-5xl mx-auto px-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 shadow-card-clean border border-black/[0.04] animate-pulse space-y-4"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-xl" />
              <div className="space-y-1.5">
                <div className="w-28 h-4 bg-gray-200 rounded-md" />
                <div className="w-44 h-3 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="w-24 h-7 bg-gray-100 rounded-xl" />
          </div>

          {/* Snippet box */}
          <div className="h-16 bg-[#F8FAFC] rounded-xl p-3 space-y-2 border border-gray-100">
            <div className="w-full h-3 bg-gray-200/70 rounded" />
            <div className="w-4/5 h-3 bg-gray-200/50 rounded" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="w-36 h-3 bg-gray-200/60 rounded" />
            <div className="w-28 h-6 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
