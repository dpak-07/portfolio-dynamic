import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Github,
  Globe,
  Linkedin,
  Mail,
  Phone,
  RotateCcw,
  Upload,
} from "lucide-react";

const STORAGE_KEY = "dynamic_resume_template_json";

const defaultResume = {
  name: "Deepak S",
  title: "B.Tech Artificial Intelligence & Data Science Student",
  location: "Chennai, India",
  phone: "+91 63690 21716",
  email: "deepakofficial0103@gmail.com",
  links: [
    { type: "linkedin", label: "deepak-saminathan", url: "https://linkedin.com/in/deepak-saminathan" },
    { type: "github", label: "dpak-07", url: "https://github.com/dpak-07" },
    { type: "portfolio", label: "deepakportfolio-0607", url: "https://deepakportfolio-0607.vercel.app" },
  ],
  objective:
    "Motivated AI and Data Science student seeking backend development or software engineering roles with opportunities to work on AI/ML projects. Passionate about building scalable systems, cloud infrastructure, and intelligent applications that solve real-world problems.",
  summary:
    "Pre-final year B.Tech AI & Data Science student with hands-on experience in backend development, cloud infrastructure (AWS EC2, S3), and AI/ML application development. Proven expertise in REST APIs, ML solutions, and enterprise-grade applications for 300+ users.",
  skills: {
    Languages: ["Python", "C", "C++", "JavaScript", "SQL", "HTML", "CSS"],
    Frameworks: ["React", "Node.js", "Flask", "Express.js"],
    "AI / ML": ["Machine Learning", "Deep Learning", "CNN", "Model Training", "PySpark"],
    Databases: ["MongoDB", "Firebase", "MySQL", "PostgreSQL"],
    "Cloud & DevOps": ["AWS (EC2, S3)", "Hostinger", "Git", "Linux"],
    Specialization: ["Backend Development", "REST API Development", "Cloud Deployment & Management"],
  },
  education: [
    {
      degree: "B.Tech - Artificial Intelligence & Data Science",
      school: "Velammal Engineering College, Chennai",
      details: "CGPA: 6.84",
    },
    {
      degree: "12th Standard",
      school: "Velammal Matric Hr Sec School, Mogappair",
      details: "68%",
    },
  ],
  experience: [
    {
      role: "Backend & Cloud Engineer",
      company: "Velammal Engineering College Official Website",
      year: "2025",
      tech: "Node.js, Backend Systems, AWS (EC2, S3), Cloud Hosting",
      bullets: [
        "Architected and deployed backend infrastructure on AWS EC2 with S3 storage for the official college website.",
        "Built and maintained Node.js backend services supporting dynamic content and administrative operations.",
        "Managed cloud deployment, server configuration, and production environment for high-availability systems.",
      ],
    },
    {
      role: "QA Examination Portal",
      company: "Velammal Engineering College",
      year: "2025",
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
      tech: "Python, AI/ML, React Native, React.js, Node.js",
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
      role: "Backend Developer Intern",
      company: "Zidio",
      year: "2025",
      bullets: [
        "Developed MERN stack applications with advanced backend functionalities and database management.",
        "Worked on REST API development, authentication systems, and production deployment workflows.",
      ],
    },
    {
      role: "Web Development Intern",
      company: "CodeSoft",
      year: "2024",
      bullets: ["Built interactive web applications including calculators, landing pages, and portfolio sites."],
    },
  ],
  certifications: [
    { name: "Full Stack Web Development", issuer: "CSC - HDFC Skill Development Center", date: "Aug 2024" },
    { name: "UI/UX Design Master Class", issuer: "Noviteck Solutions", date: "2025" },
    { name: "AI Agents with MongoDB", issuer: "MongoDB, Inc.", date: "2025" },
  ],
  achievements: [
    "Backend & Cloud Engineer for Velammal Engineering College official website.",
    "Developed production examination system serving 300+ students.",
    "Successfully deployed and managed cloud infrastructure on AWS (EC2, S3).",
    "Built scalable REST APIs handling real-time workflows and automated processing.",
  ],
};

