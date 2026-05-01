export default function AdminResponsiveStyles() {
  return (
    <style>{`
      /* ============================================
         ADMIN MOBILE RESPONSIVE STYLES
         Applies to all CRT-themed admin pages
         wrapped in .admin-mobile-shell
      ============================================ */

      /* ---------- GLOBAL COLOR ENHANCEMENT ---------- */
      .admin-mobile-shell {
        --color-primary: #00e5ff;
        --color-secondary: #ff00ff;
        --color-success: #4ade80;
        --color-warning: #fbbf24;
        --color-danger: #f87171;
        --color-info: #60a5fa;
        --color-accent-1: #ec4899;
        --color-accent-2: #8b5cf6;
        --color-accent-3: #06b6d4;
        --color-accent-4: #14b8a6;
      }

      /* Tab colors - rotating through bright colors */
      .admin-mobile-shell [class*="tab"]:nth-child(1),
      .admin-mobile-shell [class*="active"]:nth-child(1) {
        border-color: #00e5ff !important;
        color: #00e5ff !important;
      }
      .admin-mobile-shell [class*="tab"]:nth-child(2),
      .admin-mobile-shell [class*="active"]:nth-child(2) {
        border-color: #ff00ff !important;
        color: #ff00ff !important;
      }
      .admin-mobile-shell [class*="tab"]:nth-child(3),
      .admin-mobile-shell [class*="active"]:nth-child(3) {
        border-color: #fbbf24 !important;
        color: #fbbf24 !important;
      }
      .admin-mobile-shell [class*="tab"]:nth-child(4),
      .admin-mobile-shell [class*="active"]:nth-child(4) {
        border-color: #ec4899 !important;
        color: #ec4899 !important;
      }
      .admin-mobile-shell [class*="tab"]:nth-child(5),
      .admin-mobile-shell [class*="active"]:nth-child(5) {
        border-color: #06b6d4 !important;
        color: #06b6d4 !important;
      }

      /* Colored panels for different sections */
      .admin-mobile-shell .crt-panel {
        border-color: rgba(0, 229, 255, 0.5) !important;
        background: linear-gradient(135deg, rgba(0, 20, 30, 0.95), rgba(0, 10, 20, 0.98)) !important;
      }

      .admin-mobile-shell .crt-panel:nth-child(1) {
        border-top-color: #00e5ff !important;
        border-top-width: 3px !important;
      }
      .admin-mobile-shell .crt-panel:nth-child(2) {
        border-top-color: #ff00ff !important;
        border-top-width: 3px !important;
      }
      .admin-mobile-shell .crt-panel:nth-child(3) {
        border-top-color: #fbbf24 !important;
        border-top-width: 3px !important;
      }
      .admin-mobile-shell .crt-panel:nth-child(4) {
        border-top-color: #ec4899 !important;
        border-top-width: 3px !important;
      }
      .admin-mobile-shell .crt-panel:nth-child(5) {
        border-top-color: #06b6d4 !important;
        border-top-width: 3px !important;
      }
      .admin-mobile-shell .crt-panel:nth-child(6) {
        border-top-color: #8b5cf6 !important;
        border-top-width: 3px !important;
      }

      /* Header titles with gradient colors */
      .admin-mobile-shell h1,
      .admin-mobile-shell h2,
      .admin-mobile-shell .crt-header {
        background: linear-gradient(135deg, #00e5ff, #ff00ff, #fbbf24) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        text-shadow: none !important;
      }

      /* Section headers with alternating colors */
      .admin-mobile-shell .crt-panel > div:first-child:has(h1),
      .admin-mobile-shell .crt-panel > div:first-child:has(h2) {
        border-bottom: 2px solid #00e5ff;
        padding-bottom: 0.75rem;
        margin-bottom: 1rem;
      }

      /* Button colors */
      .admin-mobile-shell .crt-button {
        background: linear-gradient(135deg, rgba(0,229,255,0.3), rgba(0,229,255,0.1)) !important;
        border-color: #00e5ff !important;
      }
      .admin-mobile-shell .crt-button:hover {
        background: linear-gradient(135deg, rgba(0,229,255,0.5), rgba(0,229,255,0.3)) !important;
        border-color: #00e5ff !important;
        box-shadow: 0 0 30px rgba(0,229,255,0.6) !important;
      }

      /* Success/Add buttons */
      .admin-mobile-shell button[class*="success"],
      .admin-mobile-shell button:has(svg[class*="Plus"]) {
        border-color: #4ade80 !important;
        color: #4ade80 !important;
      }
      .admin-mobile-shell button[class*="success"]:hover,
      .admin-mobile-shell button:has(svg[class*="Plus"]):hover {
        box-shadow: 0 0 20px rgba(74,222,128,0.6) !important;
      }

      /* Delete/Danger buttons */
      .admin-mobile-shell button[class*="delete"],
      .admin-mobile-shell button[class*="danger"],
      .admin-mobile-shell button[class*="red"],
      .admin-mobile-shell button:has(svg[class*="Trash"]) {
        border-color: #f87171 !important;
        color: #f87171 !important;
      }
      .admin-mobile-shell button[class*="delete"]:hover,
      .admin-mobile-shell button[class*="danger"]:hover,
      .admin-mobile-shell button:has(svg[class*="Trash"]):hover {
        box-shadow: 0 0 20px rgba(248,113,113,0.6) !important;
      }

      /* Input fields with color borders */
      .admin-mobile-shell .crt-input:focus {
        border-color: #ff00ff !important;
        box-shadow: 0 0 20px rgba(255,0,255,0.4) !important;
      }
      .admin-mobile-shell .crt-input:hover:not(:focus) {
        border-color: #00e5ff !important;
      }

      /* Status badges colors */
      .admin-mobile-shell .status-success {
        color: #4ade80 !important;
        text-shadow: 0 0 10px rgba(74,222,128,0.8) !important;
      }
      .admin-mobile-shell .status-error {
        color: #f87171 !important;
        text-shadow: 0 0 10px rgba(248,113,113,0.8) !important;
      }
      .admin-mobile-shell .status-info {
        color: #60a5fa !important;
        text-shadow: 0 0 10px rgba(96,165,250,0.8) !important;
      }
      .admin-mobile-shell .status-warning {
        color: #fbbf24 !important;
        text-shadow: 0 0 10px rgba(251,191,36,0.8) !important;
      }

      /* Category item colors */
      .admin-mobile-shell .category-item:nth-child(1) {
        border-left: 4px solid #00e5ff !important;
      }
      .admin-mobile-shell .category-item:nth-child(2) {
        border-left: 4px solid #ff00ff !important;
      }
      .admin-mobile-shell .category-item:nth-child(3) {
        border-left: 4px solid #fbbf24 !important;
      }
      .admin-mobile-shell .category-item:nth-child(4) {
        border-left: 4px solid #ec4899 !important;
      }
      .admin-mobile-shell .category-item:nth-child(5) {
        border-left: 4px solid #06b6d4 !important;
      }
      .admin-mobile-shell .category-item:nth-child(6) {
        border-left: 4px solid #8b5cf6 !important;
      }
      .admin-mobile-shell .category-item:nth-child(7) {
        border-left: 4px solid #14b8a6 !important;
      }

      /* List items alternating colors */
      .admin-mobile-shell li:nth-child(odd) {
        background-color: rgba(0, 229, 255, 0.05) !important;
      }
      .admin-mobile-shell li:nth-child(even) {
        background-color: rgba(255, 0, 255, 0.05) !important;
      }

      /* Scrollbar colors */
      .admin-mobile-shell ::-webkit-scrollbar {
        background: rgba(0, 229, 255, 0.1);
      }
      .admin-mobile-shell ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #00e5ff, #ff00ff);
      }
      .admin-mobile-shell ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #ff00ff, #fbbf24);
      }

      /* Text highlights */
      .admin-mobile-shell .highlight,
      .admin-mobile-shell [class*="highlight"] {
        color: #fbbf24 !important;
        font-weight: bold;
      }

      /* Separator lines with gradient */
      .admin-mobile-shell hr {
        border: none;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00e5ff, #ff00ff, transparent);
      }

      /* TABLET & BELOW (≤1024px) ---------- */
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
          background: linear-gradient(90deg, rgba(0,10,20,0.98), rgba(0,50,50,0.5), rgba(0,10,20,0.98));
          border-top: 3px solid;
          border-image: linear-gradient(90deg, #00e5ff, #ff00ff, #fbbf24) 1;
          box-shadow: 0 -4px 30px rgba(0, 229, 255, 0.25), inset 0 2px 20px rgba(0,229,255,0.1);
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
          border: 1px solid rgba(0,229,255,0.5) !important;
          background: linear-gradient(135deg, rgba(0,229,255,0.1), rgba(255,0,255,0.05)) !important;
          color: #00e5ff !important;
          transition: all 0.3s ease;
        }

        .admin-mobile-fab button:hover,
        .admin-mobile-fab label:hover {
          border-color: #ff00ff !important;
          background: linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,229,255,0.1)) !important;
          color: #ff00ff !important;
          box-shadow: 0 0 15px rgba(255,0,255,0.4) !important;
        }

        .admin-mobile-fab button:nth-child(1),
        .admin-mobile-fab button:has(svg[class*="Save"]) {
          border-color: #4ade80 !important;
          color: #4ade80 !important;
        }
        .admin-mobile-fab button:nth-child(1):hover,
        .admin-mobile-fab button:has(svg[class*="Save"]):hover {
          box-shadow: 0 0 15px rgba(74,222,128,0.5) !important;
        }

        .admin-mobile-fab button:nth-child(2),
        .admin-mobile-fab button:has(svg[class*="Undo"]) {
          border-color: #fbbf24 !important;
          color: #fbbf24 !important;
        }
        .admin-mobile-fab button:nth-child(2):hover,
        .admin-mobile-fab button:has(svg[class*="Undo"]):hover {
          box-shadow: 0 0 15px rgba(251,191,36,0.5) !important;
        }

        .admin-mobile-fab button:nth-child(3),
        .admin-mobile-fab button:has(svg[class*="Upload"]) {
          border-color: #60a5fa !important;
          color: #60a5fa !important;
        }
        .admin-mobile-fab button:nth-child(3):hover,
        .admin-mobile-fab button:has(svg[class*="Upload"]):hover {
          box-shadow: 0 0 15px rgba(96,165,250,0.5) !important;
        }

        .admin-mobile-fab button:nth-child(4),
        .admin-mobile-fab button:has(svg[class*="Download"]) {
          border-color: #ec4899 !important;
          color: #ec4899 !important;
        }
        .admin-mobile-fab button:nth-child(4):hover,
        .admin-mobile-fab button:has(svg[class*="Download"]):hover {
          box-shadow: 0 0 15px rgba(236,72,153,0.5) !important;
        }
      }
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

      /* ---------- FORM INPUTS & LABELS ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell label {
          font-size: 0.85rem !important;
          display: block;
          margin-bottom: 0.3rem;
        }

        .admin-mobile-shell .crt-input,
        .admin-mobile-shell input,
        .admin-mobile-shell textarea,
        .admin-mobile-shell select {
          width: 100% !important;
          padding: 0.5rem 0.75rem !important;
          font-size: 16px !important;
          min-height: 44px !important;
          border-radius: 0.375rem !important;
        }

        .admin-mobile-shell textarea {
          resize: vertical;
          min-height: 80px !important;
        }

        /* Form groups should stack */
        .admin-mobile-shell .form-group,
        .admin-mobile-shell [class*="space-y-"] > div,
        .admin-mobile-shell .flex.flex-col {
          width: 100% !important;
          margin-bottom: 0.75rem !important;
        }
      }

      /* ---------- MODALS & DIALOGS ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell .fixed.inset-0,
        .admin-mobile-shell .modal {
          position: fixed !important;
          inset: 0 !important;
          z-index: 1000 !important;
        }

        .admin-mobile-shell .fixed.inset-0 .max-w-2xl,
        .admin-mobile-shell .fixed.inset-0 .modal-dialog,
        .admin-mobile-shell .fixed.inset-0 .crt-panel {
          max-width: 90vw !important;
          max-height: 85vh !important;
          width: 90vw !important;
          margin: auto !important;
          overflow-y: auto !important;
          border-radius: 0.5rem !important;
        }

        /* Close buttons on modals */
        .admin-mobile-shell .fixed.inset-0 [class*="btn-close"],
        .admin-mobile-shell .fixed.inset-0 button:has(svg) {
          min-width: 36px;
          min-height: 36px;
          padding: 0.5rem !important;
        }
      }

      /* ---------- ICON SIZING ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell svg {
          width: 1.2rem !important;
          height: 1.2rem !important;
        }

        .admin-mobile-shell button svg,
        .admin-mobile-shell .crt-button svg {
          width: 1rem !important;
          height: 1rem !important;
        }

        .admin-mobile-shell .text-2xl svg,
        .admin-mobile-shell .text-3xl svg {
          width: 1.5rem !important;
          height: 1.5rem !important;
        }
      }

      /* ---------- LIST & TABLE RESPONSIVE ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell table {
          font-size: 0.75rem !important;
          width: 100% !important;
          overflow-x: auto !important;
          display: block !important;
        }

        .admin-mobile-shell tbody,
        .admin-mobile-shell thead {
          display: block !important;
        }

        .admin-mobile-shell tr {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(0, 229, 255, 0.2);
          padding: 0.5rem;
          border-radius: 0.375rem;
        }

        .admin-mobile-shell td,
        .admin-mobile-shell th {
          display: block;
          text-align: left;
          padding: 0.375rem !important;
          word-break: break-word;
        }

        .admin-mobile-shell th {
          display: none;
        }

        .admin-mobile-shell td::before {
          content: attr(data-label);
          font-weight: bold;
          color: #00e5ff;
          display: inline;
          margin-right: 0.5rem;
        }
      }

      /* ---------- BUTTON GROUPS ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell .flex.gap-2 > button,
        .admin-mobile-shell .flex.gap-3 > button,
        .admin-mobile-shell .flex.gap-4 > button,
        .admin-mobile-shell .flex.gap-2 > a,
        .admin-mobile-shell .flex.gap-3 > a,
        .admin-mobile-shell .flex.gap-4 > a {
          flex: 1;
          min-width: 0;
          font-size: 0.75rem !important;
          padding: 0.4rem 0.6rem !important;
        }

        /* Horizontal button groups stay horizontal but smaller */
        .admin-mobile-shell .flex.justify-between > button {
          flex: 1;
          margin: 0 0.25rem;
        }
      }

      /* ---------- SIDEBAR SPECIFICS ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell .sidebar,
        .admin-mobile-shell [class*="sidebar"] {
          position: relative;
          width: 100%;
          max-height: auto;
        }

        /* Nav items on mobile */
        .admin-mobile-shell nav ul,
        .admin-mobile-shell nav ol,
        .admin-mobile-shell nav > div.space-y-2 {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .admin-mobile-shell nav li,
        .admin-mobile-shell nav a {
          white-space: nowrap;
          font-size: 0.7rem !important;
          padding: 0.4rem 0.6rem !important;
        }
      }

      /* ---------- CONTENT AREAS ---------- */
      @media (max-width: 1024px) {
        .admin-mobile-shell .content,
        .admin-mobile-shell [class*="editor"],
        .admin-mobile-shell [class*="main"] {
          width: 100% !important;
          padding: 0.75rem !important;
        }

        .admin-mobile-shell .flex-1 {
          width: 100% !important;
          flex-basis: 100% !important;
        }
      }

      /* ---------- TINY SCREENS (≤360px) ---------- */
      @media (max-width: 360px) {
        .admin-mobile-shell {
          font-size: 0.8rem !important;
        }

        .admin-mobile-shell .crt-button,
        .admin-mobile-shell button {
          padding: 0.3rem 0.5rem !important;
          font-size: 0.65rem !important;
          min-height: 36px !important;
        }

        .admin-mobile-shell .crt-input,
        .admin-mobile-shell input {
          font-size: 16px !important;
          padding: 0.4rem 0.5rem !important;
        }

        .admin-mobile-shell .text-xl {
          font-size: 0.9rem !important;
        }

        .admin-mobile-shell .text-lg {
          font-size: 0.8rem !important;
        }

        .admin-mobile-shell .gap-4 {
          gap: 0.5rem !important;
        }

        .admin-mobile-shell .p-6 {
          padding: 0.5rem !important;
        }

        .admin-mobile-shell .p-4 {
          padding: 0.375rem !important;
        }
      }

      /* ---------- CARD & ITEM COLORS ---------- */
      .admin-mobile-shell .card,
      .admin-mobile-shell [class*="card"],
      .admin-mobile-shell [class*="item"] {
        border-left: 3px solid #00e5ff;
        background: linear-gradient(135deg, rgba(0,229,255,0.05), rgba(0,10,20,0.95));
      }

      .admin-mobile-shell .card:nth-child(2n),
      .admin-mobile-shell [class*="card"]:nth-child(2n),
      .admin-mobile-shell [class*="item"]:nth-child(2n) {
        border-left-color: #ff00ff;
        background: linear-gradient(135deg, rgba(255,0,255,0.05), rgba(0,10,20,0.95));
      }

      .admin-mobile-shell .card:nth-child(3n),
      .admin-mobile-shell [class*="card"]:nth-child(3n),
      .admin-mobile-shell [class*="item"]:nth-child(3n) {
        border-left-color: #fbbf24;
        background: linear-gradient(135deg, rgba(251,191,36,0.05), rgba(0,10,20,0.95));
      }

      /* Badge colors */
      .admin-mobile-shell [class*="badge"],
      .admin-mobile-shell [class*="tag"],
      .admin-mobile-shell [class*="chip"] {
        border: 1px solid;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .admin-mobile-shell [class*="badge"]:nth-child(1),
      .admin-mobile-shell [class*="tag"]:nth-child(1),
      .admin-mobile-shell [class*="chip"]:nth-child(1) {
        border-color: #00e5ff !important;
        color: #00e5ff !important;
        background: rgba(0,229,255,0.1) !important;
      }

      .admin-mobile-shell [class*="badge"]:nth-child(2),
      .admin-mobile-shell [class*="tag"]:nth-child(2),
      .admin-mobile-shell [class*="chip"]:nth-child(2) {
        border-color: #ff00ff !important;
        color: #ff00ff !important;
        background: rgba(255,0,255,0.1) !important;
      }

      .admin-mobile-shell [class*="badge"]:nth-child(3),
      .admin-mobile-shell [class*="tag"]:nth-child(3),
      .admin-mobile-shell [class*="chip"]:nth-child(3) {
        border-color: #fbbf24 !important;
        color: #fbbf24 !important;
        background: rgba(251,191,36,0.1) !important;
      }

      .admin-mobile-shell [class*="badge"]:nth-child(4),
      .admin-mobile-shell [class*="tag"]:nth-child(4),
      .admin-mobile-shell [class*="chip"]:nth-child(4) {
        border-color: #ec4899 !important;
        color: #ec4899 !important;
        background: rgba(236,72,153,0.1) !important;
      }

      .admin-mobile-shell [class*="badge"]:nth-child(5),
      .admin-mobile-shell [class*="tag"]:nth-child(5),
      .admin-mobile-shell [class*="chip"]:nth-child(5) {
        border-color: #06b6d4 !important;
        color: #06b6d4 !important;
        background: rgba(6,182,212,0.1) !important;
      }

      .admin-mobile-shell [class*="badge"]:nth-child(6),
      .admin-mobile-shell [class*="tag"]:nth-child(6),
      .admin-mobile-shell [class*="chip"]:nth-child(6) {
        border-color: #8b5cf6 !important;
        color: #8b5cf6 !important;
        background: rgba(139,92,246,0.1) !important;
      }

      /* Modal overlay colors */
      .admin-mobile-shell .fixed.inset-0 {
        background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,229,255,0.1), rgba(0,0,0,0.7)) !important;
        backdrop-filter: blur(4px) !important;
      }

      .admin-mobile-shell .fixed.inset-0 .crt-panel {
        border: 2px solid #00e5ff;
        box-shadow: 0 0 40px rgba(0,229,255,0.3), inset 0 0 30px rgba(0,229,255,0.1);
      }

      /* Form section headers */
      .admin-mobile-shell [class*="section-header"],
      .admin-mobile-shell .crt-panel > h3 {
        color: #00e5ff !important;
        border-bottom: 2px solid rgba(0,229,255,0.3);
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
      }

      /* Success indicators */
      .admin-mobile-shell [class*="success"],
      .admin-mobile-shell [class*="complete"],
      .admin-mobile-shell [class*="checkmark"] {
        color: #4ade80 !important;
        text-shadow: 0 0 10px rgba(74,222,128,0.6) !important;
      }

      /* Warning indicators */
      .admin-mobile-shell [class*="warning"],
      .admin-mobile-shell [class*="alert"] {
        color: #fbbf24 !important;
        text-shadow: 0 0 10px rgba(251,191,36,0.6) !important;
      }

      /* Error indicators */
      .admin-mobile-shell [class*="error"],
      .admin-mobile-shell [class*="invalid"] {
        color: #f87171 !important;
        text-shadow: 0 0 10px rgba(248,113,113,0.6) !important;
      }

      /* Progress bars with gradient */
      .admin-mobile-shell progress,
      .admin-mobile-shell [class*="progress"] {
        background: rgba(0,229,255,0.1);
        border: 1px solid rgba(0,229,255,0.3);
      }

      .admin-mobile-shell progress::-webkit-progress-value,
      .admin-mobile-shell [class*="progress"]::after {
        background: linear-gradient(90deg, #00e5ff, #ff00ff, #fbbf24);
      }

      .admin-mobile-shell progress::-moz-progress-bar {
        background: linear-gradient(90deg, #00e5ff, #ff00ff, #fbbf24);
      }

      /* Category colors for tech stack items */
      .admin-mobile-shell .tech-item:nth-child(1) {
        border: 2px solid #00e5ff;
        background: linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,229,255,0.02));
      }
      .admin-mobile-shell .tech-item:nth-child(2) {
        border: 2px solid #ff00ff;
        background: linear-gradient(135deg, rgba(255,0,255,0.1), rgba(255,0,255,0.02));
      }
      .admin-mobile-shell .tech-item:nth-child(3) {
        border: 2px solid #fbbf24;
        background: linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.02));
      }
      .admin-mobile-shell .tech-item:nth-child(4) {
        border: 2px solid #ec4899;
        background: linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.02));
      }
      .admin-mobile-shell .tech-item:nth-child(5) {
        border: 2px solid #06b6d4;
        background: linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.02));
      }
      .admin-mobile-shell .tech-item:nth-child(6) {
        border: 2px solid #8b5cf6;
        background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.02));
      }
      .admin-mobile-shell .tech-item:nth-child(7) {
        border: 2px solid #14b8a6;
        background: linear-gradient(135deg, rgba(20,184,166,0.1), rgba(20,184,166,0.02));
      }

      /* Alternating row colors for tables */
      .admin-mobile-shell tbody tr:nth-child(odd) {
        background-color: rgba(0,229,255,0.05);
        border-left: 3px solid #00e5ff;
      }
      .admin-mobile-shell tbody tr:nth-child(even) {
        background-color: rgba(255,0,255,0.05);
        border-left: 3px solid #ff00ff;
      }

      /* Link styling */
      .admin-mobile-shell a {
        color: #00e5ff !important;
        text-decoration: underline;
        transition: all 0.3s ease;
      }
      .admin-mobile-shell a:hover {
        color: #ff00ff !important;
        text-shadow: 0 0 10px rgba(255,0,255,0.5);
      }

      /* Vertical color stripes for panels */
      .admin-mobile-shell .crt-panel::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, #00e5ff, #ff00ff, #fbbf24);
        opacity: 0.5;
        border-radius: 0;
      }
    `}</style>
  );
}
