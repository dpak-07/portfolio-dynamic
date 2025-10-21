import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

/* -------------------------------------------------------
   🔥 Firebase Initialization
------------------------------------------------------- */
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* -------------------------------------------------------
   🧩 Admin Data
------------------------------------------------------- */
const adminData = {
  user: "deepak",
  password: "deepak@2006",
  secretCode: 69,
};

/* -------------------------------------------------------
   🧭 Sections Visibility
------------------------------------------------------- */
const sectionsData = {
  home: true,
  about: true,
  "tech-stack": true,
  projects: true,
  resume: true,
  contact: true,
};

/* -------------------------------------------------------
   👤 Profile Data
------------------------------------------------------- */
const profileData = {
  name: "Deepak",
  roles: "Full-Stack Developer • Cloud Engineer • AI Enthusiast",
  typewriterLines: [
    "Deploying apps on AWS EC2 & S3 ☁️",
    "Automating tasks with Linux scripts 🐧",
    "Building scalable full-stack apps with React & Node ⚙️",
  ],
  resumeDriveLink:
    "https://drive.google.com/file/d/1BazHbJLKXz0xJFrsd9ZgJkAB0aR9d8nW_/view?usp=sharing",
  lastUpdated: "2025-10-21 19:09:56",
  socials: {
    github: "https://github.com/dpak-07",
    linkedin: "https://www.linkedin.com/in/deepak-saminathan/",
    email: "mailto:deepakofficial0103@gmail.com",
    instagram: "https://www.instagram.com/deepak.codes/",
    twitter: "",
    website: "https://deepak-portfolio.vercel.app",
  },
};

/* -------------------------------------------------------
   📄 Resume Data
------------------------------------------------------- */
const resumeData = {
  header: {
    title: "My Interactive Resume",
    gradient: "from-cyan-400 via-blue-400 to-purple-400",
  },
  description:
    "Driven software engineer passionate about designing intelligent, scalable, and visually refined digital systems. Focused on merging AI, full-stack architecture, and human-centered design to craft seamless experiences that empower users and transform industries.",
  skills: [
    "Full-Stack Development",
    "AI & Machine Learning",
    "Cloud Infrastructure",
    "DevOps & CI/CD",
    "Data Engineering",
    "Product Design",
  ],
  resumeDriveLink:
    "https://drive.google.com/file/d/1BazHbJLKXz0xJFrsd9ZgJkAB0aR9d8nW_/view?usp=sharing",
  lastUpdated: "2025-10-21 19:09:56",
  updatedBy: "kavshick",
};

/* -------------------------------------------------------
   👤 About Page Data (Holo Cards + Bio)
------------------------------------------------------- */
const aboutpageconfig = {
  image: {
    url: "https://1drv.ms/i/c/ac01abdcf0387f53/IQTDfhsFAQDOQ5Zeh9Df-4-vAbMANaw6yEm8EdW4q4NpN4w?width=1280&height=1280",
    iframeFallbackUrl: null,
  },
  initialMode: "holo",
  cards: [
    { id: "edu", title: "Education", icon: "graduation", short: "B.Tech — AI & Data Science (pre-final)", long: "Velammal Engineering College — Coursework in ML, DL, Data Mining. GPA: (add yours)" },
    { id: "ai", title: "AI & ML", icon: "brain", short: "Computer vision, NLP, model deployment", long: "Model experience: classification, object detection, transformers; deployed with Flask/Node and Docker." },
    { id: "full", title: "Full Stack", icon: "laptop", short: "React, Node.js, Flask, MongoDB", long: "Built responsive apps, auth flows, REST/GraphQL APIs, real-time features and CI/CD pipelines." },
    { id: "cloud", title: "Cloud", icon: "cloud", short: "AWS / GCP basics; containerization", long: "Experience with EC2, S3, Cloud Run, Docker, and simple infra-as-code for reproducible deployments." },
    { id: "awards", title: "Achievements", icon: "trophy", short: "Hackathons, Certificates, Internships", long: "Won campus hackathon; completed specializations and internships focusing on ML engineering and MLOps." },
    { id: "goals", title: "Goals", icon: "compass", short: "Build production-ready AI systems", long: "Aim to scale AI systems in cloud-native ways, mentor others, and open-source useful tools." },
  ],
  counters: [
    { id: "models", label: "ML Models Built", value: 12 },
    { id: "projects", label: "Projects Completed", value: 25 },
    { id: "clouds", label: "Cloud Deployments", value: 8 },
  ],
  bio: {
    short:
      "I'm a pre-final year AI & Data Science student at Velammal Engineering College. I build practical ML systems and full-stack apps that solve real problems.",
    badges: ["Production ML", "Full-stack", "MLOps"],
    expanded: {
      strengths: [
        "End-to-end model lifecycle: training → deployment → monitoring",
        "Frontend + backend: modern React, REST/APIs, realtime features",
        "Lightweight MLOps: Docker, simple CI/CD, reproducible infra",
      ],
      recent:
        "Built a civic issue reporting prototype: photo & voice capture, auto-routing to authorities, duplicate detection, and a dashboard for tracking resolutions.",
      values:
        "I focus on projects that deliver measurable public impact and scale reliably for actual users.",
    },
  },
  holoSections: [
    { type: "bio" },
    { type: "interests", content: "Computer Vision, NLP, MLOps, Cloud-native AI, Open-source" },
    { type: "learning", content: "Kubernetes for ML, transformer optimization, distributed training" },
  ],
  resumeTarget: "resume",
};

