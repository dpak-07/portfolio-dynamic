import Head from "next/head";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  FileDown,
  FileText,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Printer,
  RotateCcw,
  Upload,
} from "lucide-react";

const STORAGE_KEY = "ats_resume_builder_json";

const defaultResume = {
  name: "Deepak S",
  title: "B.Tech Artificial Intelligence & Data Science Student",
  location: "Chennai, India",
  email: "deepakofficial0103@gmail.com",
  phone: "+91 63690 21716",
  linkedinUsername: "deepak-saminathan",
  githubUsername: "dpak-07",
  portfolioUrl: "deepakportfolio-0607",
  showLinkIcons: true,
  links: [
    { type: "linkedin", label: "deepak-saminathan", url: "https://linkedin.com/in/deepak-saminathan" },
    { type: "github", label: "dpak-07", url: "https://github.com/dpak-07" },
    { type: "portfolio", label: "deepakportfolio-0607", url: "https://deepakportfolio-0607.web.app" },
  ],
  objective:
    "Motivated AI and Data Science student seeking backend development or software engineering roles with opportunities to work on AI/ML projects. Passionate about building scalable systems, cloud infrastructure, and intelligent applications that solve real-world problems.",
  summary:
    "Pre-final year B.Tech AI & Data Science student with hands-on experience in backend development, cloud infrastructure (AWS EC2, S3), and AI/ML application development. Proven expertise in REST APIs, ML solutions, and enterprise-grade applications for 300+ users.",
  skills: {
    Languages: ["Python", "C", "C++", "Java (Basic)", "JavaScript", "SQL", "HTML", "CSS"],
    Frameworks: ["React", "Node.js", "Flask", "Express.js", "Tailwind CSS"],
    "AI / ML": ["Machine Learning", "Deep Learning", "CNN", "Model Training", "PySpark"],
    Databases: ["MongoDB", "Firebase", "MySQL", "PostgreSQL"],
    "Cloud & DevOps": ["AWS (EC2, S3)", "Hostinger", "Git", "Linux"],
    Specialization: ["Backend Development", "REST API Development", "Cloud Deployment & Management"],
  },
  experience: [
    {
      company: "Velammal Engineering College Official Website",
      role: "Backend & Cloud Engineer",
      start: "2025",
      end: "",
      tech: "Node.js, Backend Systems, AWS (EC2, S3), Cloud Hosting",
      bullets: [
        "Architected and deployed backend infrastructure on AWS EC2 with S3 storage for the official college website.",
        "Built and maintained Node.js backend services supporting dynamic content and administrative operations.",
        "Managed cloud deployment, server configuration, and production environment for high-availability systems.",
      ],
    },
    {
      company: "Velammal Engineering College",
      role: "QA Examination Portal",
      start: "2025",
      end: "",
      tech: "Node.js, Express, MongoDB, AWS (EC2, S3)",
      bullets: [
        "Engineered backend infrastructure supporting 300+ concurrent students during live examinations.",
        "Implemented secure admin panel with exam scheduling, question management, and automated result generation.",
        "Deployed on AWS EC2 with S3 storage for scalable and reliable performance in production.",
      ],
    },
  ],
  projects: [
    {
      name: "Study Spark - AI Learning Platform",
      year: "2025",
      tech: "MERN Stack, Firebase, AI/ML",
      bullets: [
        "Developed AI-powered platform with automated content summarization and flashcard generation.",
        "Implemented Teach-Back AI chatbot for personalized and interactive learning experiences.",
      ],
    },
    {
      name: "AI-Powered Fake Website Detection",
      year: "2025",
      tech: "Flask, Flutter, Machine Learning (CNN)",
      bullets: [
        "Built and trained CNN-based ML model to detect fraudulent websites with real-time alerts.",
        "Integrated Flutter mobile frontend with Flask REST API backend for seamless functionality.",
      ],
    },
    {
      name: "CiviSense",
      year: "2025",
      tech: "Python, AI/ML, Civic Tech",
      bullets: [
        "Built an AI-powered civic issue detection and reporting platform for smart city use cases.",
        "Integrated real-time data processing with automated classification of public complaints.",
      ],
    },
    {
      name: "Dynamic Portfolio",
      year: "2025",
      tech: "React, Node.js, Tailwind CSS",
      bullets: [
        "Developed a fully dynamic personal portfolio with admin panel for content management and updates.",
        "Deployed on Firebase Hosting for seamless deployment and scaling.",
      ],
    },
  ],
  internships: [
    {
      company: "Zidio",
      role: "Backend Developer Intern",
      year: "2025",
      bullets: [
        "Developed MERN stack applications with advanced backend functionalities and database management.",
        "Worked on REST API development, authentication systems, and production deployment workflows.",
      ],
    },
    {
      company: "CodeSoft",
      role: "Web Development Intern",
      year: "2024",
      bullets: ["Built interactive web applications including calculators, landing pages, and portfolio sites."],
    },
  ],
  education: [
    {
      school: "Velammal Engineering College",
      degree: "B.Tech - Artificial Intelligence & Data Science",
      location: "Chennai",
      details: "CGPA: 7.10",
    },
  ],
  certifications: [
    { name: "Full Stack Web Development", issuer: "CSC - HDFC Skill Development Center", year: "Aug 2024" },
    { name: "UI/UX Design Master Class", issuer: "Noviteck Solutions", year: "2025" },
    { name: "AI Agents with MongoDB", issuer: "MongoDB, Inc.", year: "2025" },
  ],
  achievements: [
    "Backend & Cloud Engineer for Velammal Engineering College official website.",
    "Developed production examination system serving 300+ students.",
    "Successfully deployed and managed cloud infrastructure on AWS (EC2, S3).",
    "Built scalable REST APIs handling real-time workflows and automated processing.",
  ],
};