const sampleJson = JSON.stringify(defaultResume, null, 2);

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function href(value) {
  const clean = text(value);
  if (!clean) return "";
  if (/^(https?:|mailto:|tel:)/i.test(clean)) return clean;
  return `https://${clean}`;
}

function normalizeLink(link) {
  if (typeof link === "string") {
    return { type: "portfolio", label: link, url: href(link) };
  }

  return {
    type: text(link?.type) || "portfolio",
    label: text(link?.label) || text(link?.url),
    url: href(link?.url || link?.label),
  };
}

function normalizeSkills(skills) {
  if (Array.isArray(skills)) {
    return [{ label: "Skills", items: skills.map(String).filter(Boolean) }];
  }

  if (skills && typeof skills === "object") {
    return Object.entries(skills).map(([label, items]) => ({
      label,
      items: asArray(items).map(String),
    }));
  }

  return [];
}

function normalizeEntry(item) {
  return {
    role: text(item?.role),
    company: text(item?.company),
    name: text(item?.name),
    year: text(item?.year) || [text(item?.start), text(item?.end)].filter(Boolean).join(" - "),
    tech: text(item?.tech),
    bullets: asArray(item?.bullets).map(String),
  };
}

function normalizeResume(input) {
  const data = input && typeof input === "object" ? input : {};

  return {
    name: text(data.name) || "Your Name",
    title: text(data.title),
    location: text(data.location),
    phone: text(data.phone),
    email: text(data.email),
    links: asArray(data.links).map(normalizeLink).filter((link) => link.label || link.url),
    objective: text(data.objective),
    summary: text(data.summary),
    skills: normalizeSkills(data.skills).filter((group) => group.items.length),
    education: asArray(data.education).map((item) => ({
      degree: text(item.degree),
      school: text(item.school),
      details: text(item.details),
      year: text(item.year) || [text(item.start), text(item.end)].filter(Boolean).join(" - "),
    })),
    experience: asArray(data.experience).map(normalizeEntry),
    projects: asArray(data.projects).map(normalizeEntry),
    internships: asArray(data.internships).map(normalizeEntry),
    certifications: asArray(data.certifications).map((item) => ({
      name: text(item.name),
      issuer: text(item.issuer || item.org),
      date: text(item.date || item.year),
    })),
    achievements: asArray(data.achievements).map(String),
  };
}