/* -------------------------------------------------------
   ⚙️ Tech Stack + Footer
------------------------------------------------------- */
const techStackData = [
  { title: "Languages", tech: ["C", "Python", "Java", "JavaScript", "Dart", "HTML", "CSS", "TypeScript"] },
  { title: "Frontend", tech: ["React", "Next.js", "Tailwind CSS", "Flutter", "Bootstrap", "Vite"] },
  { title: "Backend", tech: ["Node.js", "Express", "Flask", "FastAPI", "Spring Boot"] },
  { title: "Databases", tech: ["MongoDB", "MySQL", "SQLite", "PostgreSQL", "Firebase"] },
  { title: "Cloud & DevOps", tech: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Vercel"] },
  { title: "AI & ML", tech: ["TensorFlow", "PyTorch", "OpenCV", "Keras", "NumPy", "Pandas"] },
  { title: "Mobile", tech: ["React Native", "Flutter", "Android", "iOS", "Expo"] },
  { title: "Tools", tech: ["Git", "GitHub", "VS Code", "Postman", "Linux", "Figma"] },
];

const footerData = [
  {
    title: "About Me",
    type: "about",
    content:
      "Hi, I'm Deepak S — a creative developer crafting digital experiences with React, Next.js, and a passion for design.",
  },
  {
    title: "Quick Links",
    type: "links",
    links: ["About", "Projects", "Skills", "Contact"],
  },
  {
    title: "Contact",
    type: "contact",
    email: "deepakofficail0103@gmail.com",
    phone: "📞 6369021716",
    socials: [
      { href: "https://github.com/dpak-07", icon: "fab fa-github" },
      { href: "https://www.linkedin.com/in/deepak-saminathan/", icon: "fab fa-linkedin" },
      { href: "https://www.instagram.com/d.pak_07/", icon: "fab fa-instagram" },
    ],
  },
];

/* -------------------------------------------------------
   🚀 Projects Data
------------------------------------------------------- */
const projectsData = {
  categories: {
    "Cloud / Backend": [
      {
        title: "College Website (Backend & Cloud)",
        desc: "Worked as backend & cloud engineer",
        long: "Developed APIs, deployed backend on AWS, managed cloud infra, and integrated Nginx for production hosting.",
        img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
        tech: ["Flask", "MongoDB", "Nginx", "AWS"],
        url: null,
        live: "https://velammal.edu.in/webteam",
      },
    ],
    "Full-Stack": [
      {
        title: "Hotel Management",
        desc: "MongoDB + Flask project",
        long: "Full-stack hotel & restaurant management system with CRUD, authentication, and admin dashboards.",
        img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
        tech: ["Flask", "MongoDB", "HTML"],
        url: "https://github.com/Deepak-S-github/hotel-management",
      },
      {
        title: "Study Spark Platform",
        desc: "Full-stack learning platform",
        long: "Comprehensive platform designed to support interactive study modules with front & backend integration.",
        img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
        tech: ["JavaScript", "HTML", "CSS"],
        url: "https://github.com/dpak-07/STUDY_SPARK_01",
      },
      {
        title: "Phushit",
        desc: "Multi-platform app + dashboard",
        long: "Includes an app, dashboard, API, and browser extension built using Flutter, Python, and C++.",
        img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
        tech: ["Dart", "Python", "C++", "Flutter"],
        url: "https://github.com/dpak-07/phushit",
      },
    ],
    Frontend: [
      {
        title: "Calculator",
        desc: "Simple calculator built with JS",
        long: "A clean web calculator supporting basic arithmetic operations built with HTML, CSS, and JS.",
        img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
        tech: ["HTML", "CSS", "JavaScript"],
        url: "https://github.com/Deepak-S-github/CODSOFT-TASK-3-CALCULATOR-PPROJECT",
      },
      {
        title: "Landing Page",
        desc: "Static responsive landing page",
        long: "Responsive and aesthetic landing page designed using pure HTML, CSS, and JS.",
        img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
        tech: ["HTML", "CSS", "JavaScript"],
        url: "https://github.com/dpak-07/CODSOFT-TASK-2-LANDING-PAGE",
      },
    ],
    "Data / ML": [
      {
        title: "PySpark Learning",
        desc: "PySpark exercises in notebooks",
        long: "Hands-on PySpark learning workspace with DataFrame API examples for beginners in Big Data.",
        img: "https://onedrive.live.com/embed?resid=XXXXXXXXXX",
        tech: ["Python", "PySpark", "Jupyter"],
        url: "https://github.com/dpak-07/py_spark_learing",
      },
    ],
  },
};

/* -------------------------------------------------------
   🚀 Firestore Seeder
------------------------------------------------------- */
async function seed() {
  try {
    // Admin & Sections
    await setDoc(doc(db, "admin", "credentials"), adminData);
    await setDoc(doc(db, "sections", "visibility"), sectionsData);
    
    // Profile data
    await setDoc(doc(db, "portfolio", "profile"), profileData);
    
    // Resume data
    await setDoc(doc(db, "resume", "data"), resumeData);
    
    // Other pages
    await setDoc(doc(db, "aboutpage", "main"), aboutpageconfig);
    await setDoc(doc(db, "techStack", "categories"), { techStackData });
    await setDoc(doc(db, "footer", "details"), { footerData });
    
    // Projects data
    await setDoc(doc(db, "projects", "data"), projectsData);
    
    // Config
    await setDoc(doc(db, "config", "portfolio"), { theme: "holo" });

    console.log("✅ All collections seeded successfully!");
    console.log("📦 Collections created:");
    console.log("   - admin/credentials");
    console.log("   - sections/visibility");
    console.log("   - portfolio/profile");
    console.log("   - resume/data (with lastUpdated & updatedBy)");
    console.log("   - aboutpage/main");
    console.log("   - techStack/categories");
    console.log("   - footer/details");
    console.log("   - projects/data (with project categories & metadata)");
    console.log("   - config/portfolio");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding Firestore:", err);
    process.exit(1);
  }
}

seed();