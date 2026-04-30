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
   🎛️ Load Control Flags
   Set to true to load that collection, false to skip
------------------------------------------------------- */
const LOAD_FLAGS = {
  admin: false,
  sections: true,
  profile: false,
  resume: true,
  about: false,
  techStack: true,
  footer: false,
  projects: true,
  certifications: false,
  timeline: true,
  analytics: false,
  config: false,
  blog: false,           // ✅ NEW: Blog posts
  linkedin: false,       // ✅ NEW: LinkedIn posts
};

/* -------------------------------------------------------
   🧩 Admin Data
------------------------------------------------------- */
const adminData = {
  user: "deepak",
  password: "",
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
  certifications: true,
  timeline: true,
  contact: true,
  blog: true,
  GITHUB: true,
};

/* -------------------------------------------------------
   👤 Profile Data
------------------------------------------------------- */
const profileData = {
  name: "Deepak S",
  location: "Chennai, India",
  education: "3rd Year AI & Data Science at Velammal Engineering College",
  roles: "Full-Stack Developer • Cloud Engineer • AI/ML Enthusiast • Blockchain Explorer • Team Lead",
  typewriterLines: [
    "Building intelligent systems with AI/ML 🤖",
    "Deploying scalable apps on AWS Cloud ☁️",
    "Leading team 404 Found US 👥",
    "Crafting full-stack solutions with MERN ⚡",
    "Exploring blockchain for secure credentials 🔗",
    "Mentoring peers in hackathons & projects 🚀"
  ],
  resumeDriveLink: "https://drive.google.com/file/d/1BazHbJLKXz0xJFrsd9ZgJkAB0aR9d8nW_/view?usp=sharing",
  lastUpdated: "2025-10-21 19:09:56",
  socials: {
    github: "https://github.com/dpak-07",
    linkedin: "https://www.linkedin.com/in/deepak-saminathan/",
    email: "mailto:deepakofficial0103@gmail.com",
    instagram: "https://www.instagram.com/d.pak_07/",
    twitter: "",
    website: "",
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
  description: "Passionate 3rd-year AI & Data Science student at Velammal Engineering College, Chennai with expertise in full-stack development, cloud computing, AI/ML, and team leadership. Leading a 6-member team '404 Found US' for hackathons and projects, building innovative solutions that bridge technology and real-world problems through hands-on experience.",
  skills: [
    "Full-Stack Development",
    "AI & Machine Learning",
    "Cloud Infrastructure (AWS)",
    "Team Leadership & Management",
    "Blockchain Systems",
    "Project Coordination",
    "Data Analytics & Visualization",
    "Mobile App Development",
    "DevOps & CI/CD",
    "UI/UX Design",
    "Database Management"
  ],
  resumeDriveLink: "https://drive.google.com/file/d/1BazHbJLKXz0xJFrsd9ZgJkAB0aR9d8nW_/view?usp=sharing",
  lastUpdated: "2025-10-21 19:09:56",
  updatedBy: "deepak",
};

/* -------------------------------------------------------
   👤 About Page Data (Holo Cards + Bio)
------------------------------------------------------- */
const aboutpageconfig = {
  image: {
    url: "https://1drv.ms/i/c/b09eaa48933f939d/IQRnLRZO9anwRpSnj_Ho-qAMAfGk4BcfFAFfyGM9FPs1PVQ?width=4284&height=5712",
    iframeFallbackUrl: null,
  },
  initialMode: "holo",
  cards: [
    {
      id: "edu",
      title: "Education",
      icon: "graduation",
      short: "B.Tech AI & Data Science (3rd Year)",
      long: "Velammal Engineering College, Chennai | Specializing in Machine Learning, Deep Learning, Data Mining, and Artificial Intelligence. Passionately applying theoretical knowledge through real-world projects and hackathons."
    },
    {
      id: "ai",
      title: "AI & ML",
      icon: "brain",
      short: "Computer Vision, NLP, Model Deployment",
      long: "Hands-on experience with classification models, object detection, transformers, and deploying ML models with Flask/Node.js. Building intelligent systems that solve practical problems using cutting-edge AI technologies."
    },
    {
      id: "full",
      title: "Full Stack",
      icon: "laptop",
      short: "MERN Stack, React Native, Flutter",
      long: "Expertise in building responsive web applications, authentication systems, REST APIs, real-time features, and cross-platform mobile apps. Experience with modern frameworks and comprehensive state management."
    },
    {
      id: "leadership",
      title: "Leadership",
      icon: "users",
      short: "Team Lead - 404 Found US",
      long: "Leading a team for SIH 2025 and various hackathons. Responsible for project coordination, task delegation, code reviews, and mentoring team members in technical domains including full-stack development and cloud technologies."
    },
    {
      id: "cloud",
      title: "Cloud & DevOps",
      icon: "cloud",
      short: "AWS EC2, S3, Docker, CI/CD",
      long: "Proficient in deploying applications on AWS cloud infrastructure, containerizing applications with Docker, and implementing CI/CD pipelines for automated deployments and scalable solutions."
    },
    {
      id: "blockchain",
      title: "Blockchain",
      icon: "link",
      short: "Credential Systems, Secure Storage",
      long: "Developing blockchain-based credential management systems with cryptographic verification and decentralized storage for secure academic certificate management and sharing. Leading CredsOne project for SIH 2025."
    },
  ],
  counters: [
    { id: "projects", label: "Projects Completed", value: 15 },
    { id: "hackathons", label: "Hackathons", value: 6 },
    { id: "internships", label: "Internships", value: 2 },
  ],
  bio: {
    short: "I'm a passionate 3rd-year AI & Data Science student from Chennai and team lead who loves exploring every facet of technology while mentoring peers. I lead '404 Found US' - a 6-member team for hackathons and innovative projects.",
    badges: ["AI/ML Enthusiast", "Full-Stack Developer", "Team Lead", "Cloud Engineer", "Blockchain Explorer"],
    expanded: {
      strengths: [
        "Team leadership: Managing and mentoring 6-member development team for hackathons",
        "End-to-end project development: from ideation to deployment",
        "Cross-platform development: web, mobile, and cloud applications",
        "Problem-solving through hackathons and innovative projects",
        "Continuous learning and adapting to new technologies rapidly"
      ],
      recent: "Currently leading team '404 Found US' for CredsOne - a blockchain-based credential system selected for Smart India Hackathon 2025. Coordinating team efforts, managing project timelines, and ensuring project milestones are met.",
      values: "I believe in collaborative innovation and empowering team members to achieve their full potential. My leadership style focuses on clear communication, task delegation, and continuous learning while building practical technology solutions.",
    },
  },
  holoSections: [
    { type: "bio" },
    { type: "leadership", content: "Team Lead for 404 Found US | Project Coordinator | Hackathon Team Management | SIH 2025 Project Lead" },
    { type: "interests", content: "Artificial Intelligence, Cloud Computing, Blockchain, Full-Stack Development, Team Leadership, Open Source, Hackathons, Data Science" },
  ],
  resumeTarget: "resume",
};

/* -------------------------------------------------------
   ⚙️ Tech Stack + Footer
------------------------------------------------------- */
const techStackData = [
  {
    title: "Product Frontend",
    tech: ["React 19", "Next.js 15", "JavaScript", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite", "Responsive UI"]
  },
  {
    title: "Backend & APIs",
    tech: ["Node.js", "Express.js", "Flask", "FastAPI", "REST APIs", "JWT Auth", "Nginx", "Python"]
  },
  {
    title: "AI & Data Systems",
    tech: ["Python", "TensorFlow", "PyTorch", "OpenCV", "Scikit-learn", "Pandas", "NumPy", "Llama 3"]
  },
  {
    title: "Databases & Storage",
    tech: ["MongoDB", "Firebase Firestore", "Supabase", "PostgreSQL", "MySQL", "SQLite", "Cloud Storage", "Data Modeling"]
  },
  {
    title: "Cloud & DevOps",
    tech: ["AWS EC2", "AWS S3", "Docker", "GitHub Actions", "Vercel", "Firebase Hosting", "Linux", "CI/CD"]
  },
  {
    title: "Trust & Blockchain",
    tech: ["Web3 Concepts", "Cryptography", "Credential Verification", "Secure APIs", "OAuth", "Hashing", "Access Control", "Security Testing"]
  },
  {
    title: "Mobile & Cross-Platform",
    tech: ["Flutter", "React Native", "Dart", "Android", "Mobile UI", "API Integration", "Push-ready Flows", "Cross-platform UX"]
  },
  {
    title: "Design & Quality",
    tech: ["Figma", "Postman", "VS Code", "Git", "Component Systems", "Accessibility Basics", "Performance Checks", "Documentation"]
  },
];

const footerData = [
  {
    title: "About Me",
    type: "about",
    content: "Hi, I'm Deepak S from Chennai — a passionate 3rd-year AI & Data Science student at Velammal Engineering College and team lead exploring cloud computing, full-stack development, AI/ML, and blockchain technologies. I lead team '404 Found US' and build innovative solutions while mentoring peers in hackathons.",
  },
  {
    title: "Quick Links",
    type: "links",
    links: ["About", "Projects", "Tech Stack", "Certifications", "Timeline", "Contact"],
  },
  {
    title: "Contact & Team",
    type: "contact",
    email: "deepakofficial0103@gmail.com",
    phone: "📞 +91 6369021716",
    location: "📍 Chennai, India",
    team: "Team Lead - 404 Found US (6 members)",
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
    "AI Product Systems": [
      {
        title: "Study Spark - AI Learning OS",
        desc: "AI-powered learning workspace for notes, Q&A, summaries, and mind maps.",
        long: "Study Spark is an AI learning platform built around the real study loop: collect material, understand it, ask questions, and revise visually. The project uses a MERN foundation with AI-powered teaching, summarization, mind maps, and Q&A so learners can move from raw content to structured understanding inside one product.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQTpahjpGGWAQKJi1JHgIrvLAeEe2Cq3wSvr6hD4E2vmw6g?width=1919&height=908",
        tech: ["React", "Node.js", "MongoDB", "Llama 3", "Tailwind CSS", "AI Integration", "Team Project"],
        url: "https://github.com/dpak-07/STUDY_SPARK_01.git",
        live: null,
        featured: true
      },
    ],
    "Trust & Credentials": [
      {
        title: "CredsOne - Verifiable Credential Vault",
        desc: "Blockchain-inspired credential system for secure certificate storage and sharing.",
        long: "CredsOne is a credential management system focused on storing, generating, sharing, and verifying student certificates. The product is framed around trust: every credential should be easier to validate, harder to tamper with, and simpler for students to present during applications or events.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQTEXq0hGFzPTKejy5q73gosAcPzbMWtgN1UDKtZJ_IhgGE?width=1919&height=897",
        tech: ["Blockchain", "React", "Node.js", "MongoDB", "Cryptography", "Web3", "Team Leadership"],
        url: "https://github.com/dpak-07/CredsOne",
        live: null,
        featured: true
      },
      {
        title: "Phushit - Phishing Detection Suite",
        desc: "Multi-platform security product for fake website and phishing detection.",
        long: "Phushit is a security application direction for detecting fake websites and phishing attempts across multiple platforms. The project combines mobile-first alerts, dashboard visibility, an API layer, and browser extension thinking so detection can happen closer to where users actually encounter risky links.",
        img: "",
        tech: ["Flutter", "Python", "C++", "Dart", "Machine Learning", "Security", "Cross-Platform"],
        url: "https://github.com/dpak-07/phushit",
        live: null,
        featured: true
      },
    ],
    "Cloud & Backend": [
      {
        title: "Velammal Web Team Platform",
        desc: "Production backend and cloud work for the college web team presence.",
        long: "This project focused on backend and cloud engineering for the Velammal Engineering College web team website. The work covered API development, database integration, deployment on AWS EC2, Nginx setup, and production-oriented infrastructure decisions for a public-facing college platform.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQQeeY63WsZBT7i97geuaIFJAfvVVhGYRxBoUPfclR8q3SM?width=1919&height=910",
        tech: ["Flask", "MongoDB", "AWS EC2", "Nginx", "Python", "Cloud Deployment"],
        url: null,
        live: "https://velammal.edu.in/webteam",
        featured: true
      },
    ],
    "Data Platforms": [
      {
        title: "DataLens Excel Analytics",
        desc: "Upload-to-insight analytics platform with charting, history, and admin workflows.",
        long: "DataLens is an Excel analysis platform built to make spreadsheet review faster and more repeatable. It supports file handling, stored upload history, dynamic charts, and an admin-oriented workflow so users can move from raw Excel files to visual analysis without rebuilding the same setup each time.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQSfFeJUqQbrRaqAHHi2FNMPAch0Xke5MGUcAnDndptR9MY?width=1656&height=882",
        tech: ["Node.js", "Express", "MongoDB", "Chart.js", "Multer", "Data Analytics", "Backend"],
        url: "https://github.com/dpak-07/Data-visualization-analytics-web-application",
        live: null,
        featured: true
      },
    ],
    "Portfolio Infrastructure": [
      {
        title: "Dynamic Portfolio CMS",
        desc: "A portfolio system with Firestore-powered content and admin editing.",
        long: "This portfolio is built as a dynamic content system rather than a static page. Firestore powers the editable content, admin pages manage portfolio sections, and the public experience presents projects, stack, timeline, resume, and contact content through a responsive React/Next interface.",
        img: "",
        tech: ["React", "Next.js", "Firebase", "Firestore", "Tailwind CSS", "Framer Motion", "Admin CMS"],
        url: "https://github.com/dpak-07/portfolio-dynamic",
        live: null,
        featured: true
      },
    ],
  },
};

/* -------------------------------------------------------
   📜 Certifications Data
------------------------------------------------------- */
const certificationsData = {
  categories: [
    {
      id: "courses",
      label: "Courses & Certifications",
      icon: "BookOpen",
      items: [
        {
          title: "Full Stack Web Development",
          issuer: "CSC - HDFC Skill Development Center, Kolathur",
          date: "August 2024",
          desc: "Comprehensive full-stack development training covering C, C++, Java, and modern web technologies with extensive hands-on project experience. Mastered end-to-end web development concepts and practical implementation across multiple programming languages.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQRGgAevQWTFRYFvedm-6vbwAYnNsa33tQ97EeWP_vxKcHA?width=1280&height=1688",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQR9OaGbqet_RpoYh_79hOezASPRg8Ppe-GePTouPkbu3ls?width=1280&height=1741"
          ],
        },
        {
          title: "UI/UX Design Master Class",
          issuer: "Noviteck Solutions - 30 Days Program",
          date: "2025",
          desc: "Intensive 30-day master class covering Figma, WordPress, and modern UI/UX design principles with practical project work. Gained expertise in creating user-centered designs, interactive prototypes, and professional design workflows.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQSgppdIjSXRTKu8Gtpfi1QGAbjStQvkDOMKHQZ4LnEMnj8?width=5334&height=3734",
          ],
        },
      ],
    },
    {
      id: "internships",
      label: "Internships",
      icon: "Briefcase",
      items: [
        {
          title: "Backend Developer Intern",
          issuer: "Zidio",
          date: "2025",
          desc: "Developed MERN stack projects with comprehensive admin functionalities and advanced Excel data analysis features. Gained extensive experience in backend architecture, database management, API development, and data visualization implementations.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQSrrPWFnBZMTaXajIVoz0wsAZuJXak0WAiwAg56s2ZTuN0?width=2481&height=3508",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQSPVRkbz02hSaTsGFV643TcAQJkCco2V_l74vYwghi-p-8?width=2481&height=3508",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQTJWyQfizu-Tp0RnEB-nJIdAXsOROXupPCNljT0GKJJ9ec?width=2481&height=3508",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQR3goFsWvW_RahHMya2G8rzAciO2vQAMkfPotGbLx2KtqE?width=3508&height=2481",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQQbgpPx4jP1QqVxQrd2u8QOAU2UOZw-Xi0Pqid799pNCek?width=2481&height=3508"
          ],
        },
        {
          title: "Web Development Intern",
          issuer: "CodeSoft",
          date: "2024",
          desc: "Completed multiple web development projects including interactive calculator, responsive landing pages, and portfolio websites using HTML, CSS, and JavaScript. Built strong foundation in frontend development principles and responsive design techniques.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQQnEoTPZQKRSpLDlTdc8LV6AYuguGiKNlN1FSgcRYjmTKE?width=800&height=562",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQQN2EQJgPMYQo20QdqPiDV_AdO0nGdhA8AWxe6j0KzNCuo?width=2484&height=3509"
          ],
        },
      ],
    },
    {
      id: "participations",
      label: "Hackathons & Events",
      icon: "Award",
      items: [
        {
          title: "VECT Hackelite 2025 - Selected Round 1",
          issuer: "Velammal Engineering College",
          date: "2025",
          desc: "24-hour intensive hackathon participant with team. Developed Study Spark - an AI-powered learning platform with teaching bot and content summarization features. Successfully cleared the first selection round with innovative AI implementation.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQSooI1C9sztT5gT7xDdI1hHAT9sQRNrePV9X72K7SL_Ntg?width=960&height=1280",
            "https://1drv.ms/i/c/b09eaa48933f939d/IQQ0rkVsj9ydSZIClOvt_K2_AR7i-MLgjxv46UCD0PE4HwI?width=1600&height=1600"
          ],
        },
        {
          title: "Smart India Hackathon 2025",
          issuer: "National Level - Team Lead",
          date: "2025",
          desc: "Leading team '404 Found US' for CredsOne project - blockchain-based credential system for secure academic certificate management. Currently under development with focus on blockchain implementation and team coordination.",
          images: [],
        },
        {
          title: "Google Agentic Day 2025",
          issuer: "Google",
          date: "2025",
          desc: "Participated in AI agents workshop focusing on intelligent agent-based solutions. Presented innovative weather system idea leveraging AI agents for meteorological applications and intelligent automation.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQQJFCn4Bt7ERbUckdrN6WwHAS_h-UOsSMZug6TmA5wfwn8?width=2400&height=1800"
          ],
        },
        {
          title: "Bharatiya Antarakshee Hackathon 2025",
          issuer: "National Level Hackathon",
          date: "2025",
          desc: "Presented innovative idea 'Deshi' focusing on indigenous solutions in weather domain. Proposed cutting-edge approaches for meteorological challenges using local technological solutions and AI implementations.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQRYLMclGLB7Qah-gLPYrBrgAfss0ogQEbpvOqTqvNq3zQI?width=1754&height=1316"
          ],
        },
        {
          title: "Sparkathon 2025",
          issuer: "Walmart",
          date: "2025",
          desc: "Proposed innovative green credentialing system focusing on sustainable practices and environmental impact tracking. Contributed ideas for eco-friendly credential management and sustainability solutions.",
          images: [],
        },
        {
          title: "Electrathorn 2025",
          issuer: "St. Joseph Engineering College",
          date: "2025",
          desc: "Participated in technical competition showcasing innovative projects and solutions. Demonstrated technical expertise and problem-solving capabilities in competitive environment with practical implementations.",
          images: [
            "https://1drv.ms/i/c/b09eaa48933f939d/IQTlGjj7EXRJSpzJVvuNX5quATeQae14YTJ_n7hE73J1OI4?width=2048&height=1400"
          ],
        },
      ],
    },
  ],
};

