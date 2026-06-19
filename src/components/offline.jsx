"use client";

import { RefreshCw, WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 text-[var(--color-text)] flex flex-col items-center justify-center gap-6 text-center">
      <WifiOff className="w-16 h-16 text-[var(--color-muted)]" />
      <div>
        <h1 className="text-3xl font-bold">You're offline</h1>
        <p className="mt-2 max-w-md text-sm text-[var(--color-muted)]">
          Check your connection and retry when you're back online.
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 rounded-full border border-cyansoft px-5 py-2.5 text-sm font-semibold text-cyansoft transition hover:bg-cyansoft hover:text-slate-900"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}
