import Head from "next/head";
import "../src/index.css";

export default function PortfolioApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Deepak Saminathan | Full Stack Developer, AI/ML & Cloud</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