const sampleJson = JSON.stringify(defaultResume, null, 2);

function getInitialJson() {
  if (typeof window === "undefined") return sampleJson;

  try {
    return window.localStorage.getItem(STORAGE_KEY) || sampleJson;
  } catch {
    return sampleJson;
  }
}

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function toText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function withProtocol(value) {
  const text = toText(value);
  if (!text) return "";
  if (/^https?:\/\//i.test(text) || /^mailto:/i.test(text) || /^tel:/i.test(text)) return text;
  return `https://${text}`;
}

function normalizeLink(link) {
  if (typeof link === "string") {
    return { type: "link", label: link, url: withProtocol(link) };
  }

  return {
    type: toText(link.type) || "link",
    label: toText(link.label) || toText(link.url),
    url: withProtocol(link.url || link.label),
  };
}

function getGeneratedLinks(data) {
  const generated = [];
  const linkedinUsername = toText(data.linkedinUsername);
  const githubUsername = toText(data.githubUsername);
  const portfolioUrl = toText(data.portfolioUrl);

  if (linkedinUsername) {
    generated.push({
      type: "linkedin",
      label: linkedinUsername,
      url: withProtocol(`linkedin.com/in/${linkedinUsername.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "")}`),
    });
  }

  if (githubUsername) {
    generated.push({
      type: "github",
      label: githubUsername,
      url: withProtocol(`github.com/${githubUsername.replace(/^https?:\/\/(www\.)?github\.com\//i, "")}`),
    });
  }

  if (portfolioUrl) {
    generated.push({
      type: "portfolio",
      label: portfolioUrl.replace(/^https?:\/\//i, ""),
      url: withProtocol(portfolioUrl),
    });
  }

  return generated;
}

function normalizeSkills(skills) {
  if (Array.isArray(skills)) {
    return [{ label: "", items: skills.filter(Boolean).map(String) }];
  }

  if (skills && typeof skills === "object") {
    return Object.entries(skills).map(([label, items]) => ({
      label,
      items: asArray(items).map(String),
    }));
  }

  return [];
}

function normalizeCertification(item) {
  if (typeof item === "string") {
    return { name: item, issuer: "", year: "" };
  }

  return {
    name: toText(item.name),
    issuer: toText(item.issuer),
    year: toText(item.year || item.date),
  };
}

function normalizeRoleItem(item) {
  return {
    company: toText(item.company),
    role: toText(item.role),
    location: toText(item.location),
    start: toText(item.start),
    end: toText(item.end),
    year: toText(item.year),
    tech: toText(item.tech),
    bullets: asArray(item.bullets).map(String),
  };
}

function normalizeResume(input) {
  const data = input && typeof input === "object" ? input : {};
  const links = [...getGeneratedLinks(data), ...asArray(data.links).map(normalizeLink)];
  const uniqueLinks = links.filter(
    (link, index, allLinks) =>
      (link.label || link.url) &&
      allLinks.findIndex((candidate) => candidate.type === link.type && candidate.label === link.label) === index
  );

  return {
    name: toText(data.name) || "Your Name",
    title: toText(data.title),
    location: toText(data.location),
    email: toText(data.email),
    phone: toText(data.phone),
    showLinkIcons: data.showLinkIcons !== false,
    links: uniqueLinks,
    objective: toText(data.objective),
    summary: toText(data.summary),
    skills: normalizeSkills(data.skills),
    experience: asArray(data.experience).map(normalizeRoleItem),
    projects: asArray(data.projects).map((item) => ({
      name: toText(item.name),
      tech: toText(item.tech),
      year: toText(item.year),
      bullets: asArray(item.bullets).map(String),
    })),
    internships: asArray(data.internships).map(normalizeRoleItem),
    education: asArray(data.education).map((item) => ({
      school: toText(item.school),
      degree: toText(item.degree),
      location: toText(item.location),
      details: toText(item.details),
      start: toText(item.start),
      end: toText(item.end),
    })),
    certifications: asArray(data.certifications).map(normalizeCertification),
    achievements: asArray(data.achievements).map(String),
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getLinkMark(type) {
  const normalized = String(type || "").toLowerCase();
  if (normalized === "linkedin") return "in";
  if (normalized === "github") return "GH";
  if (normalized === "portfolio" || normalized === "website") return "WEB";
  return "LINK";
}

function getLinkIcon(type) {
  const normalized = String(type || "").toLowerCase();
  if (normalized === "linkedin") return Linkedin;
  if (normalized === "github") return Github;
  if (normalized === "portfolio" || normalized === "website") return Globe;
  return Globe;
}

function getItemDate(item) {
  return item.year || [item.start, item.end].filter(Boolean).join(" - ");
}

function createResumeHtml(resume) {
  const contact = [resume.location, resume.email, resume.phone]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" | ");

  const links = resume.links
    .filter((link) => link.label || link.url)
    .map((link) => {
      const href = escapeHtml(link.url || link.label);
      const mark = resume.showLinkIcons ? `<span class="link-mark">${escapeHtml(getLinkMark(link.type))}</span> ` : "";
      return `<a href="${href}">${mark}${escapeHtml(link.label || link.url)}</a>`;
    })
    .join(" | ");

  const section = (title, body) =>
    body ? `<section><h2>${escapeHtml(title)}</h2>${body}</section>` : "";

  const bullets = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  const skills = resume.skills
    .filter((group) => group.items.length)
    .map((group) =>
      group.label
        ? `<p class="skills"><strong>${escapeHtml(group.label)}:</strong> ${group.items.map(escapeHtml).join(", ")}</p>`
        : `<p class="skills">${group.items.map(escapeHtml).join(" | ")}</p>`
    )
    .join("");

  const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(resume.name)} Resume</title>
  <style>
    @page { size: letter; margin: 0.45in; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #111827; background: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 10.2pt; line-height: 1.35; }
    main { max-width: 8.5in; margin: 0 auto; }
    h1 { margin: 0; font-size: 22pt; line-height: 1.05; text-align: center; letter-spacing: 0; text-transform: uppercase; }
    .title { margin-top: 3px; text-align: center; font-size: 10.5pt; font-weight: 700; }
    .contact { margin-top: 5px; text-align: center; font-size: 9.2pt; }
    a { color: #111827; text-decoration: none; }
    .link-mark { display: inline-block; min-width: 17px; border: 1px solid #111827; border-radius: 2px; padding: 0 2px; font-size: 6.8pt; font-weight: 700; line-height: 1.2; text-align: center; vertical-align: 1px; }
    section { margin-top: 10px; break-inside: avoid; }
    h2 { margin: 0 0 4px; border-bottom: 1px solid #111827; font-size: 10.8pt; line-height: 1.25; text-transform: uppercase; }
    h3 { margin: 0; font-size: 10.2pt; }
    p { margin: 0; }
    ul { margin: 3px 0 0 17px; padding: 0; }
    li { margin: 1px 0; }
    .row { display: flex; justify-content: space-between; gap: 16px; }
    .muted { color: #374151; }
    .item { margin-top: 6px; break-inside: avoid; }
    .skills { margin: 0; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(resume.name)}</h1>
      ${resume.title ? `<p class="title">${escapeHtml(resume.title)}</p>` : ""}
      ${contact || links ? `<p class="contact">${contact}${contact && links ? " | " : ""}${links}</p>` : ""}
    </header>
    ${section("Career Objective", resume.objective ? `<p>${escapeHtml(resume.objective)}</p>` : "")}
    ${section("Professional Summary", resume.summary ? `<p>${escapeHtml(resume.summary)}</p>` : "")}
    ${section("Skills", skills)}
    ${section(
      "Experience",
      resume.experience
        .map(
          (item) => `
          <div class="item">
            <div class="row">
              <h3>${escapeHtml(item.role)}${item.company ? `, ${escapeHtml(item.company)}` : ""}</h3>
              <strong>${escapeHtml(getItemDate(item))}</strong>
            </div>
            ${item.tech || item.location ? `<p class="muted">${escapeHtml([item.tech, item.location].filter(Boolean).join(" | "))}</p>` : ""}
            ${item.bullets.length ? bullets(item.bullets) : ""}
          </div>`
        )
        .join("")
    )}
    ${section(
      "Projects",
      resume.projects
        .map(
          (item) => `
          <div class="item">
            <div class="row">
              <h3>${escapeHtml(item.name)}</h3>
              <strong>${escapeHtml(item.year)}</strong>
            </div>
            ${item.tech ? `<p class="muted">${escapeHtml(item.tech)}</p>` : ""}
            ${item.bullets.length ? bullets(item.bullets) : ""}
          </div>`
        )
        .join("")
    )}
    ${section(
      "Internships",
      resume.internships
        .map(
          (item) => `
          <div class="item">
            <div class="row">
              <h3>${escapeHtml(item.role)}${item.company ? `, ${escapeHtml(item.company)}` : ""}</h3>
              <strong>${escapeHtml(getItemDate(item))}</strong>
            </div>
            ${item.bullets.length ? bullets(item.bullets) : ""}
          </div>`
        )
        .join("")
    )}
    ${section(
      "Education",
      resume.education
        .map(
          (item) => `
          <div class="item">
            <div class="row">
              <h3>${escapeHtml(item.degree || item.school)}</h3>
              <strong>${escapeHtml([item.start, item.end].filter(Boolean).join(" - "))}</strong>
            </div>
            ${item.school && item.degree ? `<p>${escapeHtml(item.school)}</p>` : ""}
            <p class="muted">${escapeHtml([item.location, item.details].filter(Boolean).join(" | "))}</p>
          </div>`
        )
        .join("")
    )}
    ${section(
      "Certifications",
      resume.certifications
        .map(
          (item) => `
          <div class="item">
            <div class="row">
              <h3>${escapeHtml(item.name)}</h3>
              <strong>${escapeHtml(item.year)}</strong>
            </div>
            ${item.issuer ? `<p class="muted">${escapeHtml(item.issuer)}</p>` : ""}
          </div>`
        )
        .join("")
    )}
    ${section("Achievements", resume.achievements.length ? bullets(resume.achievements) : "")}
  </main>
</body>
</html>`;

  return html.trim();
}

function downloadTextFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ResumeDocument({ resume }) {
  const contactItems = [
    resume.location ? { icon: MapPin, label: resume.location } : null,
    resume.phone ? { icon: Phone, label: resume.phone } : null,
    resume.email ? { icon: Mail, label: resume.email, href: `mailto:${resume.email}` } : null,
    ...resume.links
      .filter((link) => link.label || link.url)
      .map((link) => ({ icon: getLinkIcon(link.type), label: link.label || link.url, href: link.url })),
  ].filter(Boolean);

  return (
    <article className="resume-paper" id="resume-document">
      <header className="resume-header">
        <h1>{resume.name}</h1>
        {resume.title && <p className="resume-title">{resume.title}</p>}
        <div className="resume-contact">
          {contactItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                {resume.showLinkIcons && <Icon size={11} strokeWidth={2.4} aria-hidden="true" />}
                <span>{item.label}</span>
              </>
            );

            return item.href ? (
              <a href={item.href} key={`${item.label}-${item.href}`}>
                {content}
              </a>
            ) : (
              <span key={item.label}>{content}</span>
            );
          })}
        </div>
      </header>

      {resume.objective && (
        <section>
          <h2>Career Objective</h2>
          <p>{resume.objective}</p>
        </section>
      )}

      {resume.summary && (
        <section>
          <h2>Professional Summary</h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section>
          <h2>Skills</h2>
          {resume.skills.map((group) =>
            group.items.length ? (
              <p className="resume-skill-line" key={group.label || group.items.join("|")}>
                {group.label && <strong>{group.label}: </strong>}
                {group.items.join(group.label ? ", " : " | ")}
              </p>
            ) : null
          )}
        </section>
      )}

      {resume.experience.length > 0 && (
        <section>
          <h2>Experience</h2>
          {resume.experience.map((item, index) => (
            <div className="resume-item" key={`${item.company}-${item.role}-${index}`}>
              <div className="resume-row">
                <h3>
                  {[item.role, item.company].filter(Boolean).join(", ")}
                </h3>
                <strong>{getItemDate(item)}</strong>
              </div>
              {(item.tech || item.location) && <p className="resume-muted">{[item.tech, item.location].filter(Boolean).join(" | ")}</p>}
              {item.bullets.length > 0 && (
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.projects.length > 0 && (
        <section>
          <h2>Projects</h2>
          {resume.projects.map((item, index) => (
            <div className="resume-item" key={`${item.name}-${index}`}>
              <div className="resume-row">
                <h3>{item.name}</h3>
                <strong>{item.year}</strong>
              </div>
              {item.tech && <p className="resume-muted">{item.tech}</p>}
              {item.bullets.length > 0 && (
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.internships.length > 0 && (
        <section>
          <h2>Internships</h2>
          {resume.internships.map((item, index) => (
            <div className="resume-item" key={`${item.company}-${item.role}-${index}`}>
              <div className="resume-row">
                <h3>{[item.role, item.company].filter(Boolean).join(", ")}</h3>
                <strong>{getItemDate(item)}</strong>
              </div>
              {item.bullets.length > 0 && (
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section>
          <h2>Education</h2>
          {resume.education.map((item, index) => (
            <div className="resume-item" key={`${item.school}-${index}`}>
              <div className="resume-row">
                <h3>{item.degree || item.school}</h3>
                <strong>{[item.start, item.end].filter(Boolean).join(" - ")}</strong>
              </div>
              {item.school && item.degree && <p>{item.school}</p>}
              {(item.location || item.details) && <p className="resume-muted">{[item.location, item.details].filter(Boolean).join(" | ")}</p>}
            </div>
          ))}
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section>
          <h2>Certifications</h2>
          {resume.certifications.map((certification) => (
            <div className="resume-item" key={`${certification.name}-${certification.issuer}`}>
              <div className="resume-row">
                <h3>{certification.name}</h3>
                <strong>{certification.year}</strong>
              </div>
              {certification.issuer && <p className="resume-muted">{certification.issuer}</p>}
            </div>
          ))}
        </section>
      )}

      {resume.achievements.length > 0 && (
        <section>
          <h2>Achievements</h2>
          <ul>
            {resume.achievements.map((achievement) => (
              <li key={achievement}>{achievement}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

export default function AtsResumeBuilderPage() {
  const [jsonText, setJsonText] = useState(getInitialJson);
  const [copied, setCopied] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const parsed = useMemo(() => {
    try {
      return { resume: normalizeResume(JSON.parse(jsonText)), error: "" };
    } catch (error) {
      return { resume: normalizeResume(defaultResume), error: error.message };
    }
  }, [jsonText]);

  const resumeHtml = useMemo(() => createResumeHtml(parsed.resume), [parsed.resume]);

  const updateJson = (value) => {
    setJsonText(value);
    setUploadStatus("");
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Local storage can be unavailable in private windows.
    }
  };

  const handleDownloadHtml = () => {
    const filename = `${parsed.resume.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume"}-ats-resume.html`;
    downloadTextFile(filename, resumeHtml, "text/html");
  };

  const handleDownloadJson = () => {
    downloadTextFile("resume-data.json", jsonText, "application/json");
  };

  const handleCopySchema = async () => {
    await navigator.clipboard.writeText(sampleJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const handleUseSample = () => {
    updateJson(sampleJson);
    setUploadStatus("Sample JSON placed into the editor.");
  };

  const handleUploadJson = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      try {
        const parsedJson = JSON.parse(text);
        updateJson(JSON.stringify(parsedJson, null, 2));
        setUploadStatus(`${file.name} loaded and placed into the resume.`);
      } catch (error) {
        setUploadStatus(`Could not load ${file.name}: ${error.message}`);
      }
    };
    reader.onerror = () => {
      setUploadStatus(`Could not read ${file.name}.`);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <>
      <Head>
        <title>ATS Resume Builder | Deepak Saminathan</title>
        <meta
          name="description"
          content="A single-page ATS resume builder that renders JSON data into clean semantic HTML."
        />
      </Head>

      <main className="resume-builder-shell">
        <section className="resume-builder-toolbar" aria-label="Resume builder controls">
          <div>
            <a className="resume-home-link" href="/">
              Portfolio
            </a>
            <h1>ATS Resume Builder</h1>
            <p>
              Paste the sample JSON, upload a resume JSON file, preview a one-page resume, then download the clean HTML or print it as PDF.
            </p>
          </div>

          <div className="resume-actions">
            <button type="button" onClick={() => window.print()}>
              <Printer size={16} />
              Print PDF
            </button>
            <button type="button" onClick={handleDownloadHtml}>
              <FileDown size={16} />
              Download HTML
            </button>
            <button type="button" onClick={handleDownloadJson}>
              <Download size={16} />
              JSON
            </button>
          </div>
        </section>

        <section className="resume-builder-grid">
          <aside className="resume-editor-panel">
            <div className="resume-editor-header">
              <div>
                <FileText size={18} />
                <span>JSON Input</span>
              </div>
              <div className="resume-editor-actions">
                <label className="resume-upload-button">
                  <Upload size={16} />
                  Upload
                  <input type="file" accept="application/json,.json" onChange={handleUploadJson} />
                </label>
                <button type="button" onClick={handleCopySchema}>
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy sample"}
                </button>
              </div>
            </div>

            <div className="resume-sample-box">
              <div>
                <strong>Sample copy-paste JSON</strong>
                <span>Use this shape for your data. Paste or upload JSON and the resume below updates instantly.</span>
              </div>
              <button type="button" onClick={handleUseSample}>
                Place sample
              </button>
            </div>

            {parsed.error ? (
              <p className="resume-error">
                <AlertCircle size={16} />
                Invalid JSON: {parsed.error}
              </p>
            ) : (
              <p className="resume-valid">
                <CheckCircle2 size={16} />
                JSON is valid and preview is updated.
              </p>
            )}

            {uploadStatus && (
              <p className={uploadStatus.toLowerCase().startsWith("could not") ? "resume-error" : "resume-valid"}>
                {uploadStatus.toLowerCase().startsWith("could not") ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                {uploadStatus}
              </p>
            )}

            <textarea
              value={jsonText}
              onChange={(event) => updateJson(event.target.value)}
              spellCheck="false"
              aria-label="Resume JSON input"
            />

            <button
              type="button"
              className="resume-reset"
              onClick={handleUseSample}
            >
              <RotateCcw size={16} />
              Reset example
            </button>
          </aside>

          <section className="resume-preview-panel" aria-label="Resume preview">
            <ResumeDocument resume={parsed.resume} />
          </section>
        </section>
      </main>

      <style jsx global>{`
        body {
          background: #eef2f7;
          color: #111827;
        }

        .resume-builder-shell {
          min-height: 100vh;
          padding: 24px;
          font-family: Inter, Arial, Helvetica, sans-serif;
        }

        .resume-builder-toolbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          max-width: 1440px;
          margin: 0 auto 18px;
        }

        .resume-home-link {
          display: inline-flex;
          margin-bottom: 8px;
          color: #0f766e;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .resume-builder-toolbar h1 {
          margin: 0;
          color: #0f172a;
          font-size: 32px;
          line-height: 1.1;
          letter-spacing: 0;
        }

        .resume-builder-toolbar p {
          max-width: 620px;
          margin: 8px 0 0;
          color: #475569;
          font-size: 14px;
        }

        .resume-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .resume-actions button,
        .resume-editor-actions button,
        .resume-upload-button,
        .resume-sample-box button,
        .resume-reset {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 38px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
          color: #0f172a;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .resume-actions button:first-child {
          border-color: #0f766e;
          background: #0f766e;
          color: #ffffff;
        }

        .resume-builder-grid {
          display: grid;
          grid-template-columns: minmax(340px, 0.48fr) minmax(0, 1fr);
          gap: 18px;
          max-width: 1440px;
          margin: 0 auto;
          align-items: start;
        }

        .resume-editor-panel,
        .resume-preview-panel {
          border: 1px solid #d5dde8;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
        }

        .resume-editor-panel {
          position: sticky;
          top: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
        }

        .resume-editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .resume-editor-header > div:first-child {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
        }

        .resume-editor-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .resume-upload-button {
          position: relative;
          overflow: hidden;
        }

        .resume-upload-button input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .resume-sample-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          background: #eff6ff;
          padding: 10px;
        }

        .resume-sample-box div {
          min-width: 0;
        }

        .resume-sample-box strong,
        .resume-sample-box span {
          display: block;
        }

        .resume-sample-box strong {
          color: #1e3a8a;
          font-size: 13px;
          line-height: 1.25;
        }

        .resume-sample-box span {
          margin-top: 2px;
          color: #1e40af;
          font-size: 12px;
          line-height: 1.35;
        }

        .resume-error,
        .resume-valid {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 0;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 12px;
          line-height: 1.35;
        }

        .resume-error {
          background: #fef2f2;
          color: #991b1b;
        }

        .resume-valid {
          background: #ecfdf5;
          color: #065f46;
        }

        .resume-editor-panel textarea {
          width: 100%;
          min-height: 68vh;
          resize: vertical;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #0f172a;
          color: #e2e8f0;
          padding: 14px;
          font: 12.5px/1.55 Consolas, "Liberation Mono", monospace;
          outline: none;
        }

        .resume-editor-panel textarea:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
        }

        .resume-reset {
          width: 100%;
        }

        .resume-preview-panel {
          overflow: auto;
          padding: 26px;
        }

        .resume-paper {
          width: min(100%, 8.5in);
          min-height: 11in;
          margin: 0 auto;
          padding: 0.45in;
          background: #ffffff;
          color: #111827;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10.2pt;
          line-height: 1.35;
          box-shadow: 0 0 0 1px #e5e7eb, 0 18px 48px rgba(15, 23, 42, 0.12);
        }

        .resume-paper * {
          box-sizing: border-box;
        }

        .resume-header {
          text-align: center;
        }

        .resume-paper h1 {
          margin: 0;
          color: #111827;
          font-size: 22pt;
          line-height: 1.05;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .resume-title {
          margin: 3px 0 0;
          font-weight: 700;
          font-size: 10.5pt;
        }

        .resume-contact {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 3px 10px;
          margin: 5px 0 0;
          font-size: 9.2pt;
        }

        .resume-contact a,
        .resume-contact span {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #111827;
          text-decoration: none;
        }

        .resume-contact svg {
          flex: 0 0 auto;
        }

        .resume-paper section {
          margin-top: 10px;
          break-inside: avoid;
        }

        .resume-skill-line + .resume-skill-line {
          margin-top: 1px;
        }

        .resume-paper h2 {
          margin: 0 0 4px;
          border-bottom: 1px solid #111827;
          color: #111827;
          font-size: 10.8pt;
          line-height: 1.25;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .resume-paper h3 {
          margin: 0;
          color: #111827;
          font-size: 10.2pt;
          line-height: 1.3;
        }

        .resume-paper p {
          margin: 0;
        }

        .resume-paper ul {
          margin: 3px 0 0 17px;
          padding: 0;
        }

        .resume-paper li {
          margin: 1px 0;
        }

        .resume-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .resume-row strong {
          flex: 0 0 auto;
          font-size: 9.5pt;
          white-space: nowrap;
        }

        .resume-muted {
          color: #374151;
        }

        .resume-item {
          margin-top: 6px;
          break-inside: avoid;
        }

        @media (max-width: 980px) {
          .resume-builder-shell {
            padding: 16px;
          }

          .resume-builder-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .resume-actions {
            justify-content: flex-start;
          }

          .resume-builder-grid {
            grid-template-columns: 1fr;
          }

          .resume-editor-panel {
            position: static;
          }

          .resume-editor-header,
          .resume-sample-box {
            align-items: stretch;
            flex-direction: column;
          }

          .resume-editor-actions,
          .resume-sample-box button {
            width: 100%;
          }

          .resume-editor-actions button,
          .resume-upload-button {
            flex: 1;
          }

          .resume-editor-panel textarea {
            min-height: 430px;
          }

          .resume-preview-panel {
            padding: 12px;
          }

          .resume-paper {
            padding: 0.3in;
          }
        }

        @media print {
          body {
            background: #ffffff;
          }

          .resume-builder-toolbar,
          .resume-editor-panel {
            display: none !important;
          }

          .resume-builder-shell,
          .resume-builder-grid,
          .resume-preview-panel {
            display: block;
            width: auto;
            max-width: none;
            margin: 0;
            padding: 0;
            border: 0;
            box-shadow: none;
            background: #ffffff;
            overflow: visible;
          }

          .resume-paper {
            width: auto;
            min-height: 0;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
        }
      `}</style>
    </>
  );
}