function getStoredJson() {
  if (typeof window === "undefined") return sampleJson;

  try {
    return window.localStorage.getItem(STORAGE_KEY) || sampleJson;
  } catch {
    return sampleJson;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fitResumeToOnePage() {
  if (typeof document === "undefined") return;
  const page = document.querySelector(".page");
  if (!page) return;

  page.style.setProperty("--print-scale", "1");
  const a4HeightPx = 1122;
  const printPaddingAllowance = 44;
  const scale = Math.min(1, (a4HeightPx - printPaddingAllowance) / page.scrollHeight);
  page.style.setProperty("--print-scale", String(Math.max(scale, 0.78)));
}

function downloadTextFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ContactIcon({ type }) {
  const iconType = String(type || "").toLowerCase();
  const Icon = iconType === "linkedin" ? Linkedin : iconType === "github" ? Github : iconType === "email" ? Mail : iconType === "phone" ? Phone : Globe;
  return (
    <span className="contact-icon" aria-hidden="true">
      <Icon size={12} strokeWidth={2.4} />
    </span>
  );
}

function SectionTitle({ children }) {
  return <div className="section-title">{children}</div>;
}

function BulletList({ items, className = "entry-bullets" }) {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function Entry({ item, project = false }) {
  const title = project ? item.name : [item.role, item.company].filter(Boolean).join(" | ");

  return (
    <div className="entry">
      <div className="entry-header">
        <div className="entry-title">{title}</div>
        {item.year && <div className="entry-year">{item.year}</div>}
      </div>
      {item.tech && <div className="entry-tech">{item.tech}</div>}
      {item.bullets.length > 0 && <BulletList items={item.bullets} />}
    </div>
  );
}

function ResumeDocument({ resume }) {
  const contacts = [
    resume.phone ? { type: "phone", label: resume.phone, url: "" } : null,
    resume.email ? { type: "email", label: resume.email, url: `mailto:${resume.email}` } : null,
    ...resume.links,
  ].filter(Boolean);

  return (
    <div className="page">
      <div className="header">
        <div className="header-name">{resume.name}</div>
        {(resume.title || resume.location) && <div className="header-sub">{[resume.title, resume.location].filter(Boolean).join(" | ")}</div>}
        <div className="header-contacts">
          {contacts.map((item, index) => (
            <div className="contact-item" key={`${item.type}-${item.label}-${index}`}>
              <ContactIcon type={item.type} />
              {item.url ? (
                <a href={item.url} target={item.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {item.label || item.url}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {(resume.objective || resume.summary) && (
        <div className="two-col">
          {resume.objective && (
            <div>
              <SectionTitle>Career Objective</SectionTitle>
              <div className="body-text">{resume.objective}</div>
            </div>
          )}
          {resume.summary && (
            <div>
              <SectionTitle>Professional Summary</SectionTitle>
              <div className="body-text">{resume.summary}</div>
            </div>
          )}
        </div>
      )}

      {resume.skills.length > 0 && (
        <>
          <SectionTitle>Skills</SectionTitle>
          <table className="skills-table">
            <tbody>
              {resume.skills.map((group) => (
                <tr key={group.label}>
                  <td>{group.label}:</td>
                  <td>{group.items.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {resume.education.length > 0 && (
        <>
          <SectionTitle>Education</SectionTitle>
          {resume.education.map((item, index) => (
            <div className="edu-row" key={`${item.degree}-${index}`}>
              <div>
                <div className="edu-degree">{item.degree || item.school}</div>
                <div className="edu-school">{[item.school, item.details].filter(Boolean).join(" | ")}</div>
              </div>
              {item.year && <div className="entry-year">{item.year}</div>}
            </div>
          ))}
        </>
      )}

      {resume.experience.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {resume.experience.map((item, index) => (
            <Entry item={item} key={`${item.role}-${index}`} />
          ))}
        </>
      )}

      {resume.projects.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          <div className="projects-grid">
            {resume.projects.map((item, index) => (
              <Entry item={item} project key={`${item.name}-${index}`} />
            ))}
          </div>
        </>
      )}

      {resume.internships.length > 0 && (
        <>
          <SectionTitle>Internships</SectionTitle>
          {resume.internships.map((item, index) => (
            <Entry item={item} key={`${item.role}-${index}`} />
          ))}
        </>
      )}

      {resume.certifications.length > 0 && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          <div className="cert-grid">
            {resume.certifications.map((cert, index) => (
              <div className="cert-card" key={`${cert.name}-${index}`}>
                <div className="cert-name">{cert.name}</div>
                {cert.issuer && <div className="cert-org">{cert.issuer}</div>}
                {cert.date && <div className="cert-date">{cert.date}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {resume.achievements.length > 0 && (
        <>
          <SectionTitle>Achievements</SectionTitle>
          <BulletList items={resume.achievements} className="ach-list" />
        </>
      )}
    </div>
  );
}

function renderHtml(resume) {
  const contact = [
    resume.phone ? `<div class="contact-item"><span class="contact-icon">TEL</span><span>${escapeHtml(resume.phone)}</span></div>` : "",
    resume.email
      ? `<div class="contact-item"><span class="contact-icon">MAIL</span><a href="mailto:${escapeHtml(resume.email)}">${escapeHtml(resume.email)}</a></div>`
      : "",
    ...resume.links.map(
      (link) =>
        `<div class="contact-item"><span class="contact-icon">${escapeHtml(link.type.toUpperCase().slice(0, 4))}</span><a href="${escapeHtml(link.url)}">${escapeHtml(link.label || link.url)}</a></div>`
    ),
  ]
    .filter(Boolean)
    .join("");

  const section = (title) => `<div class="section-title">${escapeHtml(title)}</div>`;
  const bullets = (items, className = "entry-bullets") => `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  const entry = (item, project = false) => `
    <div class="entry">
      <div class="entry-header">
        <div class="entry-title">${escapeHtml(project ? item.name : [item.role, item.company].filter(Boolean).join(" | "))}</div>
        ${item.year ? `<div class="entry-year">${escapeHtml(item.year)}</div>` : ""}
      </div>
      ${item.tech ? `<div class="entry-tech">${escapeHtml(item.tech)}</div>` : ""}
      ${item.bullets.length ? bullets(item.bullets) : ""}
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(resume.name)} - Resume</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${templateCss}</style>
</head>
<body>
<button class="dl-btn" onclick="printResume()">Download PDF</button>
<div class="page">
  <div class="header">
    <div class="header-name">${escapeHtml(resume.name)}</div>
    <div class="header-sub">${escapeHtml([resume.title, resume.location].filter(Boolean).join(" | "))}</div>
    <div class="header-contacts">${contact}</div>
  </div>
  <hr class="divider">
  <div class="two-col">
    ${resume.objective ? `<div>${section("Career Objective")}<div class="body-text">${escapeHtml(resume.objective)}</div></div>` : ""}
    ${resume.summary ? `<div>${section("Professional Summary")}<div class="body-text">${escapeHtml(resume.summary)}</div></div>` : ""}
  </div>
  ${resume.skills.length ? `${section("Skills")}<table class="skills-table"><tbody>${resume.skills.map((group) => `<tr><td>${escapeHtml(group.label)}:</td><td>${group.items.map(escapeHtml).join(", ")}</td></tr>`).join("")}</tbody></table>` : ""}
  ${resume.education.length ? `${section("Education")}${resume.education.map((item) => `<div class="edu-row"><div><div class="edu-degree">${escapeHtml(item.degree || item.school)}</div><div class="edu-school">${escapeHtml([item.school, item.details].filter(Boolean).join(" | "))}</div></div>${item.year ? `<div class="entry-year">${escapeHtml(item.year)}</div>` : ""}</div>`).join("")}` : ""}
  ${resume.experience.length ? `${section("Experience")}${resume.experience.map((item) => entry(item)).join("")}` : ""}
  ${resume.projects.length ? `${section("Projects")}<div class="projects-grid">${resume.projects.map((item) => entry(item, true)).join("")}</div>` : ""}
  ${resume.internships.length ? `${section("Internships")}${resume.internships.map((item) => entry(item)).join("")}` : ""}
  ${resume.certifications.length ? `${section("Certifications")}<div class="cert-grid">${resume.certifications.map((cert) => `<div class="cert-card"><div class="cert-name">${escapeHtml(cert.name)}</div>${cert.issuer ? `<div class="cert-org">${escapeHtml(cert.issuer)}</div>` : ""}${cert.date ? `<div class="cert-date">${escapeHtml(cert.date)}</div>` : ""}</div>`).join("")}</div>` : ""}
  ${resume.achievements.length ? `${section("Achievements")}${bullets(resume.achievements, "ach-list")}` : ""}
</div>
<script>
function fitResumeToOnePage() {
  const page = document.querySelector('.page');
  if (!page) return;
  page.style.setProperty('--print-scale', '1');
  const scale = Math.min(1, (1122 - 44) / page.scrollHeight);
  page.style.setProperty('--print-scale', String(Math.max(scale, 0.78)));
}
function printResume() {
  const btn = document.querySelector('.dl-btn');
  btn.style.display = 'none';
  fitResumeToOnePage();
  window.print();
  btn.style.display = 'flex';
}
window.addEventListener('beforeprint', fitResumeToOnePage);
window.addEventListener('afterprint', () => document.querySelector('.page')?.style.setProperty('--print-scale', '1'));
</script>
</body>
</html>`;
}

const templateCss = `
:root {
  --bg: #f2f2f2;
  --page: #ffffff;
  --text: #1a1a1a;
  --muted: #555;
  --light: #888;
  --border: #d0d0d0;
  --accent: #2d2d2d;
  --section-bar: #3a3a3a;
  --tag-bg: #ebebeb;
  --link: #2563eb;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: var(--bg);
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 11px;
  color: var(--text);
  line-height: 1.45;
}
.dl-btn {
  position: fixed;
  top: 16px;
  right: 20px;
  z-index: 1000;
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 9px 20px;
  border-radius: 4px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18);
  transition: background 0.2s, transform 0.15s;
  letter-spacing: 0.3px;
}
.dl-btn:hover { background: #111; transform: translateY(-1px); }
.page {
  width: 794px;
  min-height: 1123px;
  margin: 30px auto 50px;
  background: var(--page);
  padding: 28px 38px 28px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
}
.header { text-align: center; margin-bottom: 6px; }
.header-name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 2px;
}
.header-sub {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}
.header-contacts {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3px 14px;
  font-size: 10.5px;
  color: var(--muted);
}
.contact-item { display: flex; align-items: center; gap: 4px; }
.contact-item a { color: var(--text); text-decoration: none; font-weight: 500; }
.contact-item a:hover { color: var(--link); text-decoration: underline; }
.contact-icon { width: 12px; height: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 6px; font-weight: 700; }
.contact-icon svg { width: 12px; height: 12px; color: var(--muted); }
.divider { border: none; border-top: 2px solid var(--section-bar); margin: 7px 0 4px; }
.section-title {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--accent);
  background: var(--tag-bg);
  padding: 2px 7px;
  border-left: 3px solid var(--section-bar);
  margin-bottom: 4px;
  margin-top: 6px;
}
.body-text {
  font-size: 10.5px;
  color: var(--muted);
  text-align: justify;
  line-height: 1.5;
}
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
.skills-table { width: 100%; border-collapse: collapse; }
.skills-table tr td { padding: 1.5px 4px 1.5px 0; font-size: 10.5px; vertical-align: top; }
.skills-table tr td:first-child { font-weight: 600; color: var(--accent); width: 130px; white-space: nowrap; }
.skills-table tr td:last-child { color: var(--muted); }
.edu-row { display: flex; justify-content: space-between; align-items: flex-start; }
.edu-row + .edu-row { margin-top: 2px; }
.edu-degree { font-weight: 700; font-size: 11px; }
.edu-school { font-size: 10.5px; color: var(--muted); }
.entry { margin-bottom: 5px; }
.entry-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.entry-title { font-weight: 700; font-size: 11px; color: var(--accent); }
.entry-year {
  font-size: 10px;
  color: #fff;
  background: var(--section-bar);
  padding: 1px 7px;
  border-radius: 2px;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.entry-tech { font-size: 10px; color: var(--light); font-style: italic; margin: 1px 0 3px; }
.entry-bullets { list-style: none; margin: 0; }
.entry-bullets li {
  font-size: 10.5px;
  color: var(--muted);
  padding-left: 13px;
  position: relative;
  margin-bottom: 1.5px;
  line-height: 1.45;
}
.entry-bullets li::before {
  content: '>';
  position: absolute;
  left: 0;
  color: var(--section-bar);
  font-size: 9px;
  top: 1px;
}
.cert-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
.cert-card {
  background: var(--tag-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 5px 8px;
}
.cert-name { font-weight: 700; font-size: 10px; color: var(--accent); margin-bottom: 1px; }
.cert-org { font-size: 9.5px; color: var(--light); }
.cert-date { font-size: 9px; color: var(--light); margin-top: 2px; font-family: 'IBM Plex Mono', monospace; }
.projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 18px; }
.projects-grid .entry { margin-bottom: 5px; }
.ach-list { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
.ach-list li {
  font-size: 10.5px;
  color: var(--muted);
  padding-left: 13px;
  position: relative;
  line-height: 1.45;
}
.ach-list li::before {
  content: '*';
  position: absolute;
  left: 0;
  color: var(--section-bar);
  font-size: 8px;
  top: 2px;
}
@media print {
  @page { size: A4; margin: 0; }
  html, body {
    background: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
  }
  .dl-btn,
  .edit-toggle,
  .editor-panel { display: none !important; }
  body {
    margin: 0 !important;
    overflow: hidden !important;
  }
  .page {
    margin: 0 !important;
    box-shadow: none !important;
    padding: 14px 24px !important;
    width: 100% !important;
    min-height: unset !important;
    zoom: var(--print-scale, 0.86);
  }
  .header { margin-bottom: 5px !important; }
  .header-name { font-size: 24px !important; margin-bottom: 2px !important; }
  .header-sub { margin-bottom: 5px !important; }
  .divider { margin: 6px 0 4px !important; }
  .section-title { margin-top: 6px !important; margin-bottom: 4px !important; padding: 2px 7px !important; }
  .body-text,
  .skills-table tr td,
  .entry-bullets li,
  .ach-list li {
    font-size: 10.2px !important;
    line-height: 1.36 !important;
  }
  .entry,
  .projects-grid .entry { margin-bottom: 4px !important; }
  .entry-tech { margin: 0 0 2px !important; }
  .entry-bullets li { margin-bottom: 0 !important; }
  .cert-card { padding: 4px 7px !important; }
  .cert-grid { gap: 5px !important; }
  .ach-list { gap: 1px 3px !important; }
}`;

export default function ResumePage() {
  const [jsonText, setJsonText] = useState(getStoredJson);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorView, setEditorView] = useState("json");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");

  const parsed = useMemo(() => {
    try {
      return { resume: normalizeResume(JSON.parse(jsonText)), error: "" };
    } catch (error) {
      return { resume: normalizeResume(defaultResume), error: error.message };
    }
  }, [jsonText]);

  const html = useMemo(() => renderHtml(parsed.resume), [parsed.resume]);

  useEffect(() => {
    window.addEventListener("beforeprint", fitResumeToOnePage);
    window.addEventListener("afterprint", () => {
      document.querySelector(".page")?.style.setProperty("--print-scale", "1");
    });

    return () => {
      window.removeEventListener("beforeprint", fitResumeToOnePage);
    };
  }, []);

  function updateJson(value) {
    setJsonText(value);
    setStatus("");
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore storage errors in restricted browsing modes.
    }
  }

  function printResume() {
    fitResumeToOnePage();
    window.print();
  }

  function resetSample() {
    updateJson(sampleJson);
    setStatus("Sample resume data restored.");
  }

  async function copySample() {
    await navigator.clipboard.writeText(sampleJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function uploadJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = JSON.parse(String(reader.result || ""));
        updateJson(JSON.stringify(next, null, 2));
        setStatus(`${file.name} loaded.`);
      } catch (error) {
        setStatus(`Could not load JSON: ${error.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return (
    <>
      <Head>
        <title>{parsed.resume.name} - Resume</title>
        <meta name="description" content="Editable dynamic resume template." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <button className="dl-btn" type="button" onClick={printResume}>
        <Download size={14} strokeWidth={2.5} />
        Download PDF
      </button>

      <button className="edit-toggle" type="button" onClick={() => setEditorOpen((open) => !open)}>
        {editorOpen ? "Close Editor" : "Edit Template"}
      </button>

      {editorOpen && (
        <aside className="editor-panel" aria-label="Resume JSON editor">
          <div className="editor-header">
            <div>
              <strong>Resume Data</strong>
              <span>Change JSON and the template updates live.</span>
            </div>
            <div className="editor-actions">
              <button
                type="button"
                className={editorView === "json" ? "active-view" : ""}
                onClick={() => setEditorView("json")}
              >
                JSON
              </button>
              <button
                type="button"
                className={editorView === "preview" ? "active-view" : ""}
                onClick={() => setEditorView("preview")}
              >
                <Eye size={15} />
                Preview
              </button>
              <button type="button" onClick={copySample}>
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <label>
                <Upload size={15} />
                Upload
                <input type="file" accept="application/json,.json" onChange={uploadJson} />
              </label>
              <button type="button" onClick={resetSample}>
                <RotateCcw size={15} />
                Reset
              </button>
            </div>
          </div>

          {parsed.error ? (
            <p className="editor-error">
              <AlertCircle size={15} />
              Invalid JSON: {parsed.error}
            </p>
          ) : (
            <p className="editor-ok">
              <CheckCircle2 size={15} />
              Preview is synced.
            </p>
          )}
          {status && <p className={status.startsWith("Could not") ? "editor-error" : "editor-ok"}>{status}</p>}

          {editorView === "json" ? (
            <textarea value={jsonText} onChange={(event) => updateJson(event.target.value)} spellCheck="false" />
          ) : (
            <div className="preview-frame-wrap">
              <iframe title="Resume template preview" srcDoc={html} />
            </div>
          )}

          <button
            className="download-html"
            type="button"
            onClick={() => downloadTextFile("deepak-s-resume-template.html", html, "text/html")}
          >
            <Download size={15} />
            Download HTML
          </button>
        </aside>
      )}

      <ResumeDocument resume={parsed.resume} />

      <style jsx global>{templateCss}</style>
      <style jsx global>{`
        .edit-toggle {
          position: fixed;
          top: 16px;
          right: 164px;
          z-index: 1000;
          border: 1px solid #b8b8b8;
          border-radius: 4px;
          background: #ffffff;
          color: #1a1a1a;
          padding: 9px 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.12);
        }

        .editor-panel {
          position: fixed;
          top: 62px;
          right: 20px;
          bottom: 20px;
          z-index: 1001;
          width: min(520px, calc(100vw - 40px));
          display: flex;
          flex-direction: column;
          gap: 10px;
          border: 1px solid #cfcfcf;
          border-radius: 8px;
          background: #ffffff;
          padding: 14px;
          box-shadow: 0 18px 54px rgba(0,0,0,0.22);
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .editor-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .editor-header strong,
        .editor-header span {
          display: block;
        }

        .editor-header strong {
          color: #1a1a1a;
          font-size: 15px;
        }

        .editor-header span {
          margin-top: 2px;
          color: #555;
          font-size: 12px;
        }

        .editor-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 6px;
        }

        .editor-actions button,
        .editor-actions label,
        .download-html {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 32px;
          border: 1px solid #cfcfcf;
          border-radius: 4px;
          background: #f8f8f8;
          color: #1a1a1a;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .editor-actions .active-view {
          background: #2d2d2d;
          color: #ffffff;
          border-color: #2d2d2d;
        }

        .editor-actions input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .editor-ok,
        .editor-error {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 0;
          border-radius: 4px;
          padding: 8px 9px;
          font-size: 12px;
          line-height: 1.35;
        }

        .editor-ok {
          background: #ecfdf5;
          color: #065f46;
        }

        .editor-error {
          background: #fef2f2;
          color: #991b1b;
        }

        .editor-panel textarea {
          flex: 1;
          width: 100%;
          min-height: 260px;
          resize: none;
          border: 1px solid #cfcfcf;
          border-radius: 6px;
          background: #151515;
          color: #f4f4f4;
          padding: 12px;
          font: 12px/1.5 'IBM Plex Mono', Consolas, monospace;
          outline: none;
        }

        .editor-panel textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
        }

        .preview-frame-wrap {
          flex: 1;
          min-height: 260px;
          overflow: hidden;
          border: 1px solid #cfcfcf;
          border-radius: 6px;
          background: #f2f2f2;
        }

        .preview-frame-wrap iframe {
          width: 100%;
          height: 100%;
          min-height: 100%;
          border: 0;
          background: #f2f2f2;
        }

        .download-html {
          width: 100%;
          background: #2d2d2d;
          color: #ffffff;
          border-color: #2d2d2d;
        }

        @media (max-width: 860px) {
          .page {
            width: calc(100vw - 24px);
            min-height: auto;
            margin: 76px 12px 28px;
            padding: 24px 20px;
          }

          .two-col,
          .projects-grid,
          .cert-grid,
          .ach-list {
            grid-template-columns: 1fr;
          }

          .dl-btn {
            right: 12px;
          }

          .edit-toggle {
            left: 12px;
            right: auto;
          }

          .editor-panel {
            inset: 58px 12px 12px;
            width: auto;
          }

          .editor-header {
            flex-direction: column;
          }

          .editor-actions {
            justify-content: flex-start;
          }
        }
      `}</style>
    </>
  );
}
