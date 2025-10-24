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
    title: "Programming Languages", 
    tech: ["Python", "C", "C++", "Java", "JavaScript", "Dart", "HTML5", "CSS3", "TypeScript"] 
  },
  { 
    title: "Frontend Development", 
    tech: ["React.js", "React Native", "Flutter", "Next.js", "Tailwind CSS", "Bootstrap", "Vite"] 
  },
  { 
    title: "Backend Development", 
    tech: ["Node.js", "Express.js", "Flask", "Django", "FastAPI", "Spring Boot"] 
  },
  { 
    title: "Databases", 
    tech: ["MongoDB", "MySQL", "SQLite", "PostgreSQL", "Firebase", "Firestore"] 
  },
  { 
    title: "Cloud & DevOps", 
    tech: ["AWS EC2", "AWS S3", "Docker", "Git", "GitHub", "Linux", "Postman"] 
  },
  { 
    title: "AI & Machine Learning", 
    tech: ["TensorFlow", "PyTorch", "OpenCV", "Keras", "NumPy", "Pandas", "Scikit-learn"] 
  },
  { 
    title: "Tools", 
    tech: [ "VS Code", "Figma"] 
  },
  { 
    title: "Mobile Development", 
    tech: ["Flutter", "React Native", "Dart", "Android", "iOS"] 
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
    "Cloud & Backend": [
      {
        title: "Velammal College Website",
        desc: "Backend & Cloud Engineering",
        long: "Served as backend and cloud engineer for Velammal Engineering College website. Developed robust APIs, deployed on AWS cloud infrastructure, managed database systems, and integrated Nginx for production hosting. Ensured high availability, performance, and seamless user experience for the college platform.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQQeeY63WsZBT7i97geuaIFJAfvVVhGYRxBoUPfclR8q3SM?width=1919&height=910",
        tech: ["Flask", "MongoDB", "AWS EC2", "Nginx", "Python", "Cloud Deployment"],
        url: null,
        live: "https://velammal.edu.in/webteam",
        featured: true
      },
    ],
    "Full-Stack Applications": [
      {
        title: "Study Spark - AI Learning Platform",
        desc: "MERN Stack with Advanced AI Integration",
        long: "Comprehensive educational platform built with MERN stack featuring AI-powered teaching bot, intelligent content summarizer, interactive mind map generator, and Q&A system powered by Llama 3 model. Developed during VECT Hackelite 2025 hackathon with team collaboration. Designed to revolutionize learning experiences through cutting-edge AI capabilities.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQTpahjpGGWAQKJi1JHgIrvLAeEe2Cq3wSvr6hD4E2vmw6g?width=1919&height=908",
        tech: ["React", "Node.js", "MongoDB", "Llama 3", "Tailwind CSS", "AI Integration", "Team Project"],
        url: "https://github.com/dpak-07/STUDY_SPARK_01.git",
        live: null,
        featured: true
      },
      {
        title: "Excel Analysis Platform",
        desc: "Advanced Data Visualization & Analytics",
        long: "Sophisticated Excel analysis platform with comprehensive file handling, data history management, dynamic chart generation, and admin portal. Developed during Zidio internship with backend focus. Supports multiple file formats and provides insightful data visualizations with user-friendly interface and robust backend processing.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQSfFeJUqQbrRaqAHHi2FNMPAch0Xke5MGUcAnDndptR9MY?width=1656&height=882",
        tech: ["Node.js", "Express", "MongoDB", "Chart.js", "Multer", "Data Analytics", "Backend"],
        url: "https://github.com/dpak-07/Data-visualization-analytics-web-application",
        live: null,
        featured: true
      },
      {
        title: "Hotel Management System",
        desc: "Complete Hospitality Solution",
        long: "Full-stack hotel management system with comprehensive room booking capabilities, food ordering system, user authentication, and admin dashboard. Features real-time updates, inventory management, and complete administrative control for seamless hotel operations.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQT1xX8YHvZTS5zDGlKXn0OJAWoo311nMlQg445SrTCfLNA?width=1876&height=910",
        tech: ["Flask", "MongoDB", "HTML", "CSS", "JavaScript", "Full-Stack"],
        url: "https://github.com/dpak-07/hotel-management",
        live: null,
        featured: false
      },
    ],
    "AI/ML & Security": [
      {
        title: "Phushit - Fake Website Detection",
        desc: "Multi-Platform Security Application",
        long: "Comprehensive security application designed to detect fake websites and phishing attempts. Includes mobile app, dashboard, API, and browser extension built with cross-platform technologies. Provides real-time protection against online threats with intelligent detection algorithms and machine learning capabilities.",
        img: "",
        tech: ["Flutter", "Python", "C++", "Dart", "Machine Learning", "Security", "Cross-Platform"],
        url: "https://github.com/dpak-07/phushit",
        live: null,
        featured: true
      },
    ],
    "Blockchain & Innovation": [
      {
        title: "CredsOne - Blockchain Credential System",
        desc: "SIH 2025 Project - Team Lead",
        long: "Leading team '404 Found US' in developing innovative blockchain-based credential management system for students to securely store, share, and generate certificates. Features cryptographic verification, decentralized storage, and tamper-proof academic credentials. Selected for Smart India Hackathon 2025 with ongoing development and team coordination.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQTEXq0hGFzPTKejy5q73gosAcPzbMWtgN1UDKtZJ_IhgGE?width=1919&height=897",
        tech: ["Blockchain", "React", "Node.js", "MongoDB", "Cryptography", "Web3", "Team Leadership"],
        url: "https://github.com/dpak-07/CredsOne",
        live: null,
        featured: true
      },
    ],
    "Frontend & Tools": [
      {
        title: "Dynamic Portfolio",
        desc: "Firestore Integrated Portfolio",
        long: "Dynamic portfolio website with Firebase Firestore integration enabling real-time content updates without code changes. Features responsive design, seamless content management, and modern UI/UX for showcasing projects and achievements effectively.",
        img: "",
        tech: ["React", "Firebase", "Firestore", "CSS", "JavaScript", "Dynamic Content"],
        url: "https://github.com/dpak-07/portfolio-dynamic",
        live: null,
        featured: false
      },
      {
        title: "Interactive Calculator",
        desc: "Web-based Calculator Application",
        long: "Clean and responsive calculator application supporting basic arithmetic operations with intuitive user interface and smooth interactions. Built with pure web technologies during CodeSoft internship, demonstrating fundamental frontend development skills.",
        img: "https://1drv.ms/i/c/b09eaa48933f939d/IQTDCptRh2osS4r80EztgPyNAdgBTB4pVgFnF7sVfXggexU?width=1918&height=902",
        tech: ["HTML", "CSS", "JavaScript", "Frontend"],
        url: "https://github.com/dpak-07/CODSOFT-TASK-3-CALCULATOR-PPROJECT",
        live: null,
        featured: false
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
   🚀 Firestore Seeder
------------------------------------------------------- */
async function seed() {
  try {
    // Admin credentials
    await setDoc(doc(db, "admin", "credentials"), adminData);
    
    // Sections visibility
    await setDoc(doc(db, "sections", "visibility"), sectionsData);
    
    // Profile data
    await setDoc(doc(db, "portfolio", "profile"), profileData);
    
    // Resume data
    await setDoc(doc(db, "resume", "data"), resumeData);
    
    // About page
    await setDoc(doc(db, "aboutpage", "main"), aboutpageconfig);
    
    // Tech stack
    await setDoc(doc(db, "techStack", "categories"), { techStackData });
    
    // Footer
    await setDoc(doc(db, "footer", "details"), { footerData });
    
    // Projects data
    await setDoc(doc(db, "projects", "data"), projectsData);
    
    // Certifications
    await setDoc(doc(db, "certifications", "data"), certificationsData);
    
    // Config
    await setDoc(doc(db, "config", "portfolio"), { theme: "holo" });

    console.log("✅ All collections seeded successfully!");
    console.log("📦 Collections created:");
    console.log("   - admin/credentials");
    console.log("   - sections/visibility");
    console.log("   - portfolio/profile");
    console.log("   - resume/data");
    console.log("   - aboutpage/main");
    console.log("   - techStack/categories");
    console.log("   - footer/details");
    console.log("   - projects/data");
    console.log("   - certifications/data");
    console.log("   - config/portfolio");
    
    console.log("\n🎯 Data Highlights:");
    console.log("   - Leadership: Team Lead for 6-member '404 Found US'");
    console.log("   - 15+ comprehensive projects across multiple domains");
    console.log("   - 6+ national hackathon participations with team leadership");
    console.log("   - 2 professional internships with real-world experience");
    console.log("   - SIH 2025 project coordination and team management");
    console.log("   - Comprehensive tech stack with 50+ technologies + leadership skills");
    console.log("   - Location: Chennai, India | College: Velammal Engineering College");
    console.log("   - All real project images and certification proofs integrated");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding Firestore:", err);
    process.exit(1);
  }
}

seed();