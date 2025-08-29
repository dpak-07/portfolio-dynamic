# portfolio-dynamic

## Tailwind migration notes

This project was migrated to use Tailwind CSS. To install the new dependencies and run the dev server on Windows PowerShell:

```powershell
npm install
npm run dev
```

Tailwind config file: `tailwind.config.cjs` and PostCSS config: `postcss.config.cjs` were added. The main CSS entry is `src/index.css` (imports Tailwind directives and preserves original custom CSS rules/animations).
