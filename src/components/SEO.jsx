import Head from "next/head";

export default function SEO({
  title = "Deepak S - Full Stack & AI Developer",
  description = "Portfolio of Deepak S, a full-stack developer from Chennai building web, cloud, and AI products with React, Next.js, and Firebase.",
  url = "https://dpak-portfolio.vercel.app",
  image = "/og-image.png",
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Deepak S",
    url,
    sameAs: [
      "https://github.com/dpak-07",
      "https://www.linkedin.com/in/deepak-saminathan/",
      "https://www.instagram.com/d.pak_07/",
    ],
    jobTitle: "Full Stack Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Deepak S Portfolio" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