/* -------------------------------------------------------
   🕒 TIMELINE DATA - From Your React Component
------------------------------------------------------- */
const timelineData = {
  events: [
    {
      year: "2026",
      period: "Portfolio Refresh",
      title: "Case-Study Portfolio System",
      icon: "Rocket",
      color: "from-cyan-400 to-emerald-500",
      accentColor: "cyan",
      description: "Rebuilt the portfolio narrative around focused projects, grouped capabilities, and recruiter-friendly case studies inspired by current high-performing developer portfolios.",
      achievements: [
        "Converted project cards into description-stack-proof case studies",
        "Refreshed stack into product-focused capability groups",
        "Reworked timeline into a clear current-to-foundation journey",
      ],
      skills: ["Portfolio Strategy", "React", "Firestore", "Content Design", "UI Systems"],
    },
    {
      year: "2025",
      period: "Hackathon Leadership",
      title: "CredsOne & Team 404 Found US",
      icon: "Trophy",
      color: "from-fuchsia-400 to-rose-500",
      accentColor: "fuchsia",
      description: "Led a 6-member team on CredsOne, a secure credential storage and verification system for student certificates and academic records.",
      achievements: [
        "Managed team coordination and project milestones",
        "Defined credential verification and secure sharing flows",
        "Built around Smart India Hackathon 2025 problem-solving",
      ],
      skills: ["Team Leadership", "Blockchain Concepts", "React", "Node.js", "MongoDB", "Project Management"],
    },
    {
      year: "2025",
      period: "AI Product Build",
      title: "Study Spark Learning Platform",
      icon: "Brain",
      color: "from-indigo-400 to-blue-600",
      accentColor: "indigo",
      description: "Built Study Spark as an AI-powered learning workspace with teaching bot, summarizer, mind maps, and Q&A flows powered by modern full-stack tooling.",
      achievements: [
        "Integrated Llama 3-powered learning assistance",
        "Created a MERN-based study workflow",
        "Presented through VECT Hackelite 2025",
      ],
      skills: ["AI Integration", "Llama 3", "React", "Node.js", "MongoDB", "Product Thinking"],
    },
    {
      year: "2025",
      period: "Cloud & Campus Web",
      title: "Velammal Web Team Platform",
      icon: "Cloud",
      color: "from-cyan-400 to-emerald-500",
      accentColor: "cyan",
      description: "Worked on backend and cloud engineering for the Velammal Engineering College web team platform, connecting APIs, MongoDB, AWS EC2, and Nginx for a production web presence.",
      achievements: [
        "Handled backend and deployment responsibilities",
        "Configured AWS EC2 and Nginx hosting flow",
        "Supported a live college web team platform",
      ],
      skills: ["Flask", "MongoDB", "AWS EC2", "Nginx", "Backend APIs", "Linux"],
    },
    {
      year: "2025",
      period: "Backend Internship",
      title: "DataLens Excel Analytics",
      icon: "Briefcase",
      color: "from-violet-400 to-purple-600",
      accentColor: "violet",
      description: "Developed backend-heavy analytics workflows during Zidio internship work, including Excel upload handling, chart generation, history management, and admin-oriented data views.",
      achievements: [
        "Built upload-to-chart analytics flow",
        "Practiced MERN backend architecture",
        "Added history and admin data management patterns",
      ],
      skills: ["Node.js", "Express", "MongoDB", "Chart.js", "Multer", "Data Analytics"],
    },
    {
      year: "2024",
      period: "Frontend Internship",
      title: "CodeSoft Web Development",
      icon: "Code",
      color: "from-emerald-400 to-teal-500",
      accentColor: "emerald",
      description: "Built foundational web projects including calculator, landing page, and portfolio-style tasks while strengthening responsive HTML, CSS, and JavaScript fundamentals.",
      achievements: [
        "Built interactive calculator UI",
        "Practiced responsive layout and JavaScript interactions",
        "Created a stronger frontend foundation for later full-stack work",
      ],
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design", "Frontend Development"],
    },
    {
      year: "2023",
      period: "AI & Data Science",
      title: "Velammal Engineering College",
      icon: "GraduationCap",
      color: "from-orange-400 to-red-500",
      accentColor: "orange",
      description: "Started B.Tech in Artificial Intelligence and Data Science at Velammal Engineering College, focusing on machine learning, data systems, and applied software development.",
      achievements: [
        "Focused on AI, machine learning, and data systems",
        "Started applying coursework through product builds",
        "Built a foundation for full-stack AI projects",
      ],
      skills: ["Machine Learning", "Data Science", "Python", "Deep Learning", "Data Mining"],
    },
    {
      year: "2022",
      period: "Full-Stack Foundation",
      title: "CSC / HDFC Skill Development",
      icon: "Award",
      color: "from-blue-400 to-indigo-500",
      accentColor: "blue",
      description: "Built the programming and web foundation through full-stack development training covering C, C++, Java, and core web technologies.",
      achievements: [
        "Completed full-stack development certification",
        "Practiced C, C++, Java, and web development fundamentals",
        "Started building complete web application workflows",
      ],
      skills: ["C", "C++", "Java", "Full-Stack Development", "Web Technologies"],
    },
  ],
  stats: [
    { label: "Active Journey", value: "2022-2026", icon: "TrendingUp" },
    { label: "Focused Case Studies", value: "6", icon: "Target" },
    { label: "Team Members Led", value: "6", icon: "Users" },
    { label: "Core Domains", value: "5", icon: "Trophy" },
  ],
};

