import Head from "next/head";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 | Deepak Saminathan</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] px-6 text-center text-white">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 max-w-md text-white/65">
          The page you requested is not available. Head back to the portfolio homepage.
        </p>
        <a
          href="/"
          className="mt-8 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Back home
        </a>
      </main>
    </>
  );
}
