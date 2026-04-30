import { Head, Html, Main, NextScript } from "next/document";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || process.env.VITE_GTM_ID || "";
const SITE_URL = "https://deepakportfolio-0607.web.app/";
const PREVIEW_IMAGE = `${SITE_URL}preview.png`;

const candidateSkills = [
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "AWS EC2",
  "AWS S3",
  "Docker",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "TensorFlow",
  "PyTorch",
  "OpenCV",
  "Flutter",
  "React Native",
  "Team Leadership",
];

const candidateDescription =
  "Deepak Saminathan is a Chennai-based Full Stack Developer, Backend Developer Intern, and AI & Data Science student with hands-on experience in React, Next.js, Node.js, Python, AWS, Docker, databases, mobile development, AI/ML projects, and team leadership.";

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
  alternateName: "Deepak S",
  url: SITE_URL,
  image: PREVIEW_IMAGE,
  email: "mailto:deepakofficial0103@gmail.com",
  jobTitle: "Full Stack Developer | Backend Developer Intern | AI/ML Developer",
  worksFor: {
    "@type": "Organization",
    name: "Freelance, internships, and personal projects",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Velammal Engineering College",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  knowsAbout: candidateSkills,
  sameAs: [
    "https://github.com/dpak-07",
    "https://www.linkedin.com/in/deepak-saminathan",
  ],
  description: candidateDescription,
};

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: SITE_URL,
  name: "Deepak Saminathan Portfolio",
  description: candidateDescription,
  mainEntity: personJsonLd,
};

const skillsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Deepak Saminathan technical skills",
  itemListElement: candidateSkills.map((skill, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: skill,
  })),
};

const structuredData = [personJsonLd, profilePageJsonLd, skillsJsonLd];

export default function Document() {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <meta charSet="UTF-8" />
        {GTM_ID ? <script dangerouslySetInnerHTML={{ __html: gtmBootstrap }} /> : null}
        <meta name="description" content={candidateDescription} />
        <meta
          name="keywords"
          content="Deepak Saminathan, Deepak S, Full Stack Developer, React Developer, Next.js Developer, Node.js Developer, Backend Developer Intern, MERN Stack, Python Developer, AI ML Developer, Machine Learning, AWS Cloud, Docker, MongoDB, MySQL, PostgreSQL, Flutter Developer, React Native, Chennai, Velammal Engineering College"
        />
        <meta name="author" content="Deepak Saminathan" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="candidate" content="Deepak Saminathan" />
        <meta name="job-title" content="Full Stack Developer, Backend Developer Intern, AI/ML Developer" />
        <meta name="skills" content={candidateSkills.join(", ")} />
        <meta name="location" content="Chennai, India" />
        <meta name="education" content="AI and Data Science, Velammal Engineering College" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" type="text/plain" title="AI recruiter profile" href="/llms.txt" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
        <meta property="og:description" content={candidateDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Deepak Saminathan Portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Deepak Saminathan | Full Stack Developer, AI/ML & Cloud" />
        <meta name="twitter:description" content={candidateDescription} />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
        <noscript>
          <section aria-label="Candidate profile summary">
            <h1>Deepak Saminathan - Full Stack Developer, AI/ML and Cloud Engineer</h1>
            <p>{candidateDescription}</p>
            <p>
              Core skills: React, Next.js, Node.js, Express.js, Python, JavaScript, TypeScript, AWS,
              Docker, MongoDB, MySQL, PostgreSQL, TensorFlow, PyTorch, OpenCV, Flutter, React Native.
            </p>
            <p>
              Contact: deepakofficial0103@gmail.com. Location: Chennai, India. GitHub:
              https://github.com/dpak-07. LinkedIn: https://www.linkedin.com/in/deepak-saminathan.
            </p>
          </section>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
