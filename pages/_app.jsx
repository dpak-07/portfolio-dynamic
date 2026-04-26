import Head from "next/head";
import "../src/index.css";

export default function PortfolioApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Deepak Saminathan | Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
