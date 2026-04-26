export default function AdminResponsiveStyles() {
  return (
    <style>{`
      @media (max-width: 1024px) {
        .admin-mobile-shell {
          overflow-x: hidden;
        }

        .admin-mobile-shell .crt-screen,
        .admin-mobile-shell .crt-glow {
          width: 100% !important;
          max-width: 100% !important;
          min-height: 100vh !important;
          height: auto !important;
        }

        .admin-mobile-shell .crt-screen,
        .admin-mobile-shell .crt-glow {
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        .admin-mobile-shell .crt-screen > div,
        .admin-mobile-shell .crt-glow > div {
          min-height: 100vh;
          width: 100%;
        }

        .admin-mobile-shell .crt-screen .h-full,
        .admin-mobile-shell .crt-glow .h-full,
        .admin-mobile-shell .crt-screen [class*="h-[calc"],
        .admin-mobile-shell .crt-glow [class*="h-[calc"] {
          height: auto !important;
        }

        .admin-mobile-shell .crt-screen .flex-1.flex.gap-4.overflow-hidden,
        .admin-mobile-shell .crt-screen .flex-1.flex.gap-4,
        .admin-mobile-shell .crt-glow .flex-1.flex.gap-4.overflow-hidden,
        .admin-mobile-shell .crt-glow .flex-1.flex.gap-4 {
          flex-direction: column !important;
          overflow: visible !important;
        }

        .admin-mobile-shell .crt-screen .w-64.crt-panel,
        .admin-mobile-shell .crt-glow .w-64.crt-panel {
          width: 100% !important;
          max-width: none !important;
          flex: none !important;
        }

        .admin-mobile-shell .crt-screen .crt-panel,
        .admin-mobile-shell .crt-glow .crt-panel {
          max-width: 100% !important;
        }

        .admin-mobile-shell .crt-screen .crt-panel.overflow-hidden,
        .admin-mobile-shell .crt-glow .crt-panel.overflow-hidden {
          overflow: visible !important;
        }

        .admin-mobile-shell .crt-screen .hide-scrollbar,
        .admin-mobile-shell .crt-glow .hide-scrollbar {
          overflow: auto !important;
        }

        .admin-mobile-shell .crt-screen .crt-button,
        .admin-mobile-shell .crt-glow .crt-button,
        .admin-mobile-shell .crt-screen button,
        .admin-mobile-shell .crt-glow button,
        .admin-mobile-shell .crt-screen a,
        .admin-mobile-shell .crt-glow a,
        .admin-mobile-shell .crt-screen label,
        .admin-mobile-shell .crt-glow label {
          min-height: 44px;
        }

        .admin-mobile-shell .crt-screen .crt-input,
        .admin-mobile-shell .crt-glow .crt-input,
        .admin-mobile-shell .crt-screen input,
        .admin-mobile-shell .crt-glow input,
        .admin-mobile-shell .crt-screen textarea,
        .admin-mobile-shell .crt-glow textarea,
        .admin-mobile-shell .crt-screen select,
        .admin-mobile-shell .crt-glow select {
          min-height: 44px;
          font-size: 16px !important;
        }

        .admin-mobile-shell .crt-screen textarea.crt-input,
        .admin-mobile-shell .crt-glow textarea.crt-input {
          min-height: 120px;
        }

        .admin-mobile-shell .crt-screen .grid.grid-cols-2,
        .admin-mobile-shell .crt-screen .grid.grid-cols-3,
        .admin-mobile-shell .crt-screen .grid.grid-cols-4,
        .admin-mobile-shell .crt-glow .grid.grid-cols-2,
        .admin-mobile-shell .crt-glow .grid.grid-cols-3,
        .admin-mobile-shell .crt-glow .grid.grid-cols-4 {
          grid-template-columns: minmax(0, 1fr) !important;
        }

        .admin-mobile-shell .crt-screen [class*="col-span-"],
        .admin-mobile-shell .crt-glow [class*="col-span-"] {
          grid-column: auto / span 1 !important;
        }

        .admin-mobile-shell .crt-screen [class*="row-span-"],
        .admin-mobile-shell .crt-glow [class*="row-span-"] {
          grid-row: auto / span 1 !important;
        }

        .admin-mobile-shell .crt-screen .flex.items-center.justify-between,
        .admin-mobile-shell .crt-screen .flex.justify-between.items-center,
        .admin-mobile-shell .crt-glow .flex.items-center.justify-between,
        .admin-mobile-shell .crt-glow .flex.justify-between.items-center {
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .admin-mobile-shell .crt-screen .flex.items-center.gap-2,
        .admin-mobile-shell .crt-screen .flex.items-center.gap-3,
        .admin-mobile-shell .crt-screen .flex.items-center.gap-4,
        .admin-mobile-shell .crt-screen .flex.gap-2,
        .admin-mobile-shell .crt-screen .flex.gap-3,
        .admin-mobile-shell .crt-screen .flex.gap-4,
        .admin-mobile-shell .crt-glow .flex.items-center.gap-2,
        .admin-mobile-shell .crt-glow .flex.items-center.gap-3,
        .admin-mobile-shell .crt-glow .flex.items-center.gap-4,
        .admin-mobile-shell .crt-glow .flex.gap-2,
        .admin-mobile-shell .crt-glow .flex.gap-3,
        .admin-mobile-shell .crt-glow .flex.gap-4 {
          flex-wrap: wrap;
        }

        .admin-mobile-shell .crt-screen .w-24,
        .admin-mobile-shell .crt-glow .w-24 {
          width: 100% !important;
        }

        .admin-mobile-shell .crt-screen .w-96,
        .admin-mobile-shell .crt-screen .max-w-2xl.w-full,
        .admin-mobile-shell .crt-screen .w-full.max-w-md,
        .admin-mobile-shell .crt-glow .w-96,
        .admin-mobile-shell .crt-glow .max-w-2xl.w-full,
        .admin-mobile-shell .crt-glow .w-full.max-w-md {
          width: 100% !important;
          max-width: 100% !important;
        }

        .admin-mobile-shell .crt-screen .pr-4,
        .admin-mobile-shell .crt-glow .pr-4 {
          padding-right: 0 !important;
        }
      }

      @media (max-width: 640px) {
        .admin-mobile-shell .crt-screen > div,
        .admin-mobile-shell .crt-glow > div {
          padding: 0.75rem !important;
          gap: 0.75rem !important;
        }

        .admin-mobile-shell .crt-screen .crt-panel.p-6,
        .admin-mobile-shell .crt-screen .crt-panel.p-4,
        .admin-mobile-shell .crt-screen .crt-panel.rounded-lg.p-6,
        .admin-mobile-shell .crt-screen .crt-panel.rounded-lg.p-4,
        .admin-mobile-shell .crt-glow .crt-panel.p-6,
        .admin-mobile-shell .crt-glow .crt-panel.p-4,
        .admin-mobile-shell .crt-glow .crt-panel.rounded-lg.p-6,
        .admin-mobile-shell .crt-glow .crt-panel.rounded-lg.p-4 {
          padding: 1rem !important;
        }

        .admin-mobile-shell .crt-screen .text-2xl,
        .admin-mobile-shell .crt-glow .text-2xl {
          font-size: 1.25rem !important;
          line-height: 1.4 !important;
        }

        .admin-mobile-shell .crt-screen .text-xl,
        .admin-mobile-shell .crt-glow .text-xl {
          font-size: 1.05rem !important;
          line-height: 1.4 !important;
        }
      }
    `}</style>
  );
}
