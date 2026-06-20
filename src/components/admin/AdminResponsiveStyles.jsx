export default function AdminResponsiveStyles() {
  return (
    <style>{`
      .admin-mobile-shell {
        --admin-bg: #0b1020;
        --admin-bg-strong: #111827;
        --admin-panel: rgba(15, 23, 42, 0.74);
        --admin-panel-solid: #121a2b;
        --admin-border: rgba(203, 213, 225, 0.2);
        --admin-border-strong: rgba(203, 213, 225, 0.34);
        --admin-text: #f8fafc;
        --admin-muted: #a7b3c7;
        --admin-faint: #748196;
        --admin-cyan: #22d3ee;
        --admin-violet: #a78bfa;
        --admin-amber: #f59e0b;
        --admin-emerald: #34d399;
        --admin-rose: #fb7185;
        --admin-shadow: 0 22px 70px rgba(2, 6, 23, 0.38);
        color: var(--admin-text);
        background:
          linear-gradient(135deg, rgba(34, 211, 238, 0.08), transparent 34%),
          linear-gradient(225deg, rgba(245, 158, 11, 0.07), transparent 32%),
          linear-gradient(180deg, #0b1020 0%, #111827 54%, #0f172a 100%) !important;
        font-family: Inter, Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .admin-modern-shell {
        isolation: isolate;
      }

      .admin-3d-background {
        background:
          linear-gradient(140deg, rgba(2, 6, 23, 0.94), rgba(15, 23, 42, 0.76) 42%, rgba(17, 24, 39, 0.96)),
          linear-gradient(90deg, rgba(34, 211, 238, 0.12), rgba(167, 139, 250, 0.08), rgba(245, 158, 11, 0.09));
      }

      .admin-3d-background canvas {
        display: block;
        min-height: 100%;
        min-width: 100%;
        opacity: 0.74;
      }

      .admin-3d-fallback {
        background:
          linear-gradient(180deg, rgba(248, 250, 252, 0.07), transparent 22%, rgba(2, 6, 23, 0.38)),
          linear-gradient(90deg, rgba(34, 211, 238, 0.08), transparent 45%, rgba(245, 158, 11, 0.06));
      }

      .admin-3d-grid {
        opacity: 0.18;
        background-image:
          linear-gradient(rgba(226, 232, 240, 0.12) 1px, transparent 1px),
          linear-gradient(90deg, rgba(226, 232, 240, 0.12) 1px, transparent 1px);
        background-size: 52px 52px;
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.86), rgba(0, 0, 0, 0.28) 72%, transparent);
      }

      .admin-top-nav {
        border-bottom: 1px solid var(--admin-border);
        background: rgba(8, 13, 26, 0.78);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        box-shadow: 0 12px 40px rgba(2, 6, 23, 0.28);
      }

      .admin-brand-mark {
        background:
          linear-gradient(135deg, rgba(34, 211, 238, 0.26), rgba(167, 139, 250, 0.18)),
          rgba(15, 23, 42, 0.78);
        border: 1px solid rgba(125, 211, 252, 0.38);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.12);
      }

      .admin-nav-link,
      .admin-nav-action {
        border: 1px solid rgba(203, 213, 225, 0.16);
        background: rgba(15, 23, 42, 0.56);
        color: rgba(248, 250, 252, 0.76);
        border-radius: 8px;
        transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, color 180ms ease;
      }

      .admin-nav-link:hover,
      .admin-nav-action:hover {
        transform: translateY(-1px);
        border-color: rgba(125, 211, 252, 0.5);
        background: rgba(30, 41, 59, 0.76);
        color: #ffffff;
      }

      .admin-nav-link[data-active="true"] {
        color: #ffffff;
        border-color: rgba(34, 211, 238, 0.56);
        background:
          linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(167, 139, 250, 0.14)),
          rgba(15, 23, 42, 0.82);
      }

      .admin-mobile-shell.crt-screen,
      .admin-mobile-shell .crt-screen,
      .admin-mobile-shell.crt-glow,
      .admin-mobile-shell .crt-glow {
        animation: none !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .admin-mobile-shell.crt-screen::before,
      .admin-mobile-shell.crt-screen::after,
      .admin-mobile-shell .crt-screen::before,
      .admin-mobile-shell .crt-screen::after {
        display: none !important;
      }

      .admin-mobile-shell .crt-panel,
      .admin-mobile-shell .admin-panel-card,
      .admin-mobile-shell [class*="bg-black/60"],
      .admin-mobile-shell [class*="bg-black/40"],
      .admin-mobile-shell [class*="bg-gray-900/50"],
      .admin-mobile-shell [class*="bg-slate-950"],
      .admin-mobile-shell [class*="bg-slate-900"] {
        background: var(--admin-panel) !important;
        border: 1px solid var(--admin-border) !important;
        border-radius: 8px !important;
        box-shadow: var(--admin-shadow) !important;
        -webkit-backdrop-filter: blur(18px);
        backdrop-filter: blur(18px);
      }

      .admin-mobile-shell .crt-panel::before {
        display: none !important;
      }

      .admin-mobile-shell .crt-text,
      .admin-mobile-shell .crt-header {
        color: var(--admin-text) !important;
        font-family: inherit !important;
        text-shadow: none !important;
      }

      .admin-mobile-shell h1,
      .admin-mobile-shell h2,
      .admin-mobile-shell h3 {
        color: var(--admin-text) !important;
        letter-spacing: 0 !important;
        text-shadow: none !important;
      }

      .admin-mobile-shell p,
      .admin-mobile-shell label,
      .admin-mobile-shell span,
      .admin-mobile-shell div {
        text-shadow: none !important;
      }

      .admin-mobile-shell .text-green-400,
      .admin-mobile-shell .text-green-500,
      .admin-mobile-shell .text-green-600,
      .admin-mobile-shell .text-cyan-400,
      .admin-mobile-shell .text-cyan-500,
      .admin-mobile-shell .text-purple-400,
      .admin-mobile-shell .text-pink-400 {
        text-shadow: none !important;
      }

      .admin-mobile-shell .status-success,
      .admin-mobile-shell [class*="text-green-"] {
        color: var(--admin-emerald) !important;
      }

      .admin-mobile-shell .status-error,
      .admin-mobile-shell [class*="text-red-"] {
        color: var(--admin-rose) !important;
      }

      .admin-mobile-shell .status-info,
      .admin-mobile-shell [class*="text-cyan-"],
      .admin-mobile-shell [class*="text-blue-"] {
        color: var(--admin-cyan) !important;
      }

      .admin-mobile-shell [class*="text-yellow-"],
      .admin-mobile-shell [class*="text-amber-"] {
        color: var(--admin-amber) !important;
      }

      .admin-mobile-shell input:not([type="checkbox"]):not([type="radio"]),
      .admin-mobile-shell textarea,
      .admin-mobile-shell select,
      .admin-mobile-shell .crt-input,
      .admin-mobile-shell .crt-textarea {
        width: 100%;
        background: rgba(8, 13, 26, 0.72) !important;
        border: 1px solid rgba(203, 213, 225, 0.22) !important;
        border-radius: 8px !important;
        color: var(--admin-text) !important;
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.04) !important;
        outline: none !important;
        transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
      }

      .admin-mobile-shell input::placeholder,
      .admin-mobile-shell textarea::placeholder {
        color: rgba(167, 179, 199, 0.58) !important;
      }

      .admin-mobile-shell input:focus,
      .admin-mobile-shell textarea:focus,
      .admin-mobile-shell select:focus,
      .admin-mobile-shell .crt-input:focus,
      .admin-mobile-shell .crt-textarea:focus {
        border-color: rgba(34, 211, 238, 0.66) !important;
        box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.12), inset 0 1px rgba(255, 255, 255, 0.05) !important;
      }

      .admin-mobile-shell button,
      .admin-mobile-shell .crt-button,
      .admin-mobile-shell label.crt-button,
      .admin-mobile-shell a.crt-button {
        border-radius: 8px !important;
        border: 1px solid rgba(203, 213, 225, 0.22) !important;
        background:
          linear-gradient(135deg, rgba(34, 211, 238, 0.14), rgba(167, 139, 250, 0.09)),
          rgba(15, 23, 42, 0.68) !important;
        color: var(--admin-text) !important;
        box-shadow: none !important;
        text-shadow: none !important;
        transition: transform 160ms ease, border-color 160ms ease, background 160ms ease, color 160ms ease !important;
      }

      .admin-mobile-shell button:hover:not(:disabled),
      .admin-mobile-shell .crt-button:hover:not(:disabled) {
        transform: translateY(-1px) !important;
        border-color: rgba(34, 211, 238, 0.58) !important;
        background:
          linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(245, 158, 11, 0.1)),
          rgba(30, 41, 59, 0.84) !important;
        box-shadow: 0 12px 28px rgba(2, 6, 23, 0.28) !important;
      }

      .admin-mobile-shell button:disabled,
      .admin-mobile-shell .crt-button:disabled {
        cursor: not-allowed;
        opacity: 0.55 !important;
      }

      .admin-mobile-shell .mix-blend-screen.blur-3xl {
        display: none !important;
      }

      .admin-mobile-shell ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      .admin-mobile-shell ::-webkit-scrollbar-track {
        background: rgba(15, 23, 42, 0.4);
      }

      .admin-mobile-shell ::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.35);
        border: 2px solid rgba(15, 23, 42, 0.45);
        border-radius: 999px;
      }

      .admin-mobile-shell ::-webkit-scrollbar-thumb:hover {
        background: rgba(34, 211, 238, 0.42);
      }

      .admin-mobile-shell table {
        border-collapse: separate;
        border-spacing: 0;
      }

      .admin-mobile-shell tbody tr {
        background: rgba(15, 23, 42, 0.34) !important;
      }

      .admin-mobile-shell .fixed.inset-0.z-50,
      .admin-mobile-shell .fixed.inset-0.z-\\[50\\],
      .admin-mobile-shell .fixed.inset-0.z-\\[999\\],
      .admin-mobile-shell .fixed.inset-0.z-\\[1000\\] {
        background: rgba(2, 6, 23, 0.74) !important;
        -webkit-backdrop-filter: blur(18px);
        backdrop-filter: blur(18px);
      }

      @media (max-width: 1024px) {
        .admin-mobile-shell {
          min-height: 100svh;
          overflow-x: hidden;
        }

        .admin-mobile-shell .lg\\:h-screen,
        .admin-mobile-shell .h-screen {
          height: auto !important;
          min-height: 100svh !important;
        }

        .admin-mobile-shell .lg\\:overflow-hidden,
        .admin-mobile-shell .overflow-hidden {
          overflow: visible !important;
        }

        .admin-mobile-shell .w-screen {
          width: 100% !important;
        }

        .admin-mobile-shell .w-64,
        .admin-mobile-shell .w-72 {
          width: 100% !important;
        }

        .admin-mobile-shell .grid.grid-cols-2,
        .admin-mobile-shell .grid.grid-cols-3,
        .admin-mobile-shell .grid.grid-cols-4 {
          grid-template-columns: minmax(0, 1fr) !important;
        }

        .admin-mobile-shell .flex.gap-4,
        .admin-mobile-shell .flex.gap-3,
        .admin-mobile-shell .flex.items-center.justify-between {
          flex-wrap: wrap;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .admin-3d-background canvas {
          display: none;
        }

        .admin-mobile-shell *,
        .admin-mobile-shell *::before,
        .admin-mobile-shell *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 120ms !important;
        }
      }
    `}</style>
  );
}
