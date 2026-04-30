import { Head, Html, Main, NextScript } from "next/document";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || process.env.VITE_GTM_ID || "";

const gtmBootstrap = GTM_ID
  ? `(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', '${GTM_ID}');`
  : "";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Deepak Saminathan",
  url: "https://deepakportfolio-0607.web.app/",
  image: "https://deepakportfolio-0607.web.app/preview.png",
  jobTitle: "Full Stack Developer",
  worksFor: { 
    "@type": "Organization",
    name: "Freelance / Personal Projects",
  },
  sameAs: [
    "https://github.com/dpak-07",
    "https://www.linkedin.com/in/deepak-saminathan",
  ],
  description:
    "Full Stack Developer experienced in React, Node.js, Firebase, and modern web application design.",
};

export default function Document() {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <meta charSet="UTF-8" />
        {GTM_ID ? <script dangerouslySetInnerHTML={{ __html: gtmBootstrap }} /> : null}
        <meta
          name="description"
          content="Official portfolio of Deepak Saminathan - Full Stack Developer skilled in React, Node.js, Firebase, and modern web technologies. Explore my projects, skills, and achievements."
        />
        <meta
          name="keywords"
          content="Deepak Saminathan, Deepak Portfolio, Full Stack Developer, React Developer, Node.js Developer, Firebase, JavaScript, Web Developer, Software Engineer"
        />
        <meta name="author" content="Deepak Saminathan" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://deepakportfolio-0607.web.app/" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <meta property="og:title" content="Deepak Saminathan | Full Stack Developer Portfolio" />
        <meta
          property="og:description"
          content="Explore Deepak Saminathan's web development portfolio - showcasing React, Node.js, and Firebase projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deepakportfolio-0607.web.app/" />
        <meta property="og:image" content="https://deepakportfolio-0607.web.app/preview.png" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Deepak Saminathan | Full Stack Developer Portfolio" />
        <meta
          name="twitter:description"
          content="Official portfolio of Deepak Saminathan - React, Node.js, Firebase developer."
        />
        <meta name="twitter:image" content="https://deepakportfolio-0607.web.app/preview.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </Head>
      <body>
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