/* -------------------------------------------------------
   📊 Analytics Data
------------------------------------------------------- */
const analyticsSeed = {
  totals: {
    totalViews: 0,
    totalClicks: 0,
    totalDownloads: 0,
    totalResumeOpens: 0,
  },
  sections: {
    home: 0,
    about: 0,
    "tech-stack": 0,
    projects: 0,
    resume: 0,
    certifications: 0,
    timeline: 0,
    contact: 0,
    blog: 0,
  },
  links: {
    github: 0,
    linkedin: 0,
    email: 0,
    instagram: 0,
    twitter: 0,
    website: 0,
  },
  daily: {},
};

/* -------------------------------------------------------
   📝 Blog Posts Data
------------------------------------------------------- */
const blogPostsData = [
  {
    title: "Building Scalable Web Applications with MERN Stack",
    slug: "building-scalable-web-applications-with-mern-stack",
    author: "Deepak",
    date: "2025-02-10",
    readTime: "8 min",
    tags: ["MERN", "Web Development", "Full-Stack"],
    cover: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1600&h=900&fit=crop",
    excerpt: "Learn how to build production-ready web applications using MongoDB, Express, React, and Node.js with best practices and modern patterns.",
    content: `<h2>Introduction</h2><p>The MERN stack has become one of the most popular choices for building modern web applications. In this comprehensive guide, we'll explore how to architect and build scalable applications.</p><h3>Why MERN?</h3><ul><li>Full JavaScript stack</li><li>Rich ecosystem</li><li>Great performance</li><li>Active community</li></ul><h3>Key Concepts</h3><p>We'll cover authentication, state management, API design, and deployment strategies...</p>`,
    published: true,
    likes: 42,
    views: 156,
  },
  {
    title: "AI/ML in Production: Lessons from Real Projects",
    slug: "ai-ml-in-production-lessons-from-real-projects",
    author: "Deepak",
    date: "2025-02-05",
    readTime: "10 min",
    tags: ["AI", "Machine Learning", "Production"],
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop",
    excerpt: "Deploying ML models to production is challenging. Here are the lessons I learned from building and deploying real-world AI applications.",
    content: `<h2>The Reality of ML in Production</h2><p>Moving from Jupyter notebooks to production systems requires careful planning and engineering...</p><h3>Common Challenges</h3><ul><li>Model versioning</li><li>Data drift</li><li>Scalability</li><li>Monitoring</li></ul><p>Let's dive into each challenge and explore practical solutions...</p>`,
    published: true,
    likes: 67,
    views: 234,
  },
  {
    title: "AWS Cloud Architecture: Best Practices for Startups",
    slug: "aws-cloud-architecture-best-practices-for-startups",
    author: "Deepak",
    date: "2025-01-28",
    readTime: "6 min",
    tags: ["AWS", "Cloud", "DevOps"],
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop",
    excerpt: "Setting up cloud infrastructure can be overwhelming. Here's a practical guide to AWS architecture for early-stage startups.",
    content: `<h2>Starting with AWS</h2><p>When building your startup's infrastructure on AWS, it's important to balance cost, scalability, and maintainability...</p><h3>Essential Services</h3><ul><li>EC2 for compute</li><li>RDS for databases</li><li>S3 for storage</li><li>CloudFront for CDN</li></ul><p>We'll explore how to set up each service with best practices...</p>`,
    published: true,
    likes: 38,
    views: 189,
  },
];

