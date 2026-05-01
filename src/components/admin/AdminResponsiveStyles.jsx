export default function AdminResponsiveStyles() {
  return (
    <style>{`
      /* ============================================
         ADMIN MOBILE RESPONSIVE STYLES
         Applies to all CRT-themed admin pages
         wrapped in .admin-mobile-shell
      ============================================ */

      /* ---------- TABLET & BELOW (≤1024px) ---------- */
      @media (max-width: 1024px) {

        /* --- Shell & Root Containers --- */
        .admin-mobile-shell {
          overflow-x: hidden;
        }

        /* Fix fixed-viewport containers to be scrollable */
        .admin-mobile-shell .crt-screen,
        .admin-mobile-shell .crt-glow {
          width: 100% !important;
          max-width: 100% !important;
          min-height: 100vh !important;
          height: auto !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        /* Inner wrapper */
        .admin-mobile-shell .crt-screen > div,
        .admin-mobile-shell .crt-glow > div {
          min-height: 100vh;
          width: 100%;
          height: auto !important;
        }

        /* Override h-full / h-screen on inner layout areas */
        .admin-mobile-shell .h-full,
        .admin-mobile-shell .h-screen,
        .admin-mobile-shell [class*="h-[calc"],
        .admin-mobile-shell [class*="h-full"] {
          height: auto !important;
        }

        /* --- Main Layout: Sidebar + Editor flex → Stack vertically --- */
        .admin-mobile-shell .flex-1.flex.gap-4.overflow-hidden,
        .admin-mobile-shell .flex-1.flex.gap-4,
        .admin-mobile-shell .flex-1.flex.gap-3.overflow-hidden,
        .admin-mobile-shell .flex-1.flex.gap-3 {
          flex-direction: column !important;
          overflow: visible !important;
        }

        /* --- Sidebar: Full width on mobile --- */
        .admin-mobile-shell .w-64.crt-panel,
        .admin-mobile-shell .w-64 {
          width: 100% !important;
          max-width: none !important;
          flex: none !important;
        }

        /* Make sidebar navigation horizontal on mobile */
        .admin-mobile-shell .w-64.crt-panel > div:first-child > div.space-y-2,
        .admin-mobile-shell .w-64 > div:first-child > .space-y-2 {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          gap: 0.5rem !important;
          padding-bottom: 0.5rem;
          -webkit-overflow-scrolling: touch;
        }

        .admin-mobile-shell .w-64.crt-panel > div:first-child > div.space-y-2 > *,
        .admin-mobile-shell .w-64 > div:first-child > .space-y-2 > * {
          white-space: nowrap !important;
          flex-shrink: 0 !important;
          width: auto !important;
          font-size: 0.8rem !important;
        }

        /* Hide sidebar spacer and actions section on mobile (use floating bar) */
        .admin-mobile-shell .w-64.crt-panel > .flex-1,
        .admin-mobile-shell .w-64.crt-panel > div:last-child:not(:first-child) {
          display: none !important;
        }

        /* Show only the navigation div on mobile */
        .admin-mobile-shell .w-64.crt-panel > div:first-child {
          display: block !important;
        }

        /* --- Panel & Cards --- */
        .admin-mobile-shell .crt-panel {
          max-width: 100% !important;
        }

        .admin-mobile-shell .crt-panel.overflow-hidden {
          overflow: visible !important;
        }

        .admin-mobile-shell .hide-scrollbar {
          overflow: auto !important;
        }

        /* --- Touch Targets: min 44px for buttons & inputs --- */
        .admin-mobile-shell button,
        .admin-mobile-shell a,
        .admin-mobile-shell label,
        .admin-mobile-shell .crt-button {
          min-height: 40px;
        }

        .admin-mobile-shell input,
        .admin-mobile-shell textarea,
        .admin-mobile-shell select,
        .admin-mobile-shell .crt-input {
          min-height: 42px;
          font-size: 16px !important; /* prevents iOS zoom */
        }

        .admin-mobile-shell textarea.crt-input,
        .admin-mobile-shell textarea {
          min-height: 100px;
        }

        /* --- Grids: Stack on mobile --- */
        .admin-mobile-shell .grid.grid-cols-2:not(.sm\\:grid-cols-2):not(.md\\:grid-cols-2),
        .admin-mobile-shell .grid.grid-cols-3,
        .admin-mobile-shell .grid.grid-cols-4 {
          grid-template-columns: 1fr !important;
        }

        /* --- Flex Wrapping --- */
        .admin-mobile-shell .flex.items-center.justify-between,
        .admin-mobile-shell .flex.justify-between.items-center {
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .admin-mobile-shell .flex.items-center.gap-2,
        .admin-mobile-shell .flex.items-center.gap-3,
        .admin-mobile-shell .flex.items-center.gap-4,
        .admin-mobile-shell .flex.gap-2,
        .admin-mobile-shell .flex.gap-3,
        .admin-mobile-shell .flex.gap-4 {
          flex-wrap: wrap;
        }

        /* --- Fixed Width Overrides --- */
        .admin-mobile-shell .w-24,
        .admin-mobile-shell .w-56,
        .admin-mobile-shell .w-96 {
          width: 100% !important;
        }

        .admin-mobile-shell .max-w-2xl.w-full,
        .admin-mobile-shell .w-full.max-w-md,
        .admin-mobile-shell .max-w-3xl {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* --- Padding overrides for tight screens --- */
        .admin-mobile-shell .pr-4 {
          padding-right: 0.5rem !important;
        }

        /* --- Add bottom padding for mobile floating action bar --- */
        .admin-mobile-shell .crt-screen > div:first-child,
        .admin-mobile-shell .crt-glow > div:first-child {
          padding-bottom: 4.5rem !important;
        }

        /* col-span and row-span reset */
        .admin-mobile-shell [class*="col-span-"] {
          grid-column: auto / span 1 !important;
        }
        .admin-mobile-shell [class*="row-span-"] {
          grid-row: auto / span 1 !important;
        }
      }

      /* ---------- PHONE (≤640px) ---------- */
      @media (max-width: 640px) {

        /* Tighter padding on phone */
        .admin-mobile-shell .crt-screen > div,
        .admin-mobile-shell .crt-glow > div {
          padding: 0.5rem !important;
          gap: 0.5rem !important;
        }

        .admin-mobile-shell .crt-panel.p-6,
        .admin-mobile-shell .crt-panel.p-4,
        .admin-mobile-shell .crt-panel.rounded-lg.p-6,
        .admin-mobile-shell .crt-panel.rounded-lg.p-4 {
          padding: 0.75rem !important;
        }

        /* Scale down headings */
        .admin-mobile-shell .text-2xl {
          font-size: 1.1rem !important;
          line-height: 1.4 !important;
        }

        .admin-mobile-shell .text-xl {
          font-size: 0.95rem !important;
          line-height: 1.4 !important;
        }

        .admin-mobile-shell .text-lg {
          font-size: 0.88rem !important;
        }

        /* Force all grid-cols-2 to single column on phone */
        .admin-mobile-shell .grid.grid-cols-2 {
          grid-template-columns: 1fr !important;
        }

        /* Fix header bar: stack title + controls */
        .admin-mobile-shell .crt-panel > .flex.items-center.justify-between {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 0.5rem !important;
        }

        /* Preview / Refresh buttons compact */
        .admin-mobile-shell .crt-button {
          padding: 0.4rem 0.6rem !important;
          font-size: 0.7rem !important;
        }

        /* Status text smaller */
        .admin-mobile-shell .status-success,
        .admin-mobile-shell .status-error,
        .admin-mobile-shell .status-info {
          font-size: 0.65rem !important;
        }

        /* Modal responsive */
        .admin-mobile-shell .fixed.inset-0 .crt-panel,
        .admin-mobile-shell .fixed.inset-0 .max-w-2xl {
          max-width: 95vw !important;
          max-height: 90vh !important;
          margin: 0.5rem !important;
        }
      }

      /* ---------- MOBILE FLOATING ACTION BAR ---------- */
      /* Universal floating save bar for all admin pages on mobile */
      @media (max-width: 1024px) {
        .admin-mobile-fab {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 0.35rem;
          padding: 0.6rem 0.5rem;
          background: rgba(0, 10, 20, 0.97);
          border-top: 2px solid rgba(0, 229, 255, 0.3);
          box-shadow: 0 -4px 20px rgba(0, 229, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .admin-mobile-fab button,
        .admin-mobile-fab label {
          display: flex !important;
          align-items: center !important;
          gap: 0.3rem !important;
          padding: 0.5rem 0.6rem !important;
          font-size: 0.65rem !important;
          min-height: 36px !important;
          white-space: nowrap !important;
          border-radius: 0.375rem;
        }
      }

      @media (min-width: 1025px) {
        .admin-mobile-fab {
          display: none !important;
        }
      }

      /* ---------- ANALYSIS DASHBOARD SPECIFIC ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell .grid.grid-cols-1.lg\\:grid-cols-2,
        .admin-mobile-shell .grid.lg\\:grid-cols-2 {
          grid-template-columns: 1fr !important;
        }
      }

      /* ---------- BLOG EDITOR SPECIFIC ---------- */
      @media (max-width: 768px) {
        .admin-mobile-shell .grid.md\\:grid-cols-2 {
          grid-template-columns: 1fr !important;
        }
      }

      /* ---------- PROJECT ADMIN SPECIFIC ---------- */
      @media (max-width: 1024px) {
        /* Project cards grid */
        .admin-mobile-shell .grid.grid-cols-2.gap-3,
        .admin-mobile-shell .grid.grid-cols-2.gap-2 {
          grid-template-columns: 1fr !important;
        }

        /* Tag/chip containers */
        .admin-mobile-shell .flex.flex-wrap.gap-2,
        .admin-mobile-shell .flex.flex-wrap.gap-1\\.5 {
          gap: 0.375rem !important;
        }
      }

      /* ---------- SCROLLBAR STYLING FOR MOBILE ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }

        .admin-mobile-shell ::-webkit-scrollbar-thumb {
          background: rgba(0, 229, 255, 0.25);
          border-radius: 4px;
        }

        .admin-mobile-shell ::-webkit-scrollbar-track {
          background: transparent;
        }
      }
    `}</style>
  );
}