/* -------------------------------------------------------
   💼 LinkedIn Posts Data
------------------------------------------------------- */
const linkedInData = {
  profileName: "Deepak S",
  profileUrl: "https://linkedin.com/in/deepak-saminathan",
  profileImage: "https://media.licdn.com/dms/image/v2/D5603AQGxK7VZ8vQZJw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1734365633138?e=1742428800&v=beta&t=Zy8nCCKqNNsJKCUBLDPfOWNdDqhKqQQmPqKDcFqQdFg",
  posts: [
    {
      id: "post1",
      content: "Excited to share that our team won 1st place at the National Hackathon! 🏆 We built an AI-powered solution for sustainable agriculture using computer vision and IoT sensors. Grateful for my amazing teammates and the learning experience!",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
      link: "https://linkedin.com/posts/deepak-saminathan_hackathon-ai-innovation",
      date: "2025-02-08",
      likes: 234,
      comments: 42,
    },
    {
      id: "post2",
      content: "Just deployed my first production ML model on AWS! 🚀 The journey from Jupyter notebooks to scalable cloud infrastructure taught me so much about MLOps, monitoring, and real-world AI challenges. Here's what I learned...",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
      link: "https://linkedin.com/posts/deepak-saminathan_aws-machinelearning-mlops",
      date: "2025-01-25",
      likes: 189,
      comments: 28,
    },
    {
      id: "post3",
      content: "Leading a team of 12 developers as Team Lead for 404 Found US has been an incredible journey. From code reviews to sprint planning, every day brings new challenges and growth opportunities. Proud of what we've built together! 👥💻",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      link: "https://linkedin.com/posts/deepak-saminathan_teamwork-leadership-development",
      date: "2025-01-15",
      likes: 156,
      comments: 31,
    },
  ],
};

/* -------------------------------------------------------
   🚀 Firestore Seeder with Load Flags
------------------------------------------------------- */
async function seed() {
  try {
    let loadedCollections = [];

    // Admin credentials
    if (LOAD_FLAGS.admin) {
      await setDoc(doc(db, "admin", "credentials"), adminData);
      loadedCollections.push("admin/credentials");
    }

    // Sections visibility
    if (LOAD_FLAGS.sections) {
      await setDoc(doc(db, "sections", "visibility"), sectionsData);
      loadedCollections.push("sections/visibility");
    }

    // Profile data
    if (LOAD_FLAGS.profile) {
      await setDoc(doc(db, "portfolio", "profile"), profileData);
      loadedCollections.push("portfolio/profile");
    }

    // Resume data
    if (LOAD_FLAGS.resume) {
      await setDoc(doc(db, "resume", "data"), resumeData);
      loadedCollections.push("resume/data");
    }

    // About page
    if (LOAD_FLAGS.about) {
      await setDoc(doc(db, "aboutpage", "main"), aboutpageconfig);
      loadedCollections.push("aboutpage/main");
    }

    // Tech stack
    if (LOAD_FLAGS.techStack) {
      await setDoc(doc(db, "techStack", "categories"), { techStackData });
      loadedCollections.push("techStack/categories");
    }

    // Footer
    if (LOAD_FLAGS.footer) {
      await setDoc(doc(db, "footer", "details"), { footerData });
      loadedCollections.push("footer/details");
    }

    // Projects data
    if (LOAD_FLAGS.projects) {
      await setDoc(doc(db, "projects", "data"), projectsData);
      loadedCollections.push("projects/data");
    }

    // Certifications
    if (LOAD_FLAGS.certifications) {
      await setDoc(doc(db, "certifications", "data"), certificationsData);
      loadedCollections.push("certifications/data");
    }

    // ✅ TIMELINE - NEW
    if (LOAD_FLAGS.timeline) {
      await setDoc(doc(db, "timeline", "data"), timelineData);
      loadedCollections.push("timeline/data");
    }

    // Analytics
    if (LOAD_FLAGS.analytics) {
      await setDoc(doc(db, "analytics", "totals"), analyticsSeed.totals);
      await setDoc(doc(db, "analytics", "sections"), analyticsSeed.sections);
      await setDoc(doc(db, "analytics", "links"), analyticsSeed.links);
      await setDoc(doc(db, "analytics", "daily"), analyticsSeed.daily);
      loadedCollections.push("analytics/totals", "analytics/sections", "analytics/links", "analytics/daily");
    }

    // Config
    if (LOAD_FLAGS.config) {
      await setDoc(doc(db, "config", "portfolio"), { theme: "holo" });
      loadedCollections.push("config/portfolio");
    }

    // ✅ BLOG POSTS - NEW
    if (LOAD_FLAGS.blog) {
      for (const post of blogPostsData) {
        await setDoc(doc(db, "blog", post.slug), post);
        loadedCollections.push(`blog/${post.slug}`);
      }
    }

    // ✅ LINKEDIN POSTS - NEW
    if (LOAD_FLAGS.linkedin) {
      await setDoc(doc(db, "linkedin", "posts"), linkedInData);
      loadedCollections.push("linkedin/posts");
    }

    console.log("✅ Seeding completed successfully!");
    console.log("\n📦 Collections LOADED:");
    loadedCollections.forEach(col => console.log(`   ✓ ${col}`));

    const skippedCollections = Object.keys(LOAD_FLAGS).filter(key => !LOAD_FLAGS[key]);
    if (skippedCollections.length > 0) {
      console.log("\n⏭️  Collections SKIPPED:");
      skippedCollections.forEach(col => console.log(`   ✗ ${col}`));
    }

    console.log("\n🎯 Timeline Data Summary:");
    console.log(`   - ${timelineData.events.length} timeline events loaded`);
    console.log(`   - ${timelineData.stats.length} stats counters configured`);
    console.log("   - Journey spans from 2021 to 2026+");
    console.log("   - Covers: Foundation → Web Dev → College → Internships → Leadership → Hackathons → Vision");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding Firestore:", err);
    process.exit(1);
  }
}

seed();
